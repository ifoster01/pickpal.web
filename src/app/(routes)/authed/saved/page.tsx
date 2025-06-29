'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { useLikedEvents } from '@/hooks/api/use-likes';
import { useAuth } from '@/providers/AuthProvider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventFilter } from '@/components/general/event-filter';
import { useLeague } from '@/providers/LeagueProvider';
import { PickCard } from '../picks/(component)/pick-card';
import { cn } from '@/utils/cn';
import { isEventUpcoming } from '@/hooks/api/use-odds';
import { useFilter } from '@/providers/FilterProvider';
import { Skeleton } from '@/components/ui/skeleton';

export default function SavedPage() {
  const { user } = useAuth();
  const { league, setLeague } = useLeague();
  const { filter } = useFilter();

  const {
    data: likedEvents,
    unlikeEvent,
    isLoading,
  } = useLikedEvents(filter, league);

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

          const isCompleted = !isEventUpcoming(event.event_date);

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
        <Tabs defaultValue='UFC' className='w-full' value={league}>
          <TabsList className='mb-8'>
            <TabsTrigger onClick={() => setLeague('UFC')} value='UFC'>
              UFC Fights
            </TabsTrigger>
            <TabsTrigger onClick={() => setLeague('NFL')} value='NFL'>
              NFL Games
            </TabsTrigger>
            <TabsTrigger onClick={() => setLeague('NBA')} value='NBA'>
              NBA Games
            </TabsTrigger>
            <TabsTrigger onClick={() => setLeague('ATP')} value='ATP'>
              ATP Matches
            </TabsTrigger>
          </TabsList>
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
      key={`${league}-${filter}`}
    >
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold mb-8'>Saved Picks</h1>
        <EventFilter className='block sm:block' />
      </div>

      <Tabs
        defaultValue='UFC'
        className='w-full'
        value={league}
        onValueChange={(val) => setLeague(val as any)}
      >
        <TabsList className='mb-8'>
          <TabsTrigger value='UFC'>UFC Fights</TabsTrigger>
          <TabsTrigger value='NFL'>NFL Games</TabsTrigger>
          <TabsTrigger value='NBA'>NBA Games</TabsTrigger>
          <TabsTrigger value='ATP'>ATP Matches</TabsTrigger>
        </TabsList>

        <TabsContent value='UFC'>{renderSavedEvents()}</TabsContent>
        <TabsContent value='NFL'>{renderSavedEvents()}</TabsContent>
        <TabsContent value='NBA'>{renderSavedEvents()}</TabsContent>
        <TabsContent value='ATP'>{renderSavedEvents()}</TabsContent>
      </Tabs>
    </motion.div>
  );
}
