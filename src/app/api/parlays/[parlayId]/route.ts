import { createClient } from '@/utils/supabase/server';
import { Database } from '@/types/supabase';
import { NextRequest, NextResponse } from 'next/server';

type UserParlayUpdate = Database['public']['Tables']['user_parlays']['Update'];

/**
 * GET /api/parlays/[parlayId]
 * Fetch a specific parlay with its legs and event details
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

    // Fetch parlay with legs and event details
    const { data: parlay, error } = await supabase
      .from('user_parlays')
      .select(
        `
        *,
        parlay_leg(
          event_id,
          created_at,
          event_moneyline_odds(*)
        )
      `
      )
      .eq('id', parlayId)
      .eq('created_by', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Parlay not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching parlay:', error);
      return NextResponse.json(
        { error: 'Failed to fetch parlay' },
        { status: 500 }
      );
    }

    return NextResponse.json({ parlay }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error in GET /api/parlays/[parlayId]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/parlays/[parlayId]
 * Update a parlay's metadata (name, etc.)
 */
export async function PUT(
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

    const body: { name?: string } = await request.json();
    const { name } = body;

    // Validate input
    if (name !== undefined && typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Name must be a string' },
        { status: 400 }
      );
    }

    // Verify ownership and update
    const updateData: UserParlayUpdate = {};
    if (name !== undefined) updateData.name = name;

    const { data: parlay, error } = await supabase
      .from('user_parlays')
      .update(updateData)
      .eq('id', parlayId)
      .eq('created_by', user.id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Parlay not found' },
          { status: 404 }
        );
      }
      console.error('Error updating parlay:', error);
      return NextResponse.json(
        { error: 'Failed to update parlay' },
        { status: 500 }
      );
    }

    return NextResponse.json({ parlay }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error in PUT /api/parlays/[parlayId]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/parlays/[parlayId]
 * Delete a parlay and all its legs
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

    // Delete parlay (legs will be cascade deleted due to foreign key constraint)
    const { error } = await supabase
      .from('user_parlays')
      .delete()
      .eq('id', parlayId)
      .eq('created_by', user.id);

    if (error) {
      console.error('Error deleting parlay:', error);
      return NextResponse.json(
        { error: 'Failed to delete parlay' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Parlay deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error in DELETE /api/parlays/[parlayId]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
