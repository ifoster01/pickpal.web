import { useQuery } from '@tanstack/react-query';
import { Database } from '@/types/supabase';
import { League } from '@/providers/LeagueProvider';

export type Pick = 'team1' | 'team2' | 'none';

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
  });
}
