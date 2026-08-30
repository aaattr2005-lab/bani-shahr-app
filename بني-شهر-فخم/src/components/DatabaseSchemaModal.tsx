import React, { useState } from "react";
import { FULL_FIREBASE_SCHEMA } from "../lib/datastore";
import { 
  X, 
  Database, 
  Copy, 
  Check, 
  ShieldCheck, 
  Server, 
  Table, 
  Code2, 
  Sparkles 
} from "lucide-react";

interface DatabaseSchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseSchemaModal: React.FC<DatabaseSchemaModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopySchema = () => {
    navigator.clipboard.writeText(FULL_FIREBASE_SCHEMA);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-stone-900 border border-stone-700/80 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-950 via-stone-900 to-stone-900 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-['Amiri']">مخطط وقواعد أمان Firebase Firestore (Production-Ready)</h3>
              <p className="text-xs text-stone-400">هيكل مجموعات Firestore، قواعد الأمان والحماية Security Rules، ونظام الصلاحيات</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySchema}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "تم النسخ بنجاح!" : "نسخ قواعد ومخطط Firebase"}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Overview Badges */}
        <div className="p-4 bg-stone-950/60 border-b border-stone-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-2 rounded-xl bg-stone-900 border border-stone-800 text-center">
            <span className="text-stone-400 block text-[10px]">قاعدة البيانات</span>
            <span className="font-bold text-emerald-400 font-mono">Firebase Firestore</span>
          </div>
          <div className="p-2 rounded-xl bg-stone-900 border border-stone-800 text-center">
            <span className="text-stone-400 block text-[10px]">المصادقة</span>
            <span className="font-bold text-amber-400">Firebase Auth & Phone</span>
          </div>
          <div className="p-2 rounded-xl bg-stone-900 border border-stone-800 text-center">
            <span className="text-stone-400 block text-[10px]">الأمان والحماية</span>
            <span className="font-bold text-teal-400">firestore.rules (RBAC)</span>
          </div>
          <div className="p-2 rounded-xl bg-stone-900 border border-stone-800 text-center">
            <span className="text-stone-400 block text-[10px]">الإشعارات الفورية</span>
            <span className="font-bold text-stone-200 font-mono">Firebase Cloud Messaging</span>
          </div>
        </div>

        {/* Code Viewer */}
        <div className="flex-1 overflow-y-auto p-6 bg-stone-950">
          <pre className="text-emerald-400/90 font-mono text-xs leading-relaxed whitespace-pre-wrap selection:bg-emerald-900">
            {FULL_FIREBASE_SCHEMA}
          </pre>
        </div>

      </div>
    </div>
  );
};
