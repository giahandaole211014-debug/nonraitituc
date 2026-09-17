import React, { useState } from "react";
import { getSupabaseConfig, saveSupabaseConfig } from "../lib/supabase";
import {
  Database,
  Key,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Globe,
  Settings,
  HelpCircle,
} from "lucide-react";

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({ isOpen, onClose }) => {
  const currentConfig = getSupabaseConfig();
  const [url, setUrl] = useState(currentConfig.url);
  const [key, setKey] = useState(currentConfig.key);
  const [activeTab, setActiveTab] = useState<"keys" | "google" | "sql">("keys");
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedCallback, setCopiedCallback] = useState(false);
  const [copiedOrigin, setCopiedOrigin] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig(url, key);
  };

  // Derive Supabase Project ID from URL if available
  let projectId = "YOUR_PROJECT_ID";
  try {
    if (url.includes(".supabase.co")) {
      const parsed = new URL(url);
      projectId = parsed.hostname.split(".")[0];
    }
  } catch {
    // Keep placeholder
  }

  const supabaseCallbackUrl = `https://${projectId}.supabase.co/auth/v1/callback`;
  const currentAppOrigin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

  const sqlSchema = `-- BẢNG PROFILES ĐỒNG BỘ DỮ LIỆU NGƯỜI DÙNG THẬT (TỰ ĐỘNG ĐỒNG BỘ GOOGLE AUTH)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  role text default 'student', -- 'student' | 'parent'
  grade integer default 7,
  avatar_url text default '🌱',
  knowledge_points integer default 0,
  coins integer default 50,
  current_streak integer default 1,
  total_planted integer default 0,
  total_harvested integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- BẬT RLS (ROW LEVEL SECURITY)
alter table public.profiles enable row level security;

-- CHÍNH SÁCH BẢO VỆ: Người dùng xem & cập nhật hồ sơ chính mình
create policy "Cho phép người dùng xem hồ sơ cá nhân"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Cho phép người dùng cập nhật hồ sơ cá nhân"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Cho phép hệ thống chèn hồ sơ mới"
  on public.profiles for insert
  with check (auth.uid() = id);`;

  const copyText = (text: string, setFn: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setFn(true);
    setTimeout(() => setFn(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="max-w-2xl w-full bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-black text-lg sm:text-xl text-stone-900">
                Cấu Hình Supabase & Google OAuth Thật
              </h2>
              <p className="text-xs text-stone-500">
                Kết nối Supabase Auth, Google OAuth & cơ sở dữ liệu cho “Nông Trại Tri Thức”
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-stone-100 mt-4 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("keys")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "keys"
                ? "bg-emerald-100 text-emerald-800 shadow-xs"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            <Key className="w-3.5 h-3.5 text-emerald-600" />
            <span>1. Khóa Kết Nối Supabase</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("google")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "google"
                ? "bg-emerald-100 text-emerald-800 shadow-xs"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>2. Cấu Hình Google OAuth</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("sql")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "sql"
                ? "bg-emerald-100 text-emerald-800 shadow-xs"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            <Database className="w-3.5 h-3.5 text-violet-600" />
            <span>3. SQL Bảng Profiles</span>
          </button>
        </div>

        {/* TAB 1: Keys */}
        {activeTab === "keys" && (
          <form onSubmit={handleSave} className="space-y-4 mt-4">
            <div
              className={`p-3 rounded-2xl flex items-center gap-2.5 text-xs font-semibold ${
                currentConfig.isConfigured
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-amber-50 text-amber-800 border border-amber-200"
              }`}
            >
              {currentConfig.isConfigured ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Supabase đã được kết nối! Sẵn sàng đăng ký / đăng nhập người dùng thật.</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Chưa có thông tin Supabase. Vui lòng nhập Project URL và Anon Key từ Supabase.</span>
                </>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Supabase Project URL:
              </label>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-project-id.supabase.co"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-stone-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Supabase Anon Public API Key:
              </label>
              <input
                type="text"
                required
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-stone-800"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow cursor-pointer"
              >
                Lưu & Áp Dụng
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: Google OAuth Setup Guide */}
        {activeTab === "google" && (
          <div className="space-y-4 mt-4 text-xs text-stone-700">
            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-2.5 text-blue-900">
              <Globe className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Hướng Dẫn Cấu Hình Google OAuth Thật Với Supabase</p>
                <p className="text-[11px] text-blue-800 mt-0.5">
                  Làm theo 3 bước đơn giản dưới đây để nút <strong>🔵 Tiếp tục với Google</strong> hoạt động với tài khoản Google thật của học sinh và phụ huynh.
                </p>
              </div>
            </div>

            {/* Step 1: Google Cloud Console */}
            <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] flex items-center justify-center font-black">
                  1
                </span>
                <span>Tạo OAuth Client ID tại Google Cloud Console:</span>
              </div>
              <p className="text-[11px] text-stone-600">
                Truy cập <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" className="text-emerald-700 underline font-semibold">Google Cloud Credentials</a> &gt; Create Credentials &gt; <strong>OAuth client ID</strong> &gt; Application type: <strong>Web application</strong>.
              </p>

              {/* Authorized JavaScript Origins */}
              <div className="mt-2 space-y-1">
                <span className="text-[11px] font-bold text-stone-700">
                  Authorized JavaScript origins (Nguồn gốc JavaScript được phép):
                </span>
                <div className="flex items-center justify-between p-2 bg-white border border-stone-200 rounded-xl font-mono text-[11px]">
                  <span className="truncate">{currentAppOrigin}</span>
                  <button
                    onClick={() => copyText(currentAppOrigin, setCopiedOrigin)}
                    className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 shrink-0 ml-2"
                  >
                    {copiedOrigin ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedOrigin ? "Đã chép" : "Chép"}</span>
                  </button>
                </div>
                <p className="text-[10px] text-stone-400">
                  💡 Thêm cả domain Vercel (vd: <code>https://nong-trai-tri-thuc.vercel.app</code>) và <code>http://localhost:3000</code>.
                </p>
              </div>

              {/* Authorized Redirect URIs */}
              <div className="mt-2 space-y-1">
                <span className="text-[11px] font-bold text-stone-700">
                  Authorized redirect URIs (URI chuyển hướng được phép):
                </span>
                <div className="flex items-center justify-between p-2 bg-white border border-stone-200 rounded-xl font-mono text-[11px] text-emerald-800 font-bold">
                  <span className="truncate">{supabaseCallbackUrl}</span>
                  <button
                    onClick={() => copyText(supabaseCallbackUrl, setCopiedCallback)}
                    className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 shrink-0 ml-2"
                  >
                    {copiedCallback ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCallback ? "Đã chép" : "Chép"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2: Supabase Dashboard */}
            <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] flex items-center justify-center font-black">
                  2
                </span>
                <span>Kích hoạt Google Provider trong Supabase Dashboard:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-stone-600">
                <li>
                  Vào <strong>Supabase Dashboard</strong> &gt; Chọn dự án &gt; <strong>Authentication</strong> &gt; <strong>Providers</strong>.
                </li>
                <li>
                  Tìm <strong>Google</strong> và bật công tắc <strong>Enable Google provider</strong>.
                </li>
                <li>
                  Dán <strong>Client ID</strong> và <strong>Client Secret</strong> từ Google Cloud vào Supabase.
                </li>
                <li>Nhấn <strong>Save</strong>.</li>
              </ul>
            </div>

            {/* Step 3: URL Configuration */}
            <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] flex items-center justify-center font-black">
                  3
                </span>
                <span>Cấu hình Redirect URLs trong Supabase:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-stone-600">
                <li>
                  Vào <strong>Authentication</strong> &gt; <strong>URL Configuration</strong>.
                </li>
                <li>
                  <strong>Site URL:</strong> Điền URL trang web (vd: <code>{currentAppOrigin}</code>).
                </li>
                <li>
                  <strong>Redirect URLs:</strong> Thêm <code>{currentAppOrigin}/**</code> và <code>https://*.vercel.app/**</code>.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 3: SQL Schema */}
        {activeTab === "sql" && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>Mã SQL bảng profiles (Chạy trên Supabase SQL Editor):</span>
              </span>
              <button
                onClick={() => copyText(sqlSchema, setCopiedSql)}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? "Đã chép!" : "Sao chép SQL"}</span>
              </button>
            </div>
            <pre className="p-3 bg-stone-900 text-emerald-300 rounded-2xl text-[11px] font-mono overflow-x-auto max-h-56 border border-stone-800">
              {sqlSchema}
            </pre>
            <p className="text-[10px] text-stone-400">
              💡 Bảng profiles tự động đồng bộ họ tên, ảnh đại diện từ Google OAuth, lưu trữ điểm tri thức và bảo vệ dữ liệu với Row Level Security (RLS).
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
