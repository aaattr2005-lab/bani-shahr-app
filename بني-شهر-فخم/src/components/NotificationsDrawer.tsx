import React, { useState, useEffect } from "react";
import { 
  Bell, 
  X, 
  CheckCheck, 
  Trash2, 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Volume2, 
  Smartphone, 
  AlertTriangle,
  Send,
  ExternalLink,
  Crown,
  CloudRain
} from "lucide-react";
import { FirebasePushNotification, UserProfile } from "../types";
import { 
  pushNotificationService, 
  requestBrowserPushPermission, 
  playNotificationSound 
} from "../lib/pushNotifications";

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: FirebasePushNotification[];
  currentUser: UserProfile;
  onOpenSupervisorsReview?: () => void;
  onRefresh?: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  currentUser,
  onOpenSupervisorsReview,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<"all" | "nominations" | "decisions">("all");
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>(
    typeof window !== "undefined" && "Notification" in window ? Notification.permission : "default"
  );
  const [isSendingTest, setIsSendingTest] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setBrowserPermission(Notification.permission);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const perm = await requestBrowserPushPermission();
    setBrowserPermission(perm);
    if (perm === "granted") {
      playNotificationSound("general");
    }
  };

  const handleSendTestPush = async () => {
    setIsSendingTest(true);
    await pushNotificationService.sendTestPushNotification();
    setTimeout(() => {
      setIsSendingTest(false);
      if (onRefresh) onRefresh();
    }, 400);
  };

  const handleMarkAllRead = async () => {
    await pushNotificationService.markAllAsRead(notifications);
    if (onRefresh) onRefresh();
  };

  const handleMarkAsRead = async (id: string) => {
    await pushNotificationService.markAsRead(id);
    if (onRefresh) onRefresh();
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await pushNotificationService.deleteNotification(id);
    if (onRefresh) onRefresh();
  };

  const filtered = notifications.filter((n) => {
    if (activeTab === "weather") return n.type === "weather_alert";
    if (activeTab === "nominations") return n.type === "supervisor_nomination_new";
    if (activeTab === "decisions") return n.type === "nomination_approved" || n.type === "nomination_rejected";
    return true;
  });

  const unreadCount = notifications.filter((n) => n.status === "unread").length;
  const isStaff = currentUser.role === "admin" || currentUser.role === "super_admin" || currentUser.role === "village_supervisor";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end" dir="rtl">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[#122219] text-[#F8F4EA] h-full shadow-2xl flex flex-col border-r border-[#7C9D86]/30 z-10">
        
        {/* Header Strip */}
        <div className="qatt-asiri-header-strip shrink-0" />

        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#7C9D86]/20 bg-[#12201A] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1B2B22] border border-[#C7A25C]/40 flex items-center justify-center text-[#C7A25C] shadow-inner">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#F8F4EA]">مركز الإشعارات الفورية</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#C7A25C] text-white text-[11px] font-black animate-pulse">
                    {unreadCount} جديد
                  </span>
                )}
              </div>
              <p className="text-xs text-[#D8BE8B]/80 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                <span>متصل بخدمة Firebase Cloud Push</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#1B2B22] text-[#D8BE8B] hover:text-[#F8F4EA] hover:bg-[#254A37] border border-[#7C9D86]/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Browser Permission Prompt Banner */}
        {browserPermission !== "granted" && (
          <div className="p-3.5 mx-4 mt-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <Smartphone className="w-5 h-5 text-amber-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-amber-300">تفعيل إشعارات المتصفح الفورية</p>
                <p className="text-[11px] text-stone-300 truncate">لاستقبال تنبيهات الترشح حتى أثناء إغلاق التطبيق</p>
              </div>
            </div>
            <button
              onClick={handleRequestPermission}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shrink-0 transition-colors"
            >
              تفعيل الآن
            </button>
          </div>
        )}

        {/* Tabs and Quick Actions */}
        <div className="p-4 border-b border-[#7C9D86]/20 bg-[#12201A]/60 shrink-0 space-y-3">
          <div className="grid grid-cols-4 gap-1 bg-[#122219] p-1 rounded-xl border border-[#7C9D86]/20 text-xs">
            <button
              onClick={() => setActiveTab("all")}
              className={`py-1.5 px-1.5 rounded-lg font-bold transition-all text-center ${
                activeTab === "all"
                  ? "bg-[#C7A25C] text-[#F8F4EA] shadow-sm"
                  : "text-[#D8BE8B] hover:text-[#F8F4EA]"
              }`}
            >
              الكل ({notifications.length})
            </button>
            <button
              onClick={() => setActiveTab("weather")}
              className={`py-1.5 px-1.5 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1 ${
                activeTab === "weather"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-sky-300/80 hover:text-sky-200"
              }`}
            >
              <CloudRain className="w-3 h-3" />
              <span>الطقس</span>
            </button>
            <button
              onClick={() => setActiveTab("nominations")}
              className={`py-1.5 px-1.5 rounded-lg font-bold transition-all text-center ${
                activeTab === "nominations"
                  ? "bg-[#C7A25C] text-[#F8F4EA] shadow-sm"
                  : "text-[#D8BE8B] hover:text-[#F8F4EA]"
              }`}
            >
              الترشيحات
            </button>
            <button
              onClick={() => setActiveTab("decisions")}
              className={`py-1.5 px-1.5 rounded-lg font-bold transition-all text-center ${
                activeTab === "decisions"
                  ? "bg-[#C7A25C] text-[#F8F4EA] shadow-sm"
                  : "text-[#D8BE8B] hover:text-[#F8F4EA]"
              }`}
            >
              القرارات
            </button>
          </div>

          <div className="flex items-center justify-between text-xs text-[#D8BE8B]">
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleSendTestPush}
                disabled={isSendingTest}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#1B2B22] hover:bg-[#254A37] text-[#D8BE8B] hover:text-[#F8F4EA] border border-[#7C9D86]/30 font-medium transition-colors text-[11px]"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>إشعار عام</span>
              </button>

              <button
                onClick={async () => {
                  setIsSendingTest(true);
                  await pushNotificationService.sendWeatherRainPushAlert({
                    cityName: "النماص وتنومة",
                    severity: "moderate",
                    severityAr: "أمطار وضباب",
                    precipMm: 2.4,
                    isTest: true
                  });
                  setTimeout(() => {
                    setIsSendingTest(false);
                    if (onRefresh) onRefresh();
                  }, 300);
                }}
                disabled={isSendingTest}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-sky-950/80 hover:bg-sky-900/80 text-sky-200 border border-sky-600/40 font-medium transition-colors text-[11px]"
              >
                <CloudRain className="w-3 h-3 text-sky-400" />
                <span>إشعار مطر</span>
              </button>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 hover:text-[#F8F4EA] transition-colors text-[11px]"
              >
                <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>تحديد الكل كمقروء</span>
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-14 h-14 rounded-2xl bg-[#1B2B22] border border-[#7C9D86]/30 flex items-center justify-center text-[#7C9D86] mb-3">
                <Bell className="w-7 h-7 text-[#D8BE8B]/60" />
              </div>
              <h4 className="font-bold text-base text-[#F8F4EA] mb-1">لا توجد إشعارات حالياً</h4>
              <p className="text-xs text-[#D8BE8B]/70 max-w-xs leading-relaxed">
                ستصلك التنبيهات الفورية لحالات هطول الأمطار في النماص وتنومة وترشيحات المشرفين هنا مباشرة.
              </p>
              <button
                onClick={handleSendTestPush}
                className="mt-4 px-4 py-2 rounded-xl bg-[#C7A25C] text-[#F8F4EA] text-xs font-bold hover:bg-[#9C7A3B] transition-colors shadow-md flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>تجربة وصول إشعار فوري</span>
              </button>
            </div>
          ) : (
            filtered.map((item) => {
              const isWeather = item.type === "weather_alert";
              const isNomination = item.type === "supervisor_nomination_new";
              const isApproved = item.type === "nomination_approved";
              const isRejected = item.type === "nomination_rejected";
              const isUnread = item.status === "unread";

              return (
                <div
                  key={item.id}
                  onClick={() => handleMarkAsRead(item.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative group ${
                    isWeather
                      ? isUnread
                        ? "bg-gradient-to-r from-sky-950/60 to-[#12201A] border-sky-500/50 shadow-md shadow-sky-950/30"
                        : "bg-[#12201A]/50 border-sky-500/20 hover:border-sky-500/40"
                      : isUnread
                      ? "bg-[#1B2B22]/80 border-[#C7A25C]/50 shadow-md"
                      : "bg-[#12201A]/50 border-[#7C9D86]/20 hover:border-[#7C9D86]/40"
                  }`}
                >
                  {/* Unread Pill Indicator */}
                  {isUnread && (
                    <span className={`absolute top-3 left-3 w-2 h-2 rounded-full ${isWeather ? "bg-sky-400 animate-pulse" : "bg-[#C7A25C]"}`} />
                  )}

                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isWeather
                        ? "bg-sky-500/20 text-sky-400 border border-sky-500/40"
                        : isApproved
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : isRejected
                        ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                        : isNomination
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                        : "bg-[#7C9D86]/20 text-[#D8BE8B] border border-[#7C9D86]/40"
                    }`}>
                      {isWeather && <CloudRain className="w-5 h-5" />}
                      {isApproved && <CheckCircle2 className="w-5 h-5" />}
                      {isRejected && <XCircle className="w-5 h-5" />}
                      {isNomination && <UserCheck className="w-5 h-5" />}
                      {!isWeather && !isApproved && !isRejected && !isNomination && <Bell className="w-5 h-5" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                          isWeather
                            ? "bg-sky-950/80 text-sky-300 border-sky-500/30 font-bold"
                            : "bg-black/40 text-[#D8BE8B] border-white/10"
                        }`}>
                          {isWeather 
                            ? `🌧️ طقس Open-Meteo ${item.cityName ? `• ${item.cityName}` : ""}` 
                            : isNomination ? "طلب ترشيح وارد" 
                            : isApproved ? "اعتماد رسمي" 
                            : isRejected ? "رفض طلب" 
                            : "تنبيه عام"}
                        </span>
                        <span className="text-[10px] text-[#D8BE8B]/60">
                          {new Date(item.createdAt).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>

                      <h4 className="font-bold text-xs sm:text-sm text-[#F8F4EA] mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#D8BE8B]/90 leading-relaxed">
                        {item.body}
                      </p>

                      {/* Weather details strip if available */}
                      {isWeather && (item.precipMm !== undefined || item.weatherCondition) && (
                        <div className="mt-2.5 p-2 rounded-xl bg-sky-950/40 border border-sky-500/20 text-[11px] text-sky-200 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <CloudRain className="w-3.5 h-3.5 text-sky-400" />
                            <span>الحالة: {item.weatherCondition || "أمطار وضباب"}</span>
                          </span>
                          {item.precipMm !== undefined && item.precipMm > 0 && (
                            <span className="font-mono font-bold bg-sky-900/60 px-1.5 py-0.5 rounded border border-sky-400/30">
                              {item.precipMm} mm
                            </span>
                          )}
                        </div>
                      )}

                      {/* Action for Supervisors if this is a nomination */}
                      {isNomination && isStaff && (
                        <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onClose();
                              if (onOpenSupervisorsReview) onOpenSupervisorsReview();
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C7A25C] hover:bg-[#9C7A3B] text-[#F8F4EA] text-xs font-bold transition-colors shadow-sm"
                          >
                            <Crown className="w-3.5 h-3.5" />
                            <span>مراجعة واعتماد الطلب</span>
                          </button>

                          <button
                            onClick={(e) => handleDelete(item.id, e)}
                            className="text-stone-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
                            title="حذف الإشعار"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      {!isNomination && (
                        <div className="mt-2 flex justify-end">
                          <button
                            onClick={(e) => handleDelete(item.id, e)}
                            className="text-stone-400 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-500/10 transition-colors text-[11px] flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>حذف</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Info */}
        <div className="p-3 border-t border-[#7C9D86]/20 bg-[#12201A] text-center text-[11px] text-[#D8BE8B]/70 shrink-0">
          منصة بني شهر الرقمية • إشعارات فايربيس المباشرة
        </div>

      </div>
    </div>
  );
};
