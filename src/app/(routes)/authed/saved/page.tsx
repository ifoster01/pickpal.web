'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import {
  useLikedATPMatches,
  useLikedFights,
  useLikedNBAGames,
  useLikedNFLGames,
} from '@/hooks/api/use-likes';
import { useAuth } from '@/providers/AuthProvider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventFilter } from '@/components/general/event-filter';
import { useLeague } from '@/providers/LeagueProvider';
import { PickCard } from '../picks/(component)/pick-card';
import { cn } from '@/utils/cn';
import { isEventUpcoming } from '@/hooks/api/use-odds';
import { useFilter } from '@/providers/FilterProvider';

export default function SavedPage() {
  const { user } = useAuth();
  const { league, setLeague } = useLeague();
  const { filter } = useFilter();

  const {
    data: likedFights,
    unlikeFight,
    isLoading: isLoadingFights,
  } = useLikedFights(filter);

  const {
    data: likedGames,
    unlikeGame,
    isLoading: isLoadingGames,
  } = useLikedNFLGames(filter);

  const {
    data: likedNBAGames,
    unlikeNBAGame,
    isLoading: isLoadingNBAGames,
  } = useLikedNBAGames(filter);

  const {
    data: likedATPMatches,
    unlikeATPMatch,
    isLoading: isLoadingATPMatches,
  } = useLikedATPMatches(filter);

  const isLoading =
    isLoadingFights ||
    isLoadingGames ||
    isLoadingNBAGames ||
    isLoadingATPMatches;

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

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className='w-full'
      >
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold mb-8'>Saved Picks</h1>
          <EventFilter className='block sm:block' />
        </div>
        <Card className='w-full p-6'>
          <div className='animate-pulse space-y-4'>
            <div className='h-8 bg-muted rounded w-1/3' />
            <div className='h-32 bg-muted rounded' />
          </div>
        </Card>
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

        <TabsContent value='UFC'>
          {likedFights?.length === 0 ? (
            <Card className='w-full p-6'>
              <p className='text-muted-foreground'>
                You haven&apos;t saved any fights yet.
              </p>
            </Card>
          ) : (
            <div className='grid gap-6'>
              {likedFights?.map((like) => {
                const fight = like.upcoming_fight_odds;
                if (!fight) return null;

                const isCompleted = !isEventUpcoming(fight.event_date);

                return (
                  <div
                    key={fight.id}
                    className={cn(isCompleted && 'opacity-75')}
                  >
                    <PickCard
                      event={fight}
                      isLiked={true}
                      onUnlike={() => unlikeFight(fight.id)}
                      league='UFC'
                    />
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value='NFL'>
          {likedGames?.length === 0 ? (
            <Card className='w-full p-6'>
              <p className='text-muted-foreground'>
                You haven&apos;t saved any NFL games yet.
              </p>
            </Card>
          ) : (
            <div className='grid gap-6'>
              {likedGames?.map((like) => {
                const game = like.upcoming_nfl_odds;
                if (!game) return null;

                const isCompleted = !isEventUpcoming(game.event_date);

                return (
                  <div
                    key={game.id}
                    className={cn(isCompleted && 'opacity-75')}
                  >
                    <PickCard
                      event={game}
                      isLiked={true}
                      onUnlike={() => unlikeGame(game.id)}
                      league='NFL'
                    />
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value='NBA'>
          {likedNBAGames?.length === 0 ? (
            <Card className='w-full p-6'>
              <p className='text-muted-foreground'>
                You haven&apos;t saved any NBA games yet.
              </p>
            </Card>
          ) : (
            <div className='grid gap-6'>
              {likedNBAGames?.map((like) => {
                const game = like.upcoming_nba_odds;
                if (!game) return null;

                const isCompleted = !isEventUpcoming(game.event_date);

                return (
                  <div
                    key={game.id}
                    className={cn(isCompleted && 'opacity-75')}
                  >
                    <PickCard
                      event={game}
                      isLiked={true}
                      onUnlike={() => unlikeNBAGame(game.id)}
                      league='NBA'
                    />
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value='ATP'>
          {likedATPMatches?.length === 0 ? (
            <Card className='w-full p-6'>
              <p className='text-muted-foreground'>
                You haven&apos;t saved any ATP matches yet.
              </p>
            </Card>
          ) : (
            <div className='grid gap-6'>
              {likedATPMatches?.map((like) => {
                const game = like.upcoming_atp_odds;
                if (!game) return null;

                const isCompleted = !isEventUpcoming(game.event_date);

                return (
                  <div
                    key={game.id}
                    className={cn(isCompleted && 'opacity-75')}
                  >
                    <PickCard
                      event={game}
                      isLiked={true}
                      onUnlike={() => unlikeATPMatch(game.id)}
                      league='ATP'
                    />
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
