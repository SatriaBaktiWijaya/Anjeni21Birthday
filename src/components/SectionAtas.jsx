import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Outer wrapper handles scroll-driven position; inner element handles looping motion
const ParallaxPerk = ({ scrollYProgress, src, width, startX, startY, endX, endY, motionType = 'float', delay = 0 }) => {
  const x = useTransform(scrollYProgress, [0, 0.4], [startX, endX]);
  const y = useTransform(scrollYProgress, [0, 0.4], [startY, endY]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0.8, 1]);

  const motionVariants = {
    float: {
      animate: { y: [-8, 8, -8], rotate: [-3, 3, -3] },
      transition: { duration: 3.5 + delay * 0.4, repeat: Infinity, ease: 'easeInOut', delay },
    },
    spin: {
      animate: { rotate: [0, 360] },
      transition: { duration: 5 + delay * 0.5, repeat: Infinity, ease: 'linear', delay },
    },
    pulse: {
      animate: { scale: [1, 1.15, 1], rotate: [-5, 5, -5] },
      transition: { duration: 2.5 + delay * 0.3, repeat: Infinity, ease: 'easeInOut', delay },
    },
    wobble: {
      animate: { rotate: [-8, 8, -4, 4, 0], y: [0, -6, 0, -4, 0] },
      transition: { duration: 2.8 + delay * 0.3, repeat: Infinity, ease: 'easeInOut', delay },
    },
    drift: {
      animate: { x: [-6, 6, -6], y: [-5, 5, -5], rotate: [-4, 4, -4] },
      transition: { duration: 4 + delay * 0.5, repeat: Infinity, ease: 'easeInOut', delay },
    },
  };

  const chosen = motionVariants[motionType];

  return (
    <motion.div
      className="perk"
      style={{ x, y, opacity, translateX: '-50%', translateY: '-50%', width }}
    >
      <motion.img
        src={src}
        alt=""
        style={{ width: '100%', display: 'block' }}
        animate={chosen.animate}
        transition={chosen.transition}
      />
    </motion.div>
  );
};

const SectionAtas = () => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const bookRotate = useTransform(scrollYProgress, [0, 0.4], [0, -4]);

  const perksConfig = [
    // Left side (spread to upper-left and lower-left)
    { src: '/assets/perks_HelloKity.png', width: '110px', startX: -360, startY: -150, endX: -580, endY: -300, motionType: 'wobble', delay: 0 },
    { src: '/assets/perks_Camera.png',    width: '150px', startX: -370, startY:  100, endX: -620, endY:  100, motionType: 'drift',  delay: 0.4 },
    { src: '/assets/perks_Kancing.png',   width: '48px',  startX: -310, startY: -240, endX: -400, endY: -400, motionType: 'spin',   delay: 0.2 },
    { src: '/assets/perks_kancingm.png',  width: '55px',  startX: -320, startY:  220, endX: -460, endY:  400, motionType: 'spin',   delay: 0.7 },
    { src: '/assets/perks_PetaPolos.png', width: '75px',  startX: -340, startY:   30, endX: -520, endY:  240, motionType: 'float',  delay: 0.5 },
    // Bottom center (moved from top)
    { src: '/assets/perks_Love.png',      width: '90px',  startX:   10, startY:  290, endX:   10, endY:  480, motionType: 'pulse',  delay: 0.1 },
    { src: '/assets/perks_Bintang.png',   width: '60px',  startX: -180, startY:  270, endX: -200, endY:  440, motionType: 'spin',   delay: 0.3 },
    // Right side (spread to upper-right and lower-right)
    { src: '/assets/perks_Strawberry.png',width: '58px',  startX:  330, startY: -180, endX:  480, endY: -370, motionType: 'wobble', delay: 0.2 },
    { src: '/assets/perks_MotifPita.png', width: '90px',  startX:  360, startY:  -60, endX:  600, endY: -100, motionType: 'drift',  delay: 0.6 },
    { src: '/assets/perks_Cake.png',      width: '110px', startX:  350, startY:  200, endX:  560, endY:  380, motionType: 'float',  delay: 0.3 },
  ];

  return (
    <section ref={containerRef} className="section-atas">
      <motion.h1
        className="title-text"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        Happy 21, pretty Anjeni.
      </motion.h1>

      <motion.div
        className="book-container"
        style={{ rotate: bookRotate }}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.4 }}
      >
        {perksConfig.map((p, idx) => (
          <ParallaxPerk key={`perk-${idx}`} scrollYProgress={scrollYProgress} {...p} />
        ))}

        <img src="/assets/Buku.png" alt="Book" className="book-img" />

        <div className="book-content">
          <div className="book-left">
            <img src="/assets/FotoDiSisiKananBuku.png" alt="Anjeni" />
          </div>
          <div className="book-right">
            <div className="book-text">
              <p>Selamat Ulang Tahun, Anjeni!</p>
              <p>
                Semoga hari spesialmu ini dipenuhi dengan tawa, kebahagiaan, dan kejutan-kejutan manis.
                Terima kasih sudah menjadi teman yang luar biasa.
              </p>
              <p>
                Semoga di usia yang baru ini, semua impianmu perlahan terwujud dan selalu dikelilingi
                oleh orang-orang yang menyayangimu!
              </p>
              <p style={{ marginTop: '20px' }}>
                With love,<br />
                Temanmu
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default SectionAtas;
