import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Award,
  Trophy,
  Flame,
  Coins,
  Sprout,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Save,
  X,
  Upload,
  Sparkles,
  Link as LinkIcon,
  Copy,
  UserCheck,
  UserX,
  Check,
  Clock,
  ArrowRight,
} from "lucide-react";

interface ProfilePageProps {
  onNavigate: (path: string) => void;
}

const AVATAR_OPTIONS = [
  "🌱", "👧", "👦", "🧑", "👩", "🧒", "👨", "🦉", "🦁", "🦊", "🐼", "🚀"
];

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const {
    user,
    profile,
    updateProfile,
    refreshProfile,
    linkingState,
    sendLinkRequest,
    respondLinkRequest,
    unlinkAccountRequest,
  } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [editFullName, setEditFullName] = useState(profile?.fullName || "");
  const [selectedAvatar, setSelectedAvatar] = useState(profile?.avatarUrl || "🌱");
  const [editGrade, setEditGrade] = useState(profile?.grade || 7);

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Link input state
  const [targetCodeOrEmail, setTargetCodeOrEmail] = useState("");
  const [linkingLoading, setLinkingLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!user && !profile) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl mb-4">
          🔒
        </div>
        <h2 className="font-display font-black text-2xl text-stone-900 mb-2">
          Vui lòng đăng nhập để xem hồ sơ
        </h2>
        <p className="text-sm text-stone-500 max-w-md mb-6">
          Bạn cần đăng nhập tài khoản để quản lý thông tin cá nhân và xem thành tích nông trại của mình.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => onNavigate("/login")}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow cursor-pointer"
          >
            Đăng nhập
          </button>
          <button
            onClick={() => onNavigate("/register")}
            className="px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-sm rounded-2xl cursor-pointer"
          >
            Đăng ký tài khoản
          </button>
        </div>
      </div>
    );
  }

  // Format joined date
  const joinedDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "Chưa xác định";

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1.5 * 1024 * 1024) {
      setStatusMessage({ type: "error", text: "Ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn 1.5MB." });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setSelectedAvatar(reader.result);
        setStatusMessage({ type: "success", text: "Đã chọn ảnh đại diện. Nhấn 'Lưu thay đổi' để hoàn tất!" });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setStatusMessage(null);
    if (!editFullName.trim()) {
      setStatusMessage({ type: "error", text: "Họ và tên không được để trống." });
      return;
    }

    setLoading(true);
    const res = await updateProfile({
      fullName: editFullName.trim(),
      avatarUrl: selectedAvatar,
      grade: profile?.role === "student" ? editGrade : undefined,
    });
    setLoading(false);

    if (res.success) {
      setIsEditing(false);
      setStatusMessage({ type: "success", text: "Đã cập nhật hồ sơ thành công! 🎉" });
      refreshProfile();
    } else {
      setStatusMessage({ type: "error", text: res.error || "Không thể cập nhật hồ sơ." });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditFullName(profile?.fullName || "");
    setSelectedAvatar(profile?.avatarUrl || "🌱");
    setEditGrade(profile?.grade || 7);
    setStatusMessage(null);
  };

  const handleCopyLinkCode = () => {
    if (profile?.linkCode) {
      navigator.clipboard.writeText(profile.linkCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCodeOrEmail.trim()) return;

    setLinkingLoading(true);
    setStatusMessage(null);

    const res = await sendLinkRequest(targetCodeOrEmail.trim());
    setLinkingLoading(false);

    if (res.success) {
      setTargetCodeOrEmail("");
      setStatusMessage({
        type: "success",
        text: "Đã gửi yêu cầu liên kết thành công! Hãy nhờ người thân xác nhận trong tài khoản của họ.",
      });
    } else {
      setStatusMessage({
        type: "error",
        text: res.error || "Không thể gửi yêu cầu liên kết.",
      });
    }
  };

  const isImageAvatar = selectedAvatar.startsWith("http://") || selectedAvatar.startsWith("https://") || selectedAvatar.startsWith("data:image");

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 space-y-6 animate-in fade-in">
      {/* Status banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-semibold border ${
            statusMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span className="flex-1">{statusMessage.text}</span>
          <button onClick={() => setStatusMessage(null)} className="cursor-pointer text-stone-400 hover:text-stone-700">
            ✕
          </button>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm relative overflow-hidden">
        {/* Background pastoral banner */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-400 opacity-90" />

        <div className="relative pt-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          {/* Avatar & Basic Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
            {/* Avatar display / picker */}
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white border-4 border-white shadow-xl flex items-center justify-center overflow-hidden bg-emerald-50 text-5xl select-none">
                {isImageAvatar ? (
                  <img
                    src={selectedAvatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span>{selectedAvatar}</span>
                )}
              </div>

              {isEditing && (
                <label className="absolute bottom-1 right-1 p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow cursor-pointer transition-transform hover:scale-105">
                  <Upload className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h1 className="font-display font-black text-2xl sm:text-3xl text-stone-900">
                  {profile?.fullName || "Người dùng"}
                </h1>
                <span className="text-xl">🌱</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-500 flex items-center gap-1.5 justify-center sm:justify-start mt-0.5">
                <Mail className="w-3.5 h-3.5 text-stone-400" />
                <span>{profile?.email}</span>
              </p>
            </div>
          </div>

          {/* Edit / Save Action Buttons */}
          <div className="w-full sm:w-auto flex justify-center sm:justify-end gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Hủy</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? "Đang lưu..." : "Lưu thay đổi"}</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setIsEditing(true);
                  setEditFullName(profile?.fullName || "");
                  setSelectedAvatar(profile?.avatarUrl || "🌱");
                  setEditGrade(profile?.grade || 7);
                }}
                className="px-4 py-2 bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 text-stone-700 font-bold text-xs rounded-xl border border-stone-200 flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5 text-stone-500" />
                <span>Chỉnh sửa hồ sơ</span>
              </button>
            )}
          </div>
        </div>

        {/* Editable Form Section (When in edit mode) */}
        {isEditing && (
          <div className="mt-8 pt-6 border-t border-stone-100 space-y-4 animate-in fade-in">
            <div className="bg-amber-50/70 border border-amber-200/60 rounded-2xl p-3 text-xs text-amber-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Lưu ý:</strong> Bạn có thể chỉnh sửa Họ tên, Ảnh đại diện và Khối lớp.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              {profile?.role === "student" && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Khối lớp THCS
                  </label>
                  <select
                    value={editGrade}
                    onChange={(e) => setEditGrade(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  >
                    <option value={6}>Lớp 6</option>
                    <option value={7}>Lớp 7</option>
                    <option value={8}>Lớp 8</option>
                    <option value={9}>Lớp 9</option>
                  </select>
                </div>
              )}
            </div>

            {/* Quick avatar selector */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Chọn biểu tượng đại diện hoặc tải ảnh lên:
              </label>
              <div className="flex flex-wrap gap-2">
                {AVATAR_OPTIONS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setSelectedAvatar(av)}
                    className={`w-10 h-10 rounded-2xl text-xl flex items-center justify-center border transition-all cursor-pointer ${
                      selectedAvatar === av
                        ? "bg-emerald-100 border-emerald-500 shadow-xs scale-110"
                        : "bg-stone-50 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* User System Details Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-stone-100">
          {/* Role */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                Vai trò hệ thống
              </span>
              <span className="text-sm font-extrabold text-stone-800">
                {profile?.role === "student"
                  ? `Học sinh (Lớp ${profile.grade || 7})`
                  : "Phụ huynh"}
              </span>
              <span className="text-[10px] text-emerald-700 block mt-0.5">
                ✓ Được xác thực an toàn
              </span>
            </div>
          </div>

          {/* Email */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                Tài khoản Email
              </span>
              <span className="text-sm font-bold text-stone-800 break-all">
                {profile?.email}
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                {profile?.googleId ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    Google OAuth Thật
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    Tài khoản Email
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Joined Date */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                Ngày tham gia
              </span>
              <span className="text-sm font-extrabold text-stone-800">
                {joinedDate}
              </span>
              <span className="text-[10px] text-stone-400 block mt-0.5">
                Thành viên Nông Trại Tri Thức
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ACCOUNT LINKING SECTION (Phụ huynh & Học sinh xác nhận liên kết 2 chiều) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <LinkIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-black text-xl text-stone-900">
                Liên Kết Tài Khoản Gia Đình (Phụ huynh ↔ Học sinh)
              </h2>
              <p className="text-xs text-stone-500">
                Bảo vệ dữ liệu: Phụ huynh chỉ xem được dữ liệu của con khi cả hai bên đã xác nhận liên kết.
              </p>
            </div>
          </div>

          {/* User's own Link Code pill */}
          <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-3.5 py-2 rounded-2xl">
            <div>
              <span className="text-[10px] uppercase font-black text-indigo-500 block">Mã liên kết của bạn:</span>
              <span className="font-mono font-black text-sm text-indigo-900 tracking-wider">
                {profile?.linkCode || linkingState.myLinkCode || "Đang tải..."}
              </span>
            </div>
            <button
              onClick={handleCopyLinkCode}
              title="Sao chép mã"
              className="p-1.5 hover:bg-indigo-100 rounded-xl text-indigo-700 cursor-pointer transition-colors"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Input to send link request */}
        <form onSubmit={handleSendLink} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={targetCodeOrEmail}
              onChange={(e) => setTargetCodeOrEmail(e.target.value)}
              placeholder={
                profile?.role === "parent"
                  ? "Nhập mã liên kết của con (VD: HS-5821) hoặc email..."
                  : "Nhập mã liên kết của phụ huynh (VD: PH-3914) hoặc email..."
              }
              className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium text-stone-800"
            />
          </div>
          <button
            type="submit"
            disabled={linkingLoading || !targetCodeOrEmail.trim()}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-2"
          >
            {linkingLoading ? "Đang gửi..." : "Gửi yêu cầu liên kết"}
          </button>
        </form>

        {/* Incoming Pending Requests (Need confirmation) */}
        {linkingState.incomingRequests && linkingState.incomingRequests.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Yêu cầu liên kết đang chờ bạn xác nhận:</span>
            </h3>
            <div className="space-y-2">
              {linkingState.incomingRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-xs font-bold text-stone-900">
                      {req.requesterName}{" "}
                      <span className="text-[11px] font-normal text-stone-500">({req.requesterEmail})</span>
                    </p>
                    <p className="text-[10px] text-amber-700 mt-0.5">
                      Vai trò: {req.requesterRole === "parent" ? "👨👩👧 Phụ huynh" : "🌱 Học sinh"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => respondLinkRequest(req.id, "accept")}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" /> Chấp nhận
                    </button>
                    <button
                      onClick={() => respondLinkRequest(req.id, "reject")}
                      className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Từ chối
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Linked Accounts */}
        <div>
          <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-3">
            Danh sách tài khoản đã xác nhận liên kết ({linkingState.linkedAccounts.length})
          </h3>
          {linkingState.linkedAccounts.length === 0 ? (
            <div className="p-6 rounded-2xl border border-dashed border-stone-200 text-center text-xs text-stone-500">
              Chưa có tài khoản nào được liên kết. Hãy chia sẻ mã liên kết của bạn với gia đình để kết nối!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {linkingState.linkedAccounts.map((link) => (
                <div
                  key={link.linkId}
                  className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-lg font-bold">
                      {link.role === "student" ? "🌱" : "👨👩👧"}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs sm:text-sm text-stone-900">{link.name}</h4>
                      <p className="text-[11px] text-stone-500">{link.email}</p>
                      <span className="inline-block mt-0.5 text-[10px] font-bold text-emerald-700">
                        {link.role === "student" ? "Học sinh" : "Phụ huynh"} • Đã liên kết
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm(`Bạn có chắc muốn hủy liên kết với ${link.name}? Dữ liệu học tập vẫn được giữ nguyên an toàn.`)) {
                        unlinkAccountRequest(link.linkId);
                      }
                    }}
                    title="Hủy liên kết"
                    className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl cursor-pointer transition-colors"
                  >
                    <UserX className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Thành Tích Học Tập (Gamified Farm Stats) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-black text-xl text-stone-900">
                Thành Tích Học Tập Nông Trại
              </h2>
              <p className="text-xs text-stone-500">
                Ghi nhận công sức chăm sóc cây tri thức qua từng câu hỏi và nhiệm vụ
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate("/dashboard")}
            className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer hidden sm:block"
          >
            Đến nông trại →
          </button>
        </div>

        {/* 4 Key Metrics - Real values, no fake fallbacks */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-center">
            <div className="text-2xl mb-1">⭐</div>
            <div className="font-display font-black text-xl sm:text-2xl text-emerald-950">
              {profile ? profile.knowledgePoints.toLocaleString() : 0}
            </div>
            <div className="text-xs font-bold text-emerald-700">Điểm Tri Thức</div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 text-center">
            <div className="text-2xl mb-1">🪙</div>
            <div className="font-display font-black text-xl sm:text-2xl text-amber-950">
              {profile ? profile.coins : 0}
            </div>
            <div className="text-xs font-bold text-amber-700">Xu Tri Thức</div>
          </div>

          <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-100 text-center">
            <div className="text-2xl mb-1">🔥</div>
            <div className="font-display font-black text-xl sm:text-2xl text-orange-950">
              {profile ? profile.currentStreak : 0} Ngày
            </div>
            <div className="text-xs font-bold text-orange-700">Chuỗi Ngày Học</div>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-100 text-center">
            <div className="text-2xl mb-1">🧺</div>
            <div className="font-display font-black text-xl sm:text-2xl text-teal-950">
              {profile ? profile.totalHarvested : 0} Mùa
            </div>
            <div className="text-xs font-bold text-teal-700">Cây Đã Thu Hoạch</div>
          </div>
        </div>

        {/* Badges showcase */}
        <div className="pt-4 border-t border-stone-100">
          <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Huy hiệu danh dự</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className={`p-3 rounded-2xl border flex items-center gap-2.5 ${
              (profile?.currentStreak ?? 0) >= 3 ? "bg-emerald-50 border-emerald-200" : "bg-stone-50 border-stone-200 opacity-60"
            }`}>
              <span className="text-2xl">🌱</span>
              <div>
                <div className="text-xs font-bold text-stone-900">Người chăm chỉ</div>
                <div className="text-[10px] text-emerald-600 font-semibold">
                  {(profile?.currentStreak ?? 0) >= 3 ? "Đã đạt" : "Chuỗi 3 ngày"}
                </div>
              </div>
            </div>
            <div className={`p-3 rounded-2xl border flex items-center gap-2.5 ${
              (profile?.totalHarvested ?? 0) >= 5 ? "bg-emerald-50 border-emerald-200" : "bg-stone-50 border-stone-200 opacity-60"
            }`}>
              <span className="text-2xl">🌳</span>
              <div>
                <div className="text-xs font-bold text-stone-900">Trồng cây giỏi</div>
                <div className="text-[10px] text-emerald-600 font-semibold">
                  {(profile?.totalHarvested ?? 0) >= 5 ? "Đã đạt" : "5 cây trưởng thành"}
                </div>
              </div>
            </div>
            <div className={`p-3 rounded-2xl border flex items-center gap-2.5 ${
              (profile?.knowledgePoints ?? 0) >= 500 ? "bg-emerald-50 border-emerald-200" : "bg-stone-50 border-stone-200 opacity-60"
            }`}>
              <span className="text-2xl">📚</span>
              <div>
                <div className="text-xs font-bold text-stone-900">Nhà thông thái</div>
                <div className="text-[10px] text-emerald-600 font-semibold">
                  {(profile?.knowledgePoints ?? 0) >= 500 ? "Đã đạt" : "500 điểm"}
                </div>
              </div>
            </div>
            <div className={`p-3 rounded-2xl border flex items-center gap-2.5 ${
              (profile?.currentStreak ?? 0) >= 7 ? "bg-emerald-50 border-emerald-200" : "bg-stone-50 border-stone-200 opacity-60"
            }`}>
              <span className="text-2xl">🔥</span>
              <div>
                <div className="text-xs font-bold text-stone-900">Chiến binh 7 ngày</div>
                <div className="text-[10px] text-emerald-600 font-semibold">
                  {(profile?.currentStreak ?? 0) >= 7 ? "Đã mở khóa" : "Chuỗi 7 ngày"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
