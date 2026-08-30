import React, { useState } from "react";
import { MemoryItem, UserProfile } from "../../../types";
import { DataStore } from "../../../lib/datastore";
import { 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  MapPin, 
  User, 
  ShieldCheck, 
  FileText, 
  Eye, 
  Heart, 
  Share2,
  AlertTriangle,
  Layers,
  Sparkles
} from "lucide-react";

interface StoriesModerationTabProps {
  currentUser: UserProfile;
  onNotification: (msg: string) => void;
}

export const StoriesModerationTab: React.FC<StoriesModerationTabProps> = ({
  currentUser,
  onNotification
}) => {
  const [memories, setMemories] = useState<MemoryItem[]>(() => DataStore.getMemories(true));
  const [filterStatus, setFilterStatus] = useState<"all" | "pending_review" | "published" | "rejected">("pending_review");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  // If user is a tribe supervisor, default filter to their tribe if desired
  const isSupervisor = currentUser.role === "village_supervisor" || currentUser.role === "tribe_supervisor";
  const supervisorTribeName = currentUser.assignedVillageName || "";

  const refreshMemories = () => {
    setMemories(DataStore.getMemories(true));
  };

  const handleApprove = (id: string, title: string) => {
    DataStore.moderateMemory(id, "published");
    refreshMemories();
    onNotification(`✓ تم اعتماد ونشر قصة "${title}" في ذاكرة بني شهر بنجاح!`);
  };

  const handleRejectSubmit = () => {
    if (!selectedMemory) return;
    DataStore.moderateMemory(selectedMemory.id, "rejected", rejectReason.trim());
    refreshMemories();
    onNotification(`تم رفض قصة "${selectedMemory.title}" وتحديث حالتها.`);
    setShowRejectModal(false);
    setSelectedMemory(null);
    setRejectReason("");
  };

  const filtered = memories.filter((m) => {
    const matchesSearch = 
      m.title.includes(searchTerm) ||
      m.tribeBranch.includes(searchTerm) ||
      m.contributorName.includes(searchTerm) ||
      m.narratorName.includes(searchTerm) ||
      m.content.includes(searchTerm);

    if (!matchesSearch) return false;

    if (filterStatus === "all") return true;
    return m.status === filterStatus;
  });

  const pendingCount = memories.filter(m => m.status === "pending_review").length;

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="text-xl font-bold font-['Amiri'] text-white">
              إدارة واعتماد قصص وذاكرة بني شهر
            </h3>
            {pendingCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold animate-pulse">
                {pendingCount} بانتظار الاعتماد
              </span>
            )}
          </div>
          <p className="text-xs text-stone-300 max-w-2xl">
            مراجعة القصص والروايات التراثية المرسلة من الرواة وأبناء القبائل، والتحقق منها قبل نشرها في دليل وشجرة القبائل وقسم ذاكرة بني شهر.
          </p>
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {[
            { id: "pending_review", label: `قيد المراجعة (${pendingCount})`, icon: Clock, color: "text-amber-400" },
            { id: "published", label: "المعتمدة والمنشورة", icon: CheckCircle2, color: "text-emerald-400" },
            { id: "rejected", label: "المرفوضة", icon: XCircle, color: "text-rose-400" },
            { id: "all", label: "كافة السجلات", icon: Layers, color: "text-stone-300" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                filterStatus === tab.id
                  ? "bg-amber-600 text-white shadow-md"
                  : "bg-stone-800 text-stone-300 hover:bg-stone-700"
              }`}
            >
              <tab.icon className={`w-3.5 h-3.5 ${filterStatus === tab.id ? "text-white" : tab.color}`} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-stone-400 absolute right-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="ابحث بالعنوان، القبيلة، اسم الراوي أو الموثق..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-4 pr-11 py-3 rounded-2xl bg-stone-900 border border-stone-800 text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Stories List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-stone-900/60 rounded-3xl border border-stone-800 space-y-3">
          <BookOpen className="w-10 h-10 text-stone-500 mx-auto" />
          <h4 className="text-base font-bold text-stone-300">لا توجد قصص مطابقة</h4>
          <p className="text-xs text-stone-500">لا توجد سجلات حالياً في هذا التصنيف المحدد.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-5 sm:p-6 rounded-3xl bg-stone-900 border border-stone-800 hover:border-stone-700 space-y-4 transition-all shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-lg bg-amber-950/80 border border-amber-800/60 text-amber-300 text-xs font-bold">
                      {item.tribeBranch}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-stone-800 text-stone-300 text-[11px]">
                      {item.category}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold ${
                      item.status === "published"
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                        : item.status === "rejected"
                        ? "bg-rose-950 text-rose-300 border border-rose-800"
                        : "bg-amber-950 text-amber-300 border border-amber-800"
                    }`}>
                      {item.status === "published" ? "منشورة ومعتمدة ✓" : item.status === "rejected" ? "مرفوضة ✕" : "بانتظار المراجعة ⏳"}
                    </span>
                  </div>

                  <h4 className="text-lg sm:text-xl font-bold font-['Amiri'] text-white">
                    {item.title}
                  </h4>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {item.status !== "published" && (
                    <button
                      onClick={() => handleApprove(item.id, item.title)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>اعتماد ونشر</span>
                    </button>
                  )}

                  {item.status !== "rejected" && (
                    <button
                      onClick={() => {
                        setSelectedMemory(item);
                        setShowRejectModal(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-800 text-rose-300 border border-rose-800 text-xs font-bold transition-all"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>رفض</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Story Content Snippet */}
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed bg-stone-950/60 p-4 rounded-2xl border border-stone-800/80">
                {item.content}
              </p>

              {/* Metadata Info Footer */}
              <div className="pt-2 border-t border-stone-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-stone-400">
                <div>الراوي: <strong className="text-stone-200">{item.narratorName}</strong></div>
                <div>الموثق: <strong className="text-stone-200">{item.contributorName}</strong></div>
                <div>الموقع: <strong className="text-stone-200">{item.villageOrLocation}</strong></div>
                <div>التاريخ: <strong className="text-stone-200">{new Date(item.createdAt).toLocaleDateString("ar-SA")}</strong></div>
              </div>

              {item.moderationNotes && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-900/60 text-xs text-rose-300">
                  <strong>ملاحظات المراجعة:</strong> {item.moderationNotes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedMemory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h4 className="text-lg font-bold font-['Amiri'] text-rose-400">
              رفض قصة: {selectedMemory.title}
            </h4>
            <p className="text-xs text-stone-300">
              يرجى كتابة سبب الرفض (مثال: عدم دقة المعلومات، أو الحاجة لتصحيح اسم الراوي أو تفاصيل الحدث).
            </p>

            <textarea
              rows={3}
              placeholder="اكتب سبب الرفض هنا..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-rose-500"
            />

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleRejectSubmit}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                تأكيد الرفض
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedMemory(null);
                  setRejectReason("");
                }}
                className="px-4 py-2.5 rounded-xl bg-stone-800 text-stone-300 text-xs"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
