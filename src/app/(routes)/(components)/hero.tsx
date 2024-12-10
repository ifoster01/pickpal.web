"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

const FloatingBlob = ({ delay = 0, top, left, color = "from-purple-500 to-indigo-500" }: { delay: number, top: string, left: string, color?: string }) => (
  <motion.div
    className={`absolute opacity-75 blur-[100px] bg-gradient-to-br ${color}`}
    style={{
      width: "45rem",
      height: "45rem",
      top,
      left,
    }}
    animate={{
      scale: [1, 1.3, 0.6, 1],
      x: [20, 50, 80, 20],
      y: [0, 30, 0],
    }}
    transition={{
      duration: 15,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
      delay,
    }}
  />
);

export function Hero() {
  return (
    <section className="min-h-screen relative overflow-hidden flex items-center">
      <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
        <FloatingBlob delay={0} top="10%" left="20%" color="from-violet-600 to-purple-600" />
        <FloatingBlob delay={5} top="60%" left="50%" color="from-purple-600 to-indigo-600" />
        <FloatingBlob delay={10} top="30%" left="70%" color="from-indigo-600 to-violet-600" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/70 to-background" style={{ zIndex: 1 }} />
      
      <div className="container relative mx-auto px-4 py-32" style={{ zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full text-sm mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            New Feature Release
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Enrich Your Sports Betting
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-xl mb-8 text-muted-foreground"
          >
              Experience the next generation of sports betting insights with our cutting-edge technology.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" className="text-lg" asChild>
              <Link href="/signup">
                Get Started
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg"
              onClick={() => scrollToSection("features")}
            >
              Learn More
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}