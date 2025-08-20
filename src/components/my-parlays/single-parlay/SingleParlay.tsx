'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2, Plus, Calendar, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Components
import { ParlayLegCard } from '@/components/my-parlays/parlay-leg-card';
import { ParlayCalculationsCard } from '@/components/my-parlays/parlay-calculations-card';

// Hooks
import {
  useParlay,
  useDeleteParlay,
  useRemoveParlayLeg,
} from '@/hooks/api/use-parlays';

// Utils
import {
  calculateParlayOdds,
  calculateParlayProbability,
} from '@/utils/parlay';
import { calculateProbabilityFromOdds } from '@/utils/odds';
import { Database } from '@/types/supabase';

type EventOdds = Database['public']['Tables']['event_moneyline_odds']['Row'];

interface SingleParlayProps {
  parlayId: string;
}

export function SingleParlay({ parlayId }: SingleParlayProps) {
  const router = useRouter();

  const { data: parlay, isLoading } = useParlay(parlayId);
  const deleteParlay = useDeleteParlay();
  const removeLeg = useRemoveParlayLeg();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteParlay = async () => {
    try {
      await deleteParlay.mutateAsync(parlayId);
      router.push('/authed/my-parlays');
    } catch (error) {
      console.error('Failed to delete parlay:', error);
    }
  };

  // Calculate parlay statistics
  const parlayStats = parlay?.parlay_leg
    ? (() => {
        const legs = parlay.parlay_leg.filter(
          (leg) => leg.event_moneyline_odds
        );

        if (legs.length < 2) return null;

        // Helper function to check if an event has valid book odds
        const hasValidBookOdds = (event: EventOdds) => {
          return (
            event.book_odds1 !== null &&
            event.book_odds1 !== 0 &&
            event.book_odds2 !== null &&
            event.book_odds2 !== 0
          );
        };

        // Check if all legs have valid book odds
        const allLegsHaveBookOdds = legs.every((leg) =>
          hasValidBookOdds(leg.event_moneyline_odds!)
        );

        // Calculate model odds (favorites)
        const modelLegOdds = legs.map((leg) => {
          const event = leg.event_moneyline_odds!;
          const team1Odds = event.odds1 || 0;
          const team2Odds = event.odds2 || 0;
          return team1Odds < team2Odds ? team1Odds : team2Odds;
        });

        const modelLegProbabilities = modelLegOdds.map((odds) =>
          calculateProbabilityFromOdds(odds)
        );

        // Calculate book odds (favorites)
        const bookLegOdds = legs.map((leg) => {
          const event = leg.event_moneyline_odds!;
          const team1Odds = event.odds1 || 0;
          const team2Odds = event.odds2 || 0;
          const team1BookOdds = event.book_odds1 || 0;
          const team2BookOdds = event.book_odds2 || 0;
          return team1Odds < team2Odds ? team1BookOdds : team2BookOdds;
        });

        const bookLegProbabilities = bookLegOdds.map((odds) =>
          calculateProbabilityFromOdds(odds)
        );

        return {
          totalModelOdds: calculateParlayOdds(modelLegOdds),
          totalBookOdds: calculateParlayOdds(bookLegOdds),
          totalModelProbability: calculateParlayProbability(
            modelLegProbabilities
          ),
          totalBookProbability:
            calculateParlayProbability(bookLegProbabilities),
          legCount: legs.length,
          hasValidBookOdds: allLegsHaveBookOdds,
          legs: legs.map((leg, index) => ({
            ...leg,
            selectedOdds: modelLegOdds[index],
            probability: modelLegProbabilities[index],
          })),
        };
      })()
    : null;

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center gap-4'>
          <div className='h-10 w-10 bg-muted animate-pulse rounded-lg' />
          <div className='h-8 w-48 bg-muted animate-pulse rounded' />
        </div>
        <div className='grid gap-4'>
          {[1, 2, 3].map((i) => (
            <Card key={i} className='p-6'>
              <div className='h-32 bg-muted animate-pulse rounded' />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!parlay) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center gap-4'>
          <Link href='/authed/my-parlays'>
            <Button variant='ghost' size='sm' className='gap-2'>
              <ArrowLeft className='h-4 w-4' />
              Back to My Parlays
            </Button>
          </Link>
        </div>
        <Card className='p-12 text-center'>
          <h2 className='text-xl font-semibold mb-2'>Parlay Not Found</h2>
          <p className='text-muted-foreground mb-4'>
            The parlay you&apos;re looking for doesn&apos;t exist or you
            don&apos;t have access to it.
          </p>
          <Link href='/authed/my-parlays'>
            <Button>Back to My Parlays</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const legs = parlay.parlay_leg || [];
  const hasLegs = legs.length > 0;
  const isComplete = legs.length >= 2;

  return (
    <div className='space-y-6'>
      {/* Header - Responsive Layout */}
      <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'>
        <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
          <Link href='/authed/my-parlays'>
            <Button variant='ghost' size='sm' className='gap-2 w-fit'>
              <ArrowLeft className='h-4 w-4' />
              Back to My Parlays
            </Button>
          </Link>
          <div className='min-w-0'>
            <h1 className='text-2xl sm:text-3xl font-bold truncate'>
              {parlay.name || 'Untitled Parlay'}
            </h1>
            <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground mt-1'>
              <div className='flex items-center gap-1'>
                <Calendar className='h-4 w-4 flex-shrink-0' />
                <span>
                  Created {new Date(parlay.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className='flex items-center gap-1'>
                <Target className='h-4 w-4 flex-shrink-0' />
                <span>
                  {legs.length} leg{legs.length === 1 ? '' : 's'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className='flex items-center gap-2 sm:flex-shrink-0'>
          <Link href={`/authed/my-parlays/${parlayId}/edit`}>
            <Button variant='outline' size='sm' className='gap-2'>
              <Edit className='h-4 w-4' />
              Edit
            </Button>
          </Link>
          <Button
            variant='outline'
            size='sm'
            className='gap-2 text-destructive hover:text-destructive'
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className='h-4 w-4' />
            Delete
          </Button>
        </div>
      </div>

      {/* Status - Responsive Layout */}
      <Card className='p-4 sm:p-6'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4'>
            {isComplete ? (
              <Badge className='bg-green-600 w-fit'>Ready to Track</Badge>
            ) : hasLegs ? (
              <Badge
                variant='outline'
                className='text-yellow-600 border-yellow-600 w-fit'
              >
                Needs More Legs
              </Badge>
            ) : (
              <Badge variant='outline' className='text-muted-foreground w-fit'>
                Empty Parlay
              </Badge>
            )}

            <span className='text-sm text-muted-foreground'>
              {legs.length === 0
                ? 'Add events to start building your parlay'
                : legs.length === 1
                  ? 'Add 1 more event to complete your parlay'
                  : `${legs.length} events selected`}
            </span>
          </div>

          <Link href={`/authed/my-parlays/${parlayId}/edit`}>
            <Button
              variant='outline'
              size='sm'
              className='gap-2 w-full sm:w-auto'
            >
              <Plus className='h-4 w-4' />
              Add Events
            </Button>
          </Link>
        </div>
      </Card>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Parlay Legs */}
        <div className='lg:col-span-2 space-y-6'>
          <Card className='p-4 sm:p-6'>
            <h2 className='text-lg sm:text-xl font-semibold mb-4'>
              Parlay Legs ({legs.length})
            </h2>

            {hasLegs ? (
              <div className='space-y-4'>
                {legs.map((leg, index) => (
                  <ParlayLegCard
                    key={leg.event_id}
                    leg={leg}
                    index={index}
                    isRemoving={removeLeg.isPending}
                  />
                ))}
              </div>
            ) : (
              <div className='text-center py-8 sm:py-12'>
                <Target className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
                <h3 className='text-lg font-semibold mb-2'>No Events Added</h3>
                <p className='text-muted-foreground mb-4'>
                  Start building your parlay by adding events.
                </p>
                <Link href={`/authed/my-parlays/${parlayId}/edit`}>
                  <Button className='gap-2'>
                    <Plus className='h-4 w-4' />
                    Add Events
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        </div>

        {/* Parlay Calculations */}
        <div className='space-y-6'>
          <ParlayCalculationsCard parlayStats={parlayStats} />

          {/* Quick Actions */}
          <Card className='p-4 sm:p-6'>
            <h3 className='font-semibold mb-4'>Quick Actions</h3>
            <div className='space-y-2'>
              <Link href={`/authed/my-parlays/${parlayId}/edit`}>
                <Button variant='outline' className='w-full gap-2'>
                  <Edit className='h-4 w-4' />
                  Edit Parlay
                </Button>
              </Link>
              <Link href='/authed/create-parlay'>
                <Button variant='outline' className='w-full gap-2'>
                  <Plus className='h-4 w-4' />
                  Create Similar
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'
          onClick={() => setShowDeleteConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className='bg-background rounded-lg p-6 w-full max-w-md'
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className='text-lg font-semibold mb-2'>Delete Parlay</h3>
            <p className='text-muted-foreground mb-4'>
              Are you sure you want to delete &quot;
              {parlay.name || 'this parlay'}&quot;? This action cannot be
              undone.
            </p>
            <div className='flex gap-2 justify-end'>
              <Button
                variant='outline'
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant='destructive'
                onClick={handleDeleteParlay}
                disabled={deleteParlay.isPending}
              >
                {deleteParlay.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
