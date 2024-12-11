"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLeague } from "@/providers/LeagueProvider";
import { useUpcomingFightOdds, useUpcomingNFLOdds } from "@/hooks/api/use-odds";
import { useLikedFights, useLikedNFLGames } from "@/hooks/api/use-likes";
import { ParlayCard } from "./(components)/parlay-card";
import { ParlayFilters } from "./(components)/parlay-filters";
import { generateParlayCombinations, getBetterSide, type Parlay } from "@/utils/parlay";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

type League = 'UFC' | 'NFL';
type SortOption = 'payout' | 'value' | 'probability';

function isEventUpcoming(eventDate: string | null): boolean {
  if (!eventDate) return true;
  return new Date(eventDate) > new Date();
}

export default function ParlayPage() {
  const { league, setLeague } = useLeague();
  const [minLegs, setMinLegs] = useState(2);
  const [maxLegs, setMaxLegs] = useState(4);
  const [minOdds, setMinOdds] = useState(-1000);
  const [maxOdds, setMaxOdds] = useState(10000);
  const [minProbability, setMinProbability] = useState(0);
  const [maxProbability, setMaxProbability] = useState(100);
  const [sortBy, setSortBy] = useState<SortOption>('value');

  // Fetch data
  const { data: fights } = useUpcomingFightOdds('upcoming');
  const { data: likedFights } = useLikedFights();
  const { data: games } = useUpcomingNFLOdds('upcoming');
  const { data: likedGames } = useLikedNFLGames();

  // Get liked event IDs
  const likedFightIds = likedFights?.map(like => like.fight_id) || [];
  const likedGameIds = likedGames?.map(like => like.game_id) || [];

  // Filter liked events and get better sides
  const parlayLegs = useMemo(() => {
    if (league === 'UFC') {
      return fights
        ?.filter(fight => 
          likedFightIds.includes(fight.fight_id) && 
          isEventUpcoming(fight.fight_date)
        )
        .map(fight => getBetterSide(fight, 'UFC')) || [];
    } else {
      return games
        ?.filter(game => 
          likedGameIds.includes(game.game_id) && 
          isEventUpcoming(game.game_date)
        )
        .map(game => getBetterSide(game, 'NFL')) || [];
    }
  }, [fights, games, league, likedFightIds, likedGameIds]);

  // Generate and filter parlays
  const parlays = useMemo(() => {
    const allParlays = generateParlayCombinations(parlayLegs, minLegs, maxLegs);
    
    return allParlays.filter(parlay => 
      parlay.totalBookOdds >= minOdds &&
      parlay.totalBookOdds <= maxOdds &&
      parlay.totalModelProbability * 100 >= minProbability &&
      parlay.totalModelProbability * 100 <= maxProbability
    );
  }, [parlayLegs, minLegs, maxLegs, minOdds, maxOdds, minProbability, maxProbability]);

  // Sort parlays
  const sortedParlays = useMemo(() => {
    return [...parlays].sort((a, b) => {
      switch (sortBy) {
        case 'payout':
          return b.totalBookOdds - a.totalBookOdds;
        case 'value':
          return b.valueEdge - a.valueEdge;
        case 'probability':
          return b.totalModelProbability - a.totalModelProbability;
        default:
          return 0;
      }
    });
  }, [parlays, sortBy]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Parlay Builder</h1>
        <div className="flex justify-between sm:justify-start items-center gap-4">
            <Select value={league} onValueChange={(value: League) => setLeague(value)}>
                <SelectTrigger className="w-full sm:w-[120px]">
                    <SelectValue placeholder="Select League" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="UFC">UFC</SelectItem>
                    <SelectItem value="NFL">NFL</SelectItem>
                </SelectContent>
            </Select>
            <ParlayFilters
                minLegs={minLegs}
                maxLegs={maxLegs}
                minOdds={minOdds}
                maxOdds={maxOdds}
                minProbability={minProbability}
                maxProbability={maxProbability}
                onMinLegsChange={setMinLegs}
                onMaxLegsChange={setMaxLegs}
                onMinOddsChange={setMinOdds}
                onMaxOddsChange={setMaxOdds}
                onMinProbabilityChange={setMinProbability}
                onMaxProbabilityChange={setMaxProbability}
            />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant="outline"
          size="sm"
          className={cn(sortBy === 'value' && "bg-primary/10")}
          onClick={() => setSortBy('value')}
        >
          Best Value
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={cn(sortBy === 'payout' && "bg-primary/10")}
          onClick={() => setSortBy('payout')}
        >
          Highest Payout
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={cn(sortBy === 'probability' && "bg-primary/10")}
          onClick={() => setSortBy('probability')}
        >
          Most Probable
        </Button>
      </div>

      <div className="grid gap-4">
        {sortedParlays.length > 0 ? (
          sortedParlays.map((parlay, index) => (
            <ParlayCard key={index} parlay={parlay} />
          ))
        ) : (
          <Card className="p-6">
            <p className="text-center text-muted-foreground">
              {parlayLegs.length === 0
                ? `Save some upcoming ${league} events to start building parlays`
                : "No parlays match your current filters"}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}