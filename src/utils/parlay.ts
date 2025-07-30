import { Database } from '@/types/supabase';
import { calculateProbabilityFromOdds } from './odds';
import { League } from '@/providers/LeagueProvider';

type EventOdds = Database['public']['Tables']['event_moneyline_odds']['Row'];

export type ParlayLeg = {
  eventId: string;
  eventName: string | null;
  eventDate: string | null;
  selection: string | null;
  modelOdds: number;
  bookOdds: number;
  modelProbability: number;
  bookProbability: number;
  valueEdge: number;
  type: League;
  picUrl: string | null;
};

export type Parlay = {
  legs: ParlayLeg[];
  totalBookOdds: number;
  totalModelOdds: number;
  totalBookProbability: number;
  totalModelProbability: number;
  valueEdge: number;
};

export function calculateParlayOdds(americanOdds: number[]): number {
  // Convert American odds to decimal
  const decimalOdds = americanOdds.map((odds) => {
    if (odds > 0) {
      return 1 + odds / 100;
    } else {
      return 1 + 100 / Math.abs(odds);
    }
  });

  // Multiply all decimal odds
  const totalDecimalOdds = decimalOdds.reduce((acc, curr) => acc * curr, 1);

  // Convert back to American odds
  if (totalDecimalOdds >= 2) {
    return Math.round((totalDecimalOdds - 1) * 100);
  } else {
    return Math.round(-100 / (totalDecimalOdds - 1));
  }
}

export function calculateParlayProbability(probabilities: number[]): number {
  return probabilities.reduce((acc, curr) => acc * curr, 1);
}

export function getBetterSide(event: EventOdds, type: League): ParlayLeg {
  const f1Prob = calculateProbabilityFromOdds(event.odds1 || 0);
  const f2Prob = calculateProbabilityFromOdds(event.odds2 || 0);
  const f1BookProb = calculateProbabilityFromOdds(event.book_odds1 || 0);
  const f2BookProb = calculateProbabilityFromOdds(event.book_odds2 || 0);

  // Compare model probabilities to determine the favorite
  if (f1Prob > f2Prob) {
    return {
      eventId: event.id,
      eventName: event.event_name,
      eventDate: event.event_datetime,
      selection: event.team1_name,
      modelOdds: event.odds1 || 0,
      bookOdds: event.book_odds1 || 0,
      modelProbability: f1Prob,
      bookProbability: f1BookProb,
      valueEdge: f1Prob - f1BookProb,
      type,
      picUrl: event.team1_pic_url,
    };
  } else {
    return {
      eventId: event.id,
      eventName: event.event_name,
      eventDate: event.event_datetime,
      selection: event.team2_name,
      modelOdds: event.odds2 || 0,
      bookOdds: event.book_odds2 || 0,
      modelProbability: f2Prob,
      bookProbability: f2BookProb,
      valueEdge: f2Prob - f2BookProb,
      type,
      picUrl: event.team2_pic_url,
    };
  }
}

export function generateParlayCombinations(
  legs: ParlayLeg[],
  minLegs: number = 2,
  maxLegs: number = 10
): Parlay[] {
  const parlays: Parlay[] = [];

  // Generate combinations for each possible number of legs
  for (let size = minLegs; size <= Math.min(maxLegs, legs.length); size++) {
    const combinations = getCombinations(legs, size);

    combinations.forEach((combo) => {
      const bookOdds = combo.map((leg) => leg.bookOdds);
      const modelOdds = combo.map((leg) => leg.modelOdds);
      const bookProbs = combo.map((leg) => leg.bookProbability);
      const modelProbs = combo.map((leg) => leg.modelProbability);

      parlays.push({
        legs: combo,
        totalBookOdds: calculateParlayOdds(bookOdds),
        totalModelOdds: calculateParlayOdds(modelOdds),
        totalBookProbability: calculateParlayProbability(bookProbs),
        totalModelProbability: calculateParlayProbability(modelProbs),
        valueEdge:
          calculateParlayProbability(modelProbs) -
          calculateParlayProbability(bookProbs),
      });
    });
  }

  return parlays;
}

// Helper function to generate combinations
function getCombinations<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];

  function combine(start: number, combo: T[]) {
    if (combo.length === size) {
      result.push([...combo]);
      return;
    }

    for (let i = start; i < array.length; i++) {
      combo.push(array[i]);
      combine(i + 1, combo);
      combo.pop();
    }
  }

  combine(0, []);
  return result;
}
