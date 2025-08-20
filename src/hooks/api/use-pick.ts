import { useQuery } from '@tanstack/react-query';
import { Database } from '@/types/supabase';
import { League } from '@/providers/LeagueProvider';
import { useMemo } from 'react';

export type Pick = 'team1' | 'team2' | 'none';

interface PickResult {
  eventId: string;
  pick: Pick;
}

/**
 * Hook to fetch picks for multiple events efficiently using bulk API
 * This replaces individual API calls with a single bulk request
 */
export function useEventsPicks(
  events: Database['public']['Tables']['event_moneyline_odds']['Row'][],
  league: League
) {
  const eventIds = useMemo(
    () =>
      events
        .map((e) => e.id)
        .sort()
        .join(','),
    [events]
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: ['bulk-picks', eventIds, league],
    queryFn: async (): Promise<PickResult[]> => {
      if (events.length === 0) {
        return [];
      }

      const response = await fetch('/api/picks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events, league }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      return responseData.picks;
    },
    enabled: events.length > 0 && !!league,
    staleTime: 5 * 60 * 1000, // 5 minutes - picks don't change frequently
  });

  // Create a map of event IDs to their pick status for easy lookup
  const picksMap = useMemo(() => {
    const map = new Map<string, Pick>();
    if (data) {
      data.forEach((result) => {
        map.set(result.eventId, result.pick);
      });
    }
    return map;
  }, [data]);

  // Helper function to check if an event has a pick (non-'none')
  const eventHasPick = useMemo(() => {
    return (eventId: string): boolean => {
      const pick = picksMap.get(eventId);
      return pick !== undefined && pick !== 'none';
    };
  }, [picksMap]);

  return {
    picksMap,
    eventHasPick,
    isLoading,
    isError,
    data,
  };
}

export function usePick(
  event: Database['public']['Tables']['event_moneyline_odds']['Row'],
  league: League
) {
  return useQuery({
    queryKey: ['pick', event.id, league],
    queryFn: async (): Promise<Pick> => {
      const response = await fetch('/api/picks/pick', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ event, league }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data.pick;
    },
    enabled: !!event && !!league,
    staleTime: 5 * 60 * 1000, // 5 minutes - picks don't change frequently
  });
}
