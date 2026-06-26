import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import SectionAtas from './components/SectionAtas'
import SectionBawah from './components/SectionBawah'
import './index.css'

function App() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set initial start time and zero volume for fade-in
    audio.currentTime = 100;
    audio.volume = 0;
    
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        setIsPlaying(true);
        
        // Fade in volume gradually
        let currentVol = 0;
        const fadeInterval = setInterval(() => {
          currentVol += 0.05;
          if (currentVol >= 1) {
            clearInterval(fadeInterval);
            audio.volume = 1;
          } else {
            audio.volume = currentVol;
          }
        }, 150); // takes about 3 seconds to fully fade in
        
      }).catch(error => {
        // Autoplay was prevented by the browser. Reset volume so manual play works.
        console.log("Autoplay blocked by browser policy.");
        audio.volume = 1;
      });
    }
  }, []);

  const toggleMusic = () => {
    if (isPlaying) {
      audioRef.current?.pause()
    } else {
      if (audioRef.current) {
        // Start exactly at 1:40 (100 seconds) if it hasn't reached there yet
        if (audioRef.current.currentTime < 100) {
          audioRef.current.currentTime = 100;
        }
        audioRef.current.volume = 1; // Ensure full volume on manual play
        audioRef.current.play()
      }
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <motion.div
      className="app-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Background music */}
      <audio ref={audioRef} loop>
        <source src="/assets/lagu_anjeni.mp3" type="audio/mpeg" />
      </audio>

      <button className="music-btn" onClick={toggleMusic}>
        {isPlaying ? 'Stop Music' : 'Play Music'}
      </button>

      <SectionAtas />
      
      <div className="section-divider"></div>
      
      <SectionBawah />
    </motion.div>
  )
}

export default App
