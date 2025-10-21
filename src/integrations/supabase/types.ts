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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      contact_messages: {
        Row: {
          email: string
          id: string
          is_read: boolean
          message: string
          name: string
          phone: string | null
          read_at: string | null
          submitted_at: string
        }
        Insert: {
          email: string
          id?: string
          is_read?: boolean
          message: string
          name: string
          phone?: string | null
          read_at?: string | null
          submitted_at?: string
        }
        Update: {
          email?: string
          id?: string
          is_read?: boolean
          message?: string
          name?: string
          phone?: string | null
          read_at?: string | null
          submitted_at?: string
        }
        Relationships: []
      }
      event_rsvps: {
        Row: {
          created_at: string
          email: string
          event_id: string
          full_name: string
          id: string
          phone_number: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          event_id: string
          full_name: string
          id?: string
          phone_number?: string | null
          status?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          event_id?: string
          full_name?: string
          id?: string
          phone_number?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          created_by: string | null
          description: string
          event_date: string
          id: string
          image_url: string | null
          location: string
          max_attendees: number | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description: string
          event_date: string
          id?: string
          image_url?: string | null
          location: string
          max_attendees?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string
          event_date?: string
          id?: string
          image_url?: string | null
          location?: string
          max_attendees?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      join_applications: {
        Row: {
          business_name: string
          business_type: string
          contact_address: string
          email: string | null
          full_name: string
          id: string
          membership_plan: Database["public"]["Enums"]["membership_plan"]
          next_of_kin: string
          payment_evidence_url: string | null
          phone_number: string
          photo_url: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["application_status"]
          submitted_at: string
          why_join: string
        }
        Insert: {
          business_name: string
          business_type: string
          contact_address: string
          email?: string | null
          full_name: string
          id?: string
          membership_plan: Database["public"]["Enums"]["membership_plan"]
          next_of_kin: string
          payment_evidence_url?: string | null
          phone_number: string
          photo_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          submitted_at?: string
          why_join: string
        }
        Update: {
          business_name?: string
          business_type?: string
          contact_address?: string
          email?: string | null
          full_name?: string
          id?: string
          membership_plan?: Database["public"]["Enums"]["membership_plan"]
          next_of_kin?: string
          payment_evidence_url?: string | null
          phone_number?: string
          photo_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          submitted_at?: string
          why_join?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          email: string
          full_name: string | null
          id: string
          is_active: boolean
          subscribed_at: string
        }
        Insert: {
          email: string
          full_name?: string | null
          id?: string
          is_active?: boolean
          subscribed_at?: string
        }
        Update: {
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean
          subscribed_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          business_name: string | null
          business_type: string | null
          contact_address: string | null
          created_at: string
          full_name: string
          id: string
          next_of_kin: string | null
          phone_number: string | null
          photo_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          business_name?: string | null
          business_type?: string | null
          contact_address?: string | null
          created_at?: string
          full_name: string
          id?: string
          next_of_kin?: string | null
          phone_number?: string | null
          photo_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          business_name?: string | null
          business_type?: string | null
          contact_address?: string | null
          created_at?: string
          full_name?: string
          id?: string
          next_of_kin?: string | null
          phone_number?: string | null
          photo_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      resources: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          file_url: string
          id: string
          title: string
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          file_url: string
          id?: string
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          file_url?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          business_name: string
          content: string
          created_at: string
          id: string
          is_featured: boolean
          member_name: string
          photo_url: string | null
        }
        Insert: {
          business_name: string
          content: string
          created_at?: string
          id?: string
          is_featured?: boolean
          member_name: string
          photo_url?: string | null
        }
        Update: {
          business_name?: string
          content?: string
          created_at?: string
          id?: string
          is_featured?: boolean
          member_name?: string
          photo_url?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      application_status: "pending" | "approved" | "rejected"
      membership_plan: "starter" | "pro"
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
    Enums: {
      app_role: ["admin", "user"],
      application_status: ["pending", "approved", "rejected"],
      membership_plan: ["starter", "pro"],
    },
  },
} as const
