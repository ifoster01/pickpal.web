import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/types/supabase";
import { useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";

type LikedFight = Database["public"]["Tables"]["liked_fights"]["Row"];
type LikedNFLGame = Database["public"]["Tables"]["liked_nfl_games"]["Row"];

export function useLikedFights() {
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
          queryClient.invalidateQueries({ queryKey: ['liked_fights', user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, user, queryClient]);

  // Query for liked fights
  const query = useQuery({
    queryKey: ['liked_fights', user?.id],
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
      const enrichedLikes = likedFights.map(like => ({
        ...like,
        upcoming_fight_odds: fightOdds.find(odds => odds.fight_id === like.fight_id) || null
      }));

      return enrichedLikes as (LikedFight & { upcoming_fight_odds: Database["public"]["Tables"]["upcoming_fight_odds"]["Row"] })[];
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

      const { error } = await supabase
        .from('liked_fights')
        .insert(newLike);

      if (error) throw error;
      return newLike;
    },
    onMutate: async (fightId) => {
      if (!user) return;

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['liked_fights', user.id] });

      // Snapshot the previous value
      const previousLikes = queryClient.getQueryData(['liked_fights', user.id]);

      // Optimistically update to the new value
      const newLike = {
        fight_id: fightId,
        saving_user_id: user.id,
        saved_at: new Date().toISOString(),
        id: Math.random(), // temporary ID
        upcoming_fight_odds: queryClient
          .getQueryData<any[]>(['upcoming_fight_odds'])
          ?.find(fight => fight.fight_id === fightId),
      };

      queryClient.setQueryData(['liked_fights', user.id], (old: any[] = []) => [
        newLike,
        ...old,
      ]);

      // Return a context object with the snapshotted value
      return { previousLikes };
    },
    onError: (err, newFight, context) => {
      if (context?.previousLikes && user) {
        queryClient.setQueryData(['liked_fights', user.id], context.previousLikes);
      }
    },
    onSettled: () => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ['liked_fights', user.id] });
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
      await queryClient.cancelQueries({ queryKey: ['liked_fights', user.id] });

      // Snapshot the previous value
      const previousLikes = queryClient.getQueryData(['liked_fights', user.id]);

      // Optimistically update to the new value
      queryClient.setQueryData(['liked_fights', user.id], (old: any[] = []) => 
        old.filter(like => like.fight_id !== fightId)
      );

      // Return a context object with the snapshotted value
      return { previousLikes };
    },
    onError: (err, fightId, context) => {
      if (context?.previousLikes && user) {
        queryClient.setQueryData(['liked_fights', user.id], context.previousLikes);
      }
    },
    onSettled: () => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ['liked_fights', user.id] });
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

export function useLikedNFLGames() {
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
          queryClient.invalidateQueries({ queryKey: ['liked_nfl_games', user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, user, queryClient]);

  // Query for liked NFL games
  const query = useQuery({
    queryKey: ['liked_nfl_games', user?.id],
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
      const enrichedLikes = likedGames.map(like => ({
        ...like,
        upcoming_nfl_odds: nflOdds.find(odds => odds.game_id === like.game_id) || null
      }));

      return enrichedLikes as (LikedNFLGame & { upcoming_nfl_odds: Database["public"]["Tables"]["upcoming_nfl_odds"]["Row"] })[];
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

      const { error } = await supabase
        .from('liked_nfl_games')
        .insert(newLike);

      if (error) throw error;
      return newLike;
    },
    onMutate: async (gameId) => {
      if (!user) return;

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['liked_nfl_games', user.id] });

      // Snapshot the previous value
      const previousLikes = queryClient.getQueryData(['liked_nfl_games', user.id]);

      // Optimistically update to the new value
      const newLike = {
        game_id: gameId,
        saving_user_id: user.id,
        saved_at: new Date().toISOString(),
        id: Math.random(), // temporary ID
        upcoming_nfl_odds: queryClient
          .getQueryData<any[]>(['upcoming_nfl_odds'])
          ?.find(game => game.game_id === gameId),
      };

      queryClient.setQueryData(['liked_nfl_games', user.id], (old: any[] = []) => [
        newLike,
        ...old,
      ]);

      // Return a context object with the snapshotted value
      return { previousLikes };
    },
    onError: (err, newGame, context) => {
      if (context?.previousLikes && user) {
        queryClient.setQueryData(['liked_nfl_games', user.id], context.previousLikes);
      }
    },
    onSettled: () => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ['liked_nfl_games', user.id] });
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
      await queryClient.cancelQueries({ queryKey: ['liked_nfl_games', user.id] });

      // Snapshot the previous value
      const previousLikes = queryClient.getQueryData(['liked_nfl_games', user.id]);

      // Optimistically update to the new value
      queryClient.setQueryData(['liked_nfl_games', user.id], (old: any[] = []) => 
        old.filter(like => like.game_id !== gameId)
      );

      // Return a context object with the snapshotted value
      return { previousLikes };
    },
    onError: (err, gameId, context) => {
      if (context?.previousLikes && user) {
        queryClient.setQueryData(['liked_nfl_games', user.id], context.previousLikes);
      }
    },
    onSettled: () => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ['liked_nfl_games', user.id] });
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