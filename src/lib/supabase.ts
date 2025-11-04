import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface WaterLevel {
  id: string;
  timestamp: string;
  volume_m3: number;
  volume_liters: number;
  created_at: string;
}

export interface AtmosphericCondition {
  id: string;
  timestamp: string;
  temperature: number;
  humidity: number;
  created_at: string;
}

export interface User {
  id: string;
  username: string;
  password_hash: string;
  is_admin: boolean;
  dark_mode: boolean;
  email?: string;
  created_at: string;
}
