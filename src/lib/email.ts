import nodemailer from "nodemailer";
import { site } from "@/lib/site";

/**
 * Email notification helper. Uses Nodemailer with SMTP.
 *
 * To enable email notifications, set these in your .env:
 *   SMTP_HOST=smtp.gmail.com
 *   SMTP_PORT=587
 *   SMTP_USER=hamzasghaffari@gmail.com
 *   SMTP_PASS=your-app-password   (NOT your regular Gmail password — see below)
 *
 * For Gmail, you need an "App Password":
 *   1. Go to myaccount.google.com → Security
 *   2. Enable 2-Step Verification (if not already)
 *   3. Search "App passwords" → create one for "Mail"
 *   4. Paste the 16-char password into SMTP_PASS
 *
 * If SMTP isn't configured, emails are silently skipped so the site
 * still works — comments and contact messages are always saved to the DB.
 */

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: (Number(SMTP_PORT) || 587) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  return transporter;
}

/** True if SMTP is configured (so emails will actually be sent). */
export function emailConfigured(): boolean {
  return getTransporter() !== null;
}

/**
 * Strips CR/LF characters from a string to prevent email header injection
 * (CRLF smuggling). User-controlled data that flows into the subject line
 * or other headers MUST be passed through this.
 */
function stripCRLF(value: string): string {
  return value.replace(/[\r\n]/g, " ");
}

type Notification = {
  subject: string;
  /** Plain-text body of the email. */
  text: string;
};

/**
 * Sends a notification email to the site owner. Silently skips if SMTP
 * isn't configured — callers don't need to handle errors.
 */
export async function notifyOwner({ subject, text }: Notification): Promise<void> {
  const transport = getTransporter();
  if (!transport) {
    console.log("[email] SMTP not configured — skipping notification:", subject);
    return;
  }

  const from = process.env.SMTP_USER ?? site.email;

  try {
    await transport.sendMail({
      from: `"${site.name} Portfolio" <${from}>`,
      to: site.email,
      subject: `[Portfolio] ${stripCRLF(subject)}`,
      text,
    });
  } catch (err) {
    // Log but never throw — a failed email shouldn't break the user's action.
    console.error("[email] failed to send:", err);
  }
}
