"use client";

import { createContext, useContext, useState, useEffect } from "react";

type League = 'UFC' | 'NFL' | 'NBA';

interface LeagueContextType {
  league: League;
  setLeague: (league: League) => void;
}

const LeagueContext = createContext<LeagueContextType | undefined>(undefined);

export function LeagueProvider({ children }: { children: React.ReactNode }) {
  const [league, setLeague] = useState<League>('UFC');

  // Persist league selection to localStorage
  useEffect(() => {
    const savedLeague = localStorage.getItem('selectedLeague');
    if (savedLeague === 'UFC' || savedLeague === 'NFL' || savedLeague === 'NBA') {
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