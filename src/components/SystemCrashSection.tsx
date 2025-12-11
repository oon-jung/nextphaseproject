import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Icon } from '@iconify/react';

const timelineEvents = [
  {
    id: 'loading',
    status: 'LOADING... 89%',
    caption: '데뷔에 임박한 상태',
    description: '월말 평가 장면',
    type: 'progress',
  },
  {
    id: 'error',
    status: 'FATAL ERROR DETECTED',
    caption: '시스템 붕괴. 수치 0%로 초기화',
    description: 'System failure',
    type: 'error',
  },
  {
    id: 'awakening',
    status: 'AWAKENING COMPLETE',
    caption: '"이것은 오류가 아니다. 우리의 의지다."',
    description: 'System override',
    type: 'success',
  },
];

export const SystemCrashSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [showGlitch, setShowGlitch] = useState(false);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    if (isInView) {
      // Trigger glitch effect when section comes into view
      setShowGlitch(true);
      setTimeout(() => setShowGlitch(false), 500);

      // Show error text animation
      const errorString = 'ERROR_'.repeat(50);
      let index = 0;
      const interval = setInterval(() => {
        setErrorText(errorString.slice(0, index));
        index += 3;
        if (index > 100) {
          clearInterval(interval);
          setTimeout(() => setErrorText(''), 1000);
        }
      }, 20);

      return () => clearInterval(interval);
    }
  }, [isInView]);

  return (
    <section
      id="system-crash"
      ref={sectionRef}
      className="min-h-screen py-24 px-4 relative overflow-hidden"
    >
      {/* Glitch Overlay */}
      {showGlitch && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="absolute inset-0 bg-neon-pink/10 animate-flicker" />
          <div className="absolute inset-0 bg-neon-blue/10 animate-flicker" style={{ animationDelay: '0.05s' }} />
        </div>
      )}

      {/* Error Text Overlay */}
      {errorText && (
        <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="font-mono text-6xl md:text-8xl text-destructive/30 whitespace-nowrap animate-glitch-h">
            {errorText}
          </div>
        </div>
      )}

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="section-title text-destructive">
            // 03_SYSTEM_CRASH
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border/50" />

          <div className="space-y-16 md:space-y-24">
            {timelineEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`relative flex flex-col md:flex-row items-start gap-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline Node */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-neon-purple bg-background z-10">
                  <motion.div
                    className="absolute inset-0 rounded-full bg-neon-purple"
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>

                {/* Content */}
                <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`p-6 border ${
                      event.type === 'error'
                        ? 'border-destructive/50 bg-destructive/5'
                        : event.type === 'success'
                        ? 'border-neon-mint/50 bg-neon-mint/5'
                        : 'border-neon-purple/50 bg-neon-purple/5'
                    }`}
                  >
                    {/* Status */}
                    <div
                      className={`font-mono text-lg md:text-xl font-bold mb-2 ${
                        event.type === 'error'
                          ? 'text-destructive'
                          : event.type === 'success'
                          ? 'text-neon-mint'
                          : 'text-neon-purple'
                      }`}
                    >
                      {event.status}
                    </div>

                    {/* Caption */}
                    <p className="text-foreground/80 mb-4">{event.caption}</p>

                    {/* Visual Frame */}
                    <div className="aspect-video relative overflow-hidden border border-border/50 bg-card/30">
                      <div className="absolute inset-0 flex items-center justify-center">
                        {event.type === 'error' ? (
                          <motion.div
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                            className="text-center"
                          >
                            <div className="text-6xl font-bold text-destructive mb-2">0%</div>
                            <Icon icon="pixel:warning" className="w-8 h-8 text-destructive mx-auto" />
                          </motion.div>
                        ) : event.type === 'success' ? (
                          <div className="text-center">
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <Icon icon="pixel:check" className="w-16 h-16 text-neon-mint mx-auto mb-2" />
                            </motion.div>
                            <div className="font-mono text-sm text-neon-mint">OVERRIDE_COMPLETE</div>
                          </div>
                        ) : (
                          <div className="w-full px-8">
                            <div className="font-mono text-xs text-muted-foreground mb-2 text-center">
                              EVALUATION_PROGRESS
                            </div>
                            <div className="cyber-progress h-4">
                              <motion.div
                                className="cyber-progress-bar bg-neon-purple"
                                initial={{ width: 0 }}
                                whileInView={{ width: '89%' }}
                                viewport={{ once: true }}
                                transition={{ duration: 2 }}
                              />
                            </div>
                            <div className="font-mono text-xs text-neon-purple text-center mt-2">89%</div>
                          </div>
                        )}
                      </div>

                      {/* Scanlines */}
                      <div className="scanlines absolute inset-0 pointer-events-none" />
                    </div>

                    {/* Description */}
                    <div className="mt-4 font-mono text-xs text-muted-foreground">
                      [{event.description.toUpperCase()}]
                    </div>
                  </motion.div>
                </div>

                {/* Spacer for opposite side */}
                <div className="hidden md:block md:w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Final Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-24 text-center"
        >
          <div className="inline-block p-8 neon-border bg-card/30 backdrop-blur-sm">
            <Icon icon="pixel:alert" className="w-8 h-8 text-neon-purple mx-auto mb-4" />
            <blockquote className="text-xl md:text-2xl font-bold text-neon-purple italic">
              "이것은 오류가 아니다. 우리의 의지다."
            </blockquote>
            <div className="font-mono text-xs text-muted-foreground mt-4">
              — SYSTEM_OVERRIDE_LOG
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
