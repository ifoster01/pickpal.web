'use client';

import { Database } from '@/types/supabase';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';
import { PickAnalytics } from './pick-analytics';
import { TeamImages } from './team-images';
import { ResultsIndicator } from './results-indicator';
import { SaveButton } from './save-button';
import { OddsComparison } from './odds-comparison';
import { PredictionsSection } from './predictions-section';
import { calculateProbabilityFromOdds } from '@/utils/odds';
import { useAuth } from '@/providers/AuthProvider';
import { useLikesCount } from '@/hooks/api/use-likes-count';
import { League } from '@/providers/LeagueProvider';
import { useEventOdds } from '@/hooks/api/use-odds';
import { Skeleton } from '@/components/ui/skeleton';
import { usePick } from '@/hooks/api/use-pick';

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
  const { data: pick } = usePick(event, league);

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

  const isModelPredictionCorrect =
    event.result !== null &&
    ((modelFavorite === 'team1' && event.result) ||
      (modelFavorite === 'team2' && !event.result));

  const discrepancy = Math.abs(team1.probability - team1.bookProbability);
  const discrepancyLevel =
    discrepancy < 0.1 ? 'low' : discrepancy < 0.2 ? 'medium' : 'high';

  const { data: odds } = useEventOdds(event.id);

  if (event.odds1 === null || event.odds2 === null) return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className='overflow-hidden group relative'>
        <div className='absolute top-4 right-4 z-10 flex items-center gap-2'>
          <ResultsIndicator
            event={event}
            isModelPredictionCorrect={isModelPredictionCorrect}
          />
          <SaveButton
            isLiked={isLiked}
            onLike={onLike}
            onUnlike={onUnlike}
            user={user}
            likesCount={likesCount}
          />
        </div>

        <div className='p-6 pt-10'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {/* Team 1 */}
            <div className='flex items-center space-x-4'>
              <TeamImages
                event={event}
                isModelPredictionCorrect={isModelPredictionCorrect}
                team={team1}
                pick={pick === 'team1'}
              />
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
                <OddsComparison
                  modelOdds={team1.odds}
                  bookOdds={team1.bookOdds}
                  odds={odds}
                  modelFavorite={modelFavorite}
                  teamType='team1'
                  showMovement={true}
                />
              </div>
            </div>

            {/* VS and Predictions */}
            <PredictionsSection event={event} team1={team1} team2={team2} />

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
                <div className='flex flex-col items-end'>
                  <OddsComparison
                    modelOdds={team2.odds}
                    bookOdds={team2.bookOdds}
                    odds={odds}
                    modelFavorite={modelFavorite}
                    teamType='team2'
                    showMovement={true}
                  />
                </div>
              </div>
              <TeamImages
                event={event}
                isModelPredictionCorrect={isModelPredictionCorrect}
                team={team2}
                pick={pick === 'team2'}
              />
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
