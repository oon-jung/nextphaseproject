import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

// Kinetic Lyrics for background
const lyricsSequence = [
  "SYSTEM LOADING",
  "ZERO PERCENT",
  "검은 화면 속",
  "나를 깨워",
  "ERROR",
  "BREAK THE SYSTEM",
  "NEXT PHASE",
  "AWAKENING"
];

const KineticLyrics = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % lyricsSequence.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const currentLyric = lyricsSequence[currentIndex];
  const isError = currentLyric === "ERROR";

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
          animate={{ opacity: 0.15, scale: 1, filter: 'blur(0px)' }}
          exit={{ 
            opacity: 0, 
            scale: 1.1,
            filter: 'blur(5px)',
            x: isError ? [0, -10, 10, -10, 0] : 0,
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`text-[6rem] md:text-[10rem] font-display font-bold text-white whitespace-nowrap
            ${isError ? 'text-red-500' : ''}`}
          style={{ 
            mixBlendMode: 'overlay',
            textShadow: isError 
              ? '0 0 20px rgba(255,0,0,0.8), 3px 3px 0 #ff0000, -3px -3px 0 #00ffff' 
              : '0 0 30px rgba(182,154,255,0.3)'
          }}
        >
          {currentLyric}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Wireframe Sphere Component
const WireframeSphere = ({ isPlaying }: { isPlaying: boolean }) => {
  return (
    <div className="relative w-48 h-48 md:w-64 md:h-64">
      {/* Rotating rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border-2 border-neon-purple/40"
          style={{
            transform: `rotateX(${60 + i * 30}deg) rotateY(${i * 45}deg)`,
          }}
          animate={isPlaying ? {
            rotateZ: [0, 360],
            rotateY: [i * 45, i * 45 + 360],
          } : {}}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
      
      {/* Inner glow */}
      <motion.div
        className="absolute inset-8 rounded-full bg-neon-purple/20"
        animate={isPlaying ? {
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
        } : { scale: 1, opacity: 0.1 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Center core */}
      <motion.div
        className="absolute inset-16 rounded-full bg-neon-purple/40 backdrop-blur-sm"
        animate={isPlaying ? {
          boxShadow: [
            '0 0 20px rgba(182,154,255,0.4)',
            '0 0 40px rgba(182,154,255,0.6)',
            '0 0 20px rgba(182,154,255,0.4)',
          ],
        } : {}}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Vertical rings */}
      {[0, 1].map((i) => (
        <motion.div
          key={`v-${i}`}
          className="absolute inset-0 rounded-full border border-neon-purple/30"
          style={{
            transform: `rotateY(${90 + i * 90}deg)`,
          }}
          animate={isPlaying ? {
            rotateX: [0, 360],
          } : {}}
          transition={{
            duration: 10 + i * 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
};

export const AudioPlayerSection = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * duration;
  }, [duration]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <section id="audio" className="min-h-screen py-24 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-purple/5 to-transparent pointer-events-none" />

      <div className="container mx-auto max-w-4xl">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="section-title text-neon-purple">
            // 02_B_AUDIO_LOG: THEME_SONG
          </h2>
        </motion.div>

        {/* Audio Player Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mx-auto"
        >
          {/* Main Container */}
          <div className="relative bg-background/80 backdrop-blur-md rounded-2xl p-8 md:p-12
                          border-2 border-neon-purple/60
                          shadow-[0_0_40px_rgba(182,154,255,0.3),inset_0_0_30px_rgba(0,0,0,0.5)]">
            
            {/* Film Grain Overlay */}
            <div className="absolute inset-0 opacity-20 pointer-events-none rounded-2xl overflow-hidden">
              <div className="w-full h-full bg-noise animate-grain" />
            </div>

            {/* Kinetic Lyrics Background */}
            <KineticLyrics />

            {/* Status Bar */}
            <div className="relative z-10 flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <motion.div 
                  className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-neon-mint' : 'bg-muted-foreground'}`}
                  animate={isPlaying ? { opacity: [1, 0.5, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="font-mono text-xs text-neon-mint">
                  {isPlaying ? 'NOW_PLAYING' : 'STANDBY'}
                </span>
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                DATA_CORE_v3.0
              </span>
            </div>

            {/* Wireframe Sphere */}
            <div className="relative z-10 flex justify-center mb-8">
              <WireframeSphere isPlaying={isPlaying} />
            </div>

            {/* Track Info */}
            <div className="relative z-10 text-center mb-6">
              <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-1">
                THE NEXT PHASE
              </h3>
              <p className="font-mono text-sm text-muted-foreground">
                PROJECT NEXT PHASE // THEME SONG
              </p>
            </div>

            {/* Progress Bar */}
            <div className="relative z-10 mb-6">
              <div 
                className="h-2 bg-border/50 rounded-full cursor-pointer overflow-hidden"
                onClick={handleProgressClick}
              >
                <motion.div 
                  className="h-full bg-gradient-to-r from-neon-purple to-neon-mint rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 font-mono text-xs text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="relative z-10 flex items-center justify-center gap-6">
              {/* Skip Back */}
              <button 
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => { if (audioRef.current) audioRef.current.currentTime = 0; }}
              >
                <Icon icon="pixelarticons:prev" className="w-6 h-6" />
              </button>

              {/* Play/Pause */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={togglePlay}
                className="w-16 h-16 rounded-full bg-neon-purple/20 border-2 border-neon-purple
                           flex items-center justify-center
                           shadow-[0_0_20px_rgba(182,154,255,0.4)]
                           hover:shadow-[0_0_30px_rgba(182,154,255,0.6)]
                           transition-shadow"
              >
                <Icon 
                  icon={isPlaying ? "pixelarticons:pause" : "pixelarticons:play"} 
                  className="w-8 h-8 text-neon-purple" 
                />
              </motion.button>

              {/* Skip Forward */}
              <button 
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => { if (audioRef.current) audioRef.current.currentTime = duration; }}
              >
                <Icon icon="pixelarticons:next" className="w-6 h-6" />
              </button>
            </div>

            {/* Volume Control */}
            <div className="relative z-10 flex items-center justify-center gap-3 mt-6">
              <Icon icon="pixelarticons:volume" className="w-4 h-4 text-muted-foreground" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 h-1 bg-border/50 rounded-full appearance-none cursor-pointer
                           [&::-webkit-slider-thumb]:appearance-none
                           [&::-webkit-slider-thumb]:w-3
                           [&::-webkit-slider-thumb]:h-3
                           [&::-webkit-slider-thumb]:rounded-full
                           [&::-webkit-slider-thumb]:bg-neon-purple"
              />
            </div>

            {/* Scanlines */}
            <div className="scanlines absolute inset-0 pointer-events-none opacity-10 rounded-2xl" />
          </div>
        </motion.div>

        {/* Caption */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center font-mono text-sm text-neon-purple animate-pulse"
        >
          ▶ CLICK PLAY TO INITIALIZE DATA STREAM...
        </motion.p>
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src="/project_theme_song.mp3" preload="metadata" />
    </section>
  );
};
