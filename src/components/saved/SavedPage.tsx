'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { useWeekLikedEvents } from '@/hooks/api/use-likes';
import { useAuth } from '@/providers/AuthProvider';
import { EventFilter } from '@/components/general/event-filter';
import { SportsSelector } from '@/components/general/sports-selector';
import { useLeague } from '@/providers/LeagueProvider';
import { PickCard } from '@/components/general/pick-card/pick-card';
import { cn } from '@/utils/cn';
import { isEventUpcoming } from '@/hooks/api/use-odds';
import { useFilter } from '@/providers/FilterProvider';
import { Skeleton } from '@/components/ui/skeleton';
import { TimeFilter } from '@/components/general/time-filter';
import { useEventsPicks } from '@/hooks/api/use-pick';
import { useMemo } from 'react';

export function SavedPage() {
  const { user } = useAuth();
  const { league } = useLeague();
  const { selectedWeek, filter, showPicksOnly } = useFilter();

  const {
    data: likedEvents,
    unlikeEvent,
    isLoading,
  } = useWeekLikedEvents(selectedWeek, league, filter);

  // Extract events from liked events for picks hook
  const events = useMemo(() => {
    return (
      likedEvents
        ?.map((like) => like.upcoming_event_odds)
        .filter(
          (event): event is NonNullable<typeof event> => event !== null
        ) || []
    );
  }, [likedEvents]);

  // Use the useEventsPicks hook to get pick data for all events
  const { eventHasPick, isLoading: isPicksLoading } = useEventsPicks(
    events,
    league
  );

  // Filter liked events based on showPicksOnly flag
  const filteredLikedEvents = useMemo(() => {
    if (!likedEvents) return [];

    if (showPicksOnly) {
      return likedEvents.filter((like) => {
        const event = like.upcoming_event_odds;
        return event && eventHasPick(event.id);
      });
    }

    return likedEvents;
  }, [likedEvents, showPicksOnly, eventHasPick]);

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className='w-full'
      >
        <h1 className='text-3xl font-bold mb-8'>Saved Picks</h1>
        <Card className='w-full p-6'>
          <p className='text-muted-foreground'>
            Please sign in to see your saved picks.
          </p>
        </Card>
      </motion.div>
    );
  }

  const renderSavedEvents = () => {
    if (filteredLikedEvents?.length === 0) {
      return (
        <Card className='w-full p-6'>
          <p className='text-muted-foreground'>
            {showPicksOnly
              ? `You haven't saved any ${league} events with picks yet.`
              : `You haven't saved any ${league} events yet.`}
          </p>
        </Card>
      );
    }
    return (
      <div className='grid gap-6'>
        {filteredLikedEvents?.map((like) => {
          const event = like.upcoming_event_odds;
          if (!event) return null;

          const isCompleted = !isEventUpcoming(event.event_datetime);

          return (
            <div key={event.id} className={cn(isCompleted && 'opacity-75')}>
              <PickCard
                event={event}
                isLiked={true}
                onUnlike={() => unlikeEvent(event.id)}
                league={league}
              />
            </div>
          );
        })}
      </div>
    );
  };

  if (isLoading || isPicksLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className='w-full space-y-8'
      >
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold'>Saved Picks</h1>
          <EventFilter />
        </div>
        <div className='space-y-6'>
          <SportsSelector />

          {/* Week selector */}
          <TimeFilter />
        </div>
        <div className='grid gap-6'>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className='h-64 w-full' />
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className='w-full space-y-8'
      key={`${league}-${selectedWeek?.key || ''}`}
    >
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Saved Picks</h1>
        <EventFilter />
      </div>

      <div className='space-y-6'>
        <SportsSelector />

        {/* Week selector */}
        <TimeFilter />

        {renderSavedEvents()}
      </div>
    </motion.div>
  );
}
