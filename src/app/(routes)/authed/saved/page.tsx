"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useLikedFights, useLikedNFLGames } from "@/hooks/api/use-likes";
import { useAuth } from "@/providers/AuthProvider";
import { calculateProbabilityFromOdds } from "@/utils/odds";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventFilter } from "@/components/general/event-filter";
import { useLeague } from "@/providers/LeagueProvider";
import { PickCard } from "../picks/(component)/pick-card";
import { cn } from "@/utils/cn";

function isEventUpcoming(eventDate: string | null): boolean {
  if (!eventDate) return true;
  return new Date(eventDate) > new Date();
}

export default function SavedPage() {
  const { user } = useAuth();
  const { league, setLeague } = useLeague();
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold mb-8">Saved Picks</h1>
        <EventFilter className="block sm:block" />
      </div>
      
      <Tabs defaultValue="UFC" className="w-full" value={league}>
        <TabsList className="mb-8">
          <TabsTrigger onClick={() => setLeague('UFC')} value="UFC">UFC Fights</TabsTrigger>
          <TabsTrigger onClick={() => setLeague('NFL')} value="NFL">NFL Games</TabsTrigger>
        </TabsList>

        <TabsContent value="UFC">
          {likedFights?.length === 0 ? (
            <Card className="w-full p-6">
              <p className="text-muted-foreground">You haven&apos;t saved any fights yet.</p>
            </Card>
          ) : (
            <div className="grid gap-6">
              {likedFights?.map((like) => {
                const fight = like.upcoming_fight_odds;
                if (!fight) return null;

                const isCompleted = !isEventUpcoming(fight.fight_date);

                return (
                  <div key={fight.fight_id} className={cn(isCompleted && "opacity-75")}>
                    <PickCard
                      event={fight}
                      type="UFC"
                      isLiked={true}
                      onUnlike={() => unlikeFight(fight.fight_id)}
                      league="UFC"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="NFL">
          {likedGames?.length === 0 ? (
            <Card className="w-full p-6">
              <p className="text-muted-foreground">You haven&apos;t saved any NFL games yet.</p>
            </Card>
          ) : (
            <div className="grid gap-6">
              {likedGames?.map((like) => {
                const game = like.upcoming_nfl_odds;
                if (!game) return null;

                const isCompleted = !isEventUpcoming(game.game_date);

                return (
                  <div key={game.game_id} className={cn(isCompleted && "opacity-75")}>
                    <PickCard
                      event={game}
                      type="NFL"
                      isLiked={true}
                      onUnlike={() => unlikeGame(game.game_id)}
                      league="NFL"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}