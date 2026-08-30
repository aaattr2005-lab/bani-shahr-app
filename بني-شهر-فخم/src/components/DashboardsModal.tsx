import React, { useState } from "react";
import { UserProfile, GuideBooking, Order } from "../types";
import { DataStore } from "../lib/datastore";
import { AdminDashboard } from "./admin/AdminDashboard";
import { VillageSupervisorDashboard } from "./supervisor/VillageSupervisorDashboard";
import { 
  TOUR_GUIDES_DATA, 
  FOOD_SELLERS_DATA 
} from "../data/baniShahrData";
import { 
  X, 
  LayoutDashboard, 
  ShieldCheck, 
  Building, 
  Compass, 
  Utensils, 
  Database,
  Phone,
  UserCheck,
  ChevronDown
} from "lucide-react";

interface DashboardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onOpenDatabaseSchema: () => void;
  onUserUpdated?: (user: UserProfile) => void;
}

export const DashboardsModal: React.FC<DashboardsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onOpenDatabaseSchema,
  onUserUpdated
}) => {
  const [activeTab, setActiveTab] = useState<"admin" | "supervisor" | "guide" | "seller">(() => {
    if (currentUser.role === "village_supervisor") return "supervisor";
    if (currentUser.role === "tour_guide") return "guide";
    if (currentUser.role === "food_seller") return "seller";
    return "admin";
  });

  const [bookings, setBookings] = useState<GuideBooking[]>(() => DataStore.getBookings());
  const [orders, setOrders] = useState<Order[]>(() => DataStore.getOrders());

  if (!isOpen) return null;

  const handleQuickRoleSwitch = (persona: "admin" | "aqiqah_supervisor" | "madanah_supervisor" | "guide" | "seller") => {
    let updated: UserProfile;
    if (persona === "admin") {
      updated = {
        id: "usr-super-admin-01",
        name: "إدارة منصة بني شهر الموحدة",
        phone: "0500000000",
        role: "super_admin",
        city: "تنومة والنماص",
        isVerified: true,
        permissions: ["full_access"]
      };
      setActiveTab("admin");
    } else if (persona === "aqiqah_supervisor") {
      updated = {
        id: "usr-sup-aqiqah",
        name: "الشيخ عبد الله بن ظافر الشهري",
        phone: "0505123456",
        role: "village_supervisor",
        city: "تنومة",
        isVerified: true,
        assignedVillageId: "vil-al-aqiqah",
        assignedVillageName: "قرية وحصن العقيقة",
        assignedRegion: "تنومة",
        supervisorCode: "AQIQAH-77",
        subscriptionPlan: "annual",
        subscriptionStatus: "active"
      };
      setActiveTab("supervisor");
    } else if (persona === "madanah_supervisor") {
      updated = {
        id: "usr-sup-madanah",
        name: "الأستاذ سعيد بن محمد الشهري",
        phone: "0509876543",
        role: "village_supervisor",
        city: "النماص",
        isVerified: true,
        assignedVillageId: "vil-al-madanah",
        assignedVillageName: "قرية وحصن المدانة",
        assignedRegion: "النماص",
        supervisorCode: "MADANAH-99",
        subscriptionPlan: "annual",
        subscriptionStatus: "active"
      };
      setActiveTab("supervisor");
    } else if (persona === "guide") {
      updated = {
        id: "usr-guide-01",
        name: "محمد بن فهد الشهري",
        phone: "0501112233",
        role: "tour_guide",
        city: "تنومة",
        isVerified: true
      };
      setActiveTab("guide");
    } else {
      updated = {
        id: "usr-seller-01",
        name: "أم عبد الله للطبخ الشهري",
        phone: "0554443322",
        role: "food_seller",
        city: "النماص",
        isVerified: true
      };
      setActiveTab("seller");
    }

    DataStore.setCurrentUser(updated);
    if (onUserUpdated) onUserUpdated(updated);
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order["status"]) => {
    DataStore.updateOrderStatus(orderId, status);
    setOrders(DataStore.getOrders());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-stone-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-stone-900 border border-stone-700/80 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-emerald-950 via-stone-900 to-stone-900 border-b border-stone-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white font-['Amiri']">
                  مركز الإدارة والتحكم الشامل
                </h3>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-stone-800 border border-stone-700 text-amber-300 font-bold">
                  {currentUser.role === "village_supervisor" ? `مشرف (${currentUser.assignedVillageName || "القرية"})` :
                   currentUser.role === "super_admin" || currentUser.role === "admin" ? "المشرف العام" :
                   currentUser.role === "tour_guide" ? "مرشد سياحي" :
                   currentUser.role === "food_seller" ? "بائع أسر منتجة" : "زائر"}
                </span>
              </div>
              <p className="text-xs text-stone-400">
                إدارة القرى، المشرفين، الحصون، المحتوى، الحجوزات والطلبات، والمدفوعات وسجل التدقيق الأمني
              </p>
            </div>
          </div>

          {/* Persona Switcher for easy testing */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-stone-950/80 p-1 rounded-2xl border border-stone-800 text-[11px]">
              <span className="text-stone-400 px-2 flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-amber-400" />
                <span>تبديل الحساب:</span>
              </span>
              <button
                onClick={() => handleQuickRoleSwitch("admin")}
                className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
                  currentUser.role === "super_admin" || currentUser.role === "admin"
                    ? "bg-rose-900 text-white"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                المدير العام
              </button>
              <button
                onClick={() => handleQuickRoleSwitch("aqiqah_supervisor")}
                className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
                  currentUser.role === "village_supervisor" && (currentUser.assignedVillageId?.includes("aqiqah") || currentUser.supervisorCode === "AQIQAH-77")
                    ? "bg-amber-600 text-stone-950"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                مشرف العقيقة
              </button>
              <button
                onClick={() => handleQuickRoleSwitch("madanah_supervisor")}
                className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
                  currentUser.role === "village_supervisor" && (currentUser.assignedVillageId?.includes("madanah") || currentUser.supervisorCode === "MADANAH-99")
                    ? "bg-amber-600 text-stone-950"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                مشرف المدانة
              </button>
            </div>

            <button
              onClick={onOpenDatabaseSchema}
              className="px-3 py-1.5 rounded-xl bg-stone-800 border border-stone-700 text-emerald-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-all"
              title="عرض وتصدير كود Firebase Firestore"
            >
              <Database className="w-3.5 h-3.5" />
              <span>مخطط Firebase Firestore</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dashboard Main Tabs */}
        <div className="px-6 pt-3 border-b border-stone-800 bg-stone-950/40 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("admin")}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "admin"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-stone-400 hover:text-stone-200"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>لوحة المشرف العام (Admin)</span>
          </button>

          <button
            onClick={() => setActiveTab("supervisor")}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "supervisor"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-stone-400 hover:text-stone-200"
            }`}
          >
            <Building className="w-4 h-4 text-amber-400" />
            <span>لوحة مشرف القرية (Village Supervisor)</span>
          </button>

          <button
            onClick={() => setActiveTab("guide")}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "guide"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-stone-400 hover:text-stone-200"
            }`}
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>بوابة المرشد السياحي</span>
          </button>

          <button
            onClick={() => setActiveTab("seller")}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "seller"
                ? "border-teal-500 text-teal-400"
                : "border-transparent text-stone-400 hover:text-stone-200"
            }`}
          >
            <Utensils className="w-4 h-4 text-teal-400" />
            <span>بوابة الأسر المنتجة والبائعين</span>
          </button>
        </div>

        {/* Dashboard Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: COMPREHENSIVE ADMIN */}
          {activeTab === "admin" && (
            <AdminDashboard
              currentUser={currentUser}
              onOpenDatabaseSchema={onOpenDatabaseSchema}
            />
          )}

          {/* TAB 2: VILLAGE SUPERVISOR */}
          {activeTab === "supervisor" && (
            <VillageSupervisorDashboard
              currentUser={currentUser}
            />
          )}

          {/* TAB 3: TOUR GUIDE PORTAL */}
          {activeTab === "guide" && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-stone-900 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={TOUR_GUIDES_DATA[0].avatarUrl}
                    alt="Guide"
                    className="w-12 h-12 rounded-xl object-cover border border-emerald-400"
                  />
                  <div>
                    <h4 className="text-base font-bold text-white font-['Amiri']">{TOUR_GUIDES_DATA[0].name}</h4>
                    <span className="text-xs text-emerald-400">{TOUR_GUIDES_DATA[0].title}</span>
                  </div>
                </div>

                <div className="text-left">
                  <span className="text-xs text-stone-400 block">إجمالي أرباح الرحلات</span>
                  <span className="text-xl font-bold text-amber-400 font-mono">1,050 ر.س</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <h4 className="text-sm font-bold text-white">الرحلات والحجوزات القادمة</h4>
                {bookings.map((b) => (
                  <div key={b.id} className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{b.destination}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300">
                          {b.status}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 mt-1">
                        العميل: {b.userName} ({b.userPhone}) • عدد الأفراد: {b.numberOfGuests} • التاريخ: {b.date} ({b.timeSlot})
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-amber-400 font-mono">{b.totalPrice} ر.س</span>
                      <a
                        href={`tel:${b.userPhone}`}
                        className="p-2 rounded-lg bg-emerald-700 text-white hover:bg-emerald-600 transition-all"
                        title="اتصال بالعميل"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: FOOD SELLER PORTAL */}
          {activeTab === "seller" && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 to-stone-900 border border-amber-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={FOOD_SELLERS_DATA[0].avatarUrl}
                    alt="Seller"
                    className="w-12 h-12 rounded-xl object-cover border border-amber-400"
                  />
                  <div>
                    <h4 className="text-base font-bold text-white font-['Amiri']">{FOOD_SELLERS_DATA[0].storeName}</h4>
                    <span className="text-xs text-amber-400">{FOOD_SELLERS_DATA[0].specialty}</span>
                  </div>
                </div>

                <div className="text-left">
                  <span className="text-xs text-stone-400 block">إجمالي مبيعات اليوم</span>
                  <span className="text-xl font-bold text-emerald-400 font-mono">811.25 ر.س</span>
                </div>
              </div>

              {/* Incoming Orders to Prepare */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <h4 className="text-sm font-bold text-white">طلبات الطعام الواردة للتحضير والتوصيل</h4>
                {orders.map((o) => (
                  <div key={o.id} className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">طلب رقم #{o.id}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-900/60 text-amber-300">
                          {o.status}
                        </span>
                      </div>
                      <p className="text-xs text-stone-300 mt-1">
                        العميل: {o.userName} ({o.userPhone}) • العنوان: {o.city} - {o.deliveryAddress}
                      </p>
                      <div className="mt-1 text-xs text-emerald-400">
                        {o.items.map(i => `${i.quantity}x ${i.name}`).join(", ")}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as any)}
                        className="px-2.5 py-1.5 rounded-xl bg-stone-950 border border-stone-700 text-white text-xs"
                      >
                        <option value="new">طلب جديد</option>
                        <option value="preparing">قيد التحضير</option>
                        <option value="on_the_way">جاري التوصيل</option>
                        <option value="delivered">تم التسليم</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
