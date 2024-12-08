import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/types/supabase";

type FightOdds = Database["public"]["Tables"]["upcoming_fight_odds"]["Row"];
type NFLOdds = Database["public"]["Tables"]["upcoming_nfl_odds"]["Row"];

export function useUpcomingFightOdds() {
  const supabase = createClient();

  return useQuery({
    queryKey: ["upcoming_fight_odds"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("upcoming_fight_odds")
        .select("*")
        .order("fight_date", { ascending: true });

      if (error) throw error;
      return data as FightOdds[];
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}

export function useUpcomingNFLOdds() {
  const supabase = createClient();

  return useQuery({
    queryKey: ["upcoming_nfl_odds"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("upcoming_nfl_odds")
        .select("*")
        .order("game_date", { ascending: true });

      if (error) throw error;
      return data as NFLOdds[];
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
} 