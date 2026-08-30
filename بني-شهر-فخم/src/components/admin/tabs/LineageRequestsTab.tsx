import React, { useState } from "react";
import { LineageModificationRequest, UserProfile } from "../../../types";
import { DataStore } from "../../../lib/datastore";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  UserCheck,
  ShieldCheck,
  Building2,
  Calendar,
  Eye,
  FileCheck2,
  AlertCircle
} from "lucide-react";

interface LineageRequestsTabProps {
  currentUser: UserProfile;
  onNotification: (msg: string) => void;
}

export const LineageRequestsTab: React.FC<LineageRequestsTabProps> = ({
  currentUser,
  onNotification
}) => {
  const [requests, setRequests] = useState<LineageModificationRequest[]>(() => DataStore.getLineageRequests());
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<LineageModificationRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  const filtered = requests.filter(r => {
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    const matchSearch = r.applicantName.includes(searchTerm) || r.tribeName.includes(searchTerm) || r.fakhdhName.includes(searchTerm);
    return matchStatus && matchSearch;
  });

  const handleUpdateStatus = (id: string, newStatus: LineageModificationRequest["status"]) => {
    DataStore.updateLineageRequestStatus(id, newStatus, adminNotes);
    setRequests(DataStore.getLineageRequests());
    setSelectedRequest(null);
    setAdminNotes("");
    onNotification(`تم تحديث حالة طلب تعديل النسب [${id}] إلى ${newStatus === "approved" ? "معتمد وموثق" : newStatus === "rejected" ? "مرفوض" : "تحت المراجعة"}`);
  };

  const getStatusBadge = (status: LineageModificationRequest["status"]) => {
    switch (status) {
      case "approved":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> معتمد وموثق</span>;
      case "rejected":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1"><XCircle className="w-3 h-3" /> مرفوض</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1"><Clock className="w-3 h-3" /> قيد المراجعة والتدقيق</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-stone-950/70 border border-stone-800">
        <div>
          <h3 className="text-base font-bold text-white font-['Amiri'] flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-emerald-400" />
            <span>مراجعة وتدقيق طلبات تعديل وتوثيق النسب</span>
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            تدقيق مستندات الأجداد، شهادات المعرّفين، وحجج الإرث الشرعية قبل تحديث المشجرة
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-2xl bg-stone-900 border border-stone-700 text-stone-300 text-xs font-mono">
            إجمالي الطلبات: {requests.length}
          </span>
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
            placeholder="البحث باسم صاحب الطلب، القبيلة، أو الفخذ..."
            className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-stone-900 border border-stone-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-2xl border border-stone-800 text-xs">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              filterStatus === "all" ? "bg-emerald-600 text-white" : "text-stone-400 hover:text-white"
            }`}
          >
            الكل ({requests.length})
          </button>
          <button
            onClick={() => setFilterStatus("pending")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              filterStatus === "pending" ? "bg-amber-600 text-white" : "text-stone-400 hover:text-white"
            }`}
          >
            قيد الانتظار ({requests.filter(r => r.status === "pending").length})
          </button>
          <button
            onClick={() => setFilterStatus("approved")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              filterStatus === "approved" ? "bg-emerald-600 text-white" : "text-stone-400 hover:text-white"
            }`}
          >
            المعتمدة
          </button>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-3">
        {filtered.map(req => (
          <div
            key={req.id}
            className="p-5 rounded-3xl bg-stone-900/80 border border-stone-800 hover:border-stone-700 transition-all space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white font-['Amiri']">{req.applicantName}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 font-mono">
                      #{req.id}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 mt-0.5">
                    القبيلة: <strong className="text-stone-200">{req.tribeName}</strong> | الفخذ: <strong className="text-emerald-400">{req.fakhdhName}</strong> | جوال: {req.applicantPhone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getStatusBadge(req.status)}
                <button
                  onClick={() => {
                    setSelectedRequest(req);
                    setAdminNotes(req.adminNotes || "");
                  }}
                  className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>معاينة وتدقيق</span>
                </button>
              </div>
            </div>

            {/* Lineage Comparison Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800/80">
                <span className="text-stone-400 text-[11px] block mb-1">النسب الحالي في المشجرة:</span>
                <p className="text-stone-200 font-medium">{req.currentLineage}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
                <span className="text-emerald-400 text-[11px] font-bold block mb-1">النسب المقترح والمطلوب توثيقه:</span>
                <p className="text-emerald-200 font-medium">{req.proposedLineage}</p>
              </div>
            </div>

            {/* Documents and Witnesses */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-400 pt-2 border-t border-stone-800/80">
              <div className="flex items-center gap-2">
                <span>المستندات: {req.historicalDocuments?.join("، ") || "مرفقة"}</span>
                <span>•</span>
                <span>الشهود والمعرّفون: {req.witnesses?.join("، ") || "معرّف القبيلة"}</span>
              </div>
              <span className="text-stone-500 font-mono">{new Date(req.createdAt).toLocaleDateString("ar-SA")}</span>
            </div>
          </div>
        ))}
      </div>

      {/* INSPECT & APPROVE MODAL */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-stone-900 border border-stone-700 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div>
                <h4 className="text-base font-bold text-white font-['Amiri']">
                  تدقيق طلب تعديل النسب #{selectedRequest.id}
                </h4>
                <p className="text-xs text-stone-400">صاحب الطلب: {selectedRequest.applicantName}</p>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                <p className="text-stone-300"><strong>السبب والمبرر الشرعي/التاريخي:</strong></p>
                <p className="text-stone-400 leading-relaxed">{selectedRequest.reason}</p>
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-medium">ملاحظات وقرار اللجنة الإدارية</label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="أدخل مسببات القبول أو الرفض استناداً للمصادر التاريخية وإفادة المعرفين..."
                  className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedRequest.id, "rejected")}
                  className="px-4 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 font-bold"
                >
                  رفض الطلب
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedRequest.id, "approved")}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold shadow-lg shadow-emerald-950/40"
                  >
                    قبول وتوثيق بالمشجرة
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
