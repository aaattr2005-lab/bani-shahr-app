import React, { useState } from "react";
import { 
  UserProfile, 
  GuideBooking, 
  Order, 
  Village, 
  AuditLog, 
  Complaint, 
  PlatformPayment, 
  CommissionSettings,
  VisitorReview,
  MemoryItem,
  BaniShahrExperience,
  ExperienceBooking
} from "../../types";
import { DataStore } from "../../lib/datastore";
import { 
  Users, 
  MapPin, 
  ShieldCheck, 
  ShoppingBag, 
  Calendar, 
  DollarSign, 
  AlertCircle, 
  Star, 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  RefreshCw, 
  Sliders, 
  Send,
  Building,
  Key,
  CreditCard,
  History,
  Activity,
  Compass,
  Utensils,
  Sparkles,
  Coins,
  TrendingUp,
  Wallet,
  Crown,
  GitBranch,
  FileCheck2,
  Megaphone,
  HeartHandshake,
  Radio,
  ShieldAlert,
  UserCheck
} from "lucide-react";
import { TribesAndTreeTab } from "./tabs/TribesAndTreeTab";
import { LineageRequestsTab } from "./tabs/LineageRequestsTab";
import { SupervisorsTab } from "./tabs/SupervisorsTab";
import { NewsAndEventsTab } from "./tabs/NewsAndEventsTab";
import { AdsTab } from "./tabs/AdsTab";
import { BusinessmenTab } from "./tabs/BusinessmenTab";
import { BroadcastsTab } from "./tabs/BroadcastsTab";
import { AuditAndRLSTab } from "./tabs/AuditAndRLSTab";
import { StoriesModerationTab } from "./tabs/StoriesModerationTab";

interface AdminDashboardProps {
  currentUser: UserProfile;
  onOpenDatabaseSchema: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  onOpenDatabaseSchema
}) => {
  const [adminTab, setAdminTab] = useState<
    | "overview"
    | "tribes"
    | "lineage"
    | "supervisors"
    | "news"
    | "ads"
    | "businessmen"
    | "broadcasts"
    | "users"
    | "memories"
    | "villages"
    | "experiences"
    | "bookings"
    | "orders"
    | "finances"
    | "complaints"
    | "reviews"
    | "audit"
  >("overview");

  // State loaded from DataStore
  const [users, setUsers] = useState<UserProfile[]>(() => DataStore.getUsers());
  const [villages, setVillages] = useState<Village[]>(() => DataStore.getVillages());
  const [bookings, setBookings] = useState<GuideBooking[]>(() => DataStore.getBookings());
  const [orders, setOrders] = useState<Order[]>(() => DataStore.getOrders());
  const [payments, setPayments] = useState<PlatformPayment[]>(() => DataStore.getPayments());
  const [complaints, setComplaints] = useState<Complaint[]>(() => DataStore.getComplaints());
  const [reviews, setReviews] = useState<VisitorReview[]>(() => DataStore.getReviews());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => DataStore.getAuditLogs());
  const [commissions, setCommissions] = useState<CommissionSettings>(() => DataStore.getCommissionSettings());
  const [memories, setMemories] = useState<MemoryItem[]>(() => DataStore.getAllMemoriesForAdmin());
  const [experiences, setExperiences] = useState<BaniShahrExperience[]>(() => DataStore.getExperiences());
  const [experienceBookings, setExperienceBookings] = useState<ExperienceBooking[]>(() => DataStore.getExperienceBookings());

  // Search & Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [selectedVillageForEdit, setSelectedVillageForEdit] = useState<Village | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [complaintReplyText, setComplaintReplyText] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  // Financial statistics
  const totalBookingsAmount = bookings.reduce((acc, b) => acc + (b.paymentStatus === "paid" ? b.totalPrice : 0), 0);
  const totalOrdersAmount = orders.reduce((acc, o) => acc + (o.paymentStatus === "paid" ? o.grandTotal : 0), 0);
  const totalSubscriptionsAmount = payments
    .filter(p => p.type === "village_subscription")
    .reduce((acc, p) => acc + p.amount, 0);
  const totalCommissionsEarned = payments
    .filter(p => p.type !== "village_subscription")
    .reduce((acc, p) => acc + p.netAmount, 0);
  const grossPlatformTurnover = totalBookingsAmount + totalOrdersAmount + totalSubscriptionsAmount;

  // Handlers
  const handleRoleChange = (userId: string, newRole: UserProfile["role"], villageId?: string, villageName?: string) => {
    DataStore.updateUserRole(userId, newRole, villageId, villageName);
    setUsers(DataStore.getUsers());
    setAuditLogs(DataStore.getAuditLogs());
    showNotification("تم تحديث دور وصلاحيات المستخدم بنجاح وتسجيل العملية في سجل التدقيق");
  };

  const handleUpdateBooking = (id: string, status: GuideBooking["status"]) => {
    DataStore.updateBookingStatus(id, status);
    setBookings(DataStore.getBookings());
    setAuditLogs(DataStore.getAuditLogs());
    showNotification(`تم تحديث حالة الحجز #${id} إلى ${status}`);
  };

  const handleUpdateOrder = (id: string, status: Order["status"]) => {
    DataStore.updateOrderStatus(id, status);
    setOrders(DataStore.getOrders());
    setAuditLogs(DataStore.getAuditLogs());
    showNotification(`تم تحديث حالة الطلب #${id} إلى ${status}`);
  };

  const handleUpdateExpBooking = (id: string, status: ExperienceBooking["status"]) => {
    DataStore.updateExperienceBookingStatus(id, status);
    setExperienceBookings(DataStore.getExperienceBookings());
    setAuditLogs(DataStore.getAuditLogs());
    showNotification(`تم تحديث حالة حجز التجربة #${id} إلى ${status}`);
  };

  const handleSaveCommissionSettings = (e: React.FormEvent) => {
    e.preventDefault();
    DataStore.saveCommissionSettings(commissions);
    setAuditLogs(DataStore.getAuditLogs());
    showNotification("تم حفظ إعدادات العمولات والاشتراكات بنجاح في النظام");
  };

  const handleResolveComplaint = (status: Complaint["status"]) => {
    if (!selectedComplaint) return;
    DataStore.updateComplaintStatus(selectedComplaint.id, status, complaintReplyText);
    setComplaints(DataStore.getComplaints());
    setAuditLogs(DataStore.getAuditLogs());
    setSelectedComplaint(null);
    setComplaintReplyText("");
    showNotification("تم تحديث حالة التذكرة وإرسال الرد الرسمي");
  };

  const handleDeleteReview = (id: string) => {
    DataStore.deleteReview(id);
    setReviews(DataStore.getReviews());
    setAuditLogs(DataStore.getAuditLogs());
    showNotification("تم حذف المراجعة وتحديث سجل التدقيق");
  };

  const handleSaveVillageChanges = (village: Village) => {
    DataStore.saveVillage(village);
    setVillages(DataStore.getVillages());
    setSelectedVillageForEdit(null);
    setAuditLogs(DataStore.getAuditLogs());
    showNotification(`تم حفظ وتحديث بيانات ${village.name} بنجاح`);
  };

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

      {/* Sub navigation bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-stone-800 scrollbar-none">
        {[
          { id: "overview", label: "نظرة عامة", icon: Activity, count: null },
          { id: "tribes", label: "إدارة جميع القبائل والشجرة", icon: Crown, count: 18 },
          { id: "lineage", label: "طلبات تعديل النسب", icon: FileCheck2, count: DataStore.getLineageRequests().filter(r => r.status === "pending").length },
          { id: "supervisors", label: "مشرفي القبائل والصلاحيات", icon: UserCheck, count: DataStore.getSupervisorAccounts().length },
          { id: "news", label: "الأخبار والمناسبات", icon: Calendar, count: DataStore.getTribeNews().length },
          { id: "ads", label: "الإعلانات التجارية", icon: Megaphone, count: DataStore.getAds().length },
          { id: "businessmen", label: "رجال الأعمال والاشتراكات", icon: HeartHandshake, count: DataStore.getBusinessSponsorships().length },
          { id: "broadcasts", label: "إرسال إشعارات فورية", icon: Radio, count: null },
          { id: "users", label: "المستخدمين", icon: Users, count: users.length },
          { id: "memories", label: "مراجعة ذاكرة بني شهر", icon: FileText, count: memories.filter(m => m.status === "pending_review").length },
          { id: "villages", label: "القرى والمواقع", icon: Building, count: villages.length },
          { id: "experiences", label: "تجارب بني شهر", icon: Sparkles, count: experienceBookings.length },
          { id: "bookings", label: "حجوزات المرشدين", icon: Calendar, count: bookings.length },
          { id: "orders", label: "طلبات الأسر", icon: ShoppingBag, count: orders.length },
          { id: "finances", label: "المدفوعات والعمولات", icon: DollarSign, count: payments.length },
          { id: "complaints", label: "الشكاوى والملاحظات", icon: AlertCircle, count: complaints.filter(c => c.status !== "resolved").length },
          { id: "reviews", label: "التقييمات", icon: Star, count: reviews.length },
          { id: "audit", label: "سجل العمليات و RLS", icon: ShieldAlert, count: auditLogs.length },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = adminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setAdminTab(tab.id as any);
                setSearchTerm("");
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? "bg-amber-500 text-stone-950 shadow-md shadow-amber-950 font-black"
                  : "bg-stone-950 text-stone-400 hover:text-stone-200 hover:bg-stone-800"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-stone-950" : "text-amber-400"}`} />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? "bg-stone-950/20 text-stone-950" : "bg-stone-800 text-stone-300"}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* NEW MODULE TAB: TRIBES AND DYNASTY TREE */}
      {adminTab === "tribes" && (
        <TribesAndTreeTab onNotification={showNotification} />
      )}

      {/* NEW MODULE TAB: LINEAGE MODIFICATION REQUESTS */}
      {adminTab === "lineage" && (
        <LineageRequestsTab currentUser={currentUser} onNotification={showNotification} />
      )}

      {/* NEW MODULE TAB: SUPERVISORS AND SCOPES */}
      {adminTab === "supervisors" && (
        <SupervisorsTab onNotification={showNotification} />
      )}

      {/* NEW MODULE TAB: NEWS AND EVENTS */}
      {adminTab === "news" && (
        <NewsAndEventsTab currentUser={currentUser} onNotification={showNotification} />
      )}

      {/* NEW MODULE TAB: ADS AND SPONSORS */}
      {adminTab === "ads" && (
        <AdsTab onNotification={showNotification} />
      )}

      {/* NEW MODULE TAB: BUSINESSMEN AND SUBSCRIPTIONS */}
      {adminTab === "businessmen" && (
        <BusinessmenTab onNotification={showNotification} />
      )}

      {/* NEW MODULE TAB: BROADCAST NOTIFICATIONS */}
      {adminTab === "broadcasts" && (
        <BroadcastsTab currentUser={currentUser} onNotification={showNotification} />
      )}

      {/* TAB 1: OVERVIEW */}
      {adminTab === "overview" && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-1">
              <span className="text-[11px] text-stone-400 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-emerald-400" /> المستخدمين المسجلين
              </span>
              <p className="text-xl font-bold text-white font-mono">{users.length}</p>
              <span className="text-[10px] text-emerald-400 block">
                {users.filter(u => u.role === "village_supervisor").length} مشرف قرية معتمد
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-1">
              <span className="text-[11px] text-stone-400 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-amber-400" /> أرشيف الذاكرة والتراث
              </span>
              <p className="text-xl font-bold text-amber-400 font-mono">{memories.length}</p>
              <span className="text-[10px] text-amber-300 block">
                {memories.filter(m => m.status === "pending_review").length} بانتظار الاعتماد والمراجعة
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-1">
              <span className="text-[11px] text-stone-400 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-teal-400" /> حجم التداول الإجمالي
              </span>
              <p className="text-xl font-bold text-emerald-400 font-mono">{grossPlatformTurnover.toLocaleString()} ريال</p>
              <span className="text-[10px] text-teal-400 block">
                حجوزات + تجارب + طلبات
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-1">
              <span className="text-[11px] text-stone-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" /> التذاكر والشكاوى
              </span>
              <p className="text-xl font-bold text-rose-400 font-mono">
                {complaints.filter(c => c.status !== "resolved").length}
              </p>
              <span className="text-[10px] text-stone-400 block">تتطلب المتابعة والرد</span>
            </div>
          </div>

          {/* Featured Sections Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Recent Audit Trail Preview */}
            <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-amber-400" />
                  <span>آخر العمليات المسجلة في سجل الأمان (Audit Logs)</span>
                </h4>
                <button
                  onClick={() => setAdminTab("audit")}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-medium"
                >
                  عرض السجل الكامل
                </button>
              </div>

              <div className="space-y-2.5">
                {auditLogs.slice(0, 4).map(log => (
                  <div key={log.id} className="p-2.5 rounded-xl bg-stone-900/70 border border-stone-800 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-stone-400">
                      <span className="font-bold text-stone-200">{log.userName} ({log.userRole})</span>
                      <span className="font-mono">{new Date(log.timestamp).toLocaleTimeString("ar-SA")}</span>
                    </div>
                    <p className="text-stone-300">{log.details}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions & Firebase Schema */}
            <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-4 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>حالة الأمان وقاعدة البيانات السحابية</span>
                </h4>
                <p className="text-xs text-stone-400 leading-relaxed">
                  النظام يدعم سياسات Row-Level Security (RLS) ومطابقة الصلاحيات حسب القرية ومشرفها، مع تقييد التعديل وحفظ الأثر التراكمي لكل عملية.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={onOpenDatabaseSchema}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 hover:text-white hover:bg-emerald-900 transition-all text-xs font-bold flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>معاينة مخطط وتوليد جداول Firebase Firestore</span>
                </button>
                <div className="flex items-center justify-between text-[11px] text-stone-400 px-1">
                  <span>المشرف العام النشط: {currentUser.name}</span>
                  <span className="text-emerald-400 font-bold">جلسة مؤمنة بنجاح</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: MEMORIES & TRIBAL NARRATIONS REVIEW */}
      {adminTab === "memories" && (
        <StoriesModerationTab
          currentUser={currentUser}
          onNotification={(msg) => {
            showNotification(msg);
            setMemories(DataStore.getAllMemoriesForAdmin());
            setAuditLogs(DataStore.getAuditLogs());
          }}
        />
      )}

      {/* TAB 2: USERS & RBAC */}
      {adminTab === "users" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="بحث بالاسم أو الجوال أو القرية..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-3 pr-9 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400">تصفية الدور:</span>
              <select
                value={filterRole}
                onChange={e => setFilterRole(e.target.value)}
                className="px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:outline-none"
              >
                <option value="all">كل الأدوار ({users.length})</option>
                <option value="super_admin">مشرف عام</option>
                <option value="village_supervisor">مشرف قرية</option>
                <option value="tour_guide">مرشد سياحي</option>
                <option value="food_seller">بائع / أسرة منتجة</option>
                <option value="visitor">زائر / سائح</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-stone-800 bg-stone-950">
            <table className="w-full text-right text-xs">
              <thead className="bg-stone-900/90 text-stone-400 border-b border-stone-800">
                <tr>
                  <th className="p-3">المستخدم</th>
                  <th className="p-3">رقم الجوال</th>
                  <th className="p-3">الدور الحالي</th>
                  <th className="p-3">القرية المرتبطة</th>
                  <th className="p-3">كود الدخول</th>
                  <th className="p-3">إجراءات الصلاحية</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 text-stone-300">
                {users
                  .filter(u => {
                    const matchSearch = u.name.includes(searchTerm) || u.phone.includes(searchTerm) || (u.assignedVillageName && u.assignedVillageName.includes(searchTerm));
                    const matchRole = filterRole === "all" || u.role === filterRole;
                    return matchSearch && matchRole;
                  })
                  .map(user => (
                    <tr key={user.id} className="hover:bg-stone-900/50 transition-all">
                      <td className="p-3 font-bold text-white flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-[10px] text-amber-400 font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <span>{user.name}</span>
                          <span className="block text-[10px] text-stone-500 font-normal">{user.city || "النماص / تنومة"}</span>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-stone-400">{user.phone}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          user.role === "super_admin" || user.role === "admin"
                            ? "bg-rose-950 text-rose-300 border border-rose-800"
                            : user.role === "village_supervisor"
                            ? "bg-amber-950 text-amber-300 border border-amber-800"
                            : user.role === "tour_guide"
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                            : user.role === "food_seller"
                            ? "bg-teal-950 text-teal-300 border border-teal-800"
                            : "bg-stone-800 text-stone-400"
                        }`}>
                          {user.role === "super_admin" ? "مشرف عام" :
                           user.role === "admin" ? "مدير نظام" :
                           user.role === "village_supervisor" ? "مشرف قرية" :
                           user.role === "tour_guide" ? "مرشد سياحي" :
                           user.role === "food_seller" ? "بائع أسر منتجة" : "زائر"}
                        </span>
                      </td>
                      <td className="p-3 text-stone-300">
                        {user.assignedVillageName ? (
                          <span className="text-amber-400 font-medium">{user.assignedVillageName}</span>
                        ) : (
                          <span className="text-stone-600">-</span>
                        )}
                      </td>
                      <td className="p-3 font-mono text-amber-300 text-[11px]">
                        {user.supervisorCode ? (
                          <span className="px-2 py-0.5 rounded bg-stone-900 border border-stone-800">{user.supervisorCode}</span>
                        ) : (
                          <span className="text-stone-600">-</span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <select
                            defaultValue={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value as any)}
                            className="bg-stone-900 border border-stone-700 rounded-lg px-2 py-1 text-[11px] text-stone-300 focus:outline-none"
                          >
                            <option value="visitor">زائر</option>
                            <option value="village_supervisor">مشرف قرية</option>
                            <option value="tour_guide">مرشد سياحي</option>
                            <option value="food_seller">بائع أسر</option>
                            <option value="admin">مدير</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: VILLAGES & SUPERVISORS */}
      {adminTab === "villages" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-amber-400" />
              <span>إدارة القرى، المشرفين، وحالة الاشتراكات</span>
            </h4>
            <span className="text-xs text-stone-400">{villages.length} قرية مسجلة في النظام</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {villages.map(village => (
              <div key={village.id} className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h5 className="text-sm font-bold text-white font-['Amiri'] flex items-center gap-2">
                      <span>{village.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 font-sans">
                        {village.region}
                      </span>
                    </h5>
                    <p className="text-[11px] text-stone-400 mt-1 line-clamp-1">{village.tribalBranch}</p>
                  </div>

                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold border ${
                    village.subscriptionTier === "pro_annual"
                      ? "bg-amber-950/80 text-amber-300 border-amber-600"
                      : village.subscriptionTier === "basic_monthly"
                      ? "bg-teal-950 text-teal-300 border-teal-700"
                      : "bg-stone-800 text-stone-400 border-stone-700"
                  }`}>
                    {village.subscriptionTier === "pro_annual" ? "اشتراك سنوي Pro" :
                     village.subscriptionTier === "basic_monthly" ? "اشتراك شهري Basic" : "حساب مجاني"}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-800 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">المشرف المسؤول:</span>
                    <span className="font-bold text-amber-300">{village.supervisorName || "لم يعين مشرف بعد"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">كود الدخول المخصص:</span>
                    <span className="font-mono text-emerald-400 font-bold">{village.supervisorCode || "غير محدد"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">عدد الحصون والقصبات:</span>
                    <span className="text-stone-200">{village.castlesCount || 0} حصن موثق</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setSelectedVillageForEdit(village)}
                    className="flex-1 py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-xs text-white font-medium flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                    <span>تعديل القرية والمشرف</span>
                  </button>

                  <button
                    onClick={() => {
                      DataStore.renewVillageSubscription(village.id, "annual", "apple_pay");
                      setVillages(DataStore.getVillages());
                      setPayments(DataStore.getPayments());
                      setAuditLogs(DataStore.getAuditLogs());
                      showNotification(`تم تجديد الاشتراك السنوي لـ ${village.name} بنجاح`);
                    }}
                    className="py-2 px-3 rounded-xl bg-amber-600/10 hover:bg-amber-600/20 border border-amber-500/40 text-xs text-amber-300 font-medium transition-all"
                  >
                    <span>تجديد سنوي</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Edit Village Modal */}
          {selectedVillageForEdit && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md">
              <div className="relative w-full max-w-lg bg-stone-900 border border-stone-700 rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <h4 className="text-sm font-bold text-white font-['Amiri']">
                    تعديل بيانات: {selectedVillageForEdit.name}
                  </h4>
                  <button onClick={() => setSelectedVillageForEdit(null)} className="text-stone-400 hover:text-white">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-stone-400 mb-1">اسم المشرف</label>
                    <input
                      type="text"
                      value={selectedVillageForEdit.supervisorName || ""}
                      onChange={e => setSelectedVillageForEdit({ ...selectedVillageForEdit, supervisorName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">رقم جوال المشرف</label>
                    <input
                      type="text"
                      value={selectedVillageForEdit.supervisorPhone || ""}
                      onChange={e => setSelectedVillageForEdit({ ...selectedVillageForEdit, supervisorPhone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">كود دخول المشرف (Unique Entry Code)</label>
                    <input
                      type="text"
                      value={selectedVillageForEdit.supervisorCode || ""}
                      onChange={e => setSelectedVillageForEdit({ ...selectedVillageForEdit, supervisorCode: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-amber-300 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">خطة الاشتراك</label>
                    <select
                      value={selectedVillageForEdit.subscriptionTier || "pro_annual"}
                      onChange={e => setSelectedVillageForEdit({ ...selectedVillageForEdit, subscriptionTier: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white"
                    >
                      <option value="pro_annual">اشتراك سنوي Pro (1,400 ريال)</option>
                      <option value="basic_monthly">اشتراك شهري Basic (150 ريال)</option>
                      <option value="free">مجاني Free</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">عدد الحصون والقصبات الموثقة</label>
                    <input
                      type="number"
                      value={selectedVillageForEdit.castlesCount || 0}
                      onChange={e => setSelectedVillageForEdit({ ...selectedVillageForEdit, castlesCount: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">نبذة عن تاريخ وحصون القرية</label>
                    <textarea
                      rows={3}
                      value={selectedVillageForEdit.historyAndCastles || ""}
                      onChange={e => setSelectedVillageForEdit({ ...selectedVillageForEdit, historyAndCastles: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-stone-800">
                  <button
                    onClick={() => handleSaveVillageChanges(selectedVillageForEdit)}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-xs font-bold"
                  >
                    حفظ التغييرات
                  </button>
                  <button
                    onClick={() => setSelectedVillageForEdit(null)}
                    className="px-4 py-2.5 rounded-xl bg-stone-800 text-stone-400 text-xs font-medium"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: BOOKINGS & TOURS */}
      {adminTab === "bookings" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>إدارة حجوزات الجولات والمرشدين السياحيين</span>
            </h4>
            <span className="text-xs text-stone-400">إجمالي الحجوزات: {bookings.length}</span>
          </div>

          <div className="space-y-3">
            {bookings.map(b => (
              <div key={b.id} className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-emerald-400 font-bold">#{b.id}</span>
                      <h5 className="text-xs font-bold text-white">{b.destination}</h5>
                    </div>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      المرشد: <span className="text-stone-200 font-medium">{b.guideName}</span> | العميل: <span className="text-stone-200">{b.userName} ({b.userPhone})</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-emerald-400">{b.totalPrice} ريال</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      b.status === "confirmed" ? "bg-emerald-950 text-emerald-300 border border-emerald-800" :
                      b.status === "completed" ? "bg-teal-950 text-teal-300 border border-teal-800" :
                      "bg-amber-950 text-amber-300 border border-amber-800"
                    }`}>
                      {b.status === "confirmed" ? "مؤكد" : b.status === "completed" ? "مكتمل" : "قيد المراجعة"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between text-[11px] text-stone-400 pt-2 border-t border-stone-800/80 gap-2">
                  <span>الموعد: {b.date} ({b.timeSlot}) - عدد الزوار: {b.numberOfGuests}</span>
                  
                  <div className="flex items-center gap-1.5">
                    {b.status !== "confirmed" && (
                      <button
                        onClick={() => handleUpdateBooking(b.id, "confirmed")}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 text-[10px] font-bold"
                      >
                        تأكيد الحجز
                      </button>
                    )}
                    {b.status !== "completed" && (
                      <button
                        onClick={() => handleUpdateBooking(b.id, "completed")}
                        className="px-2.5 py-1 rounded-lg bg-teal-600/20 text-teal-300 hover:bg-teal-600/30 text-[10px] font-bold"
                      >
                        إتمام الجولة
                      </button>
                    )}
                    {b.status !== "cancelled" && (
                      <button
                        onClick={() => handleUpdateBooking(b.id, "cancelled")}
                        className="px-2.5 py-1 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 text-[10px] font-bold"
                      >
                        إلغاء
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: EXPERIENCES & WORKSHOPS (تجارب بني شهر وحجوزاتها) */}
      {adminTab === "experiences" && (
        <div className="space-y-6">
          {/* Header & Quick stats */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-stone-950 border border-stone-800">
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>إدارة تجارب بني شهر والورش التراثية وحجوزاتها</span>
              </h4>
              <p className="text-[11px] text-stone-400 mt-1">
                متابعة الحجوزات، تحصيل عمولة المنصة (12%)، وتوزيع مستحقات مقدمي التجارب المحليين
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
                عمولة التجارب: <span className="font-mono">12%</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                إجمالي حجوزات التجارب: <span className="font-mono">{experienceBookings.length}</span>
              </div>
            </div>
          </div>

          {/* Bookings Table / Cards */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-stone-300">سجل حجوزات التجارب الحالية:</h5>
            {experienceBookings.length === 0 ? (
              <div className="p-8 text-center bg-stone-950 rounded-2xl border border-stone-800 text-stone-500 text-xs">
                لا توجد حجوزات تجارب مسجلة حالياً
              </div>
            ) : (
              experienceBookings.map(eb => (
                <div key={eb.id} className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3 hover:border-stone-700 transition-all">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-amber-400 font-bold">#{eb.id}</span>
                        <span className="text-xs font-bold text-white">{eb.experienceTitle}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-stone-400 mt-1">
                        <span>المضيف: <strong className="text-stone-300">{eb.hostName}</strong></span>
                        <span>•</span>
                        <span>الزائر: <strong className="text-stone-300">{eb.userName}</strong> ({eb.userPhone})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono font-bold text-white">{eb.subtotal} ريال</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        eb.status === "confirmed" ? "bg-emerald-950 text-emerald-300 border border-emerald-800" :
                        eb.status === "completed" ? "bg-teal-950 text-teal-300 border border-teal-800" :
                        eb.status === "cancelled" ? "bg-rose-950 text-rose-300 border border-rose-800" :
                        "bg-amber-950 text-amber-300 border border-amber-800"
                      }`}>
                        {eb.status === "confirmed" ? "مؤكد" :
                         eb.status === "completed" ? "مكتمل" :
                         eb.status === "cancelled" ? "ملغي" : "قيد المراجعة"}
                      </span>
                    </div>
                  </div>

                  {/* Financial Breakdown per Booking */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 rounded-xl bg-stone-900/60 border border-stone-800/80 text-[11px]">
                    <div>
                      <span className="text-stone-400 block text-[10px]">الموعد والوقت:</span>
                      <span className="text-stone-200 font-bold">{eb.bookingDate} ({eb.timeSlot})</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">عدد المشاركين:</span>
                      <span className="text-stone-200 font-bold">{eb.guestsCount} ضيوف</span>
                    </div>
                    <div>
                      <span className="text-amber-400 block text-[10px]">عمولة المنصة ({eb.platformCommissionPercent}%):</span>
                      <span className="font-mono font-bold text-amber-300">{eb.platformCommissionAmount.toFixed(1)} ريال</span>
                    </div>
                    <div>
                      <span className="text-emerald-400 block text-[10px]">مستحق المضيف الصافي:</span>
                      <span className="font-mono font-bold text-emerald-300">{eb.hostEarnings.toFixed(1)} ريال</span>
                    </div>
                  </div>

                  {/* Action Controls */}
                  <div className="flex items-center justify-between pt-1 border-t border-stone-800/60 text-[11px]">
                    <span className="text-stone-500 font-mono text-[10px]">
                      طريقة الدفع: {eb.paymentMethod.toUpperCase()} • الحالة: {eb.paymentStatus}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {eb.status !== "confirmed" && (
                        <button
                          onClick={() => handleUpdateExpBooking(eb.id, "confirmed")}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 text-[10px] font-bold"
                        >
                          تأكيد
                        </button>
                      )}
                      {eb.status !== "completed" && (
                        <button
                          onClick={() => handleUpdateExpBooking(eb.id, "completed")}
                          className="px-2.5 py-1 rounded-lg bg-teal-600/20 text-teal-300 hover:bg-teal-600/30 text-[10px] font-bold"
                        >
                          إتمام
                        </button>
                      )}
                      {eb.status !== "cancelled" && (
                        <button
                          onClick={() => handleUpdateExpBooking(eb.id, "cancelled")}
                          className="px-2.5 py-1 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 text-[10px] font-bold"
                        >
                          إلغاء
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Experiences Master Catalog Preview */}
          <div className="space-y-3 pt-4 border-t border-stone-800">
            <h5 className="text-xs font-bold text-stone-300">دليل التجارب المعتمدة في النظام ({experiences.length} تجربة):</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {experiences.map(exp => (
                <div key={exp.id} className="p-3 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={exp.image} alt={exp.title} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <h6 className="text-xs font-bold text-white">{exp.title}</h6>
                      <span className="text-[10px] text-stone-400">{exp.hostName} • {exp.city}</span>
                    </div>
                  </div>
                  <div className="text-left font-mono">
                    <span className="text-xs font-bold text-amber-400">{exp.pricePerPerson} ريال</span>
                    <span className="text-[9px] text-stone-500 block">/ شخص</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ORDERS & FOOD STORES */}
      {adminTab === "orders" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-teal-400" />
              <span>إدارة طلبات المأكولات والأسر المنتجة</span>
            </h4>
            <span className="text-xs text-stone-400">إجمالي الطلبات: {orders.length}</span>
          </div>

          <div className="space-y-3">
            {orders.map(order => (
              <div key={order.id} className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-teal-400 font-bold">#{order.id}</span>
                      <span className="text-xs font-bold text-white">العميل: {order.userName}</span>
                      <span className="text-[10px] text-stone-500 font-mono">({order.userPhone})</span>
                    </div>
                    <p className="text-[11px] text-stone-400 mt-1">العنوان: {order.deliveryAddress} - {order.city}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-teal-400">{order.grandTotal} ريال</span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-stone-900 border border-stone-800 text-stone-300">
                      {order.status === "preparing" ? "قيد التجهيز" :
                       order.status === "on_the_way" ? "في الطريق" :
                       order.status === "delivered" ? "تم التوصيل" : "جديد"}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-stone-900/60 border border-stone-800/80 text-[11px] space-y-1">
                  {order.items.map(item => (
                    <div key={item.itemId} className="flex items-center justify-between text-stone-300">
                      <span>• {item.name} × {item.quantity}</span>
                      <span className="font-mono text-stone-400">{item.price * item.quantity} ريال</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-end gap-1.5 pt-1">
                  <button
                    onClick={() => handleUpdateOrder(order.id, "preparing")}
                    className="px-2.5 py-1 rounded-lg bg-amber-600/20 text-amber-300 text-[10px] font-bold hover:bg-amber-600/30"
                  >
                    تجهيز
                  </button>
                  <button
                    onClick={() => handleUpdateOrder(order.id, "on_the_way")}
                    className="px-2.5 py-1 rounded-lg bg-teal-600/20 text-teal-300 text-[10px] font-bold hover:bg-teal-600/30"
                  >
                    إرسال مع السائق
                  </button>
                  <button
                    onClick={() => handleUpdateOrder(order.id, "delivered")}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-300 text-[10px] font-bold hover:bg-emerald-600/30"
                  >
                    تأكيد الاستلام
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: FINANCES, COMMISSIONS & PAYMENTS */}
      {adminTab === "finances" && (
        <div className="space-y-6">
          {/* Commission Configuration Form */}
          <form onSubmit={handleSaveCommissionSettings} className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>إعدادات نسب العمولات ورسوم الاشتراكات الشهرية والسنوية</span>
              </h4>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-amber-600 text-stone-950 text-xs font-black hover:bg-amber-500 transition-all shadow-md"
              >
                حفظ الإعدادات المالية
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-stone-400">عمولة منصة المرشدين (%)</label>
                <input
                  type="number"
                  value={commissions.guideCommissionPercent}
                  onChange={e => setCommissions({ ...commissions, guideCommissionPercent: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-stone-400">عمولة متاجر الأسر المنتجة (%)</label>
                <input
                  type="number"
                  value={commissions.foodStoreCommissionPercent}
                  onChange={e => setCommissions({ ...commissions, foodStoreCommissionPercent: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-stone-400">اشتراك القرية الشهري (ريال)</label>
                <input
                  type="number"
                  value={commissions.villageMonthlyFee}
                  onChange={e => setCommissions({ ...commissions, villageMonthlyFee: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-stone-400">اشتراك القرية السنوي Pro (ريال)</label>
                <input
                  type="number"
                  value={commissions.villageAnnualFee}
                  onChange={e => setCommissions({ ...commissions, villageAnnualFee: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-white font-mono"
                />
              </div>
            </div>
          </form>

          {/* Transactions List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>سجل المعاملات والمدفوعات الإلكترونية</span>
            </h4>

            <div className="overflow-x-auto rounded-2xl border border-stone-800 bg-stone-950">
              <table className="w-full text-right text-xs">
                <thead className="bg-stone-900 text-stone-400 border-b border-stone-800">
                  <tr>
                    <th className="p-3">رقم العملية</th>
                    <th className="p-3">النوع والبيان</th>
                    <th className="p-3">الدافع / المشرف</th>
                    <th className="p-3">المبلغ الإجمالي</th>
                    <th className="p-3">صافي دخل المنصة</th>
                    <th className="p-3">وسيلة الدفع</th>
                    <th className="p-3">التاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 text-stone-300">
                  {payments.map(p => (
                    <tr key={p.id} className="hover:bg-stone-900/40">
                      <td className="p-3 font-mono text-emerald-400 text-[11px] font-bold">{p.transactionNumber}</td>
                      <td className="p-3 text-white font-medium">{p.relatedEntityName}</td>
                      <td className="p-3 text-stone-400">{p.payerName}</td>
                      <td className="p-3 font-mono text-white">{p.amount} ريال</td>
                      <td className="p-3 font-mono text-emerald-400 font-bold">{p.netAmount} ريال</td>
                      <td className="p-3 font-mono text-[10px] uppercase text-stone-400">{p.paymentMethod}</td>
                      <td className="p-3 text-[10px] text-stone-500">{new Date(p.createdAt).toLocaleDateString("ar-SA")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: COMPLAINTS & TICKETS */}
      {adminTab === "complaints" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>نظام البلاغات والشكاوى وتذاكر الدعم الفني</span>
            </h4>
            <span className="text-xs text-stone-400">{complaints.length} تذكرة</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {complaints.map(tkt => (
              <div key={tkt.id} className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-rose-400 font-bold">#{tkt.ticketNumber}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-900 text-stone-300">
                        {tkt.category}
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-white mt-1">{tkt.title}</h5>
                  </div>

                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    tkt.status === "resolved" ? "bg-emerald-950 text-emerald-300 border border-emerald-800" :
                    tkt.status === "in_progress" ? "bg-amber-950 text-amber-300 border border-amber-800" :
                    "bg-rose-950 text-rose-300 border border-rose-800"
                  }`}>
                    {tkt.status === "resolved" ? "تم الحل" : tkt.status === "in_progress" ? "قيد المتابعة" : "جديد"}
                  </span>
                </div>

                <p className="text-xs text-stone-400 leading-relaxed bg-stone-900/60 p-2.5 rounded-xl border border-stone-800/80">
                  {tkt.description}
                </p>

                {tkt.adminResponse && (
                  <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-300">
                    <span className="font-bold block text-[10px] text-emerald-400 mb-0.5">رد الإدارة والمشرف:</span>
                    {tkt.adminResponse}
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 text-[10px] text-stone-500 border-t border-stone-800/60">
                  <span>صاحب البلاغ: {tkt.userName} ({tkt.userPhone})</span>
                  <button
                    onClick={() => {
                      setSelectedComplaint(tkt);
                      setComplaintReplyText(tkt.adminResponse || "");
                    }}
                    className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] font-bold"
                  >
                    معالجة والرد
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Response Modal */}
          {selectedComplaint && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md">
              <div className="w-full max-w-md bg-stone-900 border border-stone-700 rounded-3xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <h4 className="text-xs font-bold text-white">الرد على التذكرة #{selectedComplaint.ticketNumber}</h4>
                  <button onClick={() => setSelectedComplaint(null)} className="text-stone-400 hover:text-white">
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-stone-400 block mb-1">نص الرد الرسمي:</label>
                    <textarea
                      rows={4}
                      value={complaintReplyText}
                      onChange={e => setComplaintReplyText(e.target.value)}
                      placeholder="اكتب الإجراء المتخذ والتنسيق مع مشرف القرية أو مقدم الخدمة..."
                      className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => handleResolveComplaint("resolved")}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                    >
                      اعتماد كـ "تم الحل"
                    </button>
                    <button
                      onClick={() => handleResolveComplaint("in_progress")}
                      className="px-3 py-2 rounded-xl bg-amber-600/20 text-amber-300 font-medium text-xs"
                    >
                      قيد المتابعة
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 8: REVIEWS */}
      {adminTab === "reviews" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              <span>إدارة التقييمات والمراجعات العامة</span>
            </h4>
            <span className="text-xs text-stone-400">{reviews.length} مراجعة</span>
          </div>

          <div className="space-y-3">
            {reviews.map(rev => (
              <div key={rev.id} className="p-4 rounded-2xl bg-stone-950 border border-stone-800 flex items-start justify-between gap-4">
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{rev.author}</span>
                    <span className="text-[10px] text-stone-500">({rev.city})</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800/60 font-bold">
                      {rev.attractionName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-stone-300 leading-relaxed pt-1">{rev.comment}</p>
                </div>

                <button
                  onClick={() => handleDeleteReview(rev.id)}
                  className="p-2 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 hover:bg-rose-900/60 transition-all"
                  title="حذف المراجعة"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: AUDIT LOGS AND RLS POLICIES */}
      {adminTab === "audit" && (
        <AuditAndRLSTab onOpenDatabaseSchema={onOpenDatabaseSchema} onNotification={showNotification} />
      )}
    </div>
  );
};
