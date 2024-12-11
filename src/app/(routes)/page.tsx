"use client";

import { useEffect } from "react";
import { Navbar } from './(components)/navbar';
import { Hero } from './(components)/hero';
import { Features } from './(components)/features';
import { About } from './(components)/about';
import { MobileApp } from './(components)/mobile-app';
import { FAQ } from './(components)/faq';
import { Contact } from './(components)/contact';
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