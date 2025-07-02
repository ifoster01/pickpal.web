'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { useEventOdds } from '@/hooks/api/use-odds';
import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  MinusIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';

type Team = {
  name: string | null;
  odds: number | null;
  bookOdds: number | null;
  probability: number;
  bookProbability: number;
  picUrl: string | null;
};

interface PickAnalyticsProps {
  eventId: string;
  team1: Team;
  team2: Team;
  discrepancy: 'low' | 'medium' | 'high';
  modelFavorite: 'team1' | 'team2';
}

export function PickAnalytics({
  eventId,
  team1,
  team2,
  discrepancy,
  modelFavorite,
}: PickAnalyticsProps) {
  const { data: odds } = useEventOdds(eventId);
  const historicalData = useMemo(() => {
    return odds?.map((odd) => ({
      date: new Date(odd.created_at).toLocaleDateString(),
      odds1: odd.odds1,
      odds2: odd.odds2,
    }));
  }, [odds]);

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

  const modelConfidence = Math.max(team1.probability, team2.probability) * 100;
  const edgeVsMarket = Math.abs(
    (team1.probability - team1.bookProbability) * 100
  ).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className='space-y-6'
    >
      <div className='grid grid-cols-1 gap-6'>
        {odds?.length && odds.length > 0 && (
          <Card className='p-4'>
            <h4 className='text-sm font-semibold mb-4'>Book Odds Movement</h4>
            <div className='h-[200px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='date' />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type='monotone'
                    dataKey='odds1'
                    stroke='hsl(var(--primary))'
                    name={team1.name || 'Team'}
                  />
                  <Line
                    type='monotone'
                    dataKey='odds2'
                    stroke='hsl(var(--primary))'
                    name={team2.name || 'Opponent'}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        <Card className='p-4'>
          <h4 className='text-sm font-semibold mb-4'>Key Statistics</h4>
          <div className='flex flex-col gap-4 sm:flex-row'>
            <div>
              <p className='text-sm text-muted-foreground'>Model Confidence</p>
              <p className='text-lg font-semibold'>
                {modelConfidence.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Edge vs Book</p>
              <p className='text-lg font-semibold text-green-500'>
                +{edgeVsMarket}%
              </p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Model Advantage</p>
              <p className='text-lg font-semibold capitalize'>{discrepancy}</p>
            </div>
            {odds?.length && odds.length > 1 && (
              <div>
                <p className='text-sm text-muted-foreground'>
                  Model Favorite Book Odds Movement
                </p>
                <div className='text-lg font-semibold capitalize'>
                  <Badge
                    className={cn(
                      'flex items-center gap-2 w-fit',
                      modelFavoriteBookOddsMovement > 0
                        ? 'bg-green-100 text-green-500'
                        : modelFavoriteBookOddsMovement < 0
                          ? 'bg-red-100 text-red-500'
                          : 'bg-gray-100 text-gray-500'
                    )}
                  >
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
              </div>
            )}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
