import React, { useState } from "react";
import { 
  Compass, 
  Sparkles, 
  Bookmark, 
  CloudSun, 
  Menu, 
  X, 
  MapPin, 
  Landmark, 
  BookOpen, 
  Hotel, 
  ShieldCheck, 
  LayoutDashboard, 
  User, 
  Database, 
  Footprints, 
  Navigation, 
  Utensils, 
  DollarSign, 
  ShoppingBag, 
  History, 
  Globe, 
  Coins,
  Wallet,
  MessageSquare,
  Users,
  Crown,
  Bell
} from "lucide-react";
import { UserProfile } from "../types";
import { useLanguage } from "../lib/i18n";
import { DataStore } from "../lib/datastore";

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  openAiGuide: () => void;
  bookmarksCount: number;
  openBookmarks: () => void;
  openAuthModal: () => void;
  openDashboards: () => void;
  openDatabaseSchema: () => void;
  openTribes?: () => void;
  openForts?: () => void;
  openAttractions?: () => void;
  openMonetizationModal?: () => void;
  openAdminLogin?: () => void;
  openWallet?: () => void;
  openChat?: () => void;
  openNotifications?: () => void;
  unreadNotificationsCount?: number;
  cartCount?: number;
  openCart?: () => void;
  currentUser: UserProfile;
  currentPage?: "home" | "tribes" | "forts" | "attractions" | "memory";
  onNavigateToPage?: (page: "home" | "tribes" | "forts" | "attractions" | "memory") => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  setActiveSection,
  openAiGuide,
  bookmarksCount,
  openBookmarks,
  openAuthModal,
  openDashboards,
  openDatabaseSchema,
  openTribes,
  openForts,
  openAttractions,
  openMonetizationModal,
  openAdminLogin,
  openWallet,
  openChat,
  openNotifications,
  unreadNotificationsCount = 0,
  cartCount = 0,
  openCart,
  currentUser,
  currentPage = "home",
  onNavigateToPage,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, toggleLanguage, t } = useLanguage();
  const currentWallet = DataStore.getWallet();

  const navItems = [
    { id: "hero", label: t("navHero", "الرئيسية"), icon: Compass },
    { id: "bani-shahr-memory", label: t("navMemory", "ذاكرة بني شهر"), icon: History },
    { id: "experiences", label: t("navExperiences", "تجارب بني شهر"), icon: Sparkles },
    { id: "tour-guides", label: t("navGuides", "المرشدون السياحيون"), icon: ShieldCheck },
    { id: "villages-and-trails", label: t("navVillages", "القرى والمسارات"), icon: Footprints },
    { id: "productive-families", label: t("navFood", "المطبخ والأسر"), icon: Utensils },
    { id: "interactive-map", label: t("navMap", "الخريطة التفاعلية"), icon: Navigation },
    { id: "heritage", label: t("navHeritage", "التراث والتاريخ"), icon: Landmark },
    { id: "attractions", label: t("navAttractions", "المعالم السياحية"), icon: MapPin },
    { id: "planner", label: t("navPlanner", "مخطط الرحلات"), icon: Sparkles },
    { id: "dialect", label: t("navDialect", "اللهجة والأمثال"), icon: BookOpen },
    { id: "hospitality", label: t("navHospitality", "الضيافة والنزل"), icon: Hotel },
  ];

  const handleNavClick = (id: string) => {
    if (id === "bani-shahr-memory" && onNavigateToPage) {
      onNavigateToPage("memory");
      setActiveSection(id);
      setMobileMenuOpen(false);
      return;
    }

    if (onNavigateToPage && currentPage !== "home") {
      onNavigateToPage("home");
    }
    setActiveSection(id);
    setMobileMenuOpen(false);

    // Smooth Scroll with Header Offset
    const targetElement = document.getElementById(id) || document.getElementById(`${id}-section`) || document.getElementById(id.replace("-section", ""));
    if (targetElement) {
      const headerOffset = window.innerWidth < 640 ? 70 : 85;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: "smooth"
      });
    } else {
      setTimeout(() => {
        const el = document.getElementById(id) || document.getElementById(`${id}-section`) || document.getElementById(id.replace("-section", ""));
        if (el) {
          const headerOffset = window.innerWidth < 640 ? 70 : 85;
          const pos = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: Math.max(0, pos),
            behavior: "smooth"
          });
        }
      }, 100);
    }
  };

  const isAdmin = currentUser.role === "admin" || currentUser.role === "super_admin";
  const isSupervisor = currentUser.role === "village_supervisor";
  const isStaff = isAdmin || isSupervisor;

  return (
    <header className="sticky top-0 z-40 w-full max-w-full bg-[#12201A]/95 backdrop-blur-md border-b border-[#7C9D86]/20 text-[#F8F4EA] transition-all duration-300 shadow-md">
      {/* Al-Qatt Al-Asiri Top Geometric Pattern Strip */}
      <div className="qatt-asiri-header-strip" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          
          {/* Logo & Region Identity */}
          <div 
            id="brand-logo"
            onClick={() => handleNavClick("hero")}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0 min-w-0"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#1B2B22] via-[#7C9D86] to-[#C7A25C] flex items-center justify-center shadow-md shadow-black/40 border border-[#C7A25C]/40 group-hover:scale-105 transition-transform shrink-0">
              <span className="font-['Markazi_Text'] font-bold text-xl sm:text-2xl text-[#F8F4EA]">{language === "ar" ? "ب" : "BS"}</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-['Markazi_Text'] text-2xl sm:text-3xl font-bold text-[#F8F4EA] tracking-wide truncate">
                  {t("brandName", "بني شهر")}
                </span>
                <span className="hidden md:inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#7C9D86]/20 text-[#D8BE8B] border border-[#7C9D86]/40 font-medium whitespace-nowrap">
                  {t("brandSub", "السراة وتهامة")}
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-[#D8BE8B]/80 font-light hidden lg:inline-block truncate">
                {t("brandTagline", "المنصة السياحية والتراثية المتكاملة")}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.slice(0, 6).map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-[#1B2B22] text-[#D8BE8B] border border-[#C7A25C]/50 shadow-sm font-bold"
                      : "text-[#F8F4EA]/80 hover:text-[#F8F4EA] hover:bg-[#1B2B22]/60"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#C7A25C]" : "text-[#7C9D86]"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions Bar */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Language Switcher (AR / EN) - Visible on sm: (tablet/desktop) */}
            <div 
              id="language-switcher-wrapper"
              className="hidden sm:flex items-center p-0.5 rounded-xl bg-[#1B2B22] border border-[#C7A25C]/40 shadow-sm text-xs font-bold shrink-0"
            >
              <button
                id="lang-btn-ar"
                type="button"
                onClick={() => setLanguage("ar")}
                className={`flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg transition-all text-[11px] ${
                  language === "ar"
                    ? "bg-[#C7A25C] text-[#F8F4EA] font-black shadow-sm"
                    : "text-[#D8BE8B] hover:text-[#F8F4EA]"
                }`}
                title="العربية (Arabic)"
              >
                <span>🇸🇦</span>
                <span className="hidden md:inline">العربية</span>
              </button>
              <button
                id="lang-btn-en"
                type="button"
                onClick={() => setLanguage("en")}
                className={`flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg transition-all text-[11px] font-sans ${
                  language === "en"
                    ? "bg-[#C7A25C] text-[#F8F4EA] font-black shadow-sm"
                    : "text-[#D8BE8B] hover:text-[#F8F4EA]"
                }`}
                title="English"
              >
                <span className="hidden md:inline">En</span>
                <span>🇬🇧</span>
              </button>
            </div>

            {/* Admin / Staff Zone: ONLY Shown if user is Admin or Supervisor */}
            {isStaff ? (
              <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                {/* Admin Master Control Dashboard Trigger */}
                <button
                  id="open-admin-dashboard-btn"
                  onClick={openDashboards}
                  title={language === "ar" ? "لوحة الإدارة الشاملة" : "Master Admin Dashboard"}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-gradient-to-r from-[#C7A25C]/30 via-[#C7A25C]/40 to-[#9C4A38]/30 hover:from-[#C7A25C]/50 hover:to-[#9C4A38]/50 border border-[#C7A25C]/70 text-[#F8F4EA] transition-all text-xs font-bold shadow-md shadow-black/30 group whitespace-nowrap"
                >
                  <Crown className="w-3.5 h-3.5 text-[#C7A25C] group-hover:rotate-12 transition-transform" />
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#C7A25C]" />
                  <span className="hidden md:inline font-bold">
                    {isAdmin ? (language === "ar" ? "لوحة الإدارة" : "Admin") : (language === "ar" ? "المشرف" : "Supervisor")}
                  </span>
                </button>

                {/* Account Button */}
                <button
                  id="open-auth-btn"
                  onClick={openAuthModal}
                  title={language === "ar" ? "حسابي (Account)" : "My Account"}
                  className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-[#1B2B22] hover:bg-[#254A37] border border-[#7C9D86]/40 text-[#F8F4EA] transition-colors flex items-center gap-1.5 text-xs font-bold shrink-0 shadow-sm"
                >
                  <User className="w-4 h-4 text-[#C7A25C]" />
                  <span className="hidden md:inline">{language === "ar" ? "حسابي" : "Account"}</span>
                </button>
              </div>
            ) : (
              /* Regular User Zone: Account / Sign In button */
              <button
                id="open-auth-btn"
                onClick={openAuthModal}
                title={language === "ar" ? "حسابي (Account)" : "Sign In / Account"}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-[#1B2B22] hover:bg-[#254A37] border border-[#7C9D86]/40 text-[#F8F4EA] hover:text-[#C7A25C] transition-colors text-xs font-bold shrink-0 whitespace-nowrap shadow-sm"
              >
                <User className="w-4 h-4 text-[#7C9D86]" />
                <span className="hidden md:inline">
                  {currentUser.role === "visitor" && !currentUser.isVerified
                    ? (language === "ar" ? "حسابي / تسجيل الدخول" : "Account / Sign In") 
                    : (language === "ar" ? `حسابي (${currentUser.name.split(" ")[0]})` : currentUser.name.split(" ")[0])}
                </span>
              </button>
            )}

            {/* Notification Center Trigger Bell */}
            <button
              id="open-notifications-btn"
              onClick={openNotifications}
              title={language === "ar" ? "مركز الإشعارات الفورية (Firebase Push)" : "Push Notifications"}
              className="relative p-2 sm:p-2.5 rounded-xl bg-[#1B2B22] hover:bg-[#254A37] border border-[#7C9D86]/40 text-[#D8BE8B] hover:text-[#F8F4EA] transition-colors flex items-center justify-center shrink-0 shadow-sm group"
            >
              <Bell className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow-md animate-bounce border border-[#12201A]">
                  {unreadNotificationsCount > 9 ? "9+" : unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Smart AI Guide Trigger (Compact responsive pill on mobile) */}
            <button
              id="open-ai-guide-btn"
              onClick={openAiGuide}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#1B2B22] via-[#7C9D86] to-[#C7A25C] hover:opacity-90 text-[#F8F4EA] font-bold text-xs shadow-md shadow-black/40 transition-all border border-[#C7A25C]/40 active:scale-95 shrink-0 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D8BE8B] animate-spin" style={{ animationDuration: "5s" }} />
              <span className="font-['Markazi_Text'] font-bold text-sm sm:text-base">
                <span className="sm:hidden">{language === "ar" ? "المرشد" : "AI"}</span>
                <span className="hidden sm:inline">{language === "ar" ? "اسأل المرشد الذكي" : "Ask AI Guide"}</span>
              </span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 sm:p-2.5 rounded-xl bg-[#1B2B22] text-[#D8BE8B] hover:text-[#F8F4EA] border border-[#7C9D86]/40 shrink-0"
              aria-label="القائمة الرئيسية"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden py-4 border-t border-stone-800 space-y-3 max-h-[80vh] overflow-y-auto">
            
            {/* Quick Actions Bar for Mobile (< 640px) */}
            <div className="grid grid-cols-2 gap-2 sm:hidden pb-2 border-b border-stone-800">
              
              {/* Language Switcher in Mobile Drawer */}
              <button
                onClick={() => toggleLanguage()}
                className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-stone-800 border border-stone-700 text-xs font-bold text-stone-200"
              >
                <Globe className="w-4 h-4 text-amber-400" />
                <span>{language === "ar" ? "English (🇬🇧)" : "العربية (🇸🇦)"}</span>
              </button>

              {/* Bookmarks in Mobile Drawer */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openBookmarks();
                }}
                className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-stone-800 border border-stone-700 text-xs font-bold text-stone-200"
              >
                <Bookmark className="w-4 h-4 text-amber-400" />
                <span>{t("navBookmarks", "المفضلة")} ({bookmarksCount})</span>
              </button>

            </div>

            {/* If Staff / Admin: Dedicated Mobile Admin Access Card */}
            {isStaff ? (
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-400" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-300">{language === "ar" ? "لوحة الإدارة الشاملة (المدير العام)" : "Master Admin Panel"}</h4>
                    <p className="text-[10px] text-stone-400">{currentUser.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openDashboards();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 text-stone-950 text-xs font-bold hover:bg-amber-400 shrink-0"
                >
                  {language === "ar" ? "فتح اللوحة" : "Open"}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-900 border border-stone-800">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal();
                  }}
                  className="flex items-center gap-2 text-xs font-bold text-stone-200 truncate"
                >
                  <User className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">{currentUser.role === "guest" ? (language === "ar" ? "تسجيل الدخول أو إنشاء حساب" : "Sign In / Register") : currentUser.name}</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (openAdminLogin) openAdminLogin();
                    else openAuthModal();
                  }}
                  className="text-[11px] text-amber-400 hover:underline font-bold shrink-0 mr-2"
                >
                  {language === "ar" ? "دخول الإدارة" : "Admin Login"}
                </button>
              </div>
            )}

            {/* Mobile Nav Links Grid */}
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium ${language === "ar" ? "text-right" : "text-left"} ${
                      isActive
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold"
                        : "text-stone-300 bg-stone-900 border border-stone-800 hover:bg-stone-800"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Ask AI Guide */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openAiGuide();
              }}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 border border-emerald-400/40 text-white text-xs font-bold shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: "5s" }} />
              <span className="font-['Amiri'] text-sm">{language === "ar" ? "اسأل المرشد الذكي" : "Ask Smart AI Guide"}</span>
            </button>

            {/* Mobile Tribes Directory Button */}
            {openTribes && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openTribes();
                }}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-gradient-to-r from-amber-600/30 to-amber-700/30 border border-amber-500/50 text-amber-300 text-xs font-bold"
              >
                <Users className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-['Amiri']">{language === "ar" ? "دليل وشجرة قبائل بني شهر" : "Tribes Directory"}</span>
              </button>
            )}

          </div>
        )}

      </div>
    </header>
  );
};

