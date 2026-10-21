import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { SectionHeading, Button, Spinner } from '../components/ui/index';
import api from '../services/api';

const INITIAL_FORM = { name: '', email: '', subject: '', message: '' };

export default function ContactSection() {
  const { ref, inView } = useInView();
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

    try {
      const res = await api.post('/contact', form);
      setStatus('success');
      setServerMsg(res.data.message || 'Message sent successfully!');
      setForm(INITIAL_FORM);
    } catch (err) {
      setStatus('error');
      setServerMsg(err.message || 'Failed to send message. Please try again.');
    }
  };

  const inputStyle = (field) => ({
    width: '100%',
    background: 'var(--bg-elevated)',
    border: `1px solid ${errors[field] ? '#ef4444' : 'var(--border)'}`,
    borderRadius: 'var(--radius-md)',
    padding: '0.7rem 0.9rem',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color var(--transition-fast)',
    fontFamily: 'inherit',
    resize: field === 'message' ? 'vertical' : 'none',
  });

  const labelStyle = {
    fontSize: '0.82rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    marginBottom: '0.4rem',
    display: 'block',
  };

  return (
    <section id="contact" className="section-padding" style={{ background: 'var(--bg-surface)' }}>
      <div className="container">
        <SectionHeading
          eyebrow="Contact"
          title="Let's Work Together"
          subtitle="Have a project in mind or want to talk? I'd love to hear from you."
          centered
        />

        <div
          ref={ref}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2.5rem',
            maxWidth: 900,
            margin: '0 auto',
          }}
        >
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
          >
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.75rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>
                Get in Touch
              </h3>

              {[
                {
                  icon: '✉',
                  label: 'Email',
                  value: profile?.email || 'ranjitsharma76088@gmail.com',
                  href: `mailto:${profile?.email || 'ranjitsharma76088@gmail.com'}`,
                },
                {
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                  ),
                  label: 'WhatsApp',
                  value: profile?.phone || '+91 7482869029',
                  href: 'https://wa.me/917482869029',
                },
                {
                  icon: '⌂',
                  label: 'Location',
                  value: profile?.location || 'Bhubaneswar, Odisha, India',
                  href: null,
                },
                {
                  icon: '◎',
                  label: 'Availability',
                  value: profile?.availabilityNote || (profile?.available ? 'Open to full-time roles and internships' : 'Available for opportunities'),
                  href: null,
                },
              ].map((info) => (
                <div
                  key={info.label}
                  style={{
                    display: 'flex',
                    gap: '0.75rem',
                    alignItems: 'flex-start',
                    paddingBottom: '1rem',
                    marginBottom: '1rem',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <span
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--accent-dim)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                      color: 'var(--accent)',
                      flexShrink: 0,
                    }}
                  >
                    {info.icon}
                  </span>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.2rem' }}>
                      {info.label}
                    </div>
                    {info.href ? (
                      <a
                        href={info.href}
                        target={info.href.startsWith('http') ? '_blank' : undefined}
                        rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        style={{
                          color: 'var(--text-primary)',
                          fontSize: '0.875rem',
                          transition: 'color var(--transition-fast)',
                          wordBreak: 'break-all',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                      >
                        {info.value}
                      </a>
                    ) : (
                      <span style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                        {info.value}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {/* Connect buttons */}
              <div style={{ display: 'flex', gap: '0.65rem', marginTop: '0.5rem' }}>
                <a
                  href={profile?.linkedinUrl || 'https://www.linkedin.com/in/ranjitsharma74/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    padding: '0.6rem 0.9rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    transition: 'all var(--transition-fast)',
                    textDecoration: 'none',
                    background: 'var(--bg-elevated)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.color = 'var(--accent)';
                    e.currentTarget.style.boxShadow = '0 0 12px var(--accent-glow)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <span>LinkedIn</span>
                </a>

                <a
                  href="https://wa.me/917482869029"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    padding: '0.6rem 0.9rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    transition: 'all var(--transition-fast)',
                    textDecoration: 'none',
                    background: 'var(--bg-elevated)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.color = 'var(--accent)';
                    e.currentTarget.style.boxShadow = '0 0 12px var(--accent-glow)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {status === 'success' ? (
              <div
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--accent)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '2.5rem',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✓</div>
                <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Message Received!</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                  {serverMsg}
                </p>
                <Button variant="outline" onClick={() => setStatus('idle')}>
                  Send Another
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.75rem',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                {/* Name + Email row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label htmlFor="contact-name" style={labelStyle}>
                      Name <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Ranjit Sharma"
                      aria-describedby={errors.name ? 'name-error' : undefined}
                      style={inputStyle('name')}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--accent)';
                        e.target.style.boxShadow = '0 0 10px var(--accent-glow)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = errors.name ? '#ef4444' : 'var(--border)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    {errors.name && (
                      <p id="name-error" role="alert" style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.25rem' }}>
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="contact-email" style={labelStyle}>
                      Email <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      style={inputStyle('email')}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--accent)';
                        e.target.style.boxShadow = '0 0 10px var(--accent-glow)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = errors.email ? '#ef4444' : 'var(--border)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    {errors.email && (
                      <p id="email-error" role="alert" style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.25rem' }}>
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="contact-subject" style={labelStyle}>
                    Subject <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="What's this about?"
                    aria-describedby={errors.subject ? 'subject-error' : undefined}
                    style={inputStyle('subject')}
                    onFocus={(e) => {
                        e.target.style.borderColor = 'var(--accent)';
                        e.target.style.boxShadow = '0 0 10px var(--accent-glow)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.subject ? '#ef4444' : 'var(--border)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  {errors.subject && (
                    <p id="subject-error" role="alert" style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.25rem' }}>
                      {errors.subject}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="contact-message" style={labelStyle}>
                    Message <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project or opportunity..."
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    style={{ ...inputStyle('message'), resize: 'vertical', minHeight: 120 }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--accent)';
                      e.target.style.boxShadow = '0 0 10px var(--accent-glow)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.message ? '#ef4444' : 'var(--border)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  {errors.message && (
                    <p id="message-error" role="alert" style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.25rem' }}>
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Error message */}
                {status === 'error' && (
                  <p role="alert" style={{ color: '#ef4444', fontSize: '0.85rem', background: 'rgba(239,68,68,0.08)', padding: '0.6rem 0.9rem', borderRadius: 'var(--radius-sm)' }}>
                    {serverMsg}
                  </p>
                )}

                <button
                  type="submit"
                  id="contact-submit"
                  disabled={status === 'loading'}
                  style={{
                    background: 'var(--accent)',
                    color: 'var(--accent-contrast)',
                    border: '1px solid var(--accent)',
                    boxShadow: '0 2px 10px var(--accent-glow)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                    opacity: status === 'loading' ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all var(--transition-fast)',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={(e) => {
                    if (status !== 'loading') {
                      e.currentTarget.style.background = 'var(--accent-hover)';
                      e.currentTarget.style.borderColor = 'var(--accent-hover)';
                      e.currentTarget.style.boxShadow = '0 0 18px var(--accent-glow)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (status !== 'loading') {
                      e.currentTarget.style.background = 'var(--accent)';
                      e.currentTarget.style.borderColor = 'var(--accent)';
                      e.currentTarget.style.boxShadow = '0 2px 10px var(--accent-glow)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {status === 'loading' ? (
                    <>
                      <Spinner size={18} color="var(--accent-contrast)" /> Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
