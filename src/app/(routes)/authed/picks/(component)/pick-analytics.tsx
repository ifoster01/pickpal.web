'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from 'recharts';

type Team = {
  name: string | null;
  odds: number | null;
  bookOdds: number | null;
  probability: number;
  bookProbability: number;
  picUrl: string | null;
};

interface PickAnalyticsProps {
  team1: Team;
  team2: Team;
  discrepancy: 'low' | 'medium' | 'high';
}

export function PickAnalytics({
  team1,
  team2,
  discrepancy,
}: PickAnalyticsProps) {
  // Sample historical data - in a real app, this would come from your API
  // const historicalData = [
  //   { date: 'Jan', odds1: fighter1.odds || 0, odds2: fighter2.odds || 0 },
  //   {
  //     date: 'Feb',
  //     odds1: fighter1.odds ? fighter1.odds - 5 : 0,
  //     odds2: fighter2.odds ? fighter2.odds + 5 : 0,
  //   },
  //   {
  //     date: 'Mar',
  //     odds1: fighter1.odds ? fighter1.odds - 10 : 0,
  //     odds2: fighter2.odds ? fighter2.odds + 10 : 0,
  //   },
  //   {
  //     date: 'Apr',
  //     odds1: fighter1.bookOdds || 0,
  //     odds2: fighter2.bookOdds || 0,
  //   },
  // ];

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
        {/* <Card className="p-4">
          <h4 className="text-sm font-semibold mb-4">Odds Movement</h4>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="odds1"
                  stroke="hsl(var(--primary))"
                  name={fighter1.name || type === 'UFC' ? 'Fighter 1' : 'Team'}
                />
                <Line
                  type="monotone"
                  dataKey="odds2"
                  stroke="hsl(var(--muted-foreground))"
                  name={fighter2.name || type === 'UFC' ? 'Fighter 2' : 'Opponent'}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card> */}

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
