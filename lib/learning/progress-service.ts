import { createClient } from '@/lib/supabase/server';
import { Lesson, LessonAccessCheck } from '@/types/learning';
import { QuizService } from '@/lib/quiz/quiz-service';

export class ProgressService {
  /**
   * Check if a user can access a specific lesson
   * First lesson is always accessible, others require previous lesson completion
   */
  static async canAccessLesson(
    userId: string,
    lessonId: string
  ): Promise<LessonAccessCheck> {
    const supabase = await createClient();

    // Get current lesson details
    const { data: currentLesson, error } = await supabase
      .from('ai_learning_lessons')
      .select('*')
      .eq('id', lessonId)
      .single();

    if (error || !currentLesson) {
      return {
        can_access: false,
        reason: 'Lesson not found',
      };
    }

    // First lesson is always accessible
    if (currentLesson.order_index === 1) {
      return {
        can_access: true,
      };
    }

    // Get previous lesson
    const previousOrder = currentLesson.order_index - 1;
    const { data: previousLesson } = await supabase
      .from('ai_learning_lessons')
      .select('*')
      .eq('learning_path_id', currentLesson.learning_path_id)
      .eq('order_index', previousOrder)
      .single();

    if (!previousLesson) {
      return {
        can_access: false,
        reason: 'Previous lesson not found',
      };
    }

    // Check if previous lesson quiz was passed
    const hasPassed = await QuizService.hasPassedQuiz(userId, previousLesson.id);

    if (!hasPassed) {
      return {
        can_access: false,
        reason: 'You must complete the previous lesson to unlock this one',
        required_lesson: {
          id: previousLesson.id,
          title: previousLesson.title,
          passed: false,
        },
      };
    }

    return {
      can_access: true,
    };
  }

  /**
   * Get all lessons for a learning path with access status
   */
  static async getLessonsWithAccess(
    userId: string,
    learningPathId: string
  ): Promise<
    Array<
      Lesson & {
        can_access: boolean;
        is_completed: boolean;
        quiz_passed: boolean;
        latest_score?: number;
      }
    >
  > {
    const supabase = await createClient();

    // Get all lessons for the path
    const { data: lessons, error } = await supabase
      .from('ai_learning_lessons')
      .select('*')
      .eq('learning_path_id', learningPathId)
      .order('order_index', { ascending: true });

    if (error || !lessons) {
      return [];
    }

    // Check access and completion status for each lesson
    const lessonsWithStatus = await Promise.all(
      lessons.map(async (lesson) => {
        const accessCheck = await this.canAccessLesson(userId, lesson.id);
        const quizScore = await QuizService.getLatestQuizScore(userId, lesson.id);

        return {
          ...lesson,
          can_access: accessCheck.can_access,
          is_completed: quizScore?.passed || false,
          quiz_passed: quizScore?.passed || false,
          latest_score: quizScore?.score_percentage,
        };
      })
    );

    return lessonsWithStatus;
  }

  /**
   * Get user's overall progress for a learning path
   */
  static async getLearningPathProgress(userId: string, learningPathId: string) {
    const supabase = await createClient();

    // Get all lessons in the path
    const { data: lessons } = await supabase
      .from('ai_learning_lessons')
      .select('id')
      .eq('learning_path_id', learningPathId);

    if (!lessons || lessons.length === 0) {
      return {
        total_lessons: 0,
        completed_lessons: 0,
        progress_percentage: 0,
      };
    }

    // Count completed lessons (passed quizzes)
    const completionChecks = await Promise.all(
      lessons.map((lesson) => QuizService.hasPassedQuiz(userId, lesson.id))
    );

    const completedCount = completionChecks.filter((passed) => passed).length;
    const progressPercentage = Math.round((completedCount / lessons.length) * 100);

    return {
      total_lessons: lessons.length,
      completed_lessons: completedCount,
      progress_percentage: progressPercentage,
    };
  }

  /**
   * Get next available lesson for user
   */
  static async getNextLesson(
    userId: string,
    currentLessonId: string
  ): Promise<Lesson | null> {
    const supabase = await createClient();

    // Get current lesson
    const { data: currentLesson } = await supabase
      .from('ai_learning_lessons')
      .select('*')
      .eq('id', currentLessonId)
      .single();

    if (!currentLesson) return null;

    // Get next lesson in sequence
    const { data: nextLesson } = await supabase
      .from('ai_learning_lessons')
      .select('*')
      .eq('learning_path_id', currentLesson.learning_path_id)
      .eq('order_index', currentLesson.order_index + 1)
      .single();

    // Return next lesson if it exists in sequence
    // Access check will be performed when user tries to navigate to it
    return nextLesson ? (nextLesson as Lesson) : null;
  }

  /**
   * Mark lesson as started (in progress)
   */
  static async markLessonAsStarted(userId: string, lessonId: string): Promise<void> {
    const supabase = await createClient();

    // Get lesson details
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

    if (!existingProgress) {
      // Create new progress record
      await supabase.from('ai_learning_progress').insert({
        user_id: userId,
        learning_path_id: lesson.learning_path_id,
        lesson_id: lessonId,
        status: 'in_progress',
        progress_percentage: 0,
      });
    }
  }
}
