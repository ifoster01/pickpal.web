'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  WeekRange,
  getCurrentWeekRange,
  generateWeekRanges,
} from '@/utils/utils';
import { useLeague } from '@/providers/LeagueProvider';

// Legacy filter type for backward compatibility
export type LegacyFilter = 'upcoming' | 'past' | 'all';

interface FilterContextType {
  // Week-based filtering (new)
  selectedWeek: WeekRange;
  setSelectedWeek: (week: WeekRange) => void;
  availableWeeks: WeekRange[];

  // Legacy filter support
  filter: LegacyFilter;
  setFilter: (filter: LegacyFilter) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const { league } = useLeague();
  const [filter, setFilter] = useState<LegacyFilter>('upcoming');

  // State dependent on client-side Date object must be initialized in useEffect
  const [availableWeeks, setAvailableWeeks] = useState<WeekRange[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<WeekRange | null>(null);

  // Helper function to update filter based on week timing
  const updateFilterBasedOnWeek = useCallback((week: WeekRange, currentFilter: LegacyFilter) => {
    const now = new Date();
    
    // If the selected week is completely in the past, set filter to 'past'
    if (week.start < now && week.end < now && currentFilter === 'upcoming') {
      setFilter('past');
    } 
    // If the selected week end is in the future, set filter to 'upcoming'
    else if (week.end > now && currentFilter === 'past') {
      setFilter('upcoming');
    }
  }, []);

  // This effect runs only on the client after the component has mounted.
  useEffect(() => {
    const clientWeeks = generateWeekRanges();
    setAvailableWeeks(clientWeeks);

    const savedWeekKey = localStorage.getItem('selectedWeekKey');
    const savedWeek = clientWeeks.find((week) => week.key === savedWeekKey);

    // Set the initial week from localStorage or default to the current week
    setSelectedWeek(savedWeek || getCurrentWeekRange());
  }, []);

  // Update filter when sport/league changes
  useEffect(() => {
    if (selectedWeek) {
      updateFilterBasedOnWeek(selectedWeek, filter);
    }
  }, [league, selectedWeek, filter, updateFilterBasedOnWeek]); // This triggers when the sport changes

  // Persist week selection to localStorage
  useEffect(() => {
    // Ensure selectedWeek is not null before setting
    if (selectedWeek) {
      localStorage.setItem('selectedWeekKey', selectedWeek.key);
      updateFilterBasedOnWeek(selectedWeek, filter);
    }
  }, [selectedWeek, filter, updateFilterBasedOnWeek]);

  // Legacy filter persistence for backward compatibility
  useEffect(() => {
    const savedFilter = localStorage.getItem('selectedFilter');
    if (
      savedFilter === 'upcoming' ||
      savedFilter === 'past' ||
      savedFilter === 'all'
    ) {
      setFilter(savedFilter);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedFilter', filter);
  }, [filter]);

  // Do not render children until the client-side state has been initialized
  // to prevent passing down null values and causing crashes.
  if (!selectedWeek) {
    return null; // Or a loading spinner
  }

  return (
    <FilterContext.Provider
      value={{
        selectedWeek,
        setSelectedWeek,
        availableWeeks,
        filter,
        setFilter,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
}
