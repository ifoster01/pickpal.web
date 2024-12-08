"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpcomingFightOdds } from "@/lib/hooks/use-odds";
import { useLikedFights } from "@/lib/hooks/use-likes";
import { cn } from "@/utils/cn";
import { useSupabase } from "@/components/providers/supabase-provider";
import { calculateProbabilityFromOdds } from "@/utils/odds";

export default function PicksPage() {
  const { user } = useSupabase();
  const { data: fights, isLoading } = useUpcomingFightOdds();
  const { data: likedFights, likeFight, unlikeFight, isLiking, isUnliking } = useLikedFights();

  const likedFightIds = likedFights?.map(like => like.fight_id) || [];

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Model Picks</h1>
        </div>
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-40 bg-muted rounded-lg" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Model Picks</h1>
      </div>

      <div className="grid gap-6">
        {fights?.map((fight) => {
          const f1Probability = calculateProbabilityFromOdds(fight.odds1 || 0);
          const f2Probability = calculateProbabilityFromOdds(fight.odds2 || 0);
          const f1BookProbability = calculateProbabilityFromOdds(fight.f1_book_odds || 0);
          const f2BookProbability = calculateProbabilityFromOdds(fight.f2_book_odds || 0);
          
          const discrepancy = Math.abs(f1Probability - f1BookProbability);
          const discrepancyLevel = 
            discrepancy < 0.1 ? "low" : 
            discrepancy < 0.2 ? "medium" : 
            "high";

          const isLiked = likedFightIds.includes(fight.fight_id);
          
          return (
            <motion.div
              key={fight.fight_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Fighter 1 */}
                  <div className="flex items-center space-x-4">
                    <img
                      src={fight.f1_pic_url || "/placeholder-fighter.png"}
                      alt={fight.fighter1 || "Fighter 1"}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{fight.fighter1}</h3>
                      <p className="text-2xl font-bold text-primary">
                        {fight.odds1 && fight.odds1 > 0 ? "+" : ""}{fight.odds1}
                      </p>
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
                          <span>{Math.round(f1Probability * 100)}% - {Math.round(f2Probability * 100)}%</span>
                        </div>
                        <Progress value={f1Probability * 100} />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Sports Book</span>
                          <span>{Math.round(f1BookProbability * 100)}% - {Math.round(f2BookProbability * 100)}%</span>
                        </div>
                        <Progress value={f1BookProbability * 100} />
                      </div>
                    </div>
                  </div>

                  {/* Fighter 2 */}
                  <div className="flex items-center justify-end space-x-4">
                    <div className="text-right">
                      <h3 className="font-semibold">{fight.fighter2}</h3>
                      <p className="text-2xl font-bold text-primary">
                        {fight.odds2 && fight.odds2 > 0 ? "+" : ""}{fight.odds2}
                      </p>
                    </div>
                    <img
                      src={fight.f2_pic_url || "/placeholder-fighter.png"}
                      alt={fight.fighter2 || "Fighter 2"}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </div>
                </div>

                {/* Discrepancy Indicator */}
                <div className="mt-4 flex items-center justify-center">
                  <div className="bg-muted px-4 py-2 rounded-full flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {fight.fighter2}&apos;s odds have a {discrepancyLevel} discrepancy from the book
                    </span>
                    <div className="w-24 h-2 bg-background rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full",
                          discrepancyLevel === "low"
                            ? "bg-green-500 w-1/3"
                            : discrepancyLevel === "medium"
                            ? "bg-yellow-500 w-2/3"
                            : "bg-red-500 w-full"
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "gap-2",
                      isLiked && "bg-primary/10"
                    )}
                    onClick={() => {
                      if (!user) return;
                      if (isLiked) {
                        unlikeFight(fight.fight_id);
                      } else {
                        likeFight(fight.fight_id);
                      }
                    }}
                    disabled={!user || isLiking || isUnliking}
                  >
                    <Heart className={cn(
                      "h-4 w-4",
                      isLiked && "fill-primary"
                    )} />
                    {isLiked ? "Saved" : "Save"}
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}