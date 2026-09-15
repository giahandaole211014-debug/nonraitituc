import React, { useState } from "react";
import {
  BarChart3,
  Sparkles,
  TrendingUp,
  Brain,
  Zap,
  Target,
  Clock,
  Compass,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { StudentProfile } from "../types";

interface CompetencyAnalysisViewProps {
  student: StudentProfile;
}

export const CompetencyAnalysisView: React.FC<CompetencyAnalysisViewProps> = ({
  student,
}) => {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [aiReport, setAiReport] = useState<{
    summary: string;
    strengths: string[];
    improvements: string[];
    recommendations: string[];
  }>({
    summary:
      "Học sinh có khả năng tư duy logic tốt và độ chính xác xuất sắc ở môn Khoa học tự nhiên & Tiếng Anh. Cần tăng cường kỹ năng đọc hiểu văn bản dài và liên hệ niên đại Lịch sử & Địa lý.",
    strengths: [
      "Khả năng tư duy logic toán học nhanh nhạy",
      "Ghi nhớ tốt các thuật ngữ Khoa học tự nhiên",
      "Vốn từ vựng Tiếng Anh phong phú và chính xác",
    ],
    improvements: [
      "Cần cẩn thận hơn với các phép tính số thập phân và phân số",
      "Kỹ năng cảm thụ và phân tích thơ ca trong môn Ngữ văn",
      "Xâu chuỗi các mốc sự kiện lịch sử theo trình tự",
    ],
    recommendations: [
      "🌱 Bạn đang cần chăm sóc khu vườn Phân số! Hãy hoàn thành 5 câu luyện tập để cây phát triển.",
      "🌿 Ghé thăm cây Ngữ văn: Đọc thêm 1 đoạn văn cảm nhận để cây trổ hoa thơm.",
      "🌳 Củng cố môn Lịch sử bằng 1 thử thách trắc nghiệm nhanh cùng AI.",
    ],
  });

  const handleRequestAiEvaluation = async () => {
    setIsEvaluating(true);
    try {
      const res = await fetch("/api/ai/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: student.name,
          grade: student.grade,
          stats: {
            knowledge: student.competency.knowledgeScore,
            logic: student.competency.logicScore,
            problemSolving: student.competency.problemSolvingScore,
            speed: student.competency.speedScore,
            accuracy: student.competency.accuracyScore,
            progress: student.competency.progressRate,
          },
          subjectBreakdown: student.competency.subjectBreakdown,
        }),
      });

      const data = await res.json();
      if (data.evaluation) {
        setAiReport(data.evaluation);
      }
    } catch {
      // Keep existing state
    } finally {
      setIsEvaluating(false);
    }
  };

  const metrics = [
    {
      name: "1. Mức độ hiểu kiến thức",
      score: student.competency.knowledgeScore,
      icon: Brain,
      color: "from-blue-500 to-indigo-600",
      textColor: "text-blue-700",
    },
    {
      name: "2. Khả năng tư duy logic",
      score: student.competency.logicScore,
      icon: Sparkles,
      color: "from-amber-500 to-orange-500",
      textColor: "text-amber-700",
    },
    {
      name: "3. Giải quyết vấn đề",
      score: student.competency.problemSolvingScore,
      icon: Target,
      color: "from-emerald-500 to-green-600",
      textColor: "text-emerald-700",
    },
    {
      name: "4. Tốc độ làm bài",
      score: student.competency.speedScore,
      icon: Zap,
      color: "from-yellow-500 to-amber-600",
      textColor: "text-yellow-700",
    },
    {
      name: "5. Độ chính xác",
      score: student.competency.accuracyScore,
      icon: CheckCircle,
      color: "from-teal-500 to-emerald-600",
      textColor: "text-teal-700",
    },
    {
      name: "6. Mức độ tiến bộ",
      score: student.competency.progressRate,
      icon: TrendingUp,
      color: "from-purple-500 to-indigo-600",
      textColor: "text-purple-700",
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-bold border border-violet-200">
              <BarChart3 className="w-3.5 h-3.5" />
              Báo Cáo Năng Lực 6 Chiều Chuẩn Quốc Tế
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-stone-900 mt-2 flex items-center gap-2">
              <span>📊</span> ĐÁNH GIÁ NĂNG LỰC HỌC SINH
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Phân tích học tập của em <strong className="text-emerald-800 font-bold">{student.name}</strong> (Lớp {student.grade}) dựa trên lịch sử làm bài và chăm sóc cây nông trại.
            </p>
          </div>

          <button
            onClick={handleRequestAiEvaluation}
            disabled={isEvaluating}
            className="px-5 py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm rounded-2xl flex items-center gap-2 shadow-md transition-all hover:scale-105 cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className={`w-4 h-4 ${isEvaluating ? "animate-spin" : ""}`} />
            <span>{isEvaluating ? "AI đang phân tích..." : "Yêu Cầu AI Cập Nhật"}</span>
          </button>
        </div>
      </div>

      {/* 6-Dimension Core Competency Cards */}
      <div>
        <h2 className="font-display font-extrabold text-xl text-stone-900 mb-4 flex items-center gap-2">
          <span>🎯</span> 6 Trụ Cột Năng Lực Học Tập (THCS)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs hover:border-violet-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-stone-700">{m.name}</span>
                  <div className={`p-2 rounded-xl bg-stone-100 ${m.textColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-display font-black text-3xl text-stone-900">
                    {m.score}%
                  </span>
                  <span className="text-xs font-bold text-emerald-600">
                    {m.score >= 85 ? "Xuất sắc" : m.score >= 70 ? "Khá tốt" : "Cần rèn luyện"}
                  </span>
                </div>

                <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${m.color} rounded-full transition-all duration-700`}
                    style={{ width: `${m.score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subject Breakdown vs Farm Soil Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Scoreboard */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-display font-extrabold text-lg text-stone-900 flex items-center gap-2">
            <span>📚</span> Điểm Năng Lực Theo Từng Môn Học
          </h3>

          <div className="space-y-3 pt-2">
            {student.competency.subjectBreakdown.map((s, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                  <span>{s.subject}</span>
                  <span className="text-emerald-700">{s.score}%</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${s.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Intelligent Insights Box (Section 11) */}
        <div className="bg-gradient-to-br from-violet-50 to-emerald-50 rounded-3xl p-6 sm:p-7 border border-violet-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-violet-600 text-white text-sm">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-display font-extrabold text-base text-stone-900">
                Báo Cáo Phân Tích Thông Minh Từ AI
              </h3>
              <p className="text-xs text-stone-500">Cập nhật theo dữ liệu làm bài mới nhất</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-medium bg-white/70 p-4 rounded-2xl border border-violet-100">
            “{aiReport.summary}”
          </p>

          <div className="grid sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-emerald-100/60 border border-emerald-200">
              <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 mb-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                Điểm Mạnh Của Em:
              </div>
              <ul className="text-[11px] text-emerald-800 space-y-1">
                {aiReport.strengths.map((str, i) => (
                  <li key={i}>• {str}</li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-100/60 border border-amber-200">
              <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                Cần Cải Thiện Thêm:
              </div>
              <ul className="text-[11px] text-amber-800 space-y-1">
                {aiReport.improvements.map((imp, i) => (
                  <li key={i}>• {imp}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Personalized AI Study Recommendations (Section 11) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌱</span>
          <div>
            <h3 className="font-display font-extrabold text-lg text-stone-900">
              Đề Xuất Học Tập Cá Nhân Hóa Dành Riêng Cho Bạn
            </h3>
            <p className="text-xs text-stone-500">
              Chăm sóc đúng cây tri thức đang cần bồi đắp dinh dưỡng để nông trại nở rộ đồng đều
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {aiReport.recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 hover:bg-emerald-50 hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <p className="text-xs sm:text-sm font-semibold text-stone-800 leading-relaxed">
                {rec}
              </p>
              <div className="mt-3 pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px] font-bold text-emerald-800">
                <span>Ưu tiên hôm nay</span>
                <span>➔</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
