"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export default function ParlayPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <h1 className="text-3xl font-bold mb-8">Parlay Builder</h1>
      <Card className="w-full p-6">
        <p className="text-muted-foreground">Build your parlay by adding picks from the Picks page.</p>
      </Card>
    </motion.div>
  );
}