import React, { useState } from "react";
import { UserProfile, GuideBooking, ExperienceBooking, Order } from "../types";
import { DataStore } from "../lib/datastore";
import { useLanguage } from "../lib/i18n";
import { auth, googleProvider } from "../lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { PrivacyPolicyModal } from "./PrivacyPolicyModal";
import {
  X,
  Wallet,
  Trophy,
  Ticket,
  Bell,
  MessageSquare,
  User,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  LogIn,
  Crown,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Gift,
  Star,
  Globe,
  Moon,
  Sun,
  Lock,
  Headphones,
  FileText,
  AlertCircle,
  Layers,
  Award,
  Compass,
  Utensils,
  CloudRain,
  Zap,
  Volume2
} from "lucide-react";
import { pushNotificationService, playNotificationSound } from "../lib/pushNotifications";

interface AccountMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUserUpdated: (user: UserProfile) => void;
  onOpenWallet?: () => void;
  onOpenNotifications?: () => void;
  unreadNotificationsCount?: number;
  onOpenChat?: () => void;
  onOpenDashboards?: () => void;
  onOpenSupervisorNomination?: () => void;
  onOpenAdminLogin?: () => void;
}

type SubViewType = 
  | "main_menu" 
  | "member_benefits" 
  | "bookings_orders" 
  | "edit_profile" 
  | "preferences" 
  | "support" 
  | "auth_login";

export const AccountMenuModal: React.FC<AccountMenuModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserUpdated,
  onOpenWallet,
  onOpenNotifications,
  unreadNotificationsCount = 0,
  onOpenChat,
  onOpenDashboards,
  onOpenSupervisorNomination,
  onOpenAdminLogin,
}) => {
  const { language, toggleLanguage, t } = useLanguage();
  const isRtl = language === "ar";
  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight;

  const [currentSubView, setCurrentSubView] = useState<SubViewType>("main_menu");
  
  // Profile edit state
  const [name, setName] = useState(currentUser.name || "عضو ديار بني شهر");
  const [phone, setPhone] = useState(currentUser.phone || "0501234567");
  const [city, setCity] = useState(currentUser.city || "النماص");
  const [selectedRole, setSelectedRole] = useState<UserProfile["role"]>(currentUser.role || "visitor");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Bookings sub-view tab
  const [bookingsTab, setBookingsTab] = useState<"guides" | "experiences" | "orders">("guides");
  const [guideBookings, setGuideBookings] = useState<GuideBooking[]>(() => DataStore.getBookings());
  const [experienceBookings, setExperienceBookings] = useState<ExperienceBooking[]>(() => DataStore.getExperienceBookings());
  const [foodOrders, setFoodOrders] = useState<Order[]>(() => DataStore.getOrders());

  // Preferences state
  const [darkMode, setDarkMode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [weatherAlertsEnabled, setWeatherAlertsEnabled] = useState<boolean>(() => DataStore.getWeatherAlertsPreference(currentUser.id));
  const [tribalAlertsEnabled, setTribalAlertsEnabled] = useState<boolean>(() => DataStore.getTribalAlertsPreference(currentUser.id));
  const [weatherActionStatus, setWeatherActionStatus] = useState<string | null>(null);
  const [isProcessingWeather, setIsProcessingWeather] = useState(false);

  // Support / Tickets state
  const [supportTopic, setSupportTopic] = useState("استفسار عام");
  const [supportMessage, setSupportMessage] = useState("");
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  // Auth / Login state
  const [phoneLogin, setPhoneLogin] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loginStep, setLoginStep] = useState<"phone" | "otp">("phone");
  const [authError, setAuthError] = useState<string | null>(null);
  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  if (!isOpen) return null;

  const wallet = DataStore.getWallet();
  const isAdmin = currentUser.role === "admin" || currentUser.role === "super_admin";
  const isSupervisor = currentUser.role === "village_supervisor";
  const isGuest = currentUser.role === "visitor" && (!currentUser.isVerified || currentUser.id.startsWith("guest"));

  // Calculate membership points and tier
  const memberPoints = 480;
  const memberTier = isAdmin ? "إدارة المنصة" : isSupervisor ? "مشرف موثق" : "عضو ذهبي (سفير الديرة)";

  const handleSaveProfile = () => {
    setIsSaving(true);
    const updated: UserProfile = {
      ...currentUser,
      name,
      phone,
      city,
      role: selectedRole,
      isVerified: true
    };
    DataStore.setCurrentUser(updated);
    onUserUpdated(updated);
    setTimeout(() => {
      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        setCurrentSubView("main_menu");
      }, 900);
    }, 400);
  };

  const handleSignOut = () => {
    signOut(auth).catch(console.error);
    const guestUser: UserProfile = {
      id: "guest-user-" + Date.now().toString(36),
      name: "زائر ديار بني شهر",
      phone: "",
      role: "visitor",
      isVerified: false,
      city: "النماص"
    };
    DataStore.setCurrentUser(guestUser);
    onUserUpdated(guestUser);
    onClose();
  };

  const handleGoogleSignIn = async () => {
    if (!privacyPolicyAccepted) {
      setAuthError("يجب الموافقة على سياسة الخصوصية للمتابعة");
      return;
    }
    try {
      setAuthError(null);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const updatedUser: UserProfile = {
        ...currentUser,
        id: user.uid,
        name: user.displayName || "عضو بني شهر",
        email: user.email || undefined,
        isVerified: true,
        role: user.email === "aaattr2005@gmail.com" ? "admin" : "visitor",
      };
      DataStore.setCurrentUser(updatedUser);
      onUserUpdated(updatedUser);
      setCurrentSubView("main_menu");
    } catch (err: any) {
      setAuthError(err?.message || "تعذر تسجيل الدخول عبر Google");
    }
  };

  const handlePhoneLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!privacyPolicyAccepted) {
      setAuthError("يجب الموافقة على سياسة الخصوصية للمتابعة");
      return;
    }
    if (!phoneLogin || phoneLogin.length < 9) {
      setAuthError("يرجى إدخال رقم جوال صحيح");
      return;
    }
    setAuthError(null);
    setLoginStep("otp");
  };

  const handleVerifyOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!privacyPolicyAccepted) {
      setAuthError("يجب الموافقة على سياسة الخصوصية للمتابعة");
      return;
    }
    const updatedUser: UserProfile = {
      ...currentUser,
      id: "usr-" + Date.now().toString(36),
      name: name || "عضو بني شهر",
      phone: phoneLogin,
      isVerified: true,
      role: currentUser.role || "visitor"
    };
    DataStore.setCurrentUser(updatedUser);
    onUserUpdated(updatedUser);
    setCurrentSubView("main_menu");
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;

    DataStore.saveComplaint({
      id: "cmp-" + Date.now(),
      ticketNumber: "TKT-" + Math.floor(1000 + Math.random() * 9000),
      userId: currentUser.id,
      userName: currentUser.name,
      userPhone: currentUser.phone || "0501234567",
      category: "اقتراح وتطوير",
      title: supportTopic,
      description: supportMessage,
      status: "new",
      priority: "medium",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    setTicketSubmitted(true);
    setSupportMessage("");
    setTimeout(() => {
      setTicketSubmitted(false);
      setCurrentSubView("main_menu");
    }, 1500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-lg bg-stone-900 border border-stone-800 text-stone-100 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] font-['IBM_Plex_Sans_Arabic',sans-serif]"
        style={{
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.08)"
        }}
      >
        {/* Top Header */}
        <div className="px-6 pt-5 pb-4 border-b border-stone-800/80 flex items-center justify-between bg-stone-900/90 shrink-0">
          <div className="flex items-center gap-3">
            {currentSubView !== "main_menu" ? (
              <button
                onClick={() => setCurrentSubView("main_menu")}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors flex items-center gap-1 text-xs font-bold"
                id="account-back-btn"
              >
                <ChevronLeft className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
                <span>{language === "ar" ? "رجوع" : "Back"}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-950">
                  <User className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-white font-['Amiri'] sm:text-2xl">
                  {language === "ar" ? "حسابي (Account)" : "Account"}
                </h2>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
            id="close-account-modal-btn"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Container with Scroll */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6 scrollbar-thin scrollbar-thumb-stone-700">
          
          {/* ================= VIEW 1: MAIN TRIPADVISOR-STYLE MENU ================= */}
          {currentSubView === "main_menu" && (
            <div className="space-y-6">
              
              {/* User Identity Hero Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-stone-800/90 via-stone-850 to-stone-900 border border-stone-700/60 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative shrink-0">
                    <div className="w-13 h-13 rounded-2xl bg-emerald-700/30 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold text-lg shadow-inner">
                      {currentUser.name ? currentUser.name.charAt(0) : "ب"}
                    </div>
                    {currentUser.isVerified && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-stone-950 flex items-center justify-center shadow-md">
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white truncate">{currentUser.name}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-medium shrink-0">
                        {memberTier}
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 mt-0.5 flex items-center gap-1.5 truncate">
                      <span>{currentUser.phone || "لم يربط جوال"}</span>
                      {currentUser.city && (
                        <>
                          <span className="text-stone-600">•</span>
                          <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3 text-emerald-400" />{currentUser.city}</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentSubView("edit_profile")}
                  className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-bold text-stone-200 border border-stone-700 transition-colors shrink-0"
                  id="btn-quick-edit-profile"
                >
                  {language === "ar" ? "تعديل" : "Edit"}
                </button>
              </div>

              {/* ================= SECTION 1: TRIPADVISOR REWARDS / مكافآت ديار بني شهر ================= */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 px-1 font-['Amiri'] text-sm">
                  {language === "ar" ? "مكافآت ديار بني شهر (Tripadvisor Rewards)" : "Bani Shahr Rewards"}
                </h4>

                <div className="bg-stone-950/60 rounded-2xl border border-stone-800/80 divide-y divide-stone-800/60 overflow-hidden shadow-sm">
                  
                  {/* 1. Wallet / المحفظة */}
                  <button
                    onClick={() => {
                      if (onOpenWallet) {
                        onClose();
                        onOpenWallet();
                      } else {
                        setCurrentSubView("bookings_orders");
                      }
                    }}
                    className="w-full p-4 flex items-center justify-between hover:bg-stone-800/50 transition-colors text-right group"
                    id="menu-item-wallet"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                        <Wallet className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{language === "ar" ? "المحفظة والرصيد" : "Wallet"}</span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 font-mono font-bold">
                            {wallet.balance.toFixed(2)} ر.س
                          </span>
                        </div>
                        <p className="text-xs text-stone-400 mt-0.5">{language === "ar" ? "شحن الرصيد والمدفوعات والمسترجعات" : "Recharge, balance & payments"}</p>
                      </div>
                    </div>
                    <ChevronIcon className="w-5 h-5 text-stone-500 group-hover:text-white transition-colors" />
                  </button>

                  {/* 2. Member Benefits / مزايا العضوية */}
                  <button
                    onClick={() => setCurrentSubView("member_benefits")}
                    className="w-full p-4 flex items-center justify-between hover:bg-stone-800/50 transition-colors text-right group"
                    id="menu-item-benefits"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{language === "ar" ? "مزايا العضوية والرتب" : "Member benefits"}</span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-medium">
                            {memberPoints} نقطة
                          </span>
                        </div>
                        <p className="text-xs text-stone-400 mt-0.5">{language === "ar" ? "خصومات المرشدين، الأولوية، والهدايا التراثية" : "Exclusive tiers & discounts"}</p>
                      </div>
                    </div>
                    <ChevronIcon className="w-5 h-5 text-stone-500 group-hover:text-white transition-colors" />
                  </button>

                  {/* 3. Bookings & Orders / الحجوزات والطلبات */}
                  <button
                    onClick={() => setCurrentSubView("bookings_orders")}
                    className="w-full p-4 flex items-center justify-between hover:bg-stone-800/50 transition-colors text-right group"
                    id="menu-item-bookings"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                        <Ticket className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{language === "ar" ? "الحجوزات والطلبات" : "Bookings"}</span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 font-mono font-bold">
                            {guideBookings.length + experienceBookings.length + foodOrders.length} سجل
                          </span>
                        </div>
                        <p className="text-xs text-stone-400 mt-0.5">{language === "ar" ? "جولات المرشدين، التجارب السياحية، وطلبات الأسر" : "Tours, experiences & food orders"}</p>
                      </div>
                    </div>
                    <ChevronIcon className="w-5 h-5 text-stone-500 group-hover:text-white transition-colors" />
                  </button>

                </div>
              </div>

              {/* ================= SECTION 2: COMMUNICATION / التواصل والإشعارات ================= */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 px-1 font-['Amiri'] text-sm">
                  {language === "ar" ? "التواصل والإشعارات (Communication)" : "Communication"}
                </h4>

                <div className="bg-stone-950/60 rounded-2xl border border-stone-800/80 divide-y divide-stone-800/60 overflow-hidden shadow-sm">
                  
                  {/* Notifications */}
                  <button
                    onClick={() => {
                      if (onOpenNotifications) {
                        onClose();
                        onOpenNotifications();
                      }
                    }}
                    className="w-full p-4 flex items-center justify-between hover:bg-stone-800/50 transition-colors text-right group"
                    id="menu-item-notifications"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="relative w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                        <Bell className="w-5 h-5" />
                        {unreadNotificationsCount > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow">
                            {unreadNotificationsCount}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{language === "ar" ? "الإشعارات والتنبيهات" : "Notifications"}</span>
                          {unreadNotificationsCount > 0 && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-bold">
                              {unreadNotificationsCount} جديد
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-400 mt-0.5">{language === "ar" ? "تحديثات الحجوزات، رسائل المشرفين، وإعلانات القبيلة" : "Alerts, broadcasts & updates"}</p>
                      </div>
                    </div>
                    <ChevronIcon className="w-5 h-5 text-stone-500 group-hover:text-white transition-colors" />
                  </button>

                  {/* Live In-App Chat / Messages */}
                  <button
                    onClick={() => {
                      if (onOpenChat) {
                        onClose();
                        onOpenChat();
                      }
                    }}
                    className="w-full p-4 flex items-center justify-between hover:bg-stone-800/50 transition-colors text-right group"
                    id="menu-item-messages"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-white">{language === "ar" ? "المحادثات المباشرة" : "Messages"}</span>
                        <p className="text-xs text-stone-400 mt-0.5">{language === "ar" ? "محادثة مشفري القرى، المرشدين، والأسر المنتجة" : "Direct messaging with sellers & guides"}</p>
                      </div>
                    </div>
                    <ChevronIcon className="w-5 h-5 text-stone-500 group-hover:text-white transition-colors" />
                  </button>

                </div>
              </div>

              {/* ================= SECTION 3: MANAGE ACCOUNT / إدارة الحساب ================= */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 px-1 font-['Amiri'] text-sm">
                  {language === "ar" ? "إدارة الحساب (Manage account)" : "Manage account"}
                </h4>

                <div className="bg-stone-950/60 rounded-2xl border border-stone-800/80 divide-y divide-stone-800/60 overflow-hidden shadow-sm">
                  
                  {/* Profile */}
                  <button
                    onClick={() => setCurrentSubView("edit_profile")}
                    className="w-full p-4 flex items-center justify-between hover:bg-stone-800/50 transition-colors text-right group"
                    id="menu-item-profile"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-stone-800 text-stone-300 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-white">{language === "ar" ? "الملف الشخصي والبيانات" : "Profile"}</span>
                        <p className="text-xs text-stone-400 mt-0.5">{language === "ar" ? "الاسم، القبيلة، والمدينة ورقم الجوال" : "Edit personal info & tribe"}</p>
                      </div>
                    </div>
                    <ChevronIcon className="w-5 h-5 text-stone-500 group-hover:text-white transition-colors" />
                  </button>

                  {/* Preferences */}
                  <button
                    onClick={() => setCurrentSubView("preferences")}
                    className="w-full p-4 flex items-center justify-between hover:bg-stone-800/50 transition-colors text-right group"
                    id="menu-item-preferences"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-stone-800 text-stone-300 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                        <Settings className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-white">{language === "ar" ? "التفضيلات والإعدادات" : "Preferences"}</span>
                        <p className="text-xs text-stone-400 mt-0.5">{language === "ar" ? "اللغة، المظهر، وأذونات الإشعارات" : "Language, theme & settings"}</p>
                      </div>
                    </div>
                    <ChevronIcon className="w-5 h-5 text-stone-500 group-hover:text-white transition-colors" />
                  </button>

                  {/* Support */}
                  <button
                    onClick={() => setCurrentSubView("support")}
                    className="w-full p-4 flex items-center justify-between hover:bg-stone-800/50 transition-colors text-right group"
                    id="menu-item-support"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-stone-800 text-stone-300 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                        <HelpCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-white">{language === "ar" ? "الدعم الفني والمساعدة" : "Support"}</span>
                        <p className="text-xs text-stone-400 mt-0.5">{language === "ar" ? "مركز المساعدة، البلاغات والاقتراحات، والواتساب" : "Help center, FAQ & contact"}</p>
                      </div>
                    </div>
                    <ChevronIcon className="w-5 h-5 text-stone-500 group-hover:text-white transition-colors" />
                  </button>

                  {/* Privacy Policy */}
                  <button
                    onClick={() => setShowPrivacyModal(true)}
                    className="w-full p-4 flex items-center justify-between hover:bg-stone-800/50 transition-colors text-right group border-t border-stone-800/50"
                    id="menu-item-privacy-policy"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-white">{language === "ar" ? "سياسة الخصوصية وحماية البيانات" : "Privacy Policy"}</span>
                        <p className="text-xs text-stone-400 mt-0.5">{language === "ar" ? "حقوق البيانات، سياسة الجمع والاستخدام الآمن" : "Data protection & privacy policy"}</p>
                      </div>
                    </div>
                    <ChevronIcon className="w-5 h-5 text-stone-500 group-hover:text-white transition-colors" />
                  </button>

                </div>
              </div>

              {/* ================= SECTION 4: SUPERVISION & ADMIN PORTAL ================= */}
              {(isAdmin || isSupervisor) ? (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 px-1 font-['Amiri'] text-sm flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5" />
                    <span>{language === "ar" ? "بوابة الإدارة والإشراف" : "Administration & Moderation"}</span>
                  </h4>

                  <div className="bg-amber-950/30 rounded-2xl border border-amber-500/40 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-amber-200">
                          {isAdmin ? "لوحة الإدارة الشاملة (المدير العام)" : `لوحة مشرف ${currentUser.assignedVillageName || "القرية"}`}
                        </h4>
                        <p className="text-xs text-stone-300 mt-0.5">إدارة المحتوى، الأنساب، المشرفين، والمالية</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        if (onOpenDashboards) onOpenDashboards();
                      }}
                      className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-transform active:scale-95 shrink-0"
                      id="btn-jump-dashboards"
                    >
                      {language === "ar" ? "دخول اللوحة" : "Open Panel"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <h5 className="text-xs font-bold text-stone-200">هل ترغب بالإشراف على قريتك أو قبيلتك؟</h5>
                      <p className="text-[11px] text-stone-400">قدم طلب ترشيح المشرفين المعتمدين</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      if (onOpenSupervisorNomination) onOpenSupervisorNomination();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-emerald-400 border border-emerald-500/30 text-xs font-bold shrink-0"
                  >
                    ترشيح الآن
                  </button>
                </div>
              )}

              {/* ================= BOTTOM ACTION: SIGN OUT OR SIGN IN ================= */}
              <div className="pt-2">
                {isGuest ? (
                  <button
                    onClick={() => setCurrentSubView("auth_login")}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 hover:brightness-110 transition-all"
                    id="btn-account-signin"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{language === "ar" ? "تسجيل الدخول / إنشاء حساب جديد" : "Sign In / Register"}</span>
                  </button>
                ) : (
                  <button
                    onClick={handleSignOut}
                    className="w-full py-3 px-4 rounded-2xl bg-red-950/30 hover:bg-red-950/50 border border-red-900/40 text-red-400 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                    id="btn-account-signout"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{language === "ar" ? "Sign Out (تسجيل الخروج)" : "Sign Out"}</span>
                  </button>
                )}
              </div>

            </div>
          )}

          {/* ================= VIEW 2: MEMBER BENEFITS SUB-VIEW ================= */}
          {currentSubView === "member_benefits" && (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-600/20 via-stone-900 to-stone-950 border border-amber-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">Current Tier</span>
                  <Award className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-white font-['Amiri']">{memberTier}</h3>
                
                {/* Progress bar to next level */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-stone-300">
                    <span>{memberPoints} نقطة ولاء</span>
                    <span>الرتبة التالية: سفير بني شهر (1000 نقطة)</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-stone-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full" style={{ width: "48%" }} />
                  </div>
                </div>
              </div>

              {/* Active Perks List */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-stone-200">المزايا والحوافز النشطة لحسابك:</h4>
                <div className="grid gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center gap-3">
                    <Gift className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <span className="font-bold text-white block">خصم 10% دائم على جولات المرشدين</span>
                      <span className="text-stone-400">يطبق تلقائياً عند حجز أي جولة جبلية أو تاريخية.</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <span className="font-bold text-white block">أولوية حجز التجارب والمواسم السياحية</span>
                      <span className="text-stone-400">حجز مبكر لفعاليات قطاف الفواكه وجني العسل والتخييم.</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center gap-3">
                    <Star className="w-5 h-5 text-teal-400 shrink-0" />
                    <div>
                      <span className="font-bold text-white block">صندوق هدايا تذكاري من تراث بني شهر</span>
                      <span className="text-stone-400">يستلم عند إكمال 5 زيارات موثقة للقرى التراثية.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= VIEW 3: BOOKINGS & ORDERS SUB-VIEW ================= */}
          {currentSubView === "bookings_orders" && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Tab Selector */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-950 rounded-xl border border-stone-800 text-xs font-bold">
                <button
                  onClick={() => setBookingsTab("guides")}
                  className={`py-2 rounded-lg transition-all ${
                    bookingsTab === "guides" ? "bg-emerald-700 text-white shadow" : "text-stone-400 hover:text-white"
                  }`}
                >
                  المرشدون ({guideBookings.length})
                </button>
                <button
                  onClick={() => setBookingsTab("experiences")}
                  className={`py-2 rounded-lg transition-all ${
                    bookingsTab === "experiences" ? "bg-emerald-700 text-white shadow" : "text-stone-400 hover:text-white"
                  }`}
                >
                  التجارب ({experienceBookings.length})
                </button>
                <button
                  onClick={() => setBookingsTab("orders")}
                  className={`py-2 rounded-lg transition-all ${
                    bookingsTab === "orders" ? "bg-emerald-700 text-white shadow" : "text-stone-400 hover:text-white"
                  }`}
                >
                  المطبخ ({foodOrders.length})
                </button>
              </div>

              {/* Guide Bookings */}
              {bookingsTab === "guides" && (
                <div className="space-y-3">
                  {guideBookings.map((b) => (
                    <div key={b.id} className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-emerald-400">{b.id}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-bold">
                          {b.status === "confirmed" ? "مؤكد ومسدد" : "قيد المراجعة"}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{b.destination}</h4>
                      <p className="text-xs text-stone-400">المرشد: {b.guideName} • التاريخ: {b.date}</p>
                      <div className="pt-2 flex items-center justify-between border-t border-stone-800/80 text-xs">
                        <span className="font-mono font-bold text-amber-400">{b.totalPrice} ر.س</span>
                        <span className="text-stone-400">{b.numberOfGuests} ضيوف</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Experience Bookings */}
              {bookingsTab === "experiences" && (
                <div className="space-y-3">
                  {experienceBookings.map((eb) => (
                    <div key={eb.id} className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-teal-400">{eb.id}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-300 font-bold">
                          {eb.status === "confirmed" ? "حجز مؤكد" : "قيد التنفيذ"}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{eb.experienceTitle}</h4>
                      <p className="text-xs text-stone-400">الموعد: {eb.date} • {eb.timeSlot}</p>
                      <div className="pt-2 flex items-center justify-between border-t border-stone-800/80 text-xs">
                        <span className="font-mono font-bold text-amber-400">{eb.totalPrice} ر.س</span>
                        <span className="text-stone-400">{eb.guestCount} تذاكر</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Food Orders */}
              {bookingsTab === "orders" && (
                <div className="space-y-3">
                  {foodOrders.map((o) => (
                    <div key={o.id} className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-amber-400">{o.id}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-bold">
                          {o.status === "delivered" ? "تم التسليم" : o.status === "preparing" ? "جاري التحضير" : "قيد التوصيل"}
                        </span>
                      </div>
                      <p className="text-xs text-stone-300 font-medium">المتجر: {o.sellerName || "الأسر المنتجة"}</p>
                      <div className="text-xs text-stone-400">
                        {o.items.map(it => `${it.name} (x${it.quantity})`).join("، ")}
                      </div>
                      <div className="pt-2 flex items-center justify-between border-t border-stone-800/80 text-xs">
                        <span className="font-mono font-bold text-emerald-400">{o.grandTotal.toFixed(2)} ر.س</span>
                        <span className="text-stone-400">{o.paymentMethod.toUpperCase()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* ================= VIEW 4: EDIT PROFILE SUB-VIEW ================= */}
          {currentSubView === "edit_profile" && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-base font-bold text-white font-['Amiri']">تعديل بيانات الملف الشخصي</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-stone-300 mb-1 font-medium">الاسم الكامل</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-stone-300 mb-1 font-medium">رقم الجوال</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs text-stone-300 mb-1 font-medium">المدينة / المنطقة</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="النماص">النماص</option>
                    <option value="تنومة">تنومة</option>
                    <option value="المجاردة">المجاردة</option>
                    <option value="السراة وتهامة">السراة وتهامة</option>
                    <option value="الرياض">الرياض</option>
                    <option value="جدة">جدة</option>
                    <option value="الدمام">الدمام</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-stone-300 mb-1 font-medium">نوع العضوية / الدور</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="visitor">زائر / سائح</option>
                    <option value="tour_guide">مرشد سياحي مرخص</option>
                    <option value="food_seller">أسرة منتجة / مطبخ محلي</option>
                    <option value="village_supervisor">مشرف قرية / قبيلة</option>
                    <option value="admin">مدير عام المنصة</option>
                  </select>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <span>جاري الحفظ...</span>
                  ) : savedSuccess ? (
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> تم الحفظ بنجاح!</span>
                  ) : (
                    <span>حفظ التعديلات</span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ================= VIEW 5: PREFERENCES SUB-VIEW ================= */}
          {currentSubView === "preferences" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white font-['Amiri']">التفضيلات وإعدادات الإشعارات</h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-stone-900 border border-stone-800 text-stone-400">
                  Open-Meteo & FCM Ready
                </span>
              </div>

              {/* Status Alert feedback */}
              {weatherActionStatus && (
                <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{weatherActionStatus}</span>
                  </div>
                  <button 
                    onClick={() => setWeatherActionStatus(null)}
                    className="text-stone-400 hover:text-white p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="bg-stone-950 rounded-2xl border border-stone-800 divide-y divide-stone-800 text-sm">
                
                {/* Language */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <span className="font-bold text-white block">اللغة (Language)</span>
                      <span className="text-xs text-stone-400">العربية أو English</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleLanguage()}
                    className="px-3 py-1.5 rounded-xl bg-stone-800 text-xs font-bold text-stone-200 border border-stone-700"
                  >
                    {language === "ar" ? "English (🇬🇧)" : "العربية (🇸🇦)"}
                  </button>
                </div>

                {/* Dark Mode */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Moon className="w-5 h-5 text-indigo-400 shrink-0" />
                    <div>
                      <span className="font-bold text-white block">المظهر الداكن</span>
                      <span className="text-xs text-stone-400">نمط ديار بني شهر الليلي</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${darkMode ? "bg-emerald-600" : "bg-stone-800"}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${darkMode ? "translate-x-0" : "translate-x-6"}`} />
                  </button>
                </div>

                {/* Weather & Rain Alerts Toggle (Open-Meteo Automatic Hourly Monitor) */}
                <div className="p-4 space-y-3 bg-gradient-to-b from-sky-950/20 to-transparent">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-sky-950 border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                        <CloudRain className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white block">تنبيهات الطقس وهطول الأمطار</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            weatherAlertsEnabled 
                              ? "bg-emerald-950/80 border border-emerald-500/40 text-emerald-300" 
                              : "bg-stone-900 border border-stone-800 text-stone-500"
                          }`}>
                            {weatherAlertsEnabled ? "مفعل 🟢" : "متوقف ⚪"}
                          </span>
                        </div>
                        <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                          فحص تلقائي كل ساعة لبيانات <span className="text-sky-300 font-mono">Open-Meteo</span> لمنطقتي <span className="font-bold text-white">النماص وتنومة</span>، وإرسال إشعار فوري (Push Notification) فور رصد احتمالية أو هطول أمطار حتى لو كان التطبيق مغلقاً.
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        const nextVal = !weatherAlertsEnabled;
                        setWeatherAlertsEnabled(nextVal);
                        DataStore.setWeatherAlertsPreference(currentUser.id, nextVal);
                        setWeatherActionStatus(nextVal ? "تم تفعيل تنبيهات الطقس وهطول الأمطار التلقائية" : "تم إيقاف تنبيهات الطقس");
                      }}
                      className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${weatherAlertsEnabled ? "bg-sky-600" : "bg-stone-800"}`}
                      id="toggle-weather-alerts"
                    >
                      <div className={`w-5 h-5 rounded-full bg-white transition-transform ${weatherAlertsEnabled ? "translate-x-0" : "translate-x-6"}`} />
                    </button>
                  </div>

                  {/* Quick Action Tools for Weather Alerts */}
                  {weatherAlertsEnabled && (
                    <div className="pt-2 border-t border-stone-800/80 grid grid-cols-2 gap-2">
                      <button
                        onClick={async () => {
                          setIsProcessingWeather(true);
                          setWeatherActionStatus(null);
                          try {
                            await pushNotificationService.sendWeatherRainPushAlert({
                              cityName: "النماص وتنومة",
                              severity: "moderate",
                              severityAr: "أمطار متوسطة مع ضباب السراة",
                              precipMm: 3.8,
                              isTest: true
                            });
                            setWeatherActionStatus("تم إرسال إشعار مطري تجريبي وتشغيل نغمة المطر بنجاح 🌧️");
                          } catch (e: any) {
                            setWeatherActionStatus("فشل إرسال الإشعار التجريبي: " + (e?.message || ""));
                          } finally {
                            setIsProcessingWeather(false);
                          }
                        }}
                        disabled={isProcessingWeather}
                        className="p-2 rounded-xl bg-sky-950/60 hover:bg-sky-900/60 border border-sky-800/40 text-sky-200 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                        id="btn-test-weather-notification"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                        <span>تجربة إشعار المطر</span>
                      </button>

                      <button
                        onClick={async () => {
                          setIsProcessingWeather(true);
                          setWeatherActionStatus(null);
                          try {
                            const res = await pushNotificationService.triggerServerWeatherCheck();
                            setWeatherActionStatus(res.message || "تم فحص حالة الطقس عبر خادم Open-Meteo بنجاح");
                          } catch (e: any) {
                            setWeatherActionStatus("فشل الفحص: " + (e?.message || ""));
                          } finally {
                            setIsProcessingWeather(false);
                          }
                        }}
                        disabled={isProcessingWeather}
                        className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                        id="btn-trigger-weather-check"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>فحص الطقس الآن</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Tribal & Supervisor Alerts Toggle */}
                <div className="p-4 flex items-start justify-between gap-3 bg-gradient-to-b from-amber-950/10 to-transparent">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-950 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Crown className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white block">تنبيهات القبيلة والإشراف</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          tribalAlertsEnabled 
                            ? "bg-amber-950/80 border border-amber-500/40 text-amber-300" 
                            : "bg-stone-900 border border-stone-800 text-stone-500"
                        }`}>
                          {tribalAlertsEnabled ? "مفعل 🟢" : "متوقف ⚪"}
                        </span>
                      </div>
                      <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                        إشعارات ترشيح المشرفين، توثيق أنساب ديار بني شهر، مناسبات القرى، وإعلانات الإدارة المعتمدة.
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      const nextVal = !tribalAlertsEnabled;
                      setTribalAlertsEnabled(nextVal);
                      DataStore.setTribalAlertsPreference(currentUser.id, nextVal);
                      setWeatherActionStatus(nextVal ? "تم تفعيل تنبيهات القبيلة والإشراف" : "تم إيقاف تنبيهات القبيلة");
                    }}
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${tribalAlertsEnabled ? "bg-amber-600" : "bg-stone-800"}`}
                    id="toggle-tribal-alerts"
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${tribalAlertsEnabled ? "translate-x-0" : "translate-x-6"}`} />
                  </button>
                </div>

                {/* General Push Notifications */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-stone-400 shrink-0" />
                    <div>
                      <span className="font-bold text-white block">إشعارات الحجوزات والرسائل</span>
                      <span className="text-xs text-stone-400">تنبيهات تأكيد جولات المرشدين والطلبات المحلية</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setPushEnabled(!pushEnabled)}
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${pushEnabled ? "bg-emerald-600" : "bg-stone-800"}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${pushEnabled ? "translate-x-0" : "translate-x-6"}`} />
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* ================= VIEW 6: SUPPORT SUB-VIEW ================= */}
          {currentSubView === "support" && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-base font-bold text-white font-['Amiri']">الدعم الفني وخدمة ضيوف بني شهر</h3>

              {/* Quick Contact Buttons */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <a
                  href="https://wa.me/966501234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 font-bold flex items-center justify-center gap-2 hover:bg-emerald-900"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>محادثة واتساب مباشرة</span>
                </a>
                <a
                  href="tel:966501234567"
                  className="p-3 rounded-xl bg-stone-800 border border-stone-700 text-stone-200 font-bold flex items-center justify-center gap-2 hover:bg-stone-700"
                >
                  <Phone className="w-4 h-4" />
                  <span>الاتصال بالرقم الموحد</span>
                </a>
              </div>

              {/* Support Ticket Form */}
              <form onSubmit={handleSupportSubmit} className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <h4 className="text-xs font-bold text-stone-300">فتح تذكرة دعم أو تقديم اقتراح:</h4>
                
                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">نوع الاستفسار</label>
                  <select
                    value={supportTopic}
                    onChange={(e) => setSupportTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white"
                  >
                    <option value="استفسار عام">استفسار عام حول الديار</option>
                    <option value="حجز مرشد">استفسار عن حجز مرشد سياحي</option>
                    <option value="طلب مطبخ وأسر">طلب مطبخ أو أسرة منتجة</option>
                    <option value="اقتراح وتطوير">اقتراح لتطوير المنصة</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">تفاصيل الرسالة</label>
                  <textarea
                    rows={3}
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    placeholder="اكتب استفسارك أو اقتراحك هنا..."
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-all"
                >
                  {ticketSubmitted ? "تم إرسال التذكرة بنجاح!" : "إرسال التذكرة"}
                </button>
              </form>
            </div>
          )}

          {/* ================= VIEW 7: AUTH / LOGIN SUB-VIEW ================= */}
          {currentSubView === "auth_login" && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-base font-bold text-white font-['Amiri']">تسجيل الدخول / إنشاء حساب</h3>

              {authError && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Privacy Policy Mandatory Agreement Checkbox */}
              <label 
                className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                  privacyPolicyAccepted 
                    ? "bg-emerald-950/30 border-emerald-500/40 text-stone-200" 
                    : "bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700"
                }`}
              >
                <input
                  type="checkbox"
                  checked={privacyPolicyAccepted}
                  onChange={(e) => {
                    setPrivacyPolicyAccepted(e.target.checked);
                    if (e.target.checked) setAuthError(null);
                  }}
                  className="mt-0.5 w-4 h-4 rounded border-stone-700 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-stone-900 accent-emerald-600 cursor-pointer"
                  id="checkbox-agree-privacy-account-menu"
                />
                <div className="text-xs leading-relaxed">
                  <span>أوافق على </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowPrivacyModal(true);
                    }}
                    className="text-emerald-400 font-bold underline hover:text-emerald-300 transition-colors inline-block"
                  >
                    سياسة الخصوصية
                  </button>
                  <span> واستخدام بياناتي في تشغيل الحساب والتنبيهات.</span>
                </div>
              </label>

              {/* Google Fast Sign In */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={!privacyPolicyAccepted}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  privacyPolicyAccepted
                    ? "bg-stone-800 hover:bg-stone-700 border border-stone-700 text-white cursor-pointer"
                    : "bg-stone-900/60 border border-stone-800/80 text-stone-500 cursor-not-allowed opacity-60"
                }`}
                title={!privacyPolicyAccepted ? "يرجى الموافقة على سياسة الخصوصية أولاً" : "الدخول بحساب Google"}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>الدخول السريع بحساب Google</span>
              </button>

              <div className="flex items-center gap-2 text-stone-500 text-xs">
                <div className="flex-1 h-[1px] bg-stone-800" />
                <span>أو برقم الجوال</span>
                <div className="flex-1 h-[1px] bg-stone-800" />
              </div>

              {loginStep === "phone" ? (
                <form onSubmit={handlePhoneLoginSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs text-stone-400 mb-1">رقم الجوال (السعودية)</label>
                    <input
                      type="tel"
                      value={phoneLogin}
                      onChange={(e) => setPhoneLogin(e.target.value)}
                      placeholder="05XXXXXXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!privacyPolicyAccepted}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs shadow transition-all ${
                      privacyPolicyAccepted
                        ? "bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                        : "bg-stone-800 text-stone-500 cursor-not-allowed opacity-60"
                    }`}
                  >
                    إرسال رمز التحقق OTP
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtpSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs text-stone-400 mb-1">رمز التحقق المرسل للجوال</label>
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="1234"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono text-center tracking-widest text-lg"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!privacyPolicyAccepted}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs shadow transition-all ${
                      privacyPolicyAccepted
                        ? "bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                        : "bg-stone-800 text-stone-500 cursor-not-allowed opacity-60"
                    }`}
                  >
                    تأكيد وتسجيل الدخول
                  </button>
                </form>
              )}

            </div>
          )}

        </div>
      </div>

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        onAccept={() => {
          setPrivacyPolicyAccepted(true);
          setShowPrivacyModal(false);
          setAuthError(null);
        }}
        showAcceptButton={!privacyPolicyAccepted}
      />
    </div>
  );
};
