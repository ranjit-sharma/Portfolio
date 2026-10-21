const nodemailer = require('nodemailer');

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });

  return transporter;
};

const sendContactEmail = async ({ name, email, subject, message }) => {
  const t = getTransporter();
  if (!t) {
    console.log('ℹ️  SMTP not configured — skipping contact email delivery');
    return;
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message);

  const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || process.env.SMTP_USER;
  const fromEmail = process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER;

  await t.sendMail({
    from: `"Portfolio Contact" <${fromEmail}>`,
    to: receiverEmail,
    replyTo: email,
    subject: `[Portfolio Contact] ${safeSubject}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;">
        <h2 style="color:#111">New Contact Message</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
        <p><strong>Subject:</strong> ${safeSubject}</p>
        <hr/>
        <p style="white-space:pre-wrap;">${safeMessage}</p>
      </div>
    `,
  });
};

module.exports = { sendContactEmail };
