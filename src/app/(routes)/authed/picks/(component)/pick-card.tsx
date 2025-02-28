"use client";

import { Database } from "@/types/supabase";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronDown, Heart } from "lucide-react";
import { cn } from "@/utils/cn";
import { PickAnalytics } from "./pick-analytics";
import { calculateProbabilityFromOdds } from "@/utils/odds";
import Image from "next/image";
import { useAuth } from "@/providers/AuthProvider";

type FightOdds = Database["public"]["Tables"]["upcoming_fight_odds"]["Row"];
type NFLOdds = Database["public"]["Tables"]["upcoming_nfl_odds"]["Row"];
type NBAGameOdds = Database["public"]["Tables"]["upcoming_nba_odds"]["Row"];
type ATPMatchOdds = Database["public"]["Tables"]["upcoming_atp_odds"]["Row"];

type Fighter = {
  name: string | null;
  odds: number | null;
  bookOdds: number | null;
  probability: number;
  bookProbability: number;
  picUrl: string | null;
};

interface PickCardProps {
  event: FightOdds | NFLOdds | NBAGameOdds | ATPMatchOdds;
  type: 'UFC' | 'NFL' | 'NBA' | 'ATP';
  isLiked?: boolean;
  onLike?: () => void;
  onUnlike?: () => void;
  league: 'UFC' | 'NFL' | 'NBA' | 'ATP';
}

export function PickCard({ event, type, isLiked, onLike, onUnlike, league }: PickCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useAuth();

  const fighter1: Fighter = type === 'UFC' ? {
    name: (event as FightOdds).fighter1,
    odds: (event as FightOdds).odds1,
    bookOdds: (event as FightOdds).f1_book_odds,
    probability: calculateProbabilityFromOdds((event as FightOdds).odds1 || 0),
    bookProbability: calculateProbabilityFromOdds((event as FightOdds).f1_book_odds || 0),
    picUrl: (event as FightOdds).f1_pic_url
  } : type === 'NFL' ? {
    name: (event as NFLOdds).team_name,
    odds: (event as NFLOdds).odds1,
    bookOdds: (event as NFLOdds).team_book_odds,
    probability: calculateProbabilityFromOdds((event as NFLOdds).odds1 || 0),
    bookProbability: calculateProbabilityFromOdds((event as NFLOdds).team_book_odds || 0),
    picUrl: (event as NFLOdds).team_pic_url
  } : type === 'NBA' ? {
    name: (event as NBAGameOdds).team_name,
    odds: (event as NBAGameOdds).odds1,
    bookOdds: (event as NBAGameOdds).team_book_odds,
    probability: calculateProbabilityFromOdds((event as NBAGameOdds).odds1 || 0),
    bookProbability: calculateProbabilityFromOdds((event as NBAGameOdds).team_book_odds || 0),
    picUrl: (event as NBAGameOdds).team_pic_url
  } : type === 'ATP' ? {
    name: (event as ATPMatchOdds).team_name,
    odds: (event as ATPMatchOdds).odds1,
    bookOdds: (event as ATPMatchOdds).team_book_odds,
    probability: calculateProbabilityFromOdds((event as ATPMatchOdds).odds1 || 0),
    bookProbability: calculateProbabilityFromOdds((event as ATPMatchOdds).team_book_odds || 0),
    picUrl: (event as ATPMatchOdds).team_pic_url
  } : {
    name: "",
    odds: 0,
    bookOdds: 0,
    probability: 0,
    bookProbability: 0,
    picUrl: ""
  };

  const fighter2: Fighter = type === 'UFC' ? {
    name: (event as FightOdds).fighter2,
    odds: (event as FightOdds).odds2,
    bookOdds: (event as FightOdds).f2_book_odds,
    probability: calculateProbabilityFromOdds((event as FightOdds).odds2 || 0),
    bookProbability: calculateProbabilityFromOdds((event as FightOdds).f2_book_odds || 0),
    picUrl: (event as FightOdds).f2_pic_url
  } : type === 'NFL' ? {
    name: (event as NFLOdds).opp_name,
    odds: (event as NFLOdds).odds2,
    bookOdds: (event as NFLOdds).opp_book_odds,
    probability: calculateProbabilityFromOdds((event as NFLOdds).odds2 || 0),
    bookProbability: calculateProbabilityFromOdds((event as NFLOdds).opp_book_odds || 0),
    picUrl: (event as NFLOdds).opp_pic_url
  } : type === 'NBA' ? {
    name: (event as NBAGameOdds).opp_name,
    odds: (event as NBAGameOdds).odds2,
    bookOdds: (event as NBAGameOdds).opp_book_odds,
    probability: calculateProbabilityFromOdds((event as NBAGameOdds).odds2 || 0),
    bookProbability: calculateProbabilityFromOdds((event as NBAGameOdds).opp_book_odds || 0),
    picUrl: (event as NBAGameOdds).opp_pic_url
  } : type === 'ATP' ? {
    name: (event as ATPMatchOdds).opp_name,
    odds: (event as ATPMatchOdds).odds2,
    bookOdds: (event as ATPMatchOdds).opp_book_odds,
    probability: calculateProbabilityFromOdds((event as ATPMatchOdds).odds2 || 0),
    bookProbability: calculateProbabilityFromOdds((event as ATPMatchOdds).opp_book_odds || 0),
    picUrl: (event as ATPMatchOdds).opp_pic_url
  } : {
    name: "",
    odds: 0,
    bookOdds: 0,
    probability: 0,
    bookProbability: 0,
    picUrl: ""
  };

  const discrepancy = Math.abs(fighter1.probability - fighter1.bookProbability);
  const discrepancyLevel = discrepancy < 0.1 ? "low" : discrepancy < 0.2 ? "medium" : "high";

  const handleSaveClick = () => {
    if (!user) return;
    if (isLiked) {
      onUnlike?.();
    } else {
      onLike?.();
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden group relative">
        {/* Save Button - Floating in top right */}
        <motion.button
          className={cn(
            "absolute top-4 right-4 z-10",
            "w-8 h-8 rounded-full flex items-center justify-center",
            "transition-all duration-200 ease-in-out",
            "hover:scale-110 active:scale-95",
            isLiked ? "bg-primary/10" : "bg-background/80 backdrop-blur-sm",
            !user && "opacity-50 cursor-not-allowed"
          )}
          onClick={handleSaveClick}
          disabled={!user}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Heart 
            className={cn(
              "w-4 h-4 transition-all duration-200",
              isLiked ? "fill-primary stroke-primary" : "stroke-muted-foreground",
              "group-hover:stroke-primary"
            )} 
          />
        </motion.button>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Fighter/Team 1 */}
            <div className="flex items-center space-x-4">
              <div className={
                cn("relative rounded-full overflow-hidden",
                    league === 'UFC' ? "w-[100px] h-[100px]" : "w-[50px] h-[50px]")
              }>
                <Image
                  src={fighter1.picUrl || "/placeholder-fighter.png"}
                  alt={fighter1.name || "Fighter 1"}
                  fill
                  className="object-cover object-top"
                  sizes="100px"
                />
              </div>
              <div>
                <h3 className={cn("font-semibold", league === 'UFC' ? "text-lg" : "text-2xl")}>{league === 'UFC' || league === 'ATP' ? fighter1.name : fighter1.name?.split(" ").at(-1)}</h3>
                <div className="text-2xl font-bold text-primary flex items-center">
                  {fighter1.odds && fighter1.odds > 0 ? "+" : ""}{fighter1.odds}
                  <span className="text-sm text-muted-foreground ml-2">
                    ({fighter1.bookOdds && fighter1.bookOdds > 0 ? "+" : ""}{fighter1.bookOdds ? fighter1.bookOdds : "N/A"} book)
                  </span>
                </div>
              </div>
            </div>

            {/* VS and Predictions */}
            <div className="flex flex-col items-center justify-center">
              <span className="text-lg font-semibold text-muted-foreground mb-4">
                vs
              </span>
              <div className="w-full space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Model Prediction</span>
                    <span>
                      {Math.round(fighter1.probability * 100)}% -{" "}
                      {Math.round(fighter2.probability * 100)}%
                    </span>
                  </div>
                  <Progress value={fighter1.probability * 100} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Sports Book</span>
                    <span>
                      {Math.round(fighter1.bookProbability * 100)}% -{" "}
                      {Math.round(fighter2.bookProbability * 100)}%
                    </span>
                  </div>
                  <Progress value={fighter1.bookProbability * 100} />
                </div>
              </div>
            </div>

            {/* Fighter/Team 2 */}
            <div className="flex items-center justify-end space-x-4">
              <div className="text-right">
                <h3 className={cn("font-semibold", league === 'UFC' ? "text-lg" : "text-2xl")}>{league === 'UFC' || league === 'ATP' ? fighter2.name : fighter2.name?.split(" ").at(-1)}</h3>
                <div className="text-2xl font-bold text-primary flex items-center">
                  <span className="text-sm text-muted-foreground mr-2">
                    ({fighter2.bookOdds && fighter2.bookOdds > 0 ? "+" : ""}{fighter2.bookOdds ? fighter2.bookOdds : "N/A"} book)
                  </span>
                  {fighter2.odds && fighter2.odds > 0 ? "+" : ""}{fighter2.odds}
                </div>
              </div>
              <div className={
                cn("relative rounded-full overflow-hidden",
                    league === 'UFC' ? "w-[100px] h-[100px]" : "w-[50px] h-[50px]")
              }>
                <Image
                  src={fighter2.picUrl || "/placeholder-fighter.png"}
                  alt={fighter2.name || "Fighter 2"}
                  fill
                  className="object-cover object-top"
                  sizes="100px"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="w-full max-w-xs"
              onClick={() => setIsExpanded(!isExpanded)}
            >
                <span className="text-sm text-muted-foreground">
                    {isExpanded ? "Hide" : "View"} Analysis
                </span>
                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2"
                >
                    <ChevronDown className="h-4 w-4" />
                </motion.div>
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6">
                <PickAnalytics
                  event={event}
                  type={type}
                  fighter1={fighter1}
                  fighter2={fighter2}
                  discrepancy={discrepancyLevel}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}