import React, { useState } from "react";
import { PlatformAd, UserProfile } from "../../../types";
import { DataStore, generateUniqueId } from "../../../lib/datastore";
import {
  Megaphone,
  Plus,
  Search,
  ExternalLink,
  Eye,
  MousePointerClick,
  DollarSign,
  Calendar,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles
} from "lucide-react";

interface AdsTabProps {
  onNotification: (msg: string) => void;
}

export const AdsTab: React.FC<AdsTabProps> = ({ onNotification }) => {
  const [ads, setAds] = useState<PlatformAd[]>(() => DataStore.getAds());
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [advertiserName, setAdvertiserName] = useState("");
  const [advertiserPhone, setAdvertiserPhone] = useState("");
  const [placement, setPlacement] = useState<PlatformAd["placement"]>("hero_banner");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [budgetSAR, setBudgetSAR] = useState(3000);
  const [startDate, setStartDate] = useState("2026-09-01");
  const [endDate, setEndDate] = useState("2026-09-30");

  const totalRevenue = ads.reduce((acc, ad) => acc + (ad.budgetSAR || 0), 0);
  const totalImpressions = ads.reduce((acc, ad) => acc + (ad.impressionsCount || 0), 0);
  const totalClicks = ads.reduce((acc, ad) => acc + (ad.clicksCount || 0), 0);

  const handleAddAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !advertiserName) return;

    const newAd: PlatformAd = {
      id: generateUniqueId("AD"),
      title,
      advertiserName,
      advertiserPhone: advertiserPhone || "0500000000",
      placement,
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      linkUrl: linkUrl || "https://example.com",
      startDate,
      endDate,
      budgetSAR: Number(budgetSAR),
      impressionsCount: 0,
      clicksCount: 0,
      status: "active",
      createdAt: new Date().toISOString()
    };

    DataStore.saveAd(newAd);
    setAds(DataStore.getAds());
    setShowAddModal(false);
    setTitle("");
    setAdvertiserName("");
    setImageUrl("");
    onNotification(`تم تدشين الحملة الإعلانية [${newAd.title}] بنجاح`);
  };

  const handleDeleteAd = (id: string, title: string) => {
    if (confirm(`هل أنت متأكد من حذف الحملة الإعلانية: ${title}؟`)) {
      DataStore.deleteAd(id);
      setAds(DataStore.getAds());
      onNotification(`تم حذف الحملة الإعلانية بنجاح`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-stone-950/70 border border-stone-800">
        <div>
          <h3 className="text-base font-bold text-white font-['Amiri'] flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-emerald-400" />
            <span>إدارة الإعلانات التجارية والرعايات الترويجية</span>
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            إدارة البنرات الإعلانية، تتبع نسب الظهور والنقر (CTR)، والمردود المالي
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة حملة إعلانية جديدة</span>
        </button>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-400 block mb-1">إجمالي عوائد الإعلانات</span>
            <h4 className="text-lg font-bold text-emerald-400 font-mono">{totalRevenue.toLocaleString()} ر.س</h4>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-400 block mb-1">إجمالي مرات الظهور</span>
            <h4 className="text-lg font-bold text-white font-mono">{totalImpressions.toLocaleString()}</h4>
          </div>
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
            <Eye className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-400 block mb-1">إجمالي النقرات (Clicks)</span>
            <h4 className="text-lg font-bold text-amber-400 font-mono">{totalClicks.toLocaleString()}</h4>
          </div>
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400">
            <MousePointerClick className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Ads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ads.map(ad => {
          const ctr = ad.impressionsCount ? ((ad.clicksCount / ad.impressionsCount) * 100).toFixed(1) : "0";
          return (
            <div
              key={ad.id}
              className="bg-stone-900/80 border border-stone-800 rounded-3xl overflow-hidden hover:border-stone-700 transition-all flex flex-col justify-between"
            >
              {ad.imageUrl && (
                <div className="relative h-40 w-full bg-stone-950 overflow-hidden">
                  <img
                    src={ad.imageUrl}
                    alt={ad.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500 text-stone-950">
                    {ad.status === "active" ? "حملة نشطة" : "موقوفة"}
                  </span>
                  <span className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-950/80 text-amber-300 border border-stone-700 font-mono">
                    {ad.placement}
                  </span>
                </div>
              )}

              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
                    <span>المعلن: <strong className="text-stone-200">{ad.advertiserName}</strong></span>
                    <span className="font-mono text-emerald-400 font-bold">{ad.budgetSAR.toLocaleString()} ر.س</span>
                  </div>
                  <h4 className="text-base font-bold text-white font-['Amiri']">{ad.title}</h4>
                </div>

                {/* Metrics Breakdown */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-stone-950/60 border border-stone-800 text-center text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-stone-500 block">الظهور</span>
                    <span className="text-stone-200 font-bold">{ad.impressionsCount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">النقرات</span>
                    <span className="text-amber-400 font-bold">{ad.clicksCount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">CTR</span>
                    <span className="text-emerald-400 font-bold">{ctr}%</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
                  <span className="text-[11px] font-mono">{ad.startDate} إلى {ad.endDate}</span>
                  <button
                    onClick={() => handleDeleteAd(ad.id, ad.title)}
                    className="p-1.5 text-stone-500 hover:text-rose-400 rounded-lg"
                    title="حذف الإعلان"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD AD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-stone-900 border border-stone-700 rounded-3xl p-6 shadow-2xl space-y-4 text-xs">
            <h4 className="text-base font-bold text-white font-['Amiri'] flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-emerald-400" />
              <span>إضافة وتدشين حملة إعلانية</span>
            </h4>

            <form onSubmit={handleAddAd} className="space-y-3">
              <div>
                <label className="block text-stone-300 mb-1 font-medium">عنوان الإعلان</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: منتجع السحاب الفندقي..."
                  className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">اسم المعلن / الشركة</label>
                  <input
                    type="text"
                    required
                    value={advertiserName}
                    onChange={(e) => setAdvertiserName(e.target.value)}
                    placeholder="مجموعة السراة..."
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">رقم التواصل</label>
                  <input
                    type="tel"
                    value={advertiserPhone}
                    onChange={(e) => setAdvertiserPhone(e.target.value)}
                    placeholder="0500000000"
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">الموضع</label>
                  <select
                    value={placement}
                    onChange={(e) => setPlacement(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white"
                  >
                    <option value="hero_banner">بنر الواجهة الرئيسية (Hero)</option>
                    <option value="featured_strip">شريط المنتجات المميزة</option>
                    <option value="sidebar">القائمة الجانبية</option>
                    <option value="popup">نافذة منبثقة</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">الميزانية (ر.س)</label>
                  <input
                    type="number"
                    value={budgetSAR}
                    onChange={(e) => setBudgetSAR(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-medium">رابط الصورة (Image URL)</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-medium">رابط التوجيه (Link URL)</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  تفعيل الحملة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
