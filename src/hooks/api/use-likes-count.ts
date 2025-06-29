import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';

export function useLikesCount(
  eventId: string,
  league: 'UFC' | 'NFL' | 'NBA' | 'ATP'
) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['likes-count', eventId],
    queryFn: async () => {
      const table:
        | 'liked_fights'
        | 'liked_nfl_games'
        | 'liked_nba_games'
        | 'liked_atp_games' =
        league === 'UFC'
          ? 'liked_fights'
          : league === 'NFL'
            ? 'liked_nfl_games'
            : league === 'NBA'
              ? 'liked_nba_games'
              : 'liked_atp_games';

      const fk: 'fight_id' | 'game_id' =
        league === 'UFC'
          ? 'fight_id'
          : league === 'NFL'
            ? 'game_id'
            : league === 'NBA'
              ? 'game_id'
              : 'game_id';

      const supabase = createClient();
      const { data, error } = await supabase
        .from(table)
        .select('count', { count: 'exact' })
        .eq(fk, eventId);

      if (error) throw error;

      return data?.[0]?.count ?? 0;
    },
  });

  return { data, isLoading, error };
}
