import { Badge } from '@/components/ui/badge';
import { Database } from '@/types/supabase';
import { isEventUpcoming } from '@/hooks/api/use-odds';

type EventOdds = Database['public']['Tables']['event_moneyline_odds']['Row'];

export function ResultsIndicator({
  event,
  isModelPredictionCorrect,
}: {
  event: EventOdds;
  isModelPredictionCorrect: boolean;
}) {
  const isEventInPast = !isEventUpcoming(event.event_datetime);

  if (!isEventInPast) return null;

  return (
    <>
      {event.result !== null ? (
        isModelPredictionCorrect ? (
          <Badge
            variant='outline'
            className='text-sm text-muted-foreground text-green-500 bg-green-500/10 border-green-500'
          >
            Correct Prediction
          </Badge>
        ) : (
          <Badge
            variant='outline'
            className='text-sm text-muted-foreground text-red-500 bg-red-500/10 border-red-500'
          >
            Wrong Prediction
          </Badge>
        )
      ) : (
        <Badge
          variant='outline'
          className='text-sm text-muted-foreground text-right text-yellow-500 bg-yellow-500/10 border-yellow-500'
        >
          No Result
        </Badge>
      )}
    </>
  );
}