import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type DbReport = {
  id: string;
  created_at: string;
  photo_url: string | null;
  latitude: number;
  longitude: number;
  address: string;
  severity: "Minor" | "Moderate" | "Major";
  description: string | null;
  status: "Reported" | "Assigned" | "In Progress" | "Swept";
  neighborhood: string | null;
};
