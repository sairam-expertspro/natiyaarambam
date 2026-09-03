import { NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";
import { getMailTransporter } from "@/lib/mail";

type EnrollPayload = {
  name: string;
  age: number | null;
  phone: string | null;
  email: string | null;
  level: string;
  guardian: string;
  aspirations: string;
};

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const input = (body ?? {}) as Record<string, unknown>;

  const name = asString(input.name);
  const phone = asString(input.phone);
  const email = asString(input.email);
  const ageRaw = asString(input.age);

  if (!name) {
    return NextResponse.json({ error: "Please enter the student's name." }, { status: 400 });
  }
  if (!phone && !email) {
    return NextResponse.json({ error: "Add a phone number or email so we can reply." }, { status: 400 });
  }

  const payload: EnrollPayload = {
    name,
    age: ageRaw && !Number.isNaN(Number(ageRaw)) ? Number(ageRaw) : null,
    phone: phone || null,
    email: email || null,
    level: asString(input.level),
    guardian: asString(input.guardian),
    aspirations: asString(input.aspirations),
  };

  try {
    const pool = getDbPool();
    await pool.query(
      `CREATE TABLE IF NOT EXISTS enrollments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        age INT NULL,
        phone VARCHAR(50) NULL,
        email VARCHAR(255) NULL,
        level VARCHAR(100) NULL,
        guardian VARCHAR(255) NULL,
        aspirations TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
    );
    await pool.query(
      `INSERT INTO enrollments (name, age, phone, email, level, guardian, aspirations) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [payload.name, payload.age, payload.phone, payload.email, payload.level, payload.guardian, payload.aspirations],
    );
  } catch (err) {
    console.error("Enroll DB insert failed:", err);
    return NextResponse.json(
      { error: "Something went wrong saving your enrollment. Please try again." },
      { status: 500 },
    );
  }

  try {
    const notifyTo = process.env.ENROLL_NOTIFY_EMAIL || process.env.LEAD_EMAIL_TO;
    const fromAddress = process.env.ZEPTOMAIL_FROM_EMAIL || process.env.ZEPTOMAIL_FROM;

    if (notifyTo && fromAddress) {
      const transporter = getMailTransporter();
      await transporter.sendMail({
        from: fromAddress,
        to: notifyTo,
        replyTo: payload.email || undefined,
        subject: `New Enrollment Request - ${payload.name}`,
        text: [
          `Name: ${payload.name}`,
          `Age: ${payload.age ?? "-"}`,
          `Phone: ${payload.phone ?? "-"}`,
          `Email: ${payload.email ?? "-"}`,
          `Level: ${payload.level || "-"}`,
          `Guardian: ${payload.guardian || "-"}`,
          `Aspirations: ${payload.aspirations || "-"}`,
        ].join("\n"),
      });
    }
  } catch (err) {
    console.error("Enroll notification email failed:", err);
  }

  return NextResponse.json({ ok: true });
}
