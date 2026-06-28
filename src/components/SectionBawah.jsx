import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const DraggableStar = ({ initialX, initialY, delay = 0, size = '45px', constraintsRef }) => {
  return (
    <motion.div
      drag
      dragConstraints={constraintsRef}
      whileDrag={{ scale: 1.2, cursor: "grabbing" }}
      style={{
        position: 'absolute',
        top: initialY,
        left: initialX,
        width: size,
        height: size,
        cursor: "grab",
        zIndex: 50,
      }}
      animate={{
        y: [0, -20, 0],
        rotate: [0, 15, -15, 0],
      }}
      transition={{
        duration: 4 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay,
      }}
    >
      <img src="/assets/perks_MotifPita.png" alt="Pita" style={{ width: '100%', height: '100%', pointerEvents: 'none', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }} />
    </motion.div>
  );
};

const SectionBawah = () => {
  const [envelopeState, setEnvelopeState] = useState('closed'); // 'closed', 'unlocking', 'opened', 'revealed'
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const constraintsRef = useRef(null);

  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    // If the stamp is dragged far enough horizontally or vertically
    if (Math.abs(info.offset.x) > 100 || Math.abs(info.offset.y) > 100) {
      setDragOffset({ x: info.offset.x, y: info.offset.y });
      setEnvelopeState('unlocking');
      
      // Change to opened state after stamp dissolution animation
      setTimeout(() => {
        setEnvelopeState('opened');
      }, 700);
    }
  };

  const triggerConfetti = () => {
    // 1. Initial side bursts
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 65,
      origin: { x: 0.1, y: 0.6 }
    });
    
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 65,
      origin: { x: 0.9, y: 0.6 }
    });

    // 2. Central blast with delay
    setTimeout(() => {
      confetti({
        particleCount: 110,
        spread: 90,
        origin: { x: 0.5, y: 0.45 }
      });
    }, 200);

    // 3. Continuous gentle sparkles from sides
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 },
        colors: ['#ffb7b2', '#ffdab9', '#e2f0cb', '#b5ead7', '#c7ceea']
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        colors: ['#ffb7b2', '#ffdab9', '#e2f0cb', '#b5ead7', '#c7ceea']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const handleEnvelopeClick = () => {
    if (envelopeState === 'opened') {
      setEnvelopeState('revealed');
      triggerConfetti();
    }
  };

  // Determine wrapper classes (wiggle when closed and not dragging)
  const getEnvelopeClass = () => {
    let classes = "envelope-wrapper";
    if (envelopeState === 'closed' && !isDragging) {
      classes += " envelope-wiggle";
    }
    return classes;
  };

  return (
    <motion.section
      className="section-bawah"
      ref={constraintsRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <DraggableStar constraintsRef={constraintsRef} initialX="10%" initialY="20%" delay={0} size="60px" />
      <DraggableStar constraintsRef={constraintsRef} initialX="85%" initialY="15%" delay={0.5} size="50px" />
      <DraggableStar constraintsRef={constraintsRef} initialX="5%" initialY="60%" delay={0.2} size="45px" />
      <DraggableStar constraintsRef={constraintsRef} initialX="80%" initialY="70%" delay={0.8} size="55px" />
      <DraggableStar constraintsRef={constraintsRef} initialX="20%" initialY="85%" delay={0.4} size="40px" />
      <DraggableStar constraintsRef={constraintsRef} initialX="50%" initialY="10%" delay={1.2} size="48px" />
      <DraggableStar constraintsRef={constraintsRef} initialX="70%" initialY="90%" delay={0.6} size="52px" />
      
      <AnimatePresence mode="wait">
        {envelopeState !== 'revealed' && (
          <motion.h2 
            key="title-closed"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`instruction-text ${envelopeState === 'opened' ? 'instruction-text--highlight' : ''}`}
          >
            {envelopeState === 'closed' ? "There's an envelope for you!" : 
             envelopeState === 'unlocking' ? "Unlocking..." : 
             "Click to open an envelope for you! 💌"}
          </motion.h2>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {envelopeState !== 'revealed' ? (
          <motion.div 
            key="envelope"
            className={getEnvelopeClass()}
            initial={{ opacity: 0, y: 50 }}
            animate={envelopeState === 'opened' ? {
              opacity: 1,
              y: [0, -12, 0, -8, 0, -5, 0],
              rotate: [0, -2, 2, -1.5, 1.5, -1, 0],
              scale: [1, 1.03, 1, 1.02, 1],
              transition: {
                duration: 1.2,
                repeat: Infinity,
                repeatDelay: 1.5,
                ease: 'easeInOut',
              }
            } : { opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            transition={{ duration: 0.5 }}
            onClick={handleEnvelopeClick}
            style={{ cursor: envelopeState === 'opened' ? 'pointer' : 'default' }}
          >
            {/* Glow Aura when unlocking */}
            {envelopeState === 'unlocking' && (
              <div className="envelope-glow" />
            )}

            {/* Envelope Background */}
            <img 
              src={(envelopeState === 'closed' || envelopeState === 'unlocking') ? "/assets/amplop_basic.png" : "/assets/amplop_setelah_stempel_digeser.png"} 
              alt="Envelope" 
              className="envelope-base" 
            />
            
            {/* Draggable Stamp (Closed State) */}
            {envelopeState === 'closed' && (
              <motion.img
                src="/assets/perks_stample.png"
                alt="Stamp"
                className="envelope-stamp"
                drag
                dragConstraints={{ left: -250, right: 250, top: -250, bottom: 250 }}
                dragElastic={0.2}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={handleDragEnd}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              />
            )}

            {/* Dissolving Stamp (Unlocking State) */}
            {envelopeState === 'unlocking' && (
              <motion.img
                src="/assets/perks_stample.png"
                alt="Stamp"
                className="envelope-stamp"
                style={{ x: dragOffset.x, y: dragOffset.y, pointerEvents: 'none' }}
                animate={{
                  scale: [1, 2.2, 0],
                  rotate: [0, 360],
                  opacity: [1, 1, 0],
                  y: dragOffset.y - 100 // float upwards
                }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="content"
            className="content-reveal"
            initial={{ opacity: 0, y: 80, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            {/* Left Polaroid Collage */}
            <motion.div
              className="polaroid-wrapper"
              initial={{ opacity: 0, x: -40, zIndex: 2 }}
              animate={{ opacity: 1, x: 0, zIndex: 2 }}
              whileHover={{ zIndex: 10 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <img 
                src="/assets/polaroid-collage.png" 
                alt="Polaroid Collage" 
                className="polaroid-img"
              />
            </motion.div>

            {/* Right Group: Note Paper + Right Polaroids */}
            <motion.div 
              className="right-group-wrapper"
              initial={{ opacity: 0, x: 40, zIndex: 3 }}
              animate={{ opacity: 1, x: 0, zIndex: 3 }}
              whileHover={{ zIndex: 10 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="right-group">
                <div className="note-paper">
                  <img src="/assets/note-paper-right.png" alt="Note Paper" />
                  <div className="note-text">
                    <p>
                      thankyou for being such a light in my life, you deserve every single bit of happiness today and every day!
                    </p>
                    <p>
                      hapiybisday dubai cuwi kuki ku :3
                    </p>
                  </div>
                </div>

                <div className="polaroid-stack">
                  <motion.img 
                    src="/assets/polaroid-new-left.png" 
                    alt="Polaroid Top" 
                    className="polaroid-stacked"
                    whileHover={{ rotate: -2, scale: 1.08, zIndex: 10 }}
                  />
                  <motion.img 
                    src="/assets/polaroid-new-right.png" 
                    alt="Polaroid Bottom" 
                    className="polaroid-stacked"
                    whileHover={{ rotate: 2, scale: 1.08, zIndex: 10 }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default SectionBawah;
