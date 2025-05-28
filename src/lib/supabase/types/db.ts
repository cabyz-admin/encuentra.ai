export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      candidate_availability: {
        Row: {
          available_from: string | null;
          created_at: string;
          id: string;
          notice_period_days: number | null;
          status: Database["public"]["Enums"]["availability_status"];
          updated_at: string;
        };
        Insert: {
          available_from?: string | null;
          created_at?: string;
          id: string;
          notice_period_days?: number | null;
          status?: Database["public"]["Enums"]["availability_status"];
          updated_at?: string;
        };
        Update: {
          available_from?: string | null;
          created_at?: string;
          id?: string;
          notice_period_days?: number | null;
          status?: Database["public"]["Enums"]["availability_status"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "candidate_availability_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "candidate_profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      candidate_education: {
        Row: {
          candidate_id: string;
          created_at: string;
          degree: string;
          description: string | null;
          end_date: string | null;
          field_of_study: string | null;
          id: string;
          institution: string;
          is_current: boolean;
          start_date: string | null;
          updated_at: string;
        };
        Insert: {
          candidate_id: string;
          created_at?: string;
          degree: string;
          description?: string | null;
          end_date?: string | null;
          field_of_study?: string | null;
          id?: string;
          institution: string;
          is_current?: boolean;
          start_date?: string | null;
          updated_at?: string;
        };
        Update: {
          candidate_id?: string;
          created_at?: string;
          degree?: string;
          description?: string | null;
          end_date?: string | null;
          field_of_study?: string | null;
          id?: string;
          institution?: string;
          is_current?: boolean;
          start_date?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "candidate_education_candidate_id_fkey";
            columns: ["candidate_id"];
            isOneToOne: false;
            referencedRelation: "candidate_profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      candidate_experience: {
        Row: {
          candidate_id: string;
          company_name: string;
          created_at: string;
          description: string | null;
          end_date: string | null;
          id: string;
          is_current: boolean;
          location: string | null;
          start_date: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          candidate_id: string;
          company_name: string;
          created_at?: string;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          is_current?: boolean;
          location?: string | null;
          start_date: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          candidate_id?: string;
          company_name?: string;
          created_at?: string;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          is_current?: boolean;
          location?: string | null;
          start_date?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "candidate_experience_candidate_id_fkey";
            columns: ["candidate_id"];
            isOneToOne: false;
            referencedRelation: "candidate_profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      candidate_portfolios: {
        Row: {
          candidate_id: string;
          created_at: string;
          description: string | null;
          id: string;
          image_url: string | null;
          title: string;
          updated_at: string;
          url: string;
        };
        Insert: {
          candidate_id: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          title: string;
          updated_at?: string;
          url: string;
        };
        Update: {
          candidate_id?: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          title?: string;
          updated_at?: string;
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "candidate_portfolios_candidate_id_fkey";
            columns: ["candidate_id"];
            isOneToOne: false;
            referencedRelation: "candidate_profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      candidate_preferences: {
        Row: {
          created_at: string;
          currency: string;
          employment_types: Database["public"]["Enums"]["employment_type"][];
          id: string;
          industries: string[] | null;
          locations: string[] | null;
          max_salary: number | null;
          min_salary: number | null;
          remote_preference: Database["public"]["Enums"]["remote_preference"];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          currency?: string;
          employment_types?: Database["public"]["Enums"]["employment_type"][];
          id: string;
          industries?: string[] | null;
          locations?: string[] | null;
          max_salary?: number | null;
          min_salary?: number | null;
          remote_preference?: Database["public"]["Enums"]["remote_preference"];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          currency?: string;
          employment_types?: Database["public"]["Enums"]["employment_type"][];
          id?: string;
          industries?: string[] | null;
          locations?: string[] | null;
          max_salary?: number | null;
          min_salary?: number | null;
          remote_preference?: Database["public"]["Enums"]["remote_preference"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "candidate_preferences_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "candidate_profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      candidate_profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          experience_level: Database["public"]["Enums"]["experience_level"] | null;
          github_url: string | null;
          headline: string | null;
          id: string;
          is_public: boolean;
          linkedin_url: string | null;
          location: string | null;
          resume_url: string | null;
          updated_at: string;
          website_url: string | null;
          years_of_experience: number | null;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          experience_level?: Database["public"]["Enums"]["experience_level"] | null;
          github_url?: string | null;
          headline?: string | null;
          id: string;
          is_public?: boolean;
          linkedin_url?: string | null;
          location?: string | null;
          resume_url?: string | null;
          updated_at?: string;
          website_url?: string | null;
          years_of_experience?: number | null;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          experience_level?: Database["public"]["Enums"]["experience_level"] | null;
          github_url?: string | null;
          headline?: string | null;
          id?: string;
          is_public?: boolean;
          linkedin_url?: string | null;
          location?: string | null;
          resume_url?: string | null;
          updated_at?: string;
          website_url?: string | null;
          years_of_experience?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "candidate_profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "auth_users";
            referencedColumns: ["id"];
          }
        ];
      };
      candidate_skills: {
        Row: {
          candidate_id: string;
          created_at: string;
          id: string;
          proficiency: Database["public"]["Enums"]["skill_level"];
          skill_name: string;
          updated_at: string;
          years_of_experience: number | null;
        };
        Insert: {
          candidate_id: string;
          created_at?: string;
          id?: string;
          proficiency: Database["public"]["Enums"]["skill_level"];
          skill_name: string;
          updated_at?: string;
          years_of_experience?: number | null;
        };
        Update: {
          candidate_id?: string;
          created_at?: string;
          id?: string;
          proficiency?: Database["public"]["Enums"]["skill_level"];
          skill_name?: string;
          updated_at?: string;
          years_of_experience?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "candidate_skills_candidate_id_fkey";
            columns: ["candidate_id"];
            isOneToOne: false;
            referencedRelation: "candidate_profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      candidate_views: {
        Row: {
          candidate_id: string;
          id: string;
          viewed_at: string;
          viewer_id: string;
        };
        Insert: {
          candidate_id: string;
          id?: string;
          viewed_at?: string;
          viewer_id: string;
        };
        Update: {
          candidate_id?: string;
          id?: string;
          viewed_at?: string;
          viewer_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "candidate_views_candidate_id_fkey";
            columns: ["candidate_id"];
            isOneToOne: false;
            referencedRelation: "candidate_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "candidate_views_viewer_id_fkey";
            columns: ["viewer_id"];
            isOneToOne: false;
            referencedRelation: "auth_users";
            referencedColumns: ["id"];
          }
        ];
      };
      company_job_interests: {
        Row: {
          company_id: string;
          created_at: string;
          currency: string;
          description: string | null;
          employment_type: Database["public"]["Enums"]["employment_type"];
          experience_level: Database["public"]["Enums"]["experience_level"] | null;
          id: string;
          locations: string[] | null;
          max_salary: number | null;
          min_salary: number | null;
          remote_preference: Database["public"]["Enums"]["remote_preference"];
          skills: string[] | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          company_id: string;
          created_at?: string;
          currency?: string;
          description?: string | null;
          employment_type?: Database["public"]["Enums"]["employment_type"];
          experience_level?: Database["public"]["Enums"]["experience_level"] | null;
          id?: string;
          locations?: string[] | null;
          max_salary?: number | null;
          min_salary?: number | null;
          remote_preference?: Database["public"]["Enums"]["remote_preference"];
          skills?: string[] | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          company_id?: string;
          created_at?: string;
          currency?: string;
          description?: string | null;
          employment_type?: Database["public"]["Enums"]["employment_type"];
          experience_level?: Database["public"]["Enums"]["experience_level"] | null;
          id?: string;
          locations?: string[] | null;
          max_salary?: number | null;
          min_salary?: number | null;
          remote_preference?: Database["public"]["Enums"]["remote_preference"];
          skills?: string[] | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "company_job_interests_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "company_profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      company_profiles: {
        Row: {
          benefits: string | null;
          bio: string | null;
          company_name: string;
          company_size: string | null;
          created_at: string;
          culture: string | null;
          founded_year: number | null;
          headquarters_location: string | null;
          id: string;
          industry: string | null;
          linkedin_url: string | null;
          logo_url: string | null;
          updated_at: string;
          website_url: string | null;
        };
        Insert: {
          benefits?: string | null;
          bio?: string | null;
          company_name: string;
          company_size?: string | null;
          created_at?: string;
          culture?: string | null;
          founded_year?: number | null;
          headquarters_location?: string | null;
          id: string;
          industry?: string | null;
          linkedin_url?: string | null;
          logo_url?: string | null;
          updated_at?: string;
          website_url?: string | null;
        };
        Update: {
          benefits?: string | null;
          bio?: string | null;
          company_name?: string;
          company_size?: string | null;
          created_at?: string;
          culture?: string | null;
          founded_year?: number | null;
          headquarters_location?: string | null;
          id?: string;
          industry?: string | null;
          linkedin_url?: string | null;
          logo_url?: string | null;
          updated_at?: string;
          website_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "company_profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "auth_users";
            referencedColumns: ["id"];
          }
        ];
      };
      company_saved_candidates: {
        Row: {
          candidate_id: string;
          company_id: string;
          created_at: string;
          id: string;
          notes: string | null;
          updated_at: string;
        };
        Insert: {
          candidate_id: string;
          company_id: string;
          created_at?: string;
          id?: string;
          notes?: string | null;
          updated_at?: string;
        };
        Update: {
          candidate_id?: string;
          company_id?: string;
          created_at?: string;
          id?: string;
          notes?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "company_saved_candidates_candidate_id_fkey";
            columns: ["candidate_id"];
            isOneToOne: false;
            referencedRelation: "candidate_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "company_saved_candidates_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "company_profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      company_team_members: {
        Row: {
          avatar_url: string | null;
          company_id: string;
          created_at: string;
          email: string | null;
          id: string;
          name: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          company_id: string;
          created_at?: string;
          email?: string | null;
          id?: string;
          name: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          company_id?: string;
          created_at?: string;
          email?: string | null;
          id?: string;
          name?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "company_team_members_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "company_profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      connection_requests: {
        Row: {
          created_at: string;
          id: string;
          message: string | null;
          recipient_id: string;
          responded_at: string | null;
          response_message: string | null;
          sender_id: string;
          status: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          message?: string | null;
          recipient_id: string;
          responded_at?: string | null;
          response_message?: string | null;
          sender_id: string;
          status?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          message?: string | null;
          recipient_id?: string;
          responded_at?: string | null;
          response_message?: string | null;
          sender_id?: string;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "connection_requests_recipient_id_fkey";
            columns: ["recipient_id"];
            isOneToOne: false;
            referencedRelation: "auth_users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "connection_requests_sender_id_fkey";
            columns: ["sender_id"];
            isOneToOne: false;
            referencedRelation: "auth_users";
            referencedColumns: ["id"];
          }
        ];
      };
      conversations: {
        Row: {
          created_at: string;
          id: string;
          initiator_id: string;
          recipient_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          initiator_id: string;
          recipient_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          initiator_id?: string;
          recipient_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "conversations_initiator_id_fkey";
            columns: ["initiator_id"];
            isOneToOne: false;
            referencedRelation: "auth_users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "conversations_recipient_id_fkey";
            columns: ["recipient_id"];
            isOneToOne: false;
            referencedRelation: "auth_users";
            referencedColumns: ["id"];
          }
        ];
      };
      industry_tags: {
        Row: {
          created_at: string;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      location_data: {
        Row: {
          city: string;
          country: string;
          created_at: string;
          id: string;
          state: string | null;
        };
        Insert: {
          city: string;
          country: string;
          created_at?: string;
          id?: string;
          state?: string | null;
        };
        Update: {
          city?: string;
          country?: string;
          created_at?: string;
          id?: string;
          state?: string | null;
        };
        Relationships: [];
      };
      matching_behavioral_data: {
        Row: {
          action_type: string;
          created_at: string;
          id: string;
          metadata: Json | null;
          target_id: string;
          user_id: string;
        };
        Insert: {
          action_type: string;
          created_at?: string;
          id?: string;
          metadata?: Json | null;
          target_id: string;
          user_id: string;
        };
        Update: {
          action_type?: string;
          created_at?: string;
          id?: string;
          metadata?: Json | null;
          target_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "matching_behavioral_data_target_id_fkey";
            columns: ["target_id"];
            isOneToOne: false;
            referencedRelation: "auth_users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "matching_behavioral_data_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "auth_users";
            referencedColumns: ["id"];
          }
        ];
      };
      matching_filters: {
        Row: {
          created_at: string;
          employment_types: string[] | null;
          experience_levels: string[] | null;
          id: string;
          industries: string[] | null;
          locations: string[] | null;
          max_salary: number | null;
          min_salary: number | null;
          radius_km: number | null;
          remote_preferences: string[] | null;
          skills: string[] | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          employment_types?: string[] | null;
          experience_levels?: string[] | null;
          id: string;
          industries?: string[] | null;
          locations?: string[] | null;
          max_salary?: number | null;
          min_salary?: number | null;
          radius_km?: number | null;
          remote_preferences?: string[] | null;
          skills?: string[] | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          employment_types?: string[] | null;
          experience_levels?: string[] | null;
          id?: string;
          industries?: string[] | null;
          locations?: string[] | null;
          max_salary?: number | null;
          min_salary?: number | null;
          radius_km?: number | null;
          remote_preferences?: string[] | null;
          skills?: string[] | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "matching_filters_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "auth_users";
            referencedColumns: ["id"];
          }
        ];
      };
      matching_location_data: {
        Row: {
          city: string | null;
          country: string | null;
          created_at: string;
          id: string;
          latitude: number | null;
          longitude: number | null;
          radius_km: number | null;
          state: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          city?: string | null;
          country?: string | null;
          created_at?: string;
          id?: string;
          latitude?: number | null;
          longitude?: number | null;
          radius_km?: number | null;
          state?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          city?: string | null;
          country?: string | null;
          created_at?: string;
          id?: string;
          latitude?: number | null;
          longitude?: number | null;
          radius_km?: number | null;
          state?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "matching_location_data_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "auth_users";
            referencedColumns: ["id"];
          }
        ];
      };
      matching_preferences: {
        Row: {
          behavioral_weight: number | null;
          company_size_weight: number | null;
          created_at: string;
          experience_weight: number | null;
          id: string;
          industry_weight: number | null;
          location_weight: number | null;
          remote_preference_weight: number | null;
          salary_weight: number | null;
          skill_weight: number | null;
          updated_at: string;
        };
        Insert: {
          behavioral_weight?: number | null;
          company_size_weight?: number | null;
          created_at?: string;
          experience_weight?: number | null;
          id: string;
          industry_weight?: number | null;
          location_weight?: number | null;
          remote_preference_weight?: number | null;
          salary_weight?: number | null;
          skill_weight?: number | null;
          updated_at?: string;
        };
        Update: {
          behavioral_weight?: number | null;
          company_size_weight?: number | null;
          created_at?: string;
          experience_weight?: number | null;
          id?: string;
          industry_weight?: number | null;
          location_weight?: number | null;
          remote_preference_weight?: number | null;
          salary_weight?: number | null;
          skill_weight?: number | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "matching_preferences_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "auth_users";
            referencedColumns: ["id"];
          }
        ];
      };
      matching_scores: {
        Row: {
          candidate_id: string;
          company_id: string;
          created_at: string;
          id: string;
          score: number;
          score_breakdown: Json | null;
          updated_at: string;
        };
        Insert: {
          candidate_id: string;
          company_id: string;
          created_at?: string;
          id?: string;
          score: number;
          score_breakdown?: Json | null;
          updated_at?: string;
        };
        Update: {
          candidate_id?: string;
          company_id?: string;
          created_at?: string;
          id?: string;
          score?: number;
          score_breakdown?: Json | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "matching_scores_candidate_id_fkey";
            columns: ["candidate_id"];
            isOneToOne: false;
            referencedRelation: "candidate_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "matching_scores_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "company_profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      messages: {
        Row: {
          content: string;
          conversation_id: string;
          created_at: string;
          id: string;
          read: boolean;
          sender_id: string;
          updated_at: string;
        };
        Insert: {
          content: string;
          conversation_id: string;
          created_at?: string;
          id?: string;
          read?: boolean;
          sender_id: string;
          updated_at?: string;
        };
        Update: {
          content?: string;
          conversation_id?: string;
          created_at?: string;
          id?: string;
          read?: boolean;
          sender_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "conversations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "messages_sender_id_fkey";
            columns: ["sender_id"];
            isOneToOne: false;
            referencedRelation: "auth_users";
            referencedColumns: ["id"];
          }
        ];
      };
      posts: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: string;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_posts_user";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      skill_tags: {
        Row: {
          category: string | null;
          created_at: string;
          id: string;
          name: string;
        };
        Insert: {
          category?: string | null;
          created_at?: string;
          id?: string;
          name: string;
        };
        Update: {
          category?: string | null;
          created_at?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      user_likes: {
        Row: {
          created_at: string;
          id: string;
          liked_id: string;
          liker_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          liked_id: string;
          liker_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          liked_id?: string;
          liker_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_likes_liked_id_fkey";
            columns: ["liked_id"];
            isOneToOne: false;
            referencedRelation: "auth_users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_likes_liker_id_fkey";
            columns: ["liker_id"];
            isOneToOne: false;
            referencedRelation: "auth_users";
            referencedColumns: ["id"];
          }
        ];
      };
      user_profiles: {
        Row: {
          created_at: string;
          id: string;
          onboarding_completed: boolean;
          onboarding_step: number;
          updated_at: string;
          user_type: Database["public"]["Enums"]["user_type"];
        };
        Insert: {
          created_at?: string;
          id: string;
          onboarding_completed?: boolean;
          onboarding_step?: number;
          updated_at?: string;
          user_type: Database["public"]["Enums"]["user_type"];
        };
        Update: {
          created_at?: string;
          id?: string;
          onboarding_completed?: boolean;
          onboarding_step?: number;
          updated_at?: string;
          user_type?: Database["public"]["Enums"]["user_type"];
        };
        Relationships: [
          {
            foreignKeyName: "user_profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "auth_users";
            referencedColumns: ["id"];
          }
        ];
      };
      users: {
        Row: {
          avatar_url: string | null;
          created_at: string | null;
          email: string;
          full_name: string | null;
          id: string;
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string | null;
          email: string;
          full_name?: string | null;
          id: string;
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string | null;
          email?: string;
          full_name?: string | null;
          id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "fk_auth_user";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      calculate_matching_score: {
        Args: {
          candidate_id: string;
          company_id: string;
        };
        Returns: number;
      };
      record_behavioral_data: {
        Args: {
          user_id: string;
          target_id: string;
          action_type: string;
          metadata?: Json;
        };
        Returns: undefined;
      };
      update_matching_scores: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
    };
    Enums: {
      availability_status: "active" | "passive" | "not_looking";
      employment_type: "full_time" | "part_time" | "contract" | "freelance" | "internship";
      experience_level: "entry" | "mid" | "senior" | "executive";
      remote_preference: "remote" | "hybrid" | "onsite";
      skill_level: "beginner" | "intermediate" | "advanced" | "expert";
      user_type: "candidate" | "company" | "admin";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never;