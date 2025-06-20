import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface Profile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  role: "user" | "admin"
  learning_language: string
  native_language: string
  xp_points: number
  current_streak: number
  longest_streak: number
  last_activity_date: string
  created_at: string
  updated_at: string
}

export interface Translation {
  id: string
  user_id?: string
  source_text: string
  translated_text: string
  source_language: string
  target_language: string
  created_at: string
}

export interface Lesson {
  id: string
  title: string
  description?: string
  language: string
  difficulty: "beginner" | "intermediate" | "advanced"
  content: any
  order_index: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface UserLessonProgress {
  id: string
  user_id: string
  lesson_id: string
  completed: boolean
  score?: number
  completed_at?: string
  created_at: string
}
