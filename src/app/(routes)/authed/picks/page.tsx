'use client';

import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { isEventUpcoming, useUpcomingEventOdds } from '@/hooks/api/use-odds';
import { useLikedEvents } from '@/hooks/api/use-likes';
import { cn } from '@/utils/cn';
import { PickCard } from '@/app/(routes)/authed/picks/(component)/pick-card';
import { League, useLeague } from '@/providers/LeagueProvider';
import { useFilter } from '@/providers/FilterProvider';
import { EventFilter } from '@/components/general/event-filter';

export default function PicksPage() {
  const { league, setLeague } = useLeague();
  const { filter } = useFilter();

  const { data: events, isLoading } = useUpcomingEventOdds(filter, league);

  const {
    data: likedEvents,
    likeEvent,
    unlikeEvent,
  } = useLikedEvents(filter, league);

  const likedEventIds = likedEvents?.map((like) => like.event_id) || [];

  const renderEvents = () => (
    <div className='grid gap-6'>
      {events && events.length > 0 ? (
        events.map((event) => {
          const isLiked = likedEventIds.includes(event.id);
          const isCompleted = !isEventUpcoming(event.event_date);

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
        <Tabs defaultValue='ufc' className='w-full' value={league}>
          <TabsList className='mb-8 w-full lg:w-fit justify-start overflow-x-auto'>
            <TabsTrigger onClick={() => setLeague('ufc')} value='ufc'>
              UFC Fights
            </TabsTrigger>
            <TabsTrigger onClick={() => setLeague('nfl')} value='nfl'>
              NFL Games
            </TabsTrigger>
            <TabsTrigger onClick={() => setLeague('nba')} value='nba'>
              NBA Games
            </TabsTrigger>
            <TabsTrigger onClick={() => setLeague('atp')} value='atp'>
              ATP Matches
            </TabsTrigger>
          </TabsList>
        </Tabs>
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

      <Tabs
        defaultValue='ufc'
        className='w-full'
        value={league}
        onValueChange={(val) => setLeague(val as League)}
      >
        <TabsList className='mb-8 w-full lg:w-fit justify-start overflow-x-auto'>
          <TabsTrigger value='ufc'>UFC Fights</TabsTrigger>
          <TabsTrigger value='nfl'>NFL Games</TabsTrigger>
          <TabsTrigger value='nba'>NBA Games</TabsTrigger>
          <TabsTrigger value='atp'>ATP Matches</TabsTrigger>
        </TabsList>

        <TabsContent value='ufc'>{renderEvents()}</TabsContent>
        <TabsContent value='nfl'>{renderEvents()}</TabsContent>
        <TabsContent value='nba'>{renderEvents()}</TabsContent>
        <TabsContent value='atp'>{renderEvents()}</TabsContent>
      </Tabs>
    </div>
  );
}
