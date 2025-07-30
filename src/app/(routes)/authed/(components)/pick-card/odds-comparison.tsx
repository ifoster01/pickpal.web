'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Database } from '@/types/supabase';

type EventOdds = Database['public']['Tables']['moneyline_book_odds_data']['Row'];

interface OddsComparisonProps {
  modelOdds: number;
  bookOdds: number;
  odds?: EventOdds[];
  modelFavorite?: 'team1' | 'team2';
  teamType?: 'team1' | 'team2';
  showMovement?: boolean;
}

export function OddsComparison({ 
  modelOdds, 
  bookOdds, 
  odds, 
  modelFavorite, 
  teamType,
  showMovement = false 
}: OddsComparisonProps) {
  const formatOdds = (odds: number) =>
    odds > 0 ? `+${odds}` : odds.toString();
  
  const getOddsColor = (modelOdds: number, bookOdds: number) => {
    const diff = Math.abs(modelOdds - bookOdds);
    return diff > 50 ? 'text-green-500' : 'text-foreground';
  };

  const modelFavoriteBookOddsMovement = useMemo(() => {
    if (!odds?.length || odds.length < 2 || !modelFavorite) return 0;
    const lastOdd = odds[odds.length - 1];
    const secondLastOdd = odds[odds.length - 2];

    // get the model favorite odds
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

  const renderOddsMovement = () => {
    if (!showMovement || modelFavoriteBookOddsMovement === 0 || modelFavorite !== teamType) return null;
    return (
      <div
        className={cn(
          'w-full flex items-center gap-2',
          teamType === 'team2' ? 'justify-end' : 'justify-start'
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
  };

  return (
    <div className='flex flex-col items-start'>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='flex items-center gap-2'
            >
              <span
                className={`text-2xl font-bold text-primary ${getOddsColor(modelOdds, bookOdds)}`}
              >
                {formatOdds(modelOdds)}
              </span>
              <span className='text-sm text-muted-foreground'>
                ({formatOdds(bookOdds)} book)
              </span>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Model Odds vs Book Odds</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {renderOddsMovement()}
    </div>
  );
}