// utils/email.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail', // or use SMTP config
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"Airport Transfers" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};
