import React, { useState } from "react";
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

export default function App() {
  const [role, setRole] = useState<UserRole>("student");
  const [currentGrade, setCurrentGrade] = useState<StudentGrade>(7);
  const [currentTab, setCurrentTab] = useState<string>("home");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Active Student State
  const [student, setStudent] = useState<StudentProfile>(studentsData["giahan7"]);
  // Active Parent & Teacher State
  const [parent, setParent] = useState(mockParent);
  const [teacher, setTeacher] = useState(mockTeacher);
  // Notifications & Leaderboard
  const [notifications, setNotifications] = useState<AppNotification[]>(mockNotifications);
  const [leaderboard, setLeaderboard] = useState(mockLeaderboard);

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
        setCurrentTab("farm");
      }
    } else if (newRole === "parent") {
      setCurrentTab("parent");
    } else if (newRole === "teacher") {
      setCurrentTab("teacher");
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
        onSelectTab={setCurrentTab}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onQuickSwitchRole={handleQuickSwitchRole}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === "home" && (
          <HomeHero
            student={student}
            onNavigate={setCurrentTab}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {currentTab === "farm" && (
          <MyFarmView
            student={student}
            onHarvestPlant={handleHarvestPlant}
            onWaterPlant={handleWaterPlant}
            onPlantNewSeed={handlePlantNewSeed}
            onNavigateToTasks={() => setCurrentTab("tasks")}
          />
        )}

        {currentTab === "tasks" && (
          <TaskZoneView
            student={student}
            onAnswerQuestion={handleAnswerQuestion}
            onCompleteTask={handleCompleteTask}
            onNavigateToFarm={() => setCurrentTab("farm")}
          />
        )}

        {currentTab === "ai-ask" && (
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

        {currentTab === "competency" && (
          <CompetencyAnalysisView student={student} />
        )}

        {currentTab === "leaderboard" && (
          <LeaderboardView
            entries={leaderboard}
            currentStudent={student}
          />
        )}

        {currentTab === "parent" && (
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
          <div>
            “Mỗi câu trả lời đúng – Một mầm cây lớn. Mỗi bài học hoàn thành – Một mùa thu hoạch.”
          </div>
        </div>
      </footer>

      {/* Auth / Role Switcher Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSelectRole={handleQuickSwitchRole}
      />
    </div>
  );
}
