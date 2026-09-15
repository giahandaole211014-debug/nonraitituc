import React, { useState } from "react";
import {
  Sprout,
  Droplets,
  Sparkles,
  Flame,
  Award,
  PlusCircle,
  Clock,
  HeartPulse,
  ShoppingBag,
  RotateCcw,
} from "lucide-react";
import confetti from "canvas-confetti";
import { StudentProfile, Plant, PlantStage, PlantHealth } from "../types";
import { sound } from "../utils/sound";

interface MyFarmViewProps {
  student: StudentProfile;
  onHarvestPlant: (plantId: string) => void;
  onWaterPlant: (plantId: string) => void;
  onPlantNewSeed: (name: string, subject: string, icon: string) => void;
  onNavigateToTasks: () => void;
}

export const MyFarmView: React.FC<MyFarmViewProps> = ({
  student,
  onHarvestPlant,
  onWaterPlant,
  onPlantNewSeed,
  onNavigateToTasks,
}) => {
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [showSeedModal, setShowSeedModal] = useState(false);
  const [selectedSeedType, setSelectedSeedType] = useState({
    name: "Cây Táo Logic",
    subject: "Toán",
    icon: "🍎",
  });

  // Calculate today's tasks progress
  const totalDailyQuestions = student.dailyTasks.reduce((acc, t) => acc + t.totalQuestions, 0);
  const completedDailyQuestions = student.dailyTasks.reduce((acc, t) => acc + t.completedQuestions, 0);

  // Growth stage icons and labels
  const getStageDisplay = (stage: PlantStage, health: PlantHealth, fruitCount: number = 0) => {
    if (health === "wilting" || health === "withered") {
      return {
        icon: "🥀",
        label: "Cây đang héo",
        color: "text-amber-700 bg-amber-100",
        message: "Cần tưới nước tri thức để hồi sinh!",
      };
    }
    switch (stage) {
      case "seed":
        return { icon: "🌰", label: "Hạt giống", color: "text-amber-800 bg-amber-100", message: "Đang ấp ủ mầm non" };
      case "sprout":
        return { icon: "🌱", label: "Mầm cây", color: "text-emerald-700 bg-emerald-100", message: "Vừa nhú mầm xanh tươi" };
      case "sapling":
        return { icon: "🌿", label: "Cây non", color: "text-green-700 bg-green-100", message: "Đang lớn từng ngày" };
      case "mature":
        return { icon: "🌳", label: "Trưởng thành", color: "text-emerald-800 bg-emerald-100", message: "Tán lá sum suê" };
      case "fruit":
        return {
          icon: fruitCount > 3 ? "🍎🍎🍎" : "🍎",
          label: "Cây cho quả",
          color: "text-red-700 bg-red-100 animate-pulse",
          message: "Đã chín mọng, sẵn sàng thu hoạch!",
        };
      case "harvested":
        return { icon: "🧺", label: "Đã thu hoạch", color: "text-amber-800 bg-amber-50", message: "Bội thu tri thức" };
      default:
        return { icon: "🌱", label: "Đang lớn", color: "text-emerald-700 bg-emerald-100", message: "" };
    }
  };

  const handleHarvestClick = (e: React.MouseEvent, plant: Plant) => {
    e.stopPropagation();
    sound.playHarvest();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    onHarvestPlant(plant.id);
  };

  const handleWaterClick = (e: React.MouseEvent, plant: Plant) => {
    e.stopPropagation();
    sound.playWater();
    onWaterPlant(plant.id);
  };

  const seedOptions = [
    { name: "Cây Táo Phân Số", subject: "Toán", icon: "🍎", desc: "Giúp rèn luyện tư duy số học và hình học" },
    { name: "Cây Hướng Dương Văn Học", subject: "Ngữ văn", icon: "🌻", desc: "Bồi đắp cảm thụ thơ ca và văn biểu cảm" },
    { name: "Cây Cam Sinh Học", subject: "Khoa học tự nhiên", icon: "🍊", desc: "Khám phá thế giới vi sinh và quang hợp" },
    { name: "Cây Đậu Lịch Sử", subject: "Lịch sử & Địa lý", icon: "🌱", desc: "Khám phá các thời kỳ lịch sử hào hùng" },
    { name: "Cây Nho Tiếng Anh", subject: "Tiếng Anh", icon: "🍇", desc: "Tích luỹ từ vựng và ngữ pháp đa dạng" },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Farm Header Status HUD */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700 text-white p-6 sm:p-8 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-3xl p-2 bg-white/15 rounded-2xl backdrop-blur-xs">
                {student.avatar}
              </span>
              <div>
                <h1 className="font-display font-black text-2xl sm:text-3xl text-white">
                  🌱 Nông trại của {student.name}
                </h1>
                <p className="text-xs sm:text-sm text-emerald-100 font-medium">
                  Học sinh Lớp {student.grade} • Danh hiệu:{" "}
                  <span className="font-bold text-amber-300">{student.levelTitle}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Quick HUD Metrics Bar as required in Section 5 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full md:w-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 text-center">
              <div className="text-[11px] text-emerald-100 uppercase tracking-wider font-semibold">Cấp độ</div>
              <div className="text-xl font-extrabold text-white mt-0.5">{student.level}</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 text-center">
              <div className="text-[11px] text-emerald-100 uppercase tracking-wider font-semibold">Điểm tri thức</div>
              <div className="text-xl font-extrabold text-amber-300 mt-0.5">
                {student.knowledgePoints.toLocaleString()}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 text-center">
              <div className="text-[11px] text-emerald-100 uppercase tracking-wider font-semibold">Nhiệm vụ hôm nay</div>
              <div className="text-xl font-extrabold text-emerald-200 mt-0.5">
                {completedDailyQuestions}/{totalDailyQuestions}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 text-center">
              <div className="text-[11px] text-emerald-100 uppercase tracking-wider font-semibold">Chuỗi liên tục</div>
              <div className="text-xl font-extrabold text-orange-300 mt-0.5 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 fill-orange-300" />
                {student.currentStreak} ngày
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar to next level */}
        <div className="mt-6 pt-4 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-emerald-100">Tiến độ cấp {student.level}:</span>
            <div className="w-48 sm:w-64 h-2.5 bg-black/20 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (student.knowledgePoints % 500) / 5)}%` }}
              />
            </div>
            <span className="font-bold text-amber-200">
              {student.knowledgePoints % 500}/500 EXP
            </span>
          </div>

          <div className="flex items-center gap-4 text-emerald-100">
            <span>🌾 Đang chăm: <strong>{student.plants.length}</strong> cây</span>
            <span>🧺 Đã thu hoạch: <strong>{student.totalHarvested}</strong> mùa</span>
          </div>
        </div>
      </div>

      {/* Wilting Plant Compassionate Alert if any */}
      {student.plants.some((p) => p.health === "wilting") && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🥀</span>
            <div>
              <div className="font-bold text-sm text-amber-900">
                “Cây đang héo. Hãy cố gắng ở nhiệm vụ tiếp theo để chăm sóc nông trại nhé!”
              </div>
              <p className="text-xs text-amber-700 mt-0.5">
                Đừng lo lắng! Chỉ cần hoàn thành 1 câu trả lời đúng hoặc bấm tưới nước tri thức, cây sẽ hồi sinh xanh tốt ngay.
              </p>
            </div>
          </div>
          <button
            onClick={onNavigateToTasks}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs transition-all shrink-0"
          >
            Làm bài cứu cây ngay ➔
          </button>
        </div>
      )}

      {/* Farm Land Grid (6 Plots) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-extrabold text-xl text-stone-900 flex items-center gap-2">
              <span>🌾</span> Các Ô Đất Canh Tác Tri Thức
            </h2>
            <p className="text-xs text-stone-500">
              Chạm vào từng ô đất để xem chi tiết cây hoặc bấm thu hoạch khi cây có trái chín!
            </p>
          </div>

          <button
            id="btn-open-plant-modal"
            onClick={() => setShowSeedModal(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all hover:scale-105 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Gieo Hạt Mầm Mới
          </button>
        </div>

        {/* The 6-plot agricultural layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {student.plants.map((plant) => {
            const stageInfo = getStageDisplay(plant.stage, plant.health, plant.fruitCount);
            const isFruiting = plant.stage === "fruit" && plant.health === "healthy";
            const isWilting = plant.health === "wilting";

            return (
              <div
                key={plant.id}
                onClick={() => setSelectedPlant(plant)}
                className={`relative rounded-3xl p-5 border-2 transition-all cursor-pointer group hover:shadow-lg ${
                  isFruiting
                    ? "bg-gradient-to-b from-red-50/70 to-amber-50/70 border-red-300 shadow-md ring-2 ring-red-300/50"
                    : isWilting
                    ? "bg-amber-50/50 border-amber-300"
                    : "bg-white border-emerald-100 hover:border-emerald-300"
                }`}
              >
                {/* Subject badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-stone-100 text-stone-700 border border-stone-200">
                    {plant.subject}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${stageInfo.color}`}
                  >
                    {stageInfo.label}
                  </span>
                </div>

                {/* Big Plant Icon on Soil Mound */}
                <div className="my-4 flex flex-col items-center justify-center">
                  <div className="relative">
                    {/* Visual Growth Icon */}
                    <div className="text-6xl sm:text-7xl group-hover:scale-110 transition-transform duration-300 select-none drop-shadow-md">
                      {stageInfo.icon}
                    </div>

                    {/* Animated water droplets if watering */}
                    {isWilting && (
                      <div className="absolute -top-2 -right-2 bg-amber-400 text-stone-900 p-1 rounded-full shadow-xs text-xs animate-bounce" title="Cần tưới nước">
                        🍂
                      </div>
                    )}
                  </div>

                  {/* Soil base */}
                  <div className="w-24 h-3 bg-amber-800/20 rounded-full blur-[2px] mt-1" />
                </div>

                {/* Plant Name & Growth Progress */}
                <div className="text-center space-y-2">
                  <h3 className="font-bold text-sm text-stone-900 group-hover:text-emerald-800 transition-colors">
                    {plant.name}
                  </h3>

                  {/* Progress Bar */}
                  <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-200">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isWilting
                          ? "bg-amber-400"
                          : isFruiting
                          ? "bg-red-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${plant.growthProgress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                    <span>Độ lớn: {plant.growthProgress}%</span>
                    <span>Tích lũy: {plant.exp} EXP</span>
                  </div>
                </div>

                {/* Quick Action Button on Card */}
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-center">
                  {isFruiting ? (
                    <button
                      onClick={(e) => handleHarvestClick(e, plant)}
                      className="w-full py-2.5 bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all hover:scale-102"
                    >
                      <span>🧺</span> Thu Hoạch Ngay (+50 Xu & Quà)
                    </button>
                  ) : isWilting ? (
                    <button
                      onClick={(e) => handleWaterClick(e, plant)}
                      className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Droplets className="w-3.5 h-3.5" /> Tưới Nước Tri Thức
                    </button>
                  ) : (
                    <button
                      onClick={onNavigateToTasks}
                      className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1"
                    >
                      <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                      Làm bài để nuôi lớn
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Plant Inspection Modal */}
      {selectedPlant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 relative">
            <button
              onClick={() => setSelectedPlant(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 text-xl font-bold w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center"
            >
              ✕
            </button>

            <div className="text-center space-y-3">
              <div className="text-6xl drop-shadow-sm my-2">
                {getStageDisplay(selectedPlant.stage, selectedPlant.health, selectedPlant.fruitCount).icon}
              </div>

              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                Môn học: {selectedPlant.subject}
              </div>

              <h3 className="font-display font-black text-xl text-stone-900">
                {selectedPlant.name}
              </h3>

              <p className="text-xs text-stone-600 leading-relaxed">
                {getStageDisplay(selectedPlant.stage, selectedPlant.health, selectedPlant.fruitCount).message}
              </p>

              {/* Plant Stats */}
              <div className="grid grid-cols-2 gap-2 text-left pt-2">
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                  <div className="text-[10px] text-stone-400 font-semibold">Giai đoạn</div>
                  <div className="text-xs font-bold text-stone-800">
                    {getStageDisplay(selectedPlant.stage, selectedPlant.health).label}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                  <div className="text-[10px] text-stone-400 font-semibold">Tiến trình</div>
                  <div className="text-xs font-bold text-emerald-700">
                    {selectedPlant.growthProgress}% Trưởng thành
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                  <div className="text-[10px] text-stone-400 font-semibold">Kinh nghiệm</div>
                  <div className="text-xs font-bold text-amber-700">
                    +{selectedPlant.exp} EXP
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                  <div className="text-[10px] text-stone-400 font-semibold">Ngày gieo trồng</div>
                  <div className="text-xs font-bold text-stone-700">
                    {selectedPlant.plantedAt}
                  </div>
                </div>
              </div>

              {/* Action Buttons in Modal */}
              <div className="pt-4 space-y-2">
                {selectedPlant.stage === "fruit" && (
                  <button
                    onClick={(e) => {
                      handleHarvestClick(e, selectedPlant);
                      setSelectedPlant(null);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-red-500 to-amber-500 text-white font-black text-sm rounded-2xl shadow-md hover:scale-102 transition-all cursor-pointer"
                  >
                    🧺 Thu Hoạch Ngay!
                  </button>
                )}

                {selectedPlant.health === "wilting" && (
                  <button
                    onClick={(e) => {
                      handleWaterClick(e, selectedPlant);
                      setSelectedPlant(null);
                    }}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-2xl shadow-xs transition-all"
                  >
                    💧 Tưới Nước Hồi Sinh
                  </button>
                )}

                <button
                  onClick={() => {
                    setSelectedPlant(null);
                    onNavigateToTasks();
                  }}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-xs transition-all"
                >
                  🌱 Làm Nhiệm Vụ Để Cây Lớn Tiếp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Seed Selection Modal to Plant New Crop */}
      {showSeedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 relative">
            <button
              onClick={() => setShowSeedModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 text-xl font-bold w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center"
            >
              ✕
            </button>

            <div className="space-y-4">
              <div className="text-center">
                <span className="text-4xl">🌰</span>
                <h3 className="font-display font-black text-xl text-stone-900 mt-2">
                  Túi Hạt Giống Tri Thức
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Chọn một mầm cây em muốn gieo xuống nông trại của mình hôm nay!
                </p>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {seedOptions.map((opt) => (
                  <div
                    key={opt.name}
                    onClick={() => setSelectedSeedType(opt)}
                    className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                      selectedSeedType.name === opt.name
                        ? "bg-emerald-50 border-emerald-400 shadow-xs"
                        : "bg-white border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-stone-900">{opt.name}</div>
                      <div className="text-[11px] text-stone-500">{opt.desc}</div>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                      {opt.subject}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    onPlantNewSeed(
                      selectedSeedType.name,
                      selectedSeedType.subject,
                      selectedSeedType.icon
                    );
                    setShowSeedModal(false);
                    sound.playWater();
                  }}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all hover:scale-102 cursor-pointer"
                >
                  🌱 Gieo Hạt Ngay Vào Ô Đất Trống
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
