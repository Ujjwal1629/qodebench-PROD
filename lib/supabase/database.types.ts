export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string | null
          avatar_url: string | null
          experience_level: 'intern' | 'junior' | 'mid' | 'senior' | null
          bio: string | null
          total_points: number
          weekly_points: number
          current_streak: number
          longest_streak: number
          challenges_completed: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          experience_level?: 'intern' | 'junior' | 'mid' | 'senior' | null
          bio?: string | null
          total_points?: number
          weekly_points?: number
          current_streak?: number
          longest_streak?: number
          challenges_completed?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          experience_level?: 'intern' | 'junior' | 'mid' | 'senior' | null
          bio?: string | null
          total_points?: number
          weekly_points?: number
          current_streak?: number
          longest_streak?: number
          challenges_completed?: number
          created_at?: string
          updated_at?: string
        }
      }
      challenges: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          difficulty: 'easy' | 'medium' | 'hard'
          category: 'office' | 'python' | 'javascript' | 'react' | 'nextjs' | 'nodejs'
          points: number
          starter_code: Json
          test_cases: Json
          hints: Json
          solution_explanation: string | null
          learning_objectives: string[]
          estimated_time: number | null
          is_active: boolean
          is_weekly_challenge: boolean
          weekly_challenge_date: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          difficulty: 'easy' | 'medium' | 'hard'
          category: 'office' | 'python' | 'javascript' | 'react' | 'nextjs' | 'nodejs'
          points: number
          starter_code?: Json
          test_cases?: Json
          hints?: Json
          solution_explanation?: string | null
          learning_objectives?: string[]
          estimated_time?: number | null
          is_active?: boolean
          is_weekly_challenge?: boolean
          weekly_challenge_date?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string | null
          difficulty?: 'easy' | 'medium' | 'hard'
          category?: 'office' | 'python' | 'javascript' | 'react' | 'nextjs' | 'nodejs'
          points?: number
          starter_code?: Json
          test_cases?: Json
          hints?: Json
          solution_explanation?: string | null
          learning_objectives?: string[]
          estimated_time?: number | null
          is_active?: boolean
          is_weekly_challenge?: boolean
          weekly_challenge_date?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      submissions: {
        Row: {
          id: string
          user_id: string
          challenge_id: string
          code: string
          language: string
          status: 'pending' | 'passed' | 'failed' | 'error'
          ai_feedback: string | null
          score: number | null
          execution_time_ms: number | null
          passed_tests: number
          total_tests: number
          points_earned: number
          submitted_at: string
        }
        Insert: {
          id?: string
          user_id: string
          challenge_id: string
          code: string
          language: string
          status: 'pending' | 'passed' | 'failed' | 'error'
          ai_feedback?: string | null
          score?: number | null
          execution_time_ms?: number | null
          passed_tests?: number
          total_tests: number
          points_earned?: number
          submitted_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          challenge_id?: string
          code?: string
          language?: string
          status?: 'pending' | 'passed' | 'failed' | 'error'
          ai_feedback?: string | null
          score?: number | null
          execution_time_ms?: number | null
          passed_tests?: number
          total_tests?: number
          points_earned?: number
          submitted_at?: string
        }
      }
      leaderboard_entries: {
        Row: {
          id: string
          user_id: string
          total_points: number
          weekly_points: number
          monthly_points: number
          global_rank: number | null
          weekly_rank: number | null
          last_submission_at: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_points?: number
          weekly_points?: number
          monthly_points?: number
          global_rank?: number | null
          weekly_rank?: number | null
          last_submission_at?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_points?: number
          weekly_points?: number
          monthly_points?: number
          global_rank?: number | null
          weekly_rank?: number | null
          last_submission_at?: string | null
          updated_at?: string
        }
      }
      mock_interviews: {
        Row: {
          id: string
          user_id: string
          interview_type: 'behavioral' | 'technical' | 'system_design'
          difficulty: 'junior' | 'mid' | 'senior'
          transcript: Json
          questions_asked: Json
          ai_evaluation: Json | null
          duration_minutes: number | null
          overall_score: number | null
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          interview_type: 'behavioral' | 'technical' | 'system_design'
          difficulty: 'junior' | 'mid' | 'senior'
          transcript?: Json
          questions_asked?: Json
          ai_evaluation?: Json | null
          duration_minutes?: number | null
          overall_score?: number | null
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          interview_type?: 'behavioral' | 'technical' | 'system_design'
          difficulty?: 'junior' | 'mid' | 'senior'
          transcript?: Json
          questions_asked?: Json
          ai_evaluation?: Json | null
          duration_minutes?: number | null
          overall_score?: number | null
          completed_at?: string | null
          created_at?: string
        }
      }
      roadmap_progress: {
        Row: {
          id: string
          user_id: string
          challenge_id: string
          status: 'not_started' | 'in_progress' | 'completed'
          started_at: string | null
          completed_at: string | null
          attempts: number
        }
        Insert: {
          id?: string
          user_id: string
          challenge_id: string
          status: 'not_started' | 'in_progress' | 'completed'
          started_at?: string | null
          completed_at?: string | null
          attempts?: number
        }
        Update: {
          id?: string
          user_id?: string
          challenge_id?: string
          status?: 'not_started' | 'in_progress' | 'completed'
          started_at?: string | null
          completed_at?: string | null
          attempts?: number
        }
      }
      weekly_challenge_participants: {
        Row: {
          id: string
          user_id: string
          challenge_id: string
          week_start_date: string
          best_score: number | null
          best_submission_id: string | null
          rank: number | null
          participated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          challenge_id: string
          week_start_date: string
          best_score?: number | null
          best_submission_id?: string | null
          rank?: number | null
          participated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          challenge_id?: string
          week_start_date?: string
          best_score?: number | null
          best_submission_id?: string | null
          rank?: number | null
          participated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_leaderboard: {
        Args: Record<string, never>
        Returns: void
      }
      update_user_streak: {
        Args: Record<string, never>
        Returns: void
      }
      reset_weekly_points: {
        Args: Record<string, never>
        Returns: void
      }
      reset_monthly_points: {
        Args: Record<string, never>
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
