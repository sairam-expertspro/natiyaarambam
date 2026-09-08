import { NextResponse } from "next/server";
import { createContactSubmission, sendContactNotification } from "@/lib/contact-submissions";

export const runtime = "nodejs";

function getRequestIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() || null;
  return request.headers.get("x-real-ip")?.trim() || null;
}

function isValidOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  return origin === new URL(request.url).origin;
}

async function verifyRecaptcha(token: string, remoteIp: string | null) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    throw new Error("Google reCAPTCHA is not configured.");
  }

  const verifyUrl = "https://www.google.com/recaptcha/api/siteverify";
  const body = new URLSearchParams({
    secret,
    response: token,
  });

  if (remoteIp) {
    body.set("remoteip", remoteIp);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(verifyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error("Unable to verify reCAPTCHA.");
    }

    const data = (await response.json()) as { success?: boolean; ["error-codes"]?: string[] };
    if (!data.success) {
      throw new Error("Please complete the reCAPTCHA challenge and try again.");
    }
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(request: Request) {
  if (!isValidOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const input = (body ?? {}) as Record<string, unknown>;
  const recaptchaToken = typeof input.recaptchaToken === "string" ? input.recaptchaToken.trim() : "";

  try {
    await verifyRecaptcha(recaptchaToken, getRequestIp(request));
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Please complete the reCAPTCHA challenge and try again.",
      },
      { status: 400 },
    );
  }

  const result = await createContactSubmission(
    {
      name: typeof input.name === "string" ? input.name : "",
      age: typeof input.age === "string" ? input.age : "",
      phone: typeof input.phone === "string" ? input.phone : "",
      email: typeof input.email === "string" ? input.email : "",
      level: typeof input.level === "string" ? input.level : "",
      guardian: typeof input.guardian === "string" ? input.guardian : "",
      aspirations: typeof input.aspirations === "string" ? input.aspirations : "",
      trap: typeof input.trap === "string" ? input.trap : "",
      startedAt: typeof input.startedAt === "string" ? input.startedAt : "",
      recaptchaToken,
    },
    {
      ipAddress: getRequestIp(request),
      userAgent: request.headers.get("user-agent"),
    },
  );

  if (!result.ok) {
    const firstError = Object.values(result.errors).find(Boolean);
    return NextResponse.json(
      {
        error: firstError || "Please review the highlighted fields and try again.",
        fieldErrors: result.errors,
      },
      { status: 400 },
    );
  }

  try {
    await sendContactNotification(result.submission);
  } catch (err) {
    console.error("Contact notification email failed:", err);
  }

  return NextResponse.json({ ok: true, message: "Thanks. Your message has been received." }, { status: 201 });
}
