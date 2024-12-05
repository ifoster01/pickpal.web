"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Image from "next/image";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
        isScrolled ? "bg-background/80 backdrop-blur-md border-b" : ""
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="items-center w-fit">
            <Image src="/pickpockt long.svg" alt="Pickpockt" width={200} height={50} />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("features")}
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("mobile-app")}
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Mobile App
            </button>
            <Button variant="ghost" onClick={() => router.push("/login")}>
              Sign In
            </Button>
            <Button onClick={() => router.push("/signup")}>Sign Up</Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-t"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              <button
                onClick={() => scrollToSection("features")}
                className="block w-full text-left py-2"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="block w-full text-left py-2"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("mobile-app")}
                className="block w-full text-left py-2"
              >
                Mobile App
              </button>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <Button variant="outline" onClick={() => router.push("/login")}>
                  Sign In
                </Button>
                <Button onClick={() => router.push("/signup")}>Sign Up</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}