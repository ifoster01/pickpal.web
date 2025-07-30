'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { League, useLeague } from '@/providers/LeagueProvider';
import { cn } from '@/utils/cn';

interface SportsSelectorProps {
  /** Display mode: 'tabs' for tab layout, 'select' for dropdown */
  mode?: 'tabs' | 'select';
  /** Optional className for styling */
  className?: string;
  /** Optional placeholder for select mode */
  placeholder?: string;
}

interface SportOption {
  value: League;
  label: string;
  shortLabel?: string;
}

const sportOptions: SportOption[] = [
  { value: 'ufc', label: 'UFC Fights', shortLabel: 'UFC' },
  { value: 'atp', label: 'ATP Matches', shortLabel: 'ATP' },
  { value: 'nfl', label: 'NFL Games', shortLabel: 'NFL' },
  { value: 'nba', label: 'NBA Games', shortLabel: 'NBA' },
];

/**
 * SportsSelector - A reusable component for selecting sports leagues
 * Supports both tab and select dropdown modes
 */
export function SportsSelector({
  mode = 'tabs',
  className,
  placeholder = 'Select League',
}: SportsSelectorProps) {
  const { league, setLeague } = useLeague();

  if (mode === 'select') {
    return (
      <Select
        value={league}
        onValueChange={(value: League) => setLeague(value)}
      >
        <SelectTrigger className={cn('w-full sm:w-[120px]', className)}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {sportOptions.map((sport) => (
            <SelectItem key={sport.value} value={sport.value}>
              {sport.shortLabel || sport.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Tabs
      value={league}
      onValueChange={(val) => setLeague(val as League)}
      className={cn('w-full', className)}
    >
      <TabsList className='w-full lg:w-fit justify-start overflow-x-auto'>
        {sportOptions.map((sport) => (
          <TabsTrigger key={sport.value} value={sport.value}>
            {sport.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}