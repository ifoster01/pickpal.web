import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { Database } from '@/types/supabase';
import { useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { isEventUpcoming } from './use-odds';

type LikedEvent = Database['public']['Tables']['liked_events']['Row'];
type EventOdds = Database['public']['Tables']['event_moneyline_odds']['Row'];

type EnrichedLikedEvent = LikedEvent & {
  upcoming_event_odds: EventOdds | null;
};

type Filter = 'upcoming' | 'past' | 'all';

// Helper function to filter events based on filter type
function filterEvents<T extends EnrichedLikedEvent>(
  events: T[],
  filter: Filter
): T[] {
  return events.filter((event) => {
    const date = event?.upcoming_event_odds?.event_date;

    if (!date) return true;
    const isUpcoming = isEventUpcoming(date);

    switch (filter) {
      case 'upcoming':
        return isUpcoming;
      case 'past':
        return !isUpcoming;
      case 'all':
      default:
        return true;
    }
  });
}

export function useLikedEvents(
  filter: Filter = 'upcoming',
  league: 'UFC' | 'NFL' | 'NBA' | 'ATP'
) {
  const { user } = useAuth();
  const supabase = createClient();
  const queryClient = useQueryClient();

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('liked_events_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'liked_events',
          filter: `saving_user_id=eq.${user.id}`,
        },
        () => {
          // Refetch the liked events when changes occur
          queryClient.invalidateQueries({
            queryKey: ['liked_events', user.id, filter, league],
          });
          queryClient.invalidateQueries({
            queryKey: ['likes-count', league],
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, user, queryClient, filter, league]);

  // Query for liked events
  const query = useQuery<EnrichedLikedEvent[]>({
    queryKey: ['liked_events', user?.id, filter, league],
    queryFn: async () => {
      if (!user) return [];

      // First, get the liked events
      const { data: likedEvents, error: likedError } = await supabase
        .from('liked_events')
        .select('*')
        .eq('saving_user_id', user.id)
        .eq('event_type', league)
        .order('created_at', { ascending: false });

      if (likedError) throw likedError;

      // Then, get all the event odds
      const { data: eventOdds, error: oddsError } = await supabase
        .from('event_moneyline_odds')
        .select('*')
        .eq('event_type', league.toLowerCase());

      if (oddsError) throw oddsError;

      // Manually join the data
      const enrichedLikes: EnrichedLikedEvent[] = likedEvents.map((like) => ({
        ...like,
        upcoming_event_odds:
          eventOdds.find((odds) => odds.id === like.event_id) || null,
      }));

      // Apply filtering
      return filterEvents(enrichedLikes, filter);
    },
    enabled: !!user,
  });

  // Mutation to like a event
  const likeMutation = useMutation({
    mutationFn: async (eventId: string) => {
      if (!user) throw new Error('User not authenticated');

      const newLike = {
        event_id: eventId,
        saving_user_id: user.id,
        created_at: new Date().toISOString(),
        event_type: league,
      };

      const { error } = await supabase.from('liked_events').insert(newLike);

      if (error) throw error;
      return newLike;
    },
    onMutate: async (eventId) => {
      if (!user) return;

      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ['liked_events', user.id, filter, league],
      });

      // Snapshot the previous value
      const previousLikes = queryClient.getQueryData<EnrichedLikedEvent[]>([
        'liked_events',
        user.id,
        filter,
        league,
      ]);

      // Optimistically update to the new value
      const newLike: EnrichedLikedEvent = {
        event_id: eventId,
        saving_user_id: user.id,
        created_at: new Date().toISOString(),
        id: Math.random(), // temporary ID
        upcoming_event_odds:
          queryClient
            .getQueryData<EventOdds[]>(['event_moneyline_odds'])
            ?.find((event) => event.id === eventId) || null,
        event_type: league,
      };

      queryClient.setQueryData<EnrichedLikedEvent[]>(
        ['liked_events', user.id, filter, league],
        (old = []) => {
          const newData = [newLike, ...old];
          return filterEvents(newData, filter);
        }
      );

      // Return a context object with the snapshotted value
      return { previousLikes };
    },
    onError: (err, newEvent, context) => {
      if (context?.previousLikes && user) {
        queryClient.setQueryData<EnrichedLikedEvent[]>(
          ['liked_events', user.id, filter, league],
          context.previousLikes
        );
      }
    },
    onSettled: (_data, _error, eventId) => {
      if (user) {
        queryClient.invalidateQueries({
          queryKey: ['liked_events', user.id, filter, league],
        });
        queryClient.invalidateQueries({
          queryKey: ['likes-count', eventId],
        });
      }
    },
  });

  // Mutation to unlike a event
  const unlikeMutation = useMutation({
    mutationFn: async (eventId: string) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('liked_events')
        .delete()
        .eq('event_id', eventId)
        .eq('saving_user_id', user.id);

      if (error) throw error;
    },
    onMutate: async (eventId) => {
      if (!user) return;

      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ['liked_events', user.id, filter, league],
      });

      // Snapshot the previous value
      const previousLikes = queryClient.getQueryData<EnrichedLikedEvent[]>([
        'liked_events',
        user.id,
        filter,
        league,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData<EnrichedLikedEvent[]>(
        ['liked_events', user.id, filter, league],
        (old = []) => {
          const newData = old.filter((like) => like.event_id !== eventId);
          return filterEvents(newData, filter);
        }
      );

      // Return a context object with the snapshotted value
      return { previousLikes };
    },
    onError: (err, eventId, context) => {
      if (context?.previousLikes && user) {
        queryClient.setQueryData<EnrichedLikedEvent[]>(
          ['liked_events', user.id, filter, league],
          context.previousLikes
        );
      }
    },
    onSettled: (_data, _error, eventId) => {
      if (user) {
        queryClient.invalidateQueries({
          queryKey: ['liked_events', user.id, filter, league],
        });
        queryClient.invalidateQueries({
          queryKey: ['likes-count', eventId],
        });
      }
    },
  });

  return {
    ...query,
    likeEvent: likeMutation.mutate,
    unlikeEvent: unlikeMutation.mutate,
    isLiking: likeMutation.isPending,
    isUnliking: unlikeMutation.isPending,
  };
}
