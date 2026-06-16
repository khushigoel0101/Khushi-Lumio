
import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_SMTP_PASS,
    },
  });

  const recipients = Array.isArray(to) ? to.join(", ") : to;

  await transporter.sendMail({
  from: `"AI Notes" <${process.env.BREVO_SENDER_EMAIL}>`, // must be your validated sender
  to: recipients,
  subject,
  text,
});

};
