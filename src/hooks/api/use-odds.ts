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
        .not('book_odds1', 'eq', 0)
        .not('book_odds2', 'eq', 0)
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
