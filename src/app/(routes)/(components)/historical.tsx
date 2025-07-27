'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useUpcomingEventOdds } from '@/hooks/api/use-odds';
import { Tables } from '@/types/supabase';

type Prediction = {
  event: string;
  prediction: string;
  result: string;
  odds1: number;
  odds2: number;
};

type SportData = {
  name: string;
  predictions: Prediction[];
};

type SportsData = {
  [key: string]: SportData;
};

export function Historical() {
  const { data: ufcEvents } = useUpcomingEventOdds('past', 'ufc', 10, 'desc');
  const { data: atpEvents } = useUpcomingEventOdds('past', 'atp', 10, 'desc');
  const { data: nflEvents } = useUpcomingEventOdds('past', 'nfl', 10, 'desc');
  const { data: nbaEvents } = useUpcomingEventOdds('past', 'nba', 10, 'desc');

  const sportsData: SportsData = useMemo(() => {
    const processEvents = (
      events: Tables<'event_moneyline_odds'>[] | undefined,
      name: string
    ): SportData => {
      if (!events) return { name, predictions: [] };

      const predictions = events.flatMap((event) => {
        const gameResult = event.result;
        const preds: Prediction[] = [];

        if (
          !(
            event.team1_name &&
            event.odds1 !== null &&
            event.team2_name &&
            event.odds2 !== null
          )
        )
          return [];

        const result =
          gameResult !== null &&
          ((!gameResult && event.odds2 < 0) || (gameResult && event.odds1 < 0))
            ? 'Win'
            : 'Loss';
        preds.push({
          event:
            `${event.team1_name} vs ${event.team2_name}` || 'Unknown Event',
          prediction:
            event.odds1 < 0
              ? `${event.team1_name} win (${event.odds1})`
              : `${event.team2_name} win (${event.odds2})`,
          result,
          odds1: event.odds1,
          odds2: event.odds2,
        });
        return preds;
      });

      return { name, predictions };
    };

    return {
      ufc: processEvents(ufcEvents, 'UFC'),
      atp: processEvents(atpEvents, 'ATP'),
      nfl: processEvents(nflEvents, 'NFL'),
      nba: processEvents(nbaEvents, 'NBA'),
    };
  }, [ufcEvents, atpEvents, nflEvents, nbaEvents]);

  const ResultBadge = ({ prediction }: { prediction: Prediction }) => {
    return prediction.result === 'Win' ? (
      <Badge
        variant='outline'
        className='text-sm text-muted-foreground bg-green-500/10 border-green-500'
      >
        Correct Prediction
      </Badge>
    ) : prediction.result === 'Loss' ? (
      <Badge
        variant='outline'
        className='text-sm text-muted-foreground text-red-500 bg-red-500/10 border-red-500'
      >
        Wrong Prediction
      </Badge>
    ) : (
      <Badge
        variant='outline'
        className='text-sm text-muted-foreground text-yellow-500 bg-yellow-500/10 border-yellow-500'
      >
        Missing Result (Potentially Cancelled)
      </Badge>
    );
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.section
      id='historical'
      className='py-24'
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeIn}
    >
      <div className='container mx-auto px-4'>
        <motion.div
          className='text-center max-w-3xl mx-auto'
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeIn} className='text-4xl font-bold mb-4'>
            Our Historical Performance
          </motion.h2>
          <motion.p variants={fadeIn} className='text-muted-foreground mb-8'>
            We believe in transparency. Here&apos;s a look at our past 10
            predictions and their outcomes across various sports.
          </motion.p>
        </motion.div>
        <Tabs defaultValue='ufc' className='w-full'>
          <TabsList className='grid w-full grid-cols-4 max-w-2xl mx-auto'>
            {Object.keys(sportsData).map((sport) => (
              <TabsTrigger key={sport} value={sport}>
                {sportsData[sport as keyof typeof sportsData].name}
              </TabsTrigger>
            ))}
          </TabsList>
          {Object.keys(sportsData).map((sport) => (
            <TabsContent key={sport} value={sport}>
              <motion.div
                className='overflow-x-auto rounded-lg border hidden md:block'
                initial='hidden'
                animate='visible'
                variants={staggerContainer}
              >
                <table className='w-full text-left'>
                  <thead className='bg-muted/50'>
                    <tr className='border-b'>
                      <th className='p-4 font-semibold'>Event</th>
                      <th className='p-4 font-semibold'>Prediction</th>
                      <th className='p-4 font-semibold text-right'>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sportsData[
                      sport as keyof typeof sportsData
                    ].predictions.map((prediction, index) => (
                      <motion.tr
                        key={index}
                        className='border-b last:border-none'
                        variants={staggerItem}
                      >
                        <td className='p-4'>{prediction.event}</td>
                        <td className='p-4'>{prediction.prediction}</td>
                        <td className='p-4 text-right'>
                          <ResultBadge prediction={prediction} />
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
              <motion.div
                className='mt-8 space-y-4 md:hidden'
                initial='hidden'
                animate='visible'
                variants={staggerContainer}
              >
                {sportsData[sport as keyof typeof sportsData].predictions.map(
                  (prediction, index) => (
                    <motion.div
                      key={index}
                      className='rounded-lg border bg-card text-card-foreground shadow-sm p-4'
                      variants={staggerItem}
                    >
                      <div className='flex flex-col space-y-2'>
                        <div>
                          <p className='text-sm text-muted-foreground'>Event</p>
                          <p className='font-semibold'>{prediction.event}</p>
                        </div>
                        <div>
                          <p className='text-sm text-muted-foreground'>
                            Prediction
                          </p>
                          <p>{prediction.prediction}</p>
                        </div>
                        <div>
                          <p className='text-sm text-muted-foreground'>
                            Result
                          </p>
                          <ResultBadge prediction={prediction} />
                        </div>
                      </div>
                    </motion.div>
                  )
                )}
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </motion.section>
  );
}
