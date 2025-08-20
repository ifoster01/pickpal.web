'use client';

import { Database } from '@/types/supabase';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Brain, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { League } from '@/providers/LeagueProvider';

type EventOdds = Database['public']['Tables']['event_moneyline_odds']['Row'];

interface ParlayCalculations {
  totalModelOdds: number;
  totalBookOdds: number;
  totalModelProbability: number;
  totalBookProbability: number;
  legCount: number;
  hasValidBookOdds: boolean;
}

interface ParlaySummaryProps {
  parlayCalculations: ParlayCalculations | null;
  selectedEvents: EventOdds[];
  parlayName: string;
  league: League;
}

export function ParlaySummary({
  parlayCalculations,
  selectedEvents,
  parlayName,
  league,
}: ParlaySummaryProps) {
  // Calculate potential payout for $100 bet
  const calculatePayout = (odds: number, bet: number = 100) => {
    if (odds > 0) {
      return bet + (bet * odds) / 100;
    } else {
      return bet + (bet * 100) / Math.abs(odds);
    }
  };

  console.log(parlayCalculations);

  const potentialModelPayout = parlayCalculations
    ? calculatePayout(parlayCalculations.totalModelOdds)
    : 0;

  const potentialBookPayout =
    parlayCalculations && parlayCalculations.hasValidBookOdds
      ? calculatePayout(parlayCalculations.totalBookOdds)
      : 0;

  const modelProfit = potentialModelPayout - 100;
  const bookProfit = potentialBookPayout - 100;

  return (
    <Card className='p-6'>
      <div className='space-y-6'>
        {/* Header */}
        <div>
          <h2 className='text-xl font-semibold mb-2'>Parlay Summary</h2>
          <p className='text-sm text-muted-foreground'>
            {parlayName ||
              `${league.toUpperCase()} Parlay - ${new Date().toLocaleDateString()}`}
          </p>
        </div>

        {/* Stats */}
        {parlayCalculations ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='space-y-4'
          >
            {/* Leg Count */}
            <div className='flex items-center justify-between p-3 bg-accent/30 rounded-lg'>
              <div className='flex items-center gap-2'>
                <Target className='h-4 w-4 text-primary' />
                <span className='font-medium'>Legs</span>
              </div>
              <Badge variant='secondary'>{parlayCalculations.legCount}</Badge>
            </div>

            {/* Model Odds */}
            <div className='flex items-center justify-between p-3 bg-accent/30 rounded-lg'>
              <div className='flex items-center gap-2'>
                <Brain className='h-4 w-4 text-primary' />
                <span className='font-medium'>Model Odds</span>
              </div>
              <span className='font-mono font-semibold text-lg'>
                {parlayCalculations.totalModelOdds > 0 ? '+' : ''}
                {parlayCalculations.totalModelOdds}
              </span>
            </div>

            {/* Book Odds */}
            <div className='flex items-center justify-between p-3 bg-accent/30 rounded-lg'>
              <div className='flex items-center gap-2'>
                <BookOpen className='h-4 w-4 text-primary' />
                <span className='font-medium'>Book Odds</span>
              </div>
              <span className='font-mono font-semibold text-lg'>
                {parlayCalculations.hasValidBookOdds ? (
                  <>
                    {parlayCalculations.totalBookOdds > 0 ? '+' : ''}
                    {parlayCalculations.totalBookOdds}
                  </>
                ) : (
                  <span className='text-muted-foreground'>N/A</span>
                )}
              </span>
            </div>

            {/* Model Probability */}
            <div className='flex items-center justify-between p-3 bg-accent/30 rounded-lg'>
              <div className='flex items-center gap-2'>
                <Brain className='h-4 w-4 text-primary' />
                <span className='font-medium'>Model Probability</span>
              </div>
              <span className='font-semibold text-lg'>
                {(parlayCalculations.totalModelProbability * 100).toFixed(1)}%
              </span>
            </div>

            {/* Book Probability */}
            <div className='flex items-center justify-between p-3 bg-accent/30 rounded-lg'>
              <div className='flex items-center gap-2'>
                <BookOpen className='h-4 w-4 text-primary' />
                <span className='font-medium'>Book Probability</span>
              </div>
              <span className='font-semibold text-lg'>
                {parlayCalculations.hasValidBookOdds ? (
                  `${(parlayCalculations.totalBookProbability * 100).toFixed(1)}%`
                ) : (
                  <span className='text-muted-foreground'>N/A</span>
                )}
              </span>
            </div>

            {/* Payout Calculation */}
            <div className='border-t pt-4 space-y-3'>
              <h3 className='font-medium text-center'>Payout Calculator</h3>

              <div className='space-y-4'>
                {/* Model Payout */}
                <div className='space-y-2 text-sm'>
                  <div className='flex items-center gap-2 mb-2'>
                    <Brain className='h-4 w-4 text-primary' />
                    <span className='font-medium text-primary'>
                      Model Payout
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Bet Amount:</span>
                    <span className='font-mono'>$100.00</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>
                      Potential Payout:
                    </span>
                    <span className='font-mono font-semibold text-green-600'>
                      ${potentialModelPayout.toFixed(2)}
                    </span>
                  </div>
                  <div className='flex justify-between border-t pt-2'>
                    <span className='font-medium'>Profit:</span>
                    <span
                      className={cn(
                        'font-mono font-semibold',
                        modelProfit > 0 ? 'text-green-600' : 'text-red-500'
                      )}
                    >
                      ${modelProfit.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Book Payout */}
                {parlayCalculations.hasValidBookOdds && (
                  <div className='space-y-2 text-sm'>
                    <div className='flex items-center gap-2 mb-2'>
                      <BookOpen className='h-4 w-4 text-primary' />
                      <span className='font-medium text-primary'>
                        Book Payout
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Bet Amount:</span>
                      <span className='font-mono'>$100.00</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>
                        Potential Payout:
                      </span>
                      <span className='font-mono font-semibold text-green-600'>
                        ${potentialBookPayout.toFixed(2)}
                      </span>
                    </div>
                    <div className='flex justify-between border-t pt-2'>
                      <span className='font-medium'>Profit:</span>
                      <span
                        className={cn(
                          'font-mono font-semibold',
                          bookProfit > 0 ? 'text-green-600' : 'text-red-500'
                        )}
                      >
                        ${bookProfit.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Risk Assessment */}
            <div className='border-t pt-4'>
              <div className='space-y-4'>
                {/* Model Risk */}
                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <Brain className='h-4 w-4 text-primary' />
                    <span className='text-sm font-medium'>
                      Model Assessment
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    {parlayCalculations.totalModelProbability > 0.5 ? (
                      <>
                        <div className='w-2 h-2 bg-green-500 rounded-full' />
                        <span className='text-sm text-green-600 font-medium'>
                          High Probability
                        </span>
                      </>
                    ) : parlayCalculations.totalModelProbability > 0.25 ? (
                      <>
                        <div className='w-2 h-2 bg-yellow-500 rounded-full' />
                        <span className='text-sm text-yellow-600 font-medium'>
                          Medium Risk
                        </span>
                      </>
                    ) : (
                      <>
                        <div className='w-2 h-2 bg-red-500 rounded-full' />
                        <span className='text-sm text-red-600 font-medium'>
                          High Risk
                        </span>
                      </>
                    )}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    {parlayCalculations.legCount} legs with{' '}
                    {(parlayCalculations.totalModelProbability * 100).toFixed(
                      1
                    )}
                    % model probability
                  </p>
                </div>

                {/* Value Analysis */}
                {parlayCalculations.hasValidBookOdds && (
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <TrendingUp className='h-4 w-4 text-primary' />
                      <span className='text-sm font-medium'>
                        Value Analysis
                      </span>
                    </div>

                    {/* Calculate value metrics */}
                    {(() => {
                      const modelPayout = calculatePayout(
                        parlayCalculations.totalModelOdds
                      );
                      const bookPayout = calculatePayout(
                        parlayCalculations.totalBookOdds
                      );
                      const valueEdge = bookPayout - modelPayout; // Book payout - Model payout (positive when book is better)
                      const valuePercentage = (valueEdge / modelPayout) * 100;
                      const probabilityAdvantage =
                        (parlayCalculations.totalModelProbability -
                          parlayCalculations.totalBookProbability) *
                        100;

                      return (
                        <>
                          <div className='flex items-center gap-2'>
                            {valuePercentage >= 20 ? (
                              <>
                                <div className='w-2 h-2 bg-green-500 rounded-full' />
                                <span className='text-sm text-green-600 font-medium'>
                                  High Value Opportunity
                                </span>
                              </>
                            ) : valuePercentage >= 10 ? (
                              <>
                                <div className='w-2 h-2 bg-yellow-500 rounded-full' />
                                <span className='text-sm text-yellow-600 font-medium'>
                                  Good Value
                                </span>
                              </>
                            ) : valuePercentage >= 5 ? (
                              <>
                                <div className='w-2 h-2 bg-blue-500 rounded-full' />
                                <span className='text-sm text-blue-600 font-medium'>
                                  Slight Advantage
                                </span>
                              </>
                            ) : valuePercentage >= -5 ? (
                              <>
                                <div className='w-2 h-2 bg-gray-500 rounded-full' />
                                <span className='text-sm text-gray-600 font-medium'>
                                  Fair Value
                                </span>
                              </>
                            ) : (
                              <>
                                <div className='w-2 h-2 bg-red-500 rounded-full' />
                                <span className='text-sm text-red-600 font-medium'>
                                  Model Advantage
                                </span>
                              </>
                            )}
                          </div>
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
                    {parlayCalculations.totalModelProbability > 0.3
                      ? 'This parlay has a decent chance of hitting. Consider a reasonable stake.'
                      : parlayCalculations.totalModelProbability > 0.1
                        ? 'This is a long-shot parlay. Only bet what you can afford to lose.'
                        : 'This is a very risky parlay. Consider removing some legs or betting very small amounts.'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Placeholder */
          <div className='space-y-4'>
            <div className='p-8 text-center border-2 border-dashed border-muted rounded-lg'>
              <TrendingUp className='h-8 w-8 text-muted-foreground mx-auto mb-2' />
              <p className='text-muted-foreground text-sm'>
                Select events to see parlay calculations
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

        {/* Selected Events Preview */}
        {selectedEvents.length > 0 && (
          <div className='border-t pt-4'>
            <h3 className='font-medium mb-3'>Selected Events</h3>
            <div className='space-y-2 max-h-32 overflow-y-auto'>
              {selectedEvents.map((event, index) => (
                <div key={event.id} className='flex items-center gap-2 text-sm'>
                  <span className='w-5 h-5 bg-primary/10 text-primary text-xs rounded-full flex items-center justify-center font-medium'>
                    {index + 1}
                  </span>
                  <span className='truncate'>
                    {event.team1_name} vs {event.team2_name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
