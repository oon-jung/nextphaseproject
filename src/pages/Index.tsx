import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { WorldviewSection } from '@/components/WorldviewSection';
import { CharactersSection } from '@/components/CharactersSection';
import { AudioPlayerSection } from '@/components/AudioPlayerSection';
import { VideoSection } from '@/components/VideoSection';
import { SystemCrashSection } from '@/components/SystemCrashSection';
import { RealityDebutSection } from '@/components/RealityDebutSection';
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
        <VideoSection />
        <SystemCrashSection />
        <RealityDebutSection />
        <FooterSection />
      </main>
    </div>
  );
};

export default Index;