'use client';

import { Database } from '@/types/supabase';
import { useCallback, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CalendarIcon,
  ChevronDown,
  Heart,
  MinusIcon,
  User,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { PickAnalytics } from './pick-analytics';
import { calculateProbabilityFromOdds } from '@/utils/odds';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/providers/AuthProvider';
import { useLikesCount } from '@/hooks/api/use-likes-count';
import { League } from '@/providers/LeagueProvider';
import { useEventOdds } from '@/hooks/api/use-odds';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

type EventOdds = Database['public']['Tables']['event_moneyline_odds']['Row'];

type Team = {
  name: string;
  odds: number;
  bookOdds: number;
  probability: number;
  bookProbability: number;
  picUrl: string;
};

interface PickCardProps {
  event: EventOdds;
  isLiked?: boolean;
  onLike?: () => void;
  onUnlike?: () => void;
  league: League;
}

export function PickCard({
  event,
  isLiked,
  onLike,
  onUnlike,
  league,
}: PickCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useAuth();
  const { data: likesCount } = useLikesCount(event.id, league);

  const team1: Team = {
    name: event.team1 || '',
    odds: event.odds1 || 0,
    bookOdds: event.book_odds1 || 0,
    probability: calculateProbabilityFromOdds(event.odds1 || 0),
    bookProbability: calculateProbabilityFromOdds(event.book_odds1 || 0),
    picUrl: event.team1_pic_url || '',
  };

  const team2: Team = {
    name: event.team2 || '',
    odds: event.odds2 || 0,
    bookOdds: event.book_odds2 || 0,
    probability: calculateProbabilityFromOdds(event.odds2 || 0),
    bookProbability: calculateProbabilityFromOdds(event.book_odds2 || 0),
    picUrl: event.team2_pic_url || '',
  };

  const modelFavorite = team1.odds < team2.odds ? 'team1' : 'team2';

  const discrepancy = Math.abs(team1.probability - team1.bookProbability);
  const discrepancyLevel =
    discrepancy < 0.1 ? 'low' : discrepancy < 0.2 ? 'medium' : 'high';

  const handleSaveClick = () => {
    if (!user) return;
    if (isLiked) {
      onUnlike?.();
    } else {
      onLike?.();
    }
  };

  const { data: odds } = useEventOdds(event.id);

  const modelFavoriteBookOddsMovement = useMemo(() => {
    if (!odds?.length || odds.length < 2) return 0;
    const lastOdd = odds[odds.length - 1];
    const secondLastOdd = odds[odds.length - 2];

    // get the model favorite
    const modelFavoriteOdds =
      modelFavorite === 'team1' ? lastOdd.odds1 : lastOdd.odds2;
    const secondLastModelFavoriteOdds =
      modelFavorite === 'team1' ? secondLastOdd.odds1 : secondLastOdd.odds2;

    if (!modelFavoriteOdds || !secondLastModelFavoriteOdds) return 0;

    if (modelFavoriteOdds > 0 && secondLastModelFavoriteOdds < 0) {
      const moveAbove100 = modelFavoriteOdds - 100;
      const moveBelow100 = Math.abs(secondLastModelFavoriteOdds) - 100;
      return moveAbove100 + moveBelow100;
    } else if (modelFavoriteOdds < 0 && secondLastModelFavoriteOdds > 0) {
      const moveBelow100 = Math.abs(modelFavoriteOdds) - 100;
      const moveAbove100 = secondLastModelFavoriteOdds - 100;
      return moveBelow100 + moveAbove100;
    } else {
      return modelFavoriteOdds - secondLastModelFavoriteOdds;
    }
  }, [odds, modelFavorite]);

  const renderOddsChange = useCallback(() => {
    if (modelFavoriteBookOddsMovement === 0) return null;
    return (
      <div
        className={cn(
          'w-full flex items-center gap-2',
          modelFavorite === 'team2' ? 'justify-end' : 'justify-start'
        )}
      >
        <Badge className='flex items-center gap-2 w-fit bg-purple-100 text-purple-500'>
          <span className='text-sm'>Book</span>
          {modelFavoriteBookOddsMovement > 0 && (
            <ArrowUpIcon className='w-4 h-4' />
          )}
          {modelFavoriteBookOddsMovement < 0 && (
            <ArrowDownIcon className='w-4 h-4' />
          )}
          {modelFavoriteBookOddsMovement === 0 && (
            <MinusIcon className='w-4 h-4' />
          )}
          {modelFavoriteBookOddsMovement}
        </Badge>
      </div>
    );
  }, [modelFavoriteBookOddsMovement, modelFavorite]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className='overflow-hidden group relative'>
        <div className='absolute top-4 right-4 z-10 flex items-center gap-2'>
          {likesCount !== undefined && likesCount > 0 && (
            <span className='text-sm text-muted-foreground'>{likesCount}</span>
          )}
          {/* Save Button - Floating in top right */}
          <motion.button
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center',
              'transition-all duration-200 ease-in-out',
              'hover:scale-110 active:scale-95',
              isLiked ? 'bg-primary/10' : 'bg-background/80 backdrop-blur-sm',
              !user && 'opacity-50 cursor-not-allowed'
            )}
            onClick={handleSaveClick}
            disabled={!user}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Heart
              className={cn(
                'w-4 h-4 transition-all duration-200',
                isLiked
                  ? 'fill-primary stroke-primary'
                  : 'stroke-muted-foreground',
                'group-hover:stroke-primary'
              )}
            />
          </motion.button>
        </div>

        <div className='p-6 pt-10'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {/* Team 1 */}
            <div className='flex items-center space-x-4'>
              <Avatar
                className={cn(
                  league === 'ufc' ? 'w-[100px] h-[100px]' : 'w-[50px] h-[50px]'
                )}
              >
                <AvatarImage
                  src={team1.picUrl}
                  alt={team1.name || 'Team 1'}
                  className='object-cover object-top'
                />
                <AvatarFallback>
                  <User className='h-1/2 w-1/2 text-muted-foreground' />
                </AvatarFallback>
              </Avatar>
              <div className='flex flex-col items-start'>
                <h3
                  className={cn(
                    'font-semibold',
                    league === 'ufc' ? 'text-lg' : 'text-2xl'
                  )}
                >
                  {league === 'ufc' || league === 'atp'
                    ? team1.name
                    : team1.name?.split(' ').at(-1)}
                </h3>
                <div className='text-2xl font-bold text-primary flex items-center'>
                  {team1.odds && team1.odds > 0 ? '+' : ''}
                  {team1.odds}
                  <span className='text-sm text-muted-foreground ml-2'>
                    ({team1.bookOdds && team1.bookOdds > 0 ? '+' : ''}
                    {team1.bookOdds ? team1.bookOdds : 'N/A'} book)
                  </span>
                </div>
                {modelFavorite === 'team1' && renderOddsChange()}
              </div>
            </div>

            {/* VS and Predictions */}
            <div className='flex flex-col items-center justify-center'>
              <span className='text-lg font-semibold text-muted-foreground mb-2'>
                vs
              </span>
              {event.event_date && (
                <Badge
                  variant='outline'
                  className='flex items-center gap-2 text-sm text-muted-foreground mb-4 py-1 px-2'
                >
                  <CalendarIcon className='w-4 h-4' />
                  <span>
                    {new Date(event.event_date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
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

            {/* Team 2 */}
            <div className='flex items-center justify-end space-x-4'>
              <div className='text-right flex flex-col items-end'>
                <h3
                  className={cn(
                    'font-semibold',
                    league === 'ufc' ? 'text-lg' : 'text-2xl'
                  )}
                >
                  {league === 'ufc' || league === 'atp'
                    ? team2.name
                    : team2.name?.split(' ').at(-1)}
                </h3>
                <div className='text-2xl font-bold text-primary flex items-center'>
                  <span className='text-sm text-muted-foreground mr-2'>
                    ({team2.bookOdds && team2.bookOdds > 0 ? '+' : ''}
                    {team2.bookOdds ? team2.bookOdds : 'N/A'} book)
                  </span>
                  {team2.odds && team2.odds > 0 ? '+' : ''}
                  {team2.odds}
                </div>
                {modelFavorite === 'team2' && renderOddsChange()}
              </div>
              <Avatar
                className={cn(
                  league === 'ufc' ? 'w-[100px] h-[100px]' : 'w-[50px] h-[50px]'
                )}
              >
                <AvatarImage
                  src={team2.picUrl}
                  alt={team2.name || 'Team 2'}
                  className='object-cover object-top'
                />
                <AvatarFallback>
                  <User className='h-1/2 w-1/2 text-muted-foreground' />
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className='mt-4 flex items-center justify-center'>
            <Button
              variant='ghost'
              size='sm'
              className='w-full max-w-xs'
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <span className='text-sm text-muted-foreground'>
                {isExpanded ? 'Hide' : 'View'} Analysis
              </span>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className='flex items-center gap-2'
              >
                <ChevronDown className='h-4 w-4' />
              </motion.div>
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className='overflow-hidden'
            >
              <div className='px-6 pb-6'>
                {odds ? (
                  <PickAnalytics
                    odds={odds}
                    team1={team1}
                    team2={team2}
                    discrepancy={discrepancyLevel}
                    modelFavoriteBookOddsMovement={
                      modelFavoriteBookOddsMovement
                    }
                  />
                ) : (
                  <Skeleton className='w-full h-[20px] rounded-md' />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
