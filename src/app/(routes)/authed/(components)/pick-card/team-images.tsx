import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { League } from '@/providers/LeagueProvider';
import { cn } from '@/utils/cn';
import { Database } from '@/types/supabase';
import { CircleCheck, CircleX, User } from 'lucide-react';

type EventOdds = Database['public']['Tables']['event_moneyline_odds']['Row'];

type Team = {
  name: string;
  odds: number;
  bookOdds: number;
  probability: number;
  bookProbability: number;
  picUrl: string;
};

export function TeamImages({
  event,
  isModelPredictionCorrect,
  team,
  league,
}: {
  event: EventOdds;
  isModelPredictionCorrect: boolean;
  team: Team;
  league: League;
}) {
  return (
    <div className='relative'>
      <Avatar
        className={cn(
          'relative',
          event.result !== null && isModelPredictionCorrect && team.odds < 0
            ? 'border-2 border-green-500'
            : event.result !== null &&
                !isModelPredictionCorrect &&
                team.odds < 0
              ? 'border-2 border-red-500'
              : '',
          league === 'ufc' ? 'w-[100px] h-[100px]' : 'w-[50px] h-[50px]'
        )}
      >
        <AvatarImage
          src={team.picUrl}
          alt={team.name || 'Team'}
          className='object-cover object-top'
        />
        <AvatarFallback>
          <User className='h-1/2 w-1/2 text-muted-foreground' />
        </AvatarFallback>
      </Avatar>
      {event.result !== null && isModelPredictionCorrect && team.odds < 0 && (
        <>
          <div className='absolute top-0 right-0 w-full h-full bg-green-500/10 rounded-full' />
          <CircleCheck className='absolute -bottom-4 right-[50%] translate-x-[50%] w-8 h-8 text-white fill-green-500' />
        </>
      )}
      {event.result !== null && !isModelPredictionCorrect && team.odds < 0 && (
        <>
          <div className='absolute top-0 right-0 w-full h-full bg-red-500/10 rounded-full' />
          <CircleX className='absolute -bottom-4 right-[50%] translate-x-[50%] w-8 h-8 text-white fill-red-500' />
        </>
      )}
    </div>
  );
}
