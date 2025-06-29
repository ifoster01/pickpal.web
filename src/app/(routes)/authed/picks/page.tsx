'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { isEventUpcoming, useUpcomingEventOdds } from '@/hooks/api/use-odds';
import {
  useLikedATPMatches,
  useLikedFights,
  useLikedNBAGames,
  useLikedNFLGames,
} from '@/hooks/api/use-likes';
import { cn } from '@/utils/cn';
import { PickCard } from '@/app/(routes)/authed/picks/(component)/pick-card';
import { useLeague } from '@/providers/LeagueProvider';
import { useFilter } from '@/providers/FilterProvider';
import { EventFilter } from '@/components/general/event-filter';

type League = 'UFC' | 'NFL' | 'NBA' | 'ATP';
type Filter = 'upcoming' | 'past' | 'all';

export default function PicksPage() {
  const { league, setLeague } = useLeague();
  const { filter } = useFilter();

  // UFC Data
  const { data: fights, isLoading: isLoadingFights } = useUpcomingEventOdds(
    filter,
    'ufc'
  );
  const { data: likedFights, likeFight, unlikeFight } = useLikedFights(filter);
  const likedFightIds = likedFights?.map((like) => like.fight_id) || [];

  // NFL Data
  const { data: games, isLoading: isLoadingGames } = useUpcomingEventOdds(
    filter,
    'nfl'
  );
  const { data: likedGames, likeGame, unlikeGame } = useLikedNFLGames(filter);
  const likedGameIds = likedGames?.map((like) => like.game_id) || [];

  // NBA Data
  const { data: nbaGames, isLoading: isLoadingNBAGames } = useUpcomingEventOdds(
    filter,
    'nba'
  );
  const {
    data: likedNBAGames,
    likeNBAGame,
    unlikeNBAGame,
  } = useLikedNBAGames(filter);
  const likedNBAGameIds = likedNBAGames?.map((like) => like.game_id) || [];

  // ATP Data
  const { data: atpMatches, isLoading: isLoadingATPMatches } =
    useUpcomingEventOdds(filter, 'atp');
  const {
    data: likedATPMatches,
    likeATPMatch,
    unlikeATPMatch,
  } = useLikedATPMatches(filter);
  const likedATPMatchIds = likedATPMatches?.map((like) => like.game_id) || [];

  const isLoading =
    league === 'UFC'
      ? isLoadingFights
      : league === 'NFL'
        ? isLoadingGames
        : league === 'NBA'
          ? isLoadingNBAGames
          : league === 'ATP'
            ? isLoadingATPMatches
            : false;

  if (isLoading) {
    return (
      <div className='space-y-8'>
        <div className='flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex justify-between sm:justify-start items-center gap-4'>
            <h1 className='text-3xl font-bold'>Model Picks</h1>
            <div className='block sm:hidden'>
              <Button variant='outline' size='icon' disabled>
                <Filter className='h-4 w-4' />
              </Button>
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <div className='animate-pulse w-[120px] h-10 bg-muted rounded-md' />
            <div className='hidden sm:block'>
              <Button variant='outline' size='icon' disabled>
                <Filter className='h-4 w-4' />
              </Button>
            </div>
          </div>
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
      <div className='flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex justify-between sm:justify-start items-center gap-4'>
          <h1 className='text-3xl font-bold'>Model Picks</h1>
          <EventFilter />
        </div>
        <div className='flex items-center gap-4'>
          <Select
            value={league}
            onValueChange={(value: League) => setLeague(value)}
          >
            <SelectTrigger className='w-full sm:w-[120px]'>
              <SelectValue placeholder='Select League' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='UFC'>UFC</SelectItem>
              <SelectItem value='NFL'>NFL</SelectItem>
              <SelectItem value='NBA'>NBA</SelectItem>
              <SelectItem value='ATP'>ATP</SelectItem>
            </SelectContent>
          </Select>
          <EventFilter className='hidden sm:block' />
        </div>
      </div>

      <div className='grid gap-6'>
        {league === 'UFC' ? (
          // UFC Fights
          fights && fights.length > 0 ? (
            fights.map((fight) => {
              const isLiked = likedFightIds.includes(fight.id);
              const isCompleted = !isEventUpcoming(fight.event_date);

              return (
                <div key={fight.id} className={cn(isCompleted && 'opacity-75')}>
                  <PickCard
                    event={fight}
                    isLiked={isLiked}
                    onLike={() => likeFight(fight.id)}
                    onUnlike={() => unlikeFight(fight.id)}
                    league='UFC'
                  />
                </div>
              );
            })
          ) : (
            <Card className='p-6'>
              <p className='text-center text-muted-foreground'>
                No UFC fights available
              </p>
            </Card>
          )
        ) : league === 'NFL' ? (
          // NFL Games
          games && games.length > 0 ? (
            games.map((game) => {
              const isLiked = likedGameIds.includes(game.id);
              const isCompleted = !isEventUpcoming(game.event_date);

              return (
                <div key={game.id} className={cn(isCompleted && 'opacity-75')}>
                  <PickCard
                    event={game}
                    isLiked={isLiked}
                    onLike={() => likeGame(game.id)}
                    onUnlike={() => unlikeGame(game.id)}
                    league='NFL'
                  />
                </div>
              );
            })
          ) : (
            <Card className='p-6'>
              <p className='text-center text-muted-foreground'>
                No NFL games available
              </p>
            </Card>
          )
        ) : league === 'NBA' ? (
          // NBA Games
          nbaGames && nbaGames.length > 0 ? (
            nbaGames.map((game) => {
              const isLiked = likedNBAGameIds.includes(game.id);
              const isCompleted = !isEventUpcoming(game.event_date);

              return (
                <div key={game.id} className={cn(isCompleted && 'opacity-75')}>
                  <PickCard
                    event={game}
                    isLiked={isLiked}
                    onLike={() => likeNBAGame(game.id)}
                    onUnlike={() => unlikeNBAGame(game.id)}
                    league='NBA'
                  />
                </div>
              );
            })
          ) : (
            <Card className='p-6'>
              <p className='text-center text-muted-foreground'>
                No NBA games available
              </p>
            </Card>
          )
        ) : // ATP Matches
        atpMatches && atpMatches.length > 0 ? (
          atpMatches.map((match) => {
            const isLiked = likedATPMatchIds.includes(match.id);
            const isCompleted = !isEventUpcoming(match.event_date);

            return (
              <div key={match.id} className={cn(isCompleted && 'opacity-75')}>
                <PickCard
                  event={match}
                  isLiked={isLiked}
                  onLike={() => likeATPMatch(match.id)}
                  onUnlike={() => unlikeATPMatch(match.id)}
                  league='ATP'
                />
              </div>
            );
          })
        ) : (
          <Card className='p-6'>
            <p className='text-center text-muted-foreground'>
              No ATP matches available
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
