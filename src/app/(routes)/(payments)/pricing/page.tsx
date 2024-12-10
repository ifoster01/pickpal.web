"use client";

import { Button } from "@/components/ui/button";
import { Navbar } from "@/app/(routes)/(components)/navbar";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { useState } from "react";

const PricingCard = ({ 
  tier, 
  price, 
  description, 
  features, 
  isComingSoon = false 
}: { 
  tier: string;
  price: string;
  description: string;
  features: string[];
  isComingSoon?: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative h-full rounded-2xl border bg-card p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <div className="flex flex-col h-full">
          <div className="mb-8">
            <h3 className="text-2xl font-bold">{tier}</h3>
            <div className="mt-4">
              <span className="text-4xl font-bold">{price}</span>
              {price !== "Free" && <span className="text-muted-foreground">/month</span>}
            </div>
            <p className="mt-4 text-muted-foreground">{description}</p>
          </div>
          <ul className="mb-8 space-y-4 flex-grow">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <Check className="mr-3 h-5 w-5 text-primary" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <Button 
            className="w-full" 
            variant={tier === "Pro" ? "default" : "outline"}
            disabled={isComingSoon}
          >
            {isComingSoon ? "Coming Soon" : "Selected"}
          </Button>
        </div>
      </motion.div>
      
      <AnimatePresence>
        {isComingSoon && isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center rounded-2xl bg-background/90 backdrop-blur-sm"
          >
            <div className="text-center">
              <h4 className="text-2xl font-bold mb-2">Coming Soon</h4>
              <p className="text-muted-foreground">Stay tuned for our Pro tier release!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <Navbar />
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-4"
          >
            Simple, Transparent Pricing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground"
          >
            Choose the plan that's right for you
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <PricingCard
            tier="Base"
            price="Free"
            description="Perfect for getting started with sports betting analytics"
            features={[
              "AI-powered predictions",
              "Basic analytics dashboard",
              "Limited historical data access",
              "Standard support",
              "Mobile app access",
              "Community features"
            ]}
          />
          <PricingCard
            tier="Pro"
            price="$3"
            description="Advanced features for serious sports bettors"
            features={[
              "AI-powered predictions",
              "Advanced analytics dashboard",
              "Full historical data access",
              "Priority support",
              "Advanced mobile features",
              "Custom alerts",
              "Expert insights"
            ]}
            isComingSoon={true}
          />
        </div>
      </div>
    </div>
  );
}