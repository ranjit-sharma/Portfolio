import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TbLayout,
  TbServer,
  TbDatabase,
  TbCode,
  TbBinaryTree,
  TbTools,
} from 'react-icons/tb';
import { useInView } from '../hooks/useInView';
import { SectionHeading, SkeletonCard, SkillIcon } from '../components/ui/index';
import api from '../services/api';

const FALLBACK_SKILLS = {
  Frontend: ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Tailwind CSS', 'Bootstrap', 'EJS'],
  Backend: ['Node.js', 'Express.js', 'REST APIs', 'Authentication & Authorization', 'Middleware', 'Input Validation', 'Error Handling'],
  Database: ['MongoDB', 'Mongoose', 'MySQL'],
  Language: ['JavaScript', 'C++', 'Java', 'SQL'],
  'CS Fundamentals': ['Data Structures & Algorithms', 'OOP', 'DBMS', 'Operating Systems', 'Computer Networks'],
  Tools: ['Git', 'GitHub', 'VS Code', 'Postman'],
};

// Modern developer icon pack for categories
const CATEGORY_ICONS = {
  Frontend: TbLayout,
  Backend: TbServer,
  Database: TbDatabase,
  Language: TbCode,
  'CS Fundamentals': TbBinaryTree,
  Tools: TbTools,
};

function SkillBadge({ skill }) {
  return (
    <div
      tabIndex={0}
      role="button"
      aria-label={skill}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.55rem',
        padding: '0.35rem 0.85rem',
        minHeight: '38px',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-pill)',
        cursor: 'default',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        flexShrink: 0,
        userSelect: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 14px var(--accent-glow)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <SkillIcon name={skill} size={18} />
      <span
        style={{
          fontSize: '0.8125rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          whiteSpace: 'nowrap',
        }}
      >
        {skill}
      </span>
    </div>
  );
}

export default function SkillsSection() {
  const { ref, inView } = useInView();
  const [skillsMap, setSkillsMap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/skills')
      .then((res) => {
        const raw = res.data?.data;
        if (!raw || raw.length === 0) {
          setSkillsMap(FALLBACK_SKILLS);
          return;
        }
        const grouped = {};
        raw.forEach((s) => {
          if (!grouped[s.category]) grouped[s.category] = [];
          grouped[s.category].push(s.name);
        });
        setSkillsMap(grouped);
      })
      .catch(() => setSkillsMap(FALLBACK_SKILLS))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="skills" className="section-padding" style={{ background: 'var(--bg-surface)' }}>
      <div className="container">
        <SectionHeading
          eyebrow="Skills"
          title="Technical Toolkit"
          subtitle="Technologies and tools I work with regularly"
          centered
        />

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} height={160} />)}
          </div>
        ) : (
          <div
            ref={ref}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
              gap: '1.25rem',
            }}
          >
            {Object.entries(skillsMap || FALLBACK_SKILLS).map(([category, skills], ci) => {
              const CatIcon = CATEGORY_ICONS[category] || TbCode;
              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: ci * 0.07 }}
                  className="card-ambient"
                  style={{
                    background: 'radial-gradient(circle at 12% 10%, var(--accent-dim) 0%, transparent 48%), var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem',
                    boxShadow: 'var(--shadow-md)',
                    transition: 'all var(--transition-base)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-border)';
                    e.currentTarget.style.boxShadow = '0 12px 32px -6px var(--accent-glow)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* Category Header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                      marginBottom: '1rem',
                      paddingBottom: '0.75rem',
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--accent-dim)',
                          border: '1px solid var(--accent-border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--accent)',
                        }}
                      >
                        <CatIcon size={18} strokeWidth={2.2} />
                      </div>
                      <h3
                        style={{
                          fontWeight: 700,
                          fontSize: '0.94rem',
                          color: 'var(--text-primary)',
                          margin: 0,
                        }}
                      >
                        {category}
                      </h3>
                    </div>

                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                        background: 'var(--bg-elevated)',
                        padding: '0.15rem 0.55rem',
                        borderRadius: 'var(--radius-pill)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      {skills.length} {skills.length === 1 ? 'skill' : 'skills'}
                    </span>
                  </div>

                  {/* Skill Badges (Icon + Name) */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                      alignItems: 'center',
                    }}
                  >
                    {skills.map((skill) => (
                      <SkillBadge key={skill} skill={skill} />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
