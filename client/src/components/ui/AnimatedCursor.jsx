import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SiReact,
  SiHtml5,
  SiJavascript,
  SiTailwindcss,
  SiBootstrap,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiMysql,
  SiCplusplus,
  SiGit,
  SiGithub,
  SiPostman,
  SiPython,
} from 'react-icons/si';
import { FaCss3Alt, FaJava } from 'react-icons/fa6';
import { VscVscode } from 'react-icons/vsc';

/**
 * Verified Tech Stack Categories — Only technologies Ranjit knows & uses:
 * 1. Frontend: React, JavaScript, HTML5, CSS3, Tailwind CSS, Bootstrap
 * 2. Database & Backend: MongoDB, MySQL, Node.js, Express.js
 * 3. Languages: JavaScript, C++, Java, Python
 * 4. Tools: Git, GitHub, VS Code, Postman
 */
const VERIFIED_TECH_CATEGORIES = [
  // 1. Frontend
  [
    { name: 'React', Icon: SiReact, color: '#61DAFB' },
    { name: 'JavaScript', Icon: SiJavascript, color: '#F7DF1E' },
    { name: 'HTML5', Icon: SiHtml5, color: '#E34F26' },
    { name: 'CSS3', Icon: FaCss3Alt, color: '#1572B6' },
    { name: 'Tailwind CSS', Icon: SiTailwindcss, color: '#38BDF8' },
    { name: 'Bootstrap', Icon: SiBootstrap, color: '#7952B3' },
  ],
  // 2. Database & Backend
  [
    { name: 'MongoDB', Icon: SiMongodb, color: '#47A248' },
    { name: 'MySQL', Icon: SiMysql, color: '#4479A1' },
    { name: 'Node.js', Icon: SiNodedotjs, color: '#5FA04E' },
    { name: 'Express.js', Icon: SiExpress, color: '#94A3B8' },
  ],
  // 3. Languages
  [
    { name: 'JavaScript', Icon: SiJavascript, color: '#F7DF1E' },
    { name: 'C++', Icon: SiCplusplus, color: '#00599C' },
    { name: 'Java', Icon: FaJava, color: '#ED8B00' },
    { name: 'Python', Icon: SiPython, color: '#3776AB' },
  ],
  // 4. Tools
  [
    { name: 'Git', Icon: SiGit, color: '#F05032' },
    { name: 'GitHub', Icon: SiGithub, color: '#A855F7' },
    { name: 'VS Code', Icon: VscVscode, color: '#007ACC' },
    { name: 'Postman', Icon: SiPostman, color: '#FF6C37' },
  ],
];

export default function AnimatedCursor() {
  const [particles, setParticles] = useState([]);

  // Synchronous refs for lightweight tracking
  const lastSpawnRef = useRef({ x: -100, y: -100 });
  const categoryIndexRef = useRef(0);
  const itemIndicesRef = useRef([0, 0, 0, 0]);

  // Helper to spawn a floating tech icon
  const spawnTechParticle = (x, y, dx = 0, dy = 0) => {
    const catIdx = categoryIndexRef.current;
    const group = VERIFIED_TECH_CATEGORIES[catIdx];
    const subIdx = itemIndicesRef.current[catIdx] % group.length;
    const tech = group[subIdx];

    // Cycle to next category and item
    itemIndicesRef.current[catIdx] = (subIdx + 1) % group.length;
    categoryIndexRef.current = (catIdx + 1) % VERIFIED_TECH_CATEGORIES.length;

    // Movement physics: drift in opposite direction of movement + upward float
    const dist = Math.hypot(dx, dy) || 1;
    const normX = dx / dist;
    const normY = dy / dist;

    const driftX = -normX * 18 + (Math.random() - 0.5) * 22;
    const driftY = -normY * 18 - (Math.random() * 18 + 12);
    const rot = (Math.random() - 0.5) * 20;
    const rotDelta = (Math.random() - 0.5) * 35;

    const id = Date.now() + Math.random();

    setParticles((prev) => {
      const trimmed = prev.length > 15 ? prev.slice(prev.length - 14) : prev;
      return [
        ...trimmed,
        {
          id,
          x,
          y,
          dx: driftX,
          dy: driftY,
          rot,
          rotDelta,
          tech,
        },
      ];
    });

    // Auto-remove after 950ms
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== id));
    }, 950);
  };

  useEffect(() => {
    const onPointerMove = (e) => {
      if (e.pointerType === 'touch') return;

      const x = e.clientX;
      const y = e.clientY;

      // Check distance moved since last spawn
      const last = lastSpawnRef.current;
      const dx = x - last.x;
      const dy = y - last.y;
      const dist = Math.hypot(dx, dy);

      // Check if hovering text input
      const target = e.target;
      const isText =
        target instanceof Element &&
        Boolean(
          target.closest(
            'input[type="text"], input[type="email"], input[type="password"], input[type="search"], textarea, [contenteditable="true"]'
          )
        );

      // Spawn next tech icon every 24px of movement
      if (dist >= 24 && !isText) {
        spawnTechParticle(x, y, dx, dy);
        lastSpawnRef.current = { x, y };
      }
    };

    const onMouseDown = (e) => {
      if (e.pointerType === 'touch') return;

      const x = e.clientX;
      const y = e.clientY;

      // Click burst: spawn 4 tech icons (one from Frontend, Database, Languages, Tools)
      const angles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
      angles.forEach((angle) => {
        const pushX = Math.cos(angle) * 24;
        const pushY = Math.sin(angle) * 24;
        spawnTechParticle(x, y, -pushX, -pushY);
      });
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('mousedown', onMouseDown);
    };
  }, []); // Run once on mount

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 999999,
        overflow: 'hidden',
      }}
    >
      {/* Floating Tech Stack Icons Trail (Only verified skills) */}
      <AnimatePresence>
        {particles.map((p) => {
          const { tech } = p;
          const IconComp = tech.Icon;

          return (
            <motion.div
              key={p.id}
              initial={{
                scale: 0.2,
                opacity: 0,
                x: p.x,
                y: p.y,
                rotate: p.rot - 15,
              }}
              animate={{
                scale: [0.2, 1.25, 0.95, 0.2],
                opacity: [0, 1, 0.95, 0],
                x: p.x + p.dx,
                y: p.y + p.dy,
                rotate: [p.rot - 15, p.rot, p.rot + p.rotDelta],
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                duration: 0.95,
                ease: [0.16, 1, 0.3, 1],
                times: [0, 0.22, 0.65, 1],
              }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                translateX: '-50%',
                translateY: '-50%',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: tech.color,
                filter: `drop-shadow(0 0 8px ${tech.color}99) drop-shadow(0 2px 6px rgba(0, 0, 0, 0.5))`,
              }}
            >
              <IconComp size={24} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
