import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SiGithub } from 'react-icons/si';
import { ArrowUpRight, Check, Mail, MapPin, Send } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { SectionHeading, Button, Spinner } from '../components/ui/index';
import api from '../services/api';

const INITIAL_FORM = { name: '', email: '', subject: '', message: '' };
const DEFAULT_EMAIL = 'ctrl.ranjit@gmail.com';

const FIELDS = {
  name: { label: 'Name', type: 'text', placeholder: 'Your name', autoComplete: 'name' },
  email: { label: 'Email', type: 'email', placeholder: 'you@example.com', autoComplete: 'email' },
  subject: { label: 'Subject', type: 'text', placeholder: "What's this about?" },
  message: { label: 'Message', placeholder: 'Tell me about your project or opportunity...' },
};

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export default function ContactSection() {
  const { ref, inView } = useInView();
  const reduceMotion = useReducedMotion();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [serverMsg, setServerMsg] = useState('');

  useEffect(() => {
    api
      .get('/profile')
      .then((res) => setProfile(res.data.data))
      .catch(() => {});
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Please enter a valid email';
    if (!form.subject.trim() || form.subject.trim().length < 3) e.subject = 'Subject must be at least 3 characters';
    if (!form.message.trim() || form.message.trim().length < 10) e.message = 'Message must be at least 10 characters';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => { const n = { ...er }; delete n[name]; return n; });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus('loading');
    setErrors({});

    // Target email provided by the admin in Settings (profile.email)
    const targetEmail = (profile?.email?.trim() || DEFAULT_EMAIL).toLowerCase();

    // 1. Submit to backend API (saves message to MongoDB for admin inbox & triggers backend notification)
    let backendSuccess = false;
    let backendMsg = '';
    try {
      const res = await api.post('/contact', form);
      backendSuccess = true;
      backendMsg = res.data?.message || 'Message sent successfully!';
    } catch (backendErr) {
      console.warn('Backend /contact submission error:', backendErr);
    }

    // 2. Submit via FormSubmit AJAX endpoint directly to the admin settings email
    let fsSuccess = false;
    try {
      const fsRes = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(targetEmail)}`, {
        method: 'POST',
        signal: AbortSignal.timeout(15000),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
          _subject: `New Portfolio Message from ${form.name}: ${form.subject}`,
          _template: 'table',
          _captcha: 'false',
        }),
      });

      const fsData = await fsRes.json().catch(() => ({}));
      if (fsRes.ok && (String(fsData.success) === 'true' || fsData.message?.includes('Activation'))) {
        fsSuccess = true;
      }
    } catch (fsErr) {
      console.warn('Client FormSubmit error:', fsErr);
    }

    // If either the database inbox save or the email dispatch succeeded, confirm success
    if (backendSuccess || fsSuccess) {
      setStatus('success');
      setServerMsg(backendMsg || 'Message sent successfully! I will get back to you soon.');
      setForm(INITIAL_FORM);
    } else {
      setStatus('error');
      setServerMsg('Failed to send message. Please try again.');
    }
  };

    const email = profile?.email || 'ctrl.ranjit@gmail.com';
  const location = profile?.location || 'Bhubaneswar, Odisha, India';

  const contactItems = [
    {
      icon: <Mail size={18} strokeWidth={2.2} />,
      label: 'Email',
      value: email,
      href: `mailto:${email}`,
      hint: 'Direct inquiries & opportunities',
    },
    {
      icon: <MapPin size={18} strokeWidth={2.2} />,
      label: 'Location',
      value: location,
      href: 'https://maps.google.com/?q=Bhubaneswar,+Odisha,+India',
      hint: 'Based in Odisha, India (IST)',
    },
  ];

  const socials = [
    profile?.linkedinUrl?.trim() && {
      label: 'LinkedIn',
      icon: <LinkedInIcon />,
      href: profile.linkedinUrl.trim(),
    },
    profile?.githubUrl?.trim() && {
      label: 'GitHub',
      icon: <SiGithub size={16} />,
      href: profile.githubUrl.trim(),
    },
  ].filter(Boolean);

  const availability =
    profile?.availabilityNote || (profile?.available ? 'Open to full-time roles and internships' : 'Available for opportunities');

  const reveal = (hidden, delay = 0) => ({
    initial: hidden,
    animate: inView ? { opacity: 1, x: 0, y: 0 } : hidden,
    transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
  });

  const renderField = (name) => {
    const f = FIELDS[name];
    const Tag = name === 'message' ? 'textarea' : 'input';
    return (
      <div className="contact-field">
        <label htmlFor={`contact-${name}`}>
          {f.label} <span aria-hidden="true" className="contact-required">*</span>
        </label>
        <Tag
          id={`contact-${name}`}
          name={name}
          type={f.type}
          rows={name === 'message' ? 5 : undefined}
          autoComplete={f.autoComplete}
          value={form[name]}
          onChange={handleChange}
          placeholder={f.placeholder}
          required
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? `${name}-error` : undefined}
          className="contact-input"
        />
        {errors[name] && (
          <p id={`${name}-error`} role="alert" className="contact-error">
            {errors[name]}
          </p>
        )}
      </div>
    );
  };

  return (
    <section id="contact" className="section-padding">
      <style>{`
        .contact-shell {
          display: grid;
          grid-template-columns: minmax(0, 0.88fr) minmax(0, 1.12fr);
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-lg);
          overflow: hidden;
        }
        .contact-aside {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 1.75rem;
          padding: 2.5rem 2.25rem;
          background:
            radial-gradient(circle at 0% 0%, var(--accent-dim) 0%, transparent 60%),
            radial-gradient(circle at 100% 100%, var(--accent-dim) 0%, transparent 50%),
            var(--bg-elevated);
          border-right: 1px solid var(--border);
        }
        .contact-status {
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 0.85rem;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--accent);
          background: var(--accent-dim);
          border: 1px solid var(--accent-border);
          border-radius: 9999px;
        }
        .contact-status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--accent);
          animation: pulse-glow 2s ease infinite;
        }
        .contact-aside-title {
          margin: 0 0 0.5rem;
          font-size: 1.45rem;
          font-weight: 800;
          line-height: 1.25;
          letter-spacing: -0.01em;
          color: var(--text-primary);
        }
        .contact-aside-text {
          margin: 0;
          font-size: 0.92rem;
          line-height: 1.65;
          color: var(--text-secondary);
        }
        .contact-links {
          display: flex;
          flex-direction: column;
          gap: 0.95rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .contact-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.05rem 1.15rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
          background: var(--bg-card);
          color: inherit;
          text-decoration: none;
          transition: border-color var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast), background var(--transition-fast);
        }
        a.contact-link:hover,
        a.contact-link:focus-visible {
          border-color: var(--accent);
          background: var(--bg-hover);
          box-shadow: 0 8px 24px -6px var(--accent-glow);
          transform: translateY(-2px);
        }
        .contact-link-icon {
          width: 44px;
          height: 44px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          color: var(--accent);
          background: var(--accent-dim);
          border: 1px solid var(--accent-border);
          box-shadow: 0 0 12px var(--accent-glow);
          transition: transform var(--transition-fast);
        }
        a.contact-link:hover .contact-link-icon {
          transform: scale(1.06);
        }
        .contact-link-text {
          display: flex;
          flex-direction: column;
          min-width: 0;
          gap: 0.15rem;
        }
        .contact-link-label {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        .contact-link-value {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
          overflow-wrap: anywhere;
        }
        .contact-link-hint {
          font-size: 0.76rem;
          color: var(--text-muted);
          margin-top: 0.1rem;
        }
        .contact-link-arrow {
          margin-left: auto;
          flex-shrink: 0;
          color: var(--text-muted);
          transition: color var(--transition-fast), transform var(--transition-fast);
        }
        a.contact-link:hover .contact-link-arrow {
          color: var(--accent);
          transform: translate(3px, -3px);
        }
        .contact-socials {
          display: flex;
          gap: 0.75rem;
          margin-top: auto;
          padding-top: 0.5rem;
        }
        .contact-social {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.55rem;
          padding: 0.75rem 1.1rem;
          border-radius: 9999px;
          border: 1px solid var(--border);
          background: var(--bg-card);
          color: var(--text-secondary);
          font-size: 0.88rem;
          font-weight: 600;
          text-decoration: none;
          transition: all var(--transition-fast);
        }
        .contact-social:hover,
        .contact-social:focus-visible {
          border-color: var(--accent);
          color: var(--accent);
          box-shadow: 0 0 16px var(--accent-glow);
          transform: translateY(-2px);
        }
        .contact-compose {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .contact-compose-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 1rem 2rem;
          border-bottom: 1px solid var(--border);
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .contact-compose-to {
          font-weight: 500;
          color: var(--text-muted);
        }
        .contact-compose-to strong {
          color: var(--text-secondary);
          font-weight: 600;
        }
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
          padding: 1.75rem 2rem 2rem;
          flex: 1;
        }
        .contact-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.9rem;
        }
        .contact-field label {
          display: block;
          margin-bottom: 0.4rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .contact-required {
          color: var(--accent);
        }
        .contact-input {
          width: 100%;
          padding: 0.75rem 0.95rem;
          font: inherit;
          font-size: 0.9rem;
          color: var(--text-primary);
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          outline: none;
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast), background var(--transition-fast);
        }
        textarea.contact-input {
          min-height: 140px;
          resize: vertical;
        }
        .contact-input::placeholder {
          color: var(--text-muted);
        }
        .contact-input:hover {
          border-color: var(--border-strong);
        }
        .contact-input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-dim);
          background: var(--bg-card);
        }
        .contact-input[aria-invalid='true'] {
          border-color: #ef4444;
        }
        /* Keep browser autofill on-theme instead of its default light-blue fill */
        .contact-input:-webkit-autofill {
          -webkit-text-fill-color: var(--text-primary);
          -webkit-box-shadow: 0 0 0 1000px var(--bg-elevated) inset;
          caret-color: var(--text-primary);
        }
        .contact-error {
          margin: 0.3rem 0 0;
          font-size: 0.78rem;
          color: #ef4444;
        }
        .contact-alert {
          margin: 0;
          padding: 0.65rem 0.9rem;
          font-size: 0.85rem;
          color: #ef4444;
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.25);
          border-radius: var(--radius-sm);
        }
        .contact-submit {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.55rem;
          padding: 0.85rem 1.5rem;
          margin-top: 0.25rem;
          font: inherit;
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--accent-contrast);
          background: var(--accent);
          border: 1px solid var(--accent);
          border-radius: 9999px;
          box-shadow: 0 4px 16px -4px var(--accent-glow);
          cursor: pointer;
          transition: background var(--transition-fast), box-shadow var(--transition-fast), transform var(--transition-fast);
        }
        .contact-submit:hover:not(:disabled) {
          background: var(--accent-hover);
          box-shadow: 0 0 22px var(--accent-glow);
          transform: translateY(-1px);
        }
        .contact-submit:hover:not(:disabled) .contact-submit-icon {
          transform: translate(3px, -3px) rotate(-8deg);
        }
        .contact-submit-icon {
          transition: transform var(--transition-card);
        }
        .contact-submit:disabled {
          opacity: 0.75;
          cursor: not-allowed;
        }
        .contact-success {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          padding: 3rem 2rem;
          text-align: center;
        }
        .contact-success-icon {
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
          border-radius: 50%;
          color: var(--accent-contrast);
          background: var(--accent);
          box-shadow: 0 0 0 8px var(--accent-dim), 0 0 30px var(--accent-glow);
        }
        @media (max-width: 860px) {
          .contact-shell {
            grid-template-columns: 1fr;
          }
          .contact-aside {
            border-right: none;
            border-bottom: 1px solid var(--border);
          }
        }
        @media (max-width: 520px) {
          .contact-aside,
          .contact-form {
            padding: 1.35rem;
          }
          .contact-compose-head {
            padding: 0.9rem 1.35rem;
          }
          .contact-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="container">
        <div style={{ maxWidth: 1040, margin: '0 auto' }}>
          <SectionHeading
            index="07"
            eyebrow="Contact"
            title="Let's Work Together"
            subtitle="Have a project in mind or want to talk? I'd love to hear from you."
          />

          <motion.div ref={ref} className="contact-shell" {...reveal({ opacity: 0, y: 28 })}>
            {/* Left — intro and direct contact */}
            <aside className="contact-aside">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <motion.span className="contact-status" {...reveal({ opacity: 0, x: -16 }, 0.15)}>
                  <span className="contact-status-dot" />
                  {availability}
                </motion.span>

                <motion.div {...reveal({ opacity: 0, x: -16 }, 0.22)}>
                  <h3 className="contact-aside-title">Got an idea or an opening? Let's talk.</h3>
                  <p className="contact-aside-text">
                    Whether it's a full-time role, an internship or a project you want built, send a message or reach me directly.
                  </p>
                </motion.div>
              </div>

              <ul className="contact-links">
                {contactItems.map((item, i) => {
                  const Tag = item.href ? 'a' : 'div';
                  const external = item.href?.startsWith('http');
                  return (
                    <motion.li key={item.label} {...reveal({ opacity: 0, x: -16 }, 0.3 + i * 0.08)}>
                      <Tag
                        className="contact-link"
                        href={item.href || undefined}
                        target={external ? '_blank' : undefined}
                        rel={external ? 'noopener noreferrer' : undefined}
                      >
                        <span className="contact-link-icon">{item.icon}</span>
                        <span className="contact-link-text">
                          <span className="contact-link-label">{item.label}</span>
                          <span className="contact-link-value">{item.value}</span>
                          {item.hint && <span className="contact-link-hint">{item.hint}</span>}
                        </span>
                        {item.href && <ArrowUpRight size={17} className="contact-link-arrow" aria-hidden="true" />}
                      </Tag>
                    </motion.li>
                  );
                })}
              </ul>

              {socials.length > 0 && (
                <motion.div className="contact-socials" {...reveal({ opacity: 0, y: 12 }, 0.45)}>
                  {socials.map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="contact-social">
                      {s.icon}
                      <span>{s.label}</span>
                    </a>
                  ))}
                </motion.div>
              )}
            </aside>

            {/* Right — compose form */}
            <div className="contact-compose">
              <div className="contact-compose-head">
                <span>New message</span>
                <span className="contact-compose-to">
                  To: <strong>{profile?.name || 'Ranjit Sharma'}</strong>
                </span>
              </div>

              {status === 'success' ? (
                <motion.div
                  className="contact-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="contact-success-icon">
                    <Check size={28} strokeWidth={2.5} />
                  </div>
                  <h4 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-primary)' }}>Message Sent!</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: 360 }}>
                    {serverMsg}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setStatus('idle')}
                    style={{ marginTop: '0.75rem' }}
                  >
                    Send another message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="contact-form">
                  <div className="contact-row">
                    {renderField('name')}
                    {renderField('email')}
                  </div>
                  {renderField('subject')}
                  {renderField('message')}

                  {status === 'error' && (
                    <div role="alert" className="contact-alert">
                      {serverMsg}
                    </div>
                  )}

                  <button type="submit" disabled={status === 'loading'} className="contact-submit">
                    {status === 'loading' ? (
                      <>
                        <Spinner size={16} color="var(--accent-contrast)" />
                        <span>Sending message...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send size={15} className="contact-submit-icon" aria-hidden="true" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
