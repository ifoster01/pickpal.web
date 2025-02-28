"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Smartphone, Trophy, Heart, Rocket } from "lucide-react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import PicksImg from "~/assets/media/model-picks.png";
import SavedImg from "~/assets/media/saved-picks.png";
import ParlayImg from "~/assets/media/parlay-generation.png";
import MobileImg from "~/assets/media/ios-saved.png";

const features = [
  {
    icon: <Trophy className="h-6 w-6" />,
    title: "AI Picks",
    description: "Get AI generated picks for your favorite sports",
    image: PicksImg
  },
  {
    icon: <Heart className="h-6 w-6" />,
    title: "Save Favorites",
    description: "Save your favorite picks for easy access",
    image: SavedImg
  },
  {
    icon: <Rocket className="h-6 w-6" />,
    title: "Parlay Generator",
    description: "Generate parlay bets for your favorite sports",
    image: ParlayImg
  },
  {
    icon: <Smartphone className="h-6 w-6" />,
    title: "Mobile First",
    description: "Optimized experience across all devices",
    image: MobileImg
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to make informed decisions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, description, image, index }: any) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Card className="p-6 h-full hover:shadow-lg transition-shadow flex flex-col">
        <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        <div className="relative aspect-square w-full mt-auto overflow-hidden">
          <Image 
            src={image} 
            alt={title} 
            className={title === 'Mobile First' ? "object-cover object-top" : "object-cover"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>
      </Card>
    </motion.div>
  );
}