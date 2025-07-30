import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { League } from '@/providers/LeagueProvider';
import { WeekRange } from '@/utils/utils';

export type Filter = 'upcoming' | 'past' | 'all';

export function isEventUpcoming(eventDate: string | null): boolean {
  if (!eventDate) return true;
  return (
    new Date(eventDate) > new Date(new Date().getTime() - 2 * 60 * 60 * 1000)
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
        const now = new Date();
        const cutoffDate = new Date(
          Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            now.getUTCHours(),
            now.getUTCMinutes(),
            now.getUTCSeconds()
          )
        ).toISOString();

        if (filter === 'upcoming') {
          query = query.filter('event_datetime', 'gte', cutoffDate);
        } else if (filter === 'past') {
          query = query.filter('event_datetime', 'lt', cutoffDate);
        }
      }

      const { data: games, error } = await query;

      if (error) throw error;

      // map through the games and convert the event_datetime to a date object in the local timezone from UTC
      const gamesWithLocalDatetime = games.map((game) => {
        const date = new Date(game.event_datetime + 'Z');
        return {
          ...game,
          event_datetime: date.toLocaleString(),
        };
      });

      return gamesWithLocalDatetime;
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}

/**
 * New hook for week-based event filtering
 */
export function useWeekEventOdds(
  weekRange: WeekRange,
  eventType: League,
  dateFilter: 'upcoming' | 'past' | 'all' = 'upcoming',
  count: number = 1000,
  dateOrder: 'asc' | 'desc' = 'asc'
) {
  const supabase = createClient();

  return useQuery({
    queryKey: [
      'week_event_odds',
      weekRange.key,
      eventType,
      count,
      dateOrder,
      dateFilter,
    ],
    queryFn: async () => {
      // Convert week range to UTC for server query
      const startUTC = new Date(weekRange.start).toISOString();
      const endUTC = new Date(weekRange.end).toISOString();

      let query = supabase
        .from('event_moneyline_odds')
        .select('*')
        .eq('event_type', eventType)
        .gte('event_datetime', startUTC)
        .lte('event_datetime', endUTC)
        .limit(count);

      query = query.order('event_datetime', { ascending: dateOrder === 'asc' });

      console.log('dateFilter', dateFilter);

      // add the date filter
      if (dateFilter === 'upcoming') {
        query = query.filter('event_datetime', 'gte', new Date().toISOString());
      } else if (dateFilter === 'past') {
        query = query.filter('event_datetime', 'lt', new Date().toISOString());
      }

      const { data: games, error } = await query;

      if (error) throw error;

      // Convert the event_datetime to local timezone
      const gamesWithLocalDatetime = games.map((game) => {
        const date = new Date(game.event_datetime + 'Z');
        return {
          ...game,
          event_datetime: date.toLocaleString(),
        };
      });

      return gamesWithLocalDatetime;
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}
