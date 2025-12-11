import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

export const HeroSection = () => {
  const unicornRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Unicorn Studio
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.innerHTML = `
      !function(){
        if(!window.UnicornStudio){
          window.UnicornStudio={isInitialized:!1};
          var i=document.createElement("script");
          i.src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.5.2/dist/unicornStudio.umd.js";
          i.onload=function(){
            window.UnicornStudio.isInitialized||(UnicornStudio.init(),window.UnicornStudio.isInitialized=!0)
          };
          (document.head || document.body).appendChild(i)
        }
      }();
    `;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const scrollToNext = () => {
    const worldview = document.getElementById("worldview");
    if (worldview) {
      worldview.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Unicorn Studio Background */}
      <div className="absolute inset-0 z-0">
        <div
          data-us-project="5cdsodKRg5XKOUHPRYha"
          className="w-full h-full"
          style={{ minWidth: "100%", minHeight: "100%" }}
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background z-10" />

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center"
        >
          {/* Main Title */}
          <h1
            className="glitch text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6"
            data-text="PROJECT NEXT PHASE"
          >
            <span className="bg-gradient-to-r from-neon-purple via-foreground to-neon-blue bg-clip-text text-transparent">
              NEXT PHASE PROJECT
            </span>
          </h1>

          {/* System Status */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="font-mono text-sm md:text-base text-neon-purple mb-8"
          >
            <span className="inline-flex items-center gap-2">
              <span className="w-2 h-2 bg-neon-purple rounded-full animate-pulse" />
              [ SYSTEM LOADING ]
              <span className="blink-cursor" />
            </span>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="font-mono text-xs md:text-sm text-muted-foreground max-w-xl mx-auto"
          >
            A 2D–3D Hybrid Interactive Music Video // Capstone Design Project I in the Department of Art & Technology
          </motion.p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          onClick={scrollToNext}
          className="absolute bottom-12 flex flex-col items-center gap-2 text-muted-foreground hover:text-neon-purple transition-colors cursor-pointer group"
        >
          <span className="font-mono text-xs tracking-widest">SCROLL TO ACCESS NEXT PHASE</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <Icon icon="pixel:arrow-down" className="w-6 h-6 group-hover:text-neon-purple" />
          </motion.div>
        </motion.button>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-4 left-4 font-mono text-xs text-muted-foreground/50 z-20">
        <span>// INIT_SEQUENCE</span>
      </div>
      <div className="absolute top-4 right-4 font-mono text-xs text-muted-foreground/50 z-20">
        <span>v2.0.25</span>
      </div>
    </section>
  );
};
