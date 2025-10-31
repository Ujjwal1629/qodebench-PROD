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
   * OPTIMIZED: Uses a single query with JOINs instead of N+1 queries
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

    // Get table prefix for this learning path
    const tablePrefix = QuizService.getTablePrefixByPathId(learningPathId);
    if (!tablePrefix) {
      // Fallback to old behavior if path not found
      return this.getLessonsWithAccessLegacy(userId, learningPathId);
    }

    // OPTIMIZED: Fetch lessons and quiz sessions in parallel (2 queries instead of 70+)
    const [lessonsResult, quizSessionsResult] = await Promise.all([
      // Get all lessons for the path
      supabase
        .from('ai_learning_lessons')
        .select('*')
        .eq('learning_path_id', learningPathId)
        .order('order_index', { ascending: true }),

      // Get all quiz sessions for this user in this learning path
      supabase
        .from(`${tablePrefix}_quiz_sessions` as any)
        .select('lesson_id, score_percentage, passed, completed_at')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
    ]);

    if (lessonsResult.error || !lessonsResult.data) {
      console.error('Error fetching lessons:', lessonsResult.error);
      return [];
    }

    // Create a map of lesson_id -> latest quiz session for quick lookup
    const quizSessionMap = new Map();
    if (quizSessionsResult.data) {
      for (const session of quizSessionsResult.data) {
        // Only store the first (most recent) session for each lesson
        if (!quizSessionMap.has(session.lesson_id)) {
          quizSessionMap.set(session.lesson_id, session);
        }
      }
    }

    // Process lessons and determine access in memory
    const lessonsWithStatus = lessonsResult.data.map((lesson: any, index: number) => {
      // Get the latest quiz session from our map
      const latestQuiz = quizSessionMap.get(lesson.id);

      const quizPassed = latestQuiz?.passed || false;
      const latestScore = latestQuiz?.score_percentage;

      // Determine access: first lesson always accessible, others require previous completion
      let canAccess = false;
      if (lesson.order_index === 1) {
        canAccess = true;
      } else if (index > 0) {
        // Check if previous lesson is completed
        const previousLesson = lessonsResult.data[index - 1] as any;
        const previousQuiz = quizSessionMap.get(previousLesson.id);
        canAccess = previousQuiz?.passed || false;
      }

      return {
        ...lesson,
        can_access: canAccess,
        is_completed: quizPassed,
        quiz_passed: quizPassed,
        latest_score: latestScore,
      };
    });

    return lessonsWithStatus as Array<
      Lesson & {
        can_access: boolean;
        is_completed: boolean;
        quiz_passed: boolean;
        latest_score?: number;
      }
    >;
  }

  /**
   * Legacy implementation (fallback for unknown learning paths)
   */
  private static async getLessonsWithAccessLegacy(
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

    const { data: lessons, error } = await supabase
      .from('ai_learning_lessons')
      .select('*')
      .eq('learning_path_id', learningPathId)
      .order('order_index', { ascending: true });

    if (error || !lessons) {
      return [];
    }

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
   * OPTIMIZED: Uses SQL aggregation instead of N individual queries
   */
  static async getLearningPathProgress(userId: string, learningPathId: string) {
    const supabase = await createClient();

    // Get table prefix for this learning path
    const tablePrefix = QuizService.getTablePrefixByPathId(learningPathId);
    if (!tablePrefix) {
      // Fallback to old behavior if path not found
      return this.getLearningPathProgressLegacy(userId, learningPathId);
    }

    // OPTIMIZED: Fetch data in parallel (2 queries instead of 19+)
    const [lessonsResult, passedQuizzesResult] = await Promise.all([
      // Count total lessons
      supabase
        .from('ai_learning_lessons')
        .select('id', { count: 'exact' })
        .eq('learning_path_id', learningPathId),

      // Get all passed quiz sessions for this user
      supabase
        .from(`${tablePrefix}_quiz_sessions` as any)
        .select('lesson_id')
        .eq('user_id', userId)
        .eq('passed', true)
    ]);

    const totalLessons = lessonsResult.count || 0;

    if (totalLessons === 0) {
      return {
        total_lessons: 0,
        completed_lessons: 0,
        progress_percentage: 0,
      };
    }

    // Count unique lessons that have been passed
    const uniquePassedLessons = new Set(
      passedQuizzesResult.data?.map(session => session.lesson_id) || []
    );
    const completedCount = uniquePassedLessons.size;
    const progressPercentage = Math.round((completedCount / totalLessons) * 100);

    return {
      total_lessons: totalLessons,
      completed_lessons: completedCount,
      progress_percentage: progressPercentage,
    };
  }

  /**
   * Legacy implementation (fallback for unknown learning paths)
   */
  private static async getLearningPathProgressLegacy(
    userId: string,
    learningPathId: string
  ) {
    const supabase = await createClient();

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
