import { Database } from '@/types/supabase';
import { NextRequest, NextResponse } from 'next/server';

type EventOdds = Database['public']['Tables']['event_moneyline_odds']['Row'];
type League = 'ufc' | 'atp' | 'nba' | 'nfl';
type Pick = 'team1' | 'team2' | 'none';

interface PickResult {
  eventId: string;
  pick: Pick;
}

/**
 * Calculate pick for a single event
 * This mirrors the logic from /api/picks/pick/route.ts
 */
function calculatePick(event: EventOdds, league: League): Pick {
  if (!event.odds1 || !event.odds2 || !event.book_odds1 || !event.book_odds2) {
    return 'none';
  }

  const model_favorite_odds =
    event.odds1 < event.odds2 ? event.odds1 : event.odds2;
  const model_favorite_book =
    event.odds1 < event.odds2 ? event.book_odds1 : event.book_odds2;

  if (league === 'ufc') {
    // the favorite's odds are less than -110
    // the book odds agree on the favorite
    // the book odds have higher payout than the model odds (arbitrage)
    const odds_threshold = -110;
    if (
      model_favorite_odds < odds_threshold &&
      model_favorite_odds < model_favorite_book &&
      model_favorite_book < 0
    ) {
      return model_favorite_odds === event.odds1 ? 'team1' : 'team2';
    }
    return 'none';
  }

  if (league === 'atp') {
    // the favorite's odds are less than -130
    // the book odds agree on the favorite
    // the book odds are less than -150
    const odds_threshold = -130;
    const book_odds_threshold = -150;
    if (
      model_favorite_odds < odds_threshold &&
      model_favorite_book > book_odds_threshold &&
      model_favorite_book < 0
    ) {
      return model_favorite_odds === event.odds1 ? 'team1' : 'team2';
    }
    return 'none';
  }

  // NBA and NFL currently don't have picks
  if (league === 'nba' || league === 'nfl') {
    return 'none';
  }

  return 'none';
}

export async function POST(request: NextRequest) {
  try {
    const body: {
      events: EventOdds[];
      league: League;
    } = await request.json();

    const { events, league } = body;

    // Validate input
    if (!Array.isArray(events)) {
      return NextResponse.json(
        { error: 'Events must be an array' },
        { status: 400 }
      );
    }

    if (!league || !['ufc', 'atp', 'nba', 'nfl'].includes(league)) {
      return NextResponse.json(
        { error: 'Invalid league specified' },
        { status: 400 }
      );
    }

    // Process all events and calculate picks
    const picks: PickResult[] = events.map((event) => ({
      eventId: event.id,
      pick: calculatePick(event, league),
    }));

    return NextResponse.json({ picks }, { status: 200 });
  } catch (error) {
    console.error('Error processing bulk picks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
