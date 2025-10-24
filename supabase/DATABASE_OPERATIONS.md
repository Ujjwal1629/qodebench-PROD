# QodeBench Database Operations Reference

Quick reference for common database operations in the QodeBench application.

## Table of Contents
- [Authentication & Profiles](#authentication--profiles)
- [Challenges](#challenges)
- [Submissions](#submissions)
- [Leaderboard](#leaderboard)
- [Mock Interviews](#mock-interviews)
- [Roadmap Progress](#roadmap-progress)
- [Weekly Challenges](#weekly-challenges)

---

## Authentication & Profiles

### Get Current User Profile
```typescript
import { createClient } from '@/lib/supabase/server';

const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();

if (user) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
}
```

### Update User Profile
```typescript
const { data, error } = await supabase
  .from('profiles')
  .update({
    full_name: 'John Doe',
    bio: 'Full-stack developer',
    experience_level: 'mid'
  })
  .eq('id', userId)
  .select()
  .single();
```

### Get User Stats
```typescript
const { data: profile } = await supabase
  .from('profiles')
  .select('total_points, weekly_points, current_streak, challenges_completed')
  .eq('id', userId)
  .single();
```

---

## Challenges

### Get All Active Challenges
```typescript
const { data: challenges } = await supabase
  .from('challenges')
  .select('*')
  .eq('is_active', true)
  .order('created_at', { ascending: false });
```

### Get Challenges by Category
```typescript
const { data: challenges } = await supabase
  .from('challenges')
  .select('*')
  .eq('category', 'javascript')
  .eq('is_active', true)
  .order('difficulty');
```

### Get Challenge by Slug
```typescript
const { data: challenge } = await supabase
  .from('challenges')
  .select('*')
  .eq('slug', 'two-sum')
  .single();
```

### Get Challenge with User Progress
```typescript
const { data: challenge } = await supabase
  .from('challenges')
  .select(`
    *,
    roadmap_progress!inner(
      status,
      attempts,
      completed_at
    )
  `)
  .eq('id', challengeId)
  .eq('roadmap_progress.user_id', userId)
  .single();
```

### Get Current Weekly Challenge
```typescript
const { data: weeklyChallenge } = await supabase
  .from('challenges')
  .select('*')
  .eq('is_weekly_challenge', true)
  .eq('weekly_challenge_date', new Date().toISOString().split('T')[0])
  .single();
```

### Create New Challenge (Admin)
```typescript
const { data: challenge } = await supabase
  .from('challenges')
  .insert({
    title: 'New Challenge',
    slug: 'new-challenge',
    description: 'Challenge description...',
    difficulty: 'medium',
    category: 'javascript',
    points: 200,
    starter_code: {
      javascript: 'function solution() {\n  // Your code here\n}'
    },
    test_cases: [
      {
        input: { nums: [1, 2, 3] },
        expected: 6,
        description: 'Sum of array'
      }
    ],
    hints: ['Hint 1', 'Hint 2'],
    learning_objectives: ['Arrays', 'Loops'],
    estimated_time: 20,
    created_by: userId
  })
  .select()
  .single();
```

---

## Submissions

### Submit Code
```typescript
const { data: submission } = await supabase
  .from('submissions')
  .insert({
    user_id: userId,
    challenge_id: challengeId,
    code: userCode,
    language: 'javascript',
    status: 'pending',
    total_tests: 3,
    passed_tests: 0,
    points_earned: 0
  })
  .select()
  .single();
```

### Update Submission with Results
```typescript
const { data: submission } = await supabase
  .from('submissions')
  .update({
    status: 'passed',
    passed_tests: 3,
    total_tests: 3,
    score: 100,
    execution_time_ms: 45,
    points_earned: 200,
    ai_feedback: 'Great solution! Clean and efficient code.'
  })
  .eq('id', submissionId)
  .select()
  .single();

// Note: update_user_points() trigger will automatically:
// - Update profile points
// - Update leaderboard entry
// - Update roadmap progress
// - Update weekly challenge best score (if applicable)
```

### Get User Submissions for Challenge
```typescript
const { data: submissions } = await supabase
  .from('submissions')
  .select('*')
  .eq('user_id', userId)
  .eq('challenge_id', challengeId)
  .order('submitted_at', { ascending: false });
```

### Get User's Recent Submissions
```typescript
const { data: submissions } = await supabase
  .from('submissions')
  .select(`
    *,
    challenges (
      title,
      difficulty,
      category
    )
  `)
  .eq('user_id', userId)
  .order('submitted_at', { ascending: false })
  .limit(10);
```

### Get Submission Statistics
```typescript
const { data: stats } = await supabase
  .from('submissions')
  .select('status, passed_tests, total_tests')
  .eq('user_id', userId)
  .eq('challenge_id', challengeId);

const totalAttempts = stats?.length || 0;
const passedAttempts = stats?.filter(s => s.status === 'passed').length || 0;
const successRate = totalAttempts > 0 ? (passedAttempts / totalAttempts) * 100 : 0;
```

---

## Leaderboard

### Get Global Leaderboard (Top 100)
```typescript
const { data: leaderboard } = await supabase
  .from('leaderboard_entries')
  .select(`
    *,
    profiles (
      username,
      full_name,
      avatar_url,
      experience_level
    )
  `)
  .order('global_rank', { ascending: true })
  .limit(100);
```

### Get Weekly Leaderboard
```typescript
const { data: leaderboard } = await supabase
  .from('leaderboard_entries')
  .select(`
    *,
    profiles (
      username,
      full_name,
      avatar_url
    )
  `)
  .order('weekly_rank', { ascending: true })
  .not('weekly_rank', 'is', null)
  .limit(100);
```

### Get User's Leaderboard Position
```typescript
const { data: entry } = await supabase
  .from('leaderboard_entries')
  .select('global_rank, weekly_rank, total_points, weekly_points')
  .eq('user_id', userId)
  .single();
```

### Manually Update Leaderboard (if needed)
```typescript
const { data } = await supabase.rpc('update_leaderboard');
```

---

## Mock Interviews

### Create Mock Interview Session
```typescript
const { data: interview } = await supabase
  .from('mock_interviews')
  .insert({
    user_id: userId,
    interview_type: 'technical',
    difficulty: 'mid',
    transcript: [],
    questions_asked: []
  })
  .select()
  .single();
```

### Update Interview Transcript
```typescript
const { data: interview } = await supabase
  .from('mock_interviews')
  .update({
    transcript: [
      ...existingTranscript,
      {
        role: 'candidate',
        message: 'My answer is...',
        timestamp: new Date().toISOString()
      }
    ]
  })
  .eq('id', interviewId)
  .select()
  .single();
```

### Complete Interview with AI Evaluation
```typescript
const { data: interview } = await supabase
  .from('mock_interviews')
  .update({
    completed_at: new Date().toISOString(),
    duration_minutes: 30,
    overall_score: 85,
    ai_evaluation: {
      overall_score: 85,
      strengths: ['Clear communication', 'Good technical depth'],
      improvements: ['More concrete examples needed'],
      detailed_feedback: 'Overall strong performance...'
    }
  })
  .eq('id', interviewId)
  .select()
  .single();
```

### Get User's Interview History
```typescript
const { data: interviews } = await supabase
  .from('mock_interviews')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false });
```

---

## Roadmap Progress

### Get User's Learning Roadmap
```typescript
const { data: progress } = await supabase
  .from('roadmap_progress')
  .select(`
    *,
    challenges (
      id,
      title,
      difficulty,
      category,
      points,
      estimated_time
    )
  `)
  .eq('user_id', userId)
  .order('started_at', { ascending: false });
```

### Start a Challenge
```typescript
const { data: progress } = await supabase
  .from('roadmap_progress')
  .insert({
    user_id: userId,
    challenge_id: challengeId,
    status: 'in_progress',
    started_at: new Date().toISOString(),
    attempts: 1
  })
  .select()
  .single();
```

### Get Progress Statistics
```typescript
const { data: stats } = await supabase
  .from('roadmap_progress')
  .select('status')
  .eq('user_id', userId);

const completed = stats?.filter(s => s.status === 'completed').length || 0;
const inProgress = stats?.filter(s => s.status === 'in_progress').length || 0;
const total = stats?.length || 0;
```

---

## Weekly Challenges

### Join Weekly Challenge
```typescript
const weekStartDate = new Date();
weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay()); // Get Monday
const weekStart = weekStartDate.toISOString().split('T')[0];

const { data: participant } = await supabase
  .from('weekly_challenge_participants')
  .insert({
    user_id: userId,
    challenge_id: challengeId,
    week_start_date: weekStart
  })
  .select()
  .single();
```

### Get Weekly Challenge Leaderboard
```typescript
const weekStartDate = new Date();
weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay());
const weekStart = weekStartDate.toISOString().split('T')[0];

const { data: leaderboard } = await supabase
  .from('weekly_challenge_participants')
  .select(`
    *,
    profiles (
      username,
      full_name,
      avatar_url
    ),
    challenges (
      title
    )
  `)
  .eq('week_start_date', weekStart)
  .order('rank', { ascending: true })
  .limit(100);
```

### Get User's Weekly Challenge Position
```typescript
const { data: position } = await supabase
  .from('weekly_challenge_participants')
  .select('rank, best_score')
  .eq('user_id', userId)
  .eq('challenge_id', challengeId)
  .eq('week_start_date', weekStart)
  .single();
```

---

## Utility Functions

### Get User Streak Data
```typescript
const { data: profile } = await supabase
  .from('profiles')
  .select('current_streak, longest_streak')
  .eq('id', userId)
  .single();
```

### Reset Weekly Points (Admin/Cron)
```typescript
const { data } = await supabase.rpc('reset_weekly_points');
```

### Reset Monthly Points (Admin/Cron)
```typescript
const { data } = await supabase.rpc('reset_monthly_points');
```

### Update User Streaks (Admin/Cron)
```typescript
const { data } = await supabase.rpc('update_user_streak');
```

---

## Error Handling

Always handle errors properly:

```typescript
const { data, error } = await supabase
  .from('table')
  .select('*');

if (error) {
  console.error('Database error:', error);
  // Handle error appropriately
  return { error: error.message };
}

// Use data
return { data };
```

## Real-time Subscriptions

### Subscribe to Leaderboard Updates
```typescript
const channel = supabase
  .channel('leaderboard-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'leaderboard_entries'
    },
    (payload) => {
      console.log('Leaderboard updated:', payload);
      // Refresh leaderboard UI
    }
  )
  .subscribe();

// Cleanup
return () => {
  supabase.removeChannel(channel);
};
```

### Subscribe to User Profile Changes
```typescript
const channel = supabase
  .channel(`profile-${userId}`)
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'profiles',
      filter: `id=eq.${userId}`
    },
    (payload) => {
      console.log('Profile updated:', payload.new);
      // Update UI
    }
  )
  .subscribe();
```

---

## Performance Tips

1. **Use selective queries**: Only fetch columns you need
   ```typescript
   .select('id, title, difficulty') // Good
   .select('*') // Use only when necessary
   ```

2. **Leverage indexes**: Queries on indexed columns are faster
   - All foreign keys are indexed
   - Common query patterns have indexes

3. **Batch operations**: Use `upsert` for bulk updates
   ```typescript
   await supabase
     .from('table')
     .upsert([item1, item2, item3]);
   ```

4. **Use RPC for complex queries**: Create custom functions for complex operations

5. **Cache frequent queries**: Use React Query or SWR for caching

---

## Next Steps

- Review [Database Schema](./migrations/001_initial_schema.sql)
- Check [TypeScript Types](../lib/supabase/database.types.ts)
- Read [Migration README](./migrations/README.md)
- Test operations in your application
