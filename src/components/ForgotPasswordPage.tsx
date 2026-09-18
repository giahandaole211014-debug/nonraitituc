import React, { useState } from "react";
import { Mail, ArrowRight, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";

interface ForgotPasswordPageProps {
  onNavigate: (path: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage("Vui lòng nhập địa chỉ email.");
      return;
    }

    setLoading(true);

    try {
      // Simulate sending secure password reset instructions
      await new Promise((resolve) => setTimeout(resolve, 600));
      setIsSent(true);
    } catch (err: any) {
      setErrorMessage("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xl relative">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
            <Mail className="w-6 h-6" />
          </div>
          <h1 className="font-display font-black text-2xl text-stone-900">
            Quên Mật Khẩu?
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Nhập email tài khoản của bạn để nhận hướng dẫn khôi phục mật khẩu
          </p>
        </div>

        {isSent ? (
          <div className="text-center py-4 space-y-4 animate-in fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 leading-relaxed">
              <p className="font-bold text-sm">Đã gửi hướng dẫn khôi phục mật khẩu!</p>
              <p className="mt-1 text-emerald-700">
                Vui lòng kiểm tra hòm thư <strong>{email}</strong> để đặt lại mật khẩu mới. Nếu bạn sử dụng tài khoản Google, hãy chọn "Tiếp tục với Google" tại trang đăng nhập.
              </p>
            </div>
            <button
              onClick={() => onNavigate("/login")}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại trang Đăng nhập</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div className="flex-1">{errorMessage}</div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Email tài khoản đã đăng ký <span className="text-red-500">*</span>
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
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-stone-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang xử lý...
                </span>
              ) : (
                <>
                  <span>Gửi hướng dẫn khôi phục</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => onNavigate("/login")}
                className="text-xs font-semibold text-stone-500 hover:text-stone-800 cursor-pointer inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Quay lại Đăng nhập
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
