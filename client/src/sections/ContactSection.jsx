import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SiGithub } from 'react-icons/si';
import { ArrowUpRight, Check, Mail, MapPin, Send } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { SectionHeading, Button, Spinner } from '../components/ui/index';
import api from '../services/api';

const INITIAL_FORM = { name: '', email: '', subject: '', message: '' };
const FORMSUBMIT_EMAIL = 'ctrl.ranjit@gmail.com';

const FIELDS = {
  name: { label: 'Name', type: 'text', placeholder: 'Your name', autoComplete: 'name' },
  email: { label: 'Email', type: 'email', placeholder: 'you@example.com', autoComplete: 'email' },
  subject: { label: 'Subject', type: 'text', placeholder: "What's this about?" },
  message: { label: 'Message', placeholder: 'Tell me about your project or opportunity...' },
};

const WhatsAppIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

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

    // Save to the admin inbox in parallel; never block the visitor on the database
    const backendSave = api.post('/contact', form);
    backendSave.catch(() => {});

    try {
      // Submit via FormSubmit AJAX endpoint for direct email delivery
      const fsRes = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(FORMSUBMIT_EMAIL)}`, {
        method: 'POST',
        signal: AbortSignal.timeout(20000),
        // Form-encoded body keeps this a "simple" CORS request: no slow preflight round trip
        headers: { Accept: 'application/json' },
        body: new URLSearchParams({
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
          _subject: `New Portfolio Message from ${form.name}: ${form.subject}`,
          _template: 'table',
          _captcha: 'false',
        }),
      });

      // FormSubmit answers 200 with success "false" (e.g. form not activated yet)
      const fsData = await fsRes.json().catch(() => ({}));
      if (!fsRes.ok || String(fsData.success) !== 'true') {
        throw new Error(fsData.message || 'Failed to submit via FormSubmit');
      }

      setStatus('success');
      setServerMsg('Message sent successfully! I will get back to you soon.');
      setForm(INITIAL_FORM);
    } catch (err) {
      // Fallback: the message still counts as sent if it reached the admin inbox
      try {
        const res = await backendSave;
        setStatus('success');
        setServerMsg(res.data?.message || 'Message sent successfully!');
        setForm(INITIAL_FORM);
      } catch {
        setStatus('error');
        setServerMsg(err.message || 'Failed to send message. Please try again.');
      }
    }
  };

  const email = profile?.email || 'ranjitsharma76088@gmail.com';
  const contactItems = [
    { icon: <Mail size={17} />, label: 'Email', value: email, href: `mailto:${email}` },
    { icon: <WhatsAppIcon />, label: 'WhatsApp', value: profile?.phone || '+91 7482869029', href: 'https://wa.me/917482869029' },
    { icon: <MapPin size={17} />, label: 'Location', value: profile?.location || 'Bhubaneswar, Odisha, India', href: null },
  ];
  const socials = [
    { label: 'LinkedIn', icon: <LinkedInIcon />, href: profile?.linkedinUrl || 'https://www.linkedin.com/in/ranjitsharma74/' },
    { label: 'GitHub', icon: <SiGithub size={16} />, href: profile?.githubUrl || 'https://github.com/Ranjitsharma76088' },
  ];
  const availability =
    profile?.availabilityNote || (profile?.available ? 'Open to full-time roles and internships' : 'Available for opportunities');

  // Reduced motion: render in place, no entrance animation
  const reveal = (hidden, delay = 0) =>
    reduceMotion
      ? { initial: false }
      : { initial: hidden, animate: inView ? { opacity: 1, x: 0, y: 0 } : hidden, transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] } };

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
          grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-lg);
          overflow: hidden;
        }
        .contact-aside {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding: 2.25rem;
          background:
            radial-gradient(circle at 0% 0%, var(--accent-dim) 0%, transparent 55%),
            radial-gradient(circle at 100% 100%, var(--accent-dim) 0%, transparent 45%),
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
          gap: 0.6rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .contact-link {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.75rem 0.9rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
          background: var(--bg-card);
          color: inherit;
          text-decoration: none;
          transition: border-color var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast);
        }
        a.contact-link:hover,
        a.contact-link:focus-visible {
          border-color: var(--accent-border);
          box-shadow: 0 6px 18px -8px var(--accent-glow);
          transform: translateX(4px);
        }
        .contact-link-icon {
          width: 38px;
          height: 38px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          color: var(--accent);
          background: var(--accent-dim);
          border: 1px solid var(--accent-border);
        }
        .contact-link-text {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .contact-link-label {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        .contact-link-value {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
          overflow-wrap: anywhere;
        }
        .contact-link-arrow {
          margin-left: auto;
          flex-shrink: 0;
          color: var(--text-muted);
          transition: color var(--transition-fast), transform var(--transition-fast);
        }
        a.contact-link:hover .contact-link-arrow {
          color: var(--accent);
          transform: translate(2px, -2px);
        }
        .contact-socials {
          display: flex;
          gap: 0.6rem;
          margin-top: auto;
        }
        .contact-social {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.65rem 1rem;
          border-radius: 9999px;
          border: 1px solid var(--border);
          background: var(--bg-card);
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 600;
          text-decoration: none;
          transition: all var(--transition-fast);
        }
        .contact-social:hover,
        .contact-social:focus-visible {
          border-color: var(--accent);
          color: var(--accent);
          box-shadow: 0 0 14px var(--accent-glow);
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
                        </span>
                        {item.href && <ArrowUpRight size={16} className="contact-link-arrow" aria-hidden="true" />}
                      </Tag>
                    </motion.li>
                  );
                })}
              </ul>

              <motion.div className="contact-socials" {...reveal({ opacity: 0, y: 12 }, 0.55)}>
                {socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="contact-social">
                    {s.icon}
                    <span>{s.label}</span>
                  </a>
                ))}
              </motion.div>
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
                <div className="contact-success" role="status">
                  <motion.span
                    className="contact-success-icon"
                    initial={reduceMotion ? false : { scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                  >
                    <Check size={30} strokeWidth={3} />
                  </motion.span>
                  <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.2rem' }}>Message Received!</h3>
                  <p style={{ margin: '0 0 1rem', color: 'var(--text-secondary)', maxWidth: '36ch' }}>{serverMsg}</p>
                  <Button variant="outline" onClick={() => setStatus('idle')}>
                    Send Another
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="contact-form">
                  <div className="contact-row">
                    {renderField('name')}
                    {renderField('email')}
                  </div>
                  {renderField('subject')}
                  {renderField('message')}

                  {status === 'error' && (
                    <p role="alert" className="contact-alert">
                      {serverMsg}
                    </p>
                  )}

                  <button type="submit" id="contact-submit" className="contact-submit" disabled={status === 'loading'}>
                    {status === 'loading' ? (
                      <>
                        <Spinner size={18} color="var(--accent-contrast)" /> Sending...
                      </>
                    ) : (
                      <>
                        Send Message <Send size={17} className="contact-submit-icon" aria-hidden="true" />
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
