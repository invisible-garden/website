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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      edition_partners: {
        Row: {
          edition_id: string
          partner_id: string
          sort_order: number
          tier: Database["public"]["Enums"]["partner_tier"]
        }
        Insert: {
          edition_id: string
          partner_id: string
          sort_order?: number
          tier: Database["public"]["Enums"]["partner_tier"]
        }
        Update: {
          edition_id?: string
          partner_id?: string
          sort_order?: number
          tier?: Database["public"]["Enums"]["partner_tier"]
        }
        Relationships: [
          {
            foreignKeyName: "edition_partners_edition_id_fkey"
            columns: ["edition_id"]
            isOneToOne: false
            referencedRelation: "editions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "edition_partners_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      edition_people: {
        Row: {
          edition_id: string
          featured: boolean
          person_id: string
          sort_order: number
        }
        Insert: {
          edition_id: string
          featured?: boolean
          person_id: string
          sort_order?: number
        }
        Update: {
          edition_id?: string
          featured?: boolean
          person_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "edition_people_edition_id_fkey"
            columns: ["edition_id"]
            isOneToOne: false
            referencedRelation: "editions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "edition_people_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      edition_photos: {
        Row: {
          created_at: string
          credit: string | null
          edition_id: string
          id: string
          photo_alt: string
          photo_path: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          credit?: string | null
          edition_id: string
          id?: string
          photo_alt: string
          photo_path: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          credit?: string | null
          edition_id?: string
          id?: string
          photo_alt?: string
          photo_path?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "edition_photos_edition_id_fkey"
            columns: ["edition_id"]
            isOneToOne: false
            referencedRelation: "editions"
            referencedColumns: ["id"]
          },
        ]
      }
      editions: {
        Row: {
          accent_color: string | null
          city: string | null
          country: string | null
          ends_on: string | null
          id: string
          name: string
          slug: string
          sort_order: number
          starts_on: string | null
          status: Database["public"]["Enums"]["edition_status"]
          summary: string | null
        }
        Insert: {
          accent_color?: string | null
          city?: string | null
          country?: string | null
          ends_on?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
          starts_on?: string | null
          status?: Database["public"]["Enums"]["edition_status"]
          summary?: string | null
        }
        Update: {
          accent_color?: string | null
          city?: string | null
          country?: string | null
          ends_on?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          starts_on?: string | null
          status?: Database["public"]["Enums"]["edition_status"]
          summary?: string | null
        }
        Relationships: []
      }
      fellows: {
        Row: {
          bio: string | null
          category: Database["public"]["Enums"]["fellow_category"] | null
          edition_id: string | null
          github: string | null
          id: string
          linkedin: string | null
          name: string
          person_id: string | null
          photo_path: string | null
          slug: string
        }
        Insert: {
          bio?: string | null
          category?: Database["public"]["Enums"]["fellow_category"] | null
          edition_id?: string | null
          github?: string | null
          id?: string
          linkedin?: string | null
          name: string
          person_id?: string | null
          photo_path?: string | null
          slug: string
        }
        Update: {
          bio?: string | null
          category?: Database["public"]["Enums"]["fellow_category"] | null
          edition_id?: string | null
          github?: string | null
          id?: string
          linkedin?: string | null
          name?: string
          person_id?: string | null
          photo_path?: string | null
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "fellows_edition_id_fkey"
            columns: ["edition_id"]
            isOneToOne: false
            referencedRelation: "editions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fellows_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          id: string
          logo_path: string | null
          name: string
          slug: string
          url: string | null
        }
        Insert: {
          id?: string
          logo_path?: string | null
          name: string
          slug: string
          url?: string | null
        }
        Update: {
          id?: string
          logo_path?: string | null
          name?: string
          slug?: string
          url?: string | null
        }
        Relationships: []
      }
      people: {
        Row: {
          bio: string | null
          created_at: string
          full_name: string
          github: string | null
          headline: string | null
          headline_reviewed: boolean
          id: string
          job_title: string | null
          org: string | null
          photo_alt: string | null
          photo_path: string | null
          slug: string
          telegram: string | null
          website: string | null
          x_handle: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          full_name: string
          github?: string | null
          headline?: string | null
          headline_reviewed?: boolean
          id?: string
          job_title?: string | null
          org?: string | null
          photo_alt?: string | null
          photo_path?: string | null
          slug: string
          telegram?: string | null
          website?: string | null
          x_handle?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          full_name?: string
          github?: string | null
          headline?: string | null
          headline_reviewed?: boolean
          id?: string
          job_title?: string | null
          org?: string | null
          photo_alt?: string | null
          photo_path?: string | null
          slug?: string
          telegram?: string | null
          website?: string | null
          x_handle?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          authors_raw: string | null
          description: string | null
          edition_id: string | null
          github: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          authors_raw?: string | null
          description?: string | null
          edition_id?: string | null
          github?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          authors_raw?: string | null
          description?: string | null
          edition_id?: string | null
          github?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_edition_id_fkey"
            columns: ["edition_id"]
            isOneToOne: false
            referencedRelation: "editions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      edition_status: "upcoming" | "running" | "past"
      fellow_category: "academic" | "honorary"
      partner_tier: "sponsor" | "community"
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
      edition_status: ["upcoming", "running", "past"],
      fellow_category: ["academic", "honorary"],
      partner_tier: ["sponsor", "community"],
    },
  },
} as const
