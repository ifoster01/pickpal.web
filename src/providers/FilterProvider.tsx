"use client";

import { createContext, useContext, useState, useEffect } from "react";

type Filter = 'upcoming' | 'past' | 'all';

interface FilterContextType {
  filter: Filter;
  setFilter: (filter: Filter) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filter, setFilter] = useState<Filter>('upcoming');

  // Persist filter selection to localStorage
  useEffect(() => {
    const savedFilter = localStorage.getItem('selectedFilter');
    if (savedFilter === 'upcoming' || savedFilter === 'past' || savedFilter === 'all') {
      setFilter(savedFilter);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedFilter', filter);
  }, [filter]);

  return (
    <FilterContext.Provider value={{ filter, setFilter }}>
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