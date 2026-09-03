import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

export function getMailTransporter() {
  if (!transporter) {
    const { ZEPTOMAIL_HOST, ZEPTOMAIL_PORT, ZEPTOMAIL_API_USER, ZEPTOMAIL_API_KEY } = process.env;

    if (!ZEPTOMAIL_HOST || !ZEPTOMAIL_PORT || !ZEPTOMAIL_API_USER || !ZEPTOMAIL_API_KEY) {
      throw new Error(
        "Missing ZeptoMail environment variables. Set ZEPTOMAIL_HOST, ZEPTOMAIL_PORT, ZEPTOMAIL_API_USER, and ZEPTOMAIL_API_KEY.",
      );
    }

    transporter = nodemailer.createTransport({
      host: ZEPTOMAIL_HOST,
      port: Number(ZEPTOMAIL_PORT),
      secure: false,
      auth: {
        user: ZEPTOMAIL_API_USER,
        pass: ZEPTOMAIL_API_KEY,
      },
    });
  }

  return transporter;
}
