import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { GoogleSignInModal } from "./GoogleSignInModal";
import { User, Mail, Lock, CheckCircle2, AlertCircle, ArrowRight, Sprout, Users } from "lucide-react";

interface RegisterPageProps {
  onNavigate: (path: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { signInWithGoogle, signUpWithEmail } = useAuth();
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
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  // Email validator
  const isValidEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  // Google OAuth Sign In / Sign Up
  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setGoogleLoading(true);

    try {
      const result = await signInWithGoogle({ role, grade });
      if (result.success) {
        onNavigate("/dashboard");
      } else if (result.error === "NO_CLIENT_ID") {
        setIsGoogleModalOpen(true);
      } else if (result.error) {
        setErrorMessage(result.error);
      }
    } catch (err: any) {
      setErrorMessage("Không thể đăng ký bằng Google. Vui lòng thử lại.");
    } finally {
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

    if (password.length < 8) {
      setErrorMessage("Mật khẩu phải có tối thiểu 8 ký tự.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Mật khẩu nhập lại không khớp. Vui lòng kiểm tra lại.");
      return;
    }

    setLoading(true);

    try {
      const res = await signUpWithEmail({
        email: trimmedEmail,
        password,
        fullName: trimmedName,
        role,
        grade: role === "student" ? grade : undefined,
      });

      if (!res.success) {
        setErrorMessage(res.error || "Đăng ký không thành công. Vui lòng thử lại.");
        setLoading(false);
        return;
      }

      setIsSuccess(true);
      setTimeout(() => {
        onNavigate("/dashboard");
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || "Đã xảy ra lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-emerald-100 p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-500 text-white shadow-md shadow-emerald-200 mb-1">
            <Sprout className="w-7 h-7" />
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-stone-900 tracking-tight">
            Đăng ký tài khoản Nông Trại 🌱
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Tạo tài khoản thật bằng Email hoặc tiếp tục với Google
          </p>
        </div>

        {/* Success Banner */}
        {isSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Đăng ký thành công!</p>
              <p className="text-emerald-700 mt-1">Đang chuyển bạn đến khu vườn tri thức...</p>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span className="flex-1">{errorMessage}</span>
          </div>
        )}

        {/* Google OAuth Button */}
        <div>
          <button
            type="button"
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
            Đăng nhập nhanh với tài khoản Google thật
          </p>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-stone-200 w-full" />
          <span className="bg-white px-3 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
            hoặc đăng ký bằng email
          </span>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role selection tab */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-2">
              Bạn tham gia với tư cách:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`py-3 px-3 rounded-2xl border text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  role === "student"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs ring-1 ring-emerald-500"
                    : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                }`}
              >
                <Sprout className="w-4 h-4 text-emerald-600" />
                <span>🌱 Học sinh THCS</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("parent")}
                className={`py-3 px-3 rounded-2xl border text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  role === "parent"
                    ? "bg-blue-50 border-blue-500 text-blue-900 shadow-xs ring-1 ring-blue-500"
                    : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                }`}
              >
                <Users className="w-4 h-4 text-blue-600" />
                <span>👨👩👧 Phụ huynh</span>
              </button>
            </div>
          </div>

          {/* Full name & Grade */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className={role === "student" ? "sm:col-span-2" : "sm:col-span-3"}>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
            </div>

            {role === "student" && (
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Khối lớp THCS
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                >
                  <option value={6}>Lớp 6</option>
                  <option value={7}>Lớp 7</option>
                  <option value={8}>Lớp 8</option>
                  <option value={9}>Lớp 9</option>
                </select>
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Địa chỉ Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tenban@gmail.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Mật khẩu (≥ 8 ký tự) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Nhập lại mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-md shadow-emerald-700/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <span>Đang tạo tài khoản...</span>
            ) : (
              <>
                <span>Hoàn tất đăng ký & Bắt đầu gieo mầm</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="pt-2 text-center border-t border-stone-100">
          <p className="text-xs text-stone-600">
            Đã có tài khoản nông trại?{" "}
            <button
              onClick={() => onNavigate("/login")}
              className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer ml-1"
            >
              🔑 Đăng nhập ngay
            </button>
          </p>
        </div>
      </div>

      {/* Google Sign-in Modal */}
      <GoogleSignInModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSuccess={() => onNavigate("/dashboard")}
        defaultRole={role}
      />
    </div>
  );
};
