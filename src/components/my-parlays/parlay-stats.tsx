'use client';

import { useMemo } from 'react';
import { Database } from '@/types/supabase';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Calendar, BarChart3 } from 'lucide-react';

type UserParlay = Database['public']['Tables']['user_parlays']['Row'];

interface UserParlayWithLegCount extends UserParlay {
  parlay_leg: Array<{ count: number }>;
}

interface ParlayStatsProps {
  parlays: UserParlayWithLegCount[];
}

export function ParlayStats({ parlays }: ParlayStatsProps) {
  const stats = useMemo(() => {
    const totalParlays = parlays.length;
    const totalLegs = parlays.reduce(
      (sum, parlay) => sum + (parlay.parlay_leg?.[0]?.count || 0),
      0
    );
    const completeParlays = parlays.filter(
      (parlay) => (parlay.parlay_leg?.[0]?.count || 0) >= 2
    ).length;
    const averageLegs =
      totalParlays > 0 ? (totalLegs / totalParlays).toFixed(1) : '0';

    // Most recent parlay
    const mostRecent = parlays.reduce(
      (latest, current) =>
        new Date(current.created_at) > new Date(latest.created_at)
          ? current
          : latest,
      parlays[0]
    );

    return {
      totalParlays,
      totalLegs,
      completeParlays,
      averageLegs,
      mostRecent: mostRecent
        ? new Date(mostRecent.created_at).toLocaleDateString()
        : 'N/A',
    };
  }, [parlays]);

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
      {/* Total Parlays */}
      <Card className='p-6'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center'>
            <BarChart3 className='h-5 w-5 text-primary' />
          </div>
          <div>
            <p className='text-2xl font-bold'>{stats.totalParlays}</p>
            <p className='text-sm text-muted-foreground'>Total Parlays</p>
          </div>
        </div>
      </Card>

      {/* Complete Parlays */}
      <Card className='p-6'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center'>
            <Target className='h-5 w-5 text-green-600' />
          </div>
          <div>
            <div className='flex items-center gap-2'>
              <p className='text-2xl font-bold'>{stats.completeParlays}</p>
              <Badge variant='secondary' className='text-xs'>
                {stats.totalParlays > 0
                  ? Math.round(
                      (stats.completeParlays / stats.totalParlays) * 100
                    )
                  : 0}
                %
              </Badge>
            </div>
            <p className='text-sm text-muted-foreground'>Complete Parlays</p>
          </div>
        </div>
      </Card>

      {/* Average Legs */}
      <Card className='p-6'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center'>
            <TrendingUp className='h-5 w-5 text-blue-600' />
          </div>
          <div>
            <p className='text-2xl font-bold'>{stats.averageLegs}</p>
            <p className='text-sm text-muted-foreground'>
              Avg. Legs per Parlay
            </p>
          </div>
        </div>
      </Card>

      {/* Most Recent */}
      <Card className='p-6'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center'>
            <Calendar className='h-5 w-5 text-orange-600' />
          </div>
          <div>
            <p className='text-sm font-bold'>{stats.mostRecent}</p>
            <p className='text-sm text-muted-foreground'>Most Recent</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
