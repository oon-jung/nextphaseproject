import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

const systemArchitecture = [
  'Unreal Engine 5',
  'Maya',
  'Motion Capture',
  'Web Interaction',
  'Substance Painter',
  'Midjourney',
  'Nanobanana Pro',
  'Grok',
  'Veo 3.1',
  'CLO 3D',
  'SUNO AI',
];

const developerLog = [
  { name: 'Kim Woon Jung', role: 'AI Image & Video Generation, Video Editing, CLO 3D, Web Development, AI Music' },
  { name: 'Seo Eun Hyeon', role: '3D Modeling, Rigging, Animation' },
  { name: 'Park Young Jun', role: 'Interaction Design, 3D Printing, Stage Design, Animation, Game Engine Development' },
  { name: 'Lee Ji Soo', role: 'AI Image & Video Generation, Video Editing, 3D Modeling, Texturing' },
];

export const FooterSection = () => {
  return (
    <footer id="footer" className="py-24 px-4 relative">
      <div className="container mx-auto max-w-4xl">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <span className="system-label text-neon-purple">
            // 05_SYSTEM_INFO
          </span>
        </motion.div>

        {/* Terminal Window */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="neon-border bg-card/80 backdrop-blur-sm"
        >
          {/* Terminal Header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
            <Icon icon="pixel:monitor" className="w-4 h-4 text-neon-purple" />
            <span className="font-mono text-xs text-muted-foreground">SYSTEM_TERMINAL</span>
            <div className="ml-auto flex gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-neon-mint/50" />
            </div>
          </div>

          {/* Terminal Content */}
          <div className="p-6 md:p-8 terminal-text text-sm space-y-6">
            {/* System Architecture */}
            <div>
              <div className="text-neon-purple mb-2">SYSTEM ARCHITECTURE:</div>
              <div className="text-muted-foreground pl-4">
                {systemArchitecture.join(' / ')}
              </div>
            </div>

            {/* Developer Log */}
            <div>
              <div className="text-neon-purple mb-2">DEVELOPER LOG:</div>
              <div className="space-y-2 pl-4">
                {developerLog.map((dev, index) => (
                  <motion.div
                    key={dev.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="text-muted-foreground"
                  >
                    <span className="text-foreground">{dev.name}:</span>{' '}
                    <span className="text-muted-foreground">{dev.role}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Copyright */}
            <div className="pt-4 border-t border-border/30">
              <div className="text-muted-foreground">
                COPYRIGHT: © 2025 CAPSTONE DESIGN PROJECT. ALL RIGHTS RESERVED.
                <span className="blink-cursor" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-4 font-mono text-xs text-muted-foreground">
            <span className="text-neon-purple">//</span>
            <span>END_OF_TRANSMISSION</span>
            <span className="text-neon-purple">//</span>
          </div>

          {/* Version */}
          <div className="mt-4 font-mono text-xs text-muted-foreground/50">
            PROJECT_NEXT_PHASE v2.0.25 // BUILD_STABLE
          </div>

          {/* Back to top */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="mt-8 p-3 border border-border/50 hover:border-neon-purple transition-colors group"
          >
            <Icon icon="pixel:arrow-up" className="w-5 h-5 text-muted-foreground group-hover:text-neon-purple transition-colors" />
          </motion.button>

          {/* PDF Downloads */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="/docs/%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%EC%A0%9C%EC%95%88%EC%84%9C.pdf"
              download="프로젝트제안서.pdf"
              className="font-mono text-[10px] text-muted-foreground/60 hover:text-neon-cyan transition-colors underline underline-offset-2"
            >
              [제안서.pdf]
            </a>
            <a
              href="/docs/%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8_%EC%B5%9C%EC%A2%85%EB%B3%B4%EA%B3%A0%EC%84%9C.pdf"
              download="프로젝트_최종보고서.pdf"
              className="font-mono text-[10px] text-muted-foreground/60 hover:text-neon-cyan transition-colors underline underline-offset-2"
            >
              [최종보고서.pdf]
            </a>
            <a
              href="/docs/%EA%B2%B0%EA%B3%BC%EB%AC%BC_%EB%A7%A4%EB%89%B4%EC%96%BC.pdf"
              download="결과물_매뉴얼.pdf"
              className="font-mono text-[10px] text-muted-foreground/60 hover:text-neon-cyan transition-colors underline underline-offset-2"
            >
              [매뉴얼.pdf]
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
