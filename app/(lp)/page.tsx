import { Navbar } from '@/components/ui/navbar';
import { Hero } from '@/components/sections/hero';
import { Features } from '@/components/sections/features';
import { About } from '@/components/sections/about';
import { MobileApp } from '@/components/sections/mobile-app';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
      <About />
      <MobileApp />
    </main>
  );
}