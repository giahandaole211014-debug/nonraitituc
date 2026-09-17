import { createClient, SupabaseClient, User, Session } from "@supabase/supabase-js";

// Helper to safely get Supabase credentials
export function getSupabaseConfig() {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || "";
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "";

  // Fallback to local storage if user configured it in the UI
  const localUrl = typeof window !== "undefined" ? localStorage.getItem("nongtrai_supabase_url") || "" : "";
  const localKey = typeof window !== "undefined" ? localStorage.getItem("nongtrai_supabase_key") || "" : "";

  const url = (envUrl || localUrl).trim();
  const key = (envKey || localKey).trim();

  const isConfigured = Boolean(
    url && 
    key && 
    url.startsWith("https://") && 
    url.includes(".supabase.co")
  );

  return { url, key, isConfigured };
}

export function saveSupabaseConfig(url: string, key: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("nongtrai_supabase_url", url.trim());
    localStorage.setItem("nongtrai_supabase_key", key.trim());
    // Trigger window storage event or reload client
    window.location.reload();
  }
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const { url, key, isConfigured } = getSupabaseConfig();
  if (!isConfigured) {
    return null;
  }
  if (!supabaseInstance) {
    supabaseInstance = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return supabaseInstance;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: "student" | "parent";
  avatarUrl?: string;
  grade?: number;
  createdAt: string;
  knowledgePoints: number;
  coins: number;
  currentStreak: number;
  totalPlanted: number;
  totalHarvested: number;
}
