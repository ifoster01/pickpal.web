import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { League } from '@/providers/LeagueProvider';

export type Filter = 'upcoming' | 'past' | 'all';

export function isEventUpcoming(eventDate: string | null): boolean {
  if (!eventDate) return true; // Consider events without dates as upcoming
  // new date - 30 hours
  return (
    new Date(eventDate) > new Date(new Date().getTime() - 12 * 60 * 60 * 1000)
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
  eventType: League,
  count: number = 1000,
  dateOrder: 'asc' | 'desc' = 'asc'
) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['upcoming_event_odds', filter, eventType, count, dateOrder],
    queryFn: async () => {
      let query = supabase
        .from('event_moneyline_odds')
        .select('*')
        .eq('event_type', eventType)
        .limit(count);

      if (dateOrder === 'asc' && filter === 'upcoming') {
        query = query.order('event_datetime', { ascending: true });
      } else {
        query = query.order('event_datetime', { ascending: false });
      }

      if (filter !== 'all') {
        const cutoffDate = new Date(
          new Date().getTime() - 12 * 60 * 60 * 1000
        ).toISOString();

        if (filter === 'upcoming') {
          query = query.filter('event_datetime', 'gte', cutoffDate);
        } else if (filter === 'past') {
          query = query.filter('event_datetime', 'lt', cutoffDate);
        }
      }

      const { data: games, error } = await query;

      if (error) throw error;

      return games;
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}
