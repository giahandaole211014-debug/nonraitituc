import React, { useState } from "react";
import {
  Trophy,
  Award,
  Medal,
  Flame,
  Sprout,
  CheckCircle,
  Crown,
  Sparkles,
} from "lucide-react";
import { LeaderboardEntry, StudentProfile } from "../types";

interface LeaderboardViewProps {
  entries: LeaderboardEntry[];
  currentStudent: StudentProfile;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  entries,
  currentStudent,
}) => {
  const [filterType, setFilterType] = useState<
    "points" | "tasks" | "planted" | "harvested" | "streak"
  >("points");

  // Level ladder reference from Section 14
  const LEVEL_LADDER = [
    { level: 1, title: "Người gieo hạt", exp: "0 - 500", icon: "🌰" },
    { level: 2, title: "Người làm vườn", exp: "500 - 1.200", icon: "🌱" },
    { level: 3, title: "Thợ làm vườn chăm chỉ", exp: "1.200 - 2.500", icon: "🌿" },
    { level: 4, title: "Bậc thầy nông trại", exp: "2.500 - 5.000", icon: "🌳" },
    { level: 5, title: "Hiệp sĩ tri thức", exp: "5.000 - 10.000", icon: "⚔️" },
    { level: 6, title: "Đại pháp sư nông trại tri thức", exp: "10.000+", icon: "🧙♂️" },
  ];

  // Sort entries based on filter
  const sortedEntries = [...entries].sort((a, b) => {
    switch (filterType) {
      case "tasks":
        return b.completedTasks - a.completedTasks;
      case "planted":
        return b.plantedTrees - a.plantedTrees;
      case "harvested":
        return b.harvestedCrops - a.harvestedCrops;
      case "streak":
        return b.streakDays - a.streakDays;
      case "points":
      default:
        return b.points - a.points;
    }
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              Bảng Vinh Danh Nông Dân Tri Thức Xuất Sắc
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-stone-900 mt-2 flex items-center gap-2">
              <span>🏆</span> BẢNG XẾP HẠNG TRI THỨC
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Tôn vinh những nỗ lực học tập và thành quả chăm sóc nông trại của học sinh THCS.
            </p>
          </div>

          {/* Metric Selector Filter (Section 14.1) */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setFilterType("points")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === "points"
                  ? "bg-amber-400 text-stone-900 shadow-xs"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              ⭐ Điểm tri thức
            </button>
            <button
              onClick={() => setFilterType("tasks")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === "tasks"
                  ? "bg-amber-400 text-stone-900 shadow-xs"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              📚 Số bài hoàn thành
            </button>
            <button
              onClick={() => setFilterType("planted")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === "planted"
                  ? "bg-amber-400 text-stone-900 shadow-xs"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              🌱 Cây đã trồng
            </button>
            <button
              onClick={() => setFilterType("harvested")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === "harvested"
                  ? "bg-amber-400 text-stone-900 shadow-xs"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              🧺 Cây đã thu hoạch
            </button>
            <button
              onClick={() => setFilterType("streak")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === "streak"
                  ? "bg-amber-400 text-stone-900 shadow-xs"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              🔥 Chuỗi ngày học
            </button>
          </div>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        {/* Rank 2 */}
        {sortedEntries[1] && (
          <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-xs text-center order-2 md:order-1">
            <div className="w-12 h-12 rounded-full bg-stone-200 text-stone-700 font-black text-lg flex items-center justify-center mx-auto mb-2">
              2
            </div>
            <div className="text-3xl mb-1">{sortedEntries[1].avatar}</div>
            <div className="font-bold text-stone-900">{sortedEntries[1].studentName}</div>
            <div className="text-xs text-stone-500">Lớp {sortedEntries[1].grade}</div>
            <div className="mt-3 py-2 bg-stone-50 rounded-xl font-extrabold text-stone-800 text-sm">
              {filterType === "points" && `${sortedEntries[1].points.toLocaleString()} Điểm`}
              {filterType === "tasks" && `${sortedEntries[1].completedTasks} Bài`}
              {filterType === "planted" && `${sortedEntries[1].plantedTrees} Cây`}
              {filterType === "harvested" && `${sortedEntries[1].harvestedCrops} Mùa`}
              {filterType === "streak" && `${sortedEntries[1].streakDays} Ngày`}
            </div>
          </div>
        )}

        {/* Rank 1 (Champion) */}
        {sortedEntries[0] && (
          <div className="bg-gradient-to-b from-amber-50 to-white rounded-3xl p-6 border-2 border-amber-400 shadow-lg text-center order-1 md:order-2 transform md:-translate-y-4">
            <div className="w-14 h-14 rounded-full bg-amber-400 text-stone-900 font-black text-2xl flex items-center justify-center mx-auto mb-2 shadow-md">
              👑
            </div>
            <div className="text-4xl mb-1">{sortedEntries[0].avatar}</div>
            <div className="font-display font-black text-lg text-stone-900">
              {sortedEntries[0].studentName}
            </div>
            <div className="text-xs text-amber-800 font-bold">Quán quân • Lớp {sortedEntries[0].grade}</div>
            <div className="mt-3 py-2.5 bg-amber-400/30 rounded-xl font-black text-stone-900 text-base">
              {filterType === "points" && `${sortedEntries[0].points.toLocaleString()} Điểm`}
              {filterType === "tasks" && `${sortedEntries[0].completedTasks} Bài`}
              {filterType === "planted" && `${sortedEntries[0].plantedTrees} Cây`}
              {filterType === "harvested" && `${sortedEntries[0].harvestedCrops} Mùa`}
              {filterType === "streak" && `${sortedEntries[0].streakDays} Ngày`}
            </div>
          </div>
        )}

        {/* Rank 3 */}
        {sortedEntries[2] && (
          <div className="bg-white rounded-3xl p-5 border-2 border-amber-200/60 shadow-xs text-center order-3">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 font-black text-lg flex items-center justify-center mx-auto mb-2">
              3
            </div>
            <div className="text-3xl mb-1">{sortedEntries[2].avatar}</div>
            <div className="font-bold text-stone-900">{sortedEntries[2].studentName}</div>
            <div className="text-xs text-stone-500">Lớp {sortedEntries[2].grade}</div>
            <div className="mt-3 py-2 bg-stone-50 rounded-xl font-extrabold text-stone-800 text-sm">
              {filterType === "points" && `${sortedEntries[2].points.toLocaleString()} Điểm`}
              {filterType === "tasks" && `${sortedEntries[2].completedTasks} Bài`}
              {filterType === "planted" && `${sortedEntries[2].plantedTrees} Cây`}
              {filterType === "harvested" && `${sortedEntries[2].harvestedCrops} Mùa`}
              {filterType === "streak" && `${sortedEntries[2].streakDays} Ngày`}
            </div>
          </div>
        )}
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
        <h3 className="font-display font-extrabold text-lg text-stone-900">
          Danh Sách Xếp Hạng Đầy Đủ
        </h3>

        <div className="divide-y divide-stone-100">
          {sortedEntries.map((entry, idx) => {
            const isMe = entry.studentName === currentStudent.name;
            return (
              <div
                key={entry.id}
                className={`py-3.5 px-3 rounded-2xl flex items-center justify-between transition-colors ${
                  isMe ? "bg-amber-50/80 font-bold border border-amber-200" : "hover:bg-stone-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                      idx === 0
                        ? "bg-amber-400 text-stone-900"
                        : idx === 1
                        ? "bg-stone-200 text-stone-700"
                        : idx === 2
                        ? "bg-amber-100 text-amber-800"
                        : "text-stone-400"
                    }`}
                  >
                    #{idx + 1}
                  </span>
                  <span className="text-2xl">{entry.avatar}</span>
                  <div>
                    <div className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                      <span>{entry.studentName}</span>
                      {isMe && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500 text-white font-bold">
                          Bạn
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-stone-400">
                      Lớp {entry.grade} • {entry.levelTitle}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-black text-sm text-stone-900">
                    {filterType === "points" && `${entry.points.toLocaleString()} Điểm`}
                    {filterType === "tasks" && `${entry.completedTasks} Bài`}
                    {filterType === "planted" && `${entry.plantedTrees} Cây`}
                    {filterType === "harvested" && `${entry.harvestedCrops} Thu hoạch`}
                    {filterType === "streak" && `${entry.streakDays} Ngày liên tục`}
                  </div>
                  <div className="text-[11px] text-stone-400 flex items-center justify-end gap-1">
                    <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
                    <span>{entry.streakDays} ngày</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges and Level Ladder Showcase (Section 14.2 & 14.3) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Badges */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="font-display font-extrabold text-base text-stone-900">
              Huy Hiệu & Danh Hiệu Danh Dự
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {currentStudent.badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
                  badge.unlockedAt
                    ? "bg-amber-50/50 border-amber-200 text-stone-900"
                    : "bg-stone-50 border-stone-200 opacity-50 grayscale"
                }`}
              >
                <span className="text-3xl">{badge.icon}</span>
                <div>
                  <div className="text-xs font-bold text-stone-900">{badge.name}</div>
                  <div className="text-[11px] text-stone-500">{badge.description}</div>
                  {badge.unlockedAt && (
                    <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                      ✓ Đạt ngày: {badge.unlockedAt}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Level Progression Ladder (Section 14.3) */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <h3 className="font-display font-extrabold text-base text-stone-900">
              Thang Cấp Độ Nông Dân Tri Thức (1 - 6)
            </h3>
          </div>

          <div className="space-y-2 pt-1">
            {LEVEL_LADDER.map((lvl) => {
              const isCurrent = currentStudent.level === lvl.level;
              return (
                <div
                  key={lvl.level}
                  className={`p-2.5 px-3.5 rounded-2xl border flex items-center justify-between text-xs ${
                    isCurrent
                      ? "bg-emerald-50 border-emerald-400 font-bold shadow-2xs"
                      : "bg-stone-50 border-stone-200 text-stone-600"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{lvl.icon}</span>
                    <div>
                      <span className="font-extrabold text-stone-900">Cấp {lvl.level}:</span>{" "}
                      <span>{lvl.title}</span>
                    </div>
                  </div>
                  <div className="text-[11px] font-semibold text-stone-400">
                    {lvl.exp} EXP
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
