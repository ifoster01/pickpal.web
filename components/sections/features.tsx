"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Smartphone, Shield, Zap, Trophy, BarChart, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Lightning Fast",
    description: "Get instant access to advanced analytics and predictions"
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Secure",
    description: "Enterprise-grade security protecting your data"
  },
  {
    icon: <BarChart className="h-6 w-6" />,
    title: "Advanced Analytics",
    description: "Powerful insights driven by machine learning"
  },
  {
    icon: <Trophy className="h-6 w-6" />,
    title: "Expert Picks",
    description: "Curated selections from industry experts"
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Real-time Updates",
    description: "Stay informed with instant notifications"
  },
  {
    icon: <Smartphone className="h-6 w-6" />,
    title: "Mobile First",
    description: "Optimized experience across all devices"
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, description, index }: any) {
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
    >
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </Card>
    </motion.div>
  );
}