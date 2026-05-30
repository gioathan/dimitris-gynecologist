import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  reason: z.string().optional(),
  message: z.string().min(10),
  recaptchaToken: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Μη έγκυρα δεδομένα φόρμας." }, { status: 400 });
  }

  const { name, email, reason, message, recaptchaToken } = parsed.data;

  const captchaRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: process.env.RECAPTCHA_SECRET_KEY ?? "",
      response: recaptchaToken,
    }),
  });
  const captchaJson = await captchaRes.json() as { success: boolean; score: number };
  if (!captchaJson.success || captchaJson.score < 0.5) {
    return NextResponse.json({ error: "Αποτυχία επαλήθευσης reCAPTCHA." }, { status: 400 });
  }
  const to = process.env.CONTACT_EMAIL_TO ?? "";

  try {
    await resend.emails.send({
      from: process.env.CONTACT_EMAIL_FROM ?? "Ιατρείο <onboarding@resend.dev>",
      to,
      replyTo: email,
      subject: `Νέο μήνυμα από ${name}${reason ? ` — ${reason}` : ""}`,
      html: `
        <h2>Νέο μήνυμα επικοινωνίας</h2>
        <p><strong>Όνομα:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${reason ? `<p><strong>Λόγος:</strong> ${reason}</p>` : ""}
        <p><strong>Μήνυμα:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Αποτυχία αποστολής. Δοκιμάστε ξανά." }, { status: 500 });
  }
}
