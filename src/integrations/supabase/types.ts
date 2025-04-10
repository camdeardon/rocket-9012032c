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
      interests: {
        Row: {
          category: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      match_scores: {
        Row: {
          background_similarity: number | null
          created_at: string | null
          id: string
          interests_similarity: number | null
          location_similarity: number | null
          matched_user_id: string | null
          similarity_score: number | null
          skills_similarity: number | null
          user_id: string | null
        }
        Insert: {
          background_similarity?: number | null
          created_at?: string | null
          id?: string
          interests_similarity?: number | null
          location_similarity?: number | null
          matched_user_id?: string | null
          similarity_score?: number | null
          skills_similarity?: number | null
          user_id?: string | null
        }
        Update: {
          background_similarity?: number | null
          created_at?: string | null
          id?: string
          interests_similarity?: number | null
          location_similarity?: number | null
          matched_user_id?: string | null
          similarity_score?: number | null
          skills_similarity?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "match_scores_matched_user_id_fkey"
            columns: ["matched_user_id"]
            isOneToOne: false
            referencedRelation: "enhanced_match_recommendations"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "match_scores_matched_user_id_fkey"
            columns: ["matched_user_id"]
            isOneToOne: false
            referencedRelation: "enhanced_match_recommendations"
            referencedColumns: ["matched_user_id"]
          },
          {
            foreignKeyName: "match_scores_matched_user_id_fkey"
            columns: ["matched_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_scores_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "enhanced_match_recommendations"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "match_scores_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "enhanced_match_recommendations"
            referencedColumns: ["matched_user_id"]
          },
          {
            foreignKeyName: "match_scores_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          availability_match: number | null
          business_focus_match: number | null
          created_at: string
          experience_match: number | null
          id: string
          interests_match_score: number | null
          match_score: number | null
          matched_user_id: string
          personality_match: number | null
          project_id: string | null
          skills_match_score: number | null
          status: string
          updated_at: string
          user_id: string
          values_match: number | null
          work_style_match: number | null
        }
        Insert: {
          availability_match?: number | null
          business_focus_match?: number | null
          created_at?: string
          experience_match?: number | null
          id?: string
          interests_match_score?: number | null
          match_score?: number | null
          matched_user_id: string
          personality_match?: number | null
          project_id?: string | null
          skills_match_score?: number | null
          status?: string
          updated_at?: string
          user_id: string
          values_match?: number | null
          work_style_match?: number | null
        }
        Update: {
          availability_match?: number | null
          business_focus_match?: number | null
          created_at?: string
          experience_match?: number | null
          id?: string
          interests_match_score?: number | null
          match_score?: number | null
          matched_user_id?: string
          personality_match?: number | null
          project_id?: string | null
          skills_match_score?: number | null
          status?: string
          updated_at?: string
          user_id?: string
          values_match?: number | null
          work_style_match?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_matched_user_id_fkey"
            columns: ["matched_user_id"]
            isOneToOne: false
            referencedRelation: "enhanced_match_recommendations"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "matches_matched_user_id_fkey"
            columns: ["matched_user_id"]
            isOneToOne: false
            referencedRelation: "enhanced_match_recommendations"
            referencedColumns: ["matched_user_id"]
          },
          {
            foreignKeyName: "matches_matched_user_id_fkey"
            columns: ["matched_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "enhanced_match_recommendations"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "matches_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "enhanced_match_recommendations"
            referencedColumns: ["matched_user_id"]
          },
          {
            foreignKeyName: "matches_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ml_match_recommendations: {
        Row: {
          created_at: string | null
          features: Json | null
          id: string
          matched_user_id: string
          recommendation_score: number
          recommendation_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          features?: Json | null
          id?: string
          matched_user_id: string
          recommendation_score: number
          recommendation_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          features?: Json | null
          id?: string
          matched_user_id?: string
          recommendation_score?: number
          recommendation_type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          availability_hours: number
          avatar_url: string | null
          background: string
          bio: string
          business_focus: string[]
          collaboration_style: string
          core_values: string[]
          created_at: string
          email: string
          embedding: string | null
          embedding_updated_at: string | null
          entrepreneurial_experience: string
          first_name: string
          id: string
          interests: string[]
          investment_preferences: string[]
          last_name: string
          location: string
          onboarding_completed: boolean | null
          personality_traits: string[]
          preferred_communication: string[]
          preferred_team_size: string
          preferred_work_timezone: string
          remote_preference: string
          resume_url: string | null
          skills: string[]
          title: string
          updated_at: string
          work_style: string
        }
        Insert: {
          availability_hours?: number
          avatar_url?: string | null
          background?: string
          bio?: string
          business_focus?: string[]
          collaboration_style?: string
          core_values?: string[]
          created_at?: string
          email?: string
          embedding?: string | null
          embedding_updated_at?: string | null
          entrepreneurial_experience?: string
          first_name?: string
          id: string
          interests?: string[]
          investment_preferences?: string[]
          last_name?: string
          location?: string
          onboarding_completed?: boolean | null
          personality_traits?: string[]
          preferred_communication?: string[]
          preferred_team_size?: string
          preferred_work_timezone?: string
          remote_preference?: string
          resume_url?: string | null
          skills?: string[]
          title?: string
          updated_at?: string
          work_style?: string
        }
        Update: {
          availability_hours?: number
          avatar_url?: string | null
          background?: string
          bio?: string
          business_focus?: string[]
          collaboration_style?: string
          core_values?: string[]
          created_at?: string
          email?: string
          embedding?: string | null
          embedding_updated_at?: string | null
          entrepreneurial_experience?: string
          first_name?: string
          id?: string
          interests?: string[]
          investment_preferences?: string[]
          last_name?: string
          location?: string
          onboarding_completed?: boolean | null
          personality_traits?: string[]
          preferred_communication?: string[]
          preferred_team_size?: string
          preferred_work_timezone?: string
          remote_preference?: string
          resume_url?: string | null
          skills?: string[]
          title?: string
          updated_at?: string
          work_style?: string
        }
        Relationships: []
      }
      project_skills: {
        Row: {
          id: string
          project_id: string
          required_proficiency_level: string | null
          required_years_experience: number | null
          skill_id: string
        }
        Insert: {
          id?: string
          project_id: string
          required_proficiency_level?: string | null
          required_years_experience?: number | null
          skill_id: string
        }
        Update: {
          id?: string
          project_id?: string
          required_proficiency_level?: string | null
          required_years_experience?: number | null
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_skills_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          goal: string | null
          id: string
          industry: string | null
          name: string
          owner_id: string
          seeking: string[] | null
          stage: string | null
          updated_at: string
          vision: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          goal?: string | null
          id?: string
          industry?: string | null
          name: string
          owner_id: string
          seeking?: string[] | null
          stage?: string | null
          updated_at?: string
          vision?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          goal?: string | null
          id?: string
          industry?: string | null
          name?: string
          owner_id?: string
          seeking?: string[] | null
          stage?: string | null
          updated_at?: string
          vision?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "enhanced_match_recommendations"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "projects_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "enhanced_match_recommendations"
            referencedColumns: ["matched_user_id"]
          },
          {
            foreignKeyName: "projects_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_embeddings: {
        Row: {
          embedding: string | null
          last_updated: string | null
          user_id: string
        }
        Insert: {
          embedding?: string | null
          last_updated?: string | null
          user_id: string
        }
        Update: {
          embedding?: string | null
          last_updated?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_interests: {
        Row: {
          id: string
          interest_id: string
          user_id: string
        }
        Insert: {
          id?: string
          interest_id: string
          user_id: string
        }
        Update: {
          id?: string
          interest_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_interests_interest_id_fkey"
            columns: ["interest_id"]
            isOneToOne: false
            referencedRelation: "interests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_interests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "enhanced_match_recommendations"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_interests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "enhanced_match_recommendations"
            referencedColumns: ["matched_user_id"]
          },
          {
            foreignKeyName: "user_interests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_skills: {
        Row: {
          id: string
          proficiency_level: string | null
          skill_id: string
          user_id: string
          years_experience: number | null
        }
        Insert: {
          id?: string
          proficiency_level?: string | null
          skill_id: string
          user_id: string
          years_experience?: number | null
        }
        Update: {
          id?: string
          proficiency_level?: string | null
          skill_id?: string
          user_id?: string
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_skills_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "enhanced_match_recommendations"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_skills_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "enhanced_match_recommendations"
            referencedColumns: ["matched_user_id"]
          },
          {
            foreignKeyName: "user_skills_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      enhanced_match_recommendations: {
        Row: {
          avatar_url: string | null
          first_name: string | null
          interests: string[] | null
          is_mutual: boolean | null
          last_name: string | null
          location: string | null
          match_features: Json | null
          match_score: number | null
          match_type: string | null
          matched_user_id: string | null
          skills: string[] | null
          user_id: string | null
        }
        Relationships: []
      }
      match_analysis: {
        Row: {
          availability_match: number | null
          business_focus_match: number | null
          experience_match: number | null
          interests_match_score: number | null
          match_id: string | null
          matched_user_id: string | null
          overall_match_score: number | null
          personality_match: number | null
          skills_match_score: number | null
          user_id: string | null
          values_match: number | null
          work_style_match: number | null
        }
        Insert: {
          availability_match?: number | null
          business_focus_match?: number | null
          experience_match?: number | null
          interests_match_score?: number | null
          match_id?: string | null
          matched_user_id?: string | null
          overall_match_score?: never
          personality_match?: number | null
          skills_match_score?: number | null
          user_id?: string | null
          values_match?: number | null
          work_style_match?: number | null
        }
        Update: {
          availability_match?: number | null
          business_focus_match?: number | null
          experience_match?: number | null
          interests_match_score?: number | null
          match_id?: string | null
          matched_user_id?: string | null
          overall_match_score?: never
          personality_match?: number | null
          skills_match_score?: number | null
          user_id?: string | null
          values_match?: number | null
          work_style_match?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_matched_user_id_fkey"
            columns: ["matched_user_id"]
            isOneToOne: false
            referencedRelation: "enhanced_match_recommendations"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "matches_matched_user_id_fkey"
            columns: ["matched_user_id"]
            isOneToOne: false
            referencedRelation: "enhanced_match_recommendations"
            referencedColumns: ["matched_user_id"]
          },
          {
            foreignKeyName: "matches_matched_user_id_fkey"
            columns: ["matched_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "enhanced_match_recommendations"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "matches_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "enhanced_match_recommendations"
            referencedColumns: ["matched_user_id"]
          },
          {
            foreignKeyName: "matches_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      match_details: {
        Row: {
          avatar_url: string | null
          bio: string | null
          first_name: string | null
          interests: string[] | null
          interests_match_score: number | null
          last_name: string | null
          location: string | null
          match_id: string | null
          match_score: number | null
          matched_user_id: string | null
          skills: string[] | null
          skills_match_score: number | null
          status: string | null
          title: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_matched_user_id_fkey"
            columns: ["matched_user_id"]
            isOneToOne: false
            referencedRelation: "enhanced_match_recommendations"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "matches_matched_user_id_fkey"
            columns: ["matched_user_id"]
            isOneToOne: false
            referencedRelation: "enhanced_match_recommendations"
            referencedColumns: ["matched_user_id"]
          },
          {
            foreignKeyName: "matches_matched_user_id_fkey"
            columns: ["matched_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "enhanced_match_recommendations"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "matches_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "enhanced_match_recommendations"
            referencedColumns: ["matched_user_id"]
          },
          {
            foreignKeyName: "matches_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      binary_quantize:
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      calculate_enhanced_match_scores: {
        Args: {
          user_id_param: string
        }
        Returns: {
          matched_user_id: string
          skills_match_score: number
          interests_match_score: number
          ml_recommendation_score: number
          match_score: number
        }[]
      }
      calculate_match_scores: {
        Args: {
          user_id_param: string
        }
        Returns: {
          matched_user_id: string
          skills_match_score: number
          interests_match_score: number
          match_score: number
        }[]
      }
      get_match_details: {
        Args: {
          user_id_param: string
        }
        Returns: {
          match_id: string
          first_name: string
          last_name: string
          avatar_url: string
          bio: string
          location: string
          skills: string[]
          interests: string[]
          skills_match_score: number
          interests_match_score: number
          match_score: number
        }[]
      }
      halfvec_avg: {
        Args: {
          "": number[]
        }
        Returns: unknown
      }
      halfvec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      halfvec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      hnsw_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnswhandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      l2_norm:
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      l2_normalize:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      sparsevec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      sparsevec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims:
        | {
            Args: {
              "": string
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
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
