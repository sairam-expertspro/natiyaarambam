import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { getDbPool } from "@/lib/db";
import { getMailTransporter } from "@/lib/mail";
import {
  CONTACT_LEVELS,
  formatPhoneDisplay,
  normalizeText,
  type ContactFormInput,
  validateContactForm,
} from "@/lib/contact-form";

const TABLE_NAME = "contact_messages";

type ContactMessageRow = RowDataPacket & {
  id: number;
  name: string;
  age: number | null;
  phone: string | null;
  email: string | null;
  level: string | null;
  guardian: string | null;
  message: string | null;
  status: "new" | "read" | "replied";
  source: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: Date | string;
  updated_at: Date | string;
};

type ContactMessageStatsRow = RowDataPacket & {
  total: number;
  newCount: number;
  readCount: number;
  repliedCount: number;
};

let schemaReady: Promise<void> | null = null;

async function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const pool = getDbPool();
      await pool.query(`
        CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
          id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(120) NOT NULL,
          age TINYINT UNSIGNED NULL,
          phone VARCHAR(32) NULL,
          email VARCHAR(255) NULL,
          level VARCHAR(100) NOT NULL,
          guardian VARCHAR(120) NULL,
          message TEXT NOT NULL,
          status ENUM('new', 'read', 'replied') NOT NULL DEFAULT 'new',
          source VARCHAR(50) NOT NULL DEFAULT 'contact',
          ip_address VARCHAR(45) NULL,
          user_agent VARCHAR(255) NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_${TABLE_NAME}_status_created_at (status, created_at),
          INDEX idx_${TABLE_NAME}_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
    })();
  }

  return schemaReady;
}

export type ContactSubmission = {
  name: string;
  age: number | null;
  phone: string | null;
  email: string | null;
  level: string;
  guardian: string;
  message: string;
  source: string;
  status: "new" | "read" | "replied";
  ipAddress: string | null;
  userAgent: string | null;
};

function formatSubmittedAt(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export async function createContactSubmission(input: ContactFormInput, meta: { ipAddress: string | null; userAgent: string | null }) {
  const validation = validateContactForm(input);
  if (Object.keys(validation.errors).length > 0) {
    return { ok: false as const, errors: validation.errors };
  }

  const pool = getDbPool();
  await ensureSchema();

  const age = validation.values.age ? Number(validation.values.age) : null;
  const phone = validation.values.phone || null;
  const email = validation.values.email || null;
  const level = validation.values.level || CONTACT_LEVELS[0];
  const guardian = validation.values.guardian || "";
  const message = validation.values.aspirations || "";

  const [insertResult] = await pool.query<ResultSetHeader>(
    `INSERT INTO ${TABLE_NAME}
      (name, age, phone, email, level, guardian, message, status, source, ip_address, user_agent)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'new', 'contact', ?, ?)`,
    [
      validation.values.name,
      age,
      phone,
      email,
      level,
      guardian || null,
      message,
      meta.ipAddress,
      meta.userAgent,
    ],
  );

  return {
    ok: true as const,
    id: insertResult.insertId,
    submission: {
      name: validation.values.name,
      age,
      phone,
      email,
      level,
      guardian,
      message,
      source: "contact",
      status: "new" as const,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    } satisfies ContactSubmission,
  };
}

export async function sendContactNotification(submission: ContactSubmission) {
  const notifyTo =
    process.env.CONTACT_NOTIFY_EMAIL ||
    process.env.ENROLL_NOTIFY_EMAIL ||
    process.env.LEAD_EMAIL_TO ||
    "natyaarambham@gmail.com";
  const fromAddress =
    process.env.CONTACT_FROM_EMAIL ||
    process.env.ZEPTOMAIL_FROM_EMAIL ||
    process.env.ZEPTOMAIL_FROM ||
    "Natyaarambham Support Team <natyaarambham@gmail.com>";

  if (!notifyTo || !fromAddress) {
    return { ok: false as const, skipped: true };
  }

  const transporter = getMailTransporter();
  const submittedAt = formatSubmittedAt(new Date());
  const from = fromAddress;

  if (submission.email) {
    await transporter.sendMail({
      from,
      to: submission.email,
      subject: "Thank you for contacting Natyaarambham Dance Academy",
      text: [
        `Dear ${submission.name},`,
        "",
        "Thank you for reaching out to Natyaarambham Dance Academy. We have received your enquiry and our team will review the details promptly.",
        "",
        "One of our representatives will connect with you shortly to provide the necessary information and guidance. You can expect a response within 2 business days.",
        "",
        "We appreciate your interest in Natyaarambham and look forward to supporting your dance journey.",
        "",
        "Best Regards,",
        "Team Natyaarambham",
      ].join("\n"),
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#2e2a24">
          <p>Dear ${escapeHtml(submission.name)},</p>
          <p>Thank you for reaching out to Natyaarambham Dance Academy. We have received your enquiry and our team will review the details promptly.</p>
          <p>One of our representatives will connect with you shortly to provide the necessary information and guidance. You can expect a response within 2 business days.</p>
          <p>We appreciate your interest in Natyaarambham and look forward to supporting your dance journey.</p>
          <p>Best Regards,<br />Team Natyaarambham</p>
        </div>
      `,
    });
  }

  await transporter.sendMail({
    from,
    to: notifyTo,
    replyTo: submission.email || undefined,
    subject: "New Enquiry Submitted via Natyaarambham Website",
    text: [
      "Dear Team,",
      "",
      "A new enquiry has been submitted through the Natyaarambham website. Details are as follows:",
      "",
      `- Name: ${submission.name}`,
      `- Age: ${submission.age ?? "-"}`,
      `- Phone: ${submission.phone ? formatPhoneDisplay(submission.phone) : "-"}`,
      `- Email: ${submission.email ?? "-"}`,
      `- Experience: ${submission.level || "-"}`,
      `- Parent: ${submission.guardian || "-"}`,
      `- Aspiration: ${submission.message || "-"}`,
      `- Submitted at: ${submittedAt}`,
      "",
      "Kindly review the enquiry and assign it to the appropriate representative/instructor to ensure timely follow-up.",
      "",
      "Best Regards,",
      "Natyaarambam Website Notification System",
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#2e2a24">
        <p>Dear Team,</p>
        <p>A new enquiry has been submitted through the Natyaarambam website. Details are as follows:</p>
        <ul>
          <li><strong>Name:</strong> ${escapeHtml(submission.name)}</li>
          <li><strong>Age:</strong> ${submission.age ?? "-"}</li>
          <li><strong>Phone:</strong> ${submission.phone ? escapeHtml(formatPhoneDisplay(submission.phone)) : "-"}</li>
          <li><strong>Email:</strong> ${submission.email ? escapeHtml(submission.email) : "-"}</li>
          <li><strong>Experience:</strong> ${escapeHtml(submission.level || "-")}</li>
          <li><strong>Parent:</strong> ${submission.guardian ? escapeHtml(submission.guardian) : "-"}</li>
          <li><strong>Aspiration:</strong> ${submission.message ? escapeHtml(submission.message).replace(/\n/g, "<br>") : "-"}</li>
          <li><strong>Submitted at:</strong> ${escapeHtml(submittedAt)}</li>
        </ul>
        <p>Kindly review the enquiry and assign it to the appropriate representative/instructor to ensure timely follow-up.</p>
        <p>Best Regards,<br />Natyaarambam Website Notification System</p>
      </div>
    `,
  });

  return { ok: true as const, skipped: false };
}

export async function listContactSubmissions(options?: { status?: string; search?: string; limit?: number }) {
  await ensureSchema();
  const pool = getDbPool();

  const status = normalizeText(options?.status || "");
  const search = normalizeText(options?.search || "");
  const limit = Math.min(Math.max(options?.limit ?? 100, 1), 200);

  const clauses: string[] = [];
  const params: Array<string | number> = [];

  if (status && status !== "all") {
    clauses.push("status = ?");
    params.push(status);
  }

  if (search) {
    clauses.push("(name LIKE ? OR email LIKE ? OR phone LIKE ? OR message LIKE ? OR guardian LIKE ?)");
    const term = `%${search}%`;
    params.push(term, term, term, term, term);
  }

  const whereClause = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";
  const [rows] = await pool.query<ContactMessageRow[]>(
    `
      SELECT id, name, age, phone, email, level, guardian, message, status, source, ip_address, user_agent, created_at, updated_at
      FROM ${TABLE_NAME}
      ${whereClause}
      ORDER BY created_at DESC, id DESC
      LIMIT ?
    `,
    [...params, limit],
  );

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    age: row.age,
    phone: row.phone,
    email: row.email,
    level: row.level,
    guardian: row.guardian,
    message: row.message,
    status: row.status,
    source: row.source,
    ipAddress: row.ip_address,
    userAgent: row.user_agent,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export async function getContactStats() {
  await ensureSchema();
  const pool = getDbPool();
  const [rows] = await pool.query<ContactMessageStatsRow[]>(
    `
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) AS newCount,
        SUM(CASE WHEN status = 'read' THEN 1 ELSE 0 END) AS readCount,
        SUM(CASE WHEN status = 'replied' THEN 1 ELSE 0 END) AS repliedCount
      FROM ${TABLE_NAME}
    `,
  );
  const stats = rows[0];
  return {
    total: Number(stats?.total ?? 0),
    newCount: Number(stats?.newCount ?? 0),
    readCount: Number(stats?.readCount ?? 0),
    repliedCount: Number(stats?.repliedCount ?? 0),
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
