import React, { useState } from "react";
import { BusinessLeaderSponsorship, UserProfile } from "../../../types";
import { DataStore, generateUniqueId } from "../../../lib/datastore";
import {
  Award,
  Plus,
  Search,
  Crown,
  DollarSign,
  Building,
  Mail,
  Phone,
  Sparkles,
  CheckCircle2,
  HeartHandshake,
  Layers
} from "lucide-react";

interface BusinessmenTabProps {
  onNotification: (msg: string) => void;
}

export const BusinessmenTab: React.FC<BusinessmenTabProps> = ({ onNotification }) => {
  const [businessmen, setBusinessmen] = useState<BusinessLeaderSponsorship[]>(() => DataStore.getBusinessSponsorships());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTier, setSelectedTier] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [honorificTitle, setHonorificTitle] = useState("الشيخ رجل الأعمال");
  const [companyOrAffiliation, setCompanyOrAffiliation] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [tier, setTier] = useState<BusinessLeaderSponsorship["tier"]>("platinum");
  const [annualContributionSAR, setAnnualContributionSAR] = useState(100000);
  const [initiativesText, setInitiativesText] = useState("ترميم الحصون التراثية، رعاية المتفوقين");
  const [quote, setQuote] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const totalContributions = businessmen.reduce((acc, b) => acc + (b.annualContributionSAR || 0), 0);

  const filtered = businessmen.filter(b => {
    const matchSearch = b.name.includes(searchTerm) || b.companyOrAffiliation.includes(searchTerm);
    const matchTier = selectedTier === "all" || b.tier === selectedTier;
    return matchSearch && matchTier;
  });

  const handleAddBusinessman = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !companyOrAffiliation) return;

    const newLeader: BusinessLeaderSponsorship = {
      id: generateUniqueId("BIZ"),
      name,
      honorificTitle,
      companyOrAffiliation,
      phone: phone || "0500000000",
      email: email || "contact@example.sa",
      tier,
      annualContributionSAR: Number(annualContributionSAR),
      sponsoredInitiatives: initiativesText.split("،").map(s => s.trim()).filter(Boolean),
      avatarUrl: avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80",
      quote: quote || "فخورون بخدمة تراث وأبناء قبائل بني شهر.",
      status: "active",
      joinedDate: new Date().toISOString().split("T")[0]
    };

    DataStore.saveBusinessSponsorship(newLeader);
    setBusinessmen(DataStore.getBusinessSponsorships());
    setShowAddModal(false);
    setName("");
    setCompanyOrAffiliation("");
    onNotification(`تم تسجيل رعاية [${newLeader.name}] في باقة [${newLeader.tier}] بنجاح`);
  };

  const getTierBadge = (tier: BusinessLeaderSponsorship["tier"]) => {
    switch (tier) {
      case "platinum":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1"><Crown className="w-3 h-3 text-purple-400" /> الراعي البلاتيني</span>;
      case "gold":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1"><Crown className="w-3 h-3 text-amber-400" /> الراعي الذهبي</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-stone-500/20 text-stone-300 border border-stone-500/30 flex items-center gap-1"><Award className="w-3 h-3 text-stone-400" /> الراعي الفضي</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-stone-950/70 border border-stone-800">
        <div>
          <h3 className="text-base font-bold text-white font-['Amiri'] flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-amber-400" />
            <span>إدارة رجال الأعمال ورعاة المبادرات المجتمعية</span>
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            توثيق اشتراكات كبار الشخصيات، حزم الرعاية السنوية، والمبادرات التراثية المدعومة
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-500 hover:to-emerald-500 text-white font-bold text-xs shadow-lg shadow-amber-950/40 flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>تسجيل رعاية رجل أعمال</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-400 block mb-1">إجمالي التبرعات والرعايات</span>
            <h4 className="text-lg font-bold text-amber-400 font-mono">{totalContributions.toLocaleString()} ر.س / سنوياً</h4>
          </div>
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-400 block mb-1">عدد كبار الرعاة</span>
            <h4 className="text-lg font-bold text-white font-mono">{businessmen.length} شخصيات</h4>
          </div>
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400">
            <Crown className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-400 block mb-1">المبادرات المدعومة</span>
            <h4 className="text-lg font-bold text-emerald-400 font-mono">14 مبادرة نشطة</h4>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="البحث باسم رجل الأعمال، المؤسسة، أو المبادرة..."
            className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-stone-900 border border-stone-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-2xl border border-stone-800 text-xs">
          {["all", "platinum", "gold", "silver"].map(t => (
            <button
              key={t}
              onClick={() => setSelectedTier(t)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                selectedTier === t ? "bg-amber-600 text-white" : "text-stone-400 hover:text-white"
              }`}
            >
              {t === "all" ? "الكل" : t === "platinum" ? "بلاتيني" : t === "gold" ? "ذهبي" : "فضي"}
            </button>
          ))}
        </div>
      </div>

      {/* Businessmen Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(item => (
          <div
            key={item.id}
            className="bg-stone-900/80 border border-stone-800 rounded-3xl p-5 hover:border-stone-700 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={item.avatarUrl}
                    alt={item.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-amber-500/30"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="text-[10px] text-amber-400 font-bold block">{item.honorificTitle}</span>
                    <h4 className="text-sm font-bold text-white font-['Amiri']">{item.name}</h4>
                  </div>
                </div>

                {getTierBadge(item.tier)}
              </div>

              <p className="text-xs text-stone-400 font-medium mb-3 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <span>{item.companyOrAffiliation}</span>
              </p>

              {/* Contribution Amount */}
              <div className="p-3 rounded-2xl bg-stone-950/60 border border-stone-800/80 flex items-center justify-between text-xs font-mono mb-3">
                <span className="text-stone-400">المساهمة السنوية:</span>
                <span className="text-emerald-400 font-bold">{item.annualContributionSAR.toLocaleString()} ر.س</span>
              </div>

              {/* Sponsored Initiatives */}
              <div>
                <span className="text-[10px] text-stone-400 block mb-1.5 font-medium">المبادرات المدعومة:</span>
                <div className="flex flex-wrap gap-1">
                  {item.sponsoredInitiatives.map((init, iIdx) => (
                    <span key={iIdx} className="px-2 py-0.5 rounded-md bg-stone-800 text-[10px] text-stone-300 border border-stone-700/60">
                      ✨ {init}
                    </span>
                  ))}
                </div>
              </div>

              {item.quote && (
                <p className="mt-3 text-[11px] text-stone-400 italic bg-amber-500/5 p-2.5 rounded-xl border border-amber-500/10">
                  "{item.quote}"
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-500">
              <span>انضم: {item.joinedDate}</span>
              <span className="text-emerald-400 font-bold">عضو شرفي فاعل</span>
            </div>
          </div>
        ))}
      </div>

      {/* ADD BUSINESSMAN MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-stone-900 border border-stone-700 rounded-3xl p-6 shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <h4 className="text-base font-bold text-white font-['Amiri'] flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-amber-400" />
              <span>تسجيل رعاية رجل أعمال أو جهة داعمة</span>
            </h4>

            <form onSubmit={handleAddBusinessman} className="space-y-3">
              <div>
                <label className="block text-stone-300 mb-1 font-medium">اللقب الشرفي والاسم</label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={honorificTitle}
                    onChange={(e) => setHonorificTitle(e.target.value)}
                    placeholder="الشيخ / رجل الأعمال"
                    className="col-span-1 px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white"
                  />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="الاسم الثلاثي..."
                    className="col-span-2 px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-medium">الشركة أو الجهة التابعة</label>
                <input
                  type="text"
                  required
                  value={companyOrAffiliation}
                  onChange={(e) => setCompanyOrAffiliation(e.target.value)}
                  placeholder="مجموعة ... القابضة"
                  className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">باقة الرعاية</label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white"
                  >
                    <option value="platinum">الراعي البلاتيني (150,000+ ر.س)</option>
                    <option value="gold">الراعي الذهبي (75,000+ ر.س)</option>
                    <option value="silver">الراعي الفضي (35,000+ ر.س)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">المساهمة السنوية (ر.س)</label>
                  <input
                    type="number"
                    value={annualContributionSAR}
                    onChange={(e) => setAnnualContributionSAR(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-medium">المبادرات المدعومة (مفصولة بفاصلة)</label>
                <input
                  type="text"
                  value={initiativesText}
                  onChange={(e) => setInitiativesText(e.target.value)}
                  placeholder="ترميم حصن العقيقة، دعم صندوق التميز"
                  className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-medium">كلمة / رسالة الداعم للمجتمع</label>
                <textarea
                  rows={2}
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="رسالة تقدير وتشجيع لأهالي المنطقة..."
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
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold"
                >
                  اعتماد وتوثيق
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
