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
import { useLikedEvents } from '@/hooks/api/use-likes';
import { cn } from '@/utils/cn';
import { PickCard } from '@/app/(routes)/authed/picks/(component)/pick-card';
import { useLeague } from '@/providers/LeagueProvider';
import { useFilter } from '@/providers/FilterProvider';
import { EventFilter } from '@/components/general/event-filter';

type League = 'UFC' | 'NFL' | 'NBA' | 'ATP';

export default function PicksPage() {
  const { league, setLeague } = useLeague();
  const { filter } = useFilter();

  const { data: events, isLoading } = useUpcomingEventOdds(
    filter,
    league.toLowerCase() as 'ufc' | 'nfl' | 'nba' | 'atp'
  );

  const {
    data: likedEvents,
    likeEvent,
    unlikeEvent,
  } = useLikedEvents(filter, league);

  const likedEventIds = likedEvents?.map((like) => like.event_id) || [];

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
    </div>
  );
}
