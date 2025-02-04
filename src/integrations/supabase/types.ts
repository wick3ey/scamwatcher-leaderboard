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
      }
      user_actions: {
        Row: {
          id: string
          user_id: string
          scammer_id: string
          action_type: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          scammer_id: string
          action_type: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          scammer_id?: string
          action_type?: string
          created_at?: string
        }
      }
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