import React, { useState } from "react";
import {
  Sprout,
  Trophy,
  HelpCircle,
  BarChart3,
  Flame,
  Coins,
  Bell,
  User,
  Users,
  GraduationCap,
  Sparkles,
  BookOpen,
  ChevronDown,
  Volume2,
  VolumeX,
} from "lucide-react";
import { UserRole, StudentGrade, AppNotification } from "../types";
import { sound } from "../utils/sound";

interface NavbarProps {
  currentRole: UserRole;
  currentGrade: StudentGrade;
  studentName: string;
  level: number;
  levelTitle: string;
  knowledgePoints: number;
  coins: number;
  streak: number;
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAuthModal: () => void;
  notifications: AppNotification[];
  onMarkNotificationRead: (id: string) => void;
  onQuickSwitchRole: (role: UserRole, grade?: StudentGrade, studentId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  currentGrade,
  studentName,
  levelTitle,
  knowledgePoints,
  coins,
  streak,
  currentTab,
  onSelectTab,
  onOpenAuthModal,
  notifications,
  onMarkNotificationRead,
  onQuickSwitchRole,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const roleNotifs = notifications.filter((n) => n.recipientRole === currentRole);
  const unreadCount = roleNotifs.filter((n) => !n.isRead).length;

  const toggleSound = () => {
    sound.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <div
            id="brand-logo"
            onClick={() => onSelectTab("home")}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center text-white shadow-md shadow-emerald-200 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-xl sm:text-2xl text-emerald-900 tracking-tight">
                  NÔNG TRẠI TRI THỨC
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full">
                  THCS Lớp 6-9
                </span>
              </div>
              <p className="text-[11px] font-medium text-stone-500 hidden md:block">
                Học để trồng cây • Trồng cây để thu hoạch tri thức
              </p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              id="nav-farm"
              onClick={() => onSelectTab("farm")}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                currentTab === "farm"
                  ? "bg-emerald-100 text-emerald-800 shadow-xs"
                  : "text-stone-600 hover:text-emerald-700 hover:bg-emerald-50/60"
              }`}
            >
              <Sprout className="w-4 h-4 text-emerald-600" />
              Nông trại
            </button>

            <button
              id="nav-tasks"
              onClick={() => onSelectTab("tasks")}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                currentTab === "tasks"
                  ? "bg-emerald-100 text-emerald-800 shadow-xs"
                  : "text-stone-600 hover:text-emerald-700 hover:bg-emerald-50/60"
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              Nhiệm vụ
            </button>

            <button
              id="nav-ai-ask"
              onClick={() => onSelectTab("ai-ask")}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                currentTab === "ai-ask"
                  ? "bg-emerald-100 text-emerald-800 shadow-xs"
                  : "text-stone-600 hover:text-emerald-700 hover:bg-emerald-50/60"
              }`}
            >
              <HelpCircle className="w-4 h-4 text-blue-600" />
              Hỏi đáp AI
            </button>

            <button
              id="nav-ai-quiz"
              onClick={() => onSelectTab("ai-quiz")}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                currentTab === "ai-quiz"
                  ? "bg-emerald-100 text-emerald-800 shadow-xs"
                  : "text-stone-600 hover:text-emerald-700 hover:bg-emerald-50/60"
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              AI Thử thách
            </button>

            <button
              id="nav-competency"
              onClick={() => onSelectTab("competency")}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                currentTab === "competency"
                  ? "bg-emerald-100 text-emerald-800 shadow-xs"
                  : "text-stone-600 hover:text-emerald-700 hover:bg-emerald-50/60"
              }`}
            >
              <BarChart3 className="w-4 h-4 text-violet-600" />
              Đánh giá
            </button>

            <button
              id="nav-leaderboard"
              onClick={() => onSelectTab("leaderboard")}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                currentTab === "leaderboard"
                  ? "bg-emerald-100 text-emerald-800 shadow-xs"
                  : "text-stone-600 hover:text-emerald-700 hover:bg-emerald-50/60"
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-600" />
              Thành tích
            </button>

            {currentRole === "parent" && (
              <button
                id="nav-parent"
                onClick={() => onSelectTab("parent")}
                className={`px-3 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                  currentTab === "parent"
                    ? "bg-blue-100 text-blue-800 shadow-xs"
                    : "text-blue-700 hover:bg-blue-50"
                }`}
              >
                <Users className="w-4 h-4 text-blue-600" />
                Phụ huynh
              </button>
            )}

            {currentRole === "teacher" && (
              <button
                id="nav-teacher"
                onClick={() => onSelectTab("teacher")}
                className={`px-3 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                  currentTab === "teacher"
                    ? "bg-purple-100 text-purple-800 shadow-xs"
                    : "text-purple-700 hover:bg-purple-50"
                }`}
              >
                <GraduationCap className="w-4 h-4 text-purple-600" />
                Giáo viên
              </button>
            )}
          </nav>

          {/* Right Status Badges & Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Student Quick Stats (When in student mode) */}
            {currentRole === "student" && (
              <div className="hidden sm:flex items-center gap-2 bg-amber-50/80 border border-amber-200/70 px-3 py-1.5 rounded-2xl">
                {/* Knowledge Points */}
                <div className="flex items-center gap-1.5 text-stone-700 font-bold text-xs" title="Điểm Tri Thức">
                  <span className="text-emerald-600 font-extrabold">{knowledgePoints.toLocaleString()}</span>
                  <span className="text-stone-400">điểm</span>
                </div>
                <div className="w-px h-3.5 bg-amber-200" />
                {/* Coins */}
                <div className="flex items-center gap-1 text-amber-700 font-bold text-xs" title="Xu Tri Thức">
                  <Coins className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{coins}</span>
                </div>
                <div className="w-px h-3.5 bg-amber-200" />
                {/* Streak */}
                <div className="flex items-center gap-1 text-orange-600 font-bold text-xs" title="Chuỗi ngày học liên tục">
                  <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                  <span>{streak} ngày</span>
                </div>
              </div>
            )}

            {/* Sound toggle */}
            <button
              id="sound-toggle-btn"
              onClick={toggleSound}
              title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
              className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-xl transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                id="notif-btn"
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 text-stone-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-stone-200 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <span className="font-bold text-sm text-stone-800">Thông báo ({currentRole === "student" ? "Học sinh" : currentRole === "parent" ? "Phụ huynh" : "Giáo viên"})</span>
                    <span className="text-xs text-stone-400">{unreadCount} tin mới</span>
                  </div>
                  <div className="mt-2 max-h-72 overflow-y-auto space-y-2">
                    {roleNotifs.length === 0 ? (
                      <p className="text-xs text-stone-500 py-4 text-center">Không có thông báo mới.</p>
                    ) : (
                      roleNotifs.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => onMarkNotificationRead(n.id)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                            n.isRead ? "bg-stone-50 border-stone-100 text-stone-500" : "bg-emerald-50/60 border-emerald-100 text-stone-800 font-medium"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-emerald-900">{n.title}</span>
                            <span className="text-[10px] text-stone-400">{n.timestamp}</span>
                          </div>
                          <p className="text-stone-600 leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Role Switcher Pill */}
            <div className="relative">
              <button
                id="role-switch-btn"
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-stone-100 hover:bg-stone-200/80 rounded-2xl border border-stone-200 text-xs font-semibold text-stone-700 transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  {currentRole === "student" ? "HS" : currentRole === "parent" ? "PH" : "GV"}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="leading-tight font-bold text-stone-900 line-clamp-1 max-w-[100px]">
                    {currentRole === "student" ? studentName : currentRole === "parent" ? "Mẹ Thu Hương" : "Cô Mai Lan"}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-medium">
                    {currentRole === "student" ? `Lớp ${currentGrade} • ${levelTitle}` : currentRole === "parent" ? "Phụ huynh Gia Hân" : "GVCN Lớp 7A"}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 ml-1" />
              </button>

              {/* Role Switcher Menu */}
              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 p-3 z-50">
                  <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider px-2 py-1">
                    Chuyển tài khoản trải nghiệm
                  </div>

                  <div className="space-y-1 mt-1">
                    <div className="px-2 py-1 text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" /> Học sinh các khối:
                    </div>
                    <button
                      onClick={() => {
                        onQuickSwitchRole("student", 6, "tuankiet6");
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs flex items-center justify-between ${
                        currentRole === "student" && currentGrade === 6 ? "bg-emerald-50 text-emerald-800 font-bold" : "hover:bg-stone-50 text-stone-700"
                      }`}
                    >
                      <span>👦 Tuấn Kiệt (Lớp 6)</span>
                      <span className="text-[10px] text-stone-400">Cấp 3</span>
                    </button>
                    <button
                      onClick={() => {
                        onQuickSwitchRole("student", 7, "giahan7");
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs flex items-center justify-between ${
                        currentRole === "student" && currentGrade === 7 ? "bg-emerald-50 text-emerald-800 font-bold" : "hover:bg-stone-50 text-stone-700"
                      }`}
                    >
                      <span>👧 Gia Hân (Lớp 7 - Mẫu)</span>
                      <span className="text-[10px] text-emerald-600 font-bold">Cấp 4</span>
                    </button>
                    <button
                      onClick={() => {
                        onQuickSwitchRole("student", 8, "minhanh8");
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs flex items-center justify-between ${
                        currentRole === "student" && currentGrade === 8 ? "bg-emerald-50 text-emerald-800 font-bold" : "hover:bg-stone-50 text-stone-700"
                      }`}
                    >
                      <span>👧 Minh Anh (Lớp 8)</span>
                      <span className="text-[10px] text-stone-400">Cấp 5</span>
                    </button>
                    <button
                      onClick={() => {
                        onQuickSwitchRole("student", 9, "hoanglong9");
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs flex items-center justify-between ${
                        currentRole === "student" && currentGrade === 9 ? "bg-emerald-50 text-emerald-800 font-bold" : "hover:bg-stone-50 text-stone-700"
                      }`}
                    >
                      <span>🧑 Hoàng Long (Lớp 9)</span>
                      <span className="text-[10px] text-stone-400">Cấp 6</span>
                    </button>
                  </div>

                  <div className="border-t border-stone-100 my-2 pt-1 space-y-1">
                    <button
                      onClick={() => {
                        onQuickSwitchRole("parent");
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 ${
                        currentRole === "parent" ? "bg-blue-50 text-blue-800 font-bold" : "hover:bg-stone-50 text-stone-700"
                      }`}
                    >
                      <Users className="w-3.5 h-3.5 text-blue-600" />
                      <span>Phụ huynh: Mẹ Thu Hương</span>
                    </button>
                    <button
                      onClick={() => {
                        onQuickSwitchRole("teacher");
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 ${
                        currentRole === "teacher" ? "bg-purple-50 text-purple-800 font-bold" : "hover:bg-stone-50 text-stone-700"
                      }`}
                    >
                      <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
                      <span>Giáo viên: Cô Mai Lan</span>
                    </button>
                  </div>

                  <div className="border-t border-stone-100 pt-2">
                    <button
                      onClick={() => {
                        setShowRoleMenu(false);
                        onOpenAuthModal();
                      }}
                      className="w-full py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold text-center"
                    >
                      Đăng nhập tài khoản khác
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden border-t border-emerald-100 bg-white px-2 py-1.5 flex justify-around items-center">
        <button
          onClick={() => onSelectTab("farm")}
          className={`flex flex-col items-center p-1 text-[10px] font-semibold ${
            currentTab === "farm" ? "text-emerald-700 font-bold" : "text-stone-500"
          }`}
        >
          <Sprout className="w-4 h-4 mb-0.5" />
          Nông trại
        </button>
        <button
          onClick={() => onSelectTab("tasks")}
          className={`flex flex-col items-center p-1 text-[10px] font-semibold ${
            currentTab === "tasks" ? "text-emerald-700 font-bold" : "text-stone-500"
          }`}
        >
          <BookOpen className="w-4 h-4 mb-0.5" />
          Nhiệm vụ
        </button>
        <button
          onClick={() => onSelectTab("ai-ask")}
          className={`flex flex-col items-center p-1 text-[10px] font-semibold ${
            currentTab === "ai-ask" ? "text-blue-700 font-bold" : "text-stone-500"
          }`}
        >
          <HelpCircle className="w-4 h-4 mb-0.5" />
          Hỏi AI
        </button>
        <button
          onClick={() => onSelectTab("competency")}
          className={`flex flex-col items-center p-1 text-[10px] font-semibold ${
            currentTab === "competency" ? "text-violet-700 font-bold" : "text-stone-500"
          }`}
        >
          <BarChart3 className="w-4 h-4 mb-0.5" />
          Đánh giá
        </button>
        <button
          onClick={() => onSelectTab("leaderboard")}
          className={`flex flex-col items-center p-1 text-[10px] font-semibold ${
            currentTab === "leaderboard" ? "text-amber-700 font-bold" : "text-stone-500"
          }`}
        >
          <Trophy className="w-4 h-4 mb-0.5" />
          Vinh danh
        </button>
        {currentRole === "parent" && (
          <button
            onClick={() => onSelectTab("parent")}
            className={`flex flex-col items-center p-1 text-[10px] font-semibold ${
              currentTab === "parent" ? "text-blue-700 font-bold" : "text-stone-500"
            }`}
          >
            <Users className="w-4 h-4 mb-0.5" />
            Phụ huynh
          </button>
        )}
        {currentRole === "teacher" && (
          <button
            onClick={() => onSelectTab("teacher")}
            className={`flex flex-col items-center p-1 text-[10px] font-semibold ${
              currentTab === "teacher" ? "text-purple-700 font-bold" : "text-stone-500"
            }`}
          >
            <GraduationCap className="w-4 h-4 mb-0.5" />
            Giáo viên
          </button>
        )}
      </div>
    </header>
  );
};
