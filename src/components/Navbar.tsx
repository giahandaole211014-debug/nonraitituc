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
  LogIn,
  UserPlus,
  LogOut,
  Database,
  CheckCircle2,
} from "lucide-react";
import { UserRole, StudentGrade, AppNotification } from "../types";
import { sound } from "../utils/sound";
import { useAuth } from "../context/AuthContext";

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
  onOpenSupabaseConfig?: () => void;
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
  onOpenSupabaseConfig,
}) => {
  const { user, profile, greeting, signOut } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Authenticated user notifications
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
          {/* Logo & Brand: “NÔNG TRẠI TRI THỨC” + Subtitle + “THCS Lớp 6-9” */}
          <div
            id="brand-logo"
            onClick={() => onSelectTab("home")}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white shadow-md shadow-emerald-200 group-hover:scale-105 transition-transform shrink-0">
              <Sprout className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-lg sm:text-2xl text-emerald-900 tracking-tight">
                  NÔNG TRẠI TRI THỨC
                </span>
                <span className="inline-block px-2 py-0.5 text-[10px] sm:text-xs font-bold bg-emerald-100 text-emerald-800 rounded-full shrink-0">
                  THCS Lớp 6-9
                </span>
              </div>
              <p className="text-[11px] font-medium text-stone-500 hidden sm:block">
                Học để trồng cây • Trồng cây để thu hoạch tri thức
              </p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              id="nav-home"
              onClick={() => onSelectTab("home")}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                currentTab === "home" || currentTab === "/"
                  ? "bg-emerald-100 text-emerald-800 shadow-xs font-bold"
                  : "text-stone-600 hover:text-emerald-700 hover:bg-emerald-50/60"
              }`}
            >
              Trang chủ
            </button>

            <button
              id="nav-farm"
              onClick={() => onSelectTab("farm")}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                currentTab === "farm" || currentTab === "/dashboard"
                  ? "bg-emerald-100 text-emerald-800 shadow-xs font-bold"
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
                currentTab === "tasks" || currentTab === "/learning"
                  ? "bg-emerald-100 text-emerald-800 shadow-xs font-bold"
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
                currentTab === "ai-ask" || currentTab === "/ai-ask" || currentTab === "/ai-tutor"
                  ? "bg-emerald-100 text-emerald-800 shadow-xs font-bold"
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
                  ? "bg-emerald-100 text-emerald-800 shadow-xs font-bold"
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
                currentTab === "competency" || currentTab === "/competency" || currentTab === "/ability"
                  ? "bg-emerald-100 text-emerald-800 shadow-xs font-bold"
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
                  ? "bg-emerald-100 text-emerald-800 shadow-xs font-bold"
                  : "text-stone-600 hover:text-emerald-700 hover:bg-emerald-50/60"
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-600" />
              Thành tích
            </button>

            {user && profile?.role === "parent" && (
              <button
                id="nav-parent"
                onClick={() => onSelectTab("parent")}
                className={`px-3 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                  currentTab === "parent" || currentTab === "/parent" || currentTab === "/parent-dashboard"
                    ? "bg-blue-100 text-blue-800 shadow-xs"
                    : "text-blue-700 hover:bg-blue-50"
                }`}
              >
                <Users className="w-4 h-4 text-blue-600" />
                Phụ huynh
              </button>
            )}
          </nav>

          {/* Right Area: Clean Unauthenticated Guest vs Authenticated User */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Stats: ONLY shown when user IS LOGGED IN with real account */}
            {user && profile?.role !== "parent" && (
              <div className="hidden sm:flex items-center gap-2 bg-amber-50/80 border border-amber-200/70 px-3 py-1.5 rounded-2xl animate-in fade-in">
                {/* Knowledge Points */}
                <div className="flex items-center gap-1.5 text-stone-700 font-bold text-xs" title="Điểm Tri Thức của bạn">
                  <span className="text-emerald-600 font-extrabold">
                    {(profile?.knowledgePoints ?? knowledgePoints ?? 0).toLocaleString()}
                  </span>
                  <span className="text-stone-400">điểm</span>
                </div>
                <div className="w-px h-3.5 bg-amber-200" />
                {/* Coins */}
                <div className="flex items-center gap-1 text-amber-700 font-bold text-xs" title="Xu Tri Thức của bạn">
                  <Coins className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{profile?.coins ?? coins ?? 0}</span>
                </div>
                <div className="w-px h-3.5 bg-amber-200" />
                {/* Streak */}
                <div className="flex items-center gap-1 text-orange-600 font-bold text-xs" title="Chuỗi ngày học liên tục">
                  <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                  <span>{profile?.currentStreak ?? streak ?? 1} ngày</span>
                </div>
              </div>
            )}

            {/* Sound toggle: General website function */}
            <button
              id="sound-toggle-btn"
              onClick={toggleSound}
              title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
              className="p-2 text-stone-500 hover:text-emerald-700 hover:bg-emerald-50/60 rounded-xl transition-colors cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
            </button>

            {/* Notification Bell: General system info for guest, personal notifications for logged-in user */}
            <div className="relative">
              <button
                id="notif-btn"
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                title={user ? "Thông báo của bạn" : "Thông báo chung"}
                className="relative p-2 text-stone-600 hover:text-emerald-700 hover:bg-emerald-50/60 rounded-xl transition-colors cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                {user && unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-stone-200 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                  {user ? (
                    <>
                      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                        <span className="font-bold text-sm text-stone-800">
                          Thông báo ({currentRole === "student" ? "Học sinh" : currentRole === "parent" ? "Phụ huynh" : "Giáo viên"})
                        </span>
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
                    </>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                        <span className="font-bold text-sm text-stone-800">Thông báo hệ thống</span>
                        <span className="text-xs text-emerald-600 font-bold">Khách</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-stone-800 text-xs">
                        <div className="flex items-center gap-2 font-bold text-emerald-900 mb-1">
                          <span>🌱</span>
                          <span>Chào mừng bạn đến với Nông Trại Tri Thức!</span>
                        </div>
                        <p className="text-stone-600 leading-relaxed text-[11px]">
                          Nền tảng học tập tương tác Gamification dành cho học sinh THCS Lớp 6 - 9. Đăng ký tài khoản thật bằng Email hoặc tài khoản Google để bắt đầu gieo mầm tri thức và thu hoạch thành tích!
                        </p>
                        <div className="mt-3 pt-2.5 border-t border-emerald-200/60 flex items-center gap-2">
                          <button
                            onClick={() => {
                              setShowNotifMenu(false);
                              onSelectTab("/register");
                            }}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-[11px] font-extrabold hover:bg-emerald-700 cursor-pointer shadow-xs"
                          >
                            👤 Đăng ký tài khoản
                          </button>
                          <button
                            onClick={() => {
                              setShowNotifMenu(false);
                              onSelectTab("/login");
                            }}
                            className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 text-[11px] font-bold hover:bg-stone-50 cursor-pointer"
                          >
                            🔑 Đăng nhập
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Switch between Authenticated User Profile OR Unauthenticated Guest Actions */}
            {user ? (
              <div className="relative">
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setShowRoleMenu(!showRoleMenu)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-emerald-50 hover:bg-emerald-100/80 rounded-2xl border border-emerald-200 text-xs font-semibold text-stone-700 transition-all cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs overflow-hidden">
                    {profile?.avatarUrl && (profile.avatarUrl.startsWith("http") || profile.avatarUrl.startsWith("https")) ? (
                      <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <span>{profile?.avatarUrl || "🌱"}</span>
                    )}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="leading-tight font-extrabold text-emerald-950 line-clamp-1 max-w-[130px]">
                      {profile?.fullName || user.email?.split("@")[0]}
                    </div>
                    <div className="text-[10px] text-emerald-700 font-bold">
                      {profile?.role === "parent" ? "Phụ huynh" : `Học sinh Lớp ${profile?.grade || 7}`}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-emerald-600 ml-0.5" />
                </button>

                {/* User Dropdown Menu */}
                {showRoleMenu && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-stone-200 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                    {/* User Greeting Header */}
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 mb-2">
                      <p className="text-xs font-black text-emerald-900 leading-snug">
                        {greeting || `Xin chào, ${profile?.fullName || user.email?.split("@")[0]} 🌱`}
                      </p>
                      <p className="text-[11px] text-stone-500 mt-0.5 break-all">
                        {user.email}
                      </p>
                      <div className="mt-1 flex items-center gap-1.5 text-[10px] font-bold text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Xác thực qua Supabase Auth</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          onSelectTab("/profile");
                          setShowRoleMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-50 flex items-center gap-2 cursor-pointer"
                      >
                        <User className="w-4 h-4 text-emerald-600" />
                        <span>Hồ sơ cá nhân & Thành tích</span>
                      </button>

                      <button
                        onClick={() => {
                          onSelectTab("/dashboard");
                          setShowRoleMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-50 flex items-center gap-2 cursor-pointer"
                      >
                        <Sprout className="w-4 h-4 text-emerald-600" />
                        <span>Nông trại tri thức (/dashboard)</span>
                      </button>

                      {onOpenSupabaseConfig && (
                        <button
                          onClick={() => {
                            onOpenSupabaseConfig();
                            setShowRoleMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-50 flex items-center gap-2 cursor-pointer"
                        >
                          <Database className="w-4 h-4 text-blue-600" />
                          <span>Cài đặt Supabase</span>
                        </button>
                      )}

                      <div className="border-t border-stone-100 my-1 pt-1">
                        <button
                          onClick={async () => {
                            setShowRoleMenu(false);
                            await signOut();
                            onSelectTab("/login");
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Guest Actions: “🔑 Đăng nhập” and prominent “👤 Đăng ký” */
              <div className="flex items-center gap-1.5 sm:gap-2.5">
                <button
                  id="header-login-btn"
                  onClick={() => onSelectTab("/login")}
                  className="px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-stone-700 hover:text-emerald-700 hover:bg-emerald-50/80 transition-all flex items-center gap-1.5 cursor-pointer border border-stone-200 hover:border-emerald-300 shadow-2xs"
                >
                  <span className="text-sm">🔑</span>
                  <span>Đăng nhập</span>
                </button>

                <button
                  id="header-register-btn"
                  onClick={() => onSelectTab("/register")}
                  className="px-3.5 sm:px-4.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-sm shadow-emerald-700/25 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="text-sm">👤</span>
                  <span>Đăng ký</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar: Guest vs Logged-In User */}
      <div className="lg:hidden border-t border-emerald-100 bg-white px-3 py-2 flex justify-around items-center shadow-lg">
        {user ? (
          <>
            <button
              onClick={() => onSelectTab("farm")}
              className={`flex flex-col items-center p-1 text-[10px] font-semibold ${
                currentTab === "farm" || currentTab === "/dashboard" ? "text-emerald-700 font-bold" : "text-stone-500"
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
              onClick={() => onSelectTab("/profile")}
              className={`flex flex-col items-center p-1 text-[10px] font-semibold ${
                currentTab === "/profile" ? "text-emerald-700 font-bold" : "text-stone-500"
              }`}
            >
              <User className="w-4 h-4 mb-0.5" />
              Hồ sơ
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onSelectTab("home")}
              className={`flex flex-col items-center p-1 text-[10px] font-bold ${
                currentTab === "home" || currentTab === "/" ? "text-emerald-700" : "text-stone-600"
              }`}
            >
              <Sprout className="w-4 h-4 mb-0.5 text-emerald-600" />
              Trang chủ
            </button>
            <button
              onClick={() => onSelectTab("leaderboard")}
              className={`flex flex-col items-center p-1 text-[10px] font-bold ${
                currentTab === "leaderboard" ? "text-amber-700" : "text-stone-600"
              }`}
            >
              <Trophy className="w-4 h-4 mb-0.5 text-amber-600" />
              Vinh danh
            </button>
            <button
              onClick={() => onSelectTab("/login")}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-stone-200 text-stone-700 font-bold text-xs hover:bg-stone-50 cursor-pointer"
            >
              <span>🔑</span>
              <span>Đăng nhập</span>
            </button>
            <button
              onClick={() => onSelectTab("/register")}
              className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs shadow-xs hover:shadow cursor-pointer"
            >
              <span>👤</span>
              <span>Đăng ký</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
};
