import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/types/supabase";

type FightOdds = Database["public"]["Tables"]["upcoming_fight_odds"]["Row"];
type NFLOdds = Database["public"]["Tables"]["upcoming_nfl_odds"]["Row"];

export type Filter = 'upcoming' | 'past' | 'all';

export function isEventUpcoming(eventDate: string | null): boolean {
  if (!eventDate) return true; // Consider events without dates as upcoming
  // new date - 12 hours
  return new Date(eventDate) > new Date(new Date().getTime() - 6 * 60 * 60 * 1000);
}

export function useUpcomingFightOdds(filter: Filter = 'upcoming') {
  const supabase = createClient();

  return useQuery({
    queryKey: ["upcoming_fight_odds", filter],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("upcoming_fight_odds")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const fights = data as FightOdds[];
      
      // Filter based on status
      if (filter === 'upcoming') {
        return fights.filter(fight => isEventUpcoming(fight.fight_date));
      } else if (filter === 'past') {
        return fights.filter(fight => !isEventUpcoming(fight.fight_date));
      }
      
      return fights;
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}

export function useUpcomingNFLOdds(filter: Filter = 'upcoming') {
  const supabase = createClient();

  return useQuery({
    queryKey: ["upcoming_nfl_odds", filter],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("upcoming_nfl_odds")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const games = data as NFLOdds[];
      
      // Filter based on status
      if (filter === 'upcoming') {
        return games.filter(game => isEventUpcoming(game.game_date));
      } else if (filter === 'past') {
        return games.filter(game => !isEventUpcoming(game.game_date));
      }
      
      return games;
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
} 