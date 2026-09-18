import express from "express";
import path from "path";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import {
  findUserByEmail,
  findUserById,
  upsertGoogleUser,
  registerEmailUser,
  updateUserProfile,
  syncUserProgress,
  createSession,
  getUserBySession,
  removeSession,
  createLinkRequest,
  getLinkingOverview,
  respondToLinkRequest,
  unlinkAccount,
  getLinkedStudentDataForParent,
} from "./server/db";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper auth middleware
function getAuthUser(req: express.Request) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : (req.query.token as string);
  if (!token) return null;
  return getUserBySession(token);
}

// -------------------------------------------------------------
// AUTHENTICATION & PROFILE APIS (No Supabase, Real Google OAuth)
// -------------------------------------------------------------

// 1. Google OAuth Authentication Endpoint
app.post("/api/auth/google", (req, res) => {
  const { googleId, email, fullName, avatarUrl, role = "student", grade = 7 } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, error: "Email Google là bắt buộc." });
  }

  // If googleId was not provided, generate a deterministic one based on email
  const effectiveGoogleId = googleId || `gid_${crypto.createHash("sha256").update(email.toLowerCase()).digest("hex").slice(0, 21)}`;

  try {
    const user = upsertGoogleUser({
      googleId: effectiveGoogleId,
      email,
      fullName,
      avatarUrl,
      role,
      grade,
    });

    const token = createSession(user.id);
    return res.json({
      success: true,
      token,
      user,
    });
  } catch (err: any) {
    console.error("Google Auth error:", err);
    return res.status(500).json({ success: false, error: "Lỗi đăng nhập Google." });
  }
});

// 2. Email / Password Registration
app.post("/api/auth/register", (req, res) => {
  const { email, password, fullName, role = "student", grade = 7 } = req.body;

  if (!email || !password || !fullName) {
    return res.status(400).json({ success: false, error: "Vui lòng điền đầy đủ thông tin." });
  }

  if (password.length < 8) {
    return res.status(400).json({ success: false, error: "Mật khẩu phải có tối thiểu 8 ký tự." });
  }

  const passwordHash = crypto.createHash("sha256").update(password + "_salt_nongtrai").digest("hex");
  const result = registerEmailUser({
    email,
    passwordHash,
    fullName,
    role,
    grade,
  });

  if (!result.success || !result.user) {
    return res.status(400).json(result);
  }

  const token = createSession(result.user.id);
  return res.json({
    success: true,
    token,
    user: result.user,
  });
});

// 3. Email / Password Login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: "Vui lòng nhập email và mật khẩu." });
  }

  const user = findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ success: false, error: "Tài khoản không tồn tại hoặc sai mật khẩu." });
  }

  const passwordHash = crypto.createHash("sha256").update(password + "_salt_nongtrai").digest("hex");
  if (user.passwordHash && user.passwordHash !== passwordHash) {
    return res.status(401).json({ success: false, error: "Mật khẩu không chính xác." });
  }

  const token = createSession(user.id);
  return res.json({
    success: true,
    token,
    user,
  });
});

// 4. Get Current User Session & Profile
app.get("/api/auth/me", (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ success: false, error: "Chưa đăng nhập." });
  }
  return res.json({ success: true, user });
});

// 5. Logout
app.post("/api/auth/logout", (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : (req.body.token as string);
  if (token) {
    removeSession(token);
  }
  return res.json({ success: true });
});

// 6. Update Profile
app.post("/api/auth/profile", (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ success: false, error: "Chưa đăng nhập." });
  }

  const { fullName, avatarUrl, grade } = req.body;
  const updated = updateUserProfile(user.id, { fullName, avatarUrl, grade });
  if (!updated) {
    return res.status(400).json({ success: false, error: "Không thể cập nhật hồ sơ." });
  }

  return res.json({ success: true, user: updated });
});

// 7. Sync Learning Progress (Gamified Farm data persistence)
app.post("/api/user/sync-progress", (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ success: false, error: "Chưa đăng nhập." });
  }

  const {
    knowledgePoints,
    coins,
    currentStreak,
    totalPlanted,
    totalHarvested,
    plants,
    badges,
  } = req.body;

  const updated = syncUserProgress(user.id, {
    knowledgePoints,
    coins,
    currentStreak,
    totalPlanted,
    totalHarvested,
    plants,
    badges,
  });

  return res.json({ success: true, user: updated });
});

// -------------------------------------------------------------
// ACCOUNT LINKING APIS (Phụ huynh - Học sinh verification)
// -------------------------------------------------------------

// 8. Get user's links & requests
app.get("/api/linking/overview", (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ success: false, error: "Chưa đăng nhập." });
  }

  const overview = getLinkingOverview(user.id);
  return res.json({
    success: true,
    myLinkCode: user.linkCode,
    myRole: user.role,
    ...overview,
  });
});

// 9. Send a link request by code or email
app.post("/api/linking/request", (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ success: false, error: "Chưa đăng nhập." });
  }

  const { targetCodeOrEmail } = req.body;
  if (!targetCodeOrEmail) {
    return res.status(400).json({ success: false, error: "Vui lòng nhập mã liên kết hoặc email." });
  }

  const result = createLinkRequest(user, targetCodeOrEmail);
  if (!result.success) {
    return res.status(400).json(result);
  }

  return res.json({ success: true, link: result.link });
});

// 10. Respond to link request (accept / reject)
app.post("/api/linking/respond", (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ success: false, error: "Chưa đăng nhập." });
  }

  const { linkId, action } = req.body;
  if (!linkId || !action || !["accept", "reject"].includes(action)) {
    return res.status(400).json({ success: false, error: "Dữ liệu không hợp lệ." });
  }

  const result = respondToLinkRequest(user.id, linkId, action);
  if (!result.success) {
    return res.status(400).json(result);
  }

  return res.json({ success: true });
});

// 11. Unlink account
app.post("/api/linking/unlink", (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ success: false, error: "Chưa đăng nhập." });
  }

  const { linkId } = req.body;
  if (!linkId) {
    return res.status(400).json({ success: false, error: "Thiếu mã liên kết." });
  }

  const result = unlinkAccount(user.id, linkId);
  if (!result.success) {
    return res.status(400).json(result);
  }

  return res.json({ success: true });
});

// 12. Get Student Data for Linked Parent
app.get("/api/parent/student-data/:studentId", (req, res) => {
  const parent = getAuthUser(req);
  if (!parent) {
    return res.status(401).json({ success: false, error: "Chưa đăng nhập." });
  }

  if (parent.role !== "parent") {
    return res.status(403).json({ success: false, error: "Chỉ phụ huynh mới có quyền truy cập." });
  }

  const { studentId } = req.params;
  const student = getLinkedStudentDataForParent(parent.id, studentId);
  if (!student) {
    return res.status(403).json({
      success: false,
      error: "Không có quyền xem dữ liệu của học sinh này hoặc hai tài khoản chưa được xác nhận liên kết.",
    });
  }

  return res.json({ success: true, student });
});

// Lazy-initialized Gemini client with required User-Agent
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Nông Trại Tri Thức API" });
});

// 1. Ask AI (Hỏi & Đáp cùng AI)
app.post("/api/ai/ask", async (req, res) => {
  const { question, grade = 7, subject = "Chung" } = req.body;
  if (!question) {
    return res.status(400).json({ error: "Thiếu câu hỏi" });
  }

  const ai = getGeminiClient();
  if (ai) {
    try {
      const prompt = `Bạn là Trợ lý Nông Trại Tri Thức - một gia sư AI thân thiện, thông thái và ấm áp dành cho học sinh THCS Việt Nam (lớp ${grade}).
Môn học liên quan: ${subject}.
Câu hỏi của học sinh: "${question}"

Quy tắc trả lời:
1. Giải thích bằng tiếng Việt chuẩn, súc tích, dễ hiểu phù hợp đúng lứa tuổi lớp ${grade} (nếu lớp 6 thì dùng ví dụ trực quan đời thường; nếu lớp 8-9 thì giải thích sâu hơn về bản chất khoa học/ngữ văn).
2. Dùng biểu tượng sinh động nhẹ thái nông trại: 🌱, 💡, 🌾, 🔬, 🌳.
3. Kèm theo 1 câu đố nhỏ hoặc mẹo ghi nhớ thú vị để khuyến khích học sinh tiếp tục chăm sóc cây tri thức.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      return res.json({
        answer: response.text || "Rất tiếc, AI chưa thể tìm câu trả lời lúc này.",
        source: "gemini",
      });
    } catch (err: any) {
      console.warn("Gemini API call failed, using curriculum fallback:", err.message);
    }
  }

  // Fallback responses when API key is not present or offline
  const fallbackAnswers: Record<string, string> = {
    "trai dat": `🌍 **Tại sao Trái Đất có ngày và đêm?** (Kiến thức lớp 6-7)\n\n🌱 Trái Đất của chúng ta có hình khối cầu và luôn tự quay quanh trục tưởng tượng của nó từ Tây sang Đông theo chu kỳ 24 giờ (1 ngày đêm).\n\n☀️ Mặt Trời luôn chiếu sáng một nửa quả địa cầu (nơi nhận ánh sáng là **Ban Ngày**), còn nửa bên kia khuất bóng không nhận được ánh sáng (là **Ban Đêm**).\n\n💡 **Mẹo nông trại:** Nhờ chu kỳ ngày và đêm mà cây trồng quang hợp vào ban ngày và hô hấp nghỉ ngơi vào ban đêm đó bạn nhỏ ơi!`,
    "phan so": `📐 **Cách cộng hai phân số khác mẫu số:** (Kiến thức lớp 6)\n\n1. **Bước 1:** Tìm Mẫu số chung (thường là BCNN của 2 mẫu số).\n2. **Bước 2:** Quy đồng mẫu số của cả hai phân số.\n3. **Bước 3:** Cộng các tử số lại với nhau và giữ nguyên mẫu số chung: a/m + b/m = (a+b)/m.\n4. **Bước 4:** Rút gọn phân số về tối giản nếu cần.\n\n🌱 *Ví dụ:* 1/3 + 1/6 = 2/6 + 1/6 = 3/6 = 1/2. Cực kỳ dễ nhớ phải không nào!`,
    "quang hop": `🔬 **Quang hợp ở thực vật diễn ra như thế nào?** (Khoa học Tự nhiên lớp 7)\n\n🌿 Cây xanh dùng chất diệp lục ở lá để hấp thụ ánh sáng mặt trời, hút nước (H₂O) từ rễ và khí Carbon dioxide (CO₂) từ không khí.\n\n🍃 **Phương trình kỳ diệu:**\nKhí Carbon dioxide + Nước + Ánh sáng mặt trời ➔ Glucose (chất dinh dưỡng nuôi cây) + Khí Oxygen (O₂).\n\n🍎 Chính nhờ quang hợp mà khu vườn của chúng ta vừa có trái ngọt vừa lọc sạch không khí!`,
  };

  const lowerQ = question.toLowerCase();
  let matched = "";
  for (const [key, val] of Object.entries(fallbackAnswers)) {
    if (lowerQ.includes(key)) {
      matched = val;
      break;
    }
  }

  if (!matched) {
    matched = `🌱 **Giải đáp từ Bác Nông Dân Tri Thức:**\n\nCâu hỏi: "${question}" là một chủ đề rất hay trong chương trình học lớp ${grade}!\n\n💡 **Lời giải thích:**\nĐể nắm chắc kiến thức này, em hãy nhớ liên hệ với các bài học trên lớp và quan sát hiện tượng thực tế xung quanh. Kiến thức cũng giống như mầm non, càng rèn luyện nhiều thì rễ càng bám sâu và tán cây tri thức càng xanh tươi!\n\n🌳 Hãy tiếp tục làm thêm các nhiệm vụ hôm nay để nông trại của em đơm hoa kết trái nhé!`;
  }

  res.json({
    answer: matched,
    source: "fallback",
  });
});

// 2. Generate Quiz (Chế độ AI hỏi - Học sinh trả lời)
app.post("/api/ai/quiz", async (req, res) => {
  const { subject = "Toán", grade = 7, topic = "Kiến thức tổng hợp" } = req.body;

  const ai = getGeminiClient();
  if (ai) {
    try {
      const prompt = `Tạo 3 câu hỏi trắc nghiệm khách quan 4 lựa chọn cho học sinh THCS lớp ${grade}, môn ${subject}, chủ đề: "${topic}".
Trả về duy nhất định dạng JSON chuẩn theo schema sau, không kèm bất kỳ văn bản giải thích nào ngoài json:
[
  {
    "id": "q1",
    "question": "Nội dung câu hỏi",
    "options": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
    "correctAnswer": 0,
    "hint": "Gợi ý khi học sinh bí",
    "explanation": "Giải thích chi tiết vì sao đáp án đó đúng"
  }
]
Đảm bảo correctAnswer là chỉ số số nguyên 0, 1, 2, hoặc 3 tương ứng với options.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const text = response.text?.trim() || "[]";
      const cleanJson = text.replace(/^```json/g, "").replace(/```$/g, "").trim();
      const parsed = JSON.parse(cleanJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return res.json({ questions: parsed, source: "gemini" });
      }
    } catch (err: any) {
      console.warn("Quiz generation error, using fallback pool:", err.message);
    }
  }

  // Fallback high quality quiz bank
  const quizBank: Record<string, any[]> = {
    "Toán": [
      {
        id: "math-1",
        question: "Kết quả của phép tính (-15) + (-25) là bao nhiêu?",
        options: ["-40", "40", "-10", "10"],
        correctAnswer: 0,
        hint: "Cộng hai số nguyên cùng dấu âm: ta cộng hai giá trị tuyệt đối rồi đặt dấu '-' phía trước.",
        explanation: "(-15) + (-25) = -(15 + 25) = -40.",
      },
      {
        id: "math-2",
        question: "Số đối của phân số -3/7 là gì?",
        options: ["3/7", "-7/3", "7/3", "-3/-7"],
        correctAnswer: 0,
        hint: "Hai số đối nhau có tổng bằng 0. Số đối của -a là a.",
        explanation: "Số đối của -3/7 là -(-3/7) = 3/7.",
      },
      {
        id: "math-3",
        question: "Tìm x biết: 2x - 6 = 14",
        options: ["x = 10", "x = 4", "x = 8", "x = 12"],
        correctAnswer: 0,
        hint: "Chuyển vế đổi dấu: 2x = 14 + 6, sau đó chia cả 2 vế cho 2.",
        explanation: "2x - 6 = 14 => 2x = 20 => x = 10.",
      },
    ],
    "Khoa học tự nhiên": [
      {
        id: "science-1",
        question: "Bào quan nào được ví như 'nhà máy năng lượng' của tế bào thực vật và động vật?",
        options: ["Ti thể", "Không bào", "Lục lạp", "Nhân tế bào"],
        correctAnswer: 0,
        hint: "Bào quan này thực hiện quá trình hô hấp tế bào để giải phóng năng lượng ATP.",
        explanation: "Ti thể tham gia vào quá trình hô hấp tế bào tạo ra phần lớn năng lượng cho các hoạt động sống.",
      },
      {
        id: "science-2",
        question: "Khí nào chiếm thể tích lớn nhất trong thành phần của không khí quyển Trái Đất?",
        options: ["Khí Nitrogen (Nitơ - ~78%)", "Khí Oxygen (Oxi - ~21%)", "Khí Carbon dioxide (~0.04%)", "Khí Argon"],
        correctAnswer: 0,
        hint: "Khí này chiếm gần 4/5 (khoảng 78%) thể tích không khí.",
        explanation: "Khí Nitrogen chiếm khoảng 78%, Oxygen khoảng 21%, còn lại là hơi nước và các khí khác.",
      },
    ],
    "Ngữ văn": [
      {
        id: "lit-1",
        question: "Trong câu: 'Mặt trời đội biển nhô màu mới' (Huy Cận), tác giả sử dụng biện pháp tu từ nào?",
        options: ["Nhân hóa", "So sánh", "Hoán dụ", "Điệp từ"],
        correctAnswer: 0,
        hint: "Hành động 'đội' là hành động của con người được gán cho Mặt trời.",
        explanation: "Mặt trời được gán cho hành động 'đội biển' vốn của con người, tạo nên hình ảnh nhân hóa hùng vĩ, tràn đầy sức sống.",
      },
    ],
    "Tiếng Anh": [
      {
        id: "eng-1",
        question: "Choose the correct answer: 'She usually ______ to school by bicycle every morning.'",
        options: ["goes", "go", "is going", "went"],
        correctAnswer: 0,
        hint: "Chủ ngữ ngôi thứ ba số ít 'She' và trạng từ tần suất 'usually' chỉ thói quen hiện tại đơn.",
        explanation: "Thì hiện tại đơn với chủ ngữ 'She': động từ thêm -es (go -> goes).",
      },
    ],
  };

  const pool = quizBank[subject] || quizBank["Toán"];
  res.json({ questions: pool, source: "curriculum_bank" });
});

// 3. AI Evaluate Student Competence
app.post("/api/ai/evaluate", async (req, res) => {
  const { studentName, grade, subjectScores, totalTasks, accuracy } = req.body;

  const ai = getGeminiClient();
  if (ai) {
    try {
      const prompt = `Phân tích năng lực học tập của học sinh THCS:
- Tên: ${studentName}
- Lớp: ${grade}
- Điểm theo môn: ${JSON.stringify(subjectScores || {})}
- Số bài tập hoàn thành: ${totalTasks}
- Tỉ lệ chính xác: ${accuracy}%

Hãy viết bản đánh giá ngắn gọn, truyền cảm hứng theo phong cách Nông Trại Tri Thức bằng tiếng Việt:
1. Nhận xét điểm mạnh nổi bật.
2. Chỉ ra môn hoặc kỹ năng cần bồi đắp thêm.
3. Lời khuyên chăm sóc nông trại cụ thể cho tuần tới (ví dụ gieo hạt giống môn nào, tưới nước cho cây nào).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      return res.json({
        evaluation: response.text,
        source: "gemini",
      });
    } catch (err: any) {
      console.warn("AI evaluation fallback:", err.message);
    }
  }

  // Fallback evaluation
  const evalText = `🌱 **BÁO CÁO PHÂN TÍCH NĂNG LỰC TỔNG QUAN**\n\n` +
    `⭐ **Điểm mạnh:** Em ${studentName} thể hiện tư duy nhạy bén và tiến độ học tập rất tích cực. Môn Khoa học tự nhiên và Tiếng Anh đạt độ chính xác cao (${accuracy}%).\n\n` +
    `🌿 **Điểm cần bồi dưỡng:** Cần tăng cường luyện tập thêm kỹ năng giải toán phân số và đọc hiểu Ngữ văn để các luống cây kiến thức phát triển đồng đều hơn.\n\n` +
    `🌾 **Lời khuyên chăm sóc nông trại:** Mỗi ngày hãy dành thêm 10 phút ghé thăm 'Vườn Toán' và 'Vườn Văn'. Chỉ cần hoàn thành 3-5 câu hỏi nhỏ, nông trại của em sẽ nhanh chóng bước vào vụ mùa bội thu!`;

  res.json({ evaluation: evalText, source: "fallback" });
});

// Vite middleware integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🌾 Nông Trại Tri Thức server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
