import React, { useState, useEffect } from "react";
import { getSupabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, AlertCircle, ArrowRight, Sprout, CheckCircle2 } from "lucide-react";

interface LoginPageProps {
  onNavigate: (path: string) => void;
  onLoginSuccess?: () => void;
  onOpenConfig?: () => void;
  noticeMessage?: string | null;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigate,
  onLoginSuccess,
  onOpenConfig,
  noticeMessage,
}) => {
  const { signInWithGoogle, isConfigured } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Check URL parameters for OAuth error responses
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      const search = window.location.search;
      const urlParams = new URLSearchParams(search);
      const hashParams = new URLSearchParams(hash.replace(/^#/, ""));

      const error = urlParams.get("error") || hashParams.get("error");
      const errorDesc = (urlParams.get("error_description") || hashParams.get("error_description") || "").toLowerCase();

      if (error) {
        if (error === "access_denied" || errorDesc.includes("cancel") || errorDesc.includes("denied")) {
          setErrorMessage("Bạn đã hủy đăng nhập Google.");
        } else if (errorDesc.includes("expired") || errorDesc.includes("timeout")) {
          setErrorMessage("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        } else if (errorDesc.includes("linked") || errorDesc.includes("already registered")) {
          setErrorMessage("Tài khoản Google đã được liên kết với tài khoản này.");
        } else {
          setErrorMessage("Không thể đăng nhập bằng Google. Vui lòng thử lại.");
        }
        // Clean URL to avoid repeated error on reload
        window.history.replaceState(null, "", window.location.pathname);
      }
    }
  }, []);

  // Handle Google OAuth Sign In
  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const supabase = getSupabase();
    if (!supabase) {
      setErrorMessage("Chưa cấu hình Supabase URL và Anon Key. Vui lòng nhấn cài đặt kết nối Supabase phía dưới.");
      if (onOpenConfig) onOpenConfig();
      return;
    }

    setGoogleLoading(true);

    try {
      const result = await signInWithGoogle();
      if (!result.success && result.error) {
        const err = result.error.toLowerCase();
        if (err.includes("cancel") || err.includes("denied")) {
          setErrorMessage("Bạn đã hủy đăng nhập Google.");
        } else if (err.includes("expired")) {
          setErrorMessage("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        } else {
          setErrorMessage("Không thể đăng nhập bằng Google. Vui lòng thử lại.");
        }
        setGoogleLoading(false);
      }
      // If success, Supabase will redirect the browser to Google OAuth consent
    } catch (err: any) {
      setErrorMessage("Không thể đăng nhập bằng Google. Vui lòng thử lại.");
      setGoogleLoading(false);
    }
  };

  // Handle standard Email / Password Sign In
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setErrorMessage("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      setErrorMessage("Chưa cấu hình Supabase URL và Anon Key. Vui lòng nhấn cài đặt kết nối Supabase phía dưới.");
      if (onOpenConfig) onOpenConfig();
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: password,
      });

      if (error) {
        const msg = error.message.toLowerCase();
        if (msg.includes("email not confirmed") || msg.includes("email unconfirmed") || msg.includes("not confirmed")) {
          setErrorMessage("Vui lòng xác nhận email trước khi đăng nhập.");
        } else {
          setErrorMessage("Email hoặc mật khẩu không chính xác.");
        }
        setLoading(false);
        return;
      }

      if (data?.session && data?.user) {
        setSuccessMessage("Đăng nhập thành công!");
        if (onLoginSuccess) {
          onLoginSuccess();
        }
        setTimeout(() => {
          onNavigate("/dashboard");
        }, 400);
      }
    } catch (err: any) {
      setErrorMessage("Email hoặc mật khẩu không chính xác.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xl relative">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Sprout className="w-7 h-7 animate-bounce" />
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-stone-900 tracking-tight">
            Đăng nhập vào Nông Trại Tri Thức
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Đăng nhập để tiếp tục chăm sóc khu vườn tri thức và hoàn thành nhiệm vụ
          </p>
        </div>

        {/* Notice Banner (e.g. redirected from protected page) */}
        {noticeMessage && !errorMessage && (
          <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1 font-semibold">{noticeMessage}</div>
          </div>
        )}

        {/* Error banner */}
        {errorMessage && (
          <div className="mb-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1 font-semibold">{errorMessage}</div>
          </div>
        )}

        {/* Success banner */}
        {successMessage && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1 font-semibold">{successMessage}</div>
          </div>
        )}

        {/* Section 2 & 6: Nút “Tiếp tục với Google” */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="w-full py-3 px-4 bg-white hover:bg-stone-50 text-stone-700 font-extrabold text-sm rounded-2xl border-2 border-stone-200 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
          >
            {googleLoading ? (
              <span className="inline-flex items-center gap-2 text-stone-600">
                <span className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                Đang chuyển đến Google...
              </span>
            ) : (
              <>
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Tiếp tục với Google</span>
              </>
            )}
          </button>
        </div>

        {/* Divider: ──────── hoặc ──────── */}
        <div className="relative flex items-center justify-center my-5">
          <div className="border-t border-stone-200 w-full" />
          <span className="bg-white px-3 text-xs text-stone-400 font-semibold shrink-0 uppercase tracking-wider">
            hoặc
          </span>
          <div className="border-t border-stone-200 w-full" />
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-stone-800 placeholder:text-stone-400"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-stone-700">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              {/* Quên mật khẩu? */}
              <button
                type="button"
                onClick={() => onNavigate("/forgot-password")}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold hover:underline cursor-pointer"
              >
                Quên mật khẩu?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-stone-800 placeholder:text-stone-400"
              />
            </div>
          </div>

          {/* Submit Button: Đăng nhập */}
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-sm rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang xác thực...
              </span>
            ) : (
              <>
                <span>Đăng nhập</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Link to Register: Đăng ký tài khoản */}
          <div className="text-center pt-3 border-t border-stone-100">
            <span className="text-xs text-stone-500">Chưa có tài khoản? </span>
            <button
              type="button"
              onClick={() => onNavigate("/register")}
              className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
            >
              Đăng ký tài khoản
            </button>
          </div>

          {/* Supabase connection quick config helper */}
          {onOpenConfig && (
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={onOpenConfig}
                className="text-[11px] text-stone-400 hover:text-stone-700 underline cursor-pointer"
              >
                ⚙️ Hướng dẫn & Cài đặt Supabase / Google OAuth
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
