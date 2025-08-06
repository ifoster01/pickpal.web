import { useQuery } from '@tanstack/react-query';
import { Database } from '@/types/supabase';
import { League } from '@/providers/LeagueProvider';

export type Pick = 'team1' | 'team2' | 'none';

/**
 * Utility function to determine if an event has a pick
 * This replicates the server-side logic for client-side filtering
 */
export function eventHasPick(
  event: Database['public']['Tables']['event_moneyline_odds']['Row'],
  league: League
): boolean {
  if (!event.odds1 || !event.odds2 || !event.book_odds1 || !event.book_odds2) {
    return false;
  }

  const model_favorite_odds =
    event.odds1 < event.odds2 ? event.odds1 : event.odds2;
  const model_favorite_book =
    event.odds1 < event.odds2 ? event.book_odds1 : event.book_odds2;

  if (league === 'ufc') {
    const odds_threshold = -110;
    return (
      model_favorite_odds < odds_threshold &&
      model_favorite_odds < model_favorite_book &&
      model_favorite_book < 0
    );
  }

  if (league === 'atp') {
    const odds_threshold = -110;
    const book_odds_threshold = -122;
    return (
      model_favorite_odds < odds_threshold &&
      model_favorite_book > book_odds_threshold &&
      model_favorite_book < 0
    );
  }

  // NBA and NFL currently don't have picks
  if (league === 'nba' || league === 'nfl') {
    return false;
  }

  return false;
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
  });
}
