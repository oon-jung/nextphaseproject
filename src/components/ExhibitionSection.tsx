import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

export const ExhibitionSection = () => {
  const [isLightstickActive, setIsLightstickActive] = useState(false);
  const [glowCount, setGlowCount] = useState(0);

  const handleLightstick = () => {
    setIsLightstickActive(true);
    setGlowCount((prev) => prev + 1);
    setTimeout(() => setIsLightstickActive(false), 500);
  };

  return (
    <section id="exhibition" className="min-h-screen py-24 px-4 relative">
      {/* Lightstick Glow Effect */}
      {isLightstickActive && (
        <div className="fixed inset-0 pointer-events-none z-50 lightstick-active" />
      )}

      <div className="container mx-auto max-w-6xl">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="section-title text-neon-purple">
            // 04_NEXT PHASE: REALITY
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="neon-border p-6 md:p-8 bg-card/50 backdrop-blur-sm">
              <p className="text-lg leading-relaxed text-foreground/90 mb-4">
                시스템의 오류가 만들어낸 틈(Page)을 넘어, 우리는 2D의 감옥을 탈출했습니다.
              </p>
              <p className="text-lg leading-relaxed text-foreground/90">
                이제 <span className="text-neon-purple font-bold">Unreal Engine 5</span>로 구현된 리얼타임 무대에서 당신과 함께 새로운 페이즈(Phase)를 시작합니다.
              </p>
            </div>

            {/* Lightstick Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center lg:text-left"
            >
              <p className="font-mono text-sm text-muted-foreground mb-4">
                버튼을 눌러 현실로 나온 멤버들을 응원해주세요.
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLightstick}
                className="relative px-8 py-4 rounded-full bg-gradient-to-r from-neon-purple/20 to-neon-purple/10 border border-neon-purple text-neon-purple font-mono text-sm tracking-wider transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--neon-purple)/0.5)] group"
              >
                <span className="flex items-center gap-3">
                  <motion.span
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                  >
                    ✨
                  </motion.span>
                  WAVE LIGHTSTICK
                  <motion.span
                    animate={{ rotate: [0, -15, 15, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                  >
                    ✨
                  </motion.span>
                </span>

                {/* Pulse effect */}
                <motion.div
                  className="absolute inset-0 rounded-full border border-neon-purple opacity-0 group-hover:opacity-100"
                  animate={{ scale: [1, 1.2], opacity: [0.5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </motion.button>

              {glowCount > 0 && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-mono text-xs text-neon-purple mt-4"
                >
                  CHEER_COUNT: {glowCount}
                </motion.p>
              )}
            </motion.div>

            {/* Tech Stack */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              {[
                { icon: 'pixel:gamepad', label: 'Unreal Engine 5' },
                { icon: 'pixel:cursor', label: 'Web Interaction' },
                { icon: 'pixel:camera', label: 'Motion Capture' },
                { icon: 'pixel:image', label: '3D Stage Design' },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 border border-border/50 bg-card/30"
                >
                  <Icon icon={item.icon} className="w-5 h-5 text-neon-purple" />
                  <span className="font-mono text-xs text-muted-foreground">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Visual Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-video relative overflow-hidden neon-border bg-card/30">
              {/* Stage Preview Placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 via-transparent to-neon-blue/10">
                {/* Grid floor effect */}
                <div className="absolute inset-0 bg-cyber-grid bg-[size:30px_30px] opacity-30" style={{ perspective: '500px', transform: 'rotateX(60deg) translateY(50%)' }} />

                {/* Center content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="mb-4"
                    >
                      <Icon icon="pixel:display" className="w-16 h-16 text-neon-purple mx-auto" />
                    </motion.div>
                    <div className="font-mono text-sm text-neon-purple">
                      UNREAL ENGINE 5
                    </div>
                    <div className="font-mono text-xs text-muted-foreground mt-1">
                      STAGE PREVIEW
                    </div>
                  </div>
                </div>

                {/* Animated light beams */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute bottom-0 w-1 bg-gradient-to-t from-neon-purple/50 to-transparent"
                    style={{ left: `${25 + i * 25}%`, height: '60%' }}
                    animate={{
                      opacity: [0.3, 0.8, 0.3],
                      scaleY: [0.8, 1, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.3,
                      repeat: Infinity,
                    }}
                  />
                ))}
              </div>

              {/* Corner labels */}
              <div className="absolute top-4 left-4 font-mono text-xs text-muted-foreground">
                [ REAL-TIME RENDER ]
              </div>
              <div className="absolute bottom-4 right-4 font-mono text-xs text-neon-purple">
                v5.0_READY
              </div>

              {/* Scanlines */}
              <div className="scanlines absolute inset-0 pointer-events-none" />
            </div>

            {/* Corner decorations */}
            <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-neon-purple" />
            <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-neon-purple" />
            <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-neon-purple" />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-neon-purple" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
