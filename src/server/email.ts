import "server-only";

type Email = { to: string; subject: string; html: string; text: string };

const DEFAULT_FROM = "NextShop <onboarding@resend.dev>";

/**
 * Sends through Resend when RESEND_API_KEY is set; otherwise logs the email so
 * development works with no account. Never throws: a failed email must not
 * break checkout or an admin action.
 */
export async function sendEmail({ to, subject, html, text }: Email): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(`[email:dev] To: ${to} | Subject: ${subject}\n${text}\n`);
    return true;
  }

  try {
    const res = await fetch(process.env.RESEND_API_URL ?? "https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env.EMAIL_FROM ?? DEFAULT_FROM, to: [to], subject, html, text }),
    });
    if (!res.ok) {
      console.error("Email provider rejected the message", res.status, await res.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (error) {
    console.error("Could not send email", error);
    return false;
  }
}
