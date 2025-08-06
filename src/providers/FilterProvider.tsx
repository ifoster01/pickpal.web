'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  WeekRange,
  getCurrentWeekRange,
  generateWeekRanges,
  generateEventRanges,
} from '@/utils/utils';
import { useLeague, League } from '@/providers/LeagueProvider';

// Legacy filter type for backward compatibility
export type LegacyFilter = 'upcoming' | 'past' | 'all';

interface FilterContextType {
  // Week-based filtering (new)
  selectedWeek: WeekRange | null;
  setSelectedWeek: (week: WeekRange) => void;
  availableWeeks: WeekRange[];
  isLoading: boolean;

  // Legacy filter support
  filter: LegacyFilter;
  setFilter: (filter: LegacyFilter) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const { league } = useLeague();
  const [filter, setFilter] = useState<LegacyFilter>('upcoming');
  const [isLoading, setIsLoading] = useState(true);

  // State dependent on client-side Date object must be initialized in useEffect
  const [availableWeeks, setAvailableWeeks] = useState<WeekRange[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<WeekRange | null>(null);

  // Helper function to update filter based on week timing
  const updateFilterBasedOnWeek = useCallback(
    (week: WeekRange, currentFilter: LegacyFilter) => {
      const now = new Date();

      // If the selected week is completely in the past, set filter to 'past'
      if (week.end < now && currentFilter === 'upcoming') {
        setFilter('past');
      }
      // If the selected week end is in the future, set filter to 'upcoming'
      else if (week.end > now && currentFilter === 'past') {
        setFilter('upcoming');
      }
    },
    []
  );

  // This effect runs only on the client after the component has mounted.
  useEffect(() => {
    let isCancelled = false;

    const initializeWeeks = async (currentLeague: League) => {
      setIsLoading(true);
      let clientWeeks: WeekRange[] = [];

      try {
        if (currentLeague === 'atp' || currentLeague === 'ufc') {
          clientWeeks = await generateEventRanges(currentLeague);
        } else {
          clientWeeks = generateWeekRanges();
        }

        // Check if this effect is still valid (league hasn't changed)
        if (isCancelled || currentLeague !== league) {
          return;
        }

        setAvailableWeeks(clientWeeks);

        const savedWeekKey = localStorage.getItem('selectedWeekKey');
        const savedWeek = clientWeeks.find((week) => week.key === savedWeekKey);

        if (currentLeague === 'atp' || currentLeague === 'ufc') {
          // Set the initial week from localStorage or default to the current week
          setSelectedWeek(savedWeek || clientWeeks[clientWeeks.length - 1]);
        } else {
          // Set the initial week from localStorage or default to the current week
          setSelectedWeek(savedWeek || getCurrentWeekRange());
        }
      } catch (error) {
        console.error('Failed to initialize weeks:', error);
        // Fallback to current week in case of error
        if (!isCancelled && currentLeague === league) {
          const fallbackWeek = getCurrentWeekRange();
          setSelectedWeek(fallbackWeek);
          setAvailableWeeks([fallbackWeek]);
        }
      } finally {
        if (!isCancelled && currentLeague === league) {
          setIsLoading(false);
        }
      }
    };

    initializeWeeks(league);

    // Cleanup function to cancel stale requests
    return () => {
      isCancelled = true;
    };
  }, [league]);

  // Update filter when sport/league or week changes (but not when user manually changes filter)
  useEffect(() => {
    if (selectedWeek) {
      updateFilterBasedOnWeek(selectedWeek, filter);
    }
  }, [league, selectedWeek, updateFilterBasedOnWeek]);

  // Persist week selection to localStorage
  useEffect(() => {
    // Ensure selectedWeek is not null before setting
    if (selectedWeek) {
      localStorage.setItem('selectedWeekKey', selectedWeek.key);
    }
  }, [selectedWeek]);

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

  return (
    <FilterContext.Provider
      value={{
        selectedWeek,
        setSelectedWeek,
        availableWeeks,
        isLoading,
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
