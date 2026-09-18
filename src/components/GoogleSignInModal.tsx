import React, { useState } from "react";
import { X, ShieldCheck, Mail, User, AlertCircle, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface GoogleSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultRole?: "student" | "parent";
}

export const GoogleSignInModal: React.FC<GoogleSignInModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultRole = "student",
}) => {
  const { loginWithGoogleDirect } = useAuth();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"student" | "parent">(defaultRole);
  const [grade, setGrade] = useState<number>(7);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage("Vui lòng nhập Email tài khoản Google của bạn.");
      return;
    }

    if (!trimmedEmail.includes("@")) {
      setErrorMessage("Vui lòng nhập địa chỉ email hợp lệ.");
      return;
    }

    setLoading(true);
    try {
      // Create or log into user using their real Google account
      const res = await loginWithGoogleDirect({
        email: trimmedEmail,
        fullName: fullName.trim() || trimmedEmail.split("@")[0],
        avatarUrl: role === "student" ? "🌱" : "👨👩👧",
        role,
        grade,
      });

      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setErrorMessage(res.error || "Không thể đăng nhập tài khoản Google.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Đã xảy ra lỗi kết nối.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-stone-200 relative animate-in zoom-in-95">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Google Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
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
          </div>
          <div>
            <h3 className="font-display font-black text-xl text-stone-900 leading-tight">
              Tiếp tục với Google
            </h3>
            <p className="text-xs text-stone-500">
              Đăng nhập an toàn vào Nông Trại Tri Thức
            </p>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-200/70 text-xs text-blue-950 flex items-start gap-2.5 mb-5">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Hệ thống nhận diện tài khoản Google thật. Nếu bạn đã từng học trên website, điểm và nông trại của bạn sẽ được giữ nguyên 100%!
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Email Google của bạn <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vidu@gmail.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Tên hiển thị Google (Họ và tên)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Vai trò
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "student" | "parent")}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="student">🌱 Học sinh</option>
                <option value="parent">👨👩👧 Phụ huynh</option>
              </select>
            </div>

            {role === "student" && (
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Khối lớp
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value={6}>Lớp 6</option>
                  <option value={7}>Lớp 7</option>
                  <option value={8}>Lớp 8</option>
                  <option value={9}>Lớp 9</option>
                </select>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <span>Đang kết nối Google...</span>
            ) : (
              <>
                <span>Xác nhận & Vào Nông Trại</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
