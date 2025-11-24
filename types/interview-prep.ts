// TypeScript types for Interview Prep Module

export type InterviewPrepLevel = 'fresher' | 'experienced';

export type InterviewPrepTopic =
  | 'javascript'
  | 'react'
  | 'node'
  | 'mongodb'
  | 'fullstack'
  | 'system-design';

export type InterviewPrepDifficulty = 'easy' | 'medium' | 'hard';

export interface InterviewPrepQuestion {
  id: string;
  question_text: string;
  level: InterviewPrepLevel;
  topic: InterviewPrepTopic;
  difficulty: InterviewPrepDifficulty;
  model_answer: string;
  key_points: string[];
  tags: string[];
  is_active: boolean;
  created_at: string;
}

export interface InterviewPrepAttempt {
  id: string;
  user_id: string;
  question_id: string;
  user_answer: string;
  ai_feedback: string | null;
  follow_up_question: string | null;
  time_spent_seconds: number;
  completed_at: string;
}

// Frontend display types
export interface TopicInfo {
  topic: InterviewPrepTopic;
  title: string;
  description: string;
  icon: string; // Icon component name
  totalQuestions: number;
  completedQuestions: number;
}

export interface QuestionWithProgress extends InterviewPrepQuestion {
  isAttempted: boolean;
  attemptCount: number;
}

export interface PracticeSession {
  currentQuestionIndex: number;
  questions: InterviewPrepQuestion[];
  startTime: number;
  topic: InterviewPrepTopic;
  level: InterviewPrepLevel;
}

export interface ProgressStats {
  totalAttempted: number;
  byTopic: Record<InterviewPrepTopic, number>;
  byLevel: Record<InterviewPrepLevel, number>;
  byDifficulty: Record<InterviewPrepDifficulty, number>;
  totalTimeSpent: number; // in seconds
  averageTimePerQuestion: number; // in seconds
}

// API request/response types
export interface GetQuestionsParams {
  level?: InterviewPrepLevel;
  topic?: InterviewPrepTopic;
  difficulty?: InterviewPrepDifficulty;
  limit?: number;
  offset?: number;
}

export interface SubmitAnswerRequest {
  questionId: string;
  userAnswer: string;
  timeSpentSeconds: number;
}

export interface SubmitAnswerResponse {
  success: boolean;
  attemptId: string;
  ai_feedback: string;
  follow_up_question: string;
  model_answer: string;
}

export interface GetProgressResponse {
  stats: ProgressStats;
  recentAttempts: InterviewPrepAttempt[];
  topicProgress: Record<InterviewPrepTopic, {
    total: number;
    attempted: number;
    percentage: number;
  }>;
}

// Topic metadata
export const INTERVIEW_TOPICS: Record<InterviewPrepTopic, { title: string; description: string; color: string }> = {
  javascript: {
    title: 'JavaScript',
    description: 'Core JavaScript concepts, ES6+, async patterns',
    color: 'bg-yellow-500'
  },
  react: {
    title: 'React.js',
    description: 'Components, hooks, state management, optimization',
    color: 'bg-blue-500'
  },
  node: {
    title: 'Node.js & Express',
    description: 'Server-side JS, middleware, APIs, authentication',
    color: 'bg-green-500'
  },
  mongodb: {
    title: 'MongoDB',
    description: 'NoSQL database, aggregation, indexing, replication',
    color: 'bg-emerald-600'
  },
  fullstack: {
    title: 'Full Stack',
    description: 'MERN integration, REST APIs, authentication',
    color: 'bg-purple-500'
  },
  'system-design': {
    title: 'System Design',
    description: 'Scalability, architecture patterns, performance',
    color: 'bg-orange-500'
  }
};

// Level metadata
export const INTERVIEW_LEVELS: Record<InterviewPrepLevel, { title: string; description: string; color: string }> = {
  fresher: {
    title: 'Fresher / Intern',
    description: 'Entry-level questions for 0-1 years experience',
    color: 'bg-green-500'
  },
  experienced: {
    title: 'Experienced',
    description: 'Advanced questions for 2+ years experience',
    color: 'bg-orange-500'
  }
};

// Difficulty metadata
export const INTERVIEW_DIFFICULTY: Record<InterviewPrepDifficulty, { color: string; textColor: string }> = {
  easy: {
    color: 'bg-green-100 dark:bg-green-950/30',
    textColor: 'text-green-700 dark:text-green-400'
  },
  medium: {
    color: 'bg-yellow-100 dark:bg-yellow-950/30',
    textColor: 'text-yellow-700 dark:text-yellow-400'
  },
  hard: {
    color: 'bg-red-100 dark:bg-red-950/30',
    textColor: 'text-red-700 dark:text-red-400'
  }
};
