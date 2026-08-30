import React, { useState } from "react";
import { BroadcastNotification, UserProfile } from "../../../types";
import { DataStore, generateUniqueId } from "../../../lib/datastore";
import {
  BellRing,
  Send,
  Search,
  Radio,
  Users,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles
} from "lucide-react";

interface BroadcastsTabProps {
  currentUser: UserProfile;
  onNotification: (msg: string) => void;
}

export const BroadcastsTab: React.FC<BroadcastsTabProps> = ({
  currentUser,
  onNotification
}) => {
  const [broadcasts, setBroadcasts] = useState<BroadcastNotification[]>(() => DataStore.getBroadcasts());
  
  // Dispatch form state
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targetAudience, setTargetAudience] = useState<BroadcastNotification["targetAudience"]>("all");
  const [targetTribeName, setTargetTribeName] = useState("قبيلة آل وليد");
  const [type, setType] = useState<BroadcastNotification["type"]>("announcement");

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    const estimatedDelivered = targetAudience === "all" ? 4820 : targetAudience === "specific_tribe" ? 890 : 340;

    const newBroadcast: BroadcastNotification = {
      id: "BC-" + Date.now().toString().slice(-3),
      title,
      message,
      type,
      targetAudience,
      targetTribeName: targetAudience === "specific_tribe" ? targetTribeName : undefined,
      senderId: currentUser.id,
      senderName: currentUser.name,
      sentAt: new Date().toISOString(),
      deliveredCount: estimatedDelivered,
      status: "sent"
    };

    DataStore.sendBroadcastNotification(newBroadcast);
    setBroadcasts(DataStore.getBroadcasts());
    setTitle("");
    setMessage("");
    onNotification(`تم إرسال الإشعار الجماعي [${newBroadcast.title}] بنجاح إلى ${estimatedDelivered} مستخدم`);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-stone-950/70 border border-stone-800">
        <div>
          <h3 className="text-base font-bold text-white font-['Amiri'] flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-400" />
            <span>مركز البث الفوري وإرسال الإشعارات الجماعية</span>
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            إرسال إشعارات وتنبيهات فورية (Push Notifications) لكافة الأعضاء أو قبائل محددة
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            ⚡ نظام البث السحابي متصل
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* DISPATCH FORM */}
        <div className="lg:col-span-5 bg-stone-900/90 border border-stone-800 rounded-3xl p-5 space-y-4">
          <h4 className="text-sm font-bold text-white font-['Amiri'] flex items-center gap-2">
            <Send className="w-4 h-4 text-emerald-400" />
            <span>إنشاء وبث إشعار فوري جديد</span>
          </h4>

          <form onSubmit={handleSendBroadcast} className="space-y-3 text-xs">
            <div>
              <label className="block text-stone-300 mb-1 font-medium">عنوان الإشعار</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="تنبيه هام، دعوة عامة، إعلان ملتقى..."
                className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-300 mb-1 font-medium">نوع التنبيه</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white"
                >
                  <option value="announcement">إعلان عام</option>
                  <option value="urgent_tribal">تنبيه قبلي عاجل</option>
                  <option value="event_alert">تذكير بمناسبة / فعالية</option>
                  <option value="lineage_update">تحديث في المشجرة</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-medium">الفئة المستهدفة</label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white"
                >
                  <option value="all">كافة مستخدمي المنصة (الكل)</option>
                  <option value="specific_tribe">أبناء قبيلة معينة</option>
                  <option value="guides_only">المرشدون السياحيون فقط</option>
                  <option value="sellers_only">الأسر المنتجة والبائعون</option>
                </select>
              </div>
            </div>

            {targetAudience === "specific_tribe" && (
              <div>
                <label className="block text-stone-300 mb-1 font-medium">اسم القبيلة المستهدفة</label>
                <input
                  type="text"
                  required
                  value={targetTribeName}
                  onChange={(e) => setTargetTribeName(e.target.value)}
                  placeholder="قبيلة آل وليد"
                  className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white"
                />
              </div>
            )}

            <div>
              <label className="block text-stone-300 mb-1 font-medium">نص الرسالة</label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="أدخل نص الرسالة التي ستصل كإشعار فوري على شاشات الجوالات..."
                className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
            >
              <Send className="w-4 h-4" />
              <span>إرسال وبث الإشعار الآن</span>
            </button>
          </form>
        </div>

        {/* BROADCASTS HISTORY */}
        <div className="lg:col-span-7 space-y-3">
          <h4 className="text-sm font-bold text-white font-['Amiri'] flex items-center gap-2">
            <Clock className="w-4 h-4 text-stone-400" />
            <span>سجل الإشعارات المرسلة سابقاً ({broadcasts.length})</span>
          </h4>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {broadcasts.map(bc => (
              <div
                key={bc.id}
                className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <BellRing className="w-4 h-4" />
                    </span>
                    <h5 className="text-xs font-bold text-white font-['Amiri']">{bc.title}</h5>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-800 text-emerald-300 font-mono">
                    {bc.deliveredCount.toLocaleString()} مستلم
                  </span>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed bg-stone-950/50 p-2.5 rounded-xl border border-stone-800/60">
                  {bc.message}
                </p>

                <div className="flex items-center justify-between text-[10px] text-stone-500 pt-1">
                  <span>المستهدفون: <strong className="text-stone-400">{bc.targetTribeName || bc.targetAudience}</strong></span>
                  <span className="font-mono">{new Date(bc.sentAt).toLocaleDateString("ar-SA")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
