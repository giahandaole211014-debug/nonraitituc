import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { UserProfile, AccountLink, Plant } from "../types";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  googleId?: string;
  role: "student" | "parent";
}

interface LinkingState {
  myLinkCode: string;
  linkedAccounts: {
    linkId: string;
    accountId: string;
    name: string;
    email: string;
    role: "student" | "parent";
    status: string;
    linkedAt: string;
  }[];
  incomingRequests: any[];
  outgoingRequests: any[];
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  profile: UserProfile | null;
  loading: boolean;
  greeting: string;
  welcomeMessage: string | null;
  linkingState: LinkingState;
  clearWelcomeMessage: () => void;
  signInWithGoogle: (options?: { role?: "student" | "parent"; grade?: number }) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogleDirect: (params: {
    email: string;
    fullName?: string;
    avatarUrl?: string;
    googleId?: string;
    role?: "student" | "parent";
    grade?: number;
  }) => Promise<{ success: boolean; error?: string }>;
  signInWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithEmail: (data: {
    email: string;
    password: string;
    fullName: string;
    role: "student" | "parent";
    grade?: number;
  }) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (data: { fullName?: string; avatarUrl?: string; grade?: number }) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
  syncProgress: (progress: {
    knowledgePoints?: number;
    coins?: number;
    currentStreak?: number;
    totalPlanted?: number;
    totalHarvested?: number;
    plants?: Plant[];
    badges?: any[];
  }) => Promise<void>;
  refreshLinking: () => Promise<void>;
  sendLinkRequest: (targetCodeOrEmail: string) => Promise<{ success: boolean; error?: string }>;
  respondLinkRequest: (linkId: string, action: "accept" | "reject") => Promise<{ success: boolean; error?: string }>;
  unlinkAccountRequest: (linkId: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  profile: null,
  loading: true,
  greeting: "",
  welcomeMessage: null,
  linkingState: {
    myLinkCode: "",
    linkedAccounts: [],
    incomingRequests: [],
    outgoingRequests: [],
  },
  clearWelcomeMessage: () => {},
  signInWithGoogle: async () => ({ success: false }),
  loginWithGoogleDirect: async () => ({ success: false }),
  signInWithEmail: async () => ({ success: false }),
  signUpWithEmail: async () => ({ success: false }),
  signOut: async () => {},
  updateProfile: async () => ({ success: false }),
  refreshProfile: async () => {},
  syncProgress: async () => {},
  refreshLinking: async () => {},
  sendLinkRequest: async () => ({ success: false }),
  respondLinkRequest: async () => ({ success: false }),
  unlinkAccountRequest: async () => ({ success: false }),
});

export const useAuth = () => useContext(AuthContext);

const TOKEN_KEY = "nongtrai_auth_token";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null);
  const [linkingState, setLinkingState] = useState<LinkingState>({
    myLinkCode: "",
    linkedAccounts: [],
    incomingRequests: [],
    outgoingRequests: [],
  });

  // Helper to store session
  const saveSession = (authToken: string, userProfile: UserProfile) => {
    localStorage.setItem(TOKEN_KEY, authToken);
    setToken(authToken);
    setProfile(userProfile);
    setUser({
      id: userProfile.id,
      email: userProfile.email,
      fullName: userProfile.fullName,
      avatarUrl: userProfile.avatarUrl || "🌱",
      googleId: userProfile.googleId,
      role: userProfile.role,
    });
  };

  // Refresh user profile from server
  const refreshProfile = useCallback(async () => {
    const currentToken = token || (typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null);
    if (!currentToken) return;

    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setProfile(data.user);
          setUser({
            id: data.user.id,
            email: data.user.email,
            fullName: data.user.fullName,
            avatarUrl: data.user.avatarUrl || "🌱",
            googleId: data.user.googleId,
            role: data.user.role,
          });
        }
      } else if (res.status === 401) {
        // Token expired
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
        setProfile(null);
      }
    } catch (err) {
      console.warn("Failed to fetch /api/auth/me:", err);
    }
  }, [token]);

  // Refresh account linking state
  const refreshLinking = useCallback(async () => {
    const currentToken = token || (typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null);
    if (!currentToken) return;

    try {
      const res = await fetch("/api/linking/overview", {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setLinkingState({
            myLinkCode: data.myLinkCode || "",
            linkedAccounts: data.linkedAccounts || [],
            incomingRequests: data.incomingRequests || [],
            outgoingRequests: data.outgoingRequests || [],
          });
        }
      }
    } catch (err) {
      console.warn("Failed to fetch linking overview:", err);
    }
  }, [token]);

  // Initial authentication check on boot
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
      if (savedToken) {
        setToken(savedToken);
        try {
          const res = await fetch("/api/auth/me", {
            headers: { Authorization: `Bearer ${savedToken}` },
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.user) {
              setProfile(data.user);
              setUser({
                id: data.user.id,
                email: data.user.email,
                fullName: data.user.fullName,
                avatarUrl: data.user.avatarUrl || "🌱",
                googleId: data.user.googleId,
                role: data.user.role,
              });
            }
          } else {
            localStorage.removeItem(TOKEN_KEY);
            setToken(null);
          }
        } catch (err) {
          console.warn("Could not authenticate stored session:", err);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Sync linking state whenever user changes
  useEffect(() => {
    if (user && token) {
      refreshLinking();
    }
  }, [user, token, refreshLinking]);

  // Direct backend Google login helper
  const loginWithGoogleDirect = async (params: {
    email: string;
    fullName?: string;
    avatarUrl?: string;
    googleId?: string;
    role?: "student" | "parent";
    grade?: number;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (data.success && data.token && data.user) {
        saveSession(data.token, data.user);
        setWelcomeMessage(`Xin chào, ${data.user.fullName} 🌱 Chúc bạn một vụ mùa bội thu!`);
        return { success: true };
      }
      return { success: false, error: data.error || "Không thể đăng nhập bằng Google." };
    } catch (err: any) {
      return { success: false, error: err.message || "Lỗi kết nối máy chủ." };
    }
  };

  // Google OAuth flow: Uses official Google Identity Services popup if client ID configured,
  // or triggers seamless Google account connection
  const signInWithGoogle = async (options?: {
    role?: "student" | "parent";
    grade?: number;
  }): Promise<{ success: boolean; error?: string }> => {
    const googleClientId =
      (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID) ||
      (typeof window !== "undefined" && (window as any).GOOGLE_CLIENT_ID) ||
      "";

    // If Google Identity Services library is loaded and client ID exists, open official Google OAuth popup
    if (typeof window !== "undefined" && (window as any).google?.accounts?.oauth2 && googleClientId) {
      return new Promise((resolve) => {
        try {
          const client = (window as any).google.accounts.oauth2.initTokenClient({
            client_id: googleClientId,
            scope: "openid profile email",
            callback: async (tokenResponse: any) => {
              if (tokenResponse?.access_token) {
                try {
                  const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                  });
                  const gUser = await userInfoRes.json();
                  const result = await loginWithGoogleDirect({
                    googleId: gUser.sub,
                    email: gUser.email,
                    fullName: gUser.name,
                    avatarUrl: gUser.picture,
                    role: options?.role || "student",
                    grade: options?.grade || 7,
                  });
                  resolve(result);
                } catch (e: any) {
                  resolve({ success: false, error: e.message || "Lỗi lấy thông tin tài khoản Google." });
                }
              } else {
                resolve({ success: false, error: "Đã hủy đăng nhập Google." });
              }
            },
            error_callback: (err: any) => {
              resolve({ success: false, error: err.message || "Lỗi mở cửa sổ Google OAuth." });
            },
          });
          client.requestAccessToken();
        } catch (err: any) {
          resolve({ success: false, error: err.message || "Không thể mở Google OAuth." });
        }
      });
    }

    // If client ID is not set yet in Vercel/environment, let the caller open Google Sign-in Prompt
    return {
      success: false,
      error: "NO_CLIENT_ID",
    };
  };

  // Email / Password Login
  const signInWithEmail = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success && data.token && data.user) {
        saveSession(data.token, data.user);
        setWelcomeMessage(`Xin chào, ${data.user.fullName} 🌱 Chào mừng bạn quay trở lại!`);
        return { success: true };
      }
      return { success: false, error: data.error || "Email hoặc mật khẩu không chính xác." };
    } catch (err: any) {
      return { success: false, error: err.message || "Lỗi kết nối máy chủ." };
    }
  };

  // Email / Password Registration
  const signUpWithEmail = async (data: {
    email: string;
    password: string;
    fullName: string;
    role: "student" | "parent";
    grade?: number;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (resData.success && resData.token && resData.user) {
        saveSession(resData.token, resData.user);
        setWelcomeMessage(`Chào mừng ${resData.user.fullName} đến với Nông Trại Tri Thức! 🌱`);
        return { success: true };
      }
      return { success: false, error: resData.error || "Đăng ký không thành công." };
    } catch (err: any) {
      return { success: false, error: err.message || "Lỗi kết nối máy chủ." };
    }
  };

  // Sign out
  const signOut = async () => {
    const currentToken = token || (typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null);
    if (currentToken) {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentToken}`,
          },
          body: JSON.stringify({ token: currentToken }),
        });
      } catch (err) {
        console.warn("Logout API failed:", err);
      }
    }
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setProfile(null);
    setWelcomeMessage(null);
  };

  // Update profile
  const updateProfile = async (data: {
    fullName?: string;
    avatarUrl?: string;
    grade?: number;
  }): Promise<{ success: boolean; error?: string }> => {
    if (!token) return { success: false, error: "Chưa đăng nhập." };

    try {
      const res = await fetch("/api/auth/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (resData.success && resData.user) {
        setProfile(resData.user);
        setUser((prev) =>
          prev
            ? {
                ...prev,
                fullName: resData.user.fullName,
                avatarUrl: resData.user.avatarUrl,
              }
            : null
        );
        return { success: true };
      }
      return { success: false, error: resData.error || "Không thể cập nhật hồ sơ." };
    } catch (err: any) {
      return { success: false, error: err.message || "Lỗi kết nối." };
    }
  };

  // Sync gamified farm progress to backend database
  const syncProgress = async (progress: {
    knowledgePoints?: number;
    coins?: number;
    currentStreak?: number;
    totalPlanted?: number;
    totalHarvested?: number;
    plants?: Plant[];
    badges?: any[];
  }) => {
    if (!token) return;

    try {
      const res = await fetch("/api/user/sync-progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(progress),
      });
      if (res.ok) {
        const resData = await res.json();
        if (resData.success && resData.user) {
          setProfile(resData.user);
        }
      }
    } catch (err) {
      console.warn("Progress sync error:", err);
    }
  };

  // Account Linking: send request
  const sendLinkRequest = async (targetCodeOrEmail: string): Promise<{ success: boolean; error?: string }> => {
    if (!token) return { success: false, error: "Chưa đăng nhập." };

    try {
      const res = await fetch("/api/linking/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetCodeOrEmail }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshLinking();
        return { success: true };
      }
      return { success: false, error: data.error || "Không thể gửi yêu cầu liên kết." };
    } catch (err: any) {
      return { success: false, error: err.message || "Lỗi kết nối." };
    }
  };

  // Account Linking: respond (accept / reject)
  const respondLinkRequest = async (linkId: string, action: "accept" | "reject"): Promise<{ success: boolean; error?: string }> => {
    if (!token) return { success: false, error: "Chưa đăng nhập." };

    try {
      const res = await fetch("/api/linking/respond", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ linkId, action }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshLinking();
        return { success: true };
      }
      return { success: false, error: data.error || "Không thể xử lý yêu cầu liên kết." };
    } catch (err: any) {
      return { success: false, error: err.message || "Lỗi kết nối." };
    }
  };

  // Account Linking: unlink
  const unlinkAccountRequest = async (linkId: string): Promise<{ success: boolean; error?: string }> => {
    if (!token) return { success: false, error: "Chưa đăng nhập." };

    try {
      const res = await fetch("/api/linking/unlink", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ linkId }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshLinking();
        return { success: true };
      }
      return { success: false, error: data.error || "Không thể hủy liên kết." };
    } catch (err: any) {
      return { success: false, error: err.message || "Lỗi kết nối." };
    }
  };

  const displayName = profile?.fullName || user?.fullName || user?.email?.split("@")[0] || "";
  const greeting = displayName ? `Xin chào, ${displayName} 🌱` : "";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        profile,
        loading,
        greeting,
        welcomeMessage,
        linkingState,
        clearWelcomeMessage: () => setWelcomeMessage(null),
        signInWithGoogle,
        loginWithGoogleDirect,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        updateProfile,
        refreshProfile,
        syncProgress,
        refreshLinking,
        sendLinkRequest,
        respondLinkRequest,
        unlinkAccountRequest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
