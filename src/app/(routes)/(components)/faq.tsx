"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-b border-muted"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full py-6 text-left"
      >
        <span className="text-lg font-medium">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-muted-foreground">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export function FAQ() {
  const faqs = [
    {
      question: "How does the platform work?",
      answer: "Our platform uses advanced analytics and machine learning to provide insights for sports betting. We analyze historical data, current trends, and various other factors to help you make informed decisions."
    },
    {
      question: "What sports are covered?",
      answer: "We currently cover the NFL, UFC, and NBA but are currently working on expanding to other sports."
    },
    {
      question: "Is there a mobile app available?",
      answer: "Yes! Our mobile app is currently available for iOS with an Android version coming soon. Offering the same powerful features as our web platform with the convenience of mobile access."
    },
    {
      question: "What makes your platform unique?",
      answer: "We combine cutting-edge technology with user-friendly design to deliver actionable insights. Our platform stands out through its real-time analytics, personalized parlay generation, and comprehensive data visualization."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-4xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <FAQItem key={index} {...faq} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
} 