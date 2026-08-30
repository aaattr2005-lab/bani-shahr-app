import React, { useState } from "react";
import { UserProfile, Village, AuditLog } from "../../types";
import { DataStore } from "../../lib/datastore";
import { 
  Building, 
  ShieldCheck, 
  Key, 
  Calendar, 
  Plus, 
  Edit3, 
  Save, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  History, 
  AlertCircle,
  FileText,
  MapPin,
  Sparkles,
  Award,
  ChevronLeft,
  XCircle,
  Tag,
  GitBranch,
  FileCheck2
} from "lucide-react";
import { LineageRequestsTab } from "../admin/tabs/LineageRequestsTab";
import { NewsAndEventsTab } from "../admin/tabs/NewsAndEventsTab";
import { StoriesModerationTab } from "../admin/tabs/StoriesModerationTab";

interface VillageSupervisorDashboardProps {
  currentUser: UserProfile;
}

export const VillageSupervisorDashboard: React.FC<VillageSupervisorDashboardProps> = ({
  currentUser,
}) => {
  const villages = DataStore.getVillages();
  
  // Find assigned village or fallback to Al-Aqiqah / Al-Madanah
  const initialVillage = villages.find(v => 
    v.id === currentUser.assignedVillageId || 
    (currentUser.supervisorCode && v.supervisorCode === currentUser.supervisorCode) ||
    v.name.includes("العقيقة")
  ) || villages[0];

  const [currentVillage, setCurrentVillage] = useState<Village>(initialVillage);
  const [activeSubTab, setActiveSubTab] = useState<
    "overview" | "lineage" | "stories" | "news" | "castles" | "services" | "subscription" | "history"
  >("overview");

  // Form states for village overview
  const [historyText, setHistoryText] = useState(currentVillage.historyAndCastles || "");
  const [lineageText, setLineageText] = useState(currentVillage.lineageAndHistory || "");
  const [famousForText, setFamousForText] = useState(currentVillage.famousFor.join("، "));
  const [elevation, setElevation] = useState(currentVillage.elevation || "2,450 م");

  // News creation state
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");
  const [newsList, setNewsList] = useState<{ id: string; title: string; date: string; description: string }[]>(
    currentVillage.newsAndEvents || [
      {
        id: "ev-1",
        title: "موسم حصاد البُر والعسل السنوي في الحقول التراثية",
        date: "2026-09-10",
        description: "انطلاق فعاليات حصاد القمح البلدي في المدرجات الزراعية بمشاركة أهالي القرية والزوار."
      },
      {
        id: "ev-2",
        title: "افتتاح المسار التراثي المضاء لحصن القرية الشمالي",
        date: "2026-08-30",
        description: "استكمال المرحلة الأولى لإنارة الحصن التاريخي وتوفير مسار آمن للزوار والمصورين."
      }
    ]
  );

  // Local Services state
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceType, setNewServiceType] = useState("");
  const [newServicePhone, setNewServicePhone] = useState("");
  const [servicesList, setServicesList] = useState<{ name: string; type: string; phone: string }[]>(
    currentVillage.localServices || [
      { name: "مطل ونزل الحصن التراثي", type: "ضيافة واستراحة", phone: "0505123456" },
      { name: "مناحل السراة لإنتاج العسل الشهري", type: "منتجات بلدية", phone: "0559876543" },
      { name: "ورشة صناعة الأدوات التراثية والفضيات", type: "حرف يدوية", phone: "0543219876" }
    ]
  );

  // Subscription renew modal state
  const [isRenewOpen, setIsRenewOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"annual" | "monthly">("annual");
  const [paymentMethod, setPaymentMethod] = useState("apple_pay");
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const handleSaveVillageContent = () => {
    const updatedVillage: Village = {
      ...currentVillage,
      historyAndCastles: historyText,
      lineageAndHistory: lineageText,
      elevation,
      famousFor: famousForText.split("،").map(s => s.trim()).filter(Boolean),
      newsAndEvents: newsList,
      localServices: servicesList,
      lastModifiedBy: currentUser.name,
      lastModifiedAt: new Date().toISOString()
    };

    DataStore.saveVillage(updatedVillage);
    setCurrentVillage(updatedVillage);
    showNotification(`تم حفظ وتحديث محتوى ${updatedVillage.name} وتوثيق العملية في سجل التدقيق.`);
  };

  const handleAddNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle) return;
    const newEntry = {
      id: "ev-" + Date.now().toString().slice(-4),
      title: newEventTitle,
      date: newEventDate || new Date().toISOString().split("T")[0],
      description: newEventDescription
    };
    const updated = [newEntry, ...newsList];
    setNewsList(updated);
    setNewEventTitle("");
    setNewEventDate("");
    setNewEventDescription("");
    
    // Save to village
    const updatedVillage: Village = {
      ...currentVillage,
      newsAndEvents: updated,
      lastModifiedBy: currentUser.name,
      lastModifiedAt: new Date().toISOString()
    };
    DataStore.saveVillage(updatedVillage);
    setCurrentVillage(updatedVillage);
    showNotification("تم نشر الخبر / الفعالية بنجاح");
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName) return;
    const updated = [{ name: newServiceName, type: newServiceType || "خدمة محلية", phone: newServicePhone }, ...servicesList];
    setServicesList(updated);
    setNewServiceName("");
    setNewServiceType("");
    setNewServicePhone("");

    const updatedVillage: Village = {
      ...currentVillage,
      localServices: updated,
      lastModifiedBy: currentUser.name,
      lastModifiedAt: new Date().toISOString()
    };
    DataStore.saveVillage(updatedVillage);
    setCurrentVillage(updatedVillage);
    showNotification("تمت إضافة الخدمة المحلية إلى دليل القرية");
  };

  const handleRenewSubscription = () => {
    DataStore.renewVillageSubscription(currentVillage.id, selectedPlan, paymentMethod);
    const updatedVillages = DataStore.getVillages();
    const refreshed = updatedVillages.find(v => v.id === currentVillage.id) || currentVillage;
    setCurrentVillage(refreshed);
    setIsRenewOpen(false);
    showNotification(`تم تجديد الاشتراك ${selectedPlan === "annual" ? "السنوي Pro" : "الشهري"} بنجاح.`);
  };

  const auditLogs = DataStore.getAuditLogs().filter(log => 
    (log.villageScope && log.villageScope.includes(currentVillage.name)) || log.userId === currentUser.id
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {feedbackMsg && (
        <div className="p-3 bg-emerald-950 border border-emerald-500/50 rounded-2xl text-emerald-300 text-xs flex items-center justify-between shadow-xl animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="text-emerald-400 hover:text-white">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Supervisor Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-amber-950/80 via-stone-900 to-stone-950 border border-amber-500/30 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                حساب مشرف قرية معتمد
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-stone-800 text-stone-300 font-mono">
                كود الدخول: {currentVillage.supervisorCode || currentUser.supervisorCode || "AQIQAH-77"}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white font-['Amiri'] pt-1">
              {currentVillage.name}
            </h3>
            <p className="text-xs text-stone-400">
              المشرف المسؤول: <span className="text-amber-300 font-bold">{currentUser.name}</span> | النطاق: <span className="text-stone-300">{currentVillage.region} - {currentVillage.tribalBranch}</span>
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className={`text-xs px-3 py-1 rounded-full font-bold border ${
              currentVillage.subscriptionTier === "pro_annual"
                ? "bg-amber-950 text-amber-300 border-amber-600 shadow-md shadow-amber-950"
                : "bg-teal-950 text-teal-300 border-teal-700"
            }`}>
              {currentVillage.subscriptionTier === "pro_annual" ? "اشتراك سنوي Pro نشط" : "اشتراك شهري نشط"}
            </span>
            <button
              onClick={() => setIsRenewOpen(true)}
              className="px-3 py-1 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-black text-xs transition-all shadow-md flex items-center gap-1"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>تجديد الاشتراك</span>
            </button>
          </div>
        </div>

        {/* Security and Scoping Notice */}
        <div className="p-3 rounded-2xl bg-stone-950/80 border border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
          <div className="flex items-center gap-2 text-stone-300">
            <Key className="w-4 h-4 text-amber-400 shrink-0" />
            <span>صلاحياتك محددة حصراً في نطاق <strong>{currentVillage.name}</strong>، ويتم توثيق كل تعديل فوراً في سجل الأمان.</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold">نظام التدقيق مفعل</span>
        </div>
      </div>

      {/* Supervisor Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-800 scrollbar-none">
        {[
          { id: "overview", label: "بيانات وتاريخ القرية", icon: Building },
          { id: "stories", label: "اعتماد قصص وذاكرة القبيلة", icon: FileText },
          { id: "lineage", label: "مراجعة طلبات النسب للقبيلة", icon: FileCheck2 },
          { id: "news", label: "أخبار ومناسبات القبيلة", icon: Calendar },
          { id: "castles", label: "الحصون والقصبات", icon: Award },
          { id: "services", label: "الدليل والخدمات المحلية", icon: Tag },
          { id: "history", label: "سجل تعديلات المشرف", icon: History },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? "bg-amber-600 text-stone-950 shadow-md font-black"
                  : "bg-stone-950 text-stone-400 hover:text-stone-200 hover:bg-stone-800"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* STORIES MODERATION (SCOPED TO SUPERVISOR) */}
      {activeSubTab === "stories" && (
        <StoriesModerationTab currentUser={currentUser} onNotification={showNotification} />
      )}

      {/* LINEAGE REQUESTS (SCOPED TO TRIBE) */}
      {activeSubTab === "lineage" && (
        <LineageRequestsTab currentUser={currentUser} onNotification={showNotification} />
      )}

      {/* NEWS AND EVENTS (SCOPED TO TRIBE) */}
      {activeSubTab === "news" && (
        <NewsAndEventsTab currentUser={currentUser} onNotification={showNotification} />
      )}

      {/* SUB-TAB 1: VILLAGE OVERVIEW & HISTORY */}
      {activeSubTab === "overview" && (
        <div className="p-5 rounded-3xl bg-stone-950 border border-stone-800 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-amber-400" />
              <span>تحديث وتوثيق المعلومات التاريخية والجغرافية</span>
            </h4>
            <button
              onClick={handleSaveVillageContent}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg"
            >
              <Save className="w-3.5 h-3.5" />
              <span>حفظ ونشر التعديلات</span>
            </button>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-stone-400 block mb-1">الارتفاع عن سطح البحر</label>
                <input
                  type="text"
                  value={elevation}
                  onChange={e => setElevation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-stone-400 block mb-1">أبرز ما تشتهر به القرية (مفصولة بفاصلة)</label>
                <input
                  type="text"
                  value={famousForText}
                  onChange={e => setFamousForText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-stone-400 block mb-1">تاريخ وحصون القرية</label>
              <textarea
                rows={4}
                value={historyText}
                onChange={e => setHistoryText(e.target.value)}
                placeholder="اكتب تاريخ القرية، حصونها وقصباتها، وتفاصيل العمارة الحجرية القديمة..."
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-white leading-relaxed"
              />
            </div>

            <div>
              <label className="text-stone-400 block mb-1">النسب والتاريخ التراثي للقرية</label>
              <textarea
                rows={3}
                value={lineageText}
                onChange={e => setLineageText(e.target.value)}
                placeholder="وثق نسب القرية وأعلامها والشواهد التاريخية المعتمدة..."
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-white leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: CASTLES & FORTS */}
      {activeSubTab === "castles" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-white">حصون وقصبات {currentVillage.name}</h4>
              <p className="text-[11px] text-stone-400">إجمالي الحصون المعتمدة: {currentVillage.castlesCount || 2} حصون تاريخية</p>
            </div>
            <span className="text-[11px] text-emerald-400 font-bold">موثقة ومدرجة في خريطة المنصة</span>
          </div>

          <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
            <h5 className="text-xs font-bold text-amber-300">تقرير حالة الحصون والقصبات</h5>
            <p className="text-xs text-stone-300 leading-relaxed">
              {currentVillage.historyAndCastles || "تتميز القرية بحصونها الحجرية المتينة وتيجان المرو الأبيض الدفاعية ومخازن الحبوب والأسلحة."}
            </p>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: NEWS & EVENTS */}
      {activeSubTab === "news" && (
        <div className="space-y-4">
          {/* Add News Form */}
          <form onSubmit={handleAddNews} className="p-5 rounded-3xl bg-stone-950 border border-stone-800 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>إضافة خبر أو فعالية جديدة للقرية</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="عنوان الخبر أو الفعالية..."
                  value={newEventTitle}
                  onChange={e => setNewEventTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-white"
                  required
                />
              </div>

              <div>
                <input
                  type="date"
                  value={newEventDate}
                  onChange={e => setNewEventDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-white font-mono"
                />
              </div>
            </div>

            <textarea
              rows={2}
              placeholder="تفاصيل الخبر وموقع الفعالية والأنشطة المقامة..."
              value={newEventDescription}
              onChange={e => setNewEventDescription(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white"
            />

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>نشر الفعالية للزوار</span>
            </button>
          </form>

          {/* News List */}
          <div className="space-y-3">
            {newsList.map(item => (
              <div key={item.id} className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-white">{item.title}</h5>
                  <span className="text-[10px] text-amber-400 font-mono">{item.date}</span>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: LOCAL SERVICES */}
      {activeSubTab === "services" && (
        <div className="space-y-4">
          {/* Add Service Form */}
          <form onSubmit={handleAddService} className="p-5 rounded-3xl bg-stone-950 border border-stone-800 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-teal-400" />
              <span>إضافة خدمة محلية أو نزل أو حرفي إلى دليل القرية</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <input
                type="text"
                placeholder="اسم الخدمة / النزل / الحرفي..."
                value={newServiceName}
                onChange={e => setNewServiceName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-white"
                required
              />

              <input
                type="text"
                placeholder="نوع الخدمة (ضيافة، عسل، مأكولات)..."
                value={newServiceType}
                onChange={e => setNewServiceType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-white"
              />

              <input
                type="tel"
                placeholder="رقم التواصل (05XXXXXXXX)..."
                value={newServicePhone}
                onChange={e => setNewServicePhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-white font-mono"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة للدليل المعتمد</span>
            </button>
          </form>

          {/* Services List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {servicesList.map((svc, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 space-y-1">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-white">{svc.name}</h5>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-900 text-teal-300 border border-stone-800">
                    {svc.type}
                  </span>
                </div>
                <p className="text-[11px] font-mono text-stone-400">هاتف: {svc.phone}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: AUDIT LOGS FOR THIS VILLAGE */}
      {activeSubTab === "history" && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white flex items-center gap-2">
            <History className="w-4 h-4 text-amber-400" />
            <span>سجل العمليات والتعديلات الخاصة بـ {currentVillage.name}</span>
          </h4>

          <div className="space-y-2">
            {auditLogs.map(log => (
              <div key={log.id} className="p-3 rounded-2xl bg-stone-950 border border-stone-800 text-xs space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-amber-300">[{log.actionType}] {log.userName}</span>
                  <span className="text-stone-500 font-mono">{new Date(log.timestamp).toLocaleString("ar-SA")}</span>
                </div>
                <p className="text-stone-300">{log.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Renewal Modal */}
      {isRenewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-stone-900 border border-stone-700 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h4 className="text-sm font-bold text-white font-['Amiri']">تجديد اشتراك القرية</h4>
              <button onClick={() => setIsRenewOpen(false)} className="text-stone-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-2">
                <label className="text-stone-300 block font-bold">اختر خطة الاشتراك:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPlan("annual")}
                    className={`p-3 rounded-2xl border text-right space-y-1 transition-all ${
                      selectedPlan === "annual"
                        ? "bg-amber-950/80 border-amber-500 text-amber-300"
                        : "bg-stone-950 border-stone-800 text-stone-400"
                    }`}
                  >
                    <span className="block font-bold text-white">سنوي Pro</span>
                    <span className="font-mono text-amber-400 font-bold block text-sm">1,400 ريال</span>
                    <span className="text-[10px] text-stone-400">وفر شهرين مجاناً</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPlan("monthly")}
                    className={`p-3 rounded-2xl border text-right space-y-1 transition-all ${
                      selectedPlan === "monthly"
                        ? "bg-teal-950/80 border-teal-500 text-teal-300"
                        : "bg-stone-950 border-stone-800 text-stone-400"
                    }`}
                  >
                    <span className="block font-bold text-white">شهري Basic</span>
                    <span className="font-mono text-teal-400 font-bold block text-sm">150 ريال</span>
                    <span className="text-[10px] text-stone-400">تجديد تلقائي</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-stone-400 block">وسيلة الدفع:</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white"
                >
                  <option value="apple_pay">Apple Pay</option>
                  <option value="mada">بطاقة مدى البنكية (Mada)</option>
                  <option value="visa">فيزا / ماستركارد</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleRenewSubscription}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 font-black text-xs shadow-lg hover:from-amber-500 hover:to-amber-400 transition-all flex items-center justify-center gap-2 mt-3"
              >
                <CreditCard className="w-4 h-4" />
                <span>إتمام عملية الدفع وتفعيل الاشتراك</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
