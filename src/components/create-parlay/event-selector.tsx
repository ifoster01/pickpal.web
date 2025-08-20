'use client';

import { useState, useMemo } from 'react';
import { Database } from '@/types/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Check, Search, User, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/utils/cn';
import { League } from '@/providers/LeagueProvider';
import { calculateProbabilityFromOdds } from '@/utils/odds';

type EventOdds = Database['public']['Tables']['event_moneyline_odds']['Row'];

interface EventSelectorProps {
  events: EventOdds[];
  selectedEventIds: string[];
  onAddEvent: (eventId: string) => void;
  onRemoveEvent: (eventId: string) => void;
  league: League;
}

export function EventSelector({
  events,
  selectedEventIds,
  onAddEvent,
  onRemoveEvent,
  league,
}: EventSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'favorites' | 'underdogs'>(
    'all'
  );

  // Helper function to check if an event has valid book odds
  const hasValidBookOdds = (event: EventOdds) => {
    return (
      event.book_odds1 !== null &&
      event.book_odds1 !== 0 &&
      event.book_odds2 !== null &&
      event.book_odds2 !== 0
    );
  };

  const filteredEvents = useMemo(() => {
    let filtered = events;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.team1_name?.toLowerCase().includes(term) ||
          event.team2_name?.toLowerCase().includes(term) ||
          event.event_name?.toLowerCase().includes(term) ||
          event.tournament?.toLowerCase().includes(term)
      );
    }

    // Favorite/Underdog filter
    if (filterBy !== 'all') {
      filtered = filtered.filter((event) => {
        if (!event.odds1 || !event.odds2) return false;
        const team1IsFavorite = event.odds1 < event.odds2;
        return filterBy === 'favorites' ? team1IsFavorite : !team1IsFavorite;
      });
    }

    return filtered;
  }, [events, searchTerm, filterBy]);

  const renderEventCard = (event: EventOdds) => {
    const isSelected = selectedEventIds.includes(event.id);
    const hasValidOdds = hasValidBookOdds(event);
    const team1Prob = calculateProbabilityFromOdds(event.odds1 || 0);
    const team2Prob = calculateProbabilityFromOdds(event.odds2 || 0);
    const team1BookProb = calculateProbabilityFromOdds(event.book_odds1 || 0);
    const team2BookProb = calculateProbabilityFromOdds(event.book_odds2 || 0);
    const favorite = team1Prob > team2Prob ? 'team1' : 'team2';

    return (
      <motion.div
        key={event.id}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={cn(
          'relative border rounded-lg p-4 transition-all duration-200',
          !hasValidOdds && 'opacity-60 cursor-not-allowed',
          hasValidOdds && 'cursor-pointer',
          isSelected && hasValidOdds
            ? 'border-primary bg-primary/5'
            : hasValidOdds
              ? 'border-border hover:border-primary/50 hover:bg-accent/50'
              : 'border-destructive/30 bg-destructive/5'
        )}
        onClick={() => {
          if (!hasValidOdds) return;

          if (isSelected) {
            onRemoveEvent(event.id);
          } else {
            onAddEvent(event.id);
          }
        }}
      >
        {isSelected && hasValidOdds && (
          <div className='z-10 absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center'>
            <Check className='h-4 w-4 text-primary-foreground' />
          </div>
        )}

        {!hasValidOdds && (
          <div className='z-10 absolute top-2 right-2 w-6 h-6 bg-destructive rounded-full flex items-center justify-center'>
            <AlertTriangle className='h-4 w-4 text-destructive-foreground' />
          </div>
        )}

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {/* Team 1 */}
          <div className='flex items-center space-x-3'>
            {event.team1_pic_url ? (
              <div className='relative w-10 h-10 rounded-full overflow-hidden bg-white'>
                <Image
                  src={event.team1_pic_url}
                  alt={event.team1_name || 'Team 1'}
                  fill
                  className='object-cover object-top'
                />
              </div>
            ) : (
              <User className='h-1/3 w-1/3 text-muted-foreground' />
            )}
            <div className='flex-1 min-w-0'>
              <p
                className={cn(
                  'font-medium truncate',
                  favorite === 'team1' && 'text-primary'
                )}
              >
                {league === 'ufc' || league === 'atp'
                  ? event.team1_name
                  : event.team1_name?.split(' ').at(-1)}
              </p>
              <div className='flex flex-col gap-1 text-sm'>
                <div className='flex items-center gap-2'>
                  <span
                    className={cn(
                      'font-mono',
                      favorite === 'team1'
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    )}
                  >
                    {event.odds1 && event.odds1 > 0 ? '+' : ''}
                    {event.odds1}
                  </span>
                  <span className='text-xs text-muted-foreground'>
                    (
                    {hasValidOdds && event.book_odds1
                      ? `${event.book_odds1 > 0 ? '+' : ''}${event.book_odds1} book`
                      : 'N/A book'}
                    )
                  </span>
                </div>
                <span className='text-xs text-muted-foreground'>
                  Model: {(team1Prob * 100).toFixed(1)}%
                  {hasValidOdds && event.book_odds1
                    ? ` | Book: ${(team1BookProb * 100).toFixed(1)}%`
                    : ' | Book: N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* VS */}
          <div className='flex items-center justify-center'>
            <div className='text-center'>
              <p className='text-sm font-semibold text-muted-foreground'>VS</p>
              <p className='text-xs text-muted-foreground'>
                {event.event_datetime &&
                  new Date(event.event_datetime).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Team 2 */}
          <div className='flex items-center justify-end space-x-3'>
            <div className='flex-1 min-w-0 text-right'>
              <p
                className={cn(
                  'font-medium truncate',
                  favorite === 'team2' && 'text-primary'
                )}
              >
                {league === 'ufc' || league === 'atp'
                  ? event.team2_name
                  : event.team2_name?.split(' ').at(-1)}
              </p>
              <div className='flex flex-col gap-1 text-sm'>
                <div className='flex items-center justify-end gap-2'>
                  <span className='text-xs text-muted-foreground'>
                    (
                    {hasValidOdds && event.book_odds2
                      ? `${event.book_odds2 > 0 ? '+' : ''}${event.book_odds2} book`
                      : 'N/A book'}
                    )
                  </span>
                  <span
                    className={cn(
                      'font-mono',
                      favorite === 'team2'
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    )}
                  >
                    {event.odds2 && event.odds2 > 0 ? '+' : ''}
                    {event.odds2}
                  </span>
                </div>
                <span className='text-xs text-muted-foreground text-right'>
                  Model: {(team2Prob * 100).toFixed(1)}%
                  {hasValidOdds && event.book_odds2
                    ? ` | Book: ${(team2BookProb * 100).toFixed(1)}%`
                    : ' | Book: N/A'}
                </span>
              </div>
            </div>
            {event.team2_pic_url ? (
              <div className='relative w-10 h-10 rounded-full overflow-hidden bg-white'>
                <Image
                  src={event.team2_pic_url}
                  alt={event.team2_name || 'Team 2'}
                  fill
                  className='object-cover object-top'
                />
              </div>
            ) : (
              <User className='h-1/3 w-1/3 text-muted-foreground' />
            )}
          </div>
        </div>

        {/* Event Info */}
        <div className='mt-3 pt-3 border-t space-y-2'>
          <div className='flex items-center justify-between'>
            <div className='text-sm text-muted-foreground'>
              {event.tournament && (
                <Badge variant='secondary' className='text-xs'>
                  {event.tournament}
                </Badge>
              )}
            </div>
            <div className='text-sm text-muted-foreground'>
              {event.event_datetime && (
                <span>
                  {new Date(event.event_datetime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              )}
            </div>
          </div>

          {!hasValidOdds && (
            <div className='flex items-center gap-2 text-destructive text-xs'>
              <AlertTriangle className='h-3 w-3' />
              <span>Book odds unavailable - cannot calculate profit</span>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className='space-y-4'>
      {/* Search and Filter Controls */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search events, teams, or tournaments...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-10'
          />
        </div>
        <div className='flex gap-2'>
          <Button
            variant={filterBy === 'all' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setFilterBy('all')}
          >
            All
          </Button>
          <Button
            variant={filterBy === 'favorites' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setFilterBy('favorites')}
          >
            Favorites
          </Button>
          <Button
            variant={filterBy === 'underdogs' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setFilterBy('underdogs')}
          >
            Underdogs
          </Button>
        </div>
      </div>

      {/* Events List */}
      <div className='space-y-3 max-h-96 overflow-y-auto'>
        {filteredEvents.length > 0 ? (
          filteredEvents.map(renderEventCard)
        ) : (
          <Card className='p-8 text-center'>
            <p className='text-muted-foreground'>
              {searchTerm || filterBy !== 'all'
                ? 'No events match your search criteria'
                : `No upcoming ${league} events available`}
            </p>
          </Card>
        )}
      </div>

      {/* Selection Summary */}
      {selectedEventIds.length > 0 && (
        <div className='space-y-2'>
          <div className='flex items-center justify-between p-3 bg-accent/50 rounded-lg'>
            <span className='text-sm font-medium'>
              {selectedEventIds.length} event
              {selectedEventIds.length === 1 ? '' : 's'} selected
            </span>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => selectedEventIds.forEach(onRemoveEvent)}
            >
              Clear All
            </Button>
          </div>

          {/* Warning for events without book odds */}
          {(() => {
            const selectedEvents = events.filter((event) =>
              selectedEventIds.includes(event.id)
            );
            const eventsWithoutBookOdds = selectedEvents.filter(
              (event) => !hasValidBookOdds(event)
            );

            if (eventsWithoutBookOdds.length > 0) {
              return (
                <div className='flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg'>
                  <AlertTriangle className='h-4 w-4 text-destructive mt-0.5 flex-shrink-0' />
                  <div className='text-sm'>
                    <p className='font-medium text-destructive mb-1'>
                      Profit calculation unavailable
                    </p>
                    <p className='text-destructive/80 text-xs'>
                      {eventsWithoutBookOdds.length} selected event
                      {eventsWithoutBookOdds.length === 1 ? '' : 's'} missing
                      book odds. Remove these events to enable accurate profit
                      calculations.
                    </p>
                  </div>
                </div>
              );
            }
            return null;
          })()}
        </div>
      )}
    </div>
  );
}
