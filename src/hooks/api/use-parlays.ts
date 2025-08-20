'use client';

import { Database } from '@/types/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type UserParlay = Database['public']['Tables']['user_parlays']['Row'];
type ParlayLeg = Database['public']['Tables']['parlay_leg']['Row'];
type EventOdds = Database['public']['Tables']['event_moneyline_odds']['Row'];

interface ParlayWithLegs extends UserParlay {
  parlay_leg: Array<
    ParlayLeg & {
      event_moneyline_odds: EventOdds;
    }
  >;
}

interface ParlayWithLegCount extends UserParlay {
  parlay_leg: Array<{ count: number }>;
}

// API Response Types
interface ParlaysResponse {
  parlays: ParlayWithLegCount[];
}

interface ParlayResponse {
  parlay: ParlayWithLegs;
}

interface CreateParlayResponse {
  parlay: UserParlay;
}

interface LegsResponse {
  legs: Array<
    ParlayLeg & {
      event_moneyline_odds: EventOdds;
    }
  >;
}

interface LegResponse {
  leg: ParlayLeg & {
    event_moneyline_odds: EventOdds;
  };
}

/**
 * Hook to fetch all parlays for the current user
 */
export const useParlays = () => {
  return useQuery({
    queryKey: ['parlays'],
    queryFn: async (): Promise<ParlayWithLegCount[]> => {
      const response = await fetch('/api/parlays');
      if (!response.ok) {
        throw new Error('Failed to fetch parlays');
      }
      const data: ParlaysResponse = await response.json();
      return data.parlays;
    },
  });
};

/**
 * Hook to fetch a specific parlay with its legs
 */
export const useParlay = (parlayId: string) => {
  return useQuery({
    queryKey: ['parlay', parlayId],
    queryFn: async (): Promise<ParlayWithLegs> => {
      const response = await fetch(`/api/parlays/${parlayId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch parlay');
      }
      const data: ParlayResponse = await response.json();
      return data.parlay;
    },
    enabled: !!parlayId,
  });
};

/**
 * Hook to fetch legs for a specific parlay
 */
export const useParlayLegs = (parlayId: string) => {
  return useQuery({
    queryKey: ['parlay', parlayId, 'legs'],
    queryFn: async (): Promise<
      Array<ParlayLeg & { event_moneyline_odds: EventOdds }>
    > => {
      const response = await fetch(`/api/parlays/${parlayId}/legs`);
      if (!response.ok) {
        throw new Error('Failed to fetch parlay legs');
      }
      const data: LegsResponse = await response.json();
      return data.legs;
    },
    enabled: !!parlayId,
  });
};

/**
 * Hook to create a new parlay
 */
export const useCreateParlay = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { name?: string }): Promise<UserParlay> => {
      const response = await fetch('/api/parlays', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create parlay');
      }

      const data: CreateParlayResponse = await response.json();
      return data.parlay;
    },
    onSuccess: () => {
      // Invalidate parlays list to refetch with new parlay
      queryClient.invalidateQueries({ queryKey: ['parlays'] });
    },
  });
};

/**
 * Hook to update a parlay
 */
export const useUpdateParlay = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      parlayId: string;
      name?: string;
    }): Promise<UserParlay> => {
      const { parlayId, ...updateData } = params;
      const response = await fetch(`/api/parlays/${parlayId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update parlay');
      }

      const data: { parlay: UserParlay } = await response.json();
      return data.parlay;
    },
    onSuccess: (_, { parlayId }) => {
      // Invalidate specific parlay and parlays list
      queryClient.invalidateQueries({ queryKey: ['parlay', parlayId] });
      queryClient.invalidateQueries({ queryKey: ['parlays'] });
    },
  });
};

/**
 * Hook to delete a parlay
 */
export const useDeleteParlay = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (parlayId: string): Promise<void> => {
      const response = await fetch(`/api/parlays/${parlayId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete parlay');
      }
    },
    onSuccess: (_, parlayId) => {
      // Remove specific parlay from cache and invalidate parlays list
      queryClient.removeQueries({ queryKey: ['parlay', parlayId] });
      queryClient.invalidateQueries({ queryKey: ['parlays'] });
    },
  });
};

/**
 * Hook to add a leg to a parlay
 */
export const useAddParlayLeg = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { parlayId: string; eventId: string }) => {
      const { parlayId, eventId } = params;
      const response = await fetch(`/api/parlays/${parlayId}/legs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add leg to parlay');
      }

      const data: LegResponse = await response.json();
      return data.leg;
    },
    onSuccess: (_, { parlayId }) => {
      // Invalidate parlay data to refetch with new leg
      queryClient.invalidateQueries({ queryKey: ['parlay', parlayId] });
      queryClient.invalidateQueries({ queryKey: ['parlay', parlayId, 'legs'] });
      queryClient.invalidateQueries({ queryKey: ['parlays'] }); // To update leg count
    },
  });
};

/**
 * Hook to remove a leg from a parlay
 */
export const useRemoveParlayLeg = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      parlayId: string;
      eventId: string;
    }): Promise<void> => {
      const { parlayId, eventId } = params;
      const response = await fetch(`/api/parlays/${parlayId}/legs`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to remove leg from parlay');
      }
    },
    onSuccess: (_, { parlayId }) => {
      // Invalidate parlay data to refetch without removed leg
      queryClient.invalidateQueries({ queryKey: ['parlay', parlayId] });
      queryClient.invalidateQueries({ queryKey: ['parlay', parlayId, 'legs'] });
      queryClient.invalidateQueries({ queryKey: ['parlays'] }); // To update leg count
    },
  });
};

/**
 * Helper hook to check if an event is already in a parlay
 */
export const useIsEventInParlay = (parlayId: string, eventId: string) => {
  const { data: legs } = useParlayLegs(parlayId);

  return legs?.some((leg) => leg.event_id === eventId) ?? false;
};
