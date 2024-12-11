"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";
import Image from "next/image";
import { type Parlay } from "@/utils/parlay";

interface ParlayCardProps {
  parlay: Parlay;
}

export function ParlayCard({ parlay }: ParlayCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formattedBookOdds = parlay.totalBookOdds > 0 
    ? `+${parlay.totalBookOdds}` 
    : parlay.totalBookOdds.toString();

  const formattedModelOdds = parlay.totalModelOdds > 0
    ? `+${parlay.totalModelOdds}`
    : parlay.totalModelOdds.toString();

  return (
    <Card className="overflow-hidden">
      <div 
        className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Mobile Layout */}
        <div className="flex flex-col gap-4 md:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {parlay.legs.slice(0, 2).map((leg) => (
                  <div 
                    key={leg.eventId} 
                    className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-background"
                  >
                    <Image
                      src={leg.picUrl || "/placeholder-fighter.png"}
                      alt={leg.selection || "Selection"}
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                ))}
                {parlay.legs.length > 2 && (
                  <div className="relative w-8 h-8 rounded-full bg-muted flex items-center justify-center border-2 border-background">
                    <span className="text-xs">+{parlay.legs.length - 2}</span>
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold text-sm">{parlay.legs.length} Leg Parlay</p>
                <p className="text-xs text-muted-foreground">
                  {Math.round(parlay.totalModelProbability * 100)}% Probability
                </p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Book</p>
              <p className="font-semibold">{formattedBookOdds}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Model</p>
              <p className="font-semibold text-primary">{formattedModelOdds}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Edge</p>
              <p className={cn(
                "font-semibold",
                parlay.valueEdge > 0 ? "text-green-500" : "text-red-500"
              )}>
                {(parlay.valueEdge * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-4">
              {parlay.legs.slice(0, 3).map((leg) => (
                <div 
                  key={leg.eventId} 
                  className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-background"
                >
                  <Image
                    src={leg.picUrl || "/placeholder-fighter.png"}
                    alt={leg.selection || "Selection"}
                    fill
                    className="object-cover object-top"
                  />
                </div>
              ))}
              {parlay.legs.length > 3 && (
                <div className="relative w-10 h-10 rounded-full bg-muted flex items-center justify-center border-2 border-background">
                  <span className="text-sm">+{parlay.legs.length - 3}</span>
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold">{parlay.legs.length} Leg Parlay</p>
              <p className="text-sm text-muted-foreground">
                {Math.round(parlay.totalModelProbability * 100)}% Probability
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Book Odds</p>
              <p className="font-semibold">{formattedBookOdds}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Model Odds</p>
              <p className="font-semibold text-primary">{formattedModelOdds}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Edge</p>
              <p className={cn(
                "font-semibold",
                parlay.valueEdge > 0 ? "text-green-500" : "text-red-500"
              )}>
                {(parlay.valueEdge * 100).toFixed(1)}%
              </p>
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0">
              <div className="space-y-3">
                {parlay.legs.map((leg) => (
                  <div 
                    key={leg.eventId}
                    className="flex flex-col md:flex-row md:items-center justify-between p-3 rounded-lg bg-accent/50 gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden">
                        <Image
                          src={leg.picUrl || "/placeholder-fighter.png"}
                          alt={leg.selection || "Selection"}
                          fill
                          className="object-cover object-top"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-sm md:text-base">{leg.selection}</p>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          {leg.eventName} • {new Date(leg.eventDate || "").toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6 text-sm md:text-base">
                      <div className="text-right">
                        <p className="text-xs md:text-sm text-muted-foreground">Book</p>
                        <p className="font-medium">
                          {leg.bookOdds > 0 ? "+" : ""}{leg.bookOdds}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs md:text-sm text-muted-foreground">Model</p>
                        <p className="font-medium text-primary">
                          {leg.modelOdds > 0 ? "+" : ""}{leg.modelOdds}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs md:text-sm text-muted-foreground">Edge</p>
                        <p className={cn(
                          "font-medium",
                          leg.valueEdge > 0 ? "text-green-500" : "text-red-500"
                        )}>
                          {(leg.valueEdge * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
} 