import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get completed mock interviews count
    const { data: interviews, error } = await supabase
      .from('mock_interviews')
      .select('id, overall_score, difficulty, completed_at')
      .eq('user_id', user.id)
      .not('completed_at', 'is', null) // Only completed interviews
      .order('completed_at', { ascending: false });

    if (error) {
      console.error('Error fetching mock interviews:', error);
      return NextResponse.json(
        { error: 'Failed to fetch interview progress' },
        { status: 500 }
      );
    }

    const completedInterviews = interviews?.length || 0;
    const averageScore =
      completedInterviews > 0
        ? Math.round(
            interviews.reduce((sum, interview) => sum + (interview.overall_score || 0), 0) /
              completedInterviews
          )
        : 0;

    // Count by difficulty level
    const byLevel = {
      junior: interviews?.filter((i) => i.difficulty === 'junior').length || 0,
      mid: interviews?.filter((i) => i.difficulty === 'mid').length || 0,
      senior: interviews?.filter((i) => i.difficulty === 'senior').length || 0,
    };

    return NextResponse.json({
      completedInterviews,
      averageScore,
      byLevel,
      recentInterviews: interviews?.slice(0, 5) || [], // Last 5 interviews
    });
  } catch (error) {
    console.error('Error in interview progress API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
