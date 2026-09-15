import React, { useState } from "react";
import {
  GraduationCap,
  Users,
  PlusCircle,
  Send,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  FileText,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { TeacherProfile } from "../types";

interface TeacherDashboardViewProps {
  teacher: TeacherProfile;
  onSendFeedbackToParent: (studentName: string, message: string) => void;
  onAssignNewTaskToClass: (taskTitle: string, subject: string, rewardItem: string) => void;
}

export const TeacherDashboardView: React.FC<TeacherDashboardViewProps> = ({
  teacher,
  onSendFeedbackToParent,
  onAssignNewTaskToClass,
}) => {
  const [activeClassTab, setActiveClassTab] = useState(teacher.classes[0]);
  const [selectedStudentIndex, setSelectedStudentIndex] = useState(0);

  // Feedback form state
  const [feedbackText, setFeedbackText] = useState(
    "Em hiểu khá tốt kiến thức cơ bản nhưng cần cẩn thận hơn khi tính toán các phép chia số thập phân."
  );
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Task creation state
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("Luyện tập phương trình bậc nhất một ẩn");
  const [newTaskSubject, setNewTaskSubject] = useState("Toán");
  const [newTaskReward, setNewTaskReward] = useState("Hạt Giống Cây Cam Logic (+60 Xu)");

  const currentStudent = teacher.students[selectedStudentIndex] || teacher.students[0];

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    onSendFeedbackToParent(currentStudent.name, feedbackText);
    setFeedbackSuccess(true);
    setTimeout(() => setFeedbackSuccess(false), 3000);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    onAssignNewTaskToClass(newTaskTitle, newTaskSubject, newTaskReward);
    setShowTaskModal(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
              <GraduationCap className="w-3.5 h-3.5" />
              Bàn Làm Việc Giáo Viên
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-stone-900 mt-2 flex items-center gap-2">
              <span>👩🏫</span> BẢNG QUẢN LÝ LỚP HỌC & GIÁO ÁN
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Giáo viên: <strong className="text-purple-900 font-bold">{teacher.name}</strong> • Bộ môn: {teacher.subject}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTaskModal(true)}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all hover:scale-105 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Giao Nhiệm Vụ Mới
            </button>
          </div>
        </div>
      </div>

      {/* Class Overview Analytics Bar (Section 13.4) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs">
          <div className="text-xs font-bold text-stone-500 uppercase">Tỷ lệ hoàn thành nhiệm vụ</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-display font-black text-3xl text-emerald-700">89.4%</span>
            <span className="text-xs font-bold text-emerald-600">↑ +4% tuần qua</span>
          </div>
          <p className="text-xs text-stone-500 mt-1">Học sinh rất tích cực chăm sóc nông trại</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs">
          <div className="text-xs font-bold text-stone-500 uppercase">Điểm trung bình cả lớp</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-display font-black text-3xl text-purple-700">83.6</span>
            <span className="text-xs font-bold text-stone-400">/ 100 điểm</span>
          </div>
          <p className="text-xs text-stone-500 mt-1">Môn Khoa học & Tiếng Anh đạt điểm cao nhất</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs">
          <div className="text-xs font-bold text-stone-500 uppercase">Môn học cần hỗ trợ thêm</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-display font-black text-xl text-amber-600">Lịch sử & Địa lý</span>
          </div>
          <p className="text-xs text-stone-500 mt-1">Cần thêm các câu hỏi trắc nghiệm xâu chuỗi sự kiện</p>
        </div>
      </div>

      {/* Class Progress Table (Section 13.1) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div>
            <h3 className="font-display font-extrabold text-lg text-stone-900 flex items-center gap-2">
              <span>📋</span> Bảng Theo Dõi Tiến Độ Lớp {activeClassTab}
            </h3>
            <p className="text-xs text-stone-500">
              Nhấp vào từng học sinh để xem chi tiết bài làm, câu trả lời sai và gửi nhận xét cho phụ huynh
            </p>
          </div>

          {/* Class Switcher */}
          <div className="flex gap-2">
            {teacher.classes.map((cls) => (
              <button
                key={cls}
                onClick={() => setActiveClassTab(cls)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeClassTab === cls
                    ? "bg-purple-600 text-white shadow-xs"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                Lớp {cls}
              </button>
            ))}
          </div>
        </div>

        {/* Student Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-3">Học sinh</th>
                <th className="py-3 px-3">Toán</th>
                <th className="py-3 px-3">Ngữ văn</th>
                <th className="py-3 px-3">Khoa học</th>
                <th className="py-3 px-3">Tiến bộ</th>
                <th className="py-3 px-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {teacher.students.map((st, idx) => {
                const isSelected = selectedStudentIndex === idx;
                return (
                  <tr
                    key={st.id}
                    onClick={() => setSelectedStudentIndex(idx)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? "bg-purple-50/70 font-semibold" : "hover:bg-stone-50"
                    }`}
                  >
                    <td className="py-3 px-3 font-bold text-stone-900 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      {st.name}
                    </td>
                    <td className="py-3 px-3 font-semibold text-emerald-700">{st.mathScore}%</td>
                    <td className="py-3 px-3 font-semibold text-stone-700">{st.litScore}%</td>
                    <td className="py-3 px-3 font-semibold text-emerald-700">{st.sciScore}%</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {st.progressTrend}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStudentIndex(idx);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-purple-100 text-stone-700 hover:text-purple-800 text-[11px] font-bold"
                      >
                        Xem & Nhận xét
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Student Deep Dive: Wrong Answers & Feedback (Section 13.2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wrong Answers Inspection */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-extrabold text-base text-stone-900 flex items-center gap-2">
              <span>🔍</span> Lỗi Sai Của: {currentStudent.name}
            </h3>
            <span className="text-xs text-stone-400">Lớp {activeClassTab}</span>
          </div>

          <p className="text-xs text-stone-500">
            Hệ thống tự động gom các câu học sinh trả lời sai trong bài luyện tập gần nhất để giáo viên nắm bắt lỗ hổng kiến thức:
          </p>

          <div className="space-y-3">
            {currentStudent.recentMistakes.map((m, i) => (
              <div key={i} className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-amber-900 font-bold">
                  <span>Môn: {m.subject}</span>
                  <span className="text-red-600 font-extrabold">Học sinh chọn: {m.studentChoice}</span>
                </div>
                <div className="font-semibold text-stone-800">“{m.question}”</div>
                <div className="text-emerald-800 font-bold bg-white/80 p-2 rounded-xl border border-amber-200">
                  ✓ Đáp án đúng: {m.correctChoice}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback to Parent Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-purple-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-800">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-base text-stone-900">
                Viết Nhận Xét Cho Phụ Huynh
              </h3>
              <p className="text-xs text-stone-500">
                Nhận xét sẽ được gửi trực tiếp đến Bảng Điều Khiển của phụ huynh em {currentStudent.name}
              </p>
            </div>
          </div>

          <form onSubmit={handleSendFeedback} className="space-y-3">
            <textarea
              rows={4}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Nhập lời nhận xét chân thành, mang tính xây dựng..."
              className="w-full p-3.5 rounded-2xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs leading-relaxed"
            />

            {feedbackSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Đã gửi nhận xét thành công đến Phụ huynh em {currentStudent.name}!
              </div>
            )}

            <button
              id="btn-send-teacher-feedback"
              type="submit"
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-2xl shadow-sm transition-all hover:scale-102 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              Gửi Nhận Xét Ngay
            </button>
          </form>
        </div>
      </div>

      {/* Task Creation Modal (Section 13.3) */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 relative">
            <button
              onClick={() => setShowTaskModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 text-xl font-bold w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center"
            >
              ✕
            </button>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <span className="text-3xl">🌱</span>
                <h3 className="font-display font-black text-xl text-stone-900 mt-2">
                  Giao Nhiệm Vụ Mới Cho Cả Lớp
                </h3>
                <p className="text-xs text-stone-500">
                  Học sinh hoàn thành bài này sẽ nhận được cây trồng đặc biệt cho nông trại
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Tên bài tập:</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Môn học:</label>
                <select
                  value={newTaskSubject}
                  onChange={(e) => setNewTaskSubject(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold"
                >
                  <option value="Toán">Toán</option>
                  <option value="Ngữ văn">Ngữ văn</option>
                  <option value="Khoa học tự nhiên">Khoa học tự nhiên</option>
                  <option value="Lịch sử & Địa lý">Lịch sử & Địa lý</option>
                  <option value="Tiếng Anh">Tiếng Anh</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Phần thưởng nông trại (Section 13.3):</label>
                <input
                  type="text"
                  required
                  value={newTaskReward}
                  onChange={(e) => setNewTaskReward(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all cursor-pointer"
                >
                  🚀 Phát Động Nhiệm Vụ Đến Lớp Học
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
