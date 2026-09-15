import React, { useState } from "react";
import {
  Sparkles,
  Bot,
  CheckCircle2,
  XCircle,
  Lightbulb,
  RefreshCw,
  Award,
  ArrowRight,
} from "lucide-react";
import confetti from "canvas-confetti";
import { StudentGrade, QuizQuestion } from "../types";
import { sound } from "../utils/sound";

interface AiQuizChallengeViewProps {
  currentGrade: StudentGrade;
  studentName: string;
  onAnswerCorrect: () => void;
  onAnswerIncorrect: () => void;
}

export const AiQuizChallengeView: React.FC<AiQuizChallengeViewProps> = ({
  currentGrade,
  studentName,
  onAnswerCorrect,
  onAnswerIncorrect,
}) => {
  const [subject, setSubject] = useState("Toán");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [answeredState, setAnsweredState] = useState<"none" | "correct" | "incorrect">("none");
  const [showHint, setShowHint] = useState(false);

  // Current active question
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion>({
    id: "ai-q-default",
    question: "Kết quả của phép tính: 5 × 8 bằng bao nhiêu?",
    options: ["35", "40", "45", "50"],
    correctAnswer: 1,
    hint: "Hãy nhớ lại bảng nhân 5: 5 × 5 = 25, 5 × 6 = 30, 5 × 7 = 35, 5 × 8 = ...",
    explanation: "5 × 8 = 40. Bảng cửu chương nhân 5 vô cùng chuẩn xác!",
  });

  const [plantState, setPlantState] = useState<"sprout" | "tree" | "wither">("sprout");

  const SUBJECTS = ["Toán", "Khoa học tự nhiên", "Ngữ văn", "Tiếng Anh"];

  const handleSelectOption = (idx: number) => {
    if (answeredState !== "none") return;
    setSelectedOpt(idx);

    if (idx === currentQuestion.correctAnswer) {
      sound.playCorrect();
      setAnsweredState("correct");
      setPlantState("tree");
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
      onAnswerCorrect();
    } else {
      sound.playIncorrect();
      setAnsweredState("incorrect");
      setPlantState("wither");
      onAnswerIncorrect();
    }
  };

  const handleFetchNewQuestion = async (customSubject?: string) => {
    const sub = customSubject || subject;
    setIsLoading(true);
    setSelectedOpt(null);
    setAnsweredState("none");
    setShowHint(false);
    setPlantState("sprout");

    try {
      const res = await fetch("/api/ai/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: sub,
          grade: currentGrade,
        }),
      });

      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        // pick a random question
        const randomQ = data.questions[Math.floor(Math.random() * data.questions.length)];
        setCurrentQuestion(randomQ);
      }
    } catch {
      // Fallback
      setCurrentQuestion({
        id: "fallback-q",
        question: "Số nguyên âm nào lớn nhất trong tập hợp các số nguyên Z?",
        options: ["-1", "0", "-100", "Không tồn tại"],
        correctAnswer: 0,
        hint: "Trên trục số nằm ngang, số nguyên âm nằm ngay bên trái số 0.",
        explanation: "-1 là số nguyên âm lớn nhất vì nó nằm gần số 0 nhất về phía bên trái.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Chế Độ AI Hỏi – Học Sinh Trả Lời
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-stone-900 mt-2 flex items-center gap-2">
              <span>🤖</span> THỬ THÁCH NHANH CÙNG AI
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              AI sẽ chủ động tạo câu hỏi trắc nghiệm thông minh. Trả lời đúng để mầm cây lớn vọt ngay!
            </p>
          </div>

          <div className="flex items-center gap-2">
            {SUBJECTS.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSubject(s);
                  handleFetchNewQuestion(s);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  subject === s
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive Arena */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xs relative overflow-hidden">
        {/* Live Tree Avatar Reaction */}
        <div className="flex items-center justify-between pb-6 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-emerald-400 flex items-center justify-center text-stone-900 shadow-sm">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-stone-900">Bác Nông Dân AI</div>
              <div className="text-xs text-stone-500">Đang thử thách bạn {studentName} (Lớp {currentGrade})</div>
            </div>
          </div>

          {/* Dynamic Plant State Badge */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200">
            <span className="text-3xl animate-float">
              {plantState === "sprout" && "🌱"}
              {plantState === "tree" && "🌳"}
              {plantState === "wither" && "🥀"}
            </span>
            <div className="text-left">
              <div className="text-[10px] text-stone-400 font-semibold uppercase">Trạng thái cây</div>
              <div className="text-xs font-bold text-stone-800">
                {plantState === "sprout" && "Mầm non đang đợi câu trả lời"}
                {plantState === "tree" && "Cây lớn xanh tốt! 🎉"}
                {plantState === "wither" && "Cây héo nhẹ 🍂"}
              </div>
            </div>
          </div>
        </div>

        {/* The AI Question Bubble */}
        <div className="py-8 max-w-2xl mx-auto space-y-6">
          <div className="p-6 rounded-3xl bg-amber-50/70 border-2 border-amber-200/80 relative">
            <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider block mb-1">
              🤖 AI hỏi:
            </span>
            <p className="font-display font-extrabold text-xl sm:text-2xl text-stone-900 leading-snug">
              “{currentQuestion.question}”
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQuestion.options.map((opt, idx) => {
              const letters = ["A", "B", "C", "D"];
              const isSelected = selectedOpt === idx;
              const isCorrect = idx === currentQuestion.correctAnswer;

              let btnStyle = "bg-white border-stone-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-stone-800";
              if (answeredState !== "none") {
                if (isCorrect) {
                  btnStyle = "bg-emerald-100 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-400";
                } else if (isSelected && !isCorrect) {
                  btnStyle = "bg-red-50 border-red-400 text-red-900 font-semibold";
                } else {
                  btnStyle = "bg-stone-50 border-stone-200 opacity-60";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={answeredState !== "none"}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-2xl border-2 text-left flex items-center gap-3 transition-all cursor-pointer ${btnStyle}`}
                >
                  <span className="w-8 h-8 rounded-xl bg-stone-100 font-bold text-xs flex items-center justify-center shrink-0">
                    {letters[idx]}
                  </span>
                  <span className="text-base font-semibold flex-1">{opt}</span>
                  {answeredState !== "none" && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {answeredState !== "none" && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback states matching Section 8 requirements */}
          {answeredState === "correct" && (
            <div className="p-5 rounded-3xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 space-y-2 animate-in zoom-in-95">
              <div className="font-extrabold text-lg flex items-center gap-2">
                <span>🎉</span>
                <span>Tuyệt vời! Bạn đã trả lời đúng!</span>
              </div>
              <p className="text-sm text-emerald-800 font-medium">
                🌱 Cây của bạn phát triển! +10 điểm tri thức.
              </p>
              <p className="text-xs text-stone-700 bg-white/80 p-3 rounded-xl border border-emerald-200">
                💡 <strong>Giải thích chi tiết:</strong> {currentQuestion.explanation}
              </p>
            </div>
          )}

          {answeredState === "incorrect" && (
            <div className="p-5 rounded-3xl bg-amber-50 border-2 border-amber-300 text-stone-800 space-y-2 animate-in zoom-in-95">
              <div className="font-extrabold text-lg text-amber-900 flex items-center gap-2">
                <span>🍂</span>
                <span>Rất tiếc, câu trả lời chưa đúng.</span>
              </div>
              <p className="text-xs text-stone-700 bg-white/80 p-3 rounded-xl border border-amber-200">
                💡 <strong>AI giải thích đáp án:</strong> {currentQuestion.explanation}
              </p>
              <p className="text-xs font-bold text-emerald-800">
                💡 Hãy thử lại nhé! Hoặc nhận thử thách mới từ AI.
              </p>
            </div>
          )}

          {/* Bottom Action Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-100">
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-xs font-bold text-stone-500 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              {showHint ? "Ẩn gợi ý" : "💡 Xem Gợi ý"}
            </button>

            <button
              id="btn-ai-next-challenge"
              onClick={() => handleFetchNewQuestion()}
              disabled={isLoading}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm rounded-2xl flex items-center gap-2 shadow-sm transition-all hover:scale-105 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              <span>{isLoading ? "AI đang tạo câu hỏi..." : "Đổi câu hỏi mới từ AI ➔"}</span>
            </button>
          </div>

          {showHint && (
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs">
              <span className="font-bold">Gợi ý từ AI:</span> {currentQuestion.hint}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
