import nodemailer from "nodemailer";

export async function sendViaSmtp({ smtp, from, to, subject, html, text }) {
  const transport = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: {
      user: smtp.user,
      pass: smtp.pass,
    },
  });

  await transport.sendMail({
    from: `${from.name} <${from.email}>`,
    to,
    subject,
    html,
    text,
  });

  return { ok: true, method: "smtp" };
}
