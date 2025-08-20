'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  Target,
  DollarSign,
  Calculator,
  Brain,
  BookOpen,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ParlayStats {
  totalModelOdds: number;
  totalBookOdds: number;
  totalModelProbability: number;
  totalBookProbability: number;
  legCount: number;
  hasValidBookOdds: boolean;
}

interface ParlayCalculationsCardProps {
  parlayStats: ParlayStats | null;
}

export function ParlayCalculationsCard({
  parlayStats,
}: ParlayCalculationsCardProps) {
  // Calculate potential payouts for different bet amounts
  const calculatePayout = (odds: number, bet: number) => {
    if (odds > 0) {
      return bet + (bet * odds) / 100;
    } else {
      return bet + (bet * 100) / Math.abs(odds);
    }
  };

  const betAmounts = [10, 25, 50, 100, 250];

  return (
    <Card className='p-6 sticky top-6'>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center gap-2'>
          <Calculator className='h-5 w-5 text-primary' />
          <h3 className='text-lg font-semibold'>Parlay Calculations</h3>
        </div>

        {parlayStats ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='space-y-6'
          >
            {/* Key Metrics */}
            <div className='space-y-4'>
              {/* Legs */}
              <div className='flex items-center justify-between p-3 bg-accent/30 rounded-lg'>
                <div className='flex items-center gap-2'>
                  <Target className='h-4 w-4 text-primary' />
                  <span className='font-medium'>Legs</span>
                </div>
                <Badge variant='secondary'>{parlayStats.legCount}</Badge>
              </div>

              {/* Model Odds */}
              <div className='flex items-center justify-between p-3 bg-accent/30 rounded-lg'>
                <div className='flex items-center gap-2'>
                  <Brain className='h-4 w-4 text-primary' />
                  <span className='font-medium'>Model Odds</span>
                </div>
                <span className='font-mono font-semibold text-lg'>
                  {parlayStats.totalModelOdds > 0 ? '+' : ''}
                  {parlayStats.totalModelOdds}
                </span>
              </div>

              {/* Book Odds */}
              <div className='flex items-center justify-between p-3 bg-accent/30 rounded-lg'>
                <div className='flex items-center gap-2'>
                  <BookOpen className='h-4 w-4 text-primary' />
                  <span className='font-medium'>Book Odds</span>
                </div>
                <span className='font-mono font-semibold text-lg'>
                  {parlayStats.hasValidBookOdds ? (
                    <>
                      {parlayStats.totalBookOdds > 0 ? '+' : ''}
                      {parlayStats.totalBookOdds}
                    </>
                  ) : (
                    <span className='text-muted-foreground'>N/A</span>
                  )}
                </span>
              </div>

              {/* Model Probability */}
              <div className='p-3 bg-accent/30 rounded-lg'>
                <div className='flex items-center justify-between mb-2'>
                  <div className='flex items-center gap-2'>
                    <Brain className='h-4 w-4 text-primary' />
                    <span className='font-medium'>Model Probability</span>
                  </div>
                  <span className='font-semibold text-lg'>
                    {(parlayStats.totalModelProbability * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={parlayStats.totalModelProbability * 100}
                  className='h-2'
                />
              </div>

              {/* Book Probability */}
              <div className='p-3 bg-accent/30 rounded-lg'>
                <div className='flex items-center justify-between mb-2'>
                  <div className='flex items-center gap-2'>
                    <BookOpen className='h-4 w-4 text-primary' />
                    <span className='font-medium'>Book Probability</span>
                  </div>
                  <span className='font-semibold text-lg'>
                    {parlayStats.hasValidBookOdds ? (
                      `${(parlayStats.totalBookProbability * 100).toFixed(1)}%`
                    ) : (
                      <span className='text-muted-foreground'>N/A</span>
                    )}
                  </span>
                </div>
                {parlayStats.hasValidBookOdds && (
                  <Progress
                    value={parlayStats.totalBookProbability * 100}
                    className='h-2'
                  />
                )}
              </div>
            </div>

            {/* Payout Calculator */}
            <div className='border-t pt-6'>
              <h4 className='font-medium mb-4 flex items-center gap-2'>
                <DollarSign className='h-4 w-4' />
                Payout Calculator
              </h4>

              <div className='space-y-6'>
                {/* Model Payout */}
                <div className='space-y-3'>
                  <div className='flex items-center gap-2 mb-2'>
                    <Brain className='h-4 w-4 text-primary' />
                    <span className='font-medium text-primary'>
                      Model Payout
                    </span>
                  </div>
                  {betAmounts.map((amount) => {
                    const payout = calculatePayout(
                      parlayStats.totalModelOdds,
                      amount
                    );
                    const profit = payout - amount;

                    return (
                      <div
                        key={`model-${amount}`}
                        className='flex items-center justify-between text-sm'
                      >
                        <span className='text-muted-foreground'>
                          ${amount.toFixed(0)} bet:
                        </span>
                        <div className='text-right'>
                          <div className='font-mono font-semibold text-green-600'>
                            ${payout.toFixed(2)}
                          </div>
                          <div className='text-xs text-muted-foreground'>
                            +${profit.toFixed(2)} profit
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Book Payout */}
                {parlayStats.hasValidBookOdds && (
                  <div className='space-y-3'>
                    <div className='flex items-center gap-2 mb-2'>
                      <BookOpen className='h-4 w-4 text-primary' />
                      <span className='font-medium text-primary'>
                        Book Payout
                      </span>
                    </div>
                    {betAmounts.map((amount) => {
                      const payout = calculatePayout(
                        parlayStats.totalBookOdds,
                        amount
                      );
                      const profit = payout - amount;

                      return (
                        <div
                          key={`book-${amount}`}
                          className='flex items-center justify-between text-sm'
                        >
                          <span className='text-muted-foreground'>
                            ${amount.toFixed(0)} bet:
                          </span>
                          <div className='text-right'>
                            <div className='font-mono font-semibold text-green-600'>
                              ${payout.toFixed(2)}
                            </div>
                            <div className='text-xs text-muted-foreground'>
                              +${profit.toFixed(2)} profit
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Risk Assessment */}
            <div className='border-t pt-6'>
              <div className='space-y-6'>
                {/* Model Risk */}
                <div className='space-y-3'>
                  <div className='flex items-center gap-2'>
                    <Brain className='h-4 w-4 text-primary' />
                    <span className='text-sm font-medium'>
                      Model Assessment
                    </span>
                  </div>

                  {/* Model Risk Level */}
                  <div className='flex items-center gap-2'>
                    {parlayStats.totalModelProbability > 0.5 ? (
                      <>
                        <div className='w-3 h-3 bg-green-500 rounded-full' />
                        <span className='text-sm text-green-600 font-medium'>
                          Low Risk
                        </span>
                      </>
                    ) : parlayStats.totalModelProbability > 0.25 ? (
                      <>
                        <div className='w-3 h-3 bg-yellow-500 rounded-full' />
                        <span className='text-sm text-yellow-600 font-medium'>
                          Medium Risk
                        </span>
                      </>
                    ) : parlayStats.totalModelProbability > 0.1 ? (
                      <>
                        <div className='w-3 h-3 bg-orange-500 rounded-full' />
                        <span className='text-sm text-orange-600 font-medium'>
                          High Risk
                        </span>
                      </>
                    ) : (
                      <>
                        <div className='w-3 h-3 bg-red-500 rounded-full' />
                        <span className='text-sm text-red-600 font-medium'>
                          Very High Risk
                        </span>
                      </>
                    )}
                  </div>

                  {/* Model Risk Details */}
                  <div className='text-xs text-muted-foreground space-y-1'>
                    <p>
                      • {parlayStats.legCount} legs with{' '}
                      {(parlayStats.totalModelProbability * 100).toFixed(1)}%
                      model probability
                    </p>
                    <p>
                      • Expected to win ~
                      {Math.round(parlayStats.totalModelProbability * 100)} out
                      of 100 times
                    </p>
                  </div>
                </div>

                {/* Value Analysis */}
                {parlayStats.hasValidBookOdds && (
                  <div className='space-y-3'>
                    <div className='flex items-center gap-2'>
                      <TrendingUp className='h-4 w-4 text-primary' />
                      <span className='text-sm font-medium'>
                        Value Analysis
                      </span>
                    </div>

                    {/* Calculate value metrics */}
                    {(() => {
                      const modelPayout = calculatePayout(
                        parlayStats.totalModelOdds,
                        100
                      );
                      const bookPayout = calculatePayout(
                        parlayStats.totalBookOdds,
                        100
                      );
                      const valueEdge = bookPayout - modelPayout; // Book payout - Model payout (positive when book is better)
                      const valuePercentage = (valueEdge / modelPayout) * 100;
                      const probabilityAdvantage =
                        (parlayStats.totalModelProbability -
                          parlayStats.totalBookProbability) *
                        100;

                      return (
                        <>
                          {/* Value Risk Level */}
                          <div className='flex items-center gap-2'>
                            {valuePercentage >= 20 ? (
                              <>
                                <div className='w-3 h-3 bg-green-500 rounded-full' />
                                <span className='text-sm text-green-600 font-medium'>
                                  High Value Opportunity
                                </span>
                              </>
                            ) : valuePercentage >= 10 ? (
                              <>
                                <div className='w-3 h-3 bg-yellow-500 rounded-full' />
                                <span className='text-sm text-yellow-600 font-medium'>
                                  Good Value
                                </span>
                              </>
                            ) : valuePercentage >= 5 ? (
                              <>
                                <div className='w-3 h-3 bg-blue-500 rounded-full' />
                                <span className='text-sm text-blue-600 font-medium'>
                                  Slight Advantage
                                </span>
                              </>
                            ) : valuePercentage >= -5 ? (
                              <>
                                <div className='w-3 h-3 bg-gray-500 rounded-full' />
                                <span className='text-sm text-gray-600 font-medium'>
                                  Fair Value
                                </span>
                              </>
                            ) : (
                              <>
                                <div className='w-3 h-3 bg-red-500 rounded-full' />
                                <span className='text-sm text-red-600 font-medium'>
                                  Model Advantage
                                </span>
                              </>
                            )}
                          </div>

                          {/* Value Details */}
                          <div className='text-xs text-muted-foreground space-y-1'>
                            <p>
                              • Value edge: {valueEdge > 0 ? '+' : ''}$
                              {valueEdge.toFixed(2)} (
                              {valuePercentage > 0 ? '+' : ''}
                              {valuePercentage.toFixed(1)}%)
                            </p>
                            <p>
                              • Probability advantage:{' '}
                              {probabilityAdvantage > 0 ? '+' : ''}
                              {probabilityAdvantage.toFixed(1)}%
                            </p>
                            <p>
                              •{' '}
                              {valuePercentage >= 20
                                ? 'Excellent value opportunity! Book odds provide significantly better payouts than model predictions.'
                                : valuePercentage >= 10
                                  ? 'Good value found. Book odds provide notably better payouts than model odds.'
                                  : valuePercentage >= 5
                                    ? 'Slight advantage detected. Book odds provide marginally better payouts.'
                                    : valuePercentage >= -5
                                      ? 'Fair value. Book and model odds are relatively aligned.'
                                      : 'Model advantage. Book odds are lower than model predictions.'}
                            </p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* General Recommendation */}
                <div className='p-3 bg-muted/30 rounded-lg'>
                  <p className='text-xs text-muted-foreground'>
                    💡 <strong>Tip:</strong>{' '}
                    {parlayStats.totalModelProbability > 0.3
                      ? 'This parlay has a decent chance of hitting. Consider a reasonable stake.'
                      : parlayStats.totalModelProbability > 0.1
                        ? 'This is a long-shot parlay. Only bet what you can afford to lose.'
                        : 'This is a very risky parlay. Consider removing some legs or betting very small amounts.'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* No calculations available */
          <div className='space-y-4'>
            <div className='p-8 text-center border-2 border-dashed border-muted rounded-lg'>
              <Calculator className='h-8 w-8 text-muted-foreground mx-auto mb-2' />
              <p className='text-muted-foreground text-sm'>
                Add at least 2 events to see calculations
              </p>
            </div>

            <div className='space-y-3 opacity-50'>
              <div className='flex items-center justify-between p-3 bg-accent/20 rounded-lg'>
                <span className='text-sm'>Legs</span>
                <Badge variant='outline'>0</Badge>
              </div>
              <div className='flex items-center justify-between p-3 bg-accent/20 rounded-lg'>
                <span className='text-sm'>Total Odds</span>
                <span className='font-mono'>--</span>
              </div>
              <div className='flex items-center justify-between p-3 bg-accent/20 rounded-lg'>
                <span className='text-sm'>Win Probability</span>
                <span>--%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
