import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';

export type Filter = 'upcoming' | 'past' | 'all';

export function isEventUpcoming(eventDate: string | null): boolean {
  if (!eventDate) return true; // Consider events without dates as upcoming
  // new date - 30 hours
  return (
    new Date(eventDate) > new Date(new Date().getTime() - 30 * 60 * 60 * 1000)
  );
}

export function useUpcomingFightOdds(filter: Filter = 'upcoming') {
  const supabase = createClient();

  return useQuery({
    queryKey: ['upcoming_fight_odds', filter],
    queryFn: async () => {
      const { data: fights, error } = await supabase
        .from('upcoming_fight_odds')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filter based on status
      if (filter === 'upcoming') {
        return fights.filter((fight) => isEventUpcoming(fight.fight_date));
      } else if (filter === 'past') {
        return fights.filter((fight) => !isEventUpcoming(fight.fight_date));
      }

      return fights;
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}

export function useUpcomingNFLOdds(filter: Filter = 'upcoming') {
  const supabase = createClient();

  return useQuery({
    queryKey: ['upcoming_nfl_odds', filter],
    queryFn: async () => {
      const { data: games, error } = await supabase
        .from('upcoming_nfl_odds')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filter based on status
      if (filter === 'upcoming') {
        return games.filter((game) => isEventUpcoming(game.game_date));
      } else if (filter === 'past') {
        return games.filter((game) => !isEventUpcoming(game.game_date));
      }

      return games;
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}

export function useUpcomingNBAGameOdds(filter: Filter = 'upcoming') {
  const supabase = createClient();

  return useQuery({
    queryKey: ['upcoming_nba_odds', filter],
    queryFn: async () => {
      const { data: games, error } = await supabase
        .from('upcoming_nba_odds')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filter based on status
      if (filter === 'upcoming') {
        return games.filter((game) => isEventUpcoming(game.game_date));
      } else if (filter === 'past') {
        return games.filter((game) => !isEventUpcoming(game.game_date));
      }

      return games;
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}

export function useUpcomingATPMatchOdds(filter: Filter = 'upcoming') {
  const supabase = createClient();

  return useQuery({
    queryKey: ['upcoming_atp_odds', filter],
    queryFn: async () => {
      const { data: games, error } = await supabase
        .from('event_moneyline_odds')
        .select('*')
        .eq('event_type', 'atp')
        .not('book_odds1', 'eq', 0)
        .not('book_odds2', 'eq', 0)
        .order('created_at', { ascending: false });
      console.log(games);

      console.log(error);
      if (error) throw error;

      // Filter based on status
      if (filter === 'upcoming') {
        return games.filter((game) => isEventUpcoming(game.event_datetime));
      } else if (filter === 'past') {
        return games.filter((game) => !isEventUpcoming(game.event_datetime));
      }

      return games;
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}

export function useUpcomingEventOdds(
  filter: Filter = 'upcoming',
  eventType: 'atp' | 'nfl' | 'nba' | 'ufc'
) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['upcoming_event_odds', filter, eventType],
    queryFn: async () => {
      const { data: games, error } = await supabase
        .from('event_moneyline_odds')
        .select('*')
        .eq('event_type', eventType)
        .not('book_odds1', 'eq', 0)
        .not('book_odds2', 'eq', 0)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filter based on status
      if (filter === 'upcoming') {
        return games.filter((game) => isEventUpcoming(game.event_datetime));
      } else if (filter === 'past') {
        return games.filter((game) => !isEventUpcoming(game.event_datetime));
      }

      return games;
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}
