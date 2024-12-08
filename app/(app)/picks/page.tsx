"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Heart, Filter, Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useUpcomingFightOdds, useUpcomingNFLOdds, EventStatus } from "@/lib/hooks/use-odds";
import { useLikedFights, useLikedNFLGames } from "@/lib/hooks/use-likes";
import { cn } from "@/utils/cn";
import { useSupabase } from "@/components/providers/supabase-provider";
import { calculateProbabilityFromOdds } from "@/utils/odds";
import { useState } from "react";
import { RadioGroup, RadioGroupCard } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type League = 'UFC' | 'NFL';

function isEventUpcoming(eventDate: string | null): boolean {
  if (!eventDate) return true;
  return new Date(eventDate) > new Date();
}

export default function PicksPage() {
  const { user } = useSupabase();
  const [league, setLeague] = useState<League>('UFC');
  const [status, setStatus] = useState<EventStatus>('upcoming');

  // UFC Data
  const { data: fights, isLoading: isLoadingFights } = useUpcomingFightOdds(status);
  const { data: likedFights, likeFight, unlikeFight, isLiking: isLikingFight, isUnliking: isUnlikingFight } = useLikedFights();
  const likedFightIds = likedFights?.map(like => like.fight_id) || [];

  // NFL Data
  const { data: games, isLoading: isLoadingGames } = useUpcomingNFLOdds(status);
  const { data: likedGames, likeGame, unlikeGame, isLiking: isLikingGame, isUnliking: isUnlikingGame } = useLikedNFLGames();
  const likedGameIds = likedGames?.map(like => like.game_id) || [];

  const isLoading = league === 'UFC' ? isLoadingFights : isLoadingGames;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex justify-between sm:justify-start items-center gap-4">
            <h1 className="text-3xl font-bold">Model Picks</h1>
            <div className="block sm:hidden">
              <Button variant="outline" size="icon" disabled>
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="animate-pulse w-[120px] h-10 bg-muted rounded-md" />
            <div className="hidden sm:block">
              <Button variant="outline" size="icon" disabled>
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
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
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex justify-between sm:justify-start items-center gap-4">
          <h1 className="text-3xl font-bold">Model Picks</h1>
          <div className="block sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Filter events by status
                  </SheetDescription>
                </SheetHeader>
                <div className="py-6">
                  <RadioGroup 
                    value={status} 
                    onValueChange={(value: EventStatus) => setStatus(value)}
                    className="grid grid-cols-1 gap-4"
                  >
                    <RadioGroupCard value="upcoming" className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-base font-semibold">Upcoming</span>
                        <span className="text-sm text-muted-foreground">Show future events</span>
                      </div>
                      {status === 'upcoming' && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </RadioGroupCard>
                    <RadioGroupCard value="completed" className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-base font-semibold">Completed</span>
                        <span className="text-sm text-muted-foreground">Show past events</span>
                      </div>
                      {status === 'completed' && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </RadioGroupCard>
                    <RadioGroupCard value="all" className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-base font-semibold">All Events</span>
                        <span className="text-sm text-muted-foreground">Show all events</span>
                      </div>
                      {status === 'all' && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </RadioGroupCard>
                  </RadioGroup>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Select value={league} onValueChange={(value: League) => setLeague(value)}>
            <SelectTrigger className="w-full sm:w-[120px]">
              <SelectValue placeholder="Select League" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UFC">UFC</SelectItem>
              <SelectItem value="NFL">NFL</SelectItem>
            </SelectContent>
          </Select>
          <div className="hidden sm:block">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Filter events by status
                  </SheetDescription>
                </SheetHeader>
                <div className="py-6">
                  <RadioGroup 
                    value={status} 
                    onValueChange={(value: EventStatus) => setStatus(value)}
                    className="grid grid-cols-1 gap-4"
                  >
                    <RadioGroupCard value="upcoming" className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-base font-semibold">Upcoming</span>
                        <span className="text-sm text-muted-foreground">Show future events</span>
                      </div>
                      {status === 'upcoming' && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </RadioGroupCard>
                    <RadioGroupCard value="completed" className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-base font-semibold">Completed</span>
                        <span className="text-sm text-muted-foreground">Show past events</span>
                      </div>
                      {status === 'completed' && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </RadioGroupCard>
                    <RadioGroupCard value="all" className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-base font-semibold">All Events</span>
                        <span className="text-sm text-muted-foreground">Show all events</span>
                      </div>
                      {status === 'all' && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </RadioGroupCard>
                  </RadioGroup>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {league === 'UFC' ? (
          // UFC Fights
          fights && fights.length > 0 ? fights.map((fight) => {
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
            const isCompleted = !isEventUpcoming(fight.fight_date);
            
            return (
              <motion.div
                key={fight.fight_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className={cn("p-6", isCompleted && "opacity-75")}>
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
                      <span className="text-lg font-semibold text-muted-foreground mb-2">
                        {new Date(fight.fight_date || "").toLocaleDateString()}
                      </span>
                      <span className="text-sm text-muted-foreground mb-4">
                        {fight.fight_name}
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
                      disabled={!user || isLikingFight || isUnlikingFight}
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
          }) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-muted-foreground">Fight predictions are not available for UFC yet.</p>
            </div>
          )
        ) : (
          // NFL Games
          games && games.length > 0 ? games.map((game) => {
            const teamProbability = calculateProbabilityFromOdds(game.odds1 || 0);
            const oppProbability = calculateProbabilityFromOdds(game.odds2 || 0);
            const teamBookProbability = calculateProbabilityFromOdds(game.team_book_odds || 0);
            const oppBookProbability = calculateProbabilityFromOdds(game.opp_book_odds || 0);
            
            const discrepancy = Math.abs(teamProbability - teamBookProbability);
            const discrepancyLevel = 
              discrepancy < 0.1 ? "low" : 
              discrepancy < 0.2 ? "medium" : 
              "high";

            const isLiked = likedGameIds.includes(game.game_id);
            const isCompleted = !isEventUpcoming(game.game_date);
            
            return (
              <motion.div
                key={game.game_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className={cn("p-6", isCompleted && "opacity-75")}>
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

                    {/* VS and Predictions */}
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-lg font-semibold text-muted-foreground mb-2">
                        {new Date(game.game_date || "").toLocaleDateString()}
                      </span>
                      <span className="text-sm text-muted-foreground mb-4">
                        {game.game_name}
                      </span>
                      <div className="w-full space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Model Prediction</span>
                            <span>{Math.round(teamProbability * 100)}% - {Math.round(oppProbability * 100)}%</span>
                          </div>
                          <Progress value={teamProbability * 100} />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Sports Book</span>
                            <span>{Math.round(teamBookProbability * 100)}% - {Math.round(oppBookProbability * 100)}%</span>
                          </div>
                          <Progress value={teamBookProbability * 100} />
                        </div>
                      </div>
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

                  {/* Discrepancy Indicator */}
                  <div className="mt-4 flex items-center justify-center">
                    <div className="bg-muted px-4 py-2 rounded-full flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        {game.team_name}&apos;s odds have a {discrepancyLevel} discrepancy from the book
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
                          unlikeGame(game.game_id);
                        } else {
                          likeGame(game.game_id);
                        }
                      }}
                      disabled={!user || isLikingGame || isUnlikingGame}
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
          }) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-muted-foreground">Game predictions are not available for NFL yet.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}