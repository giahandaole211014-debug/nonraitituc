import React, { useState } from "react";
import { UserRole, StudentGrade } from "../types";
import { User, Users, GraduationCap, ArrowRight } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: UserRole, grade?: StudentGrade, studentId?: string, customName?: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSelectRole,
}) => {
  const [roleTab, setRoleTab] = useState<UserRole>("student");
  const [selectedGrade, setSelectedGrade] = useState<StudentGrade>(7);
  const [customName, setCustomName] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 text-xl font-bold w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center"
        >
          ✕
        </button>

        <div className="text-center space-y-2 mb-6">
          <span className="text-4xl">🌱</span>
          <h2 className="font-display font-black text-2xl text-stone-900">
            Nông Trại Tri Thức
          </h2>
          <p className="text-xs text-stone-500">
            Chọn vai trò để trải nghiệm trọn vẹn nền tảng học tập gamification
          </p>
        </div>

        {/* Role Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-stone-100 rounded-2xl mb-6 text-xs font-bold">
          <button
            onClick={() => setRoleTab("student")}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              roleTab === "student"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <User className="w-3.5 h-3.5" /> Học sinh
          </button>
          <button
            onClick={() => setRoleTab("parent")}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              roleTab === "parent"
                ? "bg-white text-blue-800 shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Phụ huynh
          </button>
          <button
            onClick={() => setRoleTab("teacher")}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              roleTab === "teacher"
                ? "bg-white text-purple-800 shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" /> Giáo viên
          </button>
        </div>

        {/* Student Mode Content */}
        {roleTab === "student" && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-2">
                Chọn khối lớp THCS:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {([6, 7, 8, 9] as StudentGrade[]).map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedGrade(g)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      selectedGrade === g
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    Lớp {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Hoặc chọn nhanh tài khoản mẫu:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onSelectRole("student", 7, "giahan7");
                    onClose();
                  }}
                  className="p-2.5 rounded-xl border border-emerald-300 bg-emerald-50/70 text-left text-xs hover:bg-emerald-100 transition-colors"
                >
                  <div className="font-bold text-emerald-950">👧 Gia Hân (Lớp 7)</div>
                  <div className="text-[10px] text-emerald-700">Mẫu mặc định • Cấp 4</div>
                </button>
                <button
                  onClick={() => {
                    onSelectRole("student", 6, "tuankiet6");
                    onClose();
                  }}
                  className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-left text-xs hover:bg-stone-100 transition-colors"
                >
                  <div className="font-bold text-stone-900">👦 Tuấn Kiệt (Lớp 6)</div>
                  <div className="text-[10px] text-stone-500">Khởi đầu • Cấp 3</div>
                </button>
                <button
                  onClick={() => {
                    onSelectRole("student", 8, "minhanh8");
                    onClose();
                  }}
                  className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-left text-xs hover:bg-stone-100 transition-colors"
                >
                  <div className="font-bold text-stone-900">👧 Minh Anh (Lớp 8)</div>
                  <div className="text-[10px] text-stone-500">Cây sum suê • Cấp 5</div>
                </button>
                <button
                  onClick={() => {
                    onSelectRole("student", 9, "hoanglong9");
                    onClose();
                  }}
                  className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-left text-xs hover:bg-stone-100 transition-colors"
                >
                  <div className="font-bold text-stone-900">🧑 Hoàng Long (Lớp 9)</div>
                  <div className="text-[10px] text-stone-500">Ôn thi vào 10 • Cấp 6</div>
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100">
              <button
                onClick={() => {
                  onSelectRole("student", selectedGrade, undefined, customName || `Học sinh Lớp ${selectedGrade}`);
                  onClose();
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Vào Nông Trại Lớp {selectedGrade}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Parent Mode Content */}
        {roleTab === "parent" && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 leading-relaxed">
              <strong>Đăng nhập với vai trò Phụ huynh:</strong> Theo dõi sát sao tiến độ học tập, cây trồng, các môn con đang yếu và nhận xét của giáo viên.
            </div>

            <button
              onClick={() => {
                onSelectRole("parent");
                onClose();
              }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>Xem Bảng Điều Khiển Của Mẹ Thu Hương</span>
            </button>
          </div>
        )}

        {/* Teacher Mode Content */}
        {roleTab === "teacher" && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-xs text-purple-900 leading-relaxed">
              <strong>Đăng nhập với vai trò Giáo viên:</strong> Quản lý danh sách học sinh Lớp 7A & 8B, phân tích các lỗi sai hay gặp, gửi nhận xét cho phụ huynh và phát động bài tập mới.
            </div>

            <button
              onClick={() => {
                onSelectRole("teacher");
                onClose();
              }}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Vào Bàn Làm Việc Của Cô Mai Lan</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
