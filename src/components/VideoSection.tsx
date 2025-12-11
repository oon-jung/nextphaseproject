import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

export const VideoSection = () => {
  // Replace with your actual YouTube video ID
  const youtubeVideoId = 'dQw4w9WgXcQ'; // Placeholder - user should replace this

  return (
    <section id="video" className="min-h-screen py-24 px-4 relative overflow-hidden">
      {/* Background Glow */}
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
            // 03_B_VIDEO_LOG: THE CROSSOVER
          </h2>
        </motion.div>

        {/* CRT Monitor Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto"
        >
          {/* Outer Monitor Frame */}
          <div className="relative bg-card/30 rounded-[24px] p-3 md:p-4
                          border-[3px] border-neon-purple/60
                          shadow-[0_0_30px_rgba(182,154,255,0.3),inset_0_0_30px_rgba(0,0,0,0.5)]">
            
            {/* Monitor Top Bar */}
            <div className="flex items-center justify-between px-4 py-2 mb-2 rounded-t-lg bg-background/50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-neon-mint animate-pulse" />
                <span className="font-mono text-xs text-neon-mint">SIGNAL_ACTIVE</span>
              </div>
              <div className="flex items-center gap-3">
                <Icon icon="pixel:screen" className="w-4 h-4 text-muted-foreground" />
                <span className="font-mono text-xs text-muted-foreground">CRT_DISPLAY_v2.1</span>
              </div>
            </div>

            {/* Video Container */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-background">
              {/* REC Indicator */}
              <div className="absolute top-3 left-3 z-20 flex items-center gap-2 pointer-events-none">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="font-mono text-xs text-red-500 font-bold">[ REC ]</span>
              </div>

              {/* Timecode */}
              <div className="absolute top-3 right-3 z-20 pointer-events-none">
                <span className="font-mono text-xs text-foreground/60 bg-background/50 px-2 py-1 rounded">
                  00:03:27:15
                </span>
              </div>

              {/* YouTube Embed */}
              <iframe
                src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=0&mute=1&controls=1&loop=1&playlist=${youtubeVideoId}&rel=0`}
                title="PROJECT NEXT PHASE - Music Video"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />

              {/* Scanlines Overlay */}
              <div className="scanlines absolute inset-0 pointer-events-none opacity-20" />

              {/* CRT Vignette Effect */}
              <div className="absolute inset-0 pointer-events-none"
                   style={{
                     background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.4) 100%)',
                   }} 
              />

              {/* Screen Edge Glow */}
              <div className="absolute inset-0 pointer-events-none rounded-lg"
                   style={{
                     boxShadow: 'inset 0 0 60px rgba(182,154,255,0.1)',
                   }}
              />
            </div>

            {/* Monitor Bottom Bar */}
            <div className="flex items-center justify-between px-4 py-2 mt-2 rounded-b-lg bg-background/50">
              <div className="flex items-center gap-4">
                <Icon icon="pixel:play" className="w-4 h-4 text-neon-purple" />
                <span className="font-mono text-xs text-muted-foreground">2D_MEMORY_ARCHIVE.mp4</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="pixel:volume-full" className="w-4 h-4 text-muted-foreground" />
                <div className="w-16 h-1 bg-border/50 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-neon-purple/60 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Monitor Stand */}
          <div className="mx-auto w-24 h-4 bg-gradient-to-b from-card/50 to-card/30 rounded-b-lg" />
          <div className="mx-auto w-40 h-2 bg-card/40 rounded-full" />
        </motion.div>

        {/* Caption */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="font-mono text-sm text-neon-purple animate-pulse">
            SYSTEM UNLOCKED: PLAYING 2D MEMORY ARCHIVE...
          </p>
          <p className="mt-4 font-mono text-xs text-muted-foreground max-w-lg mx-auto">
            이 영상은 2D 세계에서 기록된 마지막 아카이브입니다. <br />
            시스템 오류 발생 직전, 각성의 순간을 담고 있습니다.
          </p>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-40 bg-gradient-to-b from-transparent via-neon-purple/30 to-transparent" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-40 bg-gradient-to-b from-transparent via-neon-purple/30 to-transparent" />
      </div>
    </section>
  );
};
