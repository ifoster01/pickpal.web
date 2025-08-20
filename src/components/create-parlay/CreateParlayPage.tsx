'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Components
import { ParlaySummary } from './parlay-summary';
import { EventSelector } from './event-selector';
import { ParlayLegsManager } from './parlay-legs-manager';

// Hooks
import { useCreateParlay, useAddParlayLeg } from '@/hooks/api/use-parlays';
import { useUpcomingEventOdds } from '@/hooks/api/use-odds';
import { useLeague } from '@/providers/LeagueProvider';

// Utils
import {
  calculateParlayOdds,
  calculateParlayProbability,
} from '@/utils/parlay';
import { calculateProbabilityFromOdds } from '@/utils/odds';
import { Database } from '@/types/supabase';

type EventOdds = Database['public']['Tables']['event_moneyline_odds']['Row'];

export function CreateParlayPage() {
  const router = useRouter();
  const { league } = useLeague();

  // Local state
  const [parlayName, setParlayName] = useState('');
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);
  const [showEventSelector, setShowEventSelector] = useState(true);

  // API hooks
  const createParlay = useCreateParlay();
  const addLeg = useAddParlayLeg();

  const { data: events, isLoading: eventsLoading } = useUpcomingEventOdds(
    'upcoming',
    null,
    100,
    'asc'
  );

  // Filter out upcoming events only
  const upcomingEvents = useMemo(() => {
    if (!events) return [];
    const now = new Date();
    return events.filter((event) => {
      if (!event.event_datetime) return false;
      return new Date(event.event_datetime) > now;
    });
  }, [events]);

  // Get selected events with their data
  const selectedEvents = useMemo(() => {
    return upcomingEvents.filter((event) =>
      selectedEventIds.includes(event.id)
    );
  }, [upcomingEvents, selectedEventIds]);

  // Calculate parlay odds and probability
  const parlayCalculations = useMemo(() => {
    if (selectedEvents.length < 2) return null;

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
      totalModelProbability: calculateParlayProbability(modelLegProbabilities),
      totalBookProbability: calculateParlayProbability(bookLegProbabilities),
      legCount: selectedEvents.length,
      hasValidBookOdds: allEventsHaveBookOdds,
    };
  }, [selectedEvents]);

  const handleCreateParlay = async () => {
    try {
      const name =
        parlayName.trim() ||
        `${league.toUpperCase()} Parlay - ${new Date().toLocaleDateString()}`;
      const parlay = await createParlay.mutateAsync({ name });

      // Add all selected events as legs
      for (const eventId of selectedEventIds) {
        await addLeg.mutateAsync({ parlayId: parlay.id, eventId });
      }

      // Navigate to the created parlay
      router.push(`/authed/my-parlays/${parlay.id}`);
    } catch (error) {
      console.error('Failed to create parlay:', error);
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

  const canCreateParlay = selectedEvents.length >= 2 && !createParlay.isPending;

  if (eventsLoading) {
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

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Link href='/authed/my-parlays'>
            <Button variant='ghost' size='sm' className='gap-2'>
              <ArrowLeft className='h-4 w-4' />
              Back to My Parlays
            </Button>
          </Link>
          <h1 className='text-3xl font-bold'>Create New Parlay</h1>
        </div>
      </div>

      {/* Parlay Name Input */}
      <Card className='p-6'>
        <div className='space-y-4'>
          <div>
            <label
              htmlFor='parlay-name'
              className='text-sm font-medium mb-2 block'
            >
              Parlay Name (Optional)
            </label>
            <Input
              id='parlay-name'
              placeholder={`Parlay - ${new Date().toLocaleDateString()}`}
              value={parlayName}
              onChange={(e) => setParlayName(e.target.value)}
              className='max-w-md'
            />
          </div>
        </div>
      </Card>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Event Selection */}
        <div className='lg:col-span-2 space-y-6'>
          <Card className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-semibold'>Available Events</h2>
              {selectedEventIds.length > 0 && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setShowEventSelector(!showEventSelector)}
                >
                  {showEventSelector ? 'Hide' : 'Show'} Event Selector
                </Button>
              )}
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

          {/* Selected Events Manager */}
          {selectedEvents.length > 0 && (
            <Card className='p-6'>
              <h2 className='text-xl font-semibold mb-4'>
                Selected Events ({selectedEvents.length})
              </h2>
              <ParlayLegsManager
                events={selectedEvents}
                onRemoveEvent={handleRemoveEvent}
                league={league}
              />
            </Card>
          )}
        </div>

        {/* Parlay Summary */}
        <div className='space-y-6'>
          <ParlaySummary
            parlayCalculations={parlayCalculations}
            selectedEvents={selectedEvents}
            parlayName={parlayName}
            league={league}
          />

          {/* Create Parlay Button */}
          <Card className='p-6'>
            <div className='space-y-4'>
              <Button
                onClick={handleCreateParlay}
                disabled={!canCreateParlay}
                className='w-full'
                size='lg'
              >
                {createParlay.isPending ? (
                  <div className='flex items-center gap-2'>
                    <div className='w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin' />
                    Creating Parlay...
                  </div>
                ) : (
                  <div className='flex items-center gap-2'>
                    <Save className='h-4 w-4' />
                    Create Parlay
                  </div>
                )}
              </Button>

              {selectedEvents.length < 2 && (
                <p className='text-sm text-muted-foreground text-center'>
                  Select at least 2 events to create a parlay
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
