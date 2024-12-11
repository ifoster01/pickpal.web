import { Database } from "@/types/supabase";
import { calculateProbabilityFromOdds } from "./odds";

type FightOdds = Database["public"]["Tables"]["upcoming_fight_odds"]["Row"];
type NFLOdds = Database["public"]["Tables"]["upcoming_nfl_odds"]["Row"];

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
  type: 'UFC' | 'NFL';
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
  const decimalOdds = americanOdds.map(odds => {
    if (odds > 0) {
      return 1 + (odds / 100);
    } else {
      return 1 + (100 / Math.abs(odds));
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

export function getBetterSide(event: FightOdds | NFLOdds, type: 'UFC' | 'NFL'): ParlayLeg {
  if (type === 'UFC') {
    const fight = event as FightOdds;
    const f1Prob = calculateProbabilityFromOdds(fight.odds1 || 0);
    const f2Prob = calculateProbabilityFromOdds(fight.odds2 || 0);
    const f1BookProb = calculateProbabilityFromOdds(fight.f1_book_odds || 0);
    const f2BookProb = calculateProbabilityFromOdds(fight.f2_book_odds || 0);

    // Compare model probabilities to determine the favorite
    if (f1Prob > f2Prob) {
      return {
        eventId: fight.fight_id,
        eventName: fight.fight_name,
        eventDate: fight.fight_date,
        selection: fight.fighter1,
        modelOdds: fight.odds1 || 0,
        bookOdds: fight.f1_book_odds || 0,
        modelProbability: f1Prob,
        bookProbability: f1BookProb,
        valueEdge: f1Prob - f1BookProb,
        type: 'UFC',
        picUrl: fight.f1_pic_url,
      };
    } else {
      return {
        eventId: fight.fight_id,
        eventName: fight.fight_name,
        eventDate: fight.fight_date,
        selection: fight.fighter2,
        modelOdds: fight.odds2 || 0,
        bookOdds: fight.f2_book_odds || 0,
        modelProbability: f2Prob,
        bookProbability: f2BookProb,
        valueEdge: f2Prob - f2BookProb,
        type: 'UFC',
        picUrl: fight.f2_pic_url,
      };
    }
  } else {
    const game = event as NFLOdds;
    const teamProb = calculateProbabilityFromOdds(game.odds1 || 0);
    const oppProb = calculateProbabilityFromOdds(game.odds2 || 0);
    const teamBookProb = calculateProbabilityFromOdds(game.team_book_odds || 0);
    const oppBookProb = calculateProbabilityFromOdds(game.opp_book_odds || 0);

    if (teamProb > oppProb) {
      return {
        eventId: game.game_id,
        eventName: game.game_name,
        eventDate: game.game_date,
        selection: game.team_name,
        modelOdds: game.odds1 || 0,
        bookOdds: game.team_book_odds || 0,
        modelProbability: teamProb,
        bookProbability: teamBookProb,
        valueEdge: teamProb - teamBookProb,
        type: 'NFL',
        picUrl: game.team_pic_url,
      };
    } else {
      return {
        eventId: game.game_id,
        eventName: game.game_name,
        eventDate: game.game_date,
        selection: game.opp_name,
        modelOdds: game.odds2 || 0,
        bookOdds: game.opp_book_odds || 0,
        modelProbability: oppProb,
        bookProbability: oppBookProb,
        valueEdge: oppProb - oppBookProb,
        type: 'NFL',
        picUrl: game.opp_pic_url,
      };
    }
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
    
    combinations.forEach(combo => {
      const bookOdds = combo.map(leg => leg.bookOdds);
      const modelOdds = combo.map(leg => leg.modelOdds);
      const bookProbs = combo.map(leg => leg.bookProbability);
      const modelProbs = combo.map(leg => leg.modelProbability);

      parlays.push({
        legs: combo,
        totalBookOdds: calculateParlayOdds(bookOdds),
        totalModelOdds: calculateParlayOdds(modelOdds),
        totalBookProbability: calculateParlayProbability(bookProbs),
        totalModelProbability: calculateParlayProbability(modelProbs),
        valueEdge: calculateParlayProbability(modelProbs) - calculateParlayProbability(bookProbs),
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