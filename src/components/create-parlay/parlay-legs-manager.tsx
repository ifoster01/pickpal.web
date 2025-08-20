'use client';

import { Database } from '@/types/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, GripVertical, User } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { League } from '@/providers/LeagueProvider';
import { calculateProbabilityFromOdds } from '@/utils/odds';

type EventOdds = Database['public']['Tables']['event_moneyline_odds']['Row'];

interface ParlayLegsManagerProps {
  events: EventOdds[];
  onRemoveEvent: (eventId: string) => void;
  league: League;
}

export function ParlayLegsManager({
  events,
  onRemoveEvent,
  league,
}: ParlayLegsManagerProps) {
  const renderLegCard = (event: EventOdds, index: number) => {
    const team1Prob = calculateProbabilityFromOdds(event.odds1 || 0);
    const team2Prob = calculateProbabilityFromOdds(event.odds2 || 0);
    const favorite = team1Prob > team2Prob ? 'team1' : 'team2';
    const favoriteTeam =
      favorite === 'team1' ? event.team1_name : event.team2_name;
    const favoriteOdds = favorite === 'team1' ? event.odds1 : event.odds2;
    const favoriteProb = favorite === 'team1' ? team1Prob : team2Prob;
    const favoritePicUrl =
      favorite === 'team1' ? event.team1_pic_url : event.team2_pic_url;

    return (
      <motion.div
        key={event.id}
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
      >
        <Card className='p-3 sm:p-4 group hover:bg-accent/50 transition-colors'>
          <div className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4'>
            {/* Top Row - Drag Handle, Leg Number, and Event Info */}
            <div className='flex items-center gap-3 sm:gap-4 flex-1 min-w-0'>
              {/* Drag Handle */}
              <div className='flex-shrink-0 opacity-40 group-hover:opacity-100 transition-opacity'>
                <GripVertical className='h-4 w-4 text-muted-foreground' />
              </div>

              {/* Leg Number */}
              <div className='flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center'>
                <span className='text-sm font-semibold text-primary'>
                  {index + 1}
                </span>
              </div>

              {/* Event Info */}
              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-2 sm:gap-3 mb-2'>
                  {favoritePicUrl ? (
                    <div className='relative w-8 h-8 rounded-full overflow-hidden bg-white flex-shrink-0'>
                      <Image
                        src={favoritePicUrl}
                        alt={favoriteTeam || 'Team'}
                        fill
                        className='object-cover object-top'
                      />
                    </div>
                  ) : (
                    <User className='h-8 w-8 text-muted-foreground flex-shrink-0' />
                  )}
                  <div className='flex-1 min-w-0'>
                    <p className='font-medium text-primary truncate text-sm sm:text-base'>
                      {league === 'ufc' || league === 'atp'
                        ? favoriteTeam
                        : favoriteTeam?.split(' ').at(-1)}
                    </p>
                    <p className='text-xs sm:text-sm text-muted-foreground truncate'>
                      {event.event_name}
                    </p>
                  </div>
                </div>

                {/* Odds and Probability - Stack on mobile, row on desktop */}
                <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm'>
                  <div className='flex items-center gap-2'>
                    <span className='text-muted-foreground'>Odds:</span>
                    <span className='font-mono font-medium'>
                      {favoriteOdds && favoriteOdds > 0 ? '+' : ''}
                      {favoriteOdds}
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className='text-muted-foreground'>Probability:</span>
                    <span className='font-medium'>
                      {(favoriteProb * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row - Event Meta and Remove Button */}
            <div className='flex items-center justify-between sm:justify-end gap-3 sm:gap-2'>
              {/* Event Meta */}
              <div className='flex flex-col items-start sm:items-end gap-1 sm:gap-2'>
                {event.tournament && (
                  <Badge variant='secondary' className='text-xs'>
                    {event.tournament}
                  </Badge>
                )}
                <p className='text-xs text-muted-foreground'>
                  {event.event_datetime &&
                    new Date(event.event_datetime).toLocaleDateString()}
                </p>
              </div>

              {/* Remove Button */}
              <Button
                variant='ghost'
                size='sm'
                onClick={() => onRemoveEvent(event.id)}
                className='flex-shrink-0 text-muted-foreground hover:text-destructive h-8 w-8 p-0'
              >
                <X className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  if (events.length === 0) {
    return (
      <Card className='p-6 sm:p-8 text-center'>
        <p className='text-sm sm:text-base text-muted-foreground'>
          No events selected. Choose events from the selector above to build
          your parlay.
        </p>
      </Card>
    );
  }

  return (
    <div className='space-y-3'>
      {events.map((event, index) => renderLegCard(event, index))}

      {/* Legs Summary - Responsive */}
      <div className='mt-4 p-3 sm:p-4 bg-accent/30 rounded-lg'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 text-sm'>
          <span className='font-medium'>
            {events.length} leg{events.length === 1 ? '' : 's'} in parlay
          </span>
          <span className='text-muted-foreground'>Minimum 2 legs required</span>
        </div>
      </div>
    </div>
  );
}
