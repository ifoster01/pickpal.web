'use client';

import { Card } from '@/components/ui/card';
import { isEventUpcoming, useWeekEventOdds } from '@/hooks/api/use-odds';
import { useWeekLikedEvents } from '@/hooks/api/use-likes';
import { cn } from '@/utils/cn';
import { PickCard } from '../(components)/pick-card/pick-card';
import { useLeague } from '@/providers/LeagueProvider';
import { useFilter } from '@/providers/FilterProvider';
import { EventFilter } from '@/components/general/event-filter';
import { SportsSelector } from '@/components/general/sports-selector';
import { TimeFilter } from '../(components)/time-filter';

export default function PicksPage() {
  const { league } = useLeague();
  const { selectedWeek, filter } = useFilter();

  const { data: events, isLoading } = useWeekEventOdds(
    selectedWeek,
    league,
    filter
  );

  const {
    data: likedEvents,
    likeEvent,
    unlikeEvent,
  } = useWeekLikedEvents(selectedWeek, league, filter);

  const likedEventIds = likedEvents?.map((like) => like.event_id) || [];

  const renderEvents = () => (
    <div className='grid gap-6'>
      {events && events.length > 0 ? (
        events.map((event) => {
          const isLiked = likedEventIds.includes(event.id);
          const isCompleted = !isEventUpcoming(event.event_datetime);

          return (
            <div key={event.id} className={cn(isCompleted && 'opacity-75')}>
              <PickCard
                event={event}
                isLiked={isLiked}
                onLike={() => likeEvent(event.id)}
                onUnlike={() => unlikeEvent(event.id)}
                league={league}
              />
            </div>
          );
        })
      ) : (
        <Card className='p-6'>
          <p className='text-center text-muted-foreground'>
            No {league} events available
          </p>
        </Card>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className='space-y-8'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold'>Model Picks</h1>
          <EventFilter />
        </div>
        <div className='space-y-6'>
          <SportsSelector />
          
          {/* Week selector */}
          <TimeFilter />
        </div>
        <div className='grid gap-6'>
          {[1, 2, 3].map((i) => (
            <Card key={i} className='p-6 animate-pulse'>
              <div className='h-40 bg-muted rounded-lg' />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Model Picks</h1>
        <EventFilter />
      </div>

      <div className='space-y-6'>
        <SportsSelector />
        
        {/* Week selector */}
        <TimeFilter />

        {renderEvents()}
      </div>
    </div>
  );
}
