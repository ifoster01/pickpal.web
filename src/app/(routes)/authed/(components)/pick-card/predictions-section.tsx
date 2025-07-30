import { CalendarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Database } from '@/types/supabase';

type EventOdds = Database['public']['Tables']['event_moneyline_odds']['Row'];

type Team = {
  name: string;
  odds: number;
  bookOdds: number;
  probability: number;
  bookProbability: number;
  picUrl: string;
};

export function PredictionsSection({
  event,
  team1,
  team2,
}: {
  event: EventOdds;
  team1: Team;
  team2: Team;
}) {
  const formatEventDateTime = (datetime: string) => {
    return new Date(datetime).toLocaleDateString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      <span className='text-lg font-semibold text-muted-foreground mb-2'>
        vs
      </span>
      {event.event_datetime && (
        <Badge
          variant='outline'
          className='flex items-center gap-2 text-sm text-muted-foreground mb-4 py-1 px-2'
        >
          <CalendarIcon className='w-4 h-4' />
          <span>{formatEventDateTime(event.event_datetime)}</span>
        </Badge>
      )}
      <div className='w-full space-y-4'>
        <div>
          <div className='flex justify-between text-sm mb-1'>
            <span>Model Prediction</span>
            <span>
              {Math.round(team1.probability * 100)}% -{' '}
              {Math.round(team2.probability * 100)}%
            </span>
          </div>
          <Progress value={team1.probability * 100} />
        </div>
        <div>
          <div className='flex justify-between text-sm mb-1'>
            <span>Sports Book</span>
            <span>
              {Math.round(team1.bookProbability * 100)}% -{' '}
              {Math.round(team2.bookProbability * 100)}%
            </span>
          </div>
          <Progress value={team1.bookProbability * 100} />
        </div>
      </div>
    </div>
  );
}
