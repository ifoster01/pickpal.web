import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { League } from '@/providers/LeagueProvider';

export type Filter = 'upcoming' | 'past' | 'all';

export function isEventUpcoming(eventDate: string | null): boolean {
  if (!eventDate) return true; // Consider events without dates as upcoming
  // new date - 30 hours
  return (
    new Date(eventDate) > new Date(new Date().getTime() - 30 * 60 * 60 * 1000)
  );
}

export function useEventOdds(eventId: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['event_odds', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('moneyline_book_odds_data')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return data;
    },
  });
}

export function useUpcomingEventOdds(
  filter: Filter = 'upcoming',
  eventType: League
) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['upcoming_event_odds', filter, eventType],
    queryFn: async () => {
      const { data: games, error } = await supabase
        .from('event_moneyline_odds')
        .select('*')
        .eq('event_type', eventType)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filter based on status
      if (filter === 'upcoming') {
        return games.filter((game) => isEventUpcoming(game.event_date));
      } else if (filter === 'past') {
        return games.filter((game) => !isEventUpcoming(game.event_date));
      }

      return games;
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}
