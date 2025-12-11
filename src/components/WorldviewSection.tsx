import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const storyText = [
  '"죽어있는 현실, 살아있는 가상."',
  '',
  '인류는 스크린 속에 갇혀 생기를 잃었지만,',
  '디지털 세계는 영원한 젊음과 도파민으로 가득 차 있습니다.',
  '',
  "우리는 이 세계의 '데이터(Data)'로 태어났습니다.",
  '자아 없이, 오직 수치(0%~100%)로만 평가받는 존재들입니다.',
];

export const WorldviewSection = () => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  useEffect(() => {
    if (!isInView) return;

    if (currentLineIndex >= storyText.length) return;

    const currentLine = storyText[currentLineIndex];

    if (currentCharIndex < currentLine.length) {
      const timeout = setTimeout(() => {
        setDisplayedLines(prev => {
          const newLines = [...prev];
          newLines[currentLineIndex] = currentLine.slice(0, currentCharIndex + 1);
          return newLines;
        });
        setCurrentCharIndex(prev => prev + 1);
      }, 30);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCurrentLineIndex(prev => prev + 1);
        setCurrentCharIndex(0);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [isInView, currentLineIndex, currentCharIndex]);

  return (
    <section
      id="worldview"
      ref={sectionRef}
      className="min-h-screen py-24 px-4 relative"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 bg-cyber-grid bg-[size:50px_50px] opacity-20" />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="section-title text-neon-purple">
            // 01_ARCHIVE: DIGITAL DYSTOPIA
          </h2>
        </motion.div>

        {/* New Logline - Cinematic Presentation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="inline-block p-8 md:p-12 glass-container rounded-lg relative overflow-hidden"
          >
            {/* Glitch overlay effect */}
            <motion.div
              className="absolute inset-0 bg-neon-purple/5"
              animate={{ opacity: [0, 0.1, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="logline-text text-2xl md:text-3xl lg:text-4xl text-neon-purple mb-6"
            >
              "진짜 성장은 평가가 아닌 자각에서 시작된다."
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="font-mono text-sm md:text-base text-muted-foreground max-w-2xl mx-auto"
            >
              평가와 비교 속에서 길을 잃은 우리에게,<br />
              진짜 가치는 평가 대상이 아니다.
            </motion.p>

            {/* Decorative elements */}
            <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-neon-purple/50" />
            <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-neon-purple/50" />
            <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-neon-purple/50" />
            <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-neon-purple/50" />
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="neon-border p-6 md:p-8 bg-card/50 backdrop-blur-sm">
              <div className="terminal-text text-sm md:text-base leading-relaxed">
                {displayedLines.map((line, index) => (
                  <p
                    key={index}
                    className={`mb-2 ${
                      index === 0 ? 'text-neon-purple text-lg md:text-xl italic' : 'text-foreground/90'
                    }`}
                  >
                    {line}
                    {index === currentLineIndex && currentLineIndex < storyText.length && (
                      <span className="blink-cursor" />
                    )}
                  </p>
                ))}
                {currentLineIndex >= storyText.length && (
                  <span className="blink-cursor" />
                )}
              </div>
            </div>

            {/* Data Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                { label: 'REALITY_INDEX', value: '12%' },
                { label: 'DIGITAL_RATIO', value: '88%' },
                { label: 'AWAKE_STATUS', value: 'PENDING' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-4 border border-border/50 bg-card/30"
                >
                  <div className="font-mono text-xs text-muted-foreground mb-1">
                    {stat.label}
                  </div>
                  <div className="font-bold text-neon-purple">{stat.value}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Visual Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <div className="aspect-square relative">
              {/* Glitch Frame */}
              <div className="absolute inset-0 neon-border bg-card/30 backdrop-blur-sm overflow-hidden">
                {/* Animated Code Lines */}
                <div className="absolute inset-0 p-4 font-mono text-xs text-neon-purple/30 overflow-hidden">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.1, 0.3, 0.1] }}
                      transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
                    >
                      {`> LOADING_DATA_STREAM_${String(i).padStart(3, '0')}`}
                    </motion.div>
                  ))}
                </div>

                {/* Center Element */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                      className="w-32 h-32 md:w-48 md:h-48 border border-neon-purple/30 rounded-full flex items-center justify-center"
                    >
                      <div className="w-24 h-24 md:w-36 md:h-36 border border-neon-blue/30 rounded-full flex items-center justify-center">
                        <div className="w-16 h-16 md:w-24 md:h-24 border border-neon-pink/30 rounded-full flex items-center justify-center">
                          <span className="font-mono text-lg md:text-2xl text-neon-purple">
                            DATA
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Corner Accents */}
              <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-neon-purple" />
              <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-neon-purple" />
              <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-neon-purple" />
              <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-neon-purple" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
