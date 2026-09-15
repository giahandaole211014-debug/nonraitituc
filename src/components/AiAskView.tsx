import React, { useState } from "react";
import {
  HelpCircle,
  Send,
  Sparkles,
  Bot,
  User,
  Lightbulb,
  Compass,
  MessageSquare,
  BookOpen,
  CheckCircle,
} from "lucide-react";
import { StudentGrade } from "../types";

interface AiAskViewProps {
  currentGrade: StudentGrade;
  studentName: string;
}

interface QAMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  subject?: string;
  timestamp: string;
}

export const AiAskView: React.FC<AiAskViewProps> = ({
  currentGrade,
  studentName,
}) => {
  const [selectedSubject, setSelectedSubject] = useState("Toán");
  const [questionInput, setQuestionInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState<QAMessage[]>([
    {
      id: "welcome-1",
      sender: "ai",
      text: `Chào em **${studentName}** (Lớp ${currentGrade})! 🌱 Bác Nông Dân AI rất vui được hỗ trợ em. Em có thắc mắc gì về bài học trên lớp như Toán, Ngữ văn, Khoa học tự nhiên hay Lịch sử - Địa lý? Cứ thoải mái đặt câu hỏi nhé, bác sẽ giải thích thật dễ hiểu cho lứa tuổi lớp ${currentGrade}!`,
      timestamp: "Vừa xong",
    },
    {
      id: "qa-demo-1",
      sender: "user",
      text: "Tại sao Trái Đất lại có hiện tượng ngày và đêm?",
      subject: "Khoa học tự nhiên",
      timestamp: "09:10",
    },
    {
      id: "qa-demo-2",
      sender: "ai",
      text: `🌍 **Chào ${studentName}! Đây là lời giải thích sinh động cho hiện tượng Ngày và Đêm:**\n\n1. **Khối cầu xoay tròn:** Trái Đất có dạng hình cầu và liên tục tự quay quanh một trục tưởng tượng từ Tây sang Đông mất đúng 24 giờ (1 ngày đêm).\n\n2. **Mặt Trời như ngọn đèn khổng lồ:** Vì Trái Đất hình cầu nên tại một thời điểm, Mặt Trời chỉ có thể chiếu sáng được một nửa. Nửa được chiếu sáng là **Ban Ngày** ☀️, nửa còn lại chìm vào bóng tối là **Ban Đêm** 🌙.\n\n3. **Cây cối trong nông trại:** Nhờ chu kỳ này mà cây cối quang hợp nhả khí trong lành vào ban ngày, và hô hấp tích trữ dưỡng chất vào ban đêm đó em!\n\n💡 **Mẹo ghi nhớ:** Trái Đất tự quay 24 giờ một vòng, sinh ra ngày đêm nối tiếp nhau không ngừng.`,
      subject: "Khoa học tự nhiên",
      timestamp: "09:11",
    },
  ]);

  const SUBJECTS = [
    { name: "Toán", icon: "📐" },
    { name: "Ngữ văn", icon: "📚" },
    { name: "Khoa học tự nhiên", icon: "🔬" },
    { name: "Lịch sử và Địa lý", icon: "🌍" },
    { name: "Tiếng Anh", icon: "🇬🇧" },
    { name: "Tin học", icon: "💻" },
  ];

  const SAMPLE_QUESTIONS = [
    { subject: "Khoa học tự nhiên", text: "Tại sao Trái Đất có ngày và đêm?" },
    { subject: "Toán", text: "Làm thế nào để cộng hai phân số khác mẫu số?" },
    { subject: "Khoa học tự nhiên", text: "Quá trình quang hợp của cây xanh diễn ra như thế nào?" },
    { subject: "Ngữ văn", text: "Làm sao để phân biệt từ láy tượng thanh và từ láy tượng hình?" },
    { subject: "Lịch sử và Địa lý", text: "Chiến thắng trên sông Bạch Đằng năm 938 diễn ra như thế nào?" },
    { subject: "Tiếng Anh", text: "Khi nào thì dùng thì Hiện tại đơn, khi nào dùng Hiện tại tiếp diễn?" },
  ];

  const handleAsk = async (customPrompt?: string) => {
    const q = (customPrompt || questionInput).trim();
    if (!q || isLoading) return;

    const userMsg: QAMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: q,
      subject: selectedSubject,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuestionInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          grade: currentGrade,
          subject: selectedSubject,
        }),
      });

      const data = await res.json();
      const aiMsg: QAMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: data.answer || "Bác Nông Dân AI đã lắng nghe, kiến thức này rất bổ ích!",
        subject: selectedSubject,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const aiFallback: QAMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: `🌱 **Bác Nông Dân AI đã ghi nhận câu hỏi:** "${q}".\n\nĐây là kiến thức trọng tâm của môn ${selectedSubject} lớp ${currentGrade}. Hãy áp dụng các nguyên lý cơ bản từ bài giảng trên lớp và tiếp tục làm các bài luyện tập trong nông trại để rễ tri thức bám chắc hơn nhé!`,
        subject: selectedSubject,
        timestamp: "Vừa xong",
      };
      setMessages((prev) => [...prev, aiFallback]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
              <Sparkles className="w-3.5 h-3.5" />
              Gia Sư Trí Tuệ Nhân Tạo
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-stone-900 mt-2 flex items-center gap-2">
              <span>❓</span> HỎI & ĐÁP CÙNG AI
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Giải đáp chi tiết, gần gũi và điều chỉnh độ sâu kiến thức chuẩn học sinh{" "}
              <strong className="text-emerald-700 font-bold">Lớp {currentGrade}</strong>.
            </p>
          </div>

          {/* Subject Pills */}
          <div className="flex flex-wrap gap-1.5">
            {SUBJECTS.map((sub) => (
              <button
                key={sub.name}
                onClick={() => setSelectedSubject(sub.name)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  selectedSubject === sub.name
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                <span>{sub.icon}</span>
                <span>{sub.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Suggested Questions Carousel */}
      <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200/80">
        <div className="flex items-center gap-2 text-xs font-bold text-stone-700 mb-2">
          <Compass className="w-4 h-4 text-amber-600" />
          <span>Câu hỏi gợi ý hay cho học sinh lớp {currentGrade}:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_QUESTIONS.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedSubject(sq.subject);
                handleAsk(sq.text);
              }}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 text-xs text-stone-700 hover:text-emerald-800 transition-all text-left shadow-2xs"
            >
              🌱 {sq.text}
            </button>
          ))}
        </div>
      </div>

      {/* Main Conversation Stream */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs min-h-[420px] flex flex-col justify-between">
        {/* Messages List */}
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 text-sm font-bold shadow-xs ${
                  msg.sender === "user"
                    ? "bg-emerald-600 text-white"
                    : "bg-gradient-to-tr from-amber-400 to-emerald-400 text-stone-900"
                }`}
              >
                {msg.sender === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>

              <div
                className={`max-w-2xl rounded-3xl p-4 sm:p-5 text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-emerald-600 text-white rounded-tr-xs"
                    : "bg-stone-50 border border-stone-200/80 text-stone-800 rounded-tl-xs"
                }`}
              >
                {msg.subject && (
                  <div
                    className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${
                      msg.sender === "user" ? "text-emerald-200" : "text-emerald-800"
                    }`}
                  >
                    Môn: {msg.subject}
                  </div>
                )}
                <div className="whitespace-pre-line">{msg.text}</div>
                <div
                  className={`text-[10px] mt-2 text-right ${
                    msg.sender === "user" ? "text-emerald-200" : "text-stone-400"
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-stone-500 italic p-3 bg-stone-50 rounded-2xl w-fit">
              <Bot className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>Bác Nông Dân AI đang suy nghĩ câu trả lời phù hợp với lớp {currentGrade}...</span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="mt-6 pt-4 border-t border-stone-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                id="ai-question-input"
                type="text"
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                placeholder={`Hỏi AI bất kỳ điều gì về môn ${selectedSubject} (Lớp ${currentGrade})...`}
                className="w-full pl-4 pr-12 py-3.5 rounded-2xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-sm"
              />
            </div>

            <button
              id="btn-submit-question"
              type="submit"
              disabled={isLoading || !questionInput.trim()}
              className="p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold transition-all shadow-sm hover:scale-105 cursor-pointer shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[11px] text-stone-400 mt-2 px-1">
            <span>Đang giải đáp theo chương trình: Môn {selectedSubject} • Lớp {currentGrade}</span>
            <span>💡 Câu trả lời thân thiện, an toàn cho lứa tuổi học sinh</span>
          </div>
        </div>
      </div>
    </div>
  );
};
