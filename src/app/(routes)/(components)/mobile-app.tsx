"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download, Link2 } from "lucide-react";
import Link from "next/link";
import PickpocktIcon from "~/assets/logos/pickpockt-icon.png";
export function MobileApp() {
  return (
    <section id="mobile-app" className="py-24 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-bold mb-4">Get Our Mobile App</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Experience the full power of our platform on the go. Download our iOS app 
              for a seamless mobile experience.
            </p>
            <Button size="lg" className="gap-2">
              <Download className="h-5 w-5" />
              <Link href="https://apps.apple.com/us/app/pickpockt/id6736374764" target="_blank">
                Download on iOS
              </Link>
            </Button>
            <Button size="lg" variant='outline' className="ml-4 gap-2">
              <Link2 className="h-5 w-5" />
              <Link href="https://testflight.apple.com/join/YpgPyVs5" target="_blank">
                Test Flight Beta
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative mx-auto w-full max-w-[300px]"
          >
            <Image
              src={PickpocktIcon}
              alt="Mobile App"
              width={300}
              height={300}
              className="rounded-[32px] shadow-2xl mx-auto mb-8"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}