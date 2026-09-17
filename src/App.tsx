import React, { useState, useEffect } from "react";
import { UserRole, StudentGrade, StudentProfile, AppNotification, Plant } from "./types";
import { studentsData, mockParent, mockTeacher, mockLeaderboard, mockNotifications } from "./data/mockData";
import { Navbar } from "./components/Navbar";
import { HomeHero } from "./components/HomeHero";
import { MyFarmView } from "./components/MyFarmView";
import { TaskZoneView } from "./components/TaskZoneView";
import { AiAskView } from "./components/AiAskView";
import { AiQuizChallengeView } from "./components/AiQuizChallengeView";
import { CompetencyAnalysisView } from "./components/CompetencyAnalysisView";
import { ParentDashboardView } from "./components/ParentDashboardView";
import { TeacherDashboardView } from "./components/TeacherDashboardView";
import { LeaderboardView } from "./components/LeaderboardView";
import { AuthModal } from "./components/AuthModal";

// Real Supabase Auth & Profile pages
import { AuthProvider, useAuth } from "./context/AuthContext";
import { RegisterPage } from "./components/RegisterPage";
import { LoginPage } from "./components/LoginPage";
import { ForgotPasswordPage } from "./components/ForgotPasswordPage";
import { ResetPasswordPage } from "./components/ResetPasswordPage";
import { ProfilePage } from "./components/ProfilePage";
import { SupabaseConfigModal } from "./components/SupabaseConfigModal";
import { Sparkles, Sprout, ArrowRight } from "lucide-react";

function MainApp() {
  const { user, profile, greeting, welcomeMessage, clearWelcomeMessage, loading } = useAuth();

  // Normalize path from window.location
  const getInitialTab = () => {
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;
      if (
        pathname === "/register" ||
        pathname === "/login" ||
        pathname === "/forgot-password" ||
        pathname === "/reset-password" ||
        pathname === "/profile" ||
        pathname === "/dashboard" ||
        pathname === "/learning" ||
        pathname === "/tasks" ||
        pathname === "/ai-tutor" ||
        pathname === "/ai-ask" ||
        pathname === "/ability" ||
        pathname === "/competency" ||
        pathname === "/farm" ||
        pathname === "/parent-dashboard" ||
        pathname === "/parent"
      ) {
        return pathname;
      }
    }
    return "home";
  };

  const [role, setRole] = useState<UserRole>("student");
  const [currentGrade, setCurrentGrade] = useState<StudentGrade>(7);
  const [currentTab, setCurrentTab] = useState<string>(getInitialTab);
  const [authNotice, setAuthNotice] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);

  // Active Student State
  const [student, setStudent] = useState<StudentProfile>(studentsData["giahan7"]);
  // Active Parent & Teacher State
  const [parent, setParent] = useState(mockParent);
  const [teacher, setTeacher] = useState(mockTeacher);
  // Notifications & Leaderboard
  const [notifications, setNotifications] = useState<AppNotification[]>(mockNotifications);
  const [leaderboard, setLeaderboard] = useState(mockLeaderboard);

  // Section 10: Check if route requires authentication
  const isProtectedRoute = (path: string) => {
    const protectedList = [
      "/dashboard",
      "/learning",
      "/tasks",
      "tasks",
      "/ai-tutor",
      "/ai-ask",
      "ai-ask",
      "/ability",
      "/competency",
      "competency",
      "/farm",
      "farm",
      "/profile",
      "profile",
      "/parent-dashboard",
      "/parent",
      "parent",
    ];
    return protectedList.includes(path);
  };

  // Enforce route protection and auth state redirection
  useEffect(() => {
    if (loading) return;

    if (!user && isProtectedRoute(currentTab)) {
      setAuthNotice("Vui lòng đăng nhập để truy cập trang này.");
      setCurrentTab("/login");
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.history.replaceState(null, "", "/login");
      }
    } else if (user && (currentTab === "/login" || currentTab === "/register")) {
      setAuthNotice(null);
      setCurrentTab("/dashboard");
      if (typeof window !== "undefined" && window.location.pathname !== "/dashboard") {
        window.history.replaceState(null, "", "/dashboard");
      }
    }
  }, [user, currentTab, loading]);

  // Synchronize authenticated user profile into state
  useEffect(() => {
    if (profile) {
      if (profile.role === "parent") {
        setRole("parent");
        setParent((prev) => ({
          ...prev,
          parentName: profile.fullName,
        }));
      } else {
        setRole("student");
        if (profile.grade && (profile.grade >= 6 && profile.grade <= 9)) {
          setCurrentGrade(profile.grade as StudentGrade);
        }
        setStudent((prev) => ({
          ...prev,
          name: profile.fullName,
          grade: (profile.grade as StudentGrade) || prev.grade,
          avatar: profile.avatarUrl || prev.avatar,
          knowledgePoints: profile.knowledgePoints ?? prev.knowledgePoints,
          coins: profile.coins ?? prev.coins,
          currentStreak: profile.currentStreak ?? prev.currentStreak,
          totalHarvested: profile.totalHarvested ?? prev.totalHarvested,
        }));
      }
    }
  }, [profile]);

  // Sync tab with browser URL history with route protection
  const handleSelectTab = (tab: string) => {
    if (!user && isProtectedRoute(tab)) {
      setAuthNotice("Vui lòng đăng nhập để truy cập trang này.");
      setCurrentTab("/login");
      if (typeof window !== "undefined") {
        window.history.pushState(null, "", "/login");
      }
      return;
    }

    setAuthNotice(null);
    setCurrentTab(tab);
    if (typeof window !== "undefined") {
      const newPath = tab.startsWith("/") ? tab : `/${tab === "home" ? "" : tab}`;
      if (window.location.pathname !== newPath) {
        window.history.pushState(null, "", newPath || "/");
      }
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === "/" || path === "") {
        setCurrentTab("home");
      } else {
        setCurrentTab(path);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Switch role and data
  const handleQuickSwitchRole = (newRole: UserRole, grade?: StudentGrade, studentId?: string) => {
    setRole(newRole);
    if (newRole === "student") {
      const sId = studentId || (grade ? (grade === 6 ? "tuankiet6" : grade === 8 ? "minhanh8" : grade === 9 ? "hoanglong9" : "giahan7") : "giahan7");
      if (studentsData[sId]) {
        setStudent(studentsData[sId]);
        setCurrentGrade(studentsData[sId].grade);
      }
      if (currentTab === "parent" || currentTab === "teacher") {
        handleSelectTab("farm");
      }
    } else if (newRole === "parent") {
      handleSelectTab("parent");
    } else if (newRole === "teacher") {
      handleSelectTab("teacher");
    }
  };

  // Mark notification read
  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  // Harvest Plant Handler
  const handleHarvestPlant = (plantId: string) => {
    setStudent((prev) => {
      const updatedPlants = prev.plants.map((p) => {
        if (p.id === plantId) {
          return {
            ...p,
            stage: "sprout" as const, // resets to a fresh sprout to continue the cycle!
            growthProgress: 20,
            fruitCount: 0,
            health: "healthy" as const,
          };
        }
        return p;
      });

      return {
        ...prev,
        coins: prev.coins + 50,
        knowledgePoints: prev.knowledgePoints + 150,
        totalHarvested: prev.totalHarvested + 1,
        plants: updatedPlants,
      };
    });

    // Add celebration notification
    const newNotif: AppNotification = {
      id: `harvest-${Date.now()}`,
      recipientRole: "student",
      title: "🧺 Bội thu tri thức!",
      message: "Bạn đã thu hoạch thành công trái ngọt từ nông trại. Nhận +50 Xu tri thức & +150 Điểm!",
      timestamp: "Vừa xong",
      isRead: false,
      type: "harvest",
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Water / Revive Plant Handler
  const handleWaterPlant = (plantId: string) => {
    setStudent((prev) => ({
      ...prev,
      plants: prev.plants.map((p) =>
        p.id === plantId ? { ...p, health: "healthy", growthProgress: Math.min(100, p.growthProgress + 15) } : p
      ),
    }));
  };

  // Plant New Seed
  const handlePlantNewSeed = (name: string, subject: string, icon: string) => {
    const newPlant: Plant = {
      id: `plant-${Date.now()}`,
      name,
      subject,
      stage: "sprout",
      growthProgress: 25,
      health: "healthy",
      plantedAt: "Hôm nay",
      exp: 25,
      fruitCount: 0,
      streak: 1,
      plotIndex: 0,
      icon,
    };

    setStudent((prev) => ({
      ...prev,
      plants: [newPlant, ...prev.plants.slice(0, 5)], // Keep 6 plots
    }));
  };

  // Answer Daily Task Question
  const handleAnswerQuestion = (
    taskId: string,
    questionId: string,
    selectedOption: number,
    isCorrect: boolean
  ) => {
    setStudent((prev) => {
      // 1. Update task question
      const updatedTasks = prev.dailyTasks.map((t) => {
        if (t.id === taskId) {
          const updatedQuestions = t.questions.map((q) =>
            q.id === questionId ? { ...q, userSelected: selectedOption } : q
          );
          const correctCount = updatedQuestions.filter(
            (q) => q.userSelected === q.correctAnswer
          ).length;
          const completedCount = updatedQuestions.filter(
            (q) => q.userSelected !== undefined
          ).length;

          return {
            ...t,
            questions: updatedQuestions,
            correctCount,
            completedQuestions: completedCount,
          };
        }
        return t;
      });

      // 2. Adjust points and plant health/growth
      const targetTask = prev.dailyTasks.find((t) => t.id === taskId);
      const subject = targetTask?.subject || "Toán";

      const updatedPlants = prev.plants.map((p) => {
        if (p.subject === subject) {
          if (isCorrect) {
            const newProgress = Math.min(100, p.growthProgress + 20);
            const isNowFruit = newProgress >= 100;
            return {
              ...p,
              health: "healthy" as const,
              growthProgress: newProgress,
              stage: isNowFruit ? ("fruit" as const) : newProgress > 60 ? ("mature" as const) : ("sapling" as const),
              fruitCount: isNowFruit ? (p.fruitCount || 0) + 1 : 0,
              exp: p.exp + 10,
            };
          } else {
            return {
              ...p,
              health: "wilting" as const,
            };
          }
        }
        return p;
      });

      return {
        ...prev,
        knowledgePoints: isCorrect ? prev.knowledgePoints + 10 : prev.knowledgePoints,
        dailyTasks: updatedTasks,
        plants: updatedPlants,
      };
    });
  };

  // Complete a Task
  const handleCompleteTask = (taskId: string) => {
    setStudent((prev) => {
      const task = prev.dailyTasks.find((t) => t.id === taskId);
      const rewardCoins = task?.rewardCoins || 30;
      const rewardExp = task?.rewardExp || 100;

      const updatedTasks = prev.dailyTasks.map((t) =>
        t.id === taskId ? { ...t, isCompleted: true } : t
      );

      return {
        ...prev,
        coins: prev.coins + rewardCoins,
        knowledgePoints: prev.knowledgePoints + rewardExp,
        dailyTasks: updatedTasks,
      };
    });
  };

  // AI Quiz Answer Correct
  const handleAiQuizCorrect = () => {
    setStudent((prev) => {
      const updatedPlants = prev.plants.map((p, idx) => {
        if (idx === 0) {
          const newProgress = Math.min(100, p.growthProgress + 15);
          return {
            ...p,
            health: "healthy" as const,
            growthProgress: newProgress,
            stage: newProgress >= 100 ? ("fruit" as const) : newProgress > 60 ? ("mature" as const) : p.stage,
          };
        }
        return p;
      });

      return {
        ...prev,
        knowledgePoints: prev.knowledgePoints + 10,
        plants: updatedPlants,
      };
    });
  };

  // AI Quiz Answer Incorrect
  const handleAiQuizIncorrect = () => {
    setStudent((prev) => {
      const updatedPlants = prev.plants.map((p, idx) => {
        if (idx === 0) {
          return { ...p, health: "wilting" as const };
        }
        return p;
      });
      return { ...prev, plants: updatedPlants };
    });
  };

  // Teacher feedback to parent
  const handleSendFeedbackToParent = (studentName: string, message: string) => {
    const newFeedbackNotif: AppNotification = {
      id: `teacher-feedback-${Date.now()}`,
      recipientRole: "parent",
      title: `Nhận xét mới từ Cô Mai Lan`,
      message: `Giáo viên chủ nhiệm gửi nhận xét về em ${studentName}: "${message}"`,
      timestamp: "Vừa xong",
      isRead: false,
      type: "feedback",
    };
    setNotifications((prev) => [newFeedbackNotif, ...prev]);

    // Add to study history
    setStudent((prev) => ({
      ...prev,
      studyHistory: [
        {
          id: `hist-${Date.now()}`,
          date: "Hôm nay",
          subject: teacher.subject,
          taskTitle: "Đánh giá định kỳ của giáo viên",
          correctCount: 9,
          totalCount: 10,
          timeSpentMinutes: 20,
          teacherFeedback: message,
        },
        ...prev.studyHistory,
      ],
    }));
  };

  // Teacher assigns new task
  const handleAssignNewTask = (title: string, subject: string, rewardItem: string) => {
    const newTask = {
      id: `task-assigned-${Date.now()}`,
      title,
      subject,
      grade: currentGrade,
      icon: "📘",
      description: `Nhiệm vụ đặc biệt do Cô Mai Lan giao. Phần thưởng: ${rewardItem}`,
      totalQuestions: 5,
      completedQuestions: 0,
      correctCount: 0,
      rewardExp: 150,
      rewardCoins: 40,
      rewardItem,
      questions: [
        {
          id: "q-new-1",
          question: "Tìm giá trị của x trong phương trình: 2x - 6 = 10",
          options: ["x = 8", "x = 5", "x = 4", "x = 2"],
          correctAnswer: 0,
          hint: "Chuyển vế: 2x = 10 + 6, sau đó chia cả hai vế cho 2.",
          explanation: "2x = 16 => x = 8.",
        },
      ],
    };

    setStudent((prev) => ({
      ...prev,
      dailyTasks: [newTask, ...prev.dailyTasks],
    }));

    const newNotif: AppNotification = {
      id: `notif-new-task-${Date.now()}`,
      recipientRole: "student",
      title: "Nhiệm vụ mới từ Giáo viên!",
      message: `Cô Mai Lan vừa giao bài: "${title}". Hãy hoàn thành để rinh ${rewardItem}!`,
      timestamp: "Vừa xong",
      isRead: false,
      type: "task",
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col selection:bg-emerald-200">
      {/* Navbar */}
      <Navbar
        currentRole={role}
        currentGrade={currentGrade}
        studentName={student.name}
        level={student.level}
        levelTitle={student.levelTitle}
        knowledgePoints={student.knowledgePoints}
        coins={student.coins}
        streak={student.currentStreak}
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onQuickSwitchRole={handleQuickSwitchRole}
        onOpenSupabaseConfig={() => setIsConfigModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Requirement 3: “Chào mừng [Tên người dùng] đến với Nông Trại Tri Thức! 🌱” */}
        {welcomeMessage && (
          <div className="mb-5 p-4 sm:p-5 rounded-3xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 shadow-md flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Sprout className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <p className="font-display font-black text-sm sm:text-base text-emerald-950">
                  {welcomeMessage}
                </p>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Tài khoản của bạn đã được xác thực an toàn. Khu vườn tri thức THCS đã sẵn sàng cho bạn gieo mầm và thu hoạch!
                </p>
              </div>
            </div>
            <button
              onClick={clearWelcomeMessage}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors shrink-0 cursor-pointer"
            >
              Đóng
            </button>
          </div>
        )}

        {/* Greeting Banner for Logged-In User: “Xin chào, [Họ và tên] 🌱” */}
        {user && (currentTab === "/dashboard" || currentTab === "farm" || currentTab === "/farm" || currentTab === "home") && (
          <div className="mb-6 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-lg shadow-emerald-900/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                {profile?.avatarUrl && (profile.avatarUrl.startsWith("http") || profile.avatarUrl.startsWith("https")) ? (
                  <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span>{profile?.avatarUrl || "🌱"}</span>
                )}
              </div>
              <div>
                <h2 className="font-display font-black text-lg sm:text-xl text-white tracking-tight">
                  {greeting || `Xin chào, ${profile?.fullName || user.email?.split("@")[0]} 🌱`}
                </h2>
                <p className="text-xs text-emerald-100 font-medium">
                  {profile?.role === "parent"
                    ? "Chào mừng phụ huynh! Theo dõi sát sao quá trình vun trồng tri thức của con yêu."
                    : `Hôm nay là một ngày tuyệt vời để gieo thêm mầm tri thức mới cho Nông trại THCS Lớp ${currentGrade}!`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => handleSelectTab("/profile")}
                className="px-4 py-2 bg-white/15 hover:bg-white/25 rounded-xl text-xs font-bold text-white transition-all cursor-pointer border border-white/20"
              >
                Hồ sơ cá nhân
              </button>
              <button
                onClick={() => handleSelectTab("tasks")}
                className="px-4 py-2 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <span>Làm nhiệm vụ ngay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Supabase Authentication Pages */}
        {currentTab === "/register" && (
          <RegisterPage
            onNavigate={handleSelectTab}
            onOpenConfig={() => setIsConfigModalOpen(true)}
          />
        )}

        {currentTab === "/login" && (
          <LoginPage
            onNavigate={handleSelectTab}
            onLoginSuccess={() => handleSelectTab("/dashboard")}
            onOpenConfig={() => setIsConfigModalOpen(true)}
            noticeMessage={authNotice}
          />
        )}

        {currentTab === "/forgot-password" && (
          <ForgotPasswordPage onNavigate={handleSelectTab} />
        )}

        {currentTab === "/reset-password" && (
          <ResetPasswordPage onNavigate={handleSelectTab} />
        )}

        {(currentTab === "/profile" || currentTab === "profile") && (
          <ProfilePage onNavigate={handleSelectTab} />
        )}

        {/* Dashboard & Farm Views (/dashboard, /farm, farm) */}
        {(currentTab === "/dashboard" || currentTab === "farm" || currentTab === "/farm") && (
          <MyFarmView
            student={student}
            onHarvestPlant={handleHarvestPlant}
            onWaterPlant={handleWaterPlant}
            onPlantNewSeed={handlePlantNewSeed}
            onNavigateToTasks={() => handleSelectTab("tasks")}
          />
        )}

        {currentTab === "home" && (
          <HomeHero
            student={student}
            onNavigate={handleSelectTab}
            onOpenAuth={() => handleSelectTab("/login")}
          />
        )}

        {/* Learning / Tasks Views (/learning, /tasks, tasks) */}
        {(currentTab === "tasks" || currentTab === "/tasks" || currentTab === "/learning") && (
          <TaskZoneView
            student={student}
            onAnswerQuestion={handleAnswerQuestion}
            onCompleteTask={handleCompleteTask}
            onNavigateToFarm={() => handleSelectTab("farm")}
          />
        )}

        {/* AI Tutor / Ask Views (/ai-tutor, /ai-ask, ai-ask) */}
        {(currentTab === "ai-ask" || currentTab === "/ai-ask" || currentTab === "/ai-tutor") && (
          <AiAskView
            currentGrade={currentGrade}
            studentName={student.name}
          />
        )}

        {currentTab === "ai-quiz" && (
          <AiQuizChallengeView
            currentGrade={currentGrade}
            studentName={student.name}
            onAnswerCorrect={handleAiQuizCorrect}
            onAnswerIncorrect={handleAiQuizIncorrect}
          />
        )}

        {/* Ability / Competency Views (/ability, /competency, competency) */}
        {(currentTab === "competency" || currentTab === "/competency" || currentTab === "/ability") && (
          <CompetencyAnalysisView student={student} />
        )}

        {currentTab === "leaderboard" && (
          <LeaderboardView
            entries={leaderboard}
            currentStudent={student}
          />
        )}

        {/* Parent Dashboard (/parent-dashboard, /parent, parent) */}
        {(currentTab === "parent" || currentTab === "/parent" || currentTab === "/parent-dashboard") && (
          <ParentDashboardView parent={parent} student={student} />
        )}

        {currentTab === "teacher" && (
          <TeacherDashboardView
            teacher={teacher}
            onSendFeedbackToParent={handleSendFeedbackToParent}
            onAssignNewTaskToClass={handleAssignNewTask}
          />
        )}
      </main>

      {/* Footer with warm, pastoral ethos */}
      <footer className="border-t border-emerald-100 bg-white/80 py-6 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-emerald-700 font-extrabold font-display">🌱 NÔNG TRẠI TRI THỨC</span>
            <span>• Nền tảng học tập tương tác Gamification THCS Lớp 6 - 9</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsConfigModalOpen(true)}
              className="text-[11px] text-stone-400 hover:text-emerald-700 underline cursor-pointer"
            >
              Cấu hình Supabase Thật
            </button>
            <span>•</span>
            <span>“Mỗi câu trả lời đúng – Một mầm cây lớn. Mỗi bài học hoàn thành – Một mùa thu hoạch.”</span>
          </div>
        </div>
      </footer>

      {/* Auth / Role Switcher Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSelectRole={handleQuickSwitchRole}
      />

      {/* Supabase Connection Setup Modal */}
      <SupabaseConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

