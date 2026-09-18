export type UserRole = "student" | "parent" | "teacher";
export type StudentGrade = 6 | 7 | 8 | 9;

export type PlantStage = "seed" | "sprout" | "sapling" | "mature" | "fruit" | "harvested";
export type PlantHealth = "healthy" | "wilting" | "withered";

export interface Plant {
  id: string;
  name: string;
  subject: string;
  icon: string;
  stage: PlantStage;
  health: PlantHealth;
  growthProgress: number; // 0 to 100
  streak: number;
  exp: number;
  plotIndex: number;
  fruitCount?: number;
  plantedAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  hint: string;
  explanation: string;
  userSelected?: number;
  isCorrect?: boolean;
}

export interface DailyTask {
  id: string;
  subject: string;
  icon: string;
  grade: StudentGrade;
  title: string;
  description: string;
  totalQuestions: number;
  completedQuestions: number;
  correctCount: number;
  isCompleted: boolean;
  rewardCoins: number;
  rewardExp: number;
  rewardItem?: string;
  questions: QuizQuestion[];
}

export interface WorkHistoryItem {
  id: string;
  subject: string;
  topic: string;
  date: string;
  score: string; // e.g., "8/10"
  percentage: number;
  status: "Đã hoàn thành" | "Đang làm" | "Cần cố gắng";
  teacherFeedback?: string;
  durationMinutes: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockedAt?: string;
  isUnlocked: boolean;
}

export interface CompetencyData {
  knowledgeScore: number;
  logicScore: number;
  problemSolvingScore: number;
  speedScore: number;
  accuracyScore: number;
  progressRate: number;
  subjectBreakdown: { subject: string; score: number }[];
}

export interface StudyHistoryDetail {
  id: string;
  date: string;
  subject: string;
  taskTitle: string;
  correctCount: number;
  totalCount: number;
  timeSpentMinutes: number;
  teacherFeedback: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  username: string;
  grade: StudentGrade;
  avatar: string;
  level: number;
  levelTitle: string;
  knowledgePoints: number;
  coins: number;
  currentStreak: number;
  totalPlanted: number;
  totalHarvested: number;
  plants: Plant[];
  dailyTasks: DailyTask[];
  history: WorkHistoryItem[];
  badges: Badge[];
  competency: CompetencyData;
  studyHistory: StudyHistoryDetail[];
}

export interface TeacherFeedback {
  id: string;
  studentId: string;
  studentName: string;
  taskTitle: string;
  date: string;
  score: string;
  comment: string;
  sentToParent: boolean;
}

export interface AppNotification {
  id: string;
  userId?: string;
  recipientRole: UserRole;
  studentId?: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: "task" | "feedback" | "harvest" | "streak" | "achievement";
}

export interface LeaderboardEntry {
  id: string;
  studentName: string;
  grade: number;
  points: number;
  completedTasks: number;
  plantedTrees: number;
  harvestedCrops: number;
  streakDays: number;
  levelTitle: string;
  avatar: string;
}

export interface ParentProfile {
  id: string;
  name: string;
  studentId: string;
  weeklyReport: {
    studentName: string;
    grade: number;
    plantedCrops: number;
    matureCrops: number;
    harvestedCrops: number;
    completedLessons: number;
    accuracy: number;
    studyTime: string;
    aiSummary: string;
  };
}

export interface TeacherStudentSummary {
  id: string;
  name: string;
  grade: number;
  mathScore: number;
  litScore: number;
  sciScore: number;
  progressTrend: string;
  recentMistakes: {
    question: string;
    studentChoice: string;
    correctChoice: string;
    subject: string;
  }[];
}

export interface TeacherProfile {
  id: string;
  name: string;
  subject: string;
  classes: string[];
  students: TeacherStudentSummary[];
}

export interface UserProfile {
  id: string;
  googleId?: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: "student" | "parent";
  grade?: number;
  knowledgePoints: number;
  coins: number;
  currentStreak: number;
  totalPlanted: number;
  totalHarvested: number;
  linkCode: string;
  plants?: Plant[];
  createdAt: string;
  updatedAt: string;
}

export interface AccountLink {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  requesterRole: "student" | "parent";
  targetId: string;
  targetName: string;
  targetEmail: string;
  targetRole: "student" | "parent";
  status: "pending" | "active";
  createdAt: string;
  confirmedAt?: string;
}
