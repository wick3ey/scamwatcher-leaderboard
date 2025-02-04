export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string
          user_id: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      nominations: {
        Row: {
          id: string
          twitter_handle: string
          name: string
          scam_description: string
          amount_stolen_usd: number
          token_name: string | null
          votes: number | null
          lawsuit_signatures: number | null
          target_signatures: number | null
          nominated_by: string | null
          created_at: string
          is_pinned: boolean | null
          status: string | null
          admin_notes: string | null
          last_modified_by: string | null
          last_modified_at: string | null
          image_url: string | null
        }
        Insert: {
          id?: string
          twitter_handle: string
          name: string
          scam_description: string
          amount_stolen_usd: number
          token_name?: string | null
          votes?: number | null
          lawsuit_signatures?: number | null
          target_signatures?: number | null
          nominated_by?: string | null
          created_at?: string
          is_pinned?: boolean | null
          status?: string | null
          admin_notes?: string | null
          last_modified_by?: string | null
          last_modified_at?: string | null
          image_url?: string | null
        }
        Update: {
          id?: string
          twitter_handle?: string
          name?: string
          scam_description?: string
          amount_stolen_usd?: number
          token_name?: string | null
          votes?: number | null
          lawsuit_signatures?: number | null
          target_signatures?: number | null
          nominated_by?: string | null
          created_at?: string
          is_pinned?: boolean | null
          status?: string | null
          admin_notes?: string | null
          last_modified_by?: string | null
          last_modified_at?: string | null
          image_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nominations_last_modified_by_fkey"
            columns: ["last_modified_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nominations_nominated_by_fkey"
            columns: ["nominated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          username: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_actions: {
        Row: {
          id: string
          user_id: string
          scammer_id: number
          action_type: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          scammer_id: number
          action_type: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          scammer_id?: number
          action_type?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_actions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}