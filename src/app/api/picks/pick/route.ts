import { Database } from '@/types/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body: {
    event: Database['public']['Tables']['event_moneyline_odds']['Row'];
    league: 'ufc' | 'atp' | 'nba' | 'nfl';
  } = await request.json();
  const { event, league } = body;

  if (!event.odds1 || !event.odds2 || !event.book_odds1 || !event.book_odds2) {
    return NextResponse.json({ pick: 'none' }, { status: 200 });
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
      return NextResponse.json(
        { pick: model_favorite_odds === event.odds1 ? 'team1' : 'team2' },
        { status: 200 }
      );
    }
    return NextResponse.json({ pick: 'none' }, { status: 200 });
  }
  if (league === 'atp') {
    return NextResponse.json({ pick: 'none' }, { status: 200 });
  }
  if (league === 'nba') {
    return NextResponse.json({ pick: 'none' }, { status: 200 });
  }
  if (league === 'nfl') {
    return NextResponse.json({ pick: 'none' }, { status: 200 });
  }
  return NextResponse.json({ pick: 'none' }, { status: 200 });
}
