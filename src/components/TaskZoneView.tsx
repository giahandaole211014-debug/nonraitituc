import React, { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  Sparkles,
  Lightbulb,
  Award,
  ArrowRight,
  Flame,
  HelpCircle,
  RefreshCw,
  Trophy,
} from "lucide-react";
import confetti from "canvas-confetti";
import { DailyTask, QuizQuestion, StudentProfile } from "../types";
import { sound } from "../utils/sound";

interface TaskZoneViewProps {
  student: StudentProfile;
  onAnswerQuestion: (
    taskId: string,
    questionId: string,
    selectedOption: number,
    isCorrect: boolean
  ) => void;
  onCompleteTask: (taskId: string) => void;
  onNavigateToFarm: () => void;
}

export const TaskZoneView: React.FC<TaskZoneViewProps> = ({
  student,
  onAnswerQuestion,
  onCompleteTask,
  onNavigateToFarm,
}) => {
  const [activeTask, setActiveTask] = useState<DailyTask | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedbackState, setFeedbackState] = useState<"none" | "correct" | "incorrect">("none");
  const [showHarvestCelebration, setShowHarvestCelebration] = useState<boolean>(false);
  const [earnedReward, setEarnedReward] = useState<{
    coins: number;
    exp: number;
    badgeName: string;
  } | null>(null);

  // Plant growth visualizer on modal
  const [plantGrowthVisual, setPlantGrowthVisual] = useState<"seed" | "sprout" | "sapling" | "mature" | "wilting">("sprout");

  const startTask = (task: DailyTask) => {
    setActiveTask(task);
    // Find first unanswered question or 0
    const firstUnanswered = task.questions.findIndex((q) => q.userSelected === undefined);
    const startIndex = firstUnanswered !== -1 ? firstUnanswered : 0;
    setCurrentQIndex(startIndex);
    setShowHint(false);
    setSelectedOption(null);
    setFeedbackState("none");
    setPlantGrowthVisual("sprout");
  };

  const handleSelectOption = (optIndex: number) => {
    if (!activeTask || feedbackState !== "none") return;
    const currentQ = activeTask.questions[currentQIndex];
    setSelectedOption(optIndex);

    const isCorrect = optIndex === currentQ.correctAnswer;
    if (isCorrect) {
      sound.playCorrect();
      setFeedbackState("correct");
      // Dynamic visual plant growth
      setPlantGrowthVisual((prev) => (prev === "sprout" ? "sapling" : "mature"));
    } else {
      sound.playIncorrect();
      setFeedbackState("incorrect");
      setPlantGrowthVisual("wilting");
    }

    onAnswerQuestion(activeTask.id, currentQ.id, optIndex, isCorrect);
  };

  const handleNextQuestion = () => {
    if (!activeTask) return;
    setShowHint(false);
    setSelectedOption(null);
    setFeedbackState("none");

    if (currentQIndex < activeTask.questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      // Completed all questions in this task!
      finishTask();
    }
  };

  const handleRetryQuestion = () => {
    setSelectedOption(null);
    setFeedbackState("none");
    setShowHint(true);
    setPlantGrowthVisual("sprout");
  };

  const finishTask = () => {
    if (!activeTask) return;
    sound.playHarvest();
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
    });

    onCompleteTask(activeTask.id);
    setEarnedReward({
      coins: activeTask.rewardCoins,
      exp: activeTask.rewardExp,
      badgeName: "🌟 Nhà Thám Hiểm Tri Thức",
    });
    setShowHarvestCelebration(true);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Chương trình chuẩn THCS Lớp {student.grade}
            </span>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-stone-900 mt-2 flex items-center gap-2">
              <span>🌞</span> Nhiệm Vụ Hôm Nay
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Mỗi bài tập là một cơ hội để tưới tắm và phát triển khu vườn nông trại của em.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-amber-50 p-3 rounded-2xl border border-amber-200 text-xs">
            <span className="text-2xl">🧺</span>
            <div>
              <div className="font-bold text-stone-800">Thu hoạch trọn vẹn</div>
              <div className="text-stone-500">Hoàn thành để nhận Huy hiệu & Hạt giống</div>
            </div>
          </div>
        </div>
      </div>

      {/* Task List Cards (Section 9) */}
      <div className="grid gap-4">
        {student.dailyTasks.map((task, idx) => {
          const progressPercent = Math.round(
            (task.completedQuestions / task.totalQuestions) * 100
          );
          const isDone = task.isCompleted || progressPercent === 100;

          return (
            <div
              key={task.id}
              className={`p-5 sm:p-6 rounded-3xl border-2 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
                isDone
                  ? "bg-emerald-50/60 border-emerald-300 shadow-xs"
                  : "bg-white border-stone-200 hover:border-emerald-300 hover:shadow-md"
              }`}
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="w-13 h-13 rounded-2xl bg-amber-100 border border-amber-200 text-3xl flex items-center justify-center shrink-0">
                  {task.icon}
                </div>

                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {task.subject}
                    </span>
                    <span className="text-xs text-stone-400">• Lớp {task.grade}</span>
                    {isDone && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Đã hoàn thành
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base sm:text-lg text-stone-900 leading-tight">
                    {idx + 1}. {task.title}
                  </h3>
                  <p className="text-xs text-stone-500">{task.description}</p>

                  {/* Progress Bar (Visual representation as requested in prompt) */}
                  <div className="pt-2 max-w-md">
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span className="text-stone-700">
                        Tiến độ: {task.correctCount}/{task.totalQuestions} câu đúng
                      </span>
                      <span className="text-emerald-700 font-bold">{progressPercent}%</span>
                    </div>

                    <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden border border-stone-200 p-0.5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isDone ? "bg-emerald-500" : "bg-gradient-to-r from-amber-400 to-emerald-500"
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <div className="text-right text-xs text-stone-500 hidden lg:block">
                  <div>⭐ +{task.rewardExp} EXP</div>
                  <div>🪙 +{task.rewardCoins} Xu Tri Thức</div>
                </div>

                <button
                  id={`btn-task-${task.id}`}
                  onClick={() => startTask(task)}
                  className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isDone
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                      : "bg-amber-400 hover:bg-amber-300 text-stone-900 shadow-md hover:scale-105"
                  }`}
                >
                  {isDone ? "Ôn lại bài tập" : "Bắt đầu làm bài ➔"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Active Question Modal (Section 6: Cơ Chế Cây Phát Triển) */}
      {activeTask && !showHarvestCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-stone-200 relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setActiveTask(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 text-xl font-bold w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>

            {/* Header with Live Farm Tree Growth Visualizer */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activeTask.icon}</span>
                <div>
                  <h3 className="font-bold text-sm text-stone-900">{activeTask.subject}</h3>
                  <div className="text-xs text-stone-400">
                    Câu hỏi {currentQIndex + 1} / {activeTask.questions.length}
                  </div>
                </div>
              </div>

              {/* Dynamic Animated Plant Status */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs">
                <span className="text-2xl animate-float">
                  {plantGrowthVisual === "seed" && "🌰"}
                  {plantGrowthVisual === "sprout" && "🌱"}
                  {plantGrowthVisual === "sapling" && "🌿"}
                  {plantGrowthVisual === "mature" && "🌳"}
                  {plantGrowthVisual === "wilting" && "🥀"}
                </span>
                <div className="text-left">
                  <div className="text-[10px] text-stone-400 font-semibold uppercase">Cây của em</div>
                  <div className="text-xs font-bold text-stone-800">
                    {plantGrowthVisual === "wilting" ? "Cây đang héo 🍂" : "Đang phát triển 🌱"}
                  </div>
                </div>
              </div>
            </div>

            {/* Question Card */}
            {activeTask.questions[currentQIndex] && (
              <div className="py-6 space-y-6">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
                  <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wide">
                    Câu {currentQIndex + 1}:
                  </span>
                  <p className="font-bold text-base sm:text-lg text-stone-900 mt-1 leading-relaxed">
                    {activeTask.questions[currentQIndex].question}
                  </p>
                </div>

                {/* 4 Options Grid */}
                <div className="space-y-3">
                  {activeTask.questions[currentQIndex].options.map((opt, optIdx) => {
                    const optLetters = ["A", "B", "C", "D"];
                    const isChosen = selectedOption === optIdx;
                    const isCorrectOpt = optIdx === activeTask.questions[currentQIndex].correctAnswer;

                    let btnStyle = "bg-white border-stone-200 hover:border-emerald-400 hover:bg-emerald-50/40 text-stone-800";
                    if (feedbackState !== "none") {
                      if (isCorrectOpt) {
                        btnStyle = "bg-emerald-100 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-400";
                      } else if (isChosen && !isCorrectOpt) {
                        btnStyle = "bg-red-50 border-red-400 text-red-900 font-medium";
                      } else {
                        btnStyle = "bg-stone-50 border-stone-200 opacity-60 text-stone-400";
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={feedbackState !== "none"}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`w-full p-4 rounded-2xl border-2 text-left flex items-center gap-3 transition-all cursor-pointer ${btnStyle}`}
                      >
                        <span className="w-8 h-8 rounded-xl bg-stone-100 border border-stone-200 font-bold text-xs flex items-center justify-center shrink-0">
                          {optLetters[optIdx]}
                        </span>
                        <span className="text-sm sm:text-base leading-snug flex-1">{opt}</span>
                        {feedbackState !== "none" && isCorrectOpt && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        )}
                        {feedbackState !== "none" && isChosen && !isCorrectOpt && (
                          <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback Banner (Exactly matching Section 6 requirements) */}
                {feedbackState === "correct" && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 space-y-2 animate-in zoom-in-95">
                    <div className="flex items-center gap-2 font-extrabold text-base">
                      <span className="text-2xl">🎉</span>
                      <span>Chính xác! +10 điểm tri thức</span>
                    </div>
                    <p className="text-xs text-emerald-800">
                      🌱 Cây tri thức của em vừa vươn mình phát triển thêm một nhánh mới rực rỡ!
                    </p>
                    <p className="text-xs text-stone-600 bg-white/70 p-2.5 rounded-xl border border-emerald-100">
                      💡 <strong>Giải thích:</strong> {activeTask.questions[currentQIndex].explanation}
                    </p>
                  </div>
                )}

                {feedbackState === "incorrect" && (
                  <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-stone-800 space-y-2 animate-in zoom-in-95">
                    <div className="flex items-center gap-2 font-extrabold text-base text-amber-900">
                      <span className="text-2xl">🌧️</span>
                      <span>Chưa chính xác!</span>
                    </div>
                    <p className="text-xs text-amber-800 font-medium">
                      “Cây đang héo. Hãy cố gắng ở nhiệm vụ tiếp theo để chăm sóc nông trại nhé!”
                    </p>
                    <p className="text-xs text-stone-700 bg-white/80 p-2.5 rounded-xl border border-amber-200">
                      💡 <strong>Giải thích đáp án đúng:</strong>{" "}
                      {activeTask.questions[currentQIndex].explanation}
                    </p>
                  </div>
                )}

                {/* Hint popover */}
                {showHint && feedbackState === "none" && (
                  <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Gợi ý từ AI:</span>{" "}
                      {activeTask.questions[currentQIndex].hint}
                    </div>
                  </div>
                )}

                {/* Action Controls */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setShowHint(!showHint)}
                    className="text-xs font-bold text-stone-500 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    {showHint ? "Ẩn gợi ý" : "💡 Xem Gợi ý"}
                  </button>

                  <div className="flex items-center gap-2">
                    {feedbackState === "incorrect" && (
                      <button
                        type="button"
                        onClick={handleRetryQuestion}
                        className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Thử lại câu này
                      </button>
                    )}

                    {feedbackState !== "none" && (
                      <button
                        type="button"
                        onClick={handleNextQuestion}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center gap-1.5 shadow-md hover:scale-105 cursor-pointer"
                      >
                        <span>
                          {currentQIndex < activeTask.questions.length - 1
                            ? "Câu tiếp theo ➔"
                            : "Hoàn thành & Thu hoạch 🧺"}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Special Harvest Celebration Screen (Section 10: Thu Hoạch 🌾) */}
      {showHarvestCelebration && earnedReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border-4 border-amber-300 text-center space-y-6 relative overflow-hidden">
            {/* Celebratory Background Glow */}
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-amber-300/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-400/30 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="inline-flex p-3 rounded-full bg-amber-100 text-amber-700 text-4xl animate-bounce">
                🧺
              </div>

              <h2 className="font-display font-black text-2xl sm:text-3xl text-emerald-900 tracking-tight">
                🎉 CHÚC MỪNG!
              </h2>

              <p className="text-base font-bold text-stone-800">
                Bạn đã hoàn thành xuất sắc bài học hôm nay!
              </p>

              {/* The 3-stage harvest visual from Section 10: 🌳 → 🍎🍎🍎 → 🧺 */}
              <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
                <span className="text-3xl">🌳</span>
                <span className="text-stone-400 font-bold">➔</span>
                <span className="text-3xl">🍎🍎🍎</span>
                <span className="text-stone-400 font-bold">➔</span>
                <span className="text-4xl">🧺</span>
              </div>

              {/* Rewards List as specified in Section 10 */}
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-left space-y-2.5">
                <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider text-center pb-1 border-b border-emerald-100">
                  Phần Thưởng Thu Hoạch
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-stone-700">
                  <span className="flex items-center gap-2">
                    <span>⭐</span> Điểm kinh nghiệm:
                  </span>
                  <span className="font-extrabold text-emerald-700">+{earnedReward.exp} EXP</span>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-stone-700">
                  <span className="flex items-center gap-2">
                    <span>🪙</span> Xu tri thức:
                  </span>
                  <span className="font-extrabold text-amber-600">+{earnedReward.coins} Xu</span>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-stone-700">
                  <span className="flex items-center gap-2">
                    <span>🏆</span> Huy hiệu danh dự:
                  </span>
                  <span className="font-extrabold text-purple-700">{earnedReward.badgeName}</span>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-stone-700">
                  <span className="flex items-center gap-2">
                    <span>🌱</span> Hạt giống mới:
                  </span>
                  <span className="font-extrabold text-green-700">+1 Hạt Giống Thượng Hạng</span>
                </div>
              </div>

              {/* Back to farm button */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setShowHarvestCelebration(false);
                    setActiveTask(null);
                    onNavigateToFarm();
                  }}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all hover:scale-105 cursor-pointer"
                >
                  🌾 Về Nông Trại Xem Trái Chín
                </button>
                <button
                  onClick={() => {
                    setShowHarvestCelebration(false);
                    setActiveTask(null);
                  }}
                  className="px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-sm rounded-2xl transition-all cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
