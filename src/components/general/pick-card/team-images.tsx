import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/utils/cn';
import { Database } from '@/types/supabase';
import { CircleCheck, CircleX, Star, User } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
  pick,
}: {
  event: EventOdds;
  isModelPredictionCorrect: boolean;
  team: Team;
  pick: boolean;
}) {
  console.log(pick, team.odds, team.bookOdds);
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
          'w-[100px] h-[100px]'
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
      {pick && (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Star className='absolute -top-1 -right-1 w-10 h-10 text-white fill-purple-500' />
          </TooltipTrigger>
          <TooltipContent>
            <p>Super Pick</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
