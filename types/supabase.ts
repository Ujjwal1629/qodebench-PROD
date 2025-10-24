export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Updated to match new schema - lowercase values
export type ExperienceLevel = 'intern' | 'junior' | 'mid' | 'senior';

// Re-export all types from the comprehensive database types
export * from '@/lib/supabase/database.types';

// Legacy compatibility - map old names to new types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string | null;
          avatar_url: string | null;
          experience_level: ExperienceLevel | null;
          bio: string | null;
          total_points: number;
          weekly_points: number;
          current_streak: number;
          longest_streak: number;
          challenges_completed: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          full_name?: string | null;
          avatar_url?: string | null;
          experience_level?: ExperienceLevel | null;
          bio?: string | null;
          total_points?: number;
          weekly_points?: number;
          current_streak?: number;
          longest_streak?: number;
          challenges_completed?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          experience_level?: ExperienceLevel | null;
          bio?: string | null;
          total_points?: number;
          weekly_points?: number;
          current_streak?: number;
          longest_streak?: number;
          challenges_completed?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      experience_level: ExperienceLevel;
    };
  };
}
