import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Check auth
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      challengeId,
      code,
      language,
      validationResult,
    } = await req.json();

    console.log('Submit request:', { challengeId, hasCode: !!code, hasValidation: !!validationResult });

    if (!challengeId || !code || !validationResult) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { passed, score, codeQuality, improvements, suggestions, strengths, testResults } =
      validationResult;

    // Extract test case counts (for test case validation)
    const passedTests = testResults?.passed || (passed ? 1 : 0);
    const totalTests = testResults?.total || 1;

    // Check if user already has a passing submission (prevent point farming)
    // This implements the LeetCode/HackerRank pattern: points awarded only on FIRST pass
    let actualPointsEarned = validationResult.pointsEarned || 0;
    let isFirstPass = true;

    if (passed) {
      const { data: previousPassingSubmission } = await supabase
        .from('submissions')
        .select('id, submitted_at')
        .eq('user_id', user.id)
        .eq('challenge_id', challengeId)
        .eq('status', 'passed')
        .order('submitted_at', { ascending: true })
        .limit(1)
        .single();

      if (previousPassingSubmission) {
        // User already passed this challenge before - no points this time
        actualPointsEarned = 0;
        isFirstPass = false;
        console.log(`⚠️ User already passed challenge ${challengeId} - not awarding points again`);
      } else {
        console.log(`✅ First pass for challenge ${challengeId} - awarding ${actualPointsEarned} points`);
      }
    }

    // Parallelize independent database operations
    console.log('Executing parallel database operations...');
    const [
      { data: challenge, error: challengeFetchError },
      { data: submission, error: submissionError }
    ] = await Promise.all([
      // Fetch challenge details
      supabase
        .from('challenges')
        .select('points, tier, order_in_tier')
        .eq('id', challengeId)
        .single(),

      // Create submission
      supabase
        .from('submissions')
        .insert({
          user_id: user.id,
          challenge_id: challengeId,
          code,
          language: language || 'javascript',
          status: passed ? 'passed' : 'failed',
          ai_feedback: JSON.stringify({
            codeQuality,
            improvements,
            ...(suggestions && { suggestions }),
            ...(strengths && { strengths }),
            ...(testResults && { testResults }),
          }),
          score,
          passed_tests: passedTests,
          total_tests: totalTests,
          points_earned: actualPointsEarned, // Will be 0 if not first pass
        })
        .select()
        .single()
    ]);

    if (challengeFetchError) {
      console.error('Challenge fetch error:', challengeFetchError);
      return NextResponse.json(
        { error: 'Failed to fetch challenge details', details: challengeFetchError.message },
        { status: 500 }
      );
    }

    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      );
    }

    if (submissionError) {
      console.error('Submission error:', submissionError);
      return NextResponse.json(
        { error: 'Failed to save submission', details: submissionError.message },
        { status: 500 }
      );
    }

    // Update roadmap progress (non-blocking - fire and forget)
    supabase
      .from('roadmap_progress')
      .upsert(
        {
          user_id: user.id,
          challenge_id: challengeId,
          status: passed ? 'completed' : 'in_progress',
          started_at: new Date().toISOString(),
          completed_at: passed ? new Date().toISOString() : null,
          attempts: 1,
        },
        {
          onConflict: 'user_id,challenge_id',
        }
      )
      .then(({ error }) => {
        if (error) console.error('Progress update error:', error);
      });

    // Check if this completion unlocks a new tier (simplified and faster)
    let tierUnlocked = null;
    let nextChallenge = null;

    if (passed && challenge.tier) {
      try {
        // Parallelize tier unlock queries
        const [
          { data: allChallenges },
          { data: progressData }
        ] = await Promise.all([
          // Only get tier-based challenges from the same tier (optimized)
          supabase
            .from('challenges')
            .select('id, slug, title, tier, order_in_tier')
            .eq('is_active', true)
            .eq('tier', challenge.tier)
            .order('order_in_tier'),

          // Get user progress
          supabase
            .from('roadmap_progress')
            .select('challenge_id, status')
            .eq('user_id', user.id)
        ]);

        if (allChallenges && allChallenges.length > 0) {
          // Find next challenge in tier
          const userProgress = progressData || [];
          const completedIds = new Set(
            userProgress.filter(p => p.status === 'completed').map(p => p.challenge_id)
          );
          completedIds.add(challengeId); // Add current

          const next = allChallenges.find(
            c => c.id !== challengeId && !completedIds.has(c.id) &&
            (c.order_in_tier || 0) > (challenge.order_in_tier || 0)
          );

          if (next) {
            nextChallenge = {
              id: next.id,
              slug: next.slug,
              title: next.title,
            };
          }
        }
      } catch (tierError) {
        // Don't fail submission if tier unlock logic fails
        console.error('Error in tier unlock logic:', tierError);
      }
    }

    console.log('Submission successful! Returning response...');
    return NextResponse.json({
      success: true,
      submission,
      pointsEarned: actualPointsEarned, // Returns 0 if not first pass
      isFirstPass, // Let frontend know if this was first pass
      tierUnlocked,
      nextChallenge,
    });
  } catch (error) {
    console.error('Error submitting challenge:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Failed to submit challenge', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
