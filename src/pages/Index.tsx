import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { WorldviewSection } from '@/components/WorldviewSection';
import { CharactersSection } from '@/components/CharactersSection';
import { AudioPlayerSection } from '@/components/AudioPlayerSection';
import { SystemCrashSection } from '@/components/SystemCrashSection';
import { FooterSection } from '@/components/FooterSection';

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Film Grain Overlay */}
      <div className="film-grain" />

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main>
        <HeroSection />
        <WorldviewSection />
        <CharactersSection />
        <AudioPlayerSection />
        <SystemCrashSection />
        <FooterSection />
      </main>
    </div>
  );
};

export default Index;