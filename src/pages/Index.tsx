import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { WorldviewSection } from '@/components/WorldviewSection';
import { CharactersSection } from '@/components/CharactersSection';
import { SystemCrashSection } from '@/components/SystemCrashSection';
import { ExhibitionSection } from '@/components/ExhibitionSection';
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
        <SystemCrashSection />
        <ExhibitionSection />
        <FooterSection />
      </main>
    </div>
  );
};

export default Index;
