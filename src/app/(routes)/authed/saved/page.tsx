"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useLikedFights, useLikedNFLGames } from "@/hooks/api/use-likes";
import { cn } from "@/utils/cn";
import { useAuth } from "@/providers/AuthProvider";
import { calculateProbabilityFromOdds } from "@/utils/odds";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SavedPage() {
  const { user } = useAuth();
  const { 
    data: likedFights, 
    unlikeFight, 
    isUnliking: isUnlikingFight 
  } = useLikedFights();
  const { 
    data: likedGames, 
    unlikeGame, 
    isUnliking: isUnlikingGame 
  } = useLikedNFLGames();

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full"
      >
        <h1 className="text-3xl font-bold mb-8">Saved Picks</h1>
        <Card className="w-full p-6">
          <p className="text-muted-foreground">Please sign in to see your saved picks.</p>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <h1 className="text-3xl font-bold mb-8">Saved Picks</h1>
      
      <Tabs defaultValue="fights" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="fights">UFC Fights</TabsTrigger>
          <TabsTrigger value="nfl">NFL Games</TabsTrigger>
        </TabsList>

        <TabsContent value="fights">
          {likedFights?.length === 0 ? (
            <Card className="w-full p-6">
              <p className="text-muted-foreground">You haven&apos;t saved any fights yet.</p>
            </Card>
          ) : (
            <div className="grid gap-6">
              {likedFights?.map((like) => {
                const fight = like.upcoming_fight_odds;
                if (!fight) return null;

                const f1Probability = calculateProbabilityFromOdds(fight.odds1 || 0);
                const f2Probability = calculateProbabilityFromOdds(fight.odds2 || 0);
                const f1BookProbability = calculateProbabilityFromOdds(fight.f1_book_odds || 0);
                const f2BookProbability = calculateProbabilityFromOdds(fight.f2_book_odds || 0);

                return (
                  <Card key={like.id} className="p-6">
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

                      {/* Fight Details */}
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-lg font-semibold text-muted-foreground mb-2">
                          {new Date(fight.fight_date || "").toLocaleDateString()}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {fight.fight_name}
                        </span>
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

                    <div className="mt-4 flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => unlikeFight(fight.fight_id)}
                        disabled={isUnlikingFight}
                      >
                        <Heart className="h-4 w-4 fill-primary" />
                        Unsave
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="nfl">
          {likedGames?.length === 0 ? (
            <Card className="w-full p-6">
              <p className="text-muted-foreground">You haven&apos;t saved any NFL games yet.</p>
            </Card>
          ) : (
            <div className="grid gap-6">
              {likedGames?.map((like) => {
                const game = like.upcoming_nfl_odds;
                if (!game) return null;

                const teamProbability = calculateProbabilityFromOdds(game.odds1 || 0);
                const oppProbability = calculateProbabilityFromOdds(game.odds2 || 0);
                const teamBookProbability = calculateProbabilityFromOdds(game.team_book_odds || 0);
                const oppBookProbability = calculateProbabilityFromOdds(game.opp_book_odds || 0);

                return (
                  <Card key={like.id} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Team */}
                      <div className="flex items-center space-x-4">
                        <img
                          src={game.team_pic_url || "/placeholder-team.png"}
                          alt={game.team_name || "Team"}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-semibold">{game.team_name}</h3>
                          <p className="text-2xl font-bold text-primary">
                            {game.odds1 && game.odds1 > 0 ? "+" : ""}{game.odds1}
                          </p>
                        </div>
                      </div>

                      {/* Game Details */}
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-lg font-semibold text-muted-foreground mb-2">
                          {new Date(game.game_date || "").toLocaleDateString()}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {game.game_name}
                        </span>
                      </div>

                      {/* Opponent */}
                      <div className="flex items-center justify-end space-x-4">
                        <div className="text-right">
                          <h3 className="font-semibold">{game.opp_name}</h3>
                          <p className="text-2xl font-bold text-primary">
                            {game.odds2 && game.odds2 > 0 ? "+" : ""}{game.odds2}
                          </p>
                        </div>
                        <img
                          src={game.opp_pic_url || "/placeholder-team.png"}
                          alt={game.opp_name || "Opponent"}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => unlikeGame(game.game_id)}
                        disabled={isUnlikingGame}
                      >
                        <Heart className="h-4 w-4 fill-primary" />
                        Unsave
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}