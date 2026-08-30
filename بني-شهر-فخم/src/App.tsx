import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { HeroBanner } from "./components/HeroBanner";
import { ExperiencesSection } from "./components/ExperiencesSection";
import { TourGuidesSection } from "./components/TourGuidesSection";
import { VillagesAndHikingSection } from "./components/VillagesAndHikingSection";
import { ProductiveFamiliesSection } from "./components/ProductiveFamiliesSection";
import { InteractiveMapSection } from "./components/InteractiveMapSection";
import { HeritageSection } from "./components/HeritageSection";
import { AttractionsExplorer } from "./components/AttractionsExplorer";
import { TripPlanner } from "./components/TripPlanner";
import { DialectAndCultureQuiz } from "./components/DialectAndCultureQuiz";
import { HospitalityDirectory } from "./components/HospitalityDirectory";
import { VisitorReviewsSection } from "./components/VisitorReviewsSection";
import { Footer } from "./components/Footer";
import { SmartAiGuideModal } from "./components/SmartAiGuideModal";
import { BookmarksDrawer } from "./components/BookmarksDrawer";
import { AccountMenuModal } from "./components/AccountMenuModal";
import { DashboardsModal } from "./components/DashboardsModal";
import { DatabaseSchemaModal } from "./components/DatabaseSchemaModal";
import { TribesModal } from "./components/TribesModal";
import { FortsAndHistoryModal } from "./components/FortsAndHistoryModal";
import { MonetizationModelModal } from "./components/MonetizationModelModal";
import { CartDrawer } from "./components/CartDrawer";
import { CheckoutModal } from "./components/CheckoutModal";
import { WalletModal } from "./components/WalletModal";
import { SecureChatModal } from "./components/SecureChatModal";
import { SellerRegistrationModal } from "./components/SellerRegistrationModal";
import { AdminLoginModal } from "./components/admin/AdminLoginModal";
import { SupervisorNominationModal } from "./components/SupervisorNominationModal";
import { PrivacyPolicyModal } from "./components/PrivacyPolicyModal";
import { PushNotificationToast } from "./components/PushNotificationToast";
import { NotificationsDrawer } from "./components/NotificationsDrawer";
import { pushNotificationService } from "./lib/pushNotifications";
import { FirebasePushNotification } from "./types";
import { AppStorage } from "./lib/nativeStorage";

// Standalone Pages
import { TribesPage } from "./components/pages/TribesPage";
import { FortsAndHistoryPage } from "./components/pages/FortsAndHistoryPage";
import { AttractionsPage } from "./components/pages/AttractionsPage";
import { BaniShahrMemoryPage } from "./components/pages/BaniShahrMemoryPage";
import { MobileBottomNav } from "./components/MobileBottomNav";
import { HomeCategoryTabs, HomeCategoryTab, CATEGORIES } from "./components/HomeCategoryTabs";

import { Attraction, UserProfile, FoodItem, FoodSeller, TourGuide, CartItem, Order } from "./types";
import { DataStore } from "./lib/datastore";
import { auth, onAuthStateChanged } from "./lib/firebase";
import { Sparkles, Bookmark, ArrowUp, LayoutDashboard, Database, DollarSign, ShoppingBag, Wallet, MessageSquare, ShieldCheck, Crown, ChevronLeft, Layers } from "lucide-react";

export default function App() {
  const [currentView, setCurrentView] = useState<"home" | "tribes" | "forts" | "attractions" | "memory">("home");
  const [homeActiveTab, setHomeActiveTab] = useState<HomeCategoryTab>("explore");
  const [homeSubSection, setHomeSubSection] = useState<string>("all");
  const [navHistory, setNavHistory] = useState<Array<{ view: "home" | "tribes" | "forts" | "attractions" | "memory"; selectedTribeId?: string }>>([{ view: "home" }]);
  const [activeSection, setActiveSection] = useState("hero");
  const [isAiGuideOpen, setIsAiGuideOpen] = useState(false);
  const [aiGuidePrompt, setAiGuidePrompt] = useState<string | undefined>(undefined);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isDashboardsOpen, setIsDashboardsOpen] = useState(false);
  const [isSchemaOpen, setIsSchemaOpen] = useState(false);
  const [isTribesOpen, setIsTribesOpen] = useState(false);
  const [isFortsModalOpen, setIsFortsModalOpen] = useState(false);
  const [isMonetizationOpen, setIsMonetizationOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatRecipient, setChatRecipient] = useState<{ id: string; name: string; role: string; phone?: string } | undefined>(undefined);
  const [chatContextType, setChatContextType] = useState<"order" | "booking" | "experience" | "support" | "direct">("direct");
  const [chatContextEntityId, setChatContextEntityId] = useState<string>("");
  const [chatContextTitle, setChatContextTitle] = useState<string>("محادثة مباشرة");
  const [isSellerRegisterOpen, setIsSellerRegisterOpen] = useState(false);
  const [isSupervisorNominationOpen, setIsSupervisorNominationOpen] = useState(false);
  const [isNotificationsDrawerOpen, setIsNotificationsDrawerOpen] = useState(false);
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);
  const [notifications, setNotifications] = useState<FirebasePushNotification[]>([]);
  const [activePushToast, setActivePushToast] = useState<FirebasePushNotification | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => DataStore.getCart());

  // Current logged in user profile
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => DataStore.getCurrentUser());

  // Real-time Firebase Push Notifications & FCM Foreground listener
  useEffect(() => {
    // 1. Subscribe to Firestore push_notifications
    const unsubscribeFirestore = pushNotificationService.subscribeToNotifications(
      { role: currentUser.role, phone: currentUser.phone },
      (items) => {
        setNotifications(items);

        // Check if there is a newly received unread notification that we haven't toasted in this session
        const latestUnread = items.find(n => !n.isRead && n.status !== "read");
        if (latestUnread) {
          // Show push notification toast if within last 2 minutes
          const diffMs = Date.now() - new Date(latestUnread.createdAt).getTime();
          if (diffMs < 120000) {
            setActivePushToast(latestUnread);
          }
        }
      }
    );

    // 2. Setup Firebase Cloud Messaging (FCM) foreground listener
    let unsubscribeFCM = () => {};
    pushNotificationService.setupFCMForegroundListener((payload) => {
      console.log("App received FCM message:", payload);
    }).then((unsub) => {
      unsubscribeFCM = unsub;
    });

    // 3. Attempt FCM Token registration if permission already granted or for logged-in supervisor
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      pushNotificationService.requestAndRegisterFCMToken({
        id: currentUser.id,
        phone: currentUser.phone,
        role: currentUser.role,
        supervisorCode: currentUser.supervisorCode,
        name: currentUser.name
      }).catch(console.debug);
    }

    return () => {
      unsubscribeFirestore();
      unsubscribeFCM();
    };
  }, [currentUser.role, currentUser.phone, currentUser.id, currentUser.supervisorCode, currentUser.name]);

  const unreadNotificationsCount = notifications.filter(n => !n.isRead && n.status !== "read").length;

  const handleNotificationToastClick = (notif: FirebasePushNotification) => {
    pushNotificationService.markAsRead(notif.id);
    setActivePushToast(null);
    if (notif.type === "supervisor_nomination_new" || notif.targetRole === "admin" || notif.targetRole === "supervisor") {
      setIsDashboardsOpen(true);
    } else {
      setIsNotificationsDrawerOpen(true);
    }
  };

  // Native AppStorage persistence for user bookmarks
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = AppStorage.getItem("bani_shahr_bookmarks");
      return saved ? JSON.parse(saved) : ["dahna-waterfall", "al-maqarr-palace", "manaa-mountain"];
    } catch {
      return ["dahna-waterfall", "al-maqarr-palace", "manaa-mountain"];
    }
  });

  useEffect(() => {
    try {
      AppStorage.setItem("bani_shahr_bookmarks", JSON.stringify(bookmarkedIds));
    } catch (e) {
      console.error(e);
    }
  }, [bookmarkedIds]);

  // Sync user state with Firebase Authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const existing = DataStore.getCurrentUser();
        const updated: UserProfile = {
          ...existing,
          id: firebaseUser.uid,
          name: firebaseUser.displayName || existing.name || "عضو بني شهر",
          email: firebaseUser.email || existing.email,
          isVerified: true,
          role: firebaseUser.email === "aaattr2005@gmail.com" ? "admin" : existing.role,
        };
        DataStore.setCurrentUser(updated);
        setCurrentUser(updated);
      }
    });
    return () => unsubscribe();
  }, []);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const clearAllBookmarks = () => {
    setBookmarkedIds([]);
  };

  const handleAddToCart = (item: FoodItem) => {
    DataStore.addToCart(item, 1);
    setCartItems(DataStore.getCart());
  };

  const handleUpdateCartQuantity = (itemId: string, delta: number) => {
    DataStore.updateCartQuantity(itemId, delta);
    setCartItems(DataStore.getCart());
  };

  const handleRemoveFromCart = (itemId: string) => {
    DataStore.removeFromCart(itemId);
    setCartItems(DataStore.getCart());
  };

  const handleClearCart = () => {
    DataStore.clearCart();
    setCartItems([]);
  };

  const handleOpenChatWithSeller = (seller: FoodSeller) => {
    setChatRecipient({
      id: seller.id,
      name: seller.storeName,
      role: "food_seller",
      phone: seller.phone
    });
    setChatContextType("order");
    setChatContextTitle(`طلب مأكولات: ${seller.storeName}`);
    setIsChatOpen(true);
  };

  const handleOpenChatWithGuide = (guide: TourGuide) => {
    setChatRecipient({
      id: guide.id,
      name: guide.name,
      role: "tour_guide",
      phone: guide.phone
    });
    setChatContextType("booking");
    setChatContextTitle(`حجز جولة: ${guide.name}`);
    setIsChatOpen(true);
  };

  const handleAskAiAboutAttraction = (attraction: Attraction) => {
    setAiGuidePrompt(`أخبرني بالمزيد من المعلومات التاريخية والسياحية حول ${attraction.name} في ${attraction.city}، وأفضل أوقات الزيارة والنصائح.`);
    setIsAiGuideOpen(true);
  };

  const handleOpenAiGuideWithPrompt = (prompt?: string) => {
    setAiGuidePrompt(prompt);
    setIsAiGuideOpen(true);
  };

  // Scroll listener for back to top and section tracking
  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past 250px or when nearing bottom of page
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      const isNearBottom = scrollY + windowHeight >= fullHeight - 300;

      if (scrollY > 250 || isNearBottom) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigateTo = (view: "home" | "tribes" | "forts" | "attractions" | "memory", options?: { selectedTribeId?: string; replace?: boolean }) => {
    if (view === currentView && !options?.selectedTribeId) return;

    if (options?.replace) {
      setNavHistory((prev) => [...prev.slice(0, -1), { view, selectedTribeId: options?.selectedTribeId }]);
      window.history.replaceState({ appNav: true, view, selectedTribeId: options?.selectedTribeId }, "");
    } else {
      setNavHistory((prev) => [...prev, { view, selectedTribeId: options?.selectedTribeId }]);
      window.history.pushState({ appNav: true, view, selectedTribeId: options?.selectedTribeId }, "");
    }

    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const goBack = () => {
    // 1. Check if any app-level modal is open
    if (isAiGuideOpen) { setIsAiGuideOpen(false); return; }
    if (isBookmarksOpen) { setIsBookmarksOpen(false); return; }
    if (isCartOpen) { setIsCartOpen(false); return; }
    if (isCheckoutOpen) { setIsCheckoutOpen(false); return; }
    if (isAuthOpen) { setIsAuthOpen(false); return; }
    if (isDashboardsOpen) { setIsDashboardsOpen(false); return; }
    if (isSchemaOpen) { setIsSchemaOpen(false); return; }
    if (isTribesOpen) { setIsTribesOpen(false); return; }
    if (isFortsModalOpen) { setIsFortsModalOpen(false); return; }
    if (isMonetizationOpen) { setIsMonetizationOpen(false); return; }
    if (isWalletOpen) { setIsWalletOpen(false); return; }
    if (isChatOpen) { setIsChatOpen(false); return; }
    if (isSellerRegisterOpen) { setIsSellerRegisterOpen(false); return; }
    if (isSupervisorNominationOpen) { setIsSupervisorNominationOpen(false); return; }
    if (isNotificationsDrawerOpen) { setIsNotificationsDrawerOpen(false); return; }
    if (isAdminLoginOpen) { setIsAdminLoginOpen(false); return; }

    // 2. Check history stack
    if (navHistory.length > 1) {
      const updated = [...navHistory];
      updated.pop();
      const prevEntry = updated[updated.length - 1];
      setNavHistory(updated);
      setCurrentView(prevEntry.view);
      window.scrollTo({ top: 0, behavior: "instant" });
    } else if (currentView !== "home") {
      setCurrentView("home");
      setNavHistory([{ view: "home" }]);
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  // Browser / Mobile Back Button (popstate) synchronization
  useEffect(() => {
    if (!window.history.state || !window.history.state.appNav) {
      window.history.replaceState({ appNav: true, view: "home" }, "");
    }

    const handlePopState = (event: PopStateEvent) => {
      // Close any open modals first
      if (isAiGuideOpen || isBookmarksOpen || isCartOpen || isCheckoutOpen || isAuthOpen ||
          isDashboardsOpen || isSchemaOpen || isTribesOpen || isFortsModalOpen ||
          isMonetizationOpen || isWalletOpen || isChatOpen || isSellerRegisterOpen ||
          isSupervisorNominationOpen || isNotificationsDrawerOpen || isAdminLoginOpen) {
        setIsAiGuideOpen(false);
        setIsBookmarksOpen(false);
        setIsCartOpen(false);
        setIsCheckoutOpen(false);
        setIsAuthOpen(false);
        setIsDashboardsOpen(false);
        setIsSchemaOpen(false);
        setIsTribesOpen(false);
        setIsFortsModalOpen(false);
        setIsMonetizationOpen(false);
        setIsWalletOpen(false);
        setIsChatOpen(false);
        setIsSellerRegisterOpen(false);
        setIsSupervisorNominationOpen(false);
        setIsNotificationsDrawerOpen(false);
        setIsAdminLoginOpen(false);
        return;
      }

      const state = event.state;
      if (state && state.view) {
        setCurrentView(state.view);
        setNavHistory((prev) => {
          const idx = prev.findIndex((item) => item.view === state.view);
          if (idx !== -1) {
            return prev.slice(0, idx + 1);
          }
          return [...prev, { view: state.view, selectedTribeId: state.selectedTribeId }];
        });
        window.scrollTo({ top: 0, behavior: "instant" });
      } else {
        setNavHistory((prev) => {
          if (prev.length > 1) {
            const next = prev.slice(0, -1);
            setCurrentView(next[next.length - 1].view);
            window.scrollTo({ top: 0, behavior: "instant" });
            return next;
          }
          setCurrentView("home");
          window.scrollTo({ top: 0, behavior: "instant" });
          return [{ view: "home" }];
        });
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [
    isAiGuideOpen, isBookmarksOpen, isCartOpen, isCheckoutOpen, isAuthOpen,
    isDashboardsOpen, isSchemaOpen, isTribesOpen, isFortsModalOpen,
    isMonetizationOpen, isWalletOpen, isChatOpen, isSellerRegisterOpen,
    isSupervisorNominationOpen, isNotificationsDrawerOpen, isAdminLoginOpen
  ]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (id: string) => {
    if (currentView !== "home") {
      navigateTo("home");
    }

    // Automatically switch active tab & subSection to match the target section
    if (["attractions", "interactive-map", "villages-and-trails", "planner"].includes(id)) {
      setHomeActiveTab("explore");
      setHomeSubSection(id);
    } else if (["heritage", "dialect"].includes(id)) {
      setHomeActiveTab("heritage");
      setHomeSubSection(id);
    } else if (["tour-guides"].includes(id)) {
      setHomeActiveTab("guides");
      setHomeSubSection(id);
    } else if (["productive-families", "hospitality", "visitor-reviews"].includes(id)) {
      setHomeActiveTab("market");
      setHomeSubSection(id);
    } else if (id === "experiences") {
      if (homeActiveTab !== "heritage" && homeActiveTab !== "guides") {
        setHomeActiveTab("guides");
      }
      setHomeSubSection("experiences");
    }

    setActiveSection(id);
    setTimeout(() => {
      const targetElement = document.getElementById(id) || document.getElementById(`${id}-section`) || document.getElementById(id.replace("-section", ""));
      if (targetElement) {
        const headerOffset = window.innerWidth < 640 ? 120 : 140;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: "smooth"
        });
      }
    }, 120);
  };

  const totalCartCount = cartItems.reduce((acc, c) => acc + c.quantity, 0);

  // If Tribes Page view is active
  if (currentView === "tribes") {
    return (
      <div className="relative min-h-screen pb-20 sm:pb-0">
        <TribesPage
          onBack={goBack}
          onBackToHome={() => navigateTo("home")}
          onOpenMemory={() => navigateTo("memory")}
        />
        <MobileBottomNav
          currentView={currentView}
          onNavigate={navigateTo}
          onOpenEvents={() => scrollToSection("experiences")}
          onOpenAccount={() => setIsAuthOpen(true)}
          isLoggedIn={currentUser.role !== "guest"}
        />
      </div>
    );
  }

  // If Forts and History Page view is active
  if (currentView === "forts") {
    return (
      <div className="relative min-h-screen pb-20 sm:pb-0">
        <FortsAndHistoryPage
          onBack={goBack}
          onBackToHome={() => navigateTo("home")}
        />
        <MobileBottomNav
          currentView={currentView}
          onNavigate={navigateTo}
          onOpenEvents={() => scrollToSection("experiences")}
          onOpenAccount={() => setIsAuthOpen(true)}
          isLoggedIn={currentUser.role !== "guest"}
        />
      </div>
    );
  }

  // If Attractions & Nature Page view is active
  if (currentView === "attractions") {
    return (
      <div className="relative min-h-screen pb-20 sm:pb-0">
        <AttractionsPage
          onBack={goBack}
          onBackToHome={() => navigateTo("home")}
          bookmarkedIds={bookmarkedIds}
          onToggleBookmark={toggleBookmark}
          onAskAiAboutAttraction={handleAskAiAboutAttraction}
        />
        <MobileBottomNav
          currentView={currentView}
          onNavigate={navigateTo}
          onOpenEvents={() => scrollToSection("experiences")}
          onOpenAccount={() => setIsAuthOpen(true)}
          isLoggedIn={currentUser.role !== "guest"}
        />
      </div>
    );
  }

  // If Bani Shahr Memory Standalone Page view is active
  if (currentView === "memory") {
    return (
      <div className="relative min-h-screen pb-20 sm:pb-0">
        <BaniShahrMemoryPage
          onBack={goBack}
          onBackToHome={() => navigateTo("home")}
        />
        <MobileBottomNav
          currentView={currentView}
          onNavigate={navigateTo}
          onOpenEvents={() => scrollToSection("experiences")}
          onOpenAccount={() => setIsAuthOpen(true)}
          isLoggedIn={currentUser.role !== "guest"}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen bg-[#F8F4EA] text-stone-900 flex flex-col font-['Tajawal',sans-serif] selection:bg-emerald-800 selection:text-emerald-50">
      
      {/* Top Navigation */}
      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        openAiGuide={() => handleOpenAiGuideWithPrompt()}
        bookmarksCount={bookmarkedIds.length}
        openBookmarks={() => setIsBookmarksOpen(true)}
        openAuthModal={() => setIsAuthOpen(true)}
        openDashboards={() => setIsDashboardsOpen(true)}
        openAdminLogin={() => setIsAdminLoginOpen(true)}
        openDatabaseSchema={() => setIsSchemaOpen(true)}
        openTribes={() => navigateTo("tribes")}
        openForts={() => navigateTo("forts")}
        openAttractions={() => navigateTo("attractions")}
        openMonetizationModal={() => setIsMonetizationOpen(true)}
        openWallet={() => setIsWalletOpen(true)}
        openChat={() => {
          setChatRecipient(undefined);
          setChatContextType("direct");
          setChatContextTitle("محادثة مباشرة");
          setIsChatOpen(true);
        }}
        openNotifications={() => setIsNotificationsDrawerOpen(true)}
        unreadNotificationsCount={unreadNotificationsCount}
        cartCount={totalCartCount}
        openCart={() => setIsCartOpen(true)}
        currentUser={currentUser}
        currentPage={currentView}
        onNavigateToPage={navigateTo}
      />

      {/* Main Sections */}
      <main className="w-full max-w-full overflow-x-hidden flex-1">
        
        {/* 1. Hero Atmospheric Showcase (Always at the top) */}
        <HeroBanner
          onOpenTribes={() => navigateTo("tribes")}
          onExploreAttractions={() => navigateTo("attractions")}
          onExploreHeritage={() => navigateTo("forts")}
          onPlanTrip={() => scrollToSection("planner")}
          onOpenAiGuide={() => handleOpenAiGuideWithPrompt()}
        />

        {/* 2. Smart Category Navigation Tabs */}
        <HomeCategoryTabs
          activeTab={homeActiveTab}
          onTabChange={setHomeActiveTab}
          activeSubSection={homeSubSection}
          onSubSectionChange={setHomeSubSection}
          onQuickJump={(secId) => scrollToSection(secId)}
        />

        {/* Category Sections Container */}
        <div className="w-full">
          {/* TAB 1: المعالم والطبيعة والمسارات */}
          {homeActiveTab === "explore" && (
            <div className="space-y-0 animate-fadeIn">
              {/* Attractions Explorer (المعالم والسياحة) */}
              {(homeSubSection === "all" || homeSubSection === "attractions") && (
                <AttractionsExplorer
                  bookmarkedIds={bookmarkedIds}
                  onToggleBookmark={toggleBookmark}
                  onAskAiAboutAttraction={handleAskAiAboutAttraction}
                />
              )}

              {/* Interactive Geographic Map (الخريطة التفاعلية) */}
              {(homeSubSection === "all" || homeSubSection === "interactive-map") && (
                <InteractiveMapSection />
              )}

              {/* Villages, Hiking Trails & Museums (قرى بني شهر، مسارات الهايكنج والمتاحف) */}
              {(homeSubSection === "all" || homeSubSection === "villages-and-trails") && (
                <VillagesAndHikingSection />
              )}

              {/* Smart AI Trip Planner (مخطط الرحلات الذكي وتوقعات الطقس) */}
              {(homeSubSection === "all" || homeSubSection === "planner") && (
                <TripPlanner />
              )}

              {/* Concise Sub-Section Navigation Footer when a single sub-section is active */}
              {homeSubSection !== "all" && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-[#E6DEC8] rounded-3xl my-6 shadow-sm">
                  <div className="flex items-center gap-2 text-xs text-stone-600">
                    <span>تصفح باقي أقسام المعالم والطبيعة:</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    <button
                      onClick={() => setHomeSubSection("all")}
                      className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors"
                    >
                      عرض كافة الأقسام
                    </button>
                    {homeSubSection !== "attractions" && (
                      <button
                        onClick={() => setHomeSubSection("attractions")}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-colors"
                      >
                        المعالم السياحية
                      </button>
                    )}
                    {homeSubSection !== "interactive-map" && (
                      <button
                        onClick={() => setHomeSubSection("interactive-map")}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-colors"
                      >
                        الخريطة التفاعلية
                      </button>
                    )}
                    {homeSubSection !== "villages-and-trails" && (
                      <button
                        onClick={() => setHomeSubSection("villages-and-trails")}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-colors"
                      >
                        القرى والمسارات
                      </button>
                    )}
                    {homeSubSection !== "planner" && (
                      <button
                        onClick={() => setHomeSubSection("planner")}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-colors"
                      >
                        مخطط الرحلات
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: التراث والأصالة والموروث */}
          {homeActiveTab === "heritage" && (
            <div className="space-y-0 animate-fadeIn">
              {/* Heritage & History Section (تراث وتاريخ بني شهر والحصون) */}
              {(homeSubSection === "all" || homeSubSection === "heritage") && (
                <HeritageSection
                  onOpenFortsDirectory={() => navigateTo("forts")}
                />
              )}

              {/* Dialect & Cultural Proverbs Dictionary & Quiz (اللهجة والأمثال) */}
              {(homeSubSection === "all" || homeSubSection === "dialect") && (
                <DialectAndCultureQuiz />
              )}

              {/* Authentic Live Experiences (تجارب بني شهر الحية وورش العمل والطهي) */}
              {(homeSubSection === "all" || homeSubSection === "experiences") && (
                <ExperiencesSection
                  currentUser={currentUser}
                  onOpenAuthModal={() => setIsAuthOpen(true)}
                />
              )}

              {/* Concise Sub-Section Navigation Footer when a single sub-section is active */}
              {homeSubSection !== "all" && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-[#E6DEC8] rounded-3xl my-6 shadow-sm">
                  <div className="flex items-center gap-2 text-xs text-stone-600">
                    <span>تصفح باقي أقسام التراث والأصالة:</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    <button
                      onClick={() => setHomeSubSection("all")}
                      className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors"
                    >
                      عرض كافة الأقسام
                    </button>
                    {homeSubSection !== "heritage" && (
                      <button
                        onClick={() => setHomeSubSection("heritage")}
                        className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold transition-colors"
                      >
                        الحصون والتاريخ
                      </button>
                    )}
                    {homeSubSection !== "dialect" && (
                      <button
                        onClick={() => setHomeSubSection("dialect")}
                        className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold transition-colors"
                      >
                        اللهجة والأمثال
                      </button>
                    )}
                    {homeSubSection !== "experiences" && (
                      <button
                        onClick={() => setHomeSubSection("experiences")}
                        className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold transition-colors"
                      >
                        تجارب الموروث
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: السياحة والمرشدون والتجارب */}
          {homeActiveTab === "guides" && (
            <div className="space-y-0 animate-fadeIn">
              {/* Licensed Local Tour Guides (المرشدين السياحيين والحجوزات) */}
              {(homeSubSection === "all" || homeSubSection === "tour-guides") && (
                <TourGuidesSection
                  onBookingSuccess={(booking) => {
                    // Optional callback
                  }}
                />
              )}

              {/* Authentic Experiences (تجارب بني شهر الحية والطهي) */}
              {(homeSubSection === "all" || homeSubSection === "experiences") && (
                <ExperiencesSection
                  currentUser={currentUser}
                  onOpenAuthModal={() => setIsAuthOpen(true)}
                />
              )}

              {/* Smart AI Trip Planner (مخطط الرحلات الذكي) */}
              {(homeSubSection === "all" || homeSubSection === "planner") && (
                <TripPlanner />
              )}

              {/* Concise Sub-Section Navigation Footer when a single sub-section is active */}
              {homeSubSection !== "all" && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-[#E6DEC8] rounded-3xl my-6 shadow-sm">
                  <div className="flex items-center gap-2 text-xs text-stone-600">
                    <span>تصفح باقي أقسام السياحة والتجارب:</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    <button
                      onClick={() => setHomeSubSection("all")}
                      className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors"
                    >
                      عرض كافة الأقسام
                    </button>
                    {homeSubSection !== "tour-guides" && (
                      <button
                        onClick={() => setHomeSubSection("tour-guides")}
                        className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-xs font-semibold transition-colors"
                      >
                        المرشدون السياحيون
                      </button>
                    )}
                    {homeSubSection !== "experiences" && (
                      <button
                        onClick={() => setHomeSubSection("experiences")}
                        className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-xs font-semibold transition-colors"
                      >
                        التجارب الحية والطهي
                      </button>
                    )}
                    {homeSubSection !== "planner" && (
                      <button
                        onClick={() => setHomeSubSection("planner")}
                        className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-xs font-semibold transition-colors"
                      >
                        مخطط الجولات
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: سوق الديار والمطبخ والضيافة */}
          {homeActiveTab === "market" && (
            <div className="space-y-0 animate-fadeIn">
              {/* Productive Families & Local Food (المطبخ الشهري والأسر المنتجة) */}
              {(homeSubSection === "all" || homeSubSection === "productive-families") && (
                <ProductiveFamiliesSection
                  onAddToCart={handleAddToCart}
                  cartItems={cartItems}
                  onOpenCart={() => setIsCartOpen(true)}
                  onOpenChatWithSeller={handleOpenChatWithSeller}
                  onOpenSellerRegister={() => setIsSellerRegisterOpen(true)}
                />
              )}

              {/* Hospitality, Resorts, Cafes & Farms (الضيافة والنزل والمزارع) */}
              {(homeSubSection === "all" || homeSubSection === "hospitality") && (
                <HospitalityDirectory />
              )}

              {/* Visitor Community Reviews (سجل مراجعات الزوار) */}
              {(homeSubSection === "all" || homeSubSection === "visitor-reviews") && (
                <VisitorReviewsSection />
              )}

              {/* Concise Sub-Section Navigation Footer when a single sub-section is active */}
              {homeSubSection !== "all" && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-[#E6DEC8] rounded-3xl my-6 shadow-sm">
                  <div className="flex items-center gap-2 text-xs text-stone-600">
                    <span>تصفح باقي أقسام سوق الديار والضيافة:</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    <button
                      onClick={() => setHomeSubSection("all")}
                      className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors"
                    >
                      عرض كافة الأقسام
                    </button>
                    {homeSubSection !== "productive-families" && (
                      <button
                        onClick={() => setHomeSubSection("productive-families")}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 text-xs font-semibold transition-colors"
                      >
                        المطبخ والأسر المنتجة
                      </button>
                    )}
                    {homeSubSection !== "hospitality" && (
                      <button
                        onClick={() => setHomeSubSection("hospitality")}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 text-xs font-semibold transition-colors"
                      >
                        النزل والمزارع والمقاهي
                      </button>
                    )}
                    {homeSubSection !== "visitor-reviews" && (
                      <button
                        onClick={() => setHomeSubSection("visitor-reviews")}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 text-xs font-semibold transition-colors"
                      >
                        مراجعات الزوار
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: عرض جميع الأقسام بالتسلسل الكامل */}
          {homeActiveTab === "all" && (
            <div className="space-y-0 animate-fadeIn">
              {/* 1. Experiences */}
              {(homeSubSection === "all" || homeSubSection === "experiences") && (
                <ExperiencesSection
                  currentUser={currentUser}
                  onOpenAuthModal={() => setIsAuthOpen(true)}
                />
              )}

              {/* 2. Tour Guides */}
              {(homeSubSection === "all" || homeSubSection === "tour-guides") && (
                <TourGuidesSection
                  onBookingSuccess={(booking) => {
                    // Optional callback
                  }}
                />
              )}

              {/* 3. Villages & Hiking */}
              {(homeSubSection === "all" || homeSubSection === "villages-and-trails") && (
                <VillagesAndHikingSection />
              )}

              {/* 4. Productive Families */}
              {(homeSubSection === "all" || homeSubSection === "productive-families") && (
                <ProductiveFamiliesSection
                  onAddToCart={handleAddToCart}
                  cartItems={cartItems}
                  onOpenCart={() => setIsCartOpen(true)}
                  onOpenChatWithSeller={handleOpenChatWithSeller}
                  onOpenSellerRegister={() => setIsSellerRegisterOpen(true)}
                />
              )}

              {/* 5. Interactive Map */}
              {(homeSubSection === "all" || homeSubSection === "interactive-map") && (
                <InteractiveMapSection />
              )}

              {/* 6. Heritage */}
              {(homeSubSection === "all" || homeSubSection === "heritage") && (
                <HeritageSection
                  onOpenFortsDirectory={() => navigateTo("forts")}
                />
              )}

              {/* 7. Attractions Explorer */}
              {(homeSubSection === "all" || homeSubSection === "attractions") && (
                <AttractionsExplorer
                  bookmarkedIds={bookmarkedIds}
                  onToggleBookmark={toggleBookmark}
                  onAskAiAboutAttraction={handleAskAiAboutAttraction}
                />
              )}

              {/* 8. Trip Planner */}
              {(homeSubSection === "all" || homeSubSection === "planner") && (
                <TripPlanner />
              )}

              {/* 9. Dialect Quiz */}
              {(homeSubSection === "all" || homeSubSection === "dialect") && (
                <DialectAndCultureQuiz />
              )}

              {/* 10. Hospitality Directory */}
              {(homeSubSection === "all" || homeSubSection === "hospitality") && (
                <HospitalityDirectory />
              )}

              {/* 11. Visitor Reviews */}
              {(homeSubSection === "all" || homeSubSection === "visitor-reviews") && (
                <VisitorReviewsSection />
              )}
            </div>
          )}
        </div>

      </main>

      {/* Footer */}
      <Footer 
        openAdminLogin={() => setIsAdminLoginOpen(true)} 
        openPrivacyPolicy={() => setIsPrivacyPolicyOpen(true)}
        onScrollToTop={scrollToTop}
      />

      {/* Back to Top Floating Button (Shows when scrolled down) */}
      {showBackToTop && (
        <div className="fixed bottom-24 sm:bottom-8 left-4 sm:left-8 z-40 animate-fadeIn">
          <button
            onClick={scrollToTop}
            title="العودة لأعلى الصفحة"
            aria-label="العودة لأعلى الصفحة"
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-[#12201A] hover:text-emerald-900 transition-all duration-300 hover:scale-105 active:scale-95 group focus:outline-none"
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(24px) saturate(190%)",
              WebkitBackdropFilter: "blur(24px) saturate(190%)",
              border: "1px solid rgba(255, 255, 255, 0.95)",
              boxShadow: "0 14px 36px -6px rgba(22, 46, 34, 0.18), 0 4px 14px -3px rgba(0, 0, 0, 0.08), inset 0 1px 1px 0 rgba(255, 255, 255, 1)"
            }}
          >
            <div className="w-8 h-8 rounded-full bg-[#12201A] text-white flex items-center justify-center shadow-sm group-hover:bg-emerald-800 transition-colors">
              <ArrowUp className="w-4 h-4 stroke-[2.5] group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </button>
        </div>
      )}

      {/* Modals and Drawers */}
      
      {/* Smart AI Guide Modal */}
      <SmartAiGuideModal
        isOpen={isAiGuideOpen}
        onClose={() => setIsAiGuideOpen(false)}
        initialPrompt={aiGuidePrompt}
      />

      {/* Bookmarks Drawer */}
      <BookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarkedIds={bookmarkedIds}
        onRemoveBookmark={toggleBookmark}
        onClearAll={clearAllBookmarks}
        onAskAi={handleAskAiAboutAttraction}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Food Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderSuccess={(order) => {
          handleClearCart();
          setIsCheckoutOpen(false);
        }}
      />

      {/* Monetization & Revenue Streams Modal */}
      <MonetizationModelModal
        isOpen={isMonetizationOpen}
        onClose={() => setIsMonetizationOpen(false)}
      />

      {/* Digital Wallet & Moyasar Integration Modal */}
      <WalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
      />

      {/* Account & Profile Menu Modal (Tripadvisor Style) */}
      <AccountMenuModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onUserUpdated={(updated) => setCurrentUser(updated)}
        onOpenWallet={() => setIsWalletOpen(true)}
        onOpenNotifications={() => setIsNotificationsDrawerOpen(true)}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenChat={() => {
          setChatRecipient(undefined);
          setIsChatOpen(true);
        }}
        onOpenDashboards={() => setIsDashboardsOpen(true)}
        onOpenSupervisorNomination={() => setIsSupervisorNominationOpen(true)}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
      />

      {/* Control Dashboards Modal */}
      <DashboardsModal
        isOpen={isDashboardsOpen}
        onClose={() => setIsDashboardsOpen(false)}
        currentUser={currentUser}
        onUserUpdated={(updated) => setCurrentUser(updated)}
        onOpenDatabaseSchema={() => {
          setIsDashboardsOpen(false);
          setIsSchemaOpen(true);
        }}
      />

      {/* Tribes Directory & Supervisor Broadcast Modal */}
      <TribesModal
        isOpen={isTribesOpen}
        onClose={() => setIsTribesOpen(false)}
      />

      {/* Forts and History Interactive Directory Modal */}
      <FortsAndHistoryModal
        isOpen={isFortsModalOpen}
        onClose={() => setIsFortsModalOpen(false)}
      />

      {/* Firebase Firestore PostgreSQL Schema Modal */}
      <DatabaseSchemaModal
        isOpen={isSchemaOpen}
        onClose={() => setIsSchemaOpen(false)}
      />

      {/* Secure In-App Anti-Bypass Chat Modal */}
      <SecureChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentUser={currentUser}
        recipient={chatRecipient}
        contextType={chatContextType}
        contextEntityId={chatContextEntityId}
        contextTitle={chatContextTitle}
      />

      {/* Seller / Productive Family Onboarding Modal */}
      <SellerRegistrationModal
        isOpen={isSellerRegisterOpen}
        onClose={() => setIsSellerRegisterOpen(false)}
        currentUser={currentUser}
        onRegistered={(newSeller) => {
          setIsSellerRegisterOpen(false);
        }}
      />

      {/* Firebase Firestore Admin & Tribe Supervisor Secure Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={(user, targetRoute) => {
          setCurrentUser(user);
          setIsAdminLoginOpen(false);
          setIsDashboardsOpen(true);
        }}
      />

      {/* Tribe Supervisor Nomination & Registration Workflow Modal */}
      <SupervisorNominationModal
        isOpen={isSupervisorNominationOpen}
        onClose={() => setIsSupervisorNominationOpen(false)}
      />

      {/* Real-time Firebase Push Notifications Drawer */}
      <NotificationsDrawer
        isOpen={isNotificationsDrawerOpen}
        onClose={() => setIsNotificationsDrawerOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() => pushNotificationService.markAllAsRead()}
        onClearAll={() => pushNotificationService.clearAll()}
        onOpenNomination={(nomId) => {
          setIsNotificationsDrawerOpen(false);
          setIsDashboardsOpen(true);
        }}
      />

      {/* Real-time Push Notification Floating Toast */}
      {activePushToast && (
        <PushNotificationToast
          notification={activePushToast}
          onClose={() => setActivePushToast(null)}
          onClick={handleNotificationToastClick}
        />
      )}

      {/* Official Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyPolicyOpen}
        onClose={() => setIsPrivacyPolicyOpen(false)}
      />

      {/* Floating Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        currentView={currentView}
        onNavigate={navigateTo}
        onOpenEvents={() => scrollToSection("experiences")}
        onOpenAccount={() => setIsAuthOpen(true)}
        isLoggedIn={currentUser.role !== "guest"}
      />

    </div>
  );
}
