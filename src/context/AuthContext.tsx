import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { getSupabase, getSupabaseConfig, UserProfile } from "../lib/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isConfigured: boolean;
  greeting: string;
  welcomeMessage: string | null;
  clearWelcomeMessage: () => void;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (data: { fullName?: string; avatarUrl?: string; grade?: number }) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  isConfigured: false,
  greeting: "",
  welcomeMessage: null,
  clearWelcomeMessage: () => {},
  signInWithGoogle: async () => ({ success: false }),
  signOut: async () => {},
  updateProfile: async () => ({ success: false }),
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null);

  const { isConfigured } = getSupabaseConfig();
  const supabase = getSupabase();

  const loadProfile = async (currentUser: User) => {
    const meta = currentUser.user_metadata || {};
    // Extract Google and Supabase Auth metadata
    const fullName = meta.full_name || meta.name || currentUser.email?.split("@")[0] || "Học sinh";
    const role = (meta.role === "parent" ? "parent" : "student") as "student" | "parent";
    const grade = meta.grade ? Number(meta.grade) : 7;
    // Google provides picture or avatar_url
    const avatarUrl = meta.avatar_url || meta.picture || (role === "student" ? "🌱" : "👩");

    // Starting profile state
    let userProfile: UserProfile = {
      id: currentUser.id,
      email: currentUser.email || "",
      fullName,
      role,
      avatarUrl,
      grade,
      createdAt: currentUser.created_at || new Date().toISOString(),
      knowledgePoints: 0,
      coins: 50,
      currentStreak: 1,
      totalPlanted: 0,
      totalHarvested: 0,
    };

    // Query Supabase 'profiles' table for durable persistence
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .maybeSingle();

        if (data && !error) {
          // Existing user! Preserve previous learning progress, crops, score & achievements
          userProfile = {
            ...userProfile,
            fullName: data.full_name || userProfile.fullName,
            role: data.role || userProfile.role,
            // Prefer Google avatar if current is default or if updated
            avatarUrl: data.avatar_url || userProfile.avatarUrl,
            grade: data.grade || userProfile.grade,
            knowledgePoints: data.knowledge_points ?? userProfile.knowledgePoints,
            coins: data.coins ?? userProfile.coins,
            currentStreak: data.current_streak ?? userProfile.currentStreak,
            totalPlanted: data.total_planted ?? userProfile.totalPlanted,
            totalHarvested: data.total_harvested ?? userProfile.totalHarvested,
          };

          // If full_name or avatar_url came fresh from Google and is missing in profiles, sync it
          if (!data.full_name || !data.avatar_url) {
            await supabase.from("profiles").update({
              full_name: data.full_name || fullName,
              avatar_url: data.avatar_url || avatarUrl,
              email: currentUser.email,
              updated_at: new Date().toISOString(),
            }).eq("id", currentUser.id);
          }
        } else if (!data) {
          // New User: Automatically create matching profile in 'profiles' table
          // Default role is 'student', no fake data
          try {
            await supabase.from("profiles").upsert({
              id: currentUser.id,
              email: currentUser.email,
              full_name: fullName,
              role: role,
              grade: grade,
              avatar_url: avatarUrl,
              knowledge_points: 0,
              coins: 50,
              current_streak: 1,
              total_planted: 0,
              total_harvested: 0,
              created_at: currentUser.created_at,
              updated_at: new Date().toISOString(),
            });
          } catch (insertErr) {
            console.warn("Could not insert profile into database table:", insertErr);
          }
        }
      } catch (err) {
        console.warn("Profiles table check notice:", err);
      }
    }

    setProfile(userProfile);

    // Trigger user welcome notification
    // Requirement 3: “Chào mừng [Tên người dùng] đến với Nông Trại Tri Thức! 🌱”
    setWelcomeMessage(`Chào mừng ${userProfile.fullName} đến với Nông Trại Tri Thức! 🌱`);
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        await loadProfile(newSession.user);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Google OAuth Authentication
  const signInWithGoogle = async () => {
    if (!supabase) {
      return {
        success: false,
        error: "Chưa cấu hình Supabase URL và Anon Key. Vui lòng nhấn cài đặt kết nối Supabase.",
      };
    }

    try {
      // Dynamic origin calculation ensuring compatibility across:
      // - Localhost development (http://localhost:3000)
      // - Vercel Preview deployments (*.vercel.app)
      // - Vercel Production domain
      // - Cloud Run deployment URL
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const redirectTo = `${origin}/dashboard`;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: {
            access_type: "offline",
            prompt: "select_account",
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Không thể đăng nhập bằng Google. Vui lòng thử lại.",
      };
    }
  };

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setProfile(null);
    setWelcomeMessage(null);
  };

  const clearWelcomeMessage = () => {
    setWelcomeMessage(null);
  };

  const updateProfile = async (data: { fullName?: string; avatarUrl?: string; grade?: number }) => {
    if (!user || !supabase) {
      return { success: false, error: "Chưa đăng nhập" };
    }

    try {
      // 1. Update user metadata in Supabase Auth (does not alter system role!)
      const updateData: any = {};
      if (data.fullName !== undefined) updateData.full_name = data.fullName.trim();
      if (data.avatarUrl !== undefined) updateData.avatar_url = data.avatarUrl;
      if (data.grade !== undefined) updateData.grade = data.grade;

      const { error: authError } = await supabase.auth.updateUser({
        data: updateData,
      });

      if (authError) {
        return { success: false, error: authError.message };
      }

      // 2. Update profiles table if available
      try {
        await supabase.from("profiles").upsert({
          id: user.id,
          full_name: data.fullName ?? profile?.fullName,
          avatar_url: data.avatarUrl ?? profile?.avatarUrl,
          grade: data.grade ?? profile?.grade,
          updated_at: new Date().toISOString(),
        });
      } catch {
        // Ignore if profiles table is not yet configured
      }

      // 3. Update local state
      setProfile((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          fullName: data.fullName !== undefined ? data.fullName.trim() : prev.fullName,
          avatarUrl: data.avatarUrl !== undefined ? data.avatarUrl : prev.avatarUrl,
          grade: data.grade !== undefined ? data.grade : prev.grade,
        };
      });

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Lỗi cập nhật hồ sơ" };
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user);
    }
  };

  // Requirement: Sau khi đăng nhập, hiển thị: “Xin chào, [Họ và tên] 🌱”
  const greeting = profile ? `Xin chào, ${profile.fullName} 🌱` : "";

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isConfigured,
        greeting,
        welcomeMessage,
        clearWelcomeMessage,
        signInWithGoogle,
        signOut,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
