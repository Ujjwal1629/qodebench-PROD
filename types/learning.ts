// Types for HTML/CSS Interactive Learning Module

export type QuestionType = 'multiple_choice' | 'true_false' | 'code_completion';
export type QuizDifficulty = 'easy' | 'medium' | 'hard';
export type ChatRole = 'user' | 'assistant';
export type ChatMode = 'explain' | 'example' | 'hint' | 'progress' | 'chat';
export type LessonStatus = 'not_started' | 'in_progress' | 'completed';
export type ContentType = 'video' | 'article' | 'interactive' | 'quiz' | 'challenge';

// Quiz Question Interface
export interface QuizQuestion {
  id: string;
  lesson_id: string;
  question_text: string;
  question_type: QuestionType;
  options?: Record<string, string>; // e.g., { "A": "option1", "B": "option2" }
  correct_answer: string;
  explanation: string;
  code_example?: string | null;
  order_index: number;
  difficulty: QuizDifficulty;
  created_at: string;
  updated_at: string;
}

// Quiz Attempt Interface
export interface QuizAttempt {
  id: string;
  user_id: string;
  lesson_id: string;
  quiz_question_id: string;
  user_answer: string;
  is_correct: boolean;
  attempt_number: number;
  time_taken_seconds?: number | null;
  created_at: string;
}

// Quiz Session Interface
export interface QuizSession {
  id: string;
  user_id: string;
  lesson_id: string;
  total_questions: number;
  correct_answers: number;
  score_percentage: number;
  passed: boolean;
  time_taken_seconds?: number | null;
  completed_at: string;
  created_at: string;
}

// Chat Message Interface
export interface ChatMessage {
  id: string;
  user_id: string;
  lesson_id: string;
  message: string;
  role: ChatRole;
  mode: ChatMode;
  context?: Record<string, any> | null;
  is_off_topic?: boolean | null;
  created_at: string;
}

// Learning Path Interface
export interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  target_role: string[];
  tech_stack: string[];
  estimated_duration_hours: number;
  learning_objectives: string[];
  prerequisites?: string[] | null;
  is_published: boolean;
  order_index: number;
  icon?: string | null;
  created_at: string;
  updated_at: string;
}

// Lesson Interface
export interface Lesson {
  id: string;
  learning_path_id: string;
  title: string;
  description: string;
  content_type: ContentType;
  content: string; // Markdown or JSON content
  duration_minutes: number;
  order_index: number;
  learning_objectives: string[];
  resources?: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

// Lesson Progress Interface
export interface LessonProgress {
  id: string;
  user_id: string;
  learning_path_id: string;
  lesson_id: string;
  status: LessonStatus;
  progress_percentage: number;
  time_spent_minutes: number;
  notes?: string | null;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
}

// Enhanced Lesson with Quiz Data
export interface LessonWithQuiz extends Lesson {
  quiz_questions?: QuizQuestion[];
  has_quiz: boolean;
  quiz_count: number;
}

// User Progress with Quiz Status
export interface UserLessonProgress extends LessonProgress {
  lesson_title: string;
  quiz_passed?: boolean | null;
  latest_quiz_score?: number | null;
  can_access: boolean;
}

// Quiz Submission Request
export interface QuizSubmissionRequest {
  lesson_id: string;
  answers: Array<{
    question_id: string;
    user_answer: string;
  }>;
  time_taken_seconds?: number;
}

// Quiz Submission Response
export interface QuizSubmissionResponse {
  session_id: string;
  total_questions: number;
  correct_answers: number;
  score_percentage: number;
  passed: boolean;
  results: Array<{
    question_id: string;
    question_text: string;
    user_answer: string;
    correct_answer: string;
    is_correct: boolean;
    explanation: string;
  }>;
}

// Chat Request
export interface ChatRequest {
  lesson_id: string;
  message: string;
  mode: ChatMode;
  lesson_context?: string;
}

// Chat Response
export interface ChatResponse {
  message: string;
  mode: ChatMode;
  created_at: string;
}

// AI Question Generation Request
export interface AIQuestionGenerationRequest {
  lesson_content: string;
  difficulty: QuizDifficulty;
  question_type: QuestionType;
  count?: number;
}

// AI Generated Question
export interface AIGeneratedQuestion {
  question: string;
  options?: Record<string, string>;
  correct_answer: string;
  explanation: string;
  difficulty: QuizDifficulty;
}

// Lesson Access Check
export interface LessonAccessCheck {
  can_access: boolean;
  reason?: string;
  required_lesson?: {
    id: string;
    title: string;
    passed: boolean;
  };
}

// Learning Path with Progress
export interface LearningPathWithProgress extends LearningPath {
  lessons: LessonWithQuiz[];
  user_progress?: {
    completed_lessons: number;
    total_lessons: number;
    overall_progress_percentage: number;
  };
}

// Quiz Statistics
export interface QuizStatistics {
  lesson_id: string;
  lesson_title: string;
  total_attempts: number;
  passed_count: number;
  avg_score: number;
  avg_time_seconds: number;
  pass_rate: number;
}

// User Quiz History
export interface UserQuizHistory {
  lesson_id: string;
  lesson_title: string;
  attempts: number;
  best_score: number;
  latest_score: number;
  passed: boolean;
  last_attempt_date: string;
}

// Database Insert Types (partial types for creating new records)
export type QuizQuestionInsert = Omit<QuizQuestion, 'id' | 'created_at' | 'updated_at'>;
export type QuizAttemptInsert = Omit<QuizAttempt, 'id' | 'created_at'>;
export type QuizSessionInsert = Omit<QuizSession, 'id' | 'created_at'>;
export type ChatMessageInsert = Omit<ChatMessage, 'id' | 'created_at'>;
export type LessonProgressInsert = Omit<LessonProgress, 'id' | 'created_at' | 'updated_at'>;

// Database Update Types (all fields optional)
export type QuizQuestionUpdate = Partial<Omit<QuizQuestion, 'id' | 'created_at'>>;
export type LessonProgressUpdate = Partial<Omit<LessonProgress, 'id' | 'user_id' | 'lesson_id' | 'created_at'>>;
