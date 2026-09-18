import fs from "fs";
import path from "path";
import crypto from "crypto";

export interface DBUser {
  id: string;
  googleId?: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  role: "student" | "parent";
  grade: number;
  knowledgePoints: number;
  coins: number;
  currentStreak: number;
  totalPlanted: number;
  totalHarvested: number;
  linkCode: string;
  plants: any[];
  badges: any[];
  passwordHash?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DBLink {
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

export interface DBSession {
  token: string;
  userId: string;
  createdAt: number;
  expiresAt: number;
}

export interface DatabaseSchema {
  users: DBUser[];
  links: DBLink[];
  sessions: DBSession[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "database.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadDB(): DatabaseSchema {
  ensureDataDir();
  if (!fs.existsSync(DB_FILE)) {
    const initial: DatabaseSchema = {
      users: [],
      links: [],
      sessions: [],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  }
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading database file, initializing empty:", err);
    return { users: [], links: [], sessions: [] };
  }
}

function saveDB(db: DatabaseSchema) {
  ensureDataDir();
  const tempFile = `${DB_FILE}.${Date.now()}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), "utf-8");
  fs.renameSync(tempFile, DB_FILE);
}

// Helper to generate readable link codes, e.g. "HS-5821" or "PH-3914"
export function generateLinkCode(role: "student" | "parent"): string {
  const prefix = role === "parent" ? "PH" : "HS";
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${randomNum}`;
}

export function findUserByGoogleId(googleId: string): DBUser | undefined {
  const db = loadDB();
  return db.users.find((u) => u.googleId === googleId);
}

export function findUserByEmail(email: string): DBUser | undefined {
  const db = loadDB();
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string): DBUser | undefined {
  const db = loadDB();
  return db.users.find((u) => u.id === id);
}

export function findUserByLinkCode(code: string): DBUser | undefined {
  const db = loadDB();
  return db.users.find((u) => u.linkCode?.toUpperCase() === code.trim().toUpperCase());
}

export function upsertGoogleUser(params: {
  googleId: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  role?: "student" | "parent";
  grade?: number;
}): DBUser {
  const db = loadDB();
  const now = new Date().toISOString();

  // 1. First lookup by googleId to strictly ensure NO duplicate account for the same Google login
  let user = db.users.find((u) => u.googleId === params.googleId);

  // 2. If not found by googleId, check by email
  if (!user) {
    user = db.users.find((u) => u.email.toLowerCase() === params.email.toLowerCase());
    if (user) {
      // Connect existing email account with this real Google ID
      user.googleId = params.googleId;
    }
  }

  if (user) {
    // Existing user: preserve knowledgePoints, plants, currentStreak, totalHarvested, linkCode, etc.
    if (params.fullName && !user.fullName) user.fullName = params.fullName;
    if (params.avatarUrl && (!user.avatarUrl || user.avatarUrl === "👧" || user.avatarUrl === "🌱")) {
      user.avatarUrl = params.avatarUrl;
    }
    user.updatedAt = now;
    saveDB(db);
    return user;
  }

  // New User: clean fresh profile (0 points, 0 streak, no fake numbers)
  const role = params.role || "student";
  const newUser: DBUser = {
    id: `usr_${crypto.randomUUID()}`,
    googleId: params.googleId,
    email: params.email.toLowerCase(),
    fullName: params.fullName || params.email.split("@")[0],
    avatarUrl: params.avatarUrl || (role === "parent" ? "👨👩👧" : "🌱"),
    role: role,
    grade: params.grade || 7,
    knowledgePoints: 0,
    coins: 0,
    currentStreak: 0,
    totalPlanted: 0,
    totalHarvested: 0,
    linkCode: generateLinkCode(role),
    plants: [],
    badges: [],
    createdAt: now,
    updatedAt: now,
  };

  db.users.push(newUser);
  saveDB(db);
  return newUser;
}

export function registerEmailUser(params: {
  email: string;
  passwordHash: string;
  fullName: string;
  role: "student" | "parent";
  grade?: number;
}): { success: boolean; user?: DBUser; error?: string } {
  const db = loadDB();
  const existing = db.users.find((u) => u.email.toLowerCase() === params.email.toLowerCase());
  if (existing) {
    return { success: false, error: "Email này đã được đăng ký tài khoản. Vui lòng đăng nhập." };
  }

  const now = new Date().toISOString();
  const newUser: DBUser = {
    id: `usr_${crypto.randomUUID()}`,
    email: params.email.toLowerCase(),
    fullName: params.fullName,
    avatarUrl: params.role === "parent" ? "👨👩👧" : "🌱",
    role: params.role,
    grade: params.grade || 7,
    knowledgePoints: 0,
    coins: 0,
    currentStreak: 0,
    totalPlanted: 0,
    totalHarvested: 0,
    linkCode: generateLinkCode(params.role),
    plants: [],
    badges: [],
    passwordHash: params.passwordHash,
    createdAt: now,
    updatedAt: now,
  };

  db.users.push(newUser);
  saveDB(db);
  return { success: true, user: newUser };
}

export function updateUserProfile(
  userId: string,
  updates: Partial<Pick<DBUser, "fullName" | "avatarUrl" | "grade">>
): DBUser | null {
  const db = loadDB();
  const user = db.users.find((u) => u.id === userId);
  if (!user) return null;

  if (updates.fullName !== undefined) user.fullName = updates.fullName;
  if (updates.avatarUrl !== undefined) user.avatarUrl = updates.avatarUrl;
  if (updates.grade !== undefined && user.role === "student") user.grade = updates.grade;
  user.updatedAt = new Date().toISOString();

  saveDB(db);
  return user;
}

export function syncUserProgress(
  userId: string,
  progress: {
    knowledgePoints?: number;
    coins?: number;
    currentStreak?: number;
    totalPlanted?: number;
    totalHarvested?: number;
    plants?: any[];
    badges?: any[];
  }
): DBUser | null {
  const db = loadDB();
  const user = db.users.find((u) => u.id === userId);
  if (!user) return null;

  if (progress.knowledgePoints !== undefined) user.knowledgePoints = progress.knowledgePoints;
  if (progress.coins !== undefined) user.coins = progress.coins;
  if (progress.currentStreak !== undefined) user.currentStreak = progress.currentStreak;
  if (progress.totalPlanted !== undefined) user.totalPlanted = progress.totalPlanted;
  if (progress.totalHarvested !== undefined) user.totalHarvested = progress.totalHarvested;
  if (progress.plants !== undefined) user.plants = progress.plants;
  if (progress.badges !== undefined) user.badges = progress.badges;
  user.updatedAt = new Date().toISOString();

  saveDB(db);
  return user;
}

// Session Token Management
export function createSession(userId: string): string {
  const db = loadDB();
  const token = `sess_${crypto.randomBytes(32).toString("hex")}`;
  const now = Date.now();
  const expiresAt = now + 30 * 24 * 60 * 60 * 1000; // 30 days session

  // Purge expired sessions
  db.sessions = db.sessions.filter((s) => s.expiresAt > now);
  db.sessions.push({
    token,
    userId,
    createdAt: now,
    expiresAt,
  });

  saveDB(db);
  return token;
}

export function getUserBySession(token: string): DBUser | null {
  if (!token) return null;
  const db = loadDB();
  const now = Date.now();
  const session = db.sessions.find((s) => s.token === token && s.expiresAt > now);
  if (!session) return null;
  return db.users.find((u) => u.id === session.userId) || null;
}

export function removeSession(token: string) {
  const db = loadDB();
  db.sessions = db.sessions.filter((s) => s.token !== token);
  saveDB(db);
}

// Account Linking Logic (Phụ huynh - Học sinh explicit bilateral link)
export function createLinkRequest(requester: DBUser, targetCodeOrEmail: string): { success: boolean; link?: DBLink; error?: string } {
  const db = loadDB();
  const trimmed = targetCodeOrEmail.trim();

  // Find target by code or email
  const target = db.users.find(
    (u) =>
      u.linkCode?.toUpperCase() === trimmed.toUpperCase() ||
      u.email.toLowerCase() === trimmed.toLowerCase()
  );

  if (!target) {
    return { success: false, error: "Không tìm thấy tài khoản với mã hoặc email đã nhập." };
  }

  if (target.id === requester.id) {
    return { success: false, error: "Bạn không thể tự liên kết với chính tài khoản của mình." };
  }

  // Check if link already exists or pending
  const existingLink = db.links.find(
    (l) =>
      (l.requesterId === requester.id && l.targetId === target.id) ||
      (l.requesterId === target.id && l.targetId === requester.id)
  );

  if (existingLink) {
    if (existingLink.status === "active") {
      return { success: false, error: "Hai tài khoản này đã được liên kết với nhau trước đó." };
    }
    return { success: false, error: "Đã có yêu cầu liên kết đang chờ xác nhận giữa hai tài khoản." };
  }

  const newLink: DBLink = {
    id: `lnk_${crypto.randomUUID()}`,
    requesterId: requester.id,
    requesterName: requester.fullName,
    requesterEmail: requester.email,
    requesterRole: requester.role,
    targetId: target.id,
    targetName: target.fullName,
    targetEmail: target.email,
    targetRole: target.role,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  db.links.push(newLink);
  saveDB(db);
  return { success: true, link: newLink };
}

export function getLinkingOverview(userId: string) {
  const db = loadDB();
  const activeLinks = db.links.filter(
    (l) => l.status === "active" && (l.requesterId === userId || l.targetId === userId)
  );
  const incoming = db.links.filter((l) => l.status === "pending" && l.targetId === userId);
  const outgoing = db.links.filter((l) => l.status === "pending" && l.requesterId === userId);

  const linkedAccounts = activeLinks.map((l) => {
    const isRequester = l.requesterId === userId;
    return {
      linkId: l.id,
      accountId: isRequester ? l.targetId : l.requesterId,
      name: isRequester ? l.targetName : l.requesterName,
      email: isRequester ? l.targetEmail : l.requesterEmail,
      role: isRequester ? l.targetRole : l.requesterRole,
      status: l.status,
      linkedAt: l.confirmedAt || l.createdAt,
    };
  });

  return {
    linkedAccounts,
    incomingRequests: incoming,
    outgoingRequests: outgoing,
  };
}

export function respondToLinkRequest(userId: string, linkId: string, action: "accept" | "reject"): { success: boolean; error?: string } {
  const db = loadDB();
  const linkIndex = db.links.findIndex((l) => l.id === linkId && l.targetId === userId && l.status === "pending");
  if (linkIndex === -1) {
    return { success: false, error: "Không tìm thấy yêu cầu liên kết hoặc bạn không có quyền xử lý." };
  }

  if (action === "accept") {
    db.links[linkIndex].status = "active";
    db.links[linkIndex].confirmedAt = new Date().toISOString();
  } else {
    // Remove rejected request
    db.links.splice(linkIndex, 1);
  }

  saveDB(db);
  return { success: true };
}

export function unlinkAccount(userId: string, linkId: string): { success: boolean; error?: string } {
  const db = loadDB();
  const index = db.links.findIndex(
    (l) => l.id === linkId && (l.requesterId === userId || l.targetId === userId)
  );

  if (index === -1) {
    return { success: false, error: "Không tìm thấy liên kết cần hủy." };
  }

  // Remove link only - does NOT delete any user accounts or learning progress
  db.links.splice(index, 1);
  saveDB(db);
  return { success: true };
}

export function getLinkedStudentDataForParent(parentId: string, studentId: string): DBUser | null {
  const db = loadDB();
  // Strictly enforce: parent can ONLY see data of students with active confirmed links
  const isLinked = db.links.some(
    (l) =>
      l.status === "active" &&
      ((l.requesterId === parentId && l.targetId === studentId) ||
        (l.targetId === parentId && l.requesterId === studentId))
  );

  if (!isLinked) return null;
  return db.users.find((u) => u.id === studentId) || null;
}
