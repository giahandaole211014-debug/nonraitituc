import React, { useState } from "react";
import { getSupabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Lock, CheckCircle2, AlertCircle, ArrowRight, Sprout, Users } from "lucide-react";

interface RegisterPageProps {
  onNavigate: (path: string) => void;
  onOpenConfig?: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate, onOpenConfig }) => {
  const { signInWithGoogle } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"student" | "parent">("student");
  const [grade, setGrade] = useState<number>(7);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Email validator
  const isValidEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  // Google OAuth Sign In / Sign Up
  const handleGoogleSignIn = async () => {
    setErrorMessage(null);

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
    } catch (err: any) {
      setErrorMessage("Không thể đăng nhập bằng Google. Vui lòng thử lại.");
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setErrorMessage("Vui lòng nhập Họ và tên.");
      return;
    }

    if (!trimmedEmail) {
      setErrorMessage("Vui lòng nhập email.");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setErrorMessage("Email không hợp lệ. Vui lòng nhập đúng định dạng (vd: hocsinh@gmail.com).");
      return;
    }

    // Mật khẩu tối thiểu 8 ký tự
    if (password.length < 8) {
      setErrorMessage("Mật khẩu phải có tối thiểu 8 ký tự.");
      return;
    }

    // Kiểm tra mật khẩu nhập lại
    if (password !== confirmPassword) {
      setErrorMessage("Mật khẩu nhập lại không khớp. Vui lòng kiểm tra lại.");
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
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: password,
        options: {
          data: {
            full_name: trimmedName,
            role: role,
            grade: role === "student" ? grade : undefined,
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) {
        if (error.message.includes("already registered") || error.message.includes("User already exists")) {
          setErrorMessage("Email này đã được đăng ký tài khoản. Vui lòng dùng email khác hoặc Đăng nhập.");
        } else {
          setErrorMessage(error.message || "Đăng ký không thành công. Vui lòng thử lại.");
        }
        setLoading(false);
        return;
      }

      if (data?.user) {
        setIsSuccess(true);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Đã xảy ra lỗi kết nối. Vui lòng thử lại.");
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
            Tạo tài khoản Nông Trại Tri Thức
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Gia nhập Nông Trại Tri Thức để bắt đầu hành trình học tập gamification
          </p>
        </div>

        {/* Success Message Screen */}
        {isSuccess ? (
          <div className="text-center py-6 space-y-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
              <p className="text-sm sm:text-base font-extrabold text-emerald-900">
                “Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.”
              </p>
              <p className="text-xs text-emerald-700 mt-2">
                Hệ thống Supabase đã gửi một liên kết xác thực đến hộp thư <strong>{email}</strong>. Bạn cần bấm xác nhận trong email trước khi đăng nhập.
              </p>
            </div>
            <button
              onClick={() => onNavigate("/login")}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Đi đến trang Đăng nhập</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Error banner */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div className="flex-1">{errorMessage}</div>
              </div>
            )}

            {/* Section 2 & 6: Nút “Tiếp tục với Google” */}
            <div>
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
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-stone-200 w-full" />
              <span className="bg-white px-3 text-xs text-stone-400 font-semibold shrink-0 uppercase tracking-wider">
                hoặc
              </span>
              <div className="border-t border-stone-200 w-full" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Họ và tên */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ví dụ: Lê Đào Gia Hân"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-stone-800 placeholder:text-stone-400"
                  />
                </div>
              </div>

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

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Vai trò <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("student")}
                    className={`py-2 px-3 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      role === "student"
                        ? "bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs"
                        : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                    }`}
                  >
                    <User className="w-4 h-4 text-emerald-600" />
                    <span>Học sinh</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("parent")}
                    className={`py-2 px-3 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      role === "parent"
                        ? "bg-blue-50 border-blue-500 text-blue-800 shadow-xs"
                        : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                    }`}
                  >
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>Phụ huynh</span>
                  </button>
                </div>
              </div>

              {/* Grade Selection */}
              {role === "student" && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Khối lớp THCS
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[6, 7, 8, 9].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGrade(g)}
                        className={`py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          grade === g
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                            : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
                        }`}
                      >
                        Lớp {g}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Mật khẩu */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Mật khẩu <span className="text-red-500">* (tối thiểu 8 ký tự)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tối thiểu 8 ký tự"
                    minLength={8}
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-stone-800 placeholder:text-stone-400"
                  />
                </div>
              </div>

              {/* Nhập lại mật khẩu */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Nhập lại mật khẩu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại đúng mật khẩu trên"
                    minLength={8}
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-stone-800 placeholder:text-stone-400"
                  />
                </div>
              </div>

              {/* Submit Button: Đăng ký */}
              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-sm rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang xử lý đăng ký...
                  </span>
                ) : (
                  <>
                    <span>Đăng ký</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Link to Login */}
              <div className="text-center pt-2 border-t border-stone-100">
                <span className="text-xs text-stone-500">Đã có tài khoản? </span>
                <button
                  type="button"
                  onClick={() => onNavigate("/login")}
                  className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                >
                  Đăng nhập
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
        )}
      </div>
    </div>
  );
};
