'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { useState } from 'react';

interface ParlayFiltersProps {
  minLegs: number;
  maxLegs: number;
  minOdds: number;
  maxOdds: number;
  minProbability: number;
  maxProbability: number;
  onMinLegsChange: (value: number) => void;
  onMaxLegsChange: (value: number) => void;
  onMinOddsChange: (value: number) => void;
  onMaxOddsChange: (value: number) => void;
  onMinProbabilityChange: (value: number) => void;
  onMaxProbabilityChange: (value: number) => void;
}

export function ParlayFilters({
  minLegs,
  maxLegs,
  minOdds,
  maxOdds,
  minProbability,
  maxProbability,
  onMinLegsChange,
  onMaxLegsChange,
  onMinOddsChange,
  onMaxOddsChange,
  onMinProbabilityChange,
  onMaxProbabilityChange,
}: ParlayFiltersProps) {
  // Local state for odds input fields
  const [minOddsInput, setMinOddsInput] = useState(minOdds.toString());
  const [maxOddsInput, setMaxOddsInput] = useState(maxOdds.toString());

  // Handle odds input changes with validation
  const handleOddsInput = (
    value: string,
    setter: (value: string) => void,
    callback: (value: number) => void
  ) => {
    // Allow empty string, minus sign, or numbers with optional minus sign
    if (value === '' || value === '-' || /^-?\d*$/.test(value)) {
      setter(value);

      // Only call the callback if we have a valid number
      const numValue = parseInt(value);
      if (!isNaN(numValue)) {
        callback(numValue);
      }
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='outline' size='icon'>
          <Filter className='h-4 w-4' />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Parlay Filters</SheetTitle>
          <SheetDescription>
            Customize your parlay search criteria
          </SheetDescription>
        </SheetHeader>

        <div className='space-y-8 py-6'>
          {/* Leg Count */}
          <div className='space-y-4'>
            <Label>Number of Legs</Label>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label className='text-sm text-muted-foreground'>
                  Min Legs
                </Label>
                <Input
                  type='number'
                  min={2}
                  max={10}
                  value={minLegs}
                  onChange={(e) => onMinLegsChange(parseInt(e.target.value))}
                />
              </div>
              <div className='space-y-2'>
                <Label className='text-sm text-muted-foreground'>
                  Max Legs
                </Label>
                <Input
                  type='number'
                  min={2}
                  max={10}
                  value={maxLegs}
                  onChange={(e) => onMaxLegsChange(parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Odds Range */}
          <div className='space-y-4'>
            <Label>Payout Odds Range</Label>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label className='text-sm text-muted-foreground'>
                  Min Odds
                </Label>
                <Input
                  type='text'
                  inputMode='numeric'
                  value={minOddsInput}
                  onChange={(e) =>
                    handleOddsInput(
                      e.target.value,
                      setMinOddsInput,
                      onMinOddsChange
                    )
                  }
                  onKeyDown={(e) => {
                    // Only allow numbers, backspace, delete, minus sign, and arrow keys
                    if (
                      !/[\d\-]/.test(e.key) &&
                      ![
                        'Backspace',
                        'Delete',
                        'ArrowLeft',
                        'ArrowRight',
                        'Tab',
                      ].includes(e.key)
                    ) {
                      e.preventDefault();
                    }
                    // Only allow one minus sign at the start
                    if (e.key === '-' && e.currentTarget.value.includes('-')) {
                      e.preventDefault();
                    }
                    if (e.key === '-' && e.currentTarget.selectionStart !== 0) {
                      e.preventDefault();
                    }
                  }}
                  placeholder='-200'
                />
              </div>
              <div className='space-y-2'>
                <Label className='text-sm text-muted-foreground'>
                  Max Odds
                </Label>
                <Input
                  type='text'
                  inputMode='numeric'
                  value={maxOddsInput}
                  onChange={(e) =>
                    handleOddsInput(
                      e.target.value,
                      setMaxOddsInput,
                      onMaxOddsChange
                    )
                  }
                  onKeyDown={(e) => {
                    // Only allow numbers, backspace, delete, minus sign, and arrow keys
                    if (
                      !/[\d\-]/.test(e.key) &&
                      ![
                        'Backspace',
                        'Delete',
                        'ArrowLeft',
                        'ArrowRight',
                        'Tab',
                      ].includes(e.key)
                    ) {
                      e.preventDefault();
                    }
                    // Only allow one minus sign at the start
                    if (e.key === '-' && e.currentTarget.value.includes('-')) {
                      e.preventDefault();
                    }
                    if (e.key === '-' && e.currentTarget.selectionStart !== 0) {
                      e.preventDefault();
                    }
                  }}
                  placeholder='+1000'
                />
              </div>
            </div>
            <p className='text-xs text-muted-foreground'>
              Enter American odds (e.g., -150 or +120)
            </p>
          </div>

          {/* Probability Range */}
          <div className='space-y-4'>
            <div className='flex justify-between'>
              <Label>Probability Range</Label>
              <span className='text-sm text-muted-foreground'>
                {minProbability}% - {maxProbability}%
              </span>
            </div>
            <div className='pt-2'>
              <Slider
                min={0}
                max={100}
                step={1}
                value={[minProbability, maxProbability]}
                onValueChange={([min, max]) => {
                  onMinProbabilityChange(min);
                  onMaxProbabilityChange(max);
                }}
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
