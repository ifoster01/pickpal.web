'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Components
import { EventSelector } from '@/components/create-parlay/event-selector';
import { ParlayLegsManager } from '@/components/create-parlay/parlay-legs-manager';
import { ParlaySummary } from '@/components/create-parlay/parlay-summary';

// Hooks
import {
  useParlay,
  useUpdateParlay,
  useAddParlayLeg,
  useRemoveParlayLeg,
} from '@/hooks/api/use-parlays';
import { useLeague } from '@/providers/LeagueProvider';
import { useUpcomingEventOdds } from '@/hooks/api/use-odds';

// Utils
import {
  calculateParlayOdds,
  calculateParlayProbability,
} from '@/utils/parlay';
import { calculateProbabilityFromOdds } from '@/utils/odds';
import { Database } from '@/types/supabase';

type EventOdds = Database['public']['Tables']['event_moneyline_odds']['Row'];

interface EditParlayPageProps {
  parlayId: string;
}

export function EditParlayPage({ parlayId }: EditParlayPageProps) {
  const router = useRouter();
  const { league } = useLeague();

  // Local state
  const [parlayName, setParlayName] = useState('');
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);
  const [showEventSelector, setShowEventSelector] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  // API hooks
  const { data: parlay, isLoading: parlayLoading } = useParlay(parlayId);
  const updateParlay = useUpdateParlay();
  const addLeg = useAddParlayLeg();
  const removeLeg = useRemoveParlayLeg();

  const { data: events, isLoading: eventsLoading } = useUpcomingEventOdds(
    'upcoming',
    null,
    100,
    'asc'
  );

  // Initialize form with parlay data
  useEffect(() => {
    if (parlay) {
      setParlayName(parlay.name || '');
      const currentEventIds =
        parlay.parlay_leg?.map((leg) => leg.event_id) || [];
      setSelectedEventIds(currentEventIds);
    }
  }, [parlay]);

  // Track changes
  useEffect(() => {
    if (parlay) {
      const originalEventIds =
        parlay.parlay_leg?.map((leg) => leg.event_id) || [];
      const nameChanged = parlayName !== (parlay.name || '');
      const legsChanged =
        JSON.stringify(selectedEventIds.sort()) !==
        JSON.stringify(originalEventIds.sort());
      setHasChanges(nameChanged || legsChanged);
    }
  }, [parlayName, selectedEventIds, parlay]);

  // Filter out upcoming events only
  const upcomingEvents =
    events?.filter((event) => {
      if (!event.event_datetime) return false;
      return new Date(event.event_datetime) > new Date();
    }) || [];

  // Get selected events with their data
  const selectedEvents = upcomingEvents.filter((event) =>
    selectedEventIds.includes(event.id)
  );

  // Calculate parlay odds and probability
  const parlayCalculations =
    selectedEvents.length >= 2
      ? (() => {
          // Helper function to check if an event has valid book odds
          const hasValidBookOdds = (event: EventOdds) => {
            return (
              event.book_odds1 !== null &&
              event.book_odds1 !== 0 &&
              event.book_odds2 !== null &&
              event.book_odds2 !== 0
            );
          };

          // Check if all selected events have valid book odds
          const allEventsHaveBookOdds = selectedEvents.every(hasValidBookOdds);

          // Calculate model odds (favorites)
          const modelLegOdds = selectedEvents.map((event) => {
            const team1Odds = event.odds1 || 0;
            const team2Odds = event.odds2 || 0;
            return team1Odds < team2Odds ? team1Odds : team2Odds;
          });

          const modelLegProbabilities = modelLegOdds.map((odds) =>
            calculateProbabilityFromOdds(odds)
          );

          // Calculate book odds (favorites)
          const bookLegOdds = selectedEvents.map((event) => {
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
            legCount: selectedEvents.length,
            hasValidBookOdds: allEventsHaveBookOdds,
          };
        })()
      : null;

  const handleSaveChanges = async () => {
    if (!parlay) return;

    try {
      // Update parlay name if changed
      if (parlayName !== (parlay.name || '')) {
        await updateParlay.mutateAsync({
          parlayId,
          name: parlayName,
        });
      }

      // Handle leg changes
      const originalEventIds =
        parlay.parlay_leg?.map((leg) => leg.event_id) || [];
      const eventsToAdd = selectedEventIds.filter(
        (id) => !originalEventIds.includes(id)
      );
      const eventsToRemove = originalEventIds.filter(
        (id) => !selectedEventIds.includes(id)
      );

      // Remove legs
      for (const eventId of eventsToRemove) {
        await removeLeg.mutateAsync({ parlayId, eventId });
      }

      // Add new legs
      for (const eventId of eventsToAdd) {
        await addLeg.mutateAsync({ parlayId, eventId });
      }

      // Navigate back to parlay detail
      router.push(`/authed/my-parlays/${parlayId}`);
    } catch (error) {
      console.error('Failed to save parlay changes:', error);
    }
  };

  const handleAddEvent = (eventId: string) => {
    if (!selectedEventIds.includes(eventId)) {
      setSelectedEventIds((prev) => [...prev, eventId]);
    }
  };

  const handleRemoveEvent = (eventId: string) => {
    setSelectedEventIds((prev) => prev.filter((id) => id !== eventId));
  };

  const isSaving =
    updateParlay.isPending || addLeg.isPending || removeLeg.isPending;

  if (parlayLoading || eventsLoading) {
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
            The parlay you&apos;re trying to edit doesn&apos;t exist or you
            don&apos;t have access to it.
          </p>
          <Link href='/authed/my-parlays'>
            <Button>Back to My Parlays</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header - Responsive Layout */}
      <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'>
        <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
          <Link href={`/authed/my-parlays/${parlayId}`}>
            <Button variant='ghost' size='sm' className='gap-2 w-fit'>
              <ArrowLeft className='h-4 w-4' />
              Back to Parlay
            </Button>
          </Link>
          <h1 className='text-2xl sm:text-3xl font-bold'>Edit Parlay</h1>
        </div>

        {hasChanges && (
          <div className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2'>
            <span className='text-sm text-muted-foreground sm:text-right'>
              Unsaved changes
            </span>
            <Button
              onClick={handleSaveChanges}
              disabled={!hasChanges || isSaving}
              className='w-full sm:w-auto'
            >
              {isSaving ? (
                <div className='flex items-center gap-2'>
                  <div className='w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin' />
                  Saving...
                </div>
              ) : (
                <div className='flex items-center gap-2'>
                  <Save className='h-4 w-4' />
                  Save Changes
                </div>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Parlay Name Input */}
      <Card className='p-4 sm:p-6'>
        <div className='space-y-4'>
          <div>
            <label
              htmlFor='parlay-name'
              className='text-sm font-medium mb-2 block'
            >
              Parlay Name
            </label>
            <Input
              id='parlay-name'
              placeholder='Enter parlay name'
              value={parlayName}
              onChange={(e) => setParlayName(e.target.value)}
              className='max-w-md'
            />
          </div>
        </div>
      </Card>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Event Management */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Current Legs */}
          {selectedEvents.length > 0 && (
            <Card className='p-4 sm:p-6'>
              <h2 className='text-lg sm:text-xl font-semibold mb-4'>
                Current Events ({selectedEvents.length})
              </h2>
              <ParlayLegsManager
                events={selectedEvents}
                onRemoveEvent={handleRemoveEvent}
                league={league}
              />
            </Card>
          )}

          {/* Event Selector */}
          <Card className='p-4 sm:p-6'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4'>
              <h2 className='text-lg sm:text-xl font-semibold'>
                Add More Events
              </h2>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowEventSelector(!showEventSelector)}
                className='w-full sm:w-auto'
              >
                {showEventSelector ? 'Hide' : 'Show'} Event Selector
              </Button>
            </div>

            {showEventSelector && (
              <EventSelector
                events={upcomingEvents}
                selectedEventIds={selectedEventIds}
                onAddEvent={handleAddEvent}
                onRemoveEvent={handleRemoveEvent}
                league={league}
              />
            )}
          </Card>
        </div>

        {/* Parlay Summary */}
        <div className='space-y-6'>
          <ParlaySummary
            parlayCalculations={parlayCalculations}
            selectedEvents={selectedEvents}
            parlayName={parlayName}
            league={league}
          />

          {/* Save Changes */}
          <Card className='p-4 sm:p-6'>
            <div className='space-y-4'>
              <Button
                onClick={handleSaveChanges}
                disabled={!hasChanges || isSaving}
                className='w-full'
                size='lg'
              >
                {isSaving ? (
                  <div className='flex items-center gap-2'>
                    <div className='w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin' />
                    Saving Changes...
                  </div>
                ) : (
                  <div className='flex items-center gap-2'>
                    <Save className='h-4 w-4' />
                    Save Changes
                  </div>
                )}
              </Button>

              {!hasChanges && (
                <p className='text-sm text-muted-foreground text-center'>
                  No changes to save
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
