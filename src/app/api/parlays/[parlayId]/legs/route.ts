import { createClient } from '@/utils/supabase/server';
import { Database } from '@/types/supabase';
import { NextRequest, NextResponse } from 'next/server';

type ParlayLegInsert = Database['public']['Tables']['parlay_leg']['Insert'];

/**
 * GET /api/parlays/[parlayId]/legs
 * Fetch all legs for a specific parlay with event details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ parlayId: string }> }
) {
  try {
    const supabase = await createClient();
    const { parlayId } = await params;

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify parlay ownership
    const { data: parlay, error: parlayError } = await supabase
      .from('user_parlays')
      .select('id')
      .eq('id', parlayId)
      .eq('created_by', user.id)
      .single();

    if (parlayError || !parlay) {
      return NextResponse.json({ error: 'Parlay not found' }, { status: 404 });
    }

    // Fetch legs with event details
    const { data: legs, error } = await supabase
      .from('parlay_leg')
      .select(
        `
        *,
        event_moneyline_odds(*)
      `
      )
      .eq('parlay_id', parlayId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching parlay legs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch parlay legs' },
        { status: 500 }
      );
    }

    return NextResponse.json({ legs }, { status: 200 });
  } catch (error) {
    console.error(
      'Unexpected error in GET /api/parlays/[parlayId]/legs:',
      error
    );
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/parlays/[parlayId]/legs
 * Add a new leg to a parlay
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ parlayId: string }> }
) {
  try {
    const supabase = await createClient();
    const { parlayId } = await params;

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: { eventId: string } = await request.json();
    const { eventId } = body;

    // Validate input
    if (!eventId || typeof eventId !== 'string') {
      return NextResponse.json(
        { error: 'eventId is required and must be a string' },
        { status: 400 }
      );
    }

    // Verify parlay ownership
    const { data: parlay, error: parlayError } = await supabase
      .from('user_parlays')
      .select('id')
      .eq('id', parlayId)
      .eq('created_by', user.id)
      .single();

    if (parlayError || !parlay) {
      return NextResponse.json({ error: 'Parlay not found' }, { status: 404 });
    }

    // Verify event exists
    const { data: event, error: eventError } = await supabase
      .from('event_moneyline_odds')
      .select('id')
      .eq('id', eventId)
      .single();

    if (eventError || !event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Check if leg already exists
    const { data: existingLeg, error: checkError } = await supabase
      .from('parlay_leg')
      .select('event_id')
      .eq('parlay_id', parlayId)
      .eq('event_id', eventId)
      .single();

    if (existingLeg) {
      return NextResponse.json(
        { error: 'Event already added to this parlay' },
        { status: 409 }
      );
    }

    if (checkError) {
      console.error('Error checking if leg already exists:', checkError);
      return NextResponse.json(
        { error: 'Failed to check if leg already exists' },
        { status: 500 }
      );
    }

    // Add leg to parlay
    const legData: ParlayLegInsert = {
      parlay_id: parlayId,
      event_id: eventId,
    };

    const { data: leg, error } = await supabase
      .from('parlay_leg')
      .insert(legData)
      .select(
        `
        *,
        event_moneyline_odds(*)
      `
      )
      .single();

    if (error) {
      console.error('Error adding leg to parlay:', error);
      return NextResponse.json(
        { error: 'Failed to add leg to parlay' },
        { status: 500 }
      );
    }

    return NextResponse.json({ leg }, { status: 201 });
  } catch (error) {
    console.error(
      'Unexpected error in POST /api/parlays/[parlayId]/legs:',
      error
    );
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/parlays/[parlayId]/legs
 * Remove a leg from a parlay
 * Expects { eventId } in request body
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ parlayId: string }> }
) {
  try {
    const supabase = await createClient();
    const { parlayId } = await params;

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: { eventId: string } = await request.json();
    const { eventId } = body;

    // Validate input
    if (!eventId || typeof eventId !== 'string') {
      return NextResponse.json(
        { error: 'eventId is required and must be a string' },
        { status: 400 }
      );
    }

    // Verify parlay ownership
    const { data: parlay, error: parlayError } = await supabase
      .from('user_parlays')
      .select('id')
      .eq('id', parlayId)
      .eq('created_by', user.id)
      .single();

    if (parlayError || !parlay) {
      return NextResponse.json({ error: 'Parlay not found' }, { status: 404 });
    }

    // Remove leg from parlay
    const { error } = await supabase
      .from('parlay_leg')
      .delete()
      .eq('parlay_id', parlayId)
      .eq('event_id', eventId);

    if (error) {
      console.error('Error removing leg from parlay:', error);
      return NextResponse.json(
        { error: 'Failed to remove leg from parlay' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Leg removed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      'Unexpected error in DELETE /api/parlays/[parlayId]/legs:',
      error
    );
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
