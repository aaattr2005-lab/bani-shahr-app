import React, { useEffect, useState } from "react";
import { Bell, CheckCircle2, XCircle, AlertCircle, X, Sparkles, UserCheck } from "lucide-react";
import { FirebasePushNotification } from "../types";

interface PushNotificationToastProps {
  notification: FirebasePushNotification | null;
  onClose: () => void;
  onOpenCenter: () => void;
}

export const PushNotificationToast: React.FC<PushNotificationToastProps> = ({
  notification,
  onClose,
  onOpenCenter,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 7000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  const isNominationNew = notification.type === "supervisor_nomination_new";
  const isApproved = notification.type === "nomination_approved";
  const isRejected = notification.type === "nomination_rejected";

  return (
    <div
      dir="rtl"
      className={`fixed top-5 left-4 right-4 sm:left-auto sm:right-6 z-50 max-w-md w-full transition-all duration-500 ease-out transform ${
        isVisible ? "translate-y-0 opacity-100 scale-100" : "-translate-y-6 opacity-0 scale-95"
      }`}
    >
      <div className={`p-4 rounded-2xl shadow-2xl border backdrop-blur-xl transition-all ${
        isApproved
          ? "bg-[#12201A]/95 border-emerald-500/60 shadow-emerald-950/50 text-[#F8F4EA]"
          : isRejected
          ? "bg-[#2A1616]/95 border-rose-500/60 shadow-rose-950/50 text-[#F8F4EA]"
          : isNominationNew
          ? "bg-[#261E14]/95 border-[#C7A25C]/70 shadow-amber-950/50 text-[#F8F4EA]"
          : "bg-[#1E2922]/95 border-[#7C9D86]/50 shadow-black/50 text-[#F8F4EA]"
      }`}>
        <div className="flex items-start gap-3">
          {/* Icon Badge */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${
            isApproved
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
              : isRejected
              ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
              : isNominationNew
              ? "bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse"
              : "bg-[#7C9D86]/20 text-[#D8BE8B] border border-[#7C9D86]/40"
          }`}>
            {isApproved && <CheckCircle2 className="w-5 h-5" />}
            {isRejected && <XCircle className="w-5 h-5" />}
            {isNominationNew && <UserCheck className="w-5 h-5" />}
            {!isApproved && !isRejected && !isNominationNew && <Bell className="w-5 h-5" />}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-[#D8BE8B] font-medium border border-white/10">
                إشعار فوري (Firebase Push)
              </span>
              <span className="text-[10px] text-[#D8BE8B]/60">الآن</span>
            </div>

            <h4 className="font-bold text-sm text-[#F8F4EA] mb-1 truncate">
              {notification.title}
            </h4>
            <p className="text-xs text-[#D8BE8B]/90 leading-relaxed line-clamp-2">
              {notification.body}
            </p>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/10">
              <button
                onClick={() => {
                  onOpenCenter();
                  onClose();
                }}
                className="px-3 py-1 rounded-lg bg-[#C7A25C] hover:bg-[#9C7A3B] text-[#F8F4EA] text-xs font-bold transition-colors shadow-sm"
              >
                عرض التفاصيل
              </button>
              <button
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(onClose, 300);
                }}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 text-xs transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="text-[#D8BE8B]/60 hover:text-[#F8F4EA] p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
