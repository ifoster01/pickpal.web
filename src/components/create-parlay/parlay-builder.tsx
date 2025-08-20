'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Calculator } from 'lucide-react';

export function ParlayBuilder() {
  const [activeTab, setActiveTab] = useState('events');

  return (
    <Card className='p-6'>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-semibold'>Advanced Builder</h2>
          <Badge variant='secondary'>Coming Soon</Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='events' className='text-sm'>
              Events
            </TabsTrigger>
            <TabsTrigger value='bet-types' className='text-sm'>
              Bet Types
            </TabsTrigger>
            <TabsTrigger value='same-game' className='text-sm'>
              Same Game
            </TabsTrigger>
          </TabsList>

          <TabsContent value='events' className='mt-6'>
            <div className='space-y-4'>
              <p className='text-sm text-muted-foreground'>
                Advanced event selection with filters, correlations, and smart
                suggestions.
              </p>
              <div className='grid grid-cols-2 gap-4'>
                <Card className='p-4 opacity-50'>
                  <div className='flex items-center gap-2 mb-2'>
                    <Calculator className='h-4 w-4' />
                    <span className='font-medium text-sm'>
                      Correlation Analysis
                    </span>
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Analyze event correlations for better parlay construction
                  </p>
                </Card>
                <Card className='p-4 opacity-50'>
                  <div className='flex items-center gap-2 mb-2'>
                    <Plus className='h-4 w-4' />
                    <span className='font-medium text-sm'>
                      Smart Suggestions
                    </span>
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    AI-powered event suggestions based on your preferences
                  </p>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value='bet-types' className='mt-6'>
            <div className='space-y-4'>
              <p className='text-sm text-muted-foreground'>
                Mix different bet types in your parlay (spreads, totals, props).
              </p>
              <div className='grid grid-cols-1 gap-3'>
                {[
                  'Moneyline',
                  'Point Spread',
                  'Over/Under',
                  'Player Props',
                ].map((type) => (
                  <Card key={type} className='p-3 opacity-50'>
                    <div className='flex items-center justify-between'>
                      <span className='font-medium text-sm'>{type}</span>
                      <Badge variant='outline' className='text-xs'>
                        Soon
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value='same-game' className='mt-6'>
            <div className='space-y-4'>
              <p className='text-sm text-muted-foreground'>
                Build same-game parlays with correlated outcomes.
              </p>
              <Card className='p-4 opacity-50'>
                <div className='text-center py-8'>
                  <Calculator className='h-8 w-8 text-muted-foreground mx-auto mb-2' />
                  <p className='text-sm font-medium mb-1'>Same Game Parlays</p>
                  <p className='text-xs text-muted-foreground'>
                    Combine multiple bets from the same game
                  </p>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className='border-t pt-4'>
          <p className='text-xs text-muted-foreground text-center'>
            Advanced features are under development. Use the main interface to
            create basic parlays.
          </p>
        </div>
      </div>
    </Card>
  );
}
