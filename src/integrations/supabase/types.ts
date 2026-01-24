export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      assessments: {
        Row: {
          accept_pay_dip: string | null
          age_band: string | null
          biggest_concern: string | null
          biggest_immediate_need: string | null
          biggest_worries: string[] | null
          completed: boolean | null
          confidence_level: number | null
          created_at: string
          current_job_title: string | null
          current_salary_band: string | null
          current_step: number | null
          desired_timeline: string | null
          digital_comfort_level: number | null
          employment_status: string | null
          existing_proof: string | null
          family_situation: string | null
          financial_runway: string | null
          goal_type: string | null
          highest_qualification: string | null
          id: string
          industry: string | null
          learning_budget: string | null
          learning_style: string | null
          location: string | null
          minimum_salary_needed: number | null
          notice_period_status: string | null
          preferred_entry_route: string | null
          priority_ranking: Json | null
          reason_for_change: string | null
          redundancy_date: string | null
          role_preferences: string[] | null
          stability_vs_growth: number | null
          support_needed: string[] | null
          target_salary: string | null
          tech_interests: string[] | null
          tech_interests_other: string | null
          tools_used: string[] | null
          transferable_strengths: string[] | null
          updated_at: string
          user_id: string
          weekly_hours_available: number | null
          work_preference: string | null
          years_experience: string | null
        }
        Insert: {
          accept_pay_dip?: string | null
          age_band?: string | null
          biggest_concern?: string | null
          biggest_immediate_need?: string | null
          biggest_worries?: string[] | null
          completed?: boolean | null
          confidence_level?: number | null
          created_at?: string
          current_job_title?: string | null
          current_salary_band?: string | null
          current_step?: number | null
          desired_timeline?: string | null
          digital_comfort_level?: number | null
          employment_status?: string | null
          existing_proof?: string | null
          family_situation?: string | null
          financial_runway?: string | null
          goal_type?: string | null
          highest_qualification?: string | null
          id?: string
          industry?: string | null
          learning_budget?: string | null
          learning_style?: string | null
          location?: string | null
          minimum_salary_needed?: number | null
          notice_period_status?: string | null
          preferred_entry_route?: string | null
          priority_ranking?: Json | null
          reason_for_change?: string | null
          redundancy_date?: string | null
          role_preferences?: string[] | null
          stability_vs_growth?: number | null
          support_needed?: string[] | null
          target_salary?: string | null
          tech_interests?: string[] | null
          tech_interests_other?: string | null
          tools_used?: string[] | null
          transferable_strengths?: string[] | null
          updated_at?: string
          user_id: string
          weekly_hours_available?: number | null
          work_preference?: string | null
          years_experience?: string | null
        }
        Update: {
          accept_pay_dip?: string | null
          age_band?: string | null
          biggest_concern?: string | null
          biggest_immediate_need?: string | null
          biggest_worries?: string[] | null
          completed?: boolean | null
          confidence_level?: number | null
          created_at?: string
          current_job_title?: string | null
          current_salary_band?: string | null
          current_step?: number | null
          desired_timeline?: string | null
          digital_comfort_level?: number | null
          employment_status?: string | null
          existing_proof?: string | null
          family_situation?: string | null
          financial_runway?: string | null
          goal_type?: string | null
          highest_qualification?: string | null
          id?: string
          industry?: string | null
          learning_budget?: string | null
          learning_style?: string | null
          location?: string | null
          minimum_salary_needed?: number | null
          notice_period_status?: string | null
          preferred_entry_route?: string | null
          priority_ranking?: Json | null
          reason_for_change?: string | null
          redundancy_date?: string | null
          role_preferences?: string[] | null
          stability_vs_growth?: number | null
          support_needed?: string[] | null
          target_salary?: string | null
          tech_interests?: string[] | null
          tech_interests_other?: string | null
          tools_used?: string[] | null
          transferable_strengths?: string[] | null
          updated_at?: string
          user_id?: string
          weekly_hours_available?: number | null
          work_preference?: string | null
          years_experience?: string | null
        }
        Relationships: []
      }
      jobs: {
        Row: {
          city: string
          company: string
          created_at: string
          description: string | null
          entry_level: string
          id: string
          lat: number | null
          lng: number | null
          posted_date: string | null
          requirements: string[] | null
          salary_max: number | null
          salary_min: number | null
          skills: string[] | null
          source: string | null
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          city: string
          company: string
          created_at?: string
          description?: string | null
          entry_level: string
          id?: string
          lat?: number | null
          lng?: number | null
          posted_date?: string | null
          requirements?: string[] | null
          salary_max?: number | null
          salary_min?: number | null
          skills?: string[] | null
          source?: string | null
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          city?: string
          company?: string
          created_at?: string
          description?: string | null
          entry_level?: string
          id?: string
          lat?: number | null
          lng?: number | null
          posted_date?: string | null
          requirements?: string[] | null
          salary_max?: number | null
          salary_min?: number | null
          skills?: string[] | null
          source?: string | null
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          assessment_completed: boolean | null
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          onboarding_completed: boolean | null
          updated_at: string
        }
        Insert: {
          assessment_completed?: boolean | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          onboarding_completed?: boolean | null
          updated_at?: string
        }
        Update: {
          assessment_completed?: boolean | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          onboarding_completed?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
