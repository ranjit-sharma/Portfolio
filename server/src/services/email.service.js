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

const sendContactEmail = async ({ name, email, subject, message, toEmail }) => {
  // Destination email: ONLY use profile email. If not set, do not send to any fallback email.
  const receiverEmail = toEmail ? toEmail.trim() : null;
  if (!receiverEmail) {
    return { success: false, reason: 'no_recipient' };
  }

  const t = getTransporter();
  if (t) {
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message);

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
    return { success: true, provider: 'smtp' };
  }

  // If SMTP is not configured, deliver email via FormSubmit API to the admin's setting email
  try {
    const siteUrl = process.env.CLIENT_URL || 'https://ranjitsharma.dev';
    const fsRes = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(receiverEmail)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': siteUrl,
        'Referer': `${siteUrl}/`,
      },
      body: JSON.stringify({
        name,
        email,
        subject,
        message,
        _subject: `New Portfolio Message from ${name}: ${subject}`,
        _template: 'table',
        _captcha: 'false',
      }),
    });

    const fsData = await fsRes.json().catch(() => ({}));
    if (fsRes.ok && (String(fsData.success) === 'true' || fsData.message?.includes('Activation'))) {
      console.log(`✅ Contact notification email sent to ${receiverEmail} via FormSubmit`);
      return { success: true, provider: 'formsubmit', data: fsData };
    }
    console.warn('FormSubmit server response:', fsData);
  } catch (fsErr) {
    console.warn('FormSubmit backend delivery error:', fsErr.message);
  }
};

module.exports = { sendContactEmail };
