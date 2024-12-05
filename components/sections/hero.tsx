"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BackgroundAnimation } from "@/components/ui/background-animation";

export function Hero() {
  return (
    <section className="min-h-screen relative overflow-hidden flex items-center">
      <BackgroundAnimation />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background/95 -z-10" />
      
      <div className="container mx-auto px-4 py-32">
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
            className="text-xl text-muted-foreground mb-8"
          >
            Experience the next generation of digital interaction with our cutting-edge platform
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" className="text-lg">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="text-lg">
              Learn More
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}