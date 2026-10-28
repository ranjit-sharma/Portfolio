import { motion } from 'framer-motion';

export default function BackgroundMarquee() {
  return (
    <div className="hero-marquee-wrapper" aria-hidden="true">
      <motion.div
        className="hero-marquee-track"
        initial={{ x: '0%' }}
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: 160,
            ease: 'linear',
          },
        }}
      >
        <div className="hero-marquee-content">
          <span className="hero-marquee-text">SOFTWARE DEVELOPER</span>
          <span className="hero-marquee-dot">·</span>
          <span className="hero-marquee-text">SOFTWARE DEVELOPER</span>
          <span className="hero-marquee-dot">·</span>
          <span className="hero-marquee-text">SOFTWARE DEVELOPER</span>
          <span className="hero-marquee-dot">·</span>
          <span className="hero-marquee-text">SOFTWARE DEVELOPER</span>
          <span className="hero-marquee-dot">·</span>
          <span className="hero-marquee-text">SOFTWARE DEVELOPER</span>
          <span className="hero-marquee-dot">·</span>
          <span className="hero-marquee-text">SOFTWARE DEVELOPER</span>
          <span className="hero-marquee-dot">·</span>
        </div>
        <div className="hero-marquee-content">
          <span className="hero-marquee-text">SOFTWARE DEVELOPER</span>
          <span className="hero-marquee-dot">·</span>
          <span className="hero-marquee-text">SOFTWARE DEVELOPER</span>
          <span className="hero-marquee-dot">·</span>
          <span className="hero-marquee-text">SOFTWARE DEVELOPER</span>
          <span className="hero-marquee-dot">·</span>
          <span className="hero-marquee-text">SOFTWARE DEVELOPER</span>
          <span className="hero-marquee-dot">·</span>
          <span className="hero-marquee-text">SOFTWARE DEVELOPER</span>
          <span className="hero-marquee-dot">·</span>
          <span className="hero-marquee-text">SOFTWARE DEVELOPER</span>
          <span className="hero-marquee-dot">·</span>
        </div>
      </motion.div>
    </div>
  );
}
