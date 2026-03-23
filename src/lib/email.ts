import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM_EMAIL = process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@linkist.vip";

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string
): Promise<void> {
  await transporter.sendMail({
    from: `"Linkist" <${FROM_EMAIL}>`,
    to,
    subject: "Reset your Linkist password",
    text: `You requested a password reset. Click this link to set a new password:\n\n${resetUrl}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, you can ignore this email.`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #1e1e2e; margin-bottom: 16px;">Reset your password</h2>
        <p style="color: #444; line-height: 1.6;">You requested a password reset for your Linkist account.</p>
        <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #9333ea, #ec4899); color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; margin: 16px 0;">Reset Password</a>
        <p style="color: #888; font-size: 14px; margin-top: 16px;">This link expires in 1 hour.</p>
        <p style="color: #888; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #aaa; font-size: 12px;">Linkist — linkist.vip</p>
      </div>
    `,
  });
}
