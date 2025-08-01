'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Database } from '@/types/supabase';
import { useMemo } from 'react';

type EventOdds =
  Database['public']['Tables']['moneyline_book_odds_data']['Row'];

type Team = {
  name: string | null;
  odds: number | null;
  bookOdds: number | null;
  probability: number;
  bookProbability: number;
  picUrl: string | null;
};

interface PickAnalyticsProps {
  odds: EventOdds[];
  team1: Team;
  team2: Team;
  discrepancy: 'low' | 'medium' | 'high';
}

export function PickAnalytics({
  odds,
  team1,
  team2,
  discrepancy,
}: PickAnalyticsProps) {
  const historicalData = useMemo(() => {
    return odds?.map((odd) => ({
      date: new Date(odd.created_at).toLocaleDateString(),
      odds1: odd.odds1,
      odds2: odd.odds2,
    }));
  }, [odds]);

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
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
