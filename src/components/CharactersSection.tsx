import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Hands, HAND_CONNECTIONS } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

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
  image: string;
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
    image: '/gaeon_visual.png',
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
    image: '/doa_visual.png',
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
    image: '/ram_visual.png',
  },
];

const BentoGridModal = ({
  character,
  isOpen,
  onClose,
}: {
  character: Character | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [isHandTracking, setIsHandTracking] = useState(false);
  const [isOpenPalm, setIsOpenPalm] = useState(false);
  const [handPosition, setHandPosition] = useState({ x: 0.5, y: 0.5 });
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const videoRef = useRef<HTMLVideoElement>(null);
  const handsRef = useRef<Hands | null>(null);
  const cameraRef = useRef<Camera | null>(null);

  // Mouse tracking fallback
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isHandTracking) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  };

  // Start hand tracking
  const startHandTracking = async () => {
    if (!videoRef.current) return;

    try {
      const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 0,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      hands.onResults((results) => {
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          const landmarks = results.multiHandLandmarks[0];
          // Get palm center (landmark 9)
          const palmX = landmarks[9].x;
          const palmY = landmarks[9].y;
          setHandPosition({ x: 1 - palmX, y: palmY });

          // Detect open palm (check finger extension)
          const thumbTip = landmarks[4];
          const indexTip = landmarks[8];
          const middleTip = landmarks[12];
          const ringTip = landmarks[16];
          const pinkyTip = landmarks[20];
          const wrist = landmarks[0];

          const avgFingerY = (thumbTip.y + indexTip.y + middleTip.y + ringTip.y + pinkyTip.y) / 5;
          const isOpen = avgFingerY < wrist.y - 0.1;
          setIsOpenPalm(isOpen);
        }
      });

      handsRef.current = hands;

      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          if (handsRef.current && videoRef.current) {
            await handsRef.current.send({ image: videoRef.current });
          }
        },
        width: 320,
        height: 240,
      });

      cameraRef.current = camera;
      await camera.start();
      setIsHandTracking(true);
    } catch (error) {
      console.error('Hand tracking error:', error);
    }
  };

  const stopHandTracking = () => {
    if (cameraRef.current) {
      cameraRef.current.stop();
    }
    setIsHandTracking(false);
    setIsOpenPalm(false);
  };

  useEffect(() => {
    return () => {
      stopHandTracking();
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      stopHandTracking();
    }
  }, [isOpen]);

  if (!character) return null;

  const position = isHandTracking ? handPosition : mousePosition;
  const rotateX = (position.y - 0.5) * 20;
  const rotateY = (position.x - 0.5) * 20;
  const translateZ = isOpenPalm ? 40 : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl bg-background/95 backdrop-blur-xl border-border/50 p-0 overflow-hidden">
        <div className={`${character.borderClass}`}>
          {/* Hidden video for hand tracking */}
          <video ref={videoRef} className="hidden" playsInline />

          {/* Bento Grid Layout */}
          <div 
            className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 md:p-6 min-h-[500px]"
            onMouseMove={handleMouseMove}
            style={{ perspective: '1000px' }}
          >
            {/* Left Main Box - Character Image */}
            <motion.div
              className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-lg border border-border/30"
              style={{
                transformStyle: 'preserve-3d',
                transform: `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`,
                transition: 'transform 0.1s ease-out',
              }}
            >
              {/* Character Image with Duotone Filter */}
              <div className="absolute inset-0 bg-gradient-to-br from-background to-card">
                <img
                  src={character.image}
                  alt={character.name}
                  className={`w-full h-full object-cover object-top transition-all duration-500 ${
                    isOpenPalm ? '' : 'grayscale'
                  }`}
                  style={{
                    filter: isOpenPalm 
                      ? 'none' 
                      : `grayscale(100%) sepia(100%) saturate(400%) hue-rotate(${
                          character.id === 'gaeon' ? '200' : 
                          character.id === 'doa' ? '290' : '120'
                        }deg)`,
                  }}
                />
              </div>

              {/* Glitch Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute left-0 right-0 h-px"
                    style={{
                      top: `${20 + i * 15}%`,
                      backgroundColor: character.accentColor,
                      opacity: 0.4,
                    }}
                    animate={{
                      scaleX: [0, 1, 0],
                      x: ['-100%', '0%', '100%'],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.2,
                      repeat: Infinity,
                      repeatDelay: 4,
                    }}
                  />
                ))}
              </div>

              {/* Scanlines */}
              <div className="scanlines absolute inset-0 pointer-events-none opacity-30" />

              {/* File indicator */}
              <div className="absolute top-4 left-4 font-mono text-xs bg-background/60 backdrop-blur-sm px-2 py-1 rounded">
                <span className={character.accentClass}>FILE_{character.id.toUpperCase()}.EXE</span>
              </div>

              {/* Hand tracking indicator */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <button
                  onClick={isHandTracking ? stopHandTracking : startHandTracking}
                  className={`font-mono text-xs px-3 py-1.5 rounded border transition-all ${
                    isHandTracking 
                      ? 'border-neon-mint text-neon-mint bg-neon-mint/10' 
                      : 'border-border/50 text-muted-foreground hover:border-neon-purple hover:text-neon-purple'
                  }`}
                >
                  <Icon icon="pixel:video" className="w-4 h-4 inline mr-2" />
                  {isHandTracking ? 'TRACKING ON' : 'START TRACKING'}
                </button>
                {isOpenPalm && (
                  <div className="font-mono text-xs text-neon-mint animate-pulse">
                    ✋ OPEN PALM DETECTED
                  </div>
                )}
              </div>
            </motion.div>

            {/* Right Top Box - Name & Role */}
            <motion.div
              className="p-4 md:p-6 rounded-lg border border-border/30 bg-card/50 backdrop-blur-sm"
              style={{
                transformStyle: 'preserve-3d',
                transform: `rotateX(${-rotateX * 0.5}deg) rotateY(${rotateY * 0.5}deg) translateZ(${translateZ * 0.5}px)`,
                transition: 'transform 0.1s ease-out',
              }}
            >
              <div className="font-mono text-xs text-muted-foreground mb-2">
                // DATA_PROFILE
              </div>
              <h3 className={`text-2xl md:text-3xl font-bold ${character.accentClass} font-display mb-3`}>
                {character.name}
              </h3>
              
              <div className="space-y-2 font-mono text-sm">
                <div className="flex justify-between border-b border-border/30 pb-2">
                  <span className="text-muted-foreground">ROLE:</span>
                  <span className="text-foreground">{character.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">TRAIT:</span>
                  <span className="text-foreground text-right">{character.trait}</span>
                </div>
              </div>

              {/* Status indicator */}
              <div className="mt-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: character.accentColor }} />
                <span className="font-mono text-xs text-muted-foreground">DATA_ACTIVE</span>
              </div>
            </motion.div>

            {/* Right Bottom Box - System Note */}
            <motion.div
              className="p-4 md:p-6 rounded-lg border border-border/30 bg-card/50 backdrop-blur-sm relative overflow-hidden"
              style={{
                transformStyle: 'preserve-3d',
                transform: `rotateX(${-rotateX * 0.5}deg) rotateY(${rotateY * 0.5}deg) translateZ(${translateZ * 0.3}px)`,
                transition: 'transform 0.1s ease-out',
              }}
            >
              {/* Accent glow */}
              <div 
                className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20"
                style={{ backgroundColor: character.accentColor }}
              />

              <div className="font-mono text-xs text-muted-foreground mb-3">
                SYSTEM_NOTE:
              </div>
              <p className={`text-sm italic ${character.accentClass} leading-relaxed`}>
                {character.systemNote}
              </p>

              {/* Progress bars */}
              <div className="mt-4 space-y-2">
                {[
                  { label: 'SYNC', value: 87 },
                  { label: 'INTEGRITY', value: 95 },
                ].map((metric) => (
                  <div key={metric.label}>
                    <div className="flex justify-between font-mono text-xs mb-1">
                      <span className="text-muted-foreground">{metric.label}</span>
                      <span style={{ color: character.accentColor }}>{metric.value}%</span>
                    </div>
                    <div className="h-1 bg-border/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: character.accentColor }}
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.value}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Modal Footer */}
          <div className="px-4 md:px-6 py-3 border-t border-border/30 flex items-center justify-between bg-card/30">
            <div className="font-mono text-xs text-muted-foreground">
              손을 움직여 포스터를 회전하세요 | OPEN PALM으로 필터 해제
            </div>
            <button
              onClick={onClose}
              className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              [ CLOSE ]
            </button>
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
          <h2 className="section-title text-neon-purple">
            // 02_DATA FILES: IDOL PROTOCOL
          </h2>
        </motion.div>

        {/* Glassmorphism Interactive UI Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-container rounded-lg p-6 md:p-8 relative"
        >
          {/* Container Header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-neon-purple/20">
            <div className="flex items-center gap-3">
              <Icon icon="pixel:folder-open" className="w-5 h-5 text-neon-purple" />
              <span className="font-mono text-sm text-neon-purple">SECURE_DATA_VAULT</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-mint animate-pulse" />
              <span className="font-mono text-xs text-muted-foreground">CONNECTED</span>
            </div>
          </div>

          {/* Member Folders - Horizontal Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {characters.map((char, index) => (
              <motion.button
                key={char.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.2 }}
                onClick={() => setSelectedCharacter(char)}
                className={`group relative p-5 flex flex-col items-center gap-4 
                           bg-card/50 border border-border/50 rounded-lg
                           transition-all duration-300
                           hover:border-opacity-100 ${char.glowClass}`}
                style={{ borderColor: `${char.accentColor}33` }}
              >
                {/* Character Preview */}
                <div className="relative w-full aspect-[3/4] rounded overflow-hidden mb-2">
                  <img
                    src={char.image}
                    alt={char.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    style={{
                      filter: `grayscale(100%) sepia(100%) saturate(400%) hue-rotate(${
                        char.id === 'gaeon' ? '200' : 
                        char.id === 'doa' ? '290' : '120'
                      }deg)`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                  
                  {/* Hover glitch effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute left-0 right-0 h-0.5 animate-pulse"
                        style={{
                          top: `${30 + i * 20}%`,
                          backgroundColor: char.accentColor,
                          opacity: 0.6,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Folder Icon */}
                <div className={`p-2 rounded ${char.bgGradient} bg-gradient-to-br`}>
                  <Icon icon="pixel:folder" className={`w-6 h-6 ${char.accentClass}`} />
                </div>
                
                {/* File Info */}
                <div className="text-center">
                  <div className={`font-bold text-lg ${char.accentClass} font-display`}>{char.name}</div>
                  <div className="font-mono text-xs text-muted-foreground">{char.role}</div>
                </div>
                
                {/* Status */}
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: char.accentColor }} />
                  <span className="font-mono text-xs text-muted-foreground">CLICK TO ACCESS</span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Container Footer */}
          <div className="mt-8 pt-4 border-t border-neon-purple/20 flex items-center justify-between">
            <div className="font-mono text-xs text-muted-foreground">
              TOTAL_FILES: {characters.length} | ENCRYPTION: AES-256
            </div>
            <div className="font-mono text-xs text-neon-purple/60">
              [ HAND TRACKING AVAILABLE ]
            </div>
          </div>
        </motion.div>

        {/* Modal */}
        <BentoGridModal
          character={selectedCharacter}
          isOpen={!!selectedCharacter}
          onClose={() => setSelectedCharacter(null)}
        />
      </div>
    </section>
  );
};
