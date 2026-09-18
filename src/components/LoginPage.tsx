import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { GoogleSignInModal } from "./GoogleSignInModal";
import { Mail, Lock, AlertCircle, ArrowRight, Sprout, CheckCircle2 } from "lucide-react";

interface LoginPageProps {
  onNavigate: (path: string) => void;
  onLoginSuccess?: () => void;
  noticeMessage?: string | null;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigate,
  onLoginSuccess,
  noticeMessage,
}) => {
  const { signInWithGoogle, signInWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  // Handle Google OAuth Sign In
  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setGoogleLoading(true);

    try {
      const result = await signInWithGoogle();
      if (result.success) {
        setSuccessMessage("Đăng nhập Google thành công!");
        if (onLoginSuccess) onLoginSuccess();
        setTimeout(() => {
          onNavigate("/dashboard");
        }, 400);
      } else if (result.error === "NO_CLIENT_ID") {
        // Open Google sign-in modal
        setIsGoogleModalOpen(true);
      } else if (result.error) {
        setErrorMessage(result.error);
      }
    } catch (err: any) {
      setErrorMessage("Không thể đăng nhập bằng Google. Vui lòng thử lại.");
    } finally {
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

    setLoading(true);

    try {
      const result = await signInWithEmail(trimmedEmail, password);
      if (result.success) {
        setSuccessMessage("Đăng nhập thành công!");
        if (onLoginSuccess) {
          onLoginSuccess();
        }
        setTimeout(() => {
          onNavigate("/dashboard");
        }, 400);
      } else {
        setErrorMessage(result.error || "Email hoặc mật khẩu không chính xác.");
      }
    } catch (err: any) {
      setErrorMessage("Email hoặc mật khẩu không chính xác.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-emerald-100 p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-500 text-white shadow-md shadow-emerald-200 mb-1">
            <Sprout className="w-7 h-7 animate-pulse" />
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-stone-900 tracking-tight">
            Chào mừng đến với Nông Trại Tri Thức 🌱
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 italic">
            “Đăng nhập để bắt đầu gieo mầm tri thức.”
          </p>
        </div>

        {/* Notice Message from route redirects */}
        {noticeMessage && !errorMessage && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{noticeMessage}</span>
          </div>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span className="flex-1">{errorMessage}</span>
          </div>
        )}

        {/* Success Notification */}
        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Primary Action: Official Google OAuth Button */}
        <div>
          <button
            type="button"
            id="google-login-button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full py-3.5 px-4 rounded-2xl border-2 border-stone-200 hover:border-blue-500 bg-white hover:bg-stone-50/80 text-stone-800 font-extrabold text-sm flex items-center justify-center gap-3 shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
          >
            {googleLoading ? (
              <span className="text-xs text-stone-500">Đang mở Google OAuth...</span>
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
                <span>🔵 Tiếp tục với Google</span>
              </>
            )}
          </button>
          <p className="text-[11px] text-center text-stone-400 mt-2">
            Đăng nhập tài khoản Google thật • Giữ nguyên điểm và cây đã trồng
          </p>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-stone-200 w-full" />
          <span className="bg-white px-3 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
            hoặc đăng nhập bằng email
          </span>
        </div>

        {/* Standard Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Địa chỉ Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tenban@gmail.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-stone-700">Mật khẩu</label>
              <button
                type="button"
                onClick={() => onNavigate("/forgot-password")}
                className="text-xs text-emerald-700 hover:underline font-semibold cursor-pointer"
              >
                Quên mật khẩu?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            id="email-login-submit-btn"
            disabled={loading}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-md shadow-emerald-700/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <span>Đang kiểm tra...</span>
            ) : (
              <>
                <span>Đăng nhập</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="pt-2 text-center border-t border-stone-100">
          <p className="text-xs text-stone-600">
            Chưa có tài khoản nông trại?{" "}
            <button
              id="goto-register-btn"
              onClick={() => onNavigate("/register")}
              className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer ml-1"
            >
              👤 Đăng ký tài khoản mới
            </button>
          </p>
        </div>
      </div>

      {/* Google Sign-in Modal */}
      <GoogleSignInModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSuccess={() => {
          if (onLoginSuccess) onLoginSuccess();
          onNavigate("/dashboard");
        }}
        defaultRole="student"
      />
    </div>
  );
};
