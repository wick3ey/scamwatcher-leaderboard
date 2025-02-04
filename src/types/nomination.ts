import { Database } from '@/integrations/supabase/types';

export type Tables = Database['public']['Tables'];

export type Nomination = Tables['nominations']['Row'];
export type NominationInsert = Tables['nominations']['Insert'];
export type NominationUpdate = Tables['nominations']['Update'];

export type UserAction = Tables['user_actions']['Row'];
export type UserActionInsert = Tables['user_actions']['Insert'];
export type UserActionUpdate = Tables['user_actions']['Update'];

export type AdminUser = Tables['admin_users']['Row'];
export type Profile = Tables['profiles']['Row'];