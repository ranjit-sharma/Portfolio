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
            duration: 280,
            ease: 'linear',
          },
        }}
      >
        <div className="hero-marquee-content">
          <span className="hero-marquee-text">SOFTWARE DEVELOPER</span>
          <span className="hero-marquee-text">SOFTWARE DEVELOPER</span>
          <span className="hero-marquee-text">SOFTWARE DEVELOPER</span>
          <span className="hero-marquee-text">SOFTWARE DEVELOPER</span>
          <span className="hero-marquee-text">SOFTWARE DEVELOPER</span>
          <span className="hero-marquee-text">SOFTWARE DEVELOPER</span>
        </div>
        <div className="hero-marquee-content">
          <span className="hero-marquee-text">SOFTWARE DEVELOPER</span>
          <span className="hero-marquee-text">SOFTWARE DEVELOPER</span>
          <span className="hero-marquee-text">SOFTWARE DEVELOPER</span>
          <span className="hero-marquee-text">SOFTWARE DEVELOPER</span>
          <span className="hero-marquee-text">SOFTWARE DEVELOPER</span>
          <span className="hero-marquee-text">SOFTWARE DEVELOPER</span>
        </div>
      </motion.div>
    </div>
  );
}
