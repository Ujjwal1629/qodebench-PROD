import { createClient } from '@/lib/supabase/server';
import {
  QuizQuestion,
  QuizAttempt,
  QuizSession,
  QuizSubmissionRequest,
  QuizSubmissionResponse,
  QuizAttemptInsert,
  QuizSessionInsert,
} from '@/types/learning';

const PASS_THRESHOLD = 80; // 80% required to pass

// Learning path IDs mapped to table prefixes
const LEARNING_PATH_TABLES: Record<string, string> = {
  'e7f9a1b2-c3d4-5e6f-7a8b-9c0d1e2f3a4b': 'html_css', // HTML & CSS Fundamentals
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890': 'javascript', // JavaScript Essentials
  'd2f2f7f7-c823-4f4a-aa7e-42ab8e061537': 'react_nextjs', // React & Next.js Mastery
  'f5e4d3c2-b1a0-9876-5432-10fedcba9876': 'backend', // Backend & APIs
  'b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d6e': 'office_fundamentals', // Office Fundamentals for Developers
  'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f': 'typescript', // TypeScript Essentials
  'f8a9b0c1-d2e3-4f5a-6b7c-8d9e0f1a2b3c': 'playwright', // Playwright Test Automation
};

export class QuizService {
  /**
   * Get table prefix by learning path ID (no database query needed)
   * OPTIMIZED: Direct lookup from in-memory mapping
   */
  static getTablePrefixByPathId(learningPathId: string): string | null {
    return LEARNING_PATH_TABLES[learningPathId] || null;
  }

  /**
   * Get table prefix for a lesson
   */
  private static async getTablePrefix(lessonId: string): Promise<string> {
    const supabase = await createClient();

    const { data: lesson } = await supabase
      .from('ai_learning_lessons')
      .select('learning_path_id')
      .eq('id', lessonId)
      .single();

    if (!lesson) {
      throw new Error('Lesson not found');
    }

    const prefix = LEARNING_PATH_TABLES[lesson.learning_path_id];
    if (!prefix) {
      throw new Error(`No quiz tables configured for learning path: ${lesson.learning_path_id}`);
    }

    return prefix;
  }

  /**
   * Get all quiz questions for a lesson
   */
  static async getQuestionsForLesson(lessonId: string): Promise<QuizQuestion[]> {
    const supabase = await createClient();

    let tablePrefix: string;
    try {
      tablePrefix = await this.getTablePrefix(lessonId);
    } catch {
      // No quiz tables for this learning path — return empty
      return [];
    }

    const { data, error } = await supabase
      .from(`${tablePrefix}_quiz_questions`)
      .select('*')
      .eq('lesson_id', lessonId)
      .order('order_index', { ascending: true });

    if (error) throw new Error(`Failed to fetch quiz questions: ${error.message}`);
    return (data as QuizQuestion[]) || [];
  }

  /**
   * Validate and score quiz submission
   */
  static async submitQuiz(
    userId: string,
    submission: QuizSubmissionRequest
  ): Promise<QuizSubmissionResponse> {
    const supabase = await createClient();
    const tablePrefix = await this.getTablePrefix(submission.lesson_id);

    // 1. Fetch all questions for the lesson
    const questions = await this.getQuestionsForLesson(submission.lesson_id);

    if (questions.length === 0) {
      throw new Error('No quiz questions found for this lesson');
    }

    // 2. Validate answers and calculate score
    const results = questions.map((question) => {
      const userAnswer =
        submission.answers.find((a) => a.question_id === question.id)?.user_answer || '';
      const isCorrect = this.checkAnswer(userAnswer, question.correct_answer);

      return {
        question_id: question.id,
        question_text: question.question_text,
        user_answer: userAnswer,
        correct_answer: question.correct_answer,
        is_correct: isCorrect,
        explanation: question.explanation,
      };
    });

    const totalQuestions = questions.length;
    const correctAnswers = results.filter((r) => r.is_correct).length;
    const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = scorePercentage >= PASS_THRESHOLD;

    // 3. Save quiz attempts (individual questions)
    const attempts: QuizAttemptInsert[] = results.map((result, index) => ({
      user_id: userId,
      lesson_id: submission.lesson_id,
      quiz_question_id: result.question_id,
      user_answer: result.user_answer,
      is_correct: result.is_correct,
      attempt_number: 1, // TODO: Increment based on previous attempts
      time_taken_seconds: submission.time_taken_seconds
        ? Math.floor(submission.time_taken_seconds / totalQuestions)
        : null,
    }));

    const { error: attemptsError } = await supabase
      .from(`${tablePrefix}_quiz_attempts`)
      .insert(attempts);

    if (attemptsError) {
      console.error('Failed to save quiz attempts:', attemptsError);
    }

    // 4. Save quiz session (overall result)
    const sessionData: QuizSessionInsert = {
      user_id: userId,
      lesson_id: submission.lesson_id,
      total_questions: totalQuestions,
      correct_answers: correctAnswers,
      score_percentage: scorePercentage,
      passed,
      time_taken_seconds: submission.time_taken_seconds || null,
      completed_at: new Date().toISOString(),
    };

    const { data: sessionResult, error: sessionError } = await supabase
      .from(`${tablePrefix}_quiz_sessions`)
      .insert(sessionData)
      .select()
      .single();

    if (sessionError) {
      console.error('Failed to save quiz session:', sessionError);
      throw new Error('Failed to save quiz session');
    }

    // 5. Update lesson progress only if passed
    if (passed) {
      await this.updateLessonProgress(userId, submission.lesson_id);
    }

    return {
      session_id: sessionResult.id,
      total_questions: totalQuestions,
      correct_answers: correctAnswers,
      score_percentage: scorePercentage,
      passed,
      results,
    };
  }

  /**
   * Check if an answer is correct
   */
  private static checkAnswer(userAnswer: string, correctAnswer: string): boolean {
    const normalizedUser = userAnswer.trim().toLowerCase();
    const normalizedCorrect = correctAnswer.trim().toLowerCase();
    return normalizedUser === normalizedCorrect;
  }

  /**
   * Update lesson progress after passing quiz
   */
  private static async updateLessonProgress(userId: string, lessonId: string): Promise<void> {
    const supabase = await createClient();

    // Get lesson details to find learning path
    const { data: lesson } = await supabase
      .from('ai_learning_lessons')
      .select('learning_path_id')
      .eq('id', lessonId)
      .single();

    if (!lesson) return;

    // Check if progress record exists
    const { data: existingProgress } = await supabase
      .from('ai_learning_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .single();

    if (existingProgress) {
      // Update existing progress
      await supabase
        .from('ai_learning_progress')
        .update({
          status: 'completed',
          progress_percentage: 100,
          completed_at: new Date().toISOString(),
        })
        .eq('id', existingProgress.id);
    } else {
      // Create new progress record
      await supabase.from('ai_learning_progress').insert({
        user_id: userId,
        learning_path_id: lesson.learning_path_id,
        lesson_id: lessonId,
        status: 'completed',
        progress_percentage: 100,
        completed_at: new Date().toISOString(),
      });
    }
  }

  /**
   * Get user's latest quiz score for a lesson
   */
  static async getLatestQuizScore(
    userId: string,
    lessonId: string
  ): Promise<QuizSession | null> {
    const supabase = await createClient();
    const tablePrefix = await this.getTablePrefix(lessonId);

    const { data, error } = await supabase
      .from(`${tablePrefix}_quiz_sessions`)
      .select('*')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .order('completed_at', { ascending: false })
      .limit(1)
      .single();

    if (error) return null;
    return data as QuizSession;
  }

  /**
   * Check if user has passed a lesson's quiz
   */
  static async hasPassedQuiz(userId: string, lessonId: string): Promise<boolean> {
    const supabase = await createClient();
    const tablePrefix = await this.getTablePrefix(lessonId);

    const { data } = await supabase
      .from(`${tablePrefix}_quiz_sessions`)
      .select('passed')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .eq('passed', true)
      .limit(1)
      .single();

    return !!data;
  }
}
