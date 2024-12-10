import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/types/supabase";

type FightOdds = Database["public"]["Tables"]["upcoming_fight_odds"]["Row"];
type NFLOdds = Database["public"]["Tables"]["upcoming_nfl_odds"]["Row"];

export type EventStatus = 'upcoming' | 'completed' | 'all';

function isEventUpcoming(eventDate: string | null): boolean {
  if (!eventDate) return true; // Consider events without dates as upcoming
  return new Date(eventDate) > new Date();
}

export function useUpcomingFightOdds(status: EventStatus = 'upcoming') {
  const supabase = createClient();

  return useQuery({
    queryKey: ["upcoming_fight_odds", status],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("upcoming_fight_odds")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const fights = data as FightOdds[];
      
      // Filter based on status
      if (status === 'upcoming') {
        return fights.filter(fight => isEventUpcoming(fight.fight_date));
      } else if (status === 'completed') {
        return fights.filter(fight => !isEventUpcoming(fight.fight_date));
      }
      
      return fights;
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}

export function useUpcomingNFLOdds(status: EventStatus = 'upcoming') {
  const supabase = createClient();

  return useQuery({
    queryKey: ["upcoming_nfl_odds", status],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("upcoming_nfl_odds")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const games = data as NFLOdds[];
      
      // Filter based on status
      if (status === 'upcoming') {
        return games.filter(game => isEventUpcoming(game.game_date));
      } else if (status === 'completed') {
        return games.filter(game => !isEventUpcoming(game.game_date));
      }
      
      return games;
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
} 