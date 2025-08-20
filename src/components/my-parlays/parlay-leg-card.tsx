'use client';

import { Database } from '@/types/supabase';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, User } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/utils/cn';
import { calculateProbabilityFromOdds } from '@/utils/odds';

type ParlayLeg = Database['public']['Tables']['parlay_leg']['Row'];
type EventOdds = Database['public']['Tables']['event_moneyline_odds']['Row'];

interface ParlayLegWithEvent extends ParlayLeg {
  event_moneyline_odds: EventOdds;
}

interface ParlayLegCardProps {
  leg: ParlayLegWithEvent;
  index: number;
  isRemoving?: boolean;
}

export function ParlayLegCard({ leg, index, isRemoving }: ParlayLegCardProps) {
  const event = leg.event_moneyline_odds;

  if (!event) {
    return (
      <Card className='p-4 opacity-50'>
        <p className='text-center text-muted-foreground'>
          Event data not available
        </p>
      </Card>
    );
  }

  // Calculate probabilities and determine favorite
  const team1Prob = calculateProbabilityFromOdds(event.odds1 || 0);
  const team2Prob = calculateProbabilityFromOdds(event.odds2 || 0);
  const favorite = team1Prob > team2Prob ? 'team1' : 'team2';

  // Get favorite team details
  const favoriteTeam =
    favorite === 'team1'
      ? {
          name: event.team1_name,
          odds: event.odds1,
          bookOdds: event.book_odds1,
          probability: team1Prob,
          picUrl: event.team1_pic_url,
        }
      : {
          name: event.team2_name,
          odds: event.odds2,
          bookOdds: event.book_odds2,
          probability: team2Prob,
          picUrl: event.team2_pic_url,
        };

  const underdog =
    favorite === 'team1'
      ? {
          name: event.team2_name,
          odds: event.odds2,
          bookOdds: event.book_odds2,
          probability: team2Prob,
          picUrl: event.team2_pic_url,
        }
      : {
          name: event.team1_name,
          odds: event.odds1,
          bookOdds: event.book_odds1,
          probability: team1Prob,
          picUrl: event.team1_pic_url,
        };

  // Check if event is upcoming
  const isUpcoming = event.event_datetime
    ? new Date(event.event_datetime) > new Date()
    : true;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          'group relative overflow-hidden',
          !isUpcoming && 'opacity-75 bg-muted/30',
          isRemoving && 'opacity-50 pointer-events-none'
        )}
      >
        {/* Leg Number */}
        <div className='absolute top-4 left-4 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center z-10'>
          <span className='text-sm font-semibold text-primary'>
            {index + 1}
          </span>
        </div>

        <div className='p-6 pt-12'>
          {/* Event Header */}
          <div className='mb-4'>
            <h3 className='font-semibold text-lg mb-1'>
              {event.event_name || `${event.team1_name} vs ${event.team2_name}`}
            </h3>
            <div className='flex items-center gap-4 text-sm text-muted-foreground'>
              {event.tournament && (
                <Badge variant='secondary' className='text-xs'>
                  {event.tournament}
                </Badge>
              )}
              {event.event_datetime && (
                <div className='flex items-center gap-1'>
                  <Calendar className='h-3 w-3' />
                  <span className='text-xs'>
                    {new Date(event.event_datetime).toLocaleDateString()} at{' '}
                    {new Date(event.event_datetime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              )}
              {!isUpcoming && (
                <Badge
                  variant='outline'
                  className='text-xs text-muted-foreground'
                >
                  Completed
                </Badge>
              )}
            </div>
          </div>

          {/* Teams Comparison */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Favorite */}
            <div className='space-y-3'>
              <div className='flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20'>
                {favoriteTeam.picUrl ? (
                  <div className='relative w-10 h-10 rounded-full overflow-hidden bg-white flex-shrink-0'>
                    <Image
                      src={favoriteTeam.picUrl}
                      alt={favoriteTeam.name || 'Team'}
                      fill
                      className='object-cover object-top'
                    />
                  </div>
                ) : (
                  <User className='h-8 w-8 text-muted-foreground flex-shrink-0' />
                )}
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2 mb-1'>
                    <p className='font-medium text-primary truncate'>
                      {favoriteTeam.name}
                    </p>
                    <Badge variant='secondary' className='text-xs'>
                      Favorite
                    </Badge>
                  </div>
                  <div className='flex items-center gap-3 text-sm'>
                    <div>
                      <span className='text-muted-foreground'>Model: </span>
                      <span className='font-mono font-medium text-primary'>
                        {favoriteTeam.odds && favoriteTeam.odds > 0 ? '+' : ''}
                        {favoriteTeam.odds}
                      </span>
                    </div>
                    <div>
                      <span className='text-muted-foreground'>Book: </span>
                      <span className='font-mono'>
                        {favoriteTeam.bookOdds && favoriteTeam.bookOdds > 0
                          ? '+'
                          : ''}
                        {favoriteTeam.bookOdds}
                      </span>
                    </div>
                  </div>
                  <p className='text-xs text-muted-foreground mt-1'>
                    {(favoriteTeam.probability * 100).toFixed(1)}% win
                    probability
                  </p>
                </div>
              </div>
            </div>

            {/* Underdog */}
            <div className='space-y-3'>
              <div className='flex items-center gap-3 p-3 bg-muted/30 rounded-lg'>
                {underdog.picUrl ? (
                  <div className='relative w-10 h-10 rounded-full overflow-hidden bg-white flex-shrink-0'>
                    <Image
                      src={underdog.picUrl}
                      alt={underdog.name || 'Team'}
                      fill
                      className='object-cover object-top'
                    />
                  </div>
                ) : (
                  <User className='h-8 w-8 text-muted-foreground flex-shrink-0' />
                )}
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2 mb-1'>
                    <p className='font-medium truncate'>{underdog.name}</p>
                    <Badge variant='outline' className='text-xs'>
                      Underdog
                    </Badge>
                  </div>
                  <div className='flex items-center gap-3 text-sm'>
                    <div>
                      <span className='text-muted-foreground'>Model: </span>
                      <span className='font-mono'>
                        {underdog.odds && underdog.odds > 0 ? '+' : ''}
                        {underdog.odds}
                      </span>
                    </div>
                    <div>
                      <span className='text-muted-foreground'>Book: </span>
                      <span className='font-mono'>
                        {underdog.bookOdds && underdog.bookOdds > 0 ? '+' : ''}
                        {underdog.bookOdds}
                      </span>
                    </div>
                  </div>
                  <p className='text-xs text-muted-foreground mt-1'>
                    {(underdog.probability * 100).toFixed(1)}% win probability
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Current Selection Note */}
          <div className='mt-4 p-3 bg-accent/30 rounded-lg'>
            <div className='flex items-center gap-2 text-sm'>
              <TrendingUp className='h-4 w-4 text-primary' />
              <span className='font-medium'>Current Selection:</span>
              <span className='text-primary font-medium'>
                {favoriteTeam.name} (Favorite)
              </span>
            </div>
            <p className='text-xs text-muted-foreground mt-1'>
              Parlays currently auto-select the favorite. Team selection
              customization coming soon.
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
