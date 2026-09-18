import React from "react";
import {
  Sprout,
  HelpCircle,
  BarChart3,
  Trophy,
  Users,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Sun,
  Cloud,
  CheckCircle2,
} from "lucide-react";
import { StudentProfile } from "../types";
import { useAuth } from "../context/AuthContext";

interface HomeHeroProps {
  student: StudentProfile;
  onNavigate: (tab: string) => void;
  onOpenAuth: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  student,
  onNavigate,
  onOpenAuth,
}) => {
  const { user, profile } = useAuth();
  const hasActiveProgress = Boolean(
    user &&
      profile &&
      ((profile.knowledgePoints ?? 0) > 0 || (profile.totalHarvested ?? 0) > 0)
  );
  const STAGES = [
    { icon: "🌰", name: "Hạt giống", desc: "Khởi đầu nhiệm vụ" },
    { icon: "🌱", name: "Mầm cây", desc: "Trả lời đúng 1 câu" },
    { icon: "🌿", name: "Cây non", desc: "Tăng trưởng vươn cành" },
    { icon: "🌳", name: "Trưởng thành", desc: "Đạt mốc 80% bài" },
    { icon: "🍎", name: "Cây cho quả", desc: "Hoàn thành bài tập" },
    { icon: "🧺", name: "Thu hoạch", desc: "Nhận xu & huy hiệu" },
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Banner with Warm Pastoral Aesthetic */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-emerald-600 via-emerald-700 to-green-800 text-white shadow-xl shadow-emerald-900/15 p-6 sm:p-10 md:p-14">
        {/* Background Atmosphere Elements */}
        <div className="absolute top-4 right-8 text-amber-300 opacity-90 animate-float">
          <Sun className="w-16 h-16 drop-shadow-md" />
        </div>
        <div className="absolute top-12 left-10 text-white/20 hidden md:block animate-pulse">
          <Cloud className="w-20 h-20" />
        </div>
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-emerald-100">
            <Sparkles className="w-4 h-4 text-amber-300" />
            Nền tảng học tập thông minh THCS Lớp 6 - 9
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-tight sm:leading-none text-white drop-shadow-sm">
            🌱 NÔNG TRẠI TRI THỨC
          </h1>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 max-w-2xl">
            <p className="text-base sm:text-lg lg:text-xl font-medium text-emerald-50 leading-relaxed italic">
              “Mỗi câu trả lời đúng – Một mầm cây lớn.
              <br />
              Mỗi bài học hoàn thành – Một mùa thu hoạch.”
            </p>
          </div>

          {/* Action Buttons Grid specified in requirement */}
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              id="hero-btn-start"
              onClick={() => onNavigate("tasks")}
              className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-stone-900 font-extrabold rounded-2xl shadow-lg shadow-amber-500/30 flex items-center gap-2 text-sm sm:text-base transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Sprout className="w-5 h-5 text-stone-900" />
              🌱 Bắt đầu học
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-btn-farm"
              onClick={() => onNavigate("farm")}
              className="px-5 py-3.5 bg-white/90 hover:bg-white text-emerald-950 font-bold rounded-2xl shadow-sm flex items-center gap-2 text-sm sm:text-base transition-all hover:scale-105 cursor-pointer"
            >
              🌾 Nông trại của tôi
            </button>

            <button
              id="hero-btn-ask"
              onClick={() => onNavigate("ai-ask")}
              className="px-4 py-3.5 bg-emerald-800/80 hover:bg-emerald-800 text-white font-semibold rounded-2xl border border-white/20 flex items-center gap-2 text-sm transition-all hover:scale-105 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-blue-300" />
              ❓ Hỏi & Đáp
            </button>

            <button
              id="hero-btn-comp"
              onClick={() => onNavigate("competency")}
              className="px-4 py-3.5 bg-emerald-800/80 hover:bg-emerald-800 text-white font-semibold rounded-2xl border border-white/20 flex items-center gap-2 text-sm transition-all hover:scale-105 cursor-pointer"
            >
              <BarChart3 className="w-4 h-4 text-violet-300" />
              📊 Đánh giá năng lực
            </button>

            <button
              id="hero-btn-leader"
              onClick={() => onNavigate("leaderboard")}
              className="px-4 py-3.5 bg-emerald-800/80 hover:bg-emerald-800 text-white font-semibold rounded-2xl border border-white/20 flex items-center gap-2 text-sm transition-all hover:scale-105 cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-amber-300" />
              🏆 Thành tích
            </button>
          </div>

          {/* Quick portal links for Parents & Teachers */}
          <div className="pt-2 flex items-center gap-3 text-xs text-emerald-100">
            <span>Dành cho:</span>
            <button
              onClick={() => onNavigate("parent")}
              className="underline hover:text-white font-semibold flex items-center gap-1"
            >
              <Users className="w-3.5 h-3.5" /> 👨👩👧 Phụ huynh
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigate("teacher")}
              className="underline hover:text-white font-semibold flex items-center gap-1"
            >
              <GraduationCap className="w-3.5 h-3.5" /> 👩🏫 Giáo viên
            </button>
          </div>
        </div>
      </section>

      {/* How the Farm Works: Game Cycle Flow */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Cơ Chế Game Học Tập Độc Đáo
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-stone-900 mt-2">
            Cây Tri Thức Của Bạn Phát Triển Thế Nào?
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            Không áp lực điểm số khô khan. Mỗi câu trả lời của em sẽ nuôi dưỡng sự sống trên mảnh đất của mình!
          </p>
        </div>

        {/* Growth Pipeline Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {STAGES.map((s, idx) => (
            <div
              key={idx}
              className="relative p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 text-center hover:bg-emerald-50/60 hover:border-emerald-300 transition-all group"
            >
              <div className="text-4xl mb-2 group-hover:scale-125 transition-transform drop-shadow-xs">
                {s.icon}
              </div>
              <div className="text-xs font-bold text-stone-800">{s.name}</div>
              <div className="text-[11px] text-stone-500 mt-0.5">{s.desc}</div>
              {idx < STAGES.length - 1 && (
                <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 text-stone-300 z-10">
                  ➔
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Positive reinforcement explanation */}
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 font-bold text-sm">
              ✓
            </div>
            <div>
              <div className="font-bold text-sm text-emerald-900">Trả lời ĐÚNG</div>
              <p className="text-xs text-emerald-800 mt-0.5">
                Nhận <strong>+10 điểm tri thức</strong>, mầm cây lớn lên ngay lập tức! Đúng chuỗi liên tiếp sẽ giúp cây phát triển siêu tốc và cho quả trĩu cành.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 font-bold text-sm">
              💡
            </div>
            <div>
              <div className="font-bold text-sm text-amber-900">Khi trả lời CHƯA ĐÚNG</div>
              <p className="text-xs text-amber-800 mt-0.5">
                Cây chỉ tạm thời héo nhẹ. Em được xem gợi ý và lời giải thích để học từ lỗi sai, rồi làm câu phục hồi để tưới nước cứu cây!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Summary of Active Student Farm */}
      <section className="bg-gradient-to-br from-amber-100/70 to-emerald-100/70 rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌱</span>
              <div>
                <h3 className="font-display font-extrabold text-xl text-stone-900">
                  {hasActiveProgress
                    ? `Nông trại của ${profile?.fullName || user?.email?.split("@")[0]} 🌱`
                    : "Nông trại của bạn 🌱"}
                </h3>
                <p className="text-xs text-stone-600">
                  {hasActiveProgress
                    ? `${profile?.role === "parent" ? "Phụ huynh" : `Học sinh Lớp ${profile?.grade || 7}`} • Cấp ${Math.floor((profile?.knowledgePoints || 0) / 300) + 1}`
                    : "Bắt đầu hành trình tri thức • Gieo hạt đầu tiên của bạn"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <div className="bg-white/80 px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-700">
                ⭐ Điểm tri thức:{" "}
                <span className="font-extrabold text-emerald-700">
                  {hasActiveProgress ? (profile?.knowledgePoints ?? 0).toLocaleString() : "0"}
                </span>
              </div>
              <div className="bg-white/80 px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-700">
                🌱 Đang trồng:{" "}
                <span className="font-extrabold text-emerald-700">
                  {hasActiveProgress ? `${student.plants.length} cây` : "0 cây"}
                </span>
              </div>
              <div className="bg-white/80 px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-700">
                🧺 Đã thu hoạch:{" "}
                <span className="font-extrabold text-amber-700">
                  {hasActiveProgress ? `${profile?.totalHarvested ?? 0} mùa` : "0 mùa"}
                </span>
              </div>
              <div className="bg-white/80 px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-700">
                🔥 Chuỗi học:{" "}
                <span className="font-extrabold text-orange-600">
                  {hasActiveProgress ? `${profile?.currentStreak ?? 0} ngày` : "0 ngày"}
                </span>
              </div>
            </div>
          </div>

          <button
            id="hero-start-planting-btn"
            onClick={() => onNavigate(hasActiveProgress ? "farm" : "tasks")}
            className="w-full md:w-auto px-6 py-3.5 bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold rounded-2xl shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
          >
            {hasActiveProgress ? "Vào Nông Trại Chăm Cây ➔" : "🌱 Bắt đầu trồng cây →"}
          </button>
        </div>
      </section>
    </div>
  );
};
