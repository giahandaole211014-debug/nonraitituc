import React, { useState } from "react";
import {
  Users,
  Calendar,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Sprout,
  AlertTriangle,
  MessageSquare,
  Sparkles,
  Download,
} from "lucide-react";
import { ParentProfile, StudentProfile } from "../types";

interface ParentDashboardViewProps {
  parent: ParentProfile;
  student: StudentProfile;
}

export const ParentDashboardView: React.FC<ParentDashboardViewProps> = ({
  parent,
  student,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "history" | "weekly">("overview");

  const wiltingCount = student.plants.filter((p) => p.health === "wilting").length;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
              <Users className="w-3.5 h-3.5" />
              Cổng Thông Tin Phụ Huynh Học Sinh
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-stone-900 mt-2 flex items-center gap-2">
              <span>👨👩👧</span> BẢNG ĐIỀU KHIỂN PHỤ HUYNH
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Đồng hành cùng con <strong className="text-blue-900 font-bold">{student.name}</strong> (Lớp {student.grade}) trên hành trình nuôi dưỡng tri thức.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "overview"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              Tổng quan
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "history"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              Lịch sử bài làm
            </button>
            <button
              onClick={() => setActiveTab("weekly")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "weekly"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              📅 Báo cáo tuần
            </button>
          </div>
        </div>
      </div>

      {/* Wilting Plant Alert for Parent */}
      {wiltingCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-xs font-bold text-amber-900">
              Nhắc nhở nhẹ nhàng: Nông trại của con đang có {wiltingCount} cây cần chăm sóc!
            </div>
            <p className="text-xs text-amber-700 mt-0.5">
              Cây đang bị héo do con gặp câu hỏi khó ở bài tập gần đây. Ba mẹ hãy dành lời động viên để con tự tin làm câu hỏi phục hồi nhé.
            </p>
          </div>
        </div>
      )}

      {/* Tab 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Quick Metrics KPI Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white rounded-2xl p-4 border border-stone-200 text-center">
              <div className="text-[11px] text-stone-500 font-semibold">Điểm trung bình</div>
              <div className="text-2xl font-black text-blue-700 mt-1">
                {parent.weeklyReport.accuracy}%
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-stone-200 text-center">
              <div className="text-[11px] text-stone-500 font-semibold">Bài hoàn thành</div>
              <div className="text-2xl font-black text-emerald-700 mt-1">
                {parent.weeklyReport.completedLessons}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-stone-200 text-center">
              <div className="text-[11px] text-stone-500 font-semibold">Cây đã trồng</div>
              <div className="text-2xl font-black text-green-700 mt-1">
                {parent.weeklyReport.plantedCrops} 🌱
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-stone-200 text-center">
              <div className="text-[11px] text-stone-500 font-semibold">Cây đã thu hoạch</div>
              <div className="text-2xl font-black text-amber-600 mt-1">
                {parent.weeklyReport.harvestedCrops} 🧺
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-stone-200 text-center">
              <div className="text-[11px] text-stone-500 font-semibold">Thời gian học tuần</div>
              <div className="text-xl font-black text-purple-700 mt-1">
                {parent.weeklyReport.studyTime}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-stone-200 text-center">
              <div className="text-[11px] text-stone-500 font-semibold">Mức độ tiến bộ</div>
              <div className="text-xl font-black text-emerald-600 mt-1 flex items-center justify-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +12%
              </div>
            </div>
          </div>

          {/* Strong vs Need Improvement Subjects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-emerald-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Môn học con học rất vững & yêu thích</span>
              </div>
              <div className="space-y-2">
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-950">🔬 Khoa học tự nhiên</span>
                  <span className="font-extrabold text-emerald-700">92% (Cây bội thu quả)</span>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-950">🇬🇧 Tiếng Anh</span>
                  <span className="font-extrabold text-emerald-700">88% (Tiến bộ nhanh)</span>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-950">📐 Toán học</span>
                  <span className="font-extrabold text-emerald-700">85% (Tư duy logic tốt)</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Môn học cần ba mẹ đồng hành & khích lệ</span>
              </div>
              <div className="space-y-2">
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-950">🌍 Lịch sử & Địa lý</span>
                  <span className="font-semibold text-amber-800">74% (Cần xâu chuỗi sự kiện)</span>
                </div>
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-950">📚 Ngữ văn</span>
                  <span className="font-semibold text-amber-800">78% (Cần thêm vốn từ biểu cảm)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: DETAILED STUDY HISTORY (Section 12.3) */}
      {activeTab === "history" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-display font-extrabold text-lg text-stone-900">
                📖 Lịch Sử Bài Làm Chi Tiết Của Con
              </h3>
              <p className="text-xs text-stone-500">
                Ghi nhận từng buổi học, số câu đúng/sai và lời nhận xét tận tâm từ giáo viên bộ môn
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {student.studyHistory.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 rounded-2xl border border-stone-200 hover:border-blue-300 hover:bg-blue-50/20 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {item.subject}
                    </span>
                    <span className="text-xs text-stone-400">📅 {item.date}</span>
                    <span className="text-xs text-stone-400">⏱ {item.timeSpentMinutes} phút</span>
                  </div>
                  <div className="font-bold text-sm text-stone-900">{item.taskTitle}</div>
                  <div className="text-xs text-stone-600 flex items-start gap-1.5 pt-1 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Nhận xét của giáo viên:</strong> “{item.teacherFeedback}”
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0 flex items-center md:flex-col gap-2">
                  <div className="text-lg font-black text-emerald-700">
                    {item.correctCount}/{item.totalCount} Đúng
                  </div>
                  <div className="text-xs font-bold text-stone-400">
                    {Math.round((item.correctCount / item.totalCount) * 100)}% Chính xác
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: OFFICIAL WEEKLY REPORT (Section 12.4) */}
      {activeTab === "weekly" && (
        <div className="bg-gradient-to-b from-white to-blue-50/50 rounded-3xl p-6 sm:p-10 border-2 border-blue-200 shadow-md space-y-6 max-w-3xl mx-auto">
          {/* Header of Weekly Report */}
          <div className="text-center pb-4 border-b border-blue-100 space-y-1">
            <div className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              Hệ Thống Nông Trại Tri Thức
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-stone-900">
              📅 BÁO CÁO HỌC TẬP TUẦN
            </h2>
            <p className="text-xs text-stone-500">Thời gian: Tuần 2, Tháng 9</p>
          </div>

          {/* Student Profile Row */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-blue-100/60 text-xs sm:text-sm font-bold text-blue-950">
            <div>
              Học sinh: <span className="text-blue-700 font-extrabold">{parent.weeklyReport.studentName}</span>
            </div>
            <div>
              Lớp: <span className="text-blue-700 font-extrabold">{parent.weeklyReport.grade}</span>
            </div>
          </div>

          {/* Exact Metrics List from Section 12.4 */}
          <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="p-3.5 rounded-2xl bg-white border border-stone-200 flex items-center justify-between">
              <span className="text-stone-600">🌱 Cây đã trồng:</span>
              <span className="font-extrabold text-stone-900">{parent.weeklyReport.plantedCrops} cây</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-stone-200 flex items-center justify-between">
              <span className="text-stone-600">🌳 Cây đã trưởng thành:</span>
              <span className="font-extrabold text-emerald-700">{parent.weeklyReport.matureCrops} cây</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-stone-200 flex items-center justify-between">
              <span className="text-stone-600">🧺 Cây đã thu hoạch:</span>
              <span className="font-extrabold text-amber-600">{parent.weeklyReport.harvestedCrops} cây</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-stone-200 flex items-center justify-between">
              <span className="text-stone-600">📚 Bài đã hoàn thành:</span>
              <span className="font-extrabold text-blue-700">{parent.weeklyReport.completedLessons} bài</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-stone-200 flex items-center justify-between">
              <span className="text-stone-600">🎯 Độ chính xác:</span>
              <span className="font-extrabold text-green-700">{parent.weeklyReport.accuracy}%</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-stone-200 flex items-center justify-between">
              <span className="text-stone-600">⏱ Thời gian học:</span>
              <span className="font-extrabold text-purple-700">{parent.weeklyReport.studyTime}</span>
            </div>
          </div>

          {/* AI Weekly Feedback from Section 12.4 */}
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Nhận xét từ AI:</span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed italic bg-white/80 p-3.5 rounded-xl border border-emerald-100">
              “{parent.weeklyReport.aiSummary}”
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
