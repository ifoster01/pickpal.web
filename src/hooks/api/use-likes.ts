import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { Database } from '@/types/supabase';
import { useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { isEventUpcoming } from './use-odds';

type LikedFight = Database['public']['Tables']['liked_fights']['Row'];
type LikedNFLGame = Database['public']['Tables']['liked_nfl_games']['Row'];
type LikedNBAGame = Database['public']['Tables']['liked_nba_games']['Row'];
type LikedATPMatch = Database['public']['Tables']['liked_atp_games']['Row'];
type FightOdds = Database['public']['Tables']['upcoming_fight_odds']['Row'];
type NFLOdds = Database['public']['Tables']['upcoming_nfl_odds']['Row'];
type NBAGameOdds = Database['public']['Tables']['upcoming_nba_odds']['Row'];
type ATPMatchOdds = Database['public']['Tables']['upcoming_atp_odds']['Row'];

type EnrichedLikedFight = LikedFight & {
  upcoming_fight_odds: FightOdds | null;
};

type EnrichedLikedNFLGame = LikedNFLGame & {
  upcoming_nfl_odds: NFLOdds | null;
};

type EnrichedLikedNBAGame = LikedNBAGame & {
  upcoming_nba_odds: NBAGameOdds | null;
};

type EnrichedLikedATPMatch = LikedATPMatch & {
  upcoming_atp_odds: ATPMatchOdds | null;
};

type Filter = 'upcoming' | 'past' | 'all';

// Helper function to filter events based on filter type
function filterEvents<
  T extends
    | EnrichedLikedFight
    | EnrichedLikedNFLGame
    | EnrichedLikedNBAGame
    | EnrichedLikedATPMatch,
>(events: T[], filter: Filter): T[] {
  return events.filter((event) => {
    const date =
      'upcoming_fight_odds' in event
        ? event.upcoming_fight_odds?.fight_date
        : 'upcoming_nfl_odds' in event
          ? event.upcoming_nfl_odds?.game_date
          : 'upcoming_nba_odds' in event
            ? event.upcoming_nba_odds?.game_date
            : 'upcoming_atp_odds' in event
              ? event.upcoming_atp_odds?.game_date
              : null;

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

export function useLikedFights(filter: Filter = 'upcoming') {
  const { user } = useAuth();
  const supabase = createClient();
  const queryClient = useQueryClient();

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('liked_fights_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'liked_fights',
          filter: `saving_user_id=eq.${user.id}`,
        },
        () => {
          // Refetch the liked fights when changes occur
          queryClient.invalidateQueries({
            queryKey: ['liked_fights', user.id, filter],
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, user, queryClient, filter]);

  // Query for liked fights
  const query = useQuery<EnrichedLikedFight[]>({
    queryKey: ['liked_fights', user?.id, filter],
    queryFn: async () => {
      if (!user) return [];

      // First, get the liked fights
      const { data: likedFights, error: likedError } = await supabase
        .from('liked_fights')
        .select('*')
        .eq('saving_user_id', user.id)
        .order('saved_at', { ascending: false });

      if (likedError) throw likedError;

      // Then, get all the fight odds
      const { data: fightOdds, error: oddsError } = await supabase
        .from('upcoming_fight_odds')
        .select('*');

      if (oddsError) throw oddsError;

      // Manually join the data
      const enrichedLikes: EnrichedLikedFight[] = likedFights.map((like) => ({
        ...like,
        upcoming_fight_odds:
          fightOdds.find((odds) => odds.fight_id === like.fight_id) || null,
      }));

      // Apply filtering
      return filterEvents(enrichedLikes, filter);
    },
    enabled: !!user,
  });

  // Mutation to like a fight
  const likeMutation = useMutation({
    mutationFn: async (fightId: string) => {
      if (!user) throw new Error('User not authenticated');

      const newLike = {
        fight_id: fightId,
        saving_user_id: user.id,
        saved_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('liked_fights').insert(newLike);

      if (error) throw error;
      return newLike;
    },
    onMutate: async (fightId) => {
      if (!user) return;

      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ['liked_fights', user.id, filter],
      });

      // Snapshot the previous value
      const previousLikes = queryClient.getQueryData<EnrichedLikedFight[]>([
        'liked_fights',
        user.id,
        filter,
      ]);

      // Optimistically update to the new value
      const newLike: EnrichedLikedFight = {
        fight_id: fightId,
        saving_user_id: user.id,
        saved_at: new Date().toISOString(),
        id: Math.random(), // temporary ID
        upcoming_fight_odds:
          queryClient
            .getQueryData<FightOdds[]>(['upcoming_fight_odds'])
            ?.find((fight) => fight.fight_id === fightId) || null,
      };

      queryClient.setQueryData<EnrichedLikedFight[]>(
        ['liked_fights', user.id, filter],
        (old = []) => {
          const newData = [newLike, ...old];
          return filterEvents(newData, filter);
        }
      );

      // Return a context object with the snapshotted value
      return { previousLikes };
    },
    onError: (err, newFight, context) => {
      if (context?.previousLikes && user) {
        queryClient.setQueryData<EnrichedLikedFight[]>(
          ['liked_fights', user.id, filter],
          context.previousLikes
        );
      }
    },
    onSettled: () => {
      if (user) {
        queryClient.invalidateQueries({
          queryKey: ['liked_fights', user.id, filter],
        });
      }
    },
  });

  // Mutation to unlike a fight
  const unlikeMutation = useMutation({
    mutationFn: async (fightId: string) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('liked_fights')
        .delete()
        .eq('fight_id', fightId)
        .eq('saving_user_id', user.id);

      if (error) throw error;
    },
    onMutate: async (fightId) => {
      if (!user) return;

      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ['liked_fights', user.id, filter],
      });

      // Snapshot the previous value
      const previousLikes = queryClient.getQueryData<EnrichedLikedFight[]>([
        'liked_fights',
        user.id,
        filter,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData<EnrichedLikedFight[]>(
        ['liked_fights', user.id, filter],
        (old = []) => {
          const newData = old.filter((like) => like.fight_id !== fightId);
          return filterEvents(newData, filter);
        }
      );

      // Return a context object with the snapshotted value
      return { previousLikes };
    },
    onError: (err, fightId, context) => {
      if (context?.previousLikes && user) {
        queryClient.setQueryData<EnrichedLikedFight[]>(
          ['liked_fights', user.id, filter],
          context.previousLikes
        );
      }
    },
    onSettled: () => {
      if (user) {
        queryClient.invalidateQueries({
          queryKey: ['liked_fights', user.id, filter],
        });
      }
    },
  });

  return {
    ...query,
    likeFight: likeMutation.mutate,
    unlikeFight: unlikeMutation.mutate,
    isLiking: likeMutation.isPending,
    isUnliking: unlikeMutation.isPending,
  };
}

export function useLikedNFLGames(filter: Filter = 'upcoming') {
  const { user } = useAuth();
  const supabase = createClient();
  const queryClient = useQueryClient();

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('liked_nfl_games_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'liked_nfl_games',
          filter: `saving_user_id=eq.${user.id}`,
        },
        () => {
          // Refetch the liked games when changes occur
          queryClient.invalidateQueries({
            queryKey: ['liked_nfl_games', user.id, filter],
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, user, queryClient, filter]);

  // Query for liked NFL games
  const query = useQuery<EnrichedLikedNFLGame[]>({
    queryKey: ['liked_nfl_games', user?.id, filter],
    queryFn: async () => {
      if (!user) return [];

      // First, get the liked NFL games
      const { data: likedGames, error: likedError } = await supabase
        .from('liked_nfl_games')
        .select('*')
        .eq('saving_user_id', user.id)
        .order('saved_at', { ascending: false });

      if (likedError) throw likedError;

      // Then, get all the NFL odds
      const { data: nflOdds, error: oddsError } = await supabase
        .from('upcoming_nfl_odds')
        .select('*');

      if (oddsError) throw oddsError;

      // Manually join the data
      const enrichedLikes: EnrichedLikedNFLGame[] = likedGames.map((like) => ({
        ...like,
        upcoming_nfl_odds:
          nflOdds.find((odds) => odds.game_id === like.game_id) || null,
      }));

      // Apply filtering
      return filterEvents(enrichedLikes, filter);
    },
    enabled: !!user,
  });

  // Mutation to like an NFL game
  const likeMutation = useMutation({
    mutationFn: async (gameId: string) => {
      if (!user) throw new Error('User not authenticated');

      const newLike = {
        game_id: gameId,
        saving_user_id: user.id,
        saved_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('liked_nfl_games').insert(newLike);

      if (error) throw error;
      return newLike;
    },
    onMutate: async (gameId) => {
      if (!user) return;

      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ['liked_nfl_games', user.id, filter],
      });

      // Snapshot the previous value
      const previousLikes = queryClient.getQueryData<EnrichedLikedNFLGame[]>([
        'liked_nfl_games',
        user.id,
        filter,
      ]);

      // Optimistically update to the new value
      const newLike: EnrichedLikedNFLGame = {
        game_id: gameId,
        saving_user_id: user.id,
        saved_at: new Date().toISOString(),
        id: Math.random(), // temporary ID
        upcoming_nfl_odds:
          queryClient
            .getQueryData<NFLOdds[]>(['upcoming_nfl_odds'])
            ?.find((game) => game.game_id === gameId) || null,
      };

      queryClient.setQueryData<EnrichedLikedNFLGame[]>(
        ['liked_nfl_games', user.id, filter],
        (old = []) => {
          const newData = [newLike, ...old];
          return filterEvents(newData, filter);
        }
      );

      // Return a context object with the snapshotted value
      return { previousLikes };
    },
    onError: (err, newGame, context) => {
      if (context?.previousLikes && user) {
        queryClient.setQueryData<EnrichedLikedNFLGame[]>(
          ['liked_nfl_games', user.id, filter],
          context.previousLikes
        );
      }
    },
    onSettled: () => {
      if (user) {
        queryClient.invalidateQueries({
          queryKey: ['liked_nfl_games', user.id, filter],
        });
      }
    },
  });

  // Mutation to unlike an NFL game
  const unlikeMutation = useMutation({
    mutationFn: async (gameId: string) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('liked_nfl_games')
        .delete()
        .eq('game_id', gameId)
        .eq('saving_user_id', user.id);

      if (error) throw error;
    },
    onMutate: async (gameId) => {
      if (!user) return;

      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ['liked_nfl_games', user.id, filter],
      });

      // Snapshot the previous value
      const previousLikes = queryClient.getQueryData<EnrichedLikedNFLGame[]>([
        'liked_nfl_games',
        user.id,
        filter,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData<EnrichedLikedNFLGame[]>(
        ['liked_nfl_games', user.id, filter],
        (old = []) => {
          const newData = old.filter((like) => like.game_id !== gameId);
          return filterEvents(newData, filter);
        }
      );

      // Return a context object with the snapshotted value
      return { previousLikes };
    },
    onError: (err, gameId, context) => {
      if (context?.previousLikes && user) {
        queryClient.setQueryData<EnrichedLikedNFLGame[]>(
          ['liked_nfl_games', user.id, filter],
          context.previousLikes
        );
      }
    },
    onSettled: () => {
      if (user) {
        queryClient.invalidateQueries({
          queryKey: ['liked_nfl_games', user.id, filter],
        });
      }
    },
  });

  return {
    ...query,
    likeGame: likeMutation.mutate,
    unlikeGame: unlikeMutation.mutate,
    isLiking: likeMutation.isPending,
    isUnliking: unlikeMutation.isPending,
  };
}

export function useLikedNBAGames(filter: Filter = 'upcoming') {
  const { user } = useAuth();
  const supabase = createClient();
  const queryClient = useQueryClient();

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('liked_nba_games_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'liked_nba_games',
          filter: `saving_user_id=eq.${user.id}`,
        },
        () => {
          // Refetch the liked games when changes occur
          queryClient.invalidateQueries({
            queryKey: ['liked_nba_games', user.id, filter],
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, user, queryClient, filter]);

  // Query for liked NBA games
  const query = useQuery<EnrichedLikedNBAGame[]>({
    queryKey: ['liked_nba_games', user?.id, filter],
    queryFn: async () => {
      if (!user) return [];

      // First, get the liked NBA games
      const { data: likedGames, error: likedError } = await supabase
        .from('liked_nba_games')
        .select('*')
        .eq('saving_user_id', user.id)
        .order('saved_at', { ascending: false });

      if (likedError) throw likedError;

      // Then, get all the NBA odds
      const { data: nbaOdds, error: oddsError } = await supabase
        .from('upcoming_nba_odds')
        .select('*');

      if (oddsError) throw oddsError;

      // Manually join the data
      const enrichedLikes: EnrichedLikedNBAGame[] = likedGames.map((like) => ({
        ...like,
        upcoming_nba_odds:
          nbaOdds.find((odds) => odds.game_id === like.game_id) || null,
      }));

      // Apply filtering
      return filterEvents(enrichedLikes, filter);
    },
    enabled: !!user,
  });

  // Mutation to like an NBA game
  const likeMutation = useMutation({
    mutationFn: async (gameId: string) => {
      if (!user) throw new Error('User not authenticated');

      const newLike = {
        game_id: gameId,
        saving_user_id: user.id,
        saved_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('liked_nba_games').insert(newLike);

      if (error) throw error;
      return newLike;
    },
    onMutate: async (gameId) => {
      if (!user) return;

      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ['liked_nba_games', user.id, filter],
      });

      // Snapshot the previous value
      const previousLikes = queryClient.getQueryData<EnrichedLikedNBAGame[]>([
        'liked_nba_games',
        user.id,
        filter,
      ]);

      // Optimistically update to the new value
      const newLike: EnrichedLikedNBAGame = {
        game_id: gameId,
        saving_user_id: user.id,
        saved_at: new Date().toISOString(),
        id: Math.random(), // temporary ID
        upcoming_nba_odds:
          queryClient
            .getQueryData<NBAGameOdds[]>(['upcoming_nba_odds'])
            ?.find((game) => game.game_id === gameId) || null,
      };

      queryClient.setQueryData<EnrichedLikedNBAGame[]>(
        ['liked_nba_games', user.id, filter],
        (old = []) => {
          const newData = [newLike, ...old];
          return filterEvents(newData, filter);
        }
      );

      // Return a context object with the snapshotted value
      return { previousLikes };
    },
    onError: (err, newGame, context) => {
      if (context?.previousLikes && user) {
        queryClient.setQueryData<EnrichedLikedNBAGame[]>(
          ['liked_nba_games', user.id, filter],
          context.previousLikes
        );
      }
    },
    onSettled: () => {
      if (user) {
        queryClient.invalidateQueries({
          queryKey: ['liked_nba_games', user.id, filter],
        });
      }
    },
  });

  // Mutation to unlike an NBA game
  const unlikeMutation = useMutation({
    mutationFn: async (gameId: string) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('liked_nba_games')
        .delete()
        .eq('game_id', gameId)
        .eq('saving_user_id', user.id);

      if (error) throw error;
    },
    onMutate: async (gameId) => {
      if (!user) return;

      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ['liked_nba_games', user.id, filter],
      });

      // Snapshot the previous value
      const previousLikes = queryClient.getQueryData<EnrichedLikedNBAGame[]>([
        'liked_nba_games',
        user.id,
        filter,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData<EnrichedLikedNBAGame[]>(
        ['liked_nba_games', user.id, filter],
        (old = []) => {
          const newData = old.filter((like) => like.game_id !== gameId);
          return filterEvents(newData, filter);
        }
      );

      // Return a context object with the snapshotted value
      return { previousLikes };
    },
    onError: (err, gameId, context) => {
      if (context?.previousLikes && user) {
        queryClient.setQueryData<EnrichedLikedNBAGame[]>(
          ['liked_nba_games', user.id, filter],
          context.previousLikes
        );
      }
    },
    onSettled: () => {
      if (user) {
        queryClient.invalidateQueries({
          queryKey: ['liked_nba_games', user.id, filter],
        });
      }
    },
  });

  return {
    ...query,
    likeNBAGame: likeMutation.mutate,
    unlikeNBAGame: unlikeMutation.mutate,
    isLiking: likeMutation.isPending,
    isUnliking: unlikeMutation.isPending,
  };
}

export function useLikedATPMatches(filter: Filter = 'upcoming') {
  const { user } = useAuth();
  const supabase = createClient();
  const queryClient = useQueryClient();

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('liked_atp_games_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'liked_atp_games',
          filter: `saving_user_id=eq.${user.id}`,
        },
        () => {
          // Refetch the liked games when changes occur
          queryClient.invalidateQueries({
            queryKey: ['liked_atp_games', user.id, filter],
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, user, queryClient, filter]);

  // Query for liked ATP games
  const query = useQuery<EnrichedLikedATPMatch[]>({
    queryKey: ['liked_atp_games', user?.id, filter],
    queryFn: async () => {
      if (!user) return [];

      // First, get the liked ATP games
      const { data: likedGames, error: likedError } = await supabase
        .from('liked_atp_games')
        .select('*')
        .eq('saving_user_id', user.id)
        .order('saved_at', { ascending: false });

      if (likedError) throw likedError;

      // Then, get all the ATP odds
      const { data: atpOdds, error: oddsError } = await supabase
        .from('upcoming_atp_odds')
        .select('*');

      if (oddsError) throw oddsError;

      // Manually join the data
      const enrichedLikes: EnrichedLikedATPMatch[] = likedGames.map((like) => ({
        ...like,
        upcoming_atp_odds:
          atpOdds.find((odds) => odds.game_id === like.game_id) || null,
      }));

      // Apply filtering
      return filterEvents(enrichedLikes, filter);
    },
    enabled: !!user,
  });

  // Mutation to like an ATP match
  const likeMutation = useMutation({
    mutationFn: async (gameId: string) => {
      if (!user) throw new Error('User not authenticated');

      const newLike = {
        game_id: gameId,
        saving_user_id: user.id,
        saved_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('liked_atp_games').insert(newLike);

      if (error) throw error;
      return newLike;
    },
    onMutate: async (gameId) => {
      if (!user) return;

      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ['liked_atp_games', user.id, filter],
      });

      // Snapshot the previous value
      const previousLikes = queryClient.getQueryData<EnrichedLikedATPMatch[]>([
        'liked_atp_games',
        user.id,
        filter,
      ]);

      // Optimistically update to the new value
      const newLike: EnrichedLikedATPMatch = {
        game_id: gameId,
        saving_user_id: user.id,
        saved_at: new Date().toISOString(),
        id: Math.random(), // temporary ID
        upcoming_atp_odds:
          queryClient
            .getQueryData<ATPMatchOdds[]>(['upcoming_atp_odds'])
            ?.find((game) => game.game_id === gameId) || null,
      };

      queryClient.setQueryData<EnrichedLikedATPMatch[]>(
        ['liked_atp_games', user.id, filter],
        (old = []) => {
          const newData = [newLike, ...old];
          return filterEvents(newData, filter);
        }
      );

      // Return a context object with the snapshotted value
      return { previousLikes };
    },
    onError: (err, newGame, context) => {
      if (context?.previousLikes && user) {
        queryClient.setQueryData<EnrichedLikedATPMatch[]>(
          ['liked_atp_games', user.id, filter],
          context.previousLikes
        );
      }
    },
    onSettled: () => {
      if (user) {
        queryClient.invalidateQueries({
          queryKey: ['liked_atp_games', user.id, filter],
        });
      }
    },
  });

  // Mutation to unlike an ATP match
  const unlikeMutation = useMutation({
    mutationFn: async (gameId: string) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('liked_atp_games')
        .delete()
        .eq('game_id', gameId)
        .eq('saving_user_id', user.id);

      if (error) throw error;
    },
    onMutate: async (gameId) => {
      if (!user) return;

      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ['liked_atp_games', user.id, filter],
      });

      // Snapshot the previous value
      const previousLikes = queryClient.getQueryData<EnrichedLikedATPMatch[]>([
        'liked_atp_games',
        user.id,
        filter,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData<EnrichedLikedATPMatch[]>(
        ['liked_atp_games', user.id, filter],
        (old = []) => {
          const newData = old.filter((like) => like.game_id !== gameId);
          return filterEvents(newData, filter);
        }
      );

      // Return a context object with the snapshotted value
      return { previousLikes };
    },
    onError: (err, gameId, context) => {
      if (context?.previousLikes && user) {
        queryClient.setQueryData<EnrichedLikedATPMatch[]>(
          ['liked_atp_games', user.id, filter],
          context.previousLikes
        );
      }
    },
    onSettled: () => {
      if (user) {
        queryClient.invalidateQueries({
          queryKey: ['liked_atp_games', user.id, filter],
        });
      }
    },
  });

  return {
    ...query,
    likeATPMatch: likeMutation.mutate,
    unlikeATPMatch: unlikeMutation.mutate,
    isLiking: likeMutation.isPending,
    isUnliking: unlikeMutation.isPending,
  };
}
