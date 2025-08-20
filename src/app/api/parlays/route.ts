import { createClient } from '@/utils/supabase/server';
import { Database } from '@/types/supabase';
import { NextRequest, NextResponse } from 'next/server';

type UserParlayInsert = Database['public']['Tables']['user_parlays']['Insert'];

/**
 * GET /api/parlays
 * Fetch all parlays for the authenticated user
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user's parlays with leg count
    const { data: parlays, error } = await supabase
      .from('user_parlays')
      .select(
        `
        *,
        parlay_leg(count)
      `
      )
      .eq('created_by', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching parlays:', error);
      return NextResponse.json(
        { error: 'Failed to fetch parlays' },
        { status: 500 }
      );
    }

    return NextResponse.json({ parlays }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error in GET /api/parlays:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/parlays
 * Create a new parlay for the authenticated user
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: { name?: string } = await request.json();
    const { name } = body;

    // Validate input
    if (name && typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Name must be a string' },
        { status: 400 }
      );
    }

    // Create parlay
    const parlayData: UserParlayInsert = {
      name: name || `Parlay ${new Date().toLocaleDateString()}`,
      created_by: user.id,
    };

    const { data: parlay, error } = await supabase
      .from('user_parlays')
      .insert(parlayData)
      .select()
      .single();

    if (error) {
      console.error('Error creating parlay:', error);
      return NextResponse.json(
        { error: 'Failed to create parlay' },
        { status: 500 }
      );
    }

    return NextResponse.json({ parlay }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in POST /api/parlays:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
