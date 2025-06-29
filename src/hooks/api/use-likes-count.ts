import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';

export function useLikesCount(
  eventId: string,
  type: 'fight' | 'nfl' | 'nba' | 'atp'
) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['likes-count', eventId],
    queryFn: async () => {
      const table =
        type === 'fight'
          ? 'liked_fights'
          : type === 'nfl'
            ? 'liked_nfl_games'
            : type === 'nba'
              ? 'liked_nba_games'
              : 'liked_atp_games';

      const supabase = createClient();
      const { data, error } = await supabase
        .from(table)
        .select('count', { count: 'exact' })
        .eq('event_id', eventId);

      if (error) throw error;

      return data?.[0]?.count ?? 0;
    },
  });

  return { data, isLoading, error };
}
