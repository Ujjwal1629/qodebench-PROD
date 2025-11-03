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

    const { passed, score, codeQuality, improvements, suggestions } =
      validationResult;

    // Calculate points based on validation result
    console.log('Fetching challenge details...');
    const { data: challenge, error: challengeFetchError } = await supabase
      .from('challenges')
      .select('points')
      .eq('id', challengeId)
      .single();

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

    const pointsEarned = validationResult.pointsEarned || 0;
    console.log('Creating submission...');

    // Create submission
    const { data: submission, error: submissionError } = await supabase
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
          suggestions,
        }),
        score,
        passed_tests: passed ? 1 : 0,
        total_tests: 1,
        points_earned: pointsEarned,
      })
      .select()
      .single();

    if (submissionError) {
      console.error('Submission error:', submissionError);
      return NextResponse.json(
        { error: 'Failed to save submission', details: submissionError.message },
        { status: 500 }
      );
    }

    console.log('Updating roadmap progress...');
    // Update roadmap progress
    const { error: progressError } = await supabase
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
      );

    if (progressError) {
      console.error('Progress update error:', progressError);
      // Don't fail the whole request if progress update fails
    }

    // Check if this completion unlocks a new tier
    let tierUnlocked = null;
    let nextChallenge = null;

    if (passed) {
      try {
        // Get the completed challenge details
        const { data: completedChallenge, error: challengeError } = await supabase
          .from('challenges')
          .select('tier, order_in_tier')
          .eq('id', challengeId)
          .single();

        if (challengeError) {
          console.error('Error fetching challenge details:', challengeError);
        }

        // Get all challenges and user progress (filter only tier-based challenges)
        const { data: allChallenges, error: allChallengesError } = await supabase
          .from('challenges')
          .select('id, slug, title, tier, order_in_tier, unlock_requirement_type, unlock_requirement_count, previous_challenge_id')
          .eq('is_active', true)
          .not('tier', 'is', null); // Only get challenges with tier information

        if (allChallengesError) {
          console.error('Error fetching all challenges:', allChallengesError);
        }

        const { data: progressData, error: progressError } = await supabase
          .from('roadmap_progress')
          .select('challenge_id, status')
          .eq('user_id', user.id);

        if (progressError) {
          console.error('Error fetching progress data:', progressError);
        }

        // Only proceed with tier unlock logic if we have tier information for this challenge
        if (completedChallenge?.tier && allChallenges && allChallenges.length > 0) {
          // Dynamically import unlock utilities to avoid circular dependencies
          const { checkTierUnlock, getNextChallengeInTier } = await import('@/lib/utils/challenge-unlock');

          const userProgress = progressData || [];

          // Check for tier unlock
          const unlockResult = checkTierUnlock(
            { ...completedChallenge, id: challengeId } as any,
            allChallenges as any,
            userProgress as any
          );

          if (unlockResult.tierUnlocked) {
            tierUnlocked = unlockResult.tierUnlocked;
          }

          // Get next challenge in current tier
          const next = getNextChallengeInTier(
            completedChallenge.tier as any,
            allChallenges as any,
            [
              ...userProgress,
              { challenge_id: challengeId, status: 'completed' as const },
            ] as any
          );

          if (next) {
            nextChallenge = {
              id: next.id,
              slug: next.slug,
              title: next.title,
            };
          }
        } else {
          console.log('Challenge does not have tier information, skipping tier unlock logic');
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
      pointsEarned,
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
