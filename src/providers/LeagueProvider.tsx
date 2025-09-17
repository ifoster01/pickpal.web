'use client';

import { createContext, useContext, useState, useEffect } from 'react';

export type League = 'ufc' | 'nfl' | 'nba' | 'atp';

interface LeagueContextType {
  league: League;
  setLeague: (league: League) => void;
}

const LeagueContext = createContext<LeagueContextType | undefined>(undefined);

export function LeagueProvider({ children }: { children: React.ReactNode }) {
  const [league, setLeague] = useState<League>('nfl');

  // Persist league selection to localStorage
  useEffect(() => {
    const savedLeague = localStorage.getItem('selectedLeague');
    if (
      savedLeague === 'ufc' ||
      savedLeague === 'nfl' ||
      savedLeague === 'nba' ||
      savedLeague === 'atp'
    ) {
      setLeague(savedLeague);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedLeague', league);
  }, [league]);

  return (
    <LeagueContext.Provider value={{ league, setLeague }}>
      {children}
    </LeagueContext.Provider>
  );
}

export function useLeague() {
  const context = useContext(LeagueContext);
  if (context === undefined) {
    throw new Error('useLeague must be used within a LeagueProvider');
  }
  return context;
}
