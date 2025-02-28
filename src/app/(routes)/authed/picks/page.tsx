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
import { isEventUpcoming, useUpcomingATPMatchOdds, useUpcomingFightOdds, useUpcomingNBAGameOdds, useUpcomingNFLOdds } from "@/hooks/api/use-odds";
import { useLikedATPMatches, useLikedFights, useLikedNBAGames, useLikedNFLGames } from "@/hooks/api/use-likes";
import { cn } from "@/utils/cn";
import { useAuth } from "@/providers/AuthProvider";
import { PickCard } from "@/app/(routes)/authed/picks/(component)/pick-card";
import { useLeague } from "@/providers/LeagueProvider";
import { useFilter } from "@/providers/FilterProvider";
import { EventFilter } from "@/components/general/event-filter";

type League = 'UFC' | 'NFL' | 'NBA' | 'ATP';
type Filter = 'upcoming' | 'past' | 'all';

export default function PicksPage() {
  const { user } = useAuth();
  const { league, setLeague } = useLeague();
  const { filter, setFilter } = useFilter();

  // UFC Data
  const { data: fights, isLoading: isLoadingFights } = useUpcomingFightOdds(filter);
  const { data: likedFights, likeFight, unlikeFight } = useLikedFights(filter);
  const likedFightIds = likedFights?.map(like => like.fight_id) || [];

  // NFL Data
  const { data: games, isLoading: isLoadingGames } = useUpcomingNFLOdds(filter);
  const { data: likedGames, likeGame, unlikeGame } = useLikedNFLGames(filter);
  const likedGameIds = likedGames?.map(like => like.game_id) || [];

  // NBA Data
  const { data: nbaGames, isLoading: isLoadingNBAGames } = useUpcomingNBAGameOdds(filter);
  const { data: likedNBAGames, likeNBAGame, unlikeNBAGame } = useLikedNBAGames(filter);
  const likedNBAGameIds = likedNBAGames?.map(like => like.game_id) || [];

  // ATP Data
  const { data: atpMatches, isLoading: isLoadingATPMatches } = useUpcomingATPMatchOdds(filter);
  const { data: likedATPMatches, likeATPMatch, unlikeATPMatch } = useLikedATPMatches(filter);
  const likedATPMatchIds = likedATPMatches?.map(like => like.game_id) || [];

  const isLoading = league === 'UFC' ? isLoadingFights : league === 'NFL' ? isLoadingGames : league === 'NBA' ? isLoadingNBAGames : league === 'ATP' ? isLoadingATPMatches : false;

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
          <EventFilter />
        </div>
        <div className="flex items-center gap-4">
          <Select value={league} onValueChange={(value: League) => setLeague(value)}>
            <SelectTrigger className="w-full sm:w-[120px]">
              <SelectValue placeholder="Select League" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UFC">UFC</SelectItem>
              <SelectItem value="NFL">NFL</SelectItem>
              <SelectItem value="NBA">NBA</SelectItem>
              <SelectItem value="ATP">ATP</SelectItem>
            </SelectContent>
          </Select>
          <EventFilter className="hidden sm:block" />
        </div>
      </div>

      <div className="grid gap-6">
        {league === 'UFC' ? (
          // UFC Fights
          fights && fights.length > 0 ? fights.map((fight) => {
            const isLiked = likedFightIds.includes(fight.fight_id);
            const isCompleted = !isEventUpcoming(fight.fight_date);
            
            return (
              <div key={fight.fight_id} className={cn(isCompleted && "opacity-75")}>
                <PickCard
                  event={fight}
                  type="UFC"
                  isLiked={isLiked}
                  onLike={() => likeFight(fight.fight_id)}
                  onUnlike={() => unlikeFight(fight.fight_id)}
                  league="UFC"
                />
              </div>
            );
          }) : (
            <Card className="p-6">
              <p className="text-center text-muted-foreground">No UFC fights available</p>
            </Card>
          )
        ) : league === 'NFL' ? (
          // NFL Games
          games && games.length > 0 ? games.map((game) => {
            const isLiked = likedGameIds.includes(game.game_id);
            const isCompleted = !isEventUpcoming(game.game_date);

            return (
              <div key={game.game_id} className={cn(isCompleted && "opacity-75")}>
                <PickCard
                  event={game}
                  type="NFL"
                  isLiked={isLiked}
                  onLike={() => likeGame(game.game_id)}
                  onUnlike={() => unlikeGame(game.game_id)}
                  league="NFL"
                />
              </div>
            );
          }) : (
            <Card className="p-6">
              <p className="text-center text-muted-foreground">No NFL games available</p>
            </Card>
          )
        ) : league === 'NBA' ? (
          // NBA Games
          nbaGames && nbaGames.length > 0 ? nbaGames.map((game) => {
            const isLiked = likedNBAGameIds.includes(game.game_id);
            const isCompleted = !isEventUpcoming(game.game_date);
            
            return (
              <div key={game.game_id} className={cn(isCompleted && "opacity-75")}>
                <PickCard
                  event={game as any}
                  type="NFL"
                  isLiked={isLiked}
                  onLike={() => likeNBAGame(game.game_id)}
                  onUnlike={() => unlikeNBAGame(game.game_id)}
                  league="NBA"
                />
              </div>
            );
          }) : (
            <Card className="p-6">
              <p className="text-center text-muted-foreground">No NBA games available</p>
            </Card>
          )
        ) : (
          // ATP Matches
          atpMatches && atpMatches.length > 0 ? atpMatches.map((match) => {
            const isLiked = likedATPMatchIds.includes(match.game_id);
            const isCompleted = !isEventUpcoming(match.game_date);
            
            return (
              <div key={match.game_id} className={cn(isCompleted && "opacity-75")}>
                <PickCard
                  event={match as any}
                  type="ATP"
                  isLiked={isLiked}
                  onLike={() => likeATPMatch(match.game_id)}
                  onUnlike={() => unlikeATPMatch(match.game_id)}
                  league="ATP"
                />
              </div>
            );
          }) : (
            <Card className="p-6">
              <p className="text-center text-muted-foreground">No ATP matches available</p>
            </Card>
          )
        )}
      </div>
    </div>
  );
}