'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { useWeekLikedEvents } from '@/hooks/api/use-likes';
import { useAuth } from '@/providers/AuthProvider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventFilter } from '@/components/general/event-filter';
import { League, useLeague } from '@/providers/LeagueProvider';
import { PickCard } from '../(components)/pick-card/pick-card';
import { cn } from '@/utils/cn';
import { isEventUpcoming } from '@/hooks/api/use-odds';
import { useFilter } from '@/providers/FilterProvider';
import { Skeleton } from '@/components/ui/skeleton';
import { TimeFilter } from '../(components)/time-filter';

export default function SavedPage() {
  const { user } = useAuth();
  const { league, setLeague } = useLeague();
  const { selectedWeek, filter } = useFilter();

  const {
    data: likedEvents,
    unlikeEvent,
    isLoading,
  } = useWeekLikedEvents(selectedWeek, league, filter);

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
    if (likedEvents?.length === 0) {
      return (
        <Card className='w-full p-6'>
          <p className='text-muted-foreground'>
            You haven&apos;t saved any {league} events yet.
          </p>
        </Card>
      );
    }
    return (
      <div className='grid gap-6'>
        {likedEvents?.map((like) => {
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

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className='w-full'
      >
        <div className='flex items-center justify-between mb-8'>
          <h1 className='text-3xl font-bold'>Saved Picks</h1>
          <EventFilter className='block sm:block' />
        </div>
        <Tabs defaultValue='ufc' className='w-full' value={league}>
          <TabsList className='mb-8 w-full lg:w-fit justify-start overflow-x-auto'>
            <TabsTrigger onClick={() => setLeague('ufc')} value='ufc'>
              UFC Fights
            </TabsTrigger>
            <TabsTrigger onClick={() => setLeague('atp')} value='atp'>
              ATP Matches
            </TabsTrigger>
            <TabsTrigger onClick={() => setLeague('nfl')} value='nfl'>
              NFL Games
            </TabsTrigger>
            <TabsTrigger onClick={() => setLeague('nba')} value='nba'>
              NBA Games
            </TabsTrigger>
          </TabsList>

          {/* Week selector */}
          <div className='mb-6'>
            <TimeFilter />
          </div>
        </Tabs>
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
      className='w-full'
      key={`${league}-${selectedWeek.key}`}
    >
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold mb-8'>Saved Picks</h1>
        <EventFilter className='block sm:block' />
      </div>

      <Tabs
        defaultValue='ufc'
        className='w-full'
        value={league}
        onValueChange={(val) => setLeague(val as League)}
      >
        <TabsList className='mb-8 w-full lg:w-fit justify-start overflow-x-auto'>
          <TabsTrigger value='ufc'>UFC Fights</TabsTrigger>
          <TabsTrigger value='atp'>ATP Matches</TabsTrigger>
          <TabsTrigger value='nfl'>NFL Games</TabsTrigger>
          <TabsTrigger value='nba'>NBA Games</TabsTrigger>
        </TabsList>

        {/* Week selector */}
        <div className='mb-6'>
          <TimeFilter />
        </div>

        <TabsContent value='ufc'>{renderSavedEvents()}</TabsContent>
        <TabsContent value='nfl'>{renderSavedEvents()}</TabsContent>
        <TabsContent value='nba'>{renderSavedEvents()}</TabsContent>
        <TabsContent value='atp'>{renderSavedEvents()}</TabsContent>
      </Tabs>
    </motion.div>
  );
}
