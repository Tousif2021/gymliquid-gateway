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
      bmi_records: {
        Row: {
          bmi: number
          created_at: string | null
          height: number
          id: string
          notes: string | null
          unit_system: string
          user_id: string
          weight: number
        }
        Insert: {
          bmi: number
          created_at?: string | null
          height: number
          id?: string
          notes?: string | null
          unit_system: string
          user_id: string
          weight: number
        }
        Update: {
          bmi?: number
          created_at?: string | null
          height?: number
          id?: string
          notes?: string | null
          unit_system?: string
          user_id?: string
          weight?: number
        }
        Relationships: []
      }
      classes: {
        Row: {
          capacity: number
          created_at: string | null
          description: string | null
          id: string
          instructor_id: string | null
          name: string
          schedule: string
        }
        Insert: {
          capacity?: number
          created_at?: string | null
          description?: string | null
          id?: string
          instructor_id?: string | null
          name: string
          schedule: string
        }
        Update: {
          capacity?: number
          created_at?: string | null
          description?: string | null
          id?: string
          instructor_id?: string | null
          name?: string
          schedule?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          average_visit_duration: number | null
          calories_burned: number | null
          completed_programs: Json | null
          display_name: string | null
          favorite_workout_times: Json | null
          first_name: string | null
          id: string
          last_name: string | null
          last_qr_timestamp: string | null
          last_visit: string | null
          membership_expiry: string | null
          membership_since: string | null
          membership_status: string | null
          membership_type: string | null
          payment_method: Json | null
          phone_number: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          total_visits: number | null
          updated_at: string | null
          visits_this_month: number | null
        }
        Insert: {
          avatar_url?: string | null
          average_visit_duration?: number | null
          calories_burned?: number | null
          completed_programs?: Json | null
          display_name?: string | null
          favorite_workout_times?: Json | null
          first_name?: string | null
          id: string
          last_name?: string | null
          last_qr_timestamp?: string | null
          last_visit?: string | null
          membership_expiry?: string | null
          membership_since?: string | null
          membership_status?: string | null
          membership_type?: string | null
          payment_method?: Json | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          total_visits?: number | null
          updated_at?: string | null
          visits_this_month?: number | null
        }
        Update: {
          avatar_url?: string | null
          average_visit_duration?: number | null
          calories_burned?: number | null
          completed_programs?: Json | null
          display_name?: string | null
          favorite_workout_times?: Json | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          last_qr_timestamp?: string | null
          last_visit?: string | null
          membership_expiry?: string | null
          membership_since?: string | null
          membership_status?: string | null
          membership_type?: string | null
          payment_method?: Json | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          total_visits?: number | null
          updated_at?: string | null
          visits_this_month?: number | null
        }
        Relationships: []
      }
      workout_plans: {
        Row: {
          created_at: string | null
          exercises: Json
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          exercises?: Json
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          exercises?: Json
          id?: string
          name?: string
          user_id?: string
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
      user_role: "member" | "staff"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
