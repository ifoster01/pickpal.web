"use client";

import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface OddsComparisonProps {
  modelOdds: number;
  bookOdds: number;
}

export function OddsComparison({ modelOdds, bookOdds }: OddsComparisonProps) {
  const formatOdds = (odds: number) => (odds > 0 ? `+${odds}` : odds.toString());
  const getOddsColor = (modelOdds: number, bookOdds: number) => {
    const diff = Math.abs(modelOdds - bookOdds);
    return diff > 50 ? "text-green-500" : "text-foreground";
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <span className={`text-2xl font-bold ${getOddsColor(modelOdds, bookOdds)}`}>
              {formatOdds(modelOdds)}
            </span>
            <span className="text-sm text-muted-foreground">
              ({formatOdds(bookOdds)})
            </span>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Model Odds vs Book Odds</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}