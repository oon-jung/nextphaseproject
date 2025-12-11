import { useState, useRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Icon } from '@iconify/react';

// Team colors
const COLORS = {
  purple: '#b69aff',
  blue: '#2E59FF',
  pink: '#FF0099',
  mint: '#00FF9D',
};

export const RealityDebutSection = () => {
  const [count, setCount] = useState(0);
  const [milestone, setMilestone] = useState<'none' | 'signal' | 'surge' | 'complete'>('none');
  const [message, setMessage] = useState('AWAITING INPUT...');
  const sectionRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const getProgressColor = () => {
    switch (milestone) {
      case 'signal': return 'from-neon-blue to-neon-blue';
      case 'surge': return 'from-neon-pink to-neon-blue';
      case 'complete': return 'from-neon-purple via-neon-pink to-neon-mint';
      default: return 'from-neon-purple/50 to-neon-purple';
    }
  };

  const triggerSmallBurst = (x: number, y: number) => {
    confetti({
      particleCount: 3,
      spread: 20,
      startVelocity: 15,
      origin: { x: x / window.innerWidth, y: y / window.innerHeight },
      colors: [COLORS.purple],
      scalar: 0.6,
      gravity: 1.5,
      ticks: 50,
    });
  };

  const triggerStarBurst = () => {
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.6 },
      colors: [COLORS.blue],
      shapes: ['star'],
      scalar: 1.2,
    });
  };

  const triggerWideSpread = () => {
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.6 },
      colors: [COLORS.pink, COLORS.blue],
    });
  };

  const triggerFireworks = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: [COLORS.purple, COLORS.blue, COLORS.pink, COLORS.mint],
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: [COLORS.purple, COLORS.blue, COLORS.pink, COLORS.mint],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (milestone === 'complete') return;

    const newCount = count + 1;
    setCount(newCount);

    // Small burst on every click
    triggerSmallBurst(e.clientX, e.clientY);

    // Milestone checks
    if (newCount >= 100) {
      setMilestone('complete');
      setMessage('SYSTEM UNLOCKED: DEBUT CONFIRMED!');
      triggerFireworks();
    } else if (newCount >= 50 && milestone !== 'surge') {
      setMilestone('surge');
      setMessage('ENERGY SURGE! KEEP GOING!');
      triggerWideSpread();
    } else if (newCount >= 10 && milestone === 'none') {
      setMilestone('signal');
      setMessage('SIGNAL DETECTED...');
      triggerStarBurst();
    }
  }, [count, milestone]);

  const progressPercentage = Math.min((count / 100) * 100, 100);

  return (
    <section
      ref={sectionRef}
      id="reality"
      className="relative min-h-screen py-24 px-6 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 bg-cyber-grid opacity-10" />
      
      {/* Scanlines */}
      <div className="scanlines" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-2xl mx-auto"
      >
        {/* Section Label */}
        <span className="system-label text-neon-purple mb-4 block">
          // 04_NEXT PHASE: REALITY DEBUT
        </span>

        {/* Title */}
        <h2 className="section-title text-4xl md:text-5xl mb-8">
          <span className="text-foreground">CHEER TO </span>
          <span className="text-neon-purple">UNLOCK</span>
        </h2>

        {/* Subtitle */}
        <p className="text-muted-foreground mb-12 font-mono text-sm">
          버튼을 눌러 현실로 나온 멤버들을 응원해주세요.
        </p>

        {/* Lightstick Button */}
        <div className="flex flex-col items-center gap-8">
          <motion.button
            ref={buttonRef}
            onClick={handleClick}
            disabled={milestone === 'complete'}
            whileTap={{ scale: 0.95 }}
            className={`
              relative w-32 h-32 md:w-40 md:h-40 rounded-full
              border-4 border-neon-purple
              bg-background/50 backdrop-blur-sm
              flex items-center justify-center
              transition-all duration-300
              ${milestone === 'complete' 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:shadow-[0_0_40px_rgba(182,154,255,0.6)] cursor-pointer'}
            `}
            style={{
              boxShadow: milestone !== 'complete' 
                ? '0 0 20px rgba(182,154,255,0.4), inset 0 0 20px rgba(182,154,255,0.1)' 
                : 'none',
            }}
          >
            {/* Pulse Animation Ring */}
            {milestone !== 'complete' && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-neon-purple"
                animate={{
                  scale: [1, 1.3, 1.3],
                  opacity: [0.6, 0, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
            )}

            {/* Icon */}
            {milestone === 'complete' ? (
              <Icon 
                icon="mdi:check-circle" 
                className="w-16 h-16 md:w-20 md:h-20 text-neon-mint" 
              />
            ) : (
              <Icon 
                icon="mdi:hand-wave" 
                className="w-16 h-16 md:w-20 md:h-20 text-neon-purple" 
              />
            )}
          </motion.button>

          {/* Counter */}
          <div className="text-center">
            <p className="font-mono text-lg md:text-xl text-foreground">
              SYNC RATE: <span className="text-neon-purple font-bold">{count}</span> %
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md">
            <div className="h-3 bg-muted/30 rounded-full overflow-hidden border border-border/30">
              <motion.div
                className={`h-full bg-gradient-to-r ${getProgressColor()} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                style={{
                  boxShadow: milestone !== 'none' 
                    ? '0 0 10px currentColor' 
                    : 'none',
                }}
              />
            </div>
          </div>

          {/* Status Message */}
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
              font-mono text-sm md:text-base px-6 py-3 rounded-lg
              border backdrop-blur-sm
              ${milestone === 'complete' 
                ? 'border-neon-mint/50 text-neon-mint bg-neon-mint/10' 
                : milestone === 'surge'
                  ? 'border-neon-pink/50 text-neon-pink bg-neon-pink/10'
                  : milestone === 'signal'
                    ? 'border-neon-blue/50 text-neon-blue bg-neon-blue/10'
                    : 'border-neon-purple/30 text-muted-foreground bg-muted/10'}
            `}
          >
            {message}
          </motion.div>

          {/* Success Badge */}
          {milestone === 'complete' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="mt-4 px-8 py-4 rounded-lg border-2 border-neon-mint bg-neon-mint/10"
            >
              <p className="font-display text-xl text-neon-mint uppercase tracking-wider">
                ✦ DEBUT CONFIRMED ✦
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
};
