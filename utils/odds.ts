export function calculateProbabilityFromOdds(americanOdds: number): number {
  if (americanOdds === 0) return 0;
  
  if (americanOdds > 0) {
    // For positive odds (underdog)
    return 100 / (americanOdds + 100);
  } else {
    // For negative odds (favorite)
    const absOdds = Math.abs(americanOdds);
    return absOdds / (absOdds + 100);
  }
} 