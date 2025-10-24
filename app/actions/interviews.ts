'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Types
export interface InterviewSession {
  id: string;
  user_id: string;
  interview_type: 'behavioral' | 'technical' | 'system_design' | 'frontend';
  company: 'google' | 'amazon' | 'meta' | 'microsoft' | 'netflix' | 'apple' | 'general';
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'in_progress' | 'completed' | 'abandoned';
  started_at: string;
  completed_at?: string;
  duration_seconds?: number;
  overall_score?: number;
  communication_score?: number;
  technical_score?: number;
  problem_solving_score?: number;
  transcript?: TranscriptEntry[];
  ai_feedback?: any;
  questions_answered: number;
  hints_used: number;
}

export interface TranscriptEntry {
  role: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export interface InterviewQuestion {
  id: string;
  type: 'behavioral' | 'technical' | 'system_design' | 'frontend';
  company: 'google' | 'amazon' | 'meta' | 'microsoft' | 'netflix' | 'apple' | 'general';
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  question_text: string;
  context?: string;
  expected_approach?: string;
  sample_answer?: string;
  follow_up_questions?: string[];
  tags?: string[];
  estimated_time_minutes: number;
}

// =====================================================
// 1. START INTERVIEW
// =====================================================
export async function startInterview(params: {
  interview_type: InterviewSession['interview_type'];
  company?: InterviewSession['company'];
  difficulty?: InterviewSession['difficulty'];
}) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { interview_type, company = 'general', difficulty = 'medium' } = params;

  // Create interview session
  const { data: session, error: sessionError } = await supabase
    .from('interview_sessions')
    .insert({
      user_id: user.id,
      interview_type,
      company,
      difficulty,
      status: 'in_progress',
      transcript: [],
    })
    .select()
    .single();

  if (sessionError) {
    console.error('Error creating interview session:', sessionError);
    return { error: 'Failed to start interview' };
  }

  revalidatePath('/dashboard/interviews');
  return { data: session };
}

// =====================================================
// 2. GET CURRENT QUESTION
// =====================================================
export async function getCurrentQuestion(sessionId: string) {
  const supabase = await createClient();

  // Get session details
  const { data: session, error: sessionError } = await supabase
    .from('interview_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (sessionError || !session) {
    return { error: 'Session not found' };
  }

  // Get already answered questions
  const { data: answered } = await supabase
    .from('interview_responses')
    .select('question_id')
    .eq('session_id', sessionId);

  const answeredIds = answered?.map((a) => a.question_id) || [];

  // Get a random question matching session criteria, excluding already answered
  const { data: questions, error: questionError } = await supabase
    .from('interview_questions')
    .select('*')
    .eq('type', session.interview_type)
    .eq('difficulty', session.difficulty)
    .eq('is_active', true)
    .not('id', 'in', answeredIds.length > 0 ? `(${answeredIds.join(',')})` : '(00000000-0000-0000-0000-000000000000)');

  if (questionError || !questions || questions.length === 0) {
    return { error: 'No more questions available' };
  }

  // Optionally filter by company (if not general)
  let filteredQuestions = questions;
  if (session.company !== 'general') {
    const companyQuestions = questions.filter((q) => q.company === session.company);
    if (companyQuestions.length > 0) {
      filteredQuestions = companyQuestions;
    }
  }

  // Pick random question
  const randomQuestion = filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];

  return { data: randomQuestion };
}

// =====================================================
// 3. SUBMIT ANSWER
// =====================================================
export async function submitAnswer(params: {
  sessionId: string;
  questionId: string;
  userAnswer: string;
  responseTimeSeconds: number;
}) {
  const supabase = await createClient();

  const { sessionId, questionId, userAnswer, responseTimeSeconds } = params;

  // Get session and question details
  const { data: session } = await supabase
    .from('interview_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  const { data: question } = await supabase
    .from('interview_questions')
    .select('*')
    .eq('id', questionId)
    .single();

  if (!session || !question) {
    return { error: 'Session or question not found' };
  }

  // Count hints used for this question
  const { data: hints } = await supabase
    .from('interview_hints')
    .select('id')
    .eq('session_id', sessionId)
    .eq('question_id', questionId);

  const hintsUsed = hints?.length || 0;

  // Store response (evaluation will be done via API route with AI)
  const { data: response, error: responseError } = await supabase
    .from('interview_responses')
    .insert({
      session_id: sessionId,
      question_id: questionId,
      user_answer: userAnswer,
      response_time_seconds: responseTimeSeconds,
      hints_used: hintsUsed,
    })
    .select()
    .single();

  if (responseError) {
    console.error('Error saving response:', responseError);
    return { error: 'Failed to save answer' };
  }

  // Update session: increment questions_answered
  await supabase
    .from('interview_sessions')
    .update({
      questions_answered: session.questions_answered + 1,
    })
    .eq('id', sessionId);

  // Update transcript
  const currentTranscript = (session.transcript as TranscriptEntry[]) || [];
  const updatedTranscript = [
    ...currentTranscript,
    {
      role: 'user' as const,
      text: userAnswer,
      timestamp: new Date().toISOString(),
    },
  ];

  await supabase
    .from('interview_sessions')
    .update({ transcript: updatedTranscript })
    .eq('id', sessionId);

  return { data: response };
}

// =====================================================
// 4. GET HINT
// =====================================================
export async function getHint(params: { sessionId: string; questionId: string; hintLevel: number }) {
  const supabase = await createClient();

  const { sessionId, questionId, hintLevel } = params;

  // Check if hint already revealed
  const { data: existingHint } = await supabase
    .from('interview_hints')
    .select('*')
    .eq('session_id', sessionId)
    .eq('question_id', questionId)
    .eq('hint_level', hintLevel)
    .single();

  if (existingHint) {
    return { data: existingHint };
  }

  // Fetch question details to generate meaningful hints
  const { data: question } = await supabase
    .from('interview_questions')
    .select('*')
    .eq('id', questionId)
    .single();

  if (!question) {
    return { error: 'Question not found' };
  }

  // Generate meaningful hint based on question data and level
  let hintText = '';

  if (hintLevel === 1) {
    // Level 1: General direction based on category and tags
    const category = question.category || 'this topic';
    const tags = question.tags || [];
    const tagHint = tags.length > 0 ? ` Consider concepts like ${tags.slice(0, 2).join(' and ')}.` : '';

    if (question.type === 'behavioral') {
      hintText = `For this ${category} question, think about using the STAR method (Situation, Task, Action, Result).${tagHint}`;
    } else if (question.type === 'technical') {
      hintText = `This is a ${category} problem.${tagHint} What data structure or algorithm could be most efficient here?`;
    } else if (question.type === 'system_design') {
      hintText = `Consider the key components needed for ${category}.${tagHint} Think about scalability, reliability, and performance.`;
    } else if (question.type === 'frontend') {
      hintText = `This ${category} question is about React fundamentals.${tagHint} What built-in hooks or patterns could help?`;
    }
  } else if (hintLevel === 2) {
    // Level 2: Part of the expected approach
    const expectedApproach = question.expected_approach || '';
    if (expectedApproach) {
      // Take first sentence or first 100 characters as a medium hint
      const sentences = expectedApproach.split('.').filter((s: string) => s.trim());
      hintText = sentences[0] ? sentences[0].trim() + '.' : expectedApproach.substring(0, 100) + '...';
    } else {
      hintText = 'Think about the most efficient approach. What would be the time and space complexity?';
    }
  } else if (hintLevel === 3) {
    // Level 3: More detailed guidance from expected approach or context
    const expectedApproach = question.expected_approach || '';
    const context = question.context || '';

    if (expectedApproach) {
      hintText = expectedApproach;
    } else if (context) {
      hintText = `Key consideration: ${context}`;
    } else {
      hintText = 'Review the question carefully and consider edge cases. What is the optimal solution?';
    }
  }

  // Fallback if hint generation failed
  if (!hintText) {
    hintText = 'Take a step back and reconsider your approach. What are you missing?';
  }

  // Save hint
  const { data: hint, error } = await supabase
    .from('interview_hints')
    .insert({
      session_id: sessionId,
      question_id: questionId,
      hint_level: hintLevel,
      hint_text: hintText,
    })
    .select()
    .single();

  if (error) {
    return { error: 'Failed to get hint' };
  }

  // Update session hints_used count
  const { data: session } = await supabase
    .from('interview_sessions')
    .select('hints_used')
    .eq('id', sessionId)
    .single();

  if (session) {
    await supabase
      .from('interview_sessions')
      .update({ hints_used: session.hints_used + 1 })
      .eq('id', sessionId);
  }

  return { data: hint };
}

// =====================================================
// 5. COMPLETE INTERVIEW
// =====================================================
export async function completeInterview(sessionId: string) {
  const supabase = await createClient();

  // Get all responses for scoring
  const { data: responses } = await supabase
    .from('interview_responses')
    .select('*, interview_questions(*)')
    .eq('session_id', sessionId);

  if (!responses || responses.length === 0) {
    return { error: 'No responses found' };
  }

  // Calculate average scores (these would come from AI evaluation)
  // For now, using placeholder calculation
  const avgQualityScore = responses.reduce((sum, r) => sum + (r.quality_score || 0), 0) / responses.length;

  // Apply hint penalty (5% per hint)
  const { data: session } = await supabase
    .from('interview_sessions')
    .select('hints_used')
    .eq('id', sessionId)
    .single();

  const hintPenalty = (session?.hints_used || 0) * 0.05;
  const adjustedScore = Math.max(0, avgQualityScore * (1 - hintPenalty));

  // Update session with completion data
  const { error: updateError } = await supabase
    .from('interview_sessions')
    .update({
      status: 'completed',
      overall_score: adjustedScore,
      communication_score: avgQualityScore * 0.9, // Placeholder
      technical_score: avgQualityScore * 1.1, // Placeholder
      problem_solving_score: avgQualityScore, // Placeholder
    })
    .eq('id', sessionId);

  if (updateError) {
    return { error: 'Failed to complete interview' };
  }

  revalidatePath('/dashboard/interviews');
  return { success: true };
}

// =====================================================
// 6. GET INTERVIEW HISTORY
// =====================================================
export async function getInterviewHistory() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { data: sessions, error } = await supabase
    .from('interview_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('started_at', { ascending: false });

  if (error) {
    return { error: 'Failed to fetch history' };
  }

  return { data: sessions };
}

// =====================================================
// 7. GET INTERVIEW ANALYTICS
// =====================================================
export async function getInterviewAnalytics() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  // Get all completed sessions
  const { data: sessions } = await supabase
    .from('interview_sessions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'completed');

  if (!sessions || sessions.length === 0) {
    return {
      data: {
        totalInterviews: 0,
        averageScore: 0,
        byType: {},
        byDifficulty: {},
        byCompany: {},
        recentTrend: [],
      },
    };
  }

  // Calculate analytics
  const totalInterviews = sessions.length;
  const averageScore =
    sessions.reduce((sum, s) => sum + (s.overall_score || 0), 0) / totalInterviews;

  // Group by type
  const byType: Record<string, { count: number; avgScore: number }> = {};
  sessions.forEach((s) => {
    if (!byType[s.interview_type]) {
      byType[s.interview_type] = { count: 0, avgScore: 0 };
    }
    byType[s.interview_type].count++;
    byType[s.interview_type].avgScore += s.overall_score || 0;
  });

  Object.keys(byType).forEach((type) => {
    byType[type].avgScore = byType[type].avgScore / byType[type].count;
  });

  // Group by difficulty
  const byDifficulty: Record<string, { count: number; avgScore: number }> = {};
  sessions.forEach((s) => {
    if (!byDifficulty[s.difficulty]) {
      byDifficulty[s.difficulty] = { count: 0, avgScore: 0 };
    }
    byDifficulty[s.difficulty].count++;
    byDifficulty[s.difficulty].avgScore += s.overall_score || 0;
  });

  Object.keys(byDifficulty).forEach((diff) => {
    byDifficulty[diff].avgScore = byDifficulty[diff].avgScore / byDifficulty[diff].count;
  });

  // Group by company
  const byCompany: Record<string, { count: number; avgScore: number }> = {};
  sessions.forEach((s) => {
    if (!byCompany[s.company]) {
      byCompany[s.company] = { count: 0, avgScore: 0 };
    }
    byCompany[s.company].count++;
    byCompany[s.company].avgScore += s.overall_score || 0;
  });

  Object.keys(byCompany).forEach((company) => {
    byCompany[company].avgScore = byCompany[company].avgScore / byCompany[company].count;
  });

  // Recent trend (last 10 interviews)
  const recentTrend = sessions
    .slice(0, 10)
    .reverse()
    .map((s) => ({
      date: s.started_at,
      score: s.overall_score || 0,
      type: s.interview_type,
    }));

  return {
    data: {
      totalInterviews,
      averageScore,
      byType,
      byDifficulty,
      byCompany,
      recentTrend,
    },
  };
}

// =====================================================
// 8. GET INTERVIEW SESSION DETAILS
// =====================================================
export async function getInterviewSession(sessionId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { data: session, error } = await supabase
    .from('interview_sessions')
    .select('*')
    .eq('id', sessionId)
    .eq('user_id', user.id)
    .single();

  if (error) {
    return { error: 'Session not found' };
  }

  // Get all responses with questions
  const { data: responses } = await supabase
    .from('interview_responses')
    .select('*, interview_questions(*)')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  return {
    data: {
      session,
      responses: responses || [],
    },
  };
}

// =====================================================
// 9. ABANDON INTERVIEW
// =====================================================
export async function abandonInterview(sessionId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('interview_sessions')
    .update({ status: 'abandoned' })
    .eq('id', sessionId);

  if (error) {
    return { error: 'Failed to abandon interview' };
  }

  revalidatePath('/dashboard/interviews');
  return { success: true };
}

// =====================================================
// 10. ADD AI MESSAGE TO TRANSCRIPT
// =====================================================
export async function addAIMessageToTranscript(sessionId: string, message: string) {
  const supabase = await createClient();

  // Get current transcript
  const { data: session } = await supabase
    .from('interview_sessions')
    .select('transcript')
    .eq('id', sessionId)
    .single();

  if (!session) {
    return { error: 'Session not found' };
  }

  const currentTranscript = (session.transcript as TranscriptEntry[]) || [];
  const updatedTranscript = [
    ...currentTranscript,
    {
      role: 'ai' as const,
      text: message,
      timestamp: new Date().toISOString(),
    },
  ];

  const { error } = await supabase
    .from('interview_sessions')
    .update({ transcript: updatedTranscript })
    .eq('id', sessionId);

  if (error) {
    return { error: 'Failed to add message' };
  }

  return { success: true };
}
