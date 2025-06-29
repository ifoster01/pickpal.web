import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';

export function useLikesCount(
  eventId: string,
  league: 'UFC' | 'NFL' | 'NBA' | 'ATP'
) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['likes-count', eventId, league],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('liked_events')
        .select('count', { count: 'exact' })
        .eq('event_type', league)
        .eq('event_id', eventId);

      if (error) throw error;

      return data?.[0]?.count ?? 0;
    },
  });

  return { data, isLoading, error };
}
