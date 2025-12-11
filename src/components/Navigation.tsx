import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const navItems = [
  { id: "worldview", label: "WORLDVIEW" },
  { id: "characters", label: "FILES" },
  { id: "audio", label: "AUDIO" },
  { id: "system-crash", label: "CRASH" },
  { id: "reality", label: "REALITY" },
  { id: "footer", label: "SYSTEM" },
];

export const Navigation = () => {
  const [activeSection, setActiveSection] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);

      const sections = navItems.map((item) => document.getElementById(item.id));
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border/50" : ""
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-mono text-sm text-neon-purple hover:text-primary transition-colors"
          >
            // NEXT_PHASE_PROJECT
          </button>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-4 py-2 font-mono text-xs tracking-wider transition-all duration-300 ${
                  activeSection === item.id ? "text-neon-purple" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="text-muted-foreground/50">0{index + 1}/</span>
                {item.label}
              </button>
            ))}
          </div>

          <div className="font-mono text-xs text-muted-foreground">
            <span className="text-neon-purple">SYS</span>_ACTIVE
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
