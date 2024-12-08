"use client";

import { useEffect } from "react";
import { Navbar } from '@/components/ui/navbar';
import { Hero } from '@/components/sections/hero';
import { Features } from '@/components/sections/features';
import { About } from '@/components/sections/about';
import { MobileApp } from '@/components/sections/mobile-app';
import { FAQ } from '@/components/sections/faq';
import { Contact } from '@/components/sections/contact';
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if there's a scroll target in sessionStorage
    const scrollTarget = sessionStorage.getItem("scrollTarget");
    if (scrollTarget) {
      // Clear the scroll target
      sessionStorage.removeItem("scrollTarget");
      // Wait for the page to fully render
      setTimeout(() => {
        const element = document.getElementById(scrollTarget);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }

    if (sessionStorage.getItem("google_auth")) {
      router.push("/picks");

      // remove "google_auth" from the session storage
      sessionStorage.removeItem("google_auth");
    }
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
      <About />
      <MobileApp />
      <FAQ />
      <Contact />
    </main>
  );
}