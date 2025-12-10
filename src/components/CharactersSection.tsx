import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface Character {
  id: string;
  name: string;
  role: string;
  trait: string;
  systemNote: string;
  accentColor: string;
  accentClass: string;
  glowClass: string;
  borderClass: string;
  bgGradient: string;
}

const characters: Character[] = [
  {
    id: 'gaeon',
    name: 'GAEON',
    role: 'Main Rapper & Dancer',
    trait: 'Husky Voice, Model Aura',
    systemNote: '"차가운 데이터 뒤에 숨겨진 온기 감지됨."',
    accentColor: '#2E59FF',
    accentClass: 'text-neon-blue',
    glowClass: 'hover-glow-blue',
    borderClass: 'neon-border-blue',
    bgGradient: 'from-neon-blue/20 to-transparent',
  },
  {
    id: 'doa',
    name: 'DOA',
    role: 'Leader & Vocal',
    trait: 'Reversal Charm, Thoughtful',
    systemNote: '"예측 불가능한 리더십. 알고리즘 불일치."',
    accentColor: '#FF0099',
    accentClass: 'text-neon-pink',
    glowClass: 'hover-glow-pink',
    borderClass: 'neon-border-pink',
    bgGradient: 'from-neon-pink/20 to-transparent',
  },
  {
    id: 'ram',
    name: 'RAM',
    role: 'Mood Maker',
    trait: 'Red Hair, Unstoppable Energy',
    systemNote: '"에너지 수치 초과. 통제 불가능."',
    accentColor: '#00FF9D',
    accentClass: 'text-neon-mint',
    glowClass: 'hover-glow-mint',
    borderClass: 'neon-border-mint',
    bgGradient: 'from-neon-mint/20 to-transparent',
  },
];

const CharacterModal = ({
  character,
  isOpen,
  onClose,
}: {
  character: Character | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!character) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-card border-border/50 p-0 overflow-hidden">
        <div className={`${character.borderClass}`}>
          <div className="grid md:grid-cols-2 gap-0">
            {/* Visual Side */}
            <div className={`relative aspect-[3/4] md:aspect-auto bg-gradient-to-br ${character.bgGradient} overflow-hidden`}>
              <motion.div
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {/* Placeholder for character visual */}
                <div className="relative w-full h-full">
                  {/* Glitch overlay on hover handled via CSS */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`text-8xl font-bold ${character.accentClass} opacity-20`}
                      >
                        {character.name.charAt(0)}
                      </motion.div>
                      <div className="font-mono text-xs text-muted-foreground mt-4">
                        [ VISUAL_PLACEHOLDER ]
                      </div>
                    </div>
                  </div>

                  {/* Glitch lines */}
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute left-0 right-0 h-px"
                      style={{
                        top: `${20 + i * 15}%`,
                        backgroundColor: character.accentColor,
                        opacity: 0.3,
                      }}
                      animate={{
                        scaleX: [0, 1, 0],
                        x: ['-100%', '0%', '100%'],
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.2,
                        repeat: Infinity,
                        repeatDelay: 3,
                      }}
                    />
                  ))}
                </div>
              </motion.div>

              {/* File indicator */}
              <div className="absolute top-4 left-4 font-mono text-xs">
                <span className={character.accentClass}>FILE_{character.id.toUpperCase()}</span>
              </div>
            </div>

            {/* Data Side */}
            <div className="p-6 md:p-8 bg-card">
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <div className="font-mono text-xs text-muted-foreground mb-2">
                    // DATA_PROFILE
                  </div>
                  <h3 className={`text-3xl font-bold ${character.accentClass}`}>
                    {character.name}
                  </h3>
                </div>

                {/* Data Table */}
                <div className="space-y-4 font-mono text-sm">
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">NAME:</span>
                    <span className="text-foreground">{character.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">ROLE:</span>
                    <span className="text-foreground">{character.role}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">TRAIT:</span>
                    <span className="text-foreground">{character.trait}</span>
                  </div>
                </div>

                {/* System Note */}
                <div className={`p-4 ${character.borderClass} bg-background/50`}>
                  <div className="font-mono text-xs text-muted-foreground mb-2">
                    SYSTEM_NOTE:
                  </div>
                  <p className={`text-sm italic ${character.accentClass}`}>
                    {character.systemNote}
                  </p>
                </div>

                {/* Progress Bars */}
                <div className="space-y-3">
                  <div className="font-mono text-xs text-muted-foreground mb-2">
                    // PERFORMANCE_METRICS
                  </div>
                  {[
                    { label: 'VOCAL', value: character.id === 'doa' ? 95 : character.id === 'gaeon' ? 75 : 80 },
                    { label: 'DANCE', value: character.id === 'gaeon' ? 95 : character.id === 'ram' ? 85 : 80 },
                    { label: 'CHARM', value: character.id === 'ram' ? 100 : character.id === 'doa' ? 90 : 85 },
                  ].map((metric) => (
                    <div key={metric.label}>
                      <div className="flex justify-between font-mono text-xs mb-1">
                        <span className="text-muted-foreground">{metric.label}</span>
                        <span className={character.accentClass}>{metric.value}%</span>
                      </div>
                      <div className="cyber-progress">
                        <motion.div
                          className="cyber-progress-bar"
                          style={{ backgroundColor: character.accentColor }}
                          initial={{ width: 0 }}
                          animate={{ width: `${metric.value}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const CharactersSection = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  return (
    <section id="characters" className="min-h-screen py-24 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <span className="system-label text-neon-purple">
            // 02_DATA FILES: IDOL PROTOCOL
          </span>
        </motion.div>

        {/* Folder Tabs */}
        <div className="flex flex-wrap gap-4 mb-12">
          {characters.map((char, index) => (
            <motion.button
              key={char.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedCharacter(char)}
              className={`folder-tab flex items-center gap-2 ${char.glowClass}`}
            >
              <Icon icon="pixel:folder" className={`w-4 h-4 ${char.accentClass}`} />
              <span className="font-mono text-sm">{char.name}</span>
            </motion.button>
          ))}
        </div>

        {/* Character Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {characters.map((char, index) => (
            <motion.div
              key={char.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              onClick={() => setSelectedCharacter(char)}
              className={`cursor-pointer group ${char.borderClass} bg-card/50 backdrop-blur-sm p-6 transition-all duration-300 hover:scale-[1.02] ${char.glowClass}`}
            >
              {/* Visual Preview */}
              <div className={`aspect-[3/4] mb-4 relative overflow-hidden bg-gradient-to-br ${char.bgGradient}`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.span
                    className={`text-6xl font-bold ${char.accentClass} opacity-30 group-hover:opacity-50 transition-opacity`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {char.name.charAt(0)}
                  </motion.span>
                </div>

                {/* Hover Glitch Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute left-0 right-0 h-1"
                      style={{
                        top: `${30 + i * 20}%`,
                        backgroundColor: char.accentColor,
                        opacity: 0.5,
                        animation: `glitch-horizontal 0.3s ease-in-out ${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>

                {/* Open indicator */}
                <div className="absolute bottom-4 right-4 font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className={char.accentClass}>[ OPEN DATA FILE ]</span>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-2">
                <h3 className={`text-xl font-bold ${char.accentClass}`}>{char.name}</h3>
                <p className="font-mono text-xs text-muted-foreground">{char.role}</p>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <Icon icon="pixel:play" className={`w-3 h-3 ${char.accentClass}`} />
                  <span className="text-muted-foreground">CLICK TO ACCESS</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        <CharacterModal
          character={selectedCharacter}
          isOpen={!!selectedCharacter}
          onClose={() => setSelectedCharacter(null)}
        />
      </div>
    </section>
  );
};
