import React, { useState } from "react";
import { AuditLog, UserProfile } from "../../../types";
import { DataStore, FIREBASE_SECURITY_RULES_SCHEMA } from "../../../lib/datastore";
import {
  ShieldAlert,
  Search,
  Database,
  Lock,
  Filter,
  CheckCircle2,
  Clock,
  Terminal,
  Code2,
  Copy,
  Layers,
  ShieldCheck,
  Crown
} from "lucide-react";

interface AuditAndRLSTabProps {
  onOpenDatabaseSchema: () => void;
  onNotification: (msg: string) => void;
}

export const AuditAndRLSTab: React.FC<AuditAndRLSTabProps> = ({
  onOpenDatabaseSchema,
  onNotification
}) => {
  const [logs, setLogs] = useState<AuditLog[]>(() => DataStore.getAuditLogs());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModule, setSelectedModule] = useState<string>("ALL");
  const [activeSubTab, setActiveSubTab] = useState<"logs" | "security_rules">("logs");

  const filteredLogs = logs.filter(log => {
    const matchSearch = log.details.includes(searchTerm) || log.userName.includes(searchTerm) || log.userRole.includes(searchTerm);
    const matchModule = selectedModule === "ALL" || log.targetModule === selectedModule;
    return matchSearch && matchModule;
  });

  const copySecurityRules = () => {
    navigator.clipboard.writeText(FIREBASE_SECURITY_RULES_SCHEMA);
    onNotification("تم نسخ قواعد أمان Firebase Firestore (firestore.rules) إلى الحافظة");
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-stone-950/70 border border-stone-800">
        <div>
          <h3 className="text-base font-bold text-white font-['Amiri'] flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-emerald-400" />
            <span>سجل العمليات والتدقيق الأمني وقواعد Firebase Firestore</span>
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            مراقبة وتوثيق كافة العمليات الإدارية، وقواعد حماية المجموعات على مستوى السحابة
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-2xl border border-stone-800 text-xs">
            <button
              onClick={() => setActiveSubTab("logs")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeSubTab === "logs" ? "bg-emerald-600 text-white" : "text-stone-400 hover:text-white"
              }`}
            >
              سجل العمليات ({logs.length})
            </button>
            <button
              onClick={() => setActiveSubTab("security_rules")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeSubTab === "security_rules" ? "bg-emerald-600 text-white" : "text-stone-400 hover:text-white"
              }`}
            >
              قواعد أمان Firestore (Rules)
            </button>
          </div>
        </div>
      </div>

      {activeSubTab === "logs" && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="البحث في السجل بالتفاصيل أو اسم المسؤول..."
                className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-stone-900 border border-stone-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-2xl border border-stone-800 text-xs">
              {["ALL", "SECURITY", "CONTENT", "PAYMENTS", "SYSTEM"].map(m => (
                <button
                  key={m}
                  onClick={() => setSelectedModule(m)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    selectedModule === m ? "bg-emerald-600 text-white" : "text-stone-400 hover:text-white"
                  }`}
                >
                  {m === "ALL" ? "الكل" : m}
                </button>
              ))}
            </div>
          </div>

          {/* Logs Table / List */}
          <div className="space-y-2.5">
            {filteredLogs.map(log => (
              <div
                key={log.id}
                className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-stone-700 transition-all flex flex-wrap items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-stone-950 border border-stone-800 text-emerald-400">
                    {log.actionType}
                  </span>
                  <div>
                    <p className="text-stone-200 font-medium">{log.details}</p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-400">
                      <span>المسؤول: <strong className="text-stone-300">{log.userName}</strong></span>
                      <span>•</span>
                      <span className="px-1.5 py-0.2 rounded bg-stone-800 text-stone-300 font-mono text-[10px]">{log.userRole}</span>
                      <span>•</span>
                      <span className="text-stone-500 font-mono">{log.targetModule}</span>
                    </div>
                  </div>
                </div>

                <span className="text-stone-500 font-mono text-[11px]">
                  {new Date(log.timestamp).toLocaleString("ar-SA")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === "security_rules" && (
        <div className="space-y-4">
          {/* Security Principle Banner */}
          <div className="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm">
              <Lock className="w-5 h-5 text-amber-400" />
              <span>مبدأ الأمان السحابي: الأمان في قواعد Firebase Firestore Security Rules</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              تضمن قواعد أمان Firestore (firestore.rules) التحقق الصارم من الهوية وصلاحيات المستخدم (RBAC) مباشرة على مستوى السيرفر السحابي. لا يمكن لأي مستخدم تعديل سجلات المشرفين، الأنساب، أو الوثائق ما لم يمتلك المصادقة والتفويض المناسب.
            </p>
          </div>

          {/* Firestore Rules Code Card */}
          <div className="bg-stone-950 border border-stone-800 rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <Terminal className="w-4 h-4" />
                <span>Firebase Firestore Active Security Rules (RBAC)</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={copySecurityRules}
                  className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>نسخ القواعد</span>
                </button>
                <button
                  onClick={onOpenDatabaseSchema}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                >
                  عرض المخطط الكامل
                </button>
              </div>
            </div>

            <pre className="p-4 rounded-2xl bg-stone-900/90 text-stone-300 font-mono text-xs overflow-x-auto leading-relaxed border border-stone-800/80" dir="ltr">
{FIREBASE_SECURITY_RULES_SCHEMA}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
