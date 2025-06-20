import { supabase } from "./supabase"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "./supabase"

export interface AuthUser extends User {
  profile?: Profile
}

export class AuthService {
  async signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) throw error

    // Profile will be created automatically by the trigger
    return data
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  }

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    // Get profile
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    return {
      ...user,
      profile: profile || undefined,
    }
  }

  async updateProfile(updates: Partial<Profile>) {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Not authenticated")

    const { data, error } = await supabase.from("profiles").update(updates).eq("id", user.id).select().single()

    if (error) throw error
    return data
  }

  async createAdminUser(email: string, password: string, fullName: string) {
    // This should be called by an existing admin or during initial setup
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        full_name: fullName,
        role: "admin",
      },
    })

    if (error) throw error

    // Update profile role to admin
    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").update({ role: "admin" }).eq("id", data.user.id)

      if (profileError) {
        console.error("Admin profile update error:", profileError)
      }
    }

    return data
  }
}

export const authService = new AuthService()
