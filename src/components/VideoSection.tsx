import { motion } from 'framer-motion';

export const VideoSection = () => {
  // Extract video ID from YouTube URL
  const videoId = '0jMcE6W8ViQ';

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center py-20 px-4 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <span className="text-xs tracking-[0.3em] text-neon-cyan font-mono mb-4 block">
          [ VISUAL_TRANSMISSION ]
        </span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-wider">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-neon-pink to-neon-purple">
            BROADCAST
          </span>
        </h2>
      </motion.div>

      {/* Video Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="relative w-full max-w-4xl"
      >
        {/* Glowing Border */}
        <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan via-neon-pink to-neon-purple rounded-lg blur-sm opacity-75" />
        
        {/* Video Frame */}
        <div className="relative bg-background rounded-lg overflow-hidden border border-white/10">
          {/* Scanline Effect */}
          <div className="absolute inset-0 pointer-events-none z-10 opacity-20">
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)'
              }}
            />
          </div>

          {/* YouTube Embed */}
          <div className="relative aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
              title="Project Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>

        {/* Corner Decorations */}
        <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-neon-cyan" />
        <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-neon-pink" />
        <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-neon-pink" />
        <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-neon-cyan" />
      </motion.div>

      {/* Status Text */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
        className="mt-8 font-mono text-xs text-white/50 tracking-wider"
      >
        [ STREAM_STATUS: LIVE // QUALITY: 4K_ULTRA ]
      </motion.div>
    </section>
  );
};
