"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export default function SavedPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-3xl font-bold mb-8">Saved Picks</h1>
      <Card className="p-6">
        <p className="text-muted-foreground">Your saved picks will appear here.</p>
      </Card>
    </motion.div>
  );
}