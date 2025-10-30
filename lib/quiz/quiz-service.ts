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

export class QuizService {
  /**
   * Get all quiz questions for a lesson
   */
  static async getQuestionsForLesson(lessonId: string): Promise<QuizQuestion[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('html_css_quiz_questions')
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
      .from('html_css_quiz_attempts')
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
      .from('html_css_quiz_sessions')
      .insert(sessionData)
      .select()
      .single();

    if (sessionError) {
      console.error('Failed to save quiz session:', sessionError);
      throw new Error('Failed to save quiz session');
    }

    // 5. Update lesson progress (allow continuation regardless of score)
    await this.updateLessonProgress(userId, submission.lesson_id);

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

    const { data, error } = await supabase
      .from('html_css_quiz_sessions')
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

    const { data } = await supabase
      .from('html_css_quiz_sessions')
      .select('passed')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .eq('passed', true)
      .limit(1)
      .single();

    return !!data;
  }
}
