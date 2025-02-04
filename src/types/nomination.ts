import { Database } from '@/integrations/supabase/types';

export type Nomination = Database['public']['Tables']['nominations']['Row'];
export type NominationInsert = Database['public']['Tables']['nominations']['Insert'];
export type NominationUpdate = Database['public']['Tables']['nominations']['Update'];

export type UserAction = Database['public']['Tables']['user_actions']['Row'];
export type UserActionInsert = Database['public']['Tables']['user_actions']['Insert'];
export type UserActionUpdate = Database['public']['Tables']['user_actions']['Update'];

export type AdminUser = Database['public']['Tables']['admin_users']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];