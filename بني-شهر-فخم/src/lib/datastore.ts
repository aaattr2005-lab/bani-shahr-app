import { 
  UserProfile, 
  GuideBooking, 
  Order, 
  FoodItem, 
  FoodSeller, 
  TourGuide, 
  VisitorReview,
  CartItem,
  Village,
  AuditLog,
  Complaint,
  PlatformPayment,
  CommissionSettings,
  BaniShahrExperience,
  ExperienceBooking,
  MemoryItem,
  MemoryContributionSubmission,
  WalletAccount,
  WalletTransaction,
  MoyasarConfig,
  ChatMessage,
  ChatConversation,
  ChatReport,
  LineageModificationRequest,
  TribeNewsEvent,
  PlatformAd,
  BusinessLeaderSponsorship,
  BroadcastNotification,
  TribeSupervisorAccount,
  TribalPost,
  TribalPostReply
} from "../types";
import { VILLAGES_DATA, TOUR_GUIDES_DATA, FOOD_SELLERS_DATA, FOOD_ITEMS_DATA } from "../data/baniShahrData";
import { EXPERIENCES_DATA } from "../data/experiencesData";
import { MEMORY_ITEMS_DATA } from "../data/memoriesData";
import { AppStorage } from "./nativeStorage";

// Local storage persistence keys
const STORAGE_KEYS = {
  USER: "bani_shahr_auth_user",
  USERS_LIST: "bani_shahr_users_list",
  VILLAGES: "bani_shahr_villages_list",
  BOOKINGS: "bani_shahr_guide_bookings",
  ORDERS: "bani_shahr_food_orders",
  CART: "bani_shahr_cart_items",
  REVIEWS: "bani_shahr_visitor_reviews",
  NOTIFICATIONS: "bani_shahr_notifications",
  AUDIT_LOGS: "bani_shahr_audit_logs",
  COMPLAINTS: "bani_shahr_complaints",
  PAYMENTS: "bani_shahr_platform_payments",
  COMMISSIONS: "bani_shahr_commission_settings",
  EXPERIENCES: "bani_shahr_experiences_list",
  EXP_BOOKINGS: "bani_shahr_experience_bookings",
  MEMORIES: "bani_shahr_heritage_memories",
  WALLET: "bani_shahr_wallet_account",
  WALLET_TXS: "bani_shahr_wallet_transactions",
  MOYASAR_CONFIG: "bani_shahr_moyasar_config",
  SELLERS: "bani_shahr_food_sellers",
  FOOD_ITEMS: "bani_shahr_food_items",
  CONVERSATIONS: "bani_shahr_chat_conversations",
  MESSAGES: "bani_shahr_chat_messages",
  CHAT_REPORTS: "bani_shahr_chat_reports",
  LINEAGE_REQUESTS: "bani_shahr_lineage_requests",
  TRIBE_NEWS: "bani_shahr_tribe_news",
  ADS: "bani_shahr_platform_ads",
  BUSINESSMEN: "bani_shahr_businessmen_sponsorships",
  BROADCASTS: "bani_shahr_broadcast_notifications",
  SUPERVISORS: "bani_shahr_supervisor_accounts",
  WISHLIST: "bani_shahr_user_wishlist",
  TRIBAL_POSTS: "bani_shahr_tribal_community_posts",
};

let _idCounter = 0;
export const generateUniqueId = (prefix: string = "ID"): string => {
  _idCounter += 1;
  const timePart = Date.now().toString(36);
  const randPart = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timePart}-${randPart}-${_idCounter}`;
};

export function ensureUniqueListIds<T extends { id: string }>(items: T[], prefix: string): T[] {
  const seen = new Set<string>();
  return items.map((item, idx) => {
    let id = item.id;
    if (!id || seen.has(id)) {
      id = `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}-${idx + 1}`;
    }
    seen.add(id);
    return { ...item, id };
  });
}

export class DataStore {
  // --- USER AUTHENTICATION & PROFILES ---
  static getCurrentUser(): UserProfile {
    try {
      const stored = AppStorage.getItem(STORAGE_KEYS.USER);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    // Default guest visitor
    return {
      id: "guest-user-1001",
      name: "ضيف بني شهر الكرام",
      phone: "0501234567",
      role: "admin", // Default to admin for seamless evaluation
      isVerified: true,
      city: "النماص",
      permissions: ["all_access"]
    };
  }

  static setCurrentUser(user: UserProfile): void {
    AppStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    this.saveUser(user);
    this.logAction({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      actionType: "LOGIN",
      targetModule: "SECURITY",
      details: `تسجيل الدخول / تبديل الجلسة كـ ${user.name} (${user.role})`
    });
  }

  // --- USERS MANAGEMENT & RBAC ---
  static getUsers(): UserProfile[] {
    try {
      const stored = AppStorage.getItem(STORAGE_KEYS.USERS_LIST);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    const initialUsers: UserProfile[] = [
      {
        id: "usr-admin-1",
        name: "عبد العزيز الشهري (المشرف العام)",
        phone: "0500000001",
        email: "admin@banishahr.sa",
        role: "super_admin",
        city: "النماص",
        isVerified: true,
        permissions: ["all_access", "manage_users", "manage_villages", "manage_finances", "audit_logs"]
      },
      {
        id: "usr-sup-aqiqah",
        name: "الشيخ عبد الله بن ظافر الشهري",
        phone: "0505123456",
        email: "aqiqah.supervisor@banishahr.sa",
        role: "village_supervisor",
        city: "النماص",
        isVerified: true,
        assignedVillageId: "vil-al-aqiqah",
        assignedVillageName: "قرية العقيقة التراثية",
        assignedRegion: "النماص",
        supervisorCode: "AQIQAH-77",
        subscriptionPlan: "annual",
        subscriptionStatus: "active",
        subscriptionExpiry: "2027-01-01",
        permissions: ["manage_village_content", "publish_events", "edit_castles", "view_village_stats"]
      },
      {
        id: "usr-sup-madanah",
        name: "الأستاذ سعيد بن محمد الشهري",
        phone: "0559876543",
        email: "madanah.supervisor@banishahr.sa",
        role: "village_supervisor",
        city: "النماص",
        isVerified: true,
        assignedVillageId: "vil-al-madanah",
        assignedVillageName: "قرية المدانة التاريخية",
        assignedRegion: "النماص",
        supervisorCode: "MADANAH-99",
        subscriptionPlan: "annual",
        subscriptionStatus: "active",
        subscriptionExpiry: "2027-03-15",
        permissions: ["manage_village_content", "publish_events", "edit_castles", "view_village_stats"]
      },
      {
        id: "usr-guide-1",
        name: "الكابتن فهد بن علي الشهري",
        phone: "0501234567",
        role: "tour_guide",
        city: "تنومة",
        isVerified: true,
        permissions: ["manage_tours", "manage_bookings"]
      },
      {
        id: "usr-seller-1",
        name: "أم خالد الشهري (المذاق الأصيل)",
        phone: "0543219876",
        role: "food_seller",
        city: "تنومة",
        isVerified: true,
        permissions: ["manage_products", "manage_orders"]
      },
      {
        id: "usr-visitor-1",
        name: "محمد القحطاني (سائح)",
        phone: "0551122334",
        role: "visitor",
        city: "الرياض",
        isVerified: true,
        permissions: ["make_bookings", "place_orders", "write_reviews"]
      }
    ];
    AppStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(initialUsers));
    return initialUsers;
  }

  static saveUser(user: UserProfile): void {
    const list = this.getUsers();
    const updated = [user, ...list.filter(u => u.id !== user.id)];
    AppStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(updated));
  }

  static updateUserRole(userId: string, role: UserProfile["role"], assignedVillageId?: string, assignedVillageName?: string): void {
    const list = this.getUsers();
    const updated = list.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          role,
          assignedVillageId: assignedVillageId || u.assignedVillageId,
          assignedVillageName: assignedVillageName || u.assignedVillageName
        };
      }
      return u;
    });
    AppStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(updated));
    const targetUser = list.find(u => u.id === userId);
    this.logAction({
      userId: this.getCurrentUser().id,
      userName: this.getCurrentUser().name,
      userRole: this.getCurrentUser().role,
      actionType: "PERMISSION_CHANGE",
      targetModule: "USERS",
      details: `تحديث دور المستخدم [${targetUser?.name || userId}] إلى [${role}]` + (assignedVillageName ? ` مع ربطه بـ ${assignedVillageName}` : "")
    });
  }

  // --- VILLAGES MANAGEMENT ---
  static getVillages(): Village[] {
    try {
      const stored = AppStorage.getItem(STORAGE_KEYS.VILLAGES);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    AppStorage.setItem(STORAGE_KEYS.VILLAGES, JSON.stringify(VILLAGES_DATA));
    return VILLAGES_DATA;
  }

  static saveVillage(village: Village): void {
    const list = this.getVillages();
    const updated = [village, ...list.filter(v => v.id !== village.id)];
    AppStorage.setItem(STORAGE_KEYS.VILLAGES, JSON.stringify(updated));
    this.logAction({
      userId: this.getCurrentUser().id,
      userName: this.getCurrentUser().name,
      userRole: this.getCurrentUser().role,
      actionType: "UPDATE",
      targetModule: "VILLAGES",
      villageScope: village.name,
      details: `تحديث بيانات ومحتوى قرية [${village.name}]`
    });
  }

  static updateVillageSupervisor(
    villageId: string, 
    supervisorId: string, 
    supervisorName: string, 
    supervisorPhone: string,
    supervisorCode: string,
    tier: Village["subscriptionTier"] = "pro_annual"
  ): void {
    const villages = this.getVillages();
    const updated = villages.map(v => {
      if (v.id === villageId) {
        return {
          ...v,
          supervisorId,
          supervisorName,
          supervisorPhone,
          supervisorCode,
          subscriptionTier: tier,
          subscriptionStatus: "active" as const,
          subscriptionExpiresAt: "2027-08-01",
          lastModifiedBy: supervisorName,
          lastModifiedAt: new Date().toISOString()
        };
      }
      return v;
    });
    AppStorage.setItem(STORAGE_KEYS.VILLAGES, JSON.stringify(updated));
    this.logAction({
      userId: this.getCurrentUser().id,
      userName: this.getCurrentUser().name,
      userRole: this.getCurrentUser().role,
      actionType: "PERMISSION_CHANGE",
      targetModule: "VILLAGES",
      details: `تعيين المشرف [${supervisorName}] برمز دخول [${supervisorCode}] للقرية [${villageId}]`
    });
  }

  static renewVillageSubscription(villageId: string, plan: "monthly" | "annual", paymentMethod: string): void {
    const villages = this.getVillages();
    const village = villages.find(v => v.id === villageId);
    if (!village) return;

    const expiryDate = new Date();
    if (plan === "annual") {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    } else {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    }

    const updated = villages.map(v => {
      if (v.id === villageId) {
        return {
          ...v,
          subscriptionTier: plan === "annual" ? "pro_annual" as const : "basic_monthly" as const,
          subscriptionStatus: "active" as const,
          subscriptionExpiresAt: expiryDate.toISOString().split("T")[0]
        };
      }
      return v;
    });
    AppStorage.setItem(STORAGE_KEYS.VILLAGES, JSON.stringify(updated));

    const amount = plan === "annual" ? 1400 : 150;
    this.savePayment({
      id: "PAY-SUB-" + Date.now().toString().slice(-6),
      transactionNumber: "TXN-VIL-" + Math.floor(100000 + Math.random() * 900000),
      type: "village_subscription",
      payerName: village.supervisorName || "مشرف قرية " + village.name,
      payerRole: "village_supervisor",
      amount,
      commissionRate: 0,
      netAmount: amount,
      paymentMethod: paymentMethod as any,
      status: "completed",
      relatedEntityId: village.id,
      relatedEntityName: village.name,
      createdAt: new Date().toISOString()
    });

    this.logAction({
      userId: this.getCurrentUser().id,
      userName: this.getCurrentUser().name,
      userRole: this.getCurrentUser().role,
      actionType: "SUBSCRIPTION_RENEW",
      targetModule: "PAYMENTS",
      villageScope: village.name,
      details: `تجديد اشتراك [${village.name}] بنجاح (${plan === "annual" ? "سنوي: 1,400 ريال" : "شهري: 150 ريال"}) حتى ${expiryDate.toISOString().split("T")[0]}`
    });
  }

  // --- AUDIT LOGS ---
  static getAuditLogs(): AuditLog[] {
    try {
      const stored = AppStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      if (stored) {
        const parsed: AuditLog[] = JSON.parse(stored);
        return ensureUniqueListIds(parsed, "LOG");
      }
    } catch (e) {
      console.error(e);
    }
    const initialLogs: AuditLog[] = [
      {
        id: "log-1",
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        userId: "usr-sup-aqiqah",
        userName: "الشيخ عبد الله الشهري",
        userRole: "مشرف قرية العقيقة",
        actionType: "UPDATE",
        targetModule: "VILLAGES",
        villageScope: "قرية العقيقة التراثية",
        details: "تحديث فعاليات موسم حصاد البُر وتوثيق الحصن الشمالي",
        ipAddress: "192.168.1.45"
      },
      {
        id: "log-2",
        timestamp: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
        userId: "usr-sup-madanah",
        userName: "الأستاذ سعيد الشهري",
        userRole: "مشرف قرية المدانة",
        actionType: "CREATE",
        targetModule: "FORTS",
        villageScope: "قرية المدانة التاريخية",
        details: "إضافة تقرير الترميم المعماري لقصبات المرو الأبيض",
        ipAddress: "192.168.1.88"
      },
      {
        id: "log-3",
        timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
        userId: "usr-admin-1",
        userName: "عبد العزيز الشهري",
        userRole: "المشرف العام",
        actionType: "SUBSCRIPTION_RENEW",
        targetModule: "PAYMENTS",
        villageScope: "قرية العقيقة التراثية",
        details: "اعتماد الاشتراك السنوي Pro وتفعيل الصلاحيات الذهبية",
        ipAddress: "10.0.0.1"
      }
    ];
    AppStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(initialLogs));
    return initialLogs;
  }

  static logAction(params: {
    userId: string;
    userName: string;
    userRole: string;
    actionType: AuditLog["actionType"];
    targetModule: AuditLog["targetModule"];
    details: string;
    villageScope?: string;
  }): void {
    const list = this.getAuditLogs();
    const newLog: AuditLog = {
      id: generateUniqueId("LOG"),
      timestamp: new Date().toISOString(),
      userId: params.userId,
      userName: params.userName,
      userRole: params.userRole,
      actionType: params.actionType,
      targetModule: params.targetModule,
      details: params.details,
      villageScope: params.villageScope,
      ipAddress: "192.168.1." + Math.floor(10 + Math.random() * 80)
    };
    AppStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify([newLog, ...list.slice(0, 99)]));
  }

  // --- COMPLAINTS & TICKETS ---
  static getComplaints(): Complaint[] {
    try {
      const stored = AppStorage.getItem(STORAGE_KEYS.COMPLAINTS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    const initialComplaints: Complaint[] = [
      {
        id: "cmp-101",
        ticketNumber: "TKT-8921",
        userId: "usr-visitor-1",
        userName: "سعد بن علي القحطاني",
        userPhone: "0543219876",
        category: "خدمات قرية",
        relatedVillageOrService: "قرية العقيقة التراثية",
        title: "طلب توضيح مسار الوصول للسيارات الصغيرة عند زيارة الحصن",
        description: "يرجى وضع لوحة إرشادية عند المنعطف الرئيسي لتسهيل وصول سيارات السيدان إلى مواقف الحصن.",
        status: "in_progress",
        priority: "medium",
        assignedTo: "مشرف قرية العقيقة",
        adminResponse: "تم التنسيق مع مشرف القرية وجاري تثبيت لوحة خشبية تراثية إرشادية عند المدخل.",
        createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString()
      },
      {
        id: "cmp-102",
        ticketNumber: "TKT-8922",
        userId: "usr-visitor-2",
        userName: "د. عبد الرحمن الغامدي",
        userPhone: "0556677889",
        category: "حجز مرشد",
        relatedVillageOrService: "مسار منعاء - الكابتن فهد",
        title: "استفسار بخصوص موعد انطلاق جولة شروق الشمس",
        description: "هل يمكن تعديل الموعد ليبدأ الساعة 5:30 فجراً بدلاً من 6:00 صباحاً؟",
        status: "resolved",
        priority: "low",
        adminResponse: "تم التواصل مع المرشد وتمت الموافقة وتعديل الموعد في تذكرة الحجز الإلكترونية.",
        createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString()
      }
    ];
    AppStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(initialComplaints));
    return initialComplaints;
  }

  static saveComplaint(complaint: Complaint): void {
    const list = this.getComplaints();
    const updated = [complaint, ...list.filter(c => c.id !== complaint.id)];
    AppStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(updated));
    this.logAction({
      userId: this.getCurrentUser().id,
      userName: this.getCurrentUser().name,
      userRole: this.getCurrentUser().role,
      actionType: "CREATE",
      targetModule: "COMPLAINTS",
      details: `تقديم تذكرة دعم / بلاغ رقم [${complaint.ticketNumber}]: ${complaint.title}`
    });
  }

  static updateComplaintStatus(id: string, status: Complaint["status"], adminResponse?: string): void {
    const list = this.getComplaints();
    const updated = list.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status,
          ...(adminResponse ? { adminResponse } : {}),
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    });
    AppStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(updated));
    this.logAction({
      userId: this.getCurrentUser().id,
      userName: this.getCurrentUser().name,
      userRole: this.getCurrentUser().role,
      actionType: "STATUS_CHANGE",
      targetModule: "COMPLAINTS",
      details: `تحديث حالة التذكرة [${id}] إلى [${status}]`
    });
  }

  // --- PAYMENTS & COMMISSIONS ---
  static getPayments(): PlatformPayment[] {
    try {
      const stored = AppStorage.getItem(STORAGE_KEYS.PAYMENTS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    const initialPayments: PlatformPayment[] = [
      {
        id: "PAY-1001",
        transactionNumber: "TXN-882190",
        type: "village_subscription",
        payerName: "الشيخ عبد الله بن ظافر الشهري",
        payerRole: "مشرف قرية العقيقة",
        amount: 1400,
        commissionRate: 0,
        netAmount: 1400,
        paymentMethod: "mada",
        status: "completed",
        relatedEntityId: "vil-al-aqiqah",
        relatedEntityName: "قرية العقيقة التراثية (اشتراك سنوي Pro)",
        createdAt: "2026-08-01T10:00:00Z"
      },
      {
        id: "PAY-1002",
        transactionNumber: "TXN-882191",
        type: "village_subscription",
        payerName: "الأستاذ سعيد بن محمد الشهري",
        payerRole: "مشرف قرية المدانة",
        amount: 1400,
        commissionRate: 0,
        netAmount: 1400,
        paymentMethod: "apple_pay",
        status: "completed",
        relatedEntityId: "vil-al-madanah",
        relatedEntityName: "قرية المدانة التاريخية (اشتراك سنوي Pro)",
        createdAt: "2026-08-05T14:20:00Z"
      },
      {
        id: "PAY-1003",
        transactionNumber: "TXN-882192",
        type: "guide_commission",
        payerName: "الكابتن فهد الشهري",
        payerRole: "مرشد سياحي",
        amount: 450,
        commissionRate: 10,
        netAmount: 45,
        paymentMethod: "apple_pay",
        status: "completed",
        relatedEntityId: "BK-8821",
        relatedEntityName: "عمولة حجز جولة جبل منعاء",
        createdAt: "2026-08-10T12:00:00Z"
      },
      {
        id: "PAY-1004",
        transactionNumber: "TXN-882193",
        type: "order_commission",
        payerName: "أم خالد الشهري",
        payerRole: "أسرة منتجة",
        amount: 244.25,
        commissionRate: 8,
        netAmount: 19.54,
        paymentMethod: "mada",
        status: "completed",
        relatedEntityId: "ORD-9401",
        relatedEntityName: "عمولة طلب مأكولات شعبية",
        createdAt: "2026-08-12T16:30:00Z"
      }
    ];
    AppStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(initialPayments));
    return initialPayments;
  }

  static savePayment(payment: PlatformPayment): void {
    const list = this.getPayments();
    const updated = [payment, ...list.filter(p => p.id !== payment.id)];
    AppStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(updated));
    this.logAction({
      userId: this.getCurrentUser().id,
      userName: this.getCurrentUser().name,
      userRole: this.getCurrentUser().role,
      actionType: "PAYMENT",
      targetModule: "PAYMENTS",
      details: `تسجيل عملية دفع رقم [${payment.transactionNumber}] بمبلغ ${payment.amount} ريال (${payment.relatedEntityName})`
    });
  }

  static getCommissionSettings(): CommissionSettings {
    try {
      const stored = AppStorage.getItem(STORAGE_KEYS.COMMISSIONS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    const defaultSettings: CommissionSettings = {
      guideCommissionPercent: 10,
      foodStoreCommissionPercent: 8,
      villageMonthlyFee: 150,
      villageAnnualFee: 1400,
      autoApproveReviews: false,
      requireSupervisorVerification: true
    };
    AppStorage.setItem(STORAGE_KEYS.COMMISSIONS, JSON.stringify(defaultSettings));
    return defaultSettings;
  }

  static saveCommissionSettings(settings: CommissionSettings): void {
    AppStorage.setItem(STORAGE_KEYS.COMMISSIONS, JSON.stringify(settings));
    this.logAction({
      userId: this.getCurrentUser().id,
      userName: this.getCurrentUser().name,
      userRole: this.getCurrentUser().role,
      actionType: "UPDATE",
      targetModule: "SECURITY",
      details: `تحديث إعدادات العمولات والاشتراكات (عمولة المرشدين: ${settings.guideCommissionPercent}%، المتاجر: ${settings.foodStoreCommissionPercent}%، اشتراك القرية السنوي: ${settings.villageAnnualFee} ريال)`
    });
  }

  // --- REVIEWS MANAGEMENT ---
  static getReviews(): VisitorReview[] {
    try {
      const stored = AppStorage.getItem(STORAGE_KEYS.REVIEWS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    const initialReviews: VisitorReview[] = [
      {
        id: "rev-1",
        author: "سلطان العتيبي",
        city: "الرياض",
        comment: "زيارة استثنائية لقرية العقيقة وحصونها الشامخة، كرم الضيافة الشهري وتنظيم القرية يفوق الوصف!",
        rating: 5,
        date: "منذ يومين",
        attractionName: "قرية وحصون العقيقة"
      },
      {
        id: "rev-2",
        author: "فاطمة الدوسري",
        city: "الدمام",
        comment: "عمارة قرية المدانة وتيجان المرو الأبيض فوق القصبات تحفة معمارية نادرة تستحق العناية والتصوير.",
        rating: 5,
        date: "منذ 4 أيام",
        attractionName: "قرية وقصبات المدانة"
      },
      {
        id: "rev-3",
        author: "م. خالد الأحمد",
        city: "جدة",
        comment: "المسارات الجبلية في تنومة والمطلات على السحاب من أجمل التجارب الطبيعية في المملكة.",
        rating: 5,
        date: "منذ أسبوع",
        attractionName: "مسار قمة منعاء"
      }
    ];
    AppStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(initialReviews));
    return initialReviews;
  }

  static addReview(review: VisitorReview): void {
    const list = this.getReviews();
    const updated = [review, ...list];
    AppStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(updated));
    this.logAction({
      userId: this.getCurrentUser().id,
      userName: review.author,
      userRole: "visitor",
      actionType: "CREATE",
      targetModule: "REVIEWS",
      details: `إضافة تقييم جديد لـ [${review.attractionName}] بتقييم ${review.rating} نجوم`
    });
  }

  static deleteReview(id: string): void {
    const list = this.getReviews();
    const target = list.find(r => r.id === id);
    const updated = list.filter(r => r.id !== id);
    AppStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(updated));
    this.logAction({
      userId: this.getCurrentUser().id,
      userName: this.getCurrentUser().name,
      userRole: this.getCurrentUser().role,
      actionType: "DELETE",
      targetModule: "REVIEWS",
      details: `حذف مراجعة [${target?.attractionName || id}] بقلم (${target?.author || "مجهول"})`
    });
  }

  static getReviewsForAttraction(attractionId: string, attractionName?: string): VisitorReview[] {
    const list = this.getReviews();
    return list.filter(r => {
      if (r.attractionId && r.attractionId === attractionId) return true;
      if (attractionName && r.attractionName && (
        r.attractionName.includes(attractionName) || attractionName.includes(r.attractionName)
      )) return true;
      return false;
    });
  }

  static getAttractionRating(attractionId: string, baseRating: number = 4.8, baseCount: number = 120): { rating: number; count: number } {
    const reviews = this.getReviewsForAttraction(attractionId);
    if (reviews.length === 0) {
      return { rating: baseRating, count: baseCount };
    }
    const sum = reviews.reduce((acc, curr) => acc + (curr.rating || 5), 0);
    const calculated = (baseRating * baseCount + sum) / (baseCount + reviews.length);
    return {
      rating: parseFloat(calculated.toFixed(1)),
      count: baseCount + reviews.length
    };
  }

  // --- WISHLIST / SAVED ITEMS PER USER ---
  static getWishlist(userId?: string): string[] {
    try {
      const uid = userId || this.getCurrentUser().id || "guest";
      const key = `${STORAGE_KEYS.WISHLIST}_${uid}`;
      const stored = AppStorage.getItem(key);
      if (stored) return JSON.parse(stored);
      // Fallback to global legacy bookmarks if empty
      const legacy = AppStorage.getItem("bani_shahr_bookmarks");
      if (legacy) {
        const parsed = JSON.parse(legacy);
        if (Array.isArray(parsed) && parsed.length > 0) {
          AppStorage.setItem(key, JSON.stringify(parsed));
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  }

  static toggleWishlist(itemId: string, userId?: string): string[] {
    try {
      const uid = userId || this.getCurrentUser().id || "guest";
      const key = `${STORAGE_KEYS.WISHLIST}_${uid}`;
      const current = this.getWishlist(uid);
      let updated: string[];
      if (current.includes(itemId)) {
        updated = current.filter(id => id !== itemId);
      } else {
        updated = [...current, itemId];
      }
      AppStorage.setItem(key, JSON.stringify(updated));
      AppStorage.setItem("bani_shahr_bookmarks", JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static isWishlisted(itemId: string, userId?: string): boolean {
    const list = this.getWishlist(userId);
    return list.includes(itemId);
  }

  // --- GUIDE BOOKINGS ---
  static getBookings(): GuideBooking[] {
    try {
      const stored = AppStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: "BK-8821",
        guideId: "guide-1",
        guideName: "الكابتن فهد الشهري",
        userId: "user-1",
        userName: "محمد القحطاني",
        userPhone: "0501234567",
        date: "2026-08-25",
        timeSlot: "06:00 صباحاً - 11:00 صباحاً",
        numberOfGuests: 3,
        destination: "مسار جبل منعا الأسطوري والتسلق الحر",
        notes: "نرجو توفير عصي المشي وحبال الأمان",
        totalPrice: 450,
        status: "confirmed",
        paymentStatus: "paid",
        paymentMethod: "apple_pay",
        createdAt: "2026-08-20T14:30:00Z",
      },
      {
        id: "BK-8822",
        guideId: "guide-2",
        guideName: "الأستاذ عبد الله بن سعيد الشهري",
        userId: "user-2",
        userName: "د. خالد الغامدي",
        userPhone: "0559876543",
        date: "2026-08-28",
        timeSlot: "04:00 عصراً - 08:00 مساءً",
        numberOfGuests: 5,
        destination: "جولة تاريخية في حصون العقيقة والمدانة والغال",
        notes: "وفد عائلي مهتم بتوثيق تاريخ ونقوش الحصون",
        totalPrice: 600,
        status: "confirmed",
        paymentStatus: "paid",
        paymentMethod: "mada",
        createdAt: "2026-08-21T09:15:00Z",
      },
    ];
  }

  static saveBooking(booking: GuideBooking): void {
    const list = this.getBookings();
    const updated = [booking, ...list.filter((b) => b.id !== booking.id)];
    AppStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
    this.logAction({
      userId: booking.userId,
      userName: booking.userName,
      userRole: "visitor",
      actionType: "CREATE",
      targetModule: "BOOKINGS",
      details: `حجز جولة جديدة برقم [${booking.id}] مع المرشد [${booking.guideName}] بمبلغ ${booking.totalPrice} ريال`
    });
  }

  static updateBookingStatus(
    id: string, 
    status: GuideBooking["status"], 
    paymentStatus?: GuideBooking["paymentStatus"]
  ): void {
    const list = this.getBookings();
    const updated = list.map((b) => {
      if (b.id === id) {
        return {
          ...b,
          status,
          ...(paymentStatus ? { paymentStatus } : {}),
        };
      }
      return b;
    });
    AppStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
    this.logAction({
      userId: this.getCurrentUser().id,
      userName: this.getCurrentUser().name,
      userRole: this.getCurrentUser().role,
      actionType: "STATUS_CHANGE",
      targetModule: "BOOKINGS",
      details: `تحديث حالة الحجز [${id}] إلى [${status}]`
    });
  }

  // --- FOOD ORDERS ---
  static getOrders(): Order[] {
    try {
      const stored = AppStorage.getItem(STORAGE_KEYS.ORDERS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: "ORD-9401",
        userId: "user-1",
        userName: "سعد بن علي",
        userPhone: "0543219876",
        deliveryAddress: "منتزه المحفار، نزل السحاب، شاليه رقم 4",
        city: "تنومة",
        items: [
          {
            itemId: "food-1",
            name: "عريكة جنوبية ملكية بالسمن والعسل الشهري",
            price: 85,
            quantity: 1,
            sellerName: "أم خالد الشهري - المذاق الأصيل",
          },
          {
            itemId: "food-4",
            name: "دغابيس جنوبية بالمرق ولحم الحاشي",
            price: 110,
            quantity: 1,
            sellerName: "أم خالد الشهري - المذاق الأصيل",
          },
        ],
        subtotal: 195,
        deliveryFee: 20,
        tax: 29.25,
        grandTotal: 244.25,
        status: "preparing",
        paymentMethod: "apple_pay",
        paymentStatus: "paid",
        createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      },
      {
        id: "ORD-9402",
        userId: "user-3",
        userName: "فيصل الشهري",
        userPhone: "0566778899",
        deliveryAddress: "حي آل وليد، بجوار جامع الملك فهد",
        city: "النماص",
        items: [
          {
            itemId: "food-5",
            name: "عسل سدر شهري فاخر (نصف كيلو)",
            price: 240,
            quantity: 2,
            sellerName: "مناحل السراة وتهامة - عسل بلدي",
          },
        ],
        subtotal: 480,
        deliveryFee: 15,
        tax: 72,
        grandTotal: 567,
        status: "on_the_way",
        paymentMethod: "mada",
        paymentStatus: "paid",
        createdAt: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
      },
    ];
  }

  static saveOrder(order: Order): void {
    const list = this.getOrders();
    const updated = [order, ...list.filter((o) => o.id !== order.id)];
    AppStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
    this.logAction({
      userId: order.userId,
      userName: order.userName,
      userRole: "visitor",
      actionType: "CREATE",
      targetModule: "ORDERS",
      details: `إنشاء طلب متجر محلي جديد رقم [${order.id}] بإجمالي ${order.grandTotal} ريال`
    });
  }

  static updateOrderStatus(id: string, status: Order["status"]): void {
    const list = this.getOrders();
    const updated = list.map((o) => (o.id === id ? { ...o, status } : o));
    AppStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
    this.logAction({
      userId: this.getCurrentUser().id,
      userName: this.getCurrentUser().name,
      userRole: this.getCurrentUser().role,
      actionType: "STATUS_CHANGE",
      targetModule: "ORDERS",
      details: `تحديث حالة الطلب [${id}] إلى [${status}]`
    });
  }

  // --- CART OPERATIONS ---
  static getCart(): CartItem[] {
    try {
      const stored = AppStorage.getItem(STORAGE_KEYS.CART);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [];
  }

  static setCart(items: CartItem[]): void {
    AppStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
  }

  static addToCart(item: FoodItem, quantity: number = 1): void {
    const cart = this.getCart();
    const existingIndex = cart.findIndex((c) => c.item.id === item.id);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({ item, quantity });
    }
    this.setCart(cart);
  }

  static updateCartQuantity(itemId: string, delta: number): void {
    let cart = this.getCart();
    const existingIndex = cart.findIndex((c) => c.item.id === itemId);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += delta;
      if (cart[existingIndex].quantity <= 0) {
        cart = cart.filter((c) => c.item.id !== itemId);
      }
    }
    this.setCart(cart);
  }

  static removeFromCart(itemId: string): void {
    const cart = this.getCart().filter((c) => c.item.id !== itemId);
    this.setCart(cart);
  }

  static clearCart(): void {
    this.setCart([]);
  }

  // --- EXPERIENCES & WORKSHOPS ---
  static getExperiences(): BaniShahrExperience[] {
    try {
      const stored = AppStorage.getItem(STORAGE_KEYS.EXPERIENCES);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    AppStorage.setItem(STORAGE_KEYS.EXPERIENCES, JSON.stringify(EXPERIENCES_DATA));
    return EXPERIENCES_DATA;
  }

  static saveExperience(exp: BaniShahrExperience): void {
    const list = this.getExperiences();
    const updated = [exp, ...list.filter(e => e.id !== exp.id)];
    AppStorage.setItem(STORAGE_KEYS.EXPERIENCES, JSON.stringify(updated));
    this.logAction({
      userId: this.getCurrentUser().id,
      userName: this.getCurrentUser().name,
      userRole: this.getCurrentUser().role,
      actionType: "UPDATE",
      targetModule: "VILLAGES",
      details: `تحديث/إضافة تجربة سياحية [${exp.title}] بسعر ${exp.pricePerPerson} ريال/شخص`
    });
  }

  static getExperienceBookings(): ExperienceBooking[] {
    try {
      const stored = AppStorage.getItem(STORAGE_KEYS.EXP_BOOKINGS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    const initialBookings: ExperienceBooking[] = [
      {
        id: "EBK-9011",
        experienceId: "exp-areekah",
        experienceTitle: "تعلم سر صناعة العريكة الشهري بالسمن البلدي وعسل السدر",
        hostName: "أم خالد الشهري",
        userId: "usr-visitor-1",
        userName: "سعد بن علي القحطاني",
        userPhone: "0543219876",
        bookingDate: "2026-08-27",
        timeSlot: "4:30 عصراً - 7:00 مساءً",
        guestsCount: 2,
        pricePerPerson: 120,
        subtotal: 240,
        platformCommissionPercent: 12,
        platformCommissionAmount: 28.8,
        hostEarnings: 211.2,
        status: "confirmed",
        paymentMethod: "apple_pay",
        paymentStatus: "paid",
        createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
      },
      {
        id: "EBK-9012",
        experienceId: "exp-honey",
        experienceTitle: "يوم النحال: جني واستخلاص عسل السدر والشوكة في مناحل السراة",
        hostName: "العم أبو فهد الشهري",
        userId: "usr-visitor-2",
        userName: "د. عبد الرحمن الغامدي",
        userPhone: "0556677889",
        bookingDate: "2026-08-29",
        timeSlot: "7:00 صباحاً - 10:00 صباحاً",
        guestsCount: 3,
        pricePerPerson: 180,
        subtotal: 540,
        platformCommissionPercent: 12,
        platformCommissionAmount: 64.8,
        hostEarnings: 475.2,
        status: "confirmed",
        paymentMethod: "mada",
        paymentStatus: "paid",
        createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString()
      }
    ];
    AppStorage.setItem(STORAGE_KEYS.EXP_BOOKINGS, JSON.stringify(initialBookings));
    return initialBookings;
  }

  static createExperienceBooking(booking: ExperienceBooking): void {
    const list = this.getExperienceBookings();
    const updated = [booking, ...list];
    AppStorage.setItem(STORAGE_KEYS.EXP_BOOKINGS, JSON.stringify(updated));

    // Save platform commission & payment transaction
    this.savePayment({
      id: "PAY-EXP-" + Date.now().toString().slice(-6),
      transactionNumber: "TXN-EXP-" + Math.floor(100000 + Math.random() * 900000),
      type: "experience_commission",
      payerName: booking.userName,
      payerRole: "visitor",
      amount: booking.subtotal,
      commissionRate: booking.platformCommissionPercent,
      netAmount: booking.platformCommissionAmount,
      paymentMethod: booking.paymentMethod,
      status: "completed",
      relatedEntityId: booking.id,
      relatedEntityName: `عمولة تجربة: ${booking.experienceTitle} (${booking.guestsCount} ضيوف)`,
      createdAt: new Date().toISOString()
    });

    this.logAction({
      userId: booking.userId,
      userName: booking.userName,
      userRole: "visitor",
      actionType: "CREATE",
      targetModule: "BOOKINGS",
      details: `حجز تجربة تراثية [${booking.experienceTitle}] لعدد ${booking.guestsCount} أشخاص بمبلغ ${booking.subtotal} ريال (عمولة المنصة: ${booking.platformCommissionAmount} ريال)`
    });
  }

  static updateExperienceBookingStatus(id: string, status: ExperienceBooking["status"]): void {
    const list = this.getExperienceBookings();
    const updated = list.map(b => b.id === id ? { ...b, status } : b);
    AppStorage.setItem(STORAGE_KEYS.EXP_BOOKINGS, JSON.stringify(updated));
    this.logAction({
      userId: this.getCurrentUser().id,
      userName: this.getCurrentUser().name,
      userRole: this.getCurrentUser().role,
      actionType: "STATUS_CHANGE",
      targetModule: "BOOKINGS",
      details: `تحديث حالة حجز التجربة [${id}] إلى [${status}]`
    });
  }

  // --- ذاكرة بني شهر (HERITAGE ARCHIVE & TRIBAL NARRATIONS) ---
  static getMemories(includePending: boolean = false): MemoryItem[] {
    try {
      const stored = AppStorage.getItem(STORAGE_KEYS.MEMORIES);
      if (stored) {
        const parsed: MemoryItem[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge any newly introduced default items (like the 7 verified historical stories) that might be missing from storage
          const existingIds = new Set(parsed.map(m => m.id));
          const missingDefaults = MEMORY_ITEMS_DATA.filter(m => !existingIds.has(m.id));
          let merged = parsed;
          if (missingDefaults.length > 0) {
            // Keep default order prioritized
            const customSubmissions = parsed.filter(m => !MEMORY_ITEMS_DATA.some(d => d.id === m.id));
            merged = [...MEMORY_ITEMS_DATA, ...customSubmissions];
            AppStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(merged));
          }
          if (includePending) return merged;
          return merged.filter(m => m.status === "published");
        }
      }
    } catch (e) {
      console.error(e);
    }
    AppStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(MEMORY_ITEMS_DATA));
    return includePending ? MEMORY_ITEMS_DATA : MEMORY_ITEMS_DATA.filter(m => m.status === "published");
  }

  static getAllMemoriesForAdmin(): MemoryItem[] {
    return this.getMemories(true);
  }

  static submitMemoryContribution(submission: MemoryContributionSubmission): MemoryItem {
    const list = this.getMemories(true);
    const currentUser = this.getCurrentUser();
    
    // Check if auto-approved by super admin / admin or requires review
    const isAdmin = currentUser.role === "admin" || currentUser.role === "super_admin";
    const initialStatus = isAdmin ? "published" : "pending_review";

    const newItem: MemoryItem = {
      id: "mem-" + Date.now().toString().slice(-6),
      title: submission.title,
      tribeBranch: submission.tribeBranch,
      category: submission.category,
      contentType: submission.contentType,
      narratorName: submission.narratorName,
      narratorAgeOrEra: submission.narratorAgeOrEra,
      contributorName: submission.contributorName,
      contributorPhone: submission.contributorPhone,
      villageOrLocation: submission.villageOrLocation,
      region: submission.region,
      dateOfEventOrEra: submission.dateOfEventOrEra,
      content: submission.content,
      imageUrl: submission.imageUrl || (submission.contentType === "historical_document" 
        ? "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80" 
        : "https://images.unsplash.com/photo-1599818816942-0f0489a24ca3?auto=format&fit=crop&w=800&q=80"),
      audioRecordingUrl: submission.audioRecordingUrl,
      documentScanUrl: submission.documentScanUrl,
      status: initialStatus,
      reviewedBy: isAdmin ? currentUser.name : undefined,
      likesCount: 0,
      sharesCount: 0,
      tags: submission.tags || [submission.tribeBranch, submission.category, submission.region],
      createdAt: new Date().toISOString()
    };

    const updated = [newItem, ...list];
    AppStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(updated));

    this.logAction({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      actionType: "CREATE",
      targetModule: "FORTS",
      details: `إرسال مساهمة جديدة في ذاكرة بني شهر: [${newItem.title}] للقبيلة (${newItem.tribeBranch}) - نوع المحتوى: ${newItem.contentType === "oral_narration" ? "رواية شفهية" : newItem.contentType === "verified_info" ? "معلومة موثقة" : "وثيقة تاريخية"} (${initialStatus === "published" ? "منشورة مباشرة" : "بانتظار المراجعة والاعتماد"})`
    });

    return newItem;
  }

  static moderateMemory(id: string, status: "published" | "rejected", moderationNotes?: string): void {
    const list = this.getMemories(true);
    const currentUser = this.getCurrentUser();
    const updated = list.map(m => {
      if (m.id === id) {
        return {
          ...m,
          status,
          moderationNotes,
          reviewedBy: currentUser.name
        };
      }
      return m;
    });

    AppStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(updated));
    const target = list.find(m => m.id === id);

    this.logAction({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      actionType: "STATUS_CHANGE",
      targetModule: "FORTS",
      details: `مراجعة واعتماد محتوى ذاكرة بني شهر [${target?.title || id}] وتعديل الحالة إلى (${status === "published" ? "منشور وموثق" : "مرفوض"})`
    });
  }

  static likeMemory(id: string): void {
    const list = this.getMemories(true);
    const updated = list.map(m => m.id === id ? { ...m, likesCount: m.likesCount + 1 } : m);
    AppStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(updated));
  }

  // -------------------------------------------------------------
  // DIGITAL WALLET & MOYASAR GATEWAY (المحفظة الرقمية وبوابة ميسر)
  // -------------------------------------------------------------

  static getWallet(userId?: string): WalletAccount {
    const currentUser = this.getCurrentUser();
    const uid = userId || currentUser.id;
    try {
      const stored = AppStorage.getItem(`${STORAGE_KEYS.WALLET}_${uid}`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }

    // Default seeded wallet for user
    const defaultWallet: WalletAccount = {
      userId: uid,
      balance: 1450.00, // رصيد افتراضي 1450 ريال سعودي
      pendingBalance: 320.00, // 320 ر.س أرباح تحت المعالجة
      currency: "SAR",
      iban: "SA4480000456608010123456",
      bankName: "مصرف الراجحي (Al Rajhi Bank)",
      accountHolderName: currentUser.name || "ضيف بني شهر الكرام",
      moyasarCustomerId: "cust_bs_" + uid.slice(0, 8),
      lastUpdated: new Date().toISOString()
    };

    AppStorage.setItem(`${STORAGE_KEYS.WALLET}_${uid}`, JSON.stringify(defaultWallet));
    return defaultWallet;
  }

  static saveWallet(wallet: WalletAccount): void {
    AppStorage.setItem(`${STORAGE_KEYS.WALLET}_${wallet.userId}`, JSON.stringify(wallet));
  }

  static getWalletTransactions(userId?: string): WalletTransaction[] {
    const currentUser = this.getCurrentUser();
    const uid = userId || currentUser.id;
    try {
      const stored = AppStorage.getItem(`${STORAGE_KEYS.WALLET_TXS}_${uid}`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }

    // Default Seed Transactions
    const seedTransactions: WalletTransaction[] = [
      {
        id: "tx-moy-8901",
        userId: uid,
        type: "deposit",
        amount: 500.00,
        netAmount: 500.00,
        title: "شحن رصيد المحفظة عبر مدى (Moyasar)",
        description: "شحن فوري ناجح باستخدام بطاقة مدى البنكية عبر بوابة الدفع ميسر",
        status: "completed",
        paymentGateway: "moyasar",
        moyasarPaymentId: "pay_moy_9a8b7c6d5e",
        paymentMethod: "mada",
        referenceId: "DEP-2025-001",
        createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
      },
      {
        id: "tx-moy-8902",
        userId: uid,
        type: "earnings",
        amount: 450.00,
        fee: 45.00, // عمولة المنصة 10%
        netAmount: 405.00,
        title: "أرباح جولة إرشادية - مسار جبل منعاء",
        description: "استلام مستحقات حجز رحلة سياحية بعد اقتطاع عمولة المنصة (10%)",
        status: "completed",
        paymentGateway: "system",
        referenceId: "GB-884102",
        createdAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString()
      },
      {
        id: "tx-moy-8903",
        userId: uid,
        type: "payment",
        amount: 180.00,
        netAmount: 180.00,
        title: "دفع طلب أكلات شعبية (سمن وعسل بلدي)",
        description: "خصم من رصيد المحفظة لصالح مطبخ أم أحمد للأكلات الشعبية",
        status: "completed",
        paymentGateway: "wallet",
        paymentMethod: "wallet",
        referenceId: "ORD-99321",
        createdAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString()
      },
      {
        id: "tx-moy-8904",
        userId: uid,
        type: "deposit",
        amount: 1000.00,
        netAmount: 1000.00,
        title: "شحن رصيد المحفظة عبر Apple Pay (Moyasar)",
        description: "عملية شحن معتمدة من محفظة Apple Pay الرقمية عبر بوابة ميسر",
        status: "completed",
        paymentGateway: "moyasar",
        moyasarPaymentId: "pay_moy_ap_445566",
        paymentMethod: "apple_pay",
        referenceId: "DEP-2025-002",
        createdAt: new Date(Date.now() - 3600000 * 24 * 12).toISOString()
      },
      {
        id: "tx-moy-8905",
        userId: uid,
        type: "payout",
        amount: 300.00,
        fee: 0,
        netAmount: 300.00,
        title: "سحب أرباح إلى حساب الراجحي (IBAN)",
        description: "تحويل بنكي محلي سريع إلى الحساب المنتهي بـ ...3456",
        status: "completed",
        paymentGateway: "bank_transfer",
        referenceId: "PAYOUT-5501",
        createdAt: new Date(Date.now() - 3600000 * 24 * 18).toISOString()
      }
    ];

    AppStorage.setItem(`${STORAGE_KEYS.WALLET_TXS}_${uid}`, JSON.stringify(seedTransactions));
    return seedTransactions;
  }

  static addWalletTransaction(tx: Omit<WalletTransaction, "id" | "createdAt">): WalletTransaction {
    const currentUser = this.getCurrentUser();
    const uid = tx.userId || currentUser.id;
    const txs = this.getWalletTransactions(uid);
    const wallet = this.getWallet(uid);

    const newTx: WalletTransaction = {
      ...tx,
      id: "tx-moy-" + Date.now().toString().slice(-6),
      userId: uid,
      createdAt: new Date().toISOString()
    };

    // Update wallet balance accordingly
    if (tx.type === "deposit" || tx.type === "refund" || tx.type === "earnings") {
      wallet.balance += tx.netAmount;
    } else if (tx.type === "payment" || tx.type === "payout" || tx.type === "commission") {
      wallet.balance = Math.max(0, wallet.balance - tx.amount);
    }
    wallet.lastUpdated = new Date().toISOString();

    this.saveWallet(wallet);
    const updatedTxs = [newTx, ...txs];
    AppStorage.setItem(`${STORAGE_KEYS.WALLET_TXS}_${uid}`, JSON.stringify(updatedTxs));

    this.logAction({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      actionType: "PAYMENT",
      targetModule: "PAYMENTS",
      details: `معاملة محفظة مالية: [${tx.title}] بقيمة ${tx.amount} ر.س (${tx.type}) - الرصيد الجديد: ${wallet.balance} ر.س`
    });

    return newTx;
  }

  static topUpWalletViaMoyasar(
    amount: number, 
    method: "mada" | "apple_pay" | "visa" | "mastercard" | "stc_pay",
    cardInfo?: { cardNumber: string; name: string }
  ): { success: boolean; tx: WalletTransaction; newBalance: number } {
    const currentUser = this.getCurrentUser();
    const moyasarId = "pay_moy_" + Math.random().toString(36).substring(2, 10);

    const methodLabels: Record<string, string> = {
      mada: "مدى (Mada Debit)",
      apple_pay: "Apple Pay",
      visa: "Visa",
      mastercard: "Mastercard",
      stc_pay: "STC Pay"
    };

    const tx = this.addWalletTransaction({
      userId: currentUser.id,
      type: "deposit",
      amount: amount,
      netAmount: amount,
      title: `شحن رصيد المحفظة عبر ${methodLabels[method] || method} (Moyasar)`,
      description: `تمت عملية الشحن بنجاح عبر بوابة الدفع ميسر (Moyasar Gateway ID: ${moyasarId})`,
      status: "completed",
      paymentGateway: "moyasar",
      moyasarPaymentId: moyasarId,
      paymentMethod: method,
      referenceId: "TOPUP-" + Date.now().toString().slice(-6)
    });

    const updatedWallet = this.getWallet(currentUser.id);
    return {
      success: true,
      tx,
      newBalance: updatedWallet.balance
    };
  }

  static requestWalletWithdrawal(amount: number, iban: string, bankName: string): { success: boolean; message: string; tx?: WalletTransaction } {
    const currentUser = this.getCurrentUser();
    const wallet = this.getWallet(currentUser.id);

    if (amount <= 0) {
      return { success: false, message: "يرجى إدخال مبلغ سحب صالح بالريال السعودي." };
    }

    if (wallet.balance < amount) {
      return { success: false, message: `رصيد المحفظة المتاح (${wallet.balance} ر.س) غير كافٍ لسحب ${amount} ر.س.` };
    }

    const tx = this.addWalletTransaction({
      userId: currentUser.id,
      type: "payout",
      amount: amount,
      netAmount: amount,
      title: `سحب رصيد وأرباح إلى الآيبان البنكي (${bankName})`,
      description: `طلب تحويل محلي سريع إلى الآيبان (${iban}) - تحت التنفيذ خلال 24 ساعة عمل`,
      status: "completed",
      paymentGateway: "bank_transfer",
      referenceId: "WD-" + Date.now().toString().slice(-6)
    });

    // Update saved IBAN details
    wallet.iban = iban;
    wallet.bankName = bankName;
    this.saveWallet(wallet);

    return {
      success: true,
      message: `تم تقديم طلب السحب بقيمة ${amount} ر.س بنجاح. سيصل إلى حسابك في ${bankName}.`,
      tx
    };
  }

  static getMoyasarConfig(): MoyasarConfig {
    try {
      const stored = AppStorage.getItem(STORAGE_KEYS.MOYASAR_CONFIG);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }

    const defaultConfig: MoyasarConfig = {
      publishableKey: "pk_test_moyasar_banishahr_2025_demo_key",
      secretKeyPlaceholder: "sk_test_••••••••••••••••••••••••",
      isLiveMode: false,
      webhookUrl: "https://bani-shahr.sa/api/moyasar/webhook",
      supportedMethods: ["mada", "apple_pay", "creditcard", "stcpay"],
      testCards: [
        {
          name: "مدى Mada (بطاقة اختبار معتمدة)",
          type: "mada",
          cardNumber: "4000 0000 0000 0002",
          cvv: "123",
          expiry: "12/28"
        },
        {
          name: "فيزا Visa 3DS (ناجحة)",
          type: "creditcard",
          cardNumber: "4111 1111 1111 1111",
          cvv: "123",
          expiry: "10/27"
        },
        {
          name: "STC Pay Sandbox",
          type: "stcpay",
          cardNumber: "0500000000",
          cvv: "0000",
          expiry: "01/30"
        }
      ]
    };

    AppStorage.setItem(STORAGE_KEYS.MOYASAR_CONFIG, JSON.stringify(defaultConfig));
    return defaultConfig;
  }

  static saveMoyasarConfig(config: MoyasarConfig): void {
    AppStorage.setItem(STORAGE_KEYS.MOYASAR_CONFIG, JSON.stringify(config));
  }

  // --- FOOD SELLERS & PRODUCTIVE FAMILIES ---
  static getSellers(): FoodSeller[] {
    try {
      const stored = AppStorage.getItem(STORAGE_KEYS.SELLERS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    AppStorage.setItem(STORAGE_KEYS.SELLERS, JSON.stringify(FOOD_SELLERS_DATA));
    return FOOD_SELLERS_DATA;
  }

  static saveSeller(seller: FoodSeller): void {
    const list = this.getSellers();
    const updated = [seller, ...list.filter(s => s.id !== seller.id)];
    AppStorage.setItem(STORAGE_KEYS.SELLERS, JSON.stringify(updated));
    this.logAction({
      userId: this.getCurrentUser().id,
      userName: this.getCurrentUser().name,
      userRole: this.getCurrentUser().role,
      actionType: "CREATE",
      targetModule: "SELLERS",
      details: `تسجيل متجر/أسرة منتجة جديدة: [${seller.storeName}] بإشراف [${seller.ownerName}]`
    });
  }

  // --- FOOD ITEMS ---
  static getFoodItems(): FoodItem[] {
    try {
      const stored = AppStorage.getItem(STORAGE_KEYS.FOOD_ITEMS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    AppStorage.setItem(STORAGE_KEYS.FOOD_ITEMS, JSON.stringify(FOOD_ITEMS_DATA));
    return FOOD_ITEMS_DATA;
  }

  static saveFoodItem(item: FoodItem): void {
    const list = this.getFoodItems();
    const updated = [item, ...list.filter(f => f.id !== item.id)];
    AppStorage.setItem(STORAGE_KEYS.FOOD_ITEMS, JSON.stringify(updated));
    this.logAction({
      userId: this.getCurrentUser().id,
      userName: this.getCurrentUser().name,
      userRole: this.getCurrentUser().role,
      actionType: "CREATE",
      targetModule: "SELLERS",
      details: `إضافة صنف طعام شعبي جديد: [${item.name}] بسعر ${item.price} ر.س`
    });
  }

  // --- IN-APP SECURE CHAT SYSTEM (ANTI-BYPASS PROTECTED) ---
  static getConversations(userId?: string): ChatConversation[] {
    try {
      const stored = AppStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      if (stored) {
        const parsed: ChatConversation[] = JSON.parse(stored);
        if (!userId) return parsed;
        return parsed.filter(c => c.participant1Id === userId || c.participant2Id === userId || userId === "usr-admin-1" || userId === "guest-user-1001");
      }
    } catch (e) {
      console.error(e);
    }

    const initialConversations: ChatConversation[] = [
      {
        id: "conv-101",
        type: "order",
        relatedEntityId: "ORD-9401",
        title: "طلب مأكولات: أم خالد الشهري",
        subtitle: "عريكة ملكية ودغابيس بالمرق",
        participant1Id: "guest-user-1001",
        participant1Name: "ضيف بني شهر الكرام",
        participant1Role: "visitor",
        participant1MaskedPhone: "050***567",
        participant2Id: "seller-1",
        participant2Name: "أم خالد الشهري (المذاق الأصيل)",
        participant2Role: "food_seller",
        participant2MaskedPhone: "055***221",
        lastMessage: "تم بدء تجهيز العريكة الملكية بالسمن البري الحار، ستكون جاهزة خلال 25 دقيقة بإذن الله.",
        lastMessageTimestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        unreadCountParticipant1: 0,
        unreadCountParticipant2: 0,
        status: "active",
        createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
      },
      {
        id: "conv-102",
        type: "booking",
        relatedEntityId: "BK-8821",
        title: "حجز جولة: الكابتن فهد الشهري",
        subtitle: "مسار جبل منعاء الأسطوري والتسلق",
        participant1Id: "guest-user-1001",
        participant1Name: "ضيف بني شهر الكرام",
        participant1Role: "visitor",
        participant1MaskedPhone: "050***567",
        participant2Id: "guide-1",
        participant2Name: "الكابتن فهد الشهري",
        participant2Role: "tour_guide",
        participant2MaskedPhone: "050***111",
        lastMessage: "حياكم الله يا غالي. نقطة التجمع ستكون عند مدخل المسار الرئيسي الساعة 6 صباحاً. الأجواء رائعة ومعتدلة.",
        lastMessageTimestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        unreadCountParticipant1: 0,
        unreadCountParticipant2: 0,
        status: "active",
        createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString()
      }
    ];

    AppStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(initialConversations));
    return initialConversations;
  }

  static getMessages(conversationId: string): ChatMessage[] {
    try {
      const stored = AppStorage.getItem(`${STORAGE_KEYS.MESSAGES}_${conversationId}`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }

    // Initial messages for seed conversations
    if (conversationId === "conv-101") {
      const msgs: ChatMessage[] = [
        {
          id: "msg-101-1",
          conversationId: "conv-101",
          senderId: "system",
          senderName: "نظام حماية المنصة",
          senderRole: "admin",
          content: "🔒 تنبيه أمني: المحادثة مشفرة ومحمية داخل التطبيق لضمان حقوقك وسلامة الدفع. يُمنع منعاً باتاً مشاركة أرقام الجوال أو طلب الدفع الخارجي.",
          isSystemNotice: true,
          systemNoticeType: "warning_bypass",
          timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
          isRead: true
        },
        {
          id: "msg-101-2",
          conversationId: "conv-101",
          senderId: "guest-user-1001",
          senderName: "ضيف بني شهر",
          senderRole: "visitor",
          content: "السلام عليكم، هل السمن المستخدم في العريكة بلدي طازج؟",
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          isRead: true
        },
        {
          id: "msg-101-3",
          conversationId: "conv-101",
          senderId: "seller-1",
          senderName: "أم خالد الشهري",
          senderRole: "food_seller",
          content: "وعليكم السلام ورحمة الله، نعم يا كريم سمن بري من مواشي السراة مع عسل سدر بلدي مضمون 100% وإعداد منزلي بعناية تامة.",
          timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
          isRead: true
        },
        {
          id: "msg-101-4",
          conversationId: "conv-101",
          senderId: "seller-1",
          senderName: "أم خالد الشهري",
          senderRole: "food_seller",
          content: "تم بدء تجهيز العريكة الملكية بالسمن البري الحار، ستكون جاهزة خلال 25 دقيقة بإذن الله.",
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          isRead: true
        }
      ];
      AppStorage.setItem(`${STORAGE_KEYS.MESSAGES}_${conversationId}`, JSON.stringify(msgs));
      return msgs;
    }

    if (conversationId === "conv-102") {
      const msgs: ChatMessage[] = [
        {
          id: "msg-102-1",
          conversationId: "conv-102",
          senderId: "system",
          senderName: "نظام حماية المنصة",
          senderRole: "admin",
          content: "🔒 مرحباً بك في مسار جبل منعاء. تم تأكيد الحجز برقم BK-8821. التنسيق يتم عبر الشات الآمن لضمان التغطية التأمينية.",
          isSystemNotice: true,
          systemNoticeType: "booking_status",
          timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
          isRead: true
        },
        {
          id: "msg-102-2",
          conversationId: "conv-102",
          senderId: "guide-1",
          senderName: "الكابتن فهد الشهري",
          senderRole: "tour_guide",
          content: "حياكم الله يا غالي. نقطة التجمع ستكون عند مدخل المسار الرئيسي الساعة 6 صباحاً. الأجواء رائعة ومعتدلة.",
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          isRead: true
        }
      ];
      AppStorage.setItem(`${STORAGE_KEYS.MESSAGES}_${conversationId}`, JSON.stringify(msgs));
      return msgs;
    }

    return [];
  }

  static sendMessage(message: ChatMessage): void {
    const msgs = this.getMessages(message.conversationId);
    const updatedMsgs = [...msgs, message];
    AppStorage.setItem(`${STORAGE_KEYS.MESSAGES}_${message.conversationId}`, JSON.stringify(updatedMsgs));

    // Update conversation lastMessage
    const convos = this.getConversations();
    const updatedConvos = convos.map(c => {
      if (c.id === message.conversationId) {
        return {
          ...c,
          lastMessage: message.isSystemNotice ? `[تنبيه أمني]` : message.content,
          lastMessageTimestamp: message.timestamp,
          updatedAt: message.timestamp
        };
      }
      return c;
    });
    AppStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(updatedConvos));
  }

  static createOrGetConversation(params: {
    type: "order" | "booking" | "experience" | "support" | "direct";
    relatedEntityId: string;
    title: string;
    recipientId: string;
    recipientName: string;
    recipientRole: string;
    recipientPhone?: string;
  }): ChatConversation {
    const currentUser = this.getCurrentUser();
    const convos = this.getConversations();

    const existing = convos.find(c => 
      c.relatedEntityId === params.relatedEntityId || 
      (c.participant2Id === params.recipientId && c.participant1Id === currentUser.id)
    );

    if (existing) {
      return existing;
    }

    const maskPhone = (phone?: string) => {
      if (!phone) return "050***000";
      return phone.slice(0, 3) + "***" + phone.slice(-3);
    };

    const newConvo: ChatConversation = {
      id: "conv-" + Date.now().toString().slice(-6),
      type: params.type,
      relatedEntityId: params.relatedEntityId,
      title: params.title,
      subtitle: `محادثة آمنة مع ${params.recipientName}`,
      participant1Id: currentUser.id,
      participant1Name: currentUser.name,
      participant1Role: currentUser.role,
      participant1MaskedPhone: maskPhone(currentUser.phone),
      participant2Id: params.recipientId,
      participant2Name: params.recipientName,
      participant2Role: params.recipientRole,
      participant2MaskedPhone: maskPhone(params.recipientPhone),
      lastMessage: "تم بدء محادثة آمنة ومحمية",
      lastMessageTimestamp: new Date().toISOString(),
      unreadCountParticipant1: 0,
      unreadCountParticipant2: 0,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = [newConvo, ...convos];
    AppStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(updated));

    // Add security banner message
    const welcomeMsg: ChatMessage = {
      id: "msg-" + Date.now().toString().slice(-6),
      conversationId: newConvo.id,
      senderId: "system",
      senderName: "نظام حماية المنصة",
      senderRole: "admin",
      content: "🔒 تنبيه حماية المنصة: المحادثة مشفرة ومحمية بالكامل. يُمنع إرسال أرقام الجوال أو روابط الواتساب أو طلب التحويل الخارجي لضمان حقوقك وسلامة عمليات الدفع.",
      isSystemNotice: true,
      systemNoticeType: "warning_bypass",
      timestamp: new Date().toISOString(),
      isRead: true
    };
    this.sendMessage(welcomeMsg);

    return newConvo;
  }

  static reportConversation(conversationId: string, reason: string, reporterId: string, details?: string): void {
    const report: ChatReport = {
      id: "rep-" + Date.now().toString().slice(-6),
      conversationId,
      reportedByUserId: reporterId,
      reportedByUserName: this.getCurrentUser().name,
      reason: reason as any,
      details: details || "إبلاغ عن محاولة تجاوز أو مخالفة سياسة التواصل الآمن",
      status: "pending",
      createdAt: new Date().toISOString()
    };

    try {
      const stored = AppStorage.getItem(STORAGE_KEYS.CHAT_REPORTS);
      const list = stored ? JSON.parse(stored) : [];
      AppStorage.setItem(STORAGE_KEYS.CHAT_REPORTS, JSON.stringify([report, ...list]));
    } catch (e) {
      console.error(e);
    }

    this.logAction({
      userId: reporterId,
      userName: this.getCurrentUser().name,
      userRole: this.getCurrentUser().role,
      actionType: "CREATE",
      targetModule: "COMPLAINTS",
      details: `تقديم بلاغ شات ضد المحادثة [${conversationId}] بسبب: [${reason}]`
    });
  }

  // --- LINEAGE MODIFICATION REQUESTS (مراجعة طلبات تعديل النسب) ---
  static getLineageRequests(): LineageModificationRequest[] {
    try {
      const stored = AppStorage.getItem(STORAGE_KEYS.LINEAGE_REQUESTS);
      if (stored) {
        const parsed: LineageModificationRequest[] = JSON.parse(stored);
        return ensureUniqueListIds(parsed, "LIN");
      }
    } catch (e) {
      console.error(e);
    }

    const seedRequests: LineageModificationRequest[] = [
      {
        id: "LIN-901",
        applicantId: "usr-member-301",
        applicantName: "محمد بن فايز بن عبد الله الشهري",
        applicantPhone: "0504445566",
        tribeId: "al-waleed",
        tribeName: "قبيلة آل وليد",
        fakhdhName: "آل قاسم",
        changeType: "document_ancestor",
        currentLineage: "محمد بن فايز بن عبد الله الشهري",
        proposedLineage: "محمد بن فايز بن عبد الله بن سعيد بن قاسم الشهري",
        reason: "إضافة الجد الرابع وتوثيق فرع السلالة وفق وثيقة المبايعة وحجة الإرث العثمانية المؤرخة عام 1318هـ",
        witnesses: ["الشيخ ظافر بن سعد الشهري", "الأستاذ حسن بن علي بن قاسم"],
        historicalDocuments: ["حجة إرث شرعية موثقة 1318هـ", "صك حيازة زراعية قديم"],
        status: "pending",
        createdAt: new Date(Date.now() - 2 * 86400 * 1000).toISOString()
      },
      {
        id: "LIN-902",
        applicantId: "usr-member-302",
        applicantName: "عبد العزيز بن راشد الشهري",
        applicantPhone: "0559988776",
        tribeId: "bani-laam",
        tribeName: "قبيلة بني لام",
        fakhdhName: "آل هندي",
        changeType: "add_branch",
        currentLineage: "عبد العزيز بن راشد بن محمد الشهري",
        proposedLineage: "إضافة فرع ذوي راشد (آل هندي) في شجرة النسب",
        reason: "توثيق تفرع عائلة ذوي راشد من آل هندي في مشجرة القبيلة التفاعلية",
        witnesses: ["معرف القبيلة: الشيخ أحمد بن راشد", "العم سعيد بن هندي"],
        historicalDocuments: ["شهادة معرف القبيلة الرسمية"],
        status: "approved",
        adminNotes: "تم التدقيق والمصادقة بناءً على إفادة معرف القبيلة وثبوت التسلسل التاريخي",
        reviewedBy: "المدير العام (سوبر أدمن)",
        reviewedAt: new Date(Date.now() - 86400 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 5 * 86400 * 1000).toISOString()
      }
    ];

    AppStorage.setItem(STORAGE_KEYS.LINEAGE_REQUESTS, JSON.stringify(seedRequests));
    return seedRequests;
  }

  static saveLineageRequest(request: LineageModificationRequest): void {
    const list = this.getLineageRequests();
    const updated = [request, ...list.filter(r => r.id !== request.id)];
    AppStorage.setItem(STORAGE_KEYS.LINEAGE_REQUESTS, JSON.stringify(updated));
    this.logAction({
      userId: this.getCurrentUser().id,
      userName: this.getCurrentUser().name,
      userRole: this.getCurrentUser().role,
      actionType: "CREATE",
      targetModule: "CONTENT",
      details: `تقديم طلب تعديل وتوثيق نسب جديد [${request.id}] لقبيلة [${request.tribeName}]`
    });
  }

  static updateLineageRequestStatus(id: string, status: LineageModificationRequest["status"], adminNotes?: string): void {
    const list = this.getLineageRequests();
    const updated = list.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status,
          adminNotes: adminNotes || r.adminNotes,
          reviewedBy: this.getCurrentUser().name,
          reviewedAt: new Date().toISOString()
        };
      }
      return r;
    });
    AppStorage.setItem(STORAGE_KEYS.LINEAGE_REQUESTS, JSON.stringify(updated));
    this.logAction({
      userId: this.getCurrentUser().id,
      userName: this.getCurrentUser().name,
      userRole: this.getCurrentUser().role,
      actionType: "UPDATE",
      targetModule: "SECURITY",
      details: `تحديث حالة طلب تعديل النسب [${id}] إلى [${status}] بواسطة ${this.getCurrentUser().name}`
    });
  }

  // --- TRIBE NEWS & EVENTS (إدارة الأخبار والمناسبات والفعاليات) ---
  static getTribeNews(tribeId?: string): TribeNewsEvent[] {
    try {
      const stored = AppStorage.getItem(STORAGE_KEYS.TRIBE_NEWS);
      if (stored) {
        const parsed: TribeNewsEvent[] = JSON.parse(stored);
        const unique = ensureUniqueListIds(parsed, "NEWS");
        if (!tribeId || tribeId === "all") return unique;
        return unique.filter(n => n.tribeId === "all" || n.tribeId === tribeId);
      }
    } catch (e) {
      console.error(e);
    }

    const seedNews: TribeNewsEvent[] = [
      {
        id: "NEWS-101",
        title: "انطلاق ملتقى بني شهر السنوي للتراث وسباق الهايكنج في تنومة",
        summary: "برعاية كريمة وحضور شيوخ وأعيان القبائل، ينطلق الملتقى السنوي متضمناً معارض تراثية وسباق صعود جبل منعاء.",
        content: "يسر اللجنة المنظمة لملتقى بني شهر التراثي الإعلان عن الجدول الزمني للفعاليات التي تشمل العرضة واللعب الشهري، ومسابقات الفروسية، وسوق الأسر المنتجة ومزادات العسل والسمن البلدي.",
        category: "أخبار رسمية",
        tribeId: "all",
        tribeName: "كافة قبائل بني شهر",
        location: "منتزه الشرف - تنومة",
        eventDate: "2026-09-15",
        imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80",
        authorId: "usr-super-admin-01",
        authorName: "إدارة المنصة الموحدة",
        isPinned: true,
        isPublished: true,
        viewsCount: 2450,
        createdAt: new Date(Date.now() - 3 * 86400 * 1000).toISOString()
      },
      {
        id: "NEWS-102",
        title: "حفل تكريم المتفوقين وحملة الدكتوراه من أبناء قبيلة آل وليد",
        summary: "تقيم قبيلة آل وليد احتفالها السنوي السابع لتكريم أبنائها وبناتها الحاصلين على الدرجات العلمية العليا.",
        content: "يتشرف مجلس قبيلة آل وليد بدعوة الجميع لحضور حفل التميز العلمي والاحتفاء بأصحاب الإنجازات الوطنية والبحثية من أبناء القبيلة.",
        category: "مناسبات وأعراس",
        tribeId: "al-waleed",
        tribeName: "قبيلة آل وليد",
        location: "قاعة الاحتفالات الكبرى - النماص",
        eventDate: "2026-09-20",
        imageUrl: "https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80",
        authorId: "usr-sup-aqiqah",
        authorName: "مشرف قبيلة آل وليد",
        isPinned: false,
        isPublished: true,
        viewsCount: 1120,
        createdAt: new Date(Date.now() - 86400 * 1000).toISOString()
      }
    ];

    AppStorage.setItem(STORAGE_KEYS.TRIBE_NEWS, JSON.stringify(seedNews));
    return seedNews;
  }

  static saveTribeNews(news: TribeNewsEvent): void {
    const list = this.getTribeNews();
    const updated = [news, ...list.filter(n => n.id !== news.id)];
    AppStorage.setItem(STORAGE_KEYS.TRIBE_NEWS, JSON.stringify(updated));
    this.logAction({
      userId: this.getCurrentUser().id,
      userName: this.getCurrentUser().name,
      userRole: this.getCurrentUser().role,
      actionType: "CREATE",
      targetModule: "CONTENT",
      details: `نشر خبر/مناسبة جديدة: [${news.title}] لنطاق [${news.tribeName}]`
    });
  }

  static deleteTribeNews(id: string): void {
    const list = this.getTribeNews();
    const updated = list.filter(n => n.id !== id);
    AppStorage.setItem(STORAGE_KEYS.TRIBE_NEWS, JSON.stringify(updated));
    this.logAction({
      userId: this.getCurrentUser().id,
      userName: this.getCurrentUser().name,
      userRole: this.getCurrentUser().role,
      actionType: "DELETE",
      targetModule: "CONTENT",
      details: `حذف الخبر/المناسبة المعرف برقم [${id}]`
    });
  }

  // --- ADS & SPONSORS (إدارة الإعلانات والرعايات) ---
  static getAds(): PlatformAd[] {
    try {
      const stored = AppStorage.getItem(STORAGE_KEYS.ADS);
      if (stored) {
        const parsed: PlatformAd[] = JSON.parse(stored);
        return ensureUniqueListIds(parsed, "AD");
      }
    } catch (e) {
      console.error(e);
    }

    const seedAds: PlatformAd[] = [
      {
        id: "AD-101",
        title: "فندق ومطل السحاب التراثي - النماص",
        advertiserName: "شركة الضيافة السروية المحدودة",
        advertiserPhone: "0501122334",
        placement: "hero_banner",
        imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
        linkUrl: "https://example.com/hotel",
        startDate: "2026-08-01",
        endDate: "2026-09-30",
        budgetSAR: 4500,
        impressionsCount: 18450,
        clicksCount: 920,
        status: "active",
        createdAt: "2026-08-01"
      },
      {
        id: "AD-102",
        title: "مناحل السدر الشهري الطبيعي والبلدي",
        advertiserName: "مؤسسة عسل الجبال العتيقة",
        advertiserPhone: "0554433221",
        placement: "featured_strip",
        imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1200&q=80",
        linkUrl: "https://example.com/honey",
        startDate: "2026-08-10",
        endDate: "2026-09-10",
        budgetSAR: 2500,
        impressionsCount: 9800,
        clicksCount: 460,
        status: "active",
        createdAt: "2026-08-10"
      }
    ];

    AppStorage.setItem(STORAGE_KEYS.ADS, JSON.stringify(seedAds));
    return seedAds;
  }

  static saveAd(ad: PlatformAd): void {
    const list = this.getAds();
    const updated = [ad, ...list.filter(a => a.id !== ad.id)];
    AppStorage.setItem(STORAGE_KEYS.ADS, JSON.stringify(updated));
    this.logAction({
      userId: this.getCurrentUser().id,
      userName: this.getCurrentUser().name,
      userRole: this.getCurrentUser().role,
      actionType: "CREATE",
      targetModule: "PAYMENTS",
      details: `إضافة/تحديث حملة إعلانية: [${ad.title}] بميزانية ${ad.budgetSAR} ر.س`
    });
  }

  static deleteAd(id: string): void {
    const list = this.getAds();
    const updated = list.filter(a => a.id !== id);
    AppStorage.setItem(STORAGE_KEYS.ADS, JSON.stringify(updated));
    this.logAction({
      userId: this.getCurrentUser().id,
      userName: this.getCurrentUser().name,
      userRole: this.getCurrentUser().role,
      actionType: "DELETE",
      targetModule: "PAYMENTS",
      details: `حذف الحملة الإعلانية [${id}]`
    });
  }

  // --- BUSINESSMEN & SPONSORSHIPS (إدارة رجال الأعمال والاشتراكات) ---
  static getBusinessSponsorships(): BusinessLeaderSponsorship[] {
    try {
      const stored = AppStorage.getItem(STORAGE_KEYS.BUSINESSMEN);
      if (stored) {
        const parsed: BusinessLeaderSponsorship[] = JSON.parse(stored);
        return ensureUniqueListIds(parsed, "BIZ");
      }
    } catch (e) {
      console.error(e);
    }

    const seedBusinessmen: BusinessLeaderSponsorship[] = [
      {
        id: "BIZ-01",
        name: "عبد الله بن فهد بن ظافر الشهري",
        honorificTitle: "الشيخ رجل الأعمال",
        companyOrAffiliation: "مجموعة الشهري القابضة للاستثمار والتطوير العقاري",
        phone: "0505112233",
        email: "a.fahad@alshahri-holding.sa",
        tier: "platinum",
        annualContributionSAR: 150000,
        sponsoredInitiatives: ["ترميم حصن العقيقة التراثي", "صندوق تمكين الأسر المنتجة", "منح التميز الأكاديمي"],
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80",
        quote: "خدمة تراث بني شهر ودعم الأجيال واجب وطني ومسؤولية مجتمعية نفخر بها.",
        status: "active",
        joinedDate: "2025-01-10"
      },
      {
        id: "BIZ-02",
        name: "المهندس سعيد بن صالح الشهري",
        honorificTitle: "المهندس الاستشاري",
        companyOrAffiliation: "شركة السراة للطاقة المتجددة والتقنية",
        phone: "0509988112",
        email: "saeed@alsarat-tech.sa",
        tier: "gold",
        annualContributionSAR: 75000,
        sponsoredInitiatives: ["توثيق رقمنة شجرة الأنساب", "تطوير مسارات الهايكنج الجبلي"],
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80",
        quote: "التقنية والرقمنة هي الجسر الذي ينقل تاريخنا العريق إلى العالم أجمع.",
        status: "active",
        joinedDate: "2025-03-15"
      },
      {
        id: "BIZ-03",
        name: "محمد بن علي بن راشد الشهري",
        honorificTitle: "رجل الأعمال",
        companyOrAffiliation: "مؤسسة قمم الجنوب للتجارة العامة",
        phone: "0551122990",
        email: "m.rashid@qimam-south.sa",
        tier: "silver",
        annualContributionSAR: 35000,
        sponsoredInitiatives: ["رعاية مهرجان العسل السنوي"],
        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=500&q=80",
        quote: "أرض بني شهر مهد الكرم والخير، ونفخر بالمساهمة في ازدهارها.",
        status: "active",
        joinedDate: "2025-06-01"
      }
    ];

    AppStorage.setItem(STORAGE_KEYS.BUSINESSMEN, JSON.stringify(seedBusinessmen));
    return seedBusinessmen;
  }

  static saveBusinessSponsorship(item: BusinessLeaderSponsorship): void {
    const list = this.getBusinessSponsorships();
    const updated = [item, ...list.filter(b => b.id !== item.id)];
    AppStorage.setItem(STORAGE_KEYS.BUSINESSMEN, JSON.stringify(updated));
    this.logAction({
      userId: this.getCurrentUser().id,
      userName: this.getCurrentUser().name,
      userRole: this.getCurrentUser().role,
      actionType: "CREATE",
      targetModule: "PAYMENTS",
      details: `تسجيل/تحديث رعاية رجل الأعمال: [${item.name}] - باقة [${item.tier}] بقيمة ${item.annualContributionSAR} ر.س`
    });
  }

  // --- BROADCAST PUSH NOTIFICATIONS (إرسال إشعارات جماعية ومستهدفة) ---
  static getBroadcasts(): BroadcastNotification[] {
    try {
      const stored = AppStorage.getItem(STORAGE_KEYS.BROADCASTS);
      if (stored) {
        const parsed: BroadcastNotification[] = JSON.parse(stored);
        return ensureUniqueListIds(parsed, "BC");
      }
    } catch (e) {
      console.error(e);
    }

    const seedBroadcasts: BroadcastNotification[] = [
      {
        id: "BC-101",
        title: "تنبيه هام: انطلاق فعاليات ملتقى السراة التراثي اليوم",
        message: "أهلاً بأبناء وضيوف بني شهر الكرام، تبدأ الفعاليات والمعارض التراثية في تمام الساعة 4:30 عصراً.",
        type: "announcement",
        targetAudience: "all",
        senderId: "usr-super-admin-01",
        senderName: "المدير العام (سوبر أدمن)",
        sentAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        deliveredCount: 4820,
        status: "sent"
      },
      {
        id: "BC-102",
        title: "دعوة عامة: اجتماع مجلس شيوخ ومعرفي قبيلة آل وليد",
        message: "يُعقد الاجتماع التشاوري السنوي لمناقشة المشروعات التطويرية ومبادرات الأوقاف.",
        type: "urgent_tribal",
        targetAudience: "specific_tribe",
        targetTribeId: "al-waleed",
        targetTribeName: "قبيلة آل وليد",
        senderId: "usr-sup-aqiqah",
        senderName: "مشرف قبيلة آل وليد",
        sentAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        deliveredCount: 890,
        status: "sent"
      }
    ];

    AppStorage.setItem(STORAGE_KEYS.BROADCASTS, JSON.stringify(seedBroadcasts));
    return seedBroadcasts;
  }

  static sendBroadcastNotification(notification: BroadcastNotification): void {
    const list = this.getBroadcasts();
    const updated = [notification, ...list];
    AppStorage.setItem(STORAGE_KEYS.BROADCASTS, JSON.stringify(updated));
    this.logAction({
      userId: this.getCurrentUser().id,
      userName: this.getCurrentUser().name,
      userRole: this.getCurrentUser().role,
      actionType: "CREATE",
      targetModule: "CONTENT",
      details: `إرسال إشعار فوري جماعي: [${notification.title}] إلى المستهدفين [${notification.targetAudience}] - عدد المستلمين: ${notification.deliveredCount}`
    });
  }

  // --- TRIBE & VILLAGE SUPERVISORS (إضافة وحذف المشرفين) ---
  static getSupervisorAccounts(): TribeSupervisorAccount[] {
    try {
      const stored = AppStorage.getItem(STORAGE_KEYS.SUPERVISORS);
      if (stored) {
        const parsed: TribeSupervisorAccount[] = JSON.parse(stored);
        return ensureUniqueListIds(parsed, "SUP");
      }
    } catch (e) {
      console.error(e);
    }

    const seedSupervisors: TribeSupervisorAccount[] = [
      {
        id: "sup-01",
        name: "الشيخ عبد الله بن ظافر الشهري",
        email: "supervisor.aqiqah@banishahr.sa",
        phone: "0505123456",
        tribeId: "al-waleed",
        tribeName: "قبيلة آل وليد",
        role: "tribe_supervisor",
        supervisorCode: "AQIQAH-77",
        is2FAEnabled: true,
        assignedVillages: ["قرية العقيقة", "حصن العقيقة التاريخي", "آل قاسم"],
        permissions: ["manage_tribe_tree", "review_lineage_requests", "publish_tribe_news", "view_tribe_members"],
        status: "active",
        lastLoginAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        createdAt: "2025-01-01"
      },
      {
        id: "sup-02",
        name: "الأستاذ سعيد بن محمد الشهري",
        email: "supervisor.namas@banishahr.sa",
        phone: "0509876543",
        tribeId: "bani-laam",
        tribeName: "قبيلة بني لام",
        role: "tribe_supervisor",
        supervisorCode: "MADANAH-99",
        is2FAEnabled: true,
        assignedVillages: ["قرية المدانة", "حصن المدانة", "آل هندي"],
        permissions: ["manage_tribe_tree", "review_lineage_requests", "publish_tribe_news", "view_tribe_members"],
        status: "active",
        lastLoginAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
        createdAt: "2025-02-15"
      },
      {
        id: "sup-03",
        name: "المهندس فهد بن ناصر الشهري",
        email: "supervisor.manaa@banishahr.sa",
        phone: "0551122334",
        tribeId: "al-nahy",
        tribeName: "قبيلة آل نهي",
        role: "tribe_supervisor",
        supervisorCode: "MANAA-44",
        is2FAEnabled: false,
        assignedVillages: ["قرى جبل منعاء", "المحفار", "الدهناء"],
        permissions: ["manage_tribe_tree", "publish_tribe_news"],
        status: "active",
        lastLoginAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        createdAt: "2025-04-10"
      }
    ];

    AppStorage.setItem(STORAGE_KEYS.SUPERVISORS, JSON.stringify(seedSupervisors));
    return seedSupervisors;
  }

  static saveSupervisorAccount(account: TribeSupervisorAccount): void {
    const list = this.getSupervisorAccounts();
    const updated = [account, ...list.filter(s => s.id !== account.id)];
    AppStorage.setItem(STORAGE_KEYS.SUPERVISORS, JSON.stringify(updated));
    this.logAction({
      userId: this.getCurrentUser().id,
      userName: this.getCurrentUser().name,
      userRole: this.getCurrentUser().role,
      actionType: "CREATE",
      targetModule: "SECURITY",
      details: `إضافة/تحديث حساب مشرف قبيلة: [${account.name}] - قبيلة [${account.tribeName}] - كود [${account.supervisorCode}]`
    });
  }

  static deleteSupervisorAccount(id: string): void {
    const list = this.getSupervisorAccounts();
    const target = list.find(s => s.id === id);
    const updated = list.filter(s => s.id !== id);
    AppStorage.setItem(STORAGE_KEYS.SUPERVISORS, JSON.stringify(updated));
    this.logAction({
      userId: this.getCurrentUser().id,
      userName: this.getCurrentUser().name,
      userRole: this.getCurrentUser().role,
      actionType: "DELETE",
      targetModule: "SECURITY",
      details: `حذف وتجريد صلاحيات المشرف [${target?.name || id}]`
    });
  }

  // --- FCM TOKEN BINDING & PROFILES SYNC ---
  static setWeatherAlertsPreference(userId: string, enabled: boolean): void {
    try {
      const users = this.getUsers();
      const updatedUsers = users.map(u => {
        if (u.id === userId || u.phone === userId) {
          return { ...u, weatherAlertsEnabled: enabled };
        }
        return u;
      });
      AppStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(updatedUsers));

      const currentUser = this.getCurrentUser();
      if (currentUser.id === userId || currentUser.phone === userId) {
        currentUser.weatherAlertsEnabled = enabled;
        AppStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      }
      AppStorage.setItem("bani_shahr_weather_alerts_enabled", JSON.stringify(enabled));
    } catch (e) {
      console.warn("Failed to update weather alert preference:", e);
    }
  }

  static getWeatherAlertsPreference(userId?: string): boolean {
    try {
      const stored = AppStorage.getItem("bani_shahr_weather_alerts_enabled");
      if (stored !== null) return JSON.parse(stored);

      const currentUser = this.getCurrentUser();
      if (currentUser.weatherAlertsEnabled !== undefined) {
        return currentUser.weatherAlertsEnabled;
      }
      return true; // Default enabled so users get safety alerts
    } catch {
      return true;
    }
  }

  static setTribalAlertsPreference(userId: string, enabled: boolean): void {
    try {
      const users = this.getUsers();
      const updatedUsers = users.map(u => {
        if (u.id === userId || u.phone === userId) {
          return { ...u, tribalAlertsEnabled: enabled };
        }
        return u;
      });
      AppStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(updatedUsers));

      const currentUser = this.getCurrentUser();
      if (currentUser.id === userId || currentUser.phone === userId) {
        currentUser.tribalAlertsEnabled = enabled;
        AppStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      }
      AppStorage.setItem("bani_shahr_tribal_alerts_enabled", JSON.stringify(enabled));
    } catch (e) {
      console.warn("Failed to update tribal alert preference:", e);
    }
  }

  static getTribalAlertsPreference(userId?: string): boolean {
    try {
      const stored = AppStorage.getItem("bani_shahr_tribal_alerts_enabled");
      if (stored !== null) return JSON.parse(stored);

      const currentUser = this.getCurrentUser();
      if (currentUser.tribalAlertsEnabled !== undefined) {
        return currentUser.tribalAlertsEnabled;
      }
      return true;
    } catch {
      return true;
    }
  }

  static async updateUserFCMToken(userId: string, token: string): Promise<boolean> {
    try {
      const now = new Date().toISOString();
      const weatherPref = this.getWeatherAlertsPreference(userId);
      const tribalPref = this.getTribalAlertsPreference(userId);

      // 1. Update in local Users list
      const users = this.getUsers();
      const updatedUsers = users.map(u => {
        if (u.id === userId || u.phone === userId) {
          const existingTokens = u.fcmTokens || [];
          const newTokens = Array.from(new Set([token, ...existingTokens])).slice(0, 5);
          return {
            ...u,
            fcmToken: token,
            fcmTokens: newTokens,
            lastFcmSyncAt: now,
            weatherAlertsEnabled: u.weatherAlertsEnabled ?? weatherPref,
            tribalAlertsEnabled: u.tribalAlertsEnabled ?? tribalPref
          };
        }
        return u;
      });
      AppStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(updatedUsers));

      // 2. Update current active user session if matched
      const currentUser = this.getCurrentUser();
      if (currentUser.id === userId || currentUser.phone === userId) {
        currentUser.fcmToken = token;
        currentUser.lastFcmSyncAt = now;
        currentUser.weatherAlertsEnabled = currentUser.weatherAlertsEnabled ?? weatherPref;
        currentUser.tribalAlertsEnabled = currentUser.tribalAlertsEnabled ?? tribalPref;
        AppStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      }

      // 3. Update Supervisor accounts if user is a supervisor
      this.linkSupervisorFCMToken(userId, token);

      return true;
    } catch (e) {
      console.warn("Failed to update user FCM token:", e);
      return false;
    }
  }

  static async linkSupervisorFCMToken(identifier: string, token: string): Promise<boolean> {
    try {
      const now = new Date().toISOString();
      const supervisors = this.getSupervisorAccounts();
      let matched = false;

      const updated = supervisors.map(s => {
        if (s.id === identifier || s.phone === identifier || s.email === identifier || s.supervisorCode === identifier) {
          matched = true;
          const tokens = s.fcmTokens || [];
          const newTokens = Array.from(new Set([token, ...tokens])).slice(0, 5);
          return {
            ...s,
            fcmToken: token,
            fcmTokens: newTokens,
            lastFcmSyncAt: now
          };
        }
        return s;
      });

      AppStorage.setItem(STORAGE_KEYS.SUPERVISORS, JSON.stringify(updated));
      return matched;
    } catch (e) {
      console.warn("Failed to link supervisor FCM token:", e);
      return false;
    }
  }

  static getSupervisorFCMTokens(tribeId?: string): string[] {
    const supervisors = this.getSupervisorAccounts();
    const targetSupervisors = tribeId && tribeId !== "all" 
      ? supervisors.filter(s => s.tribeId === tribeId && s.status === "active")
      : supervisors.filter(s => s.status === "active");

    const tokens: string[] = [];
    targetSupervisors.forEach(s => {
      if (s.fcmToken) tokens.push(s.fcmToken);
      if (s.fcmTokens) tokens.push(...s.fcmTokens);
    });

    return Array.from(new Set(tokens));
  }

  // --- TRIBAL FORUM: QUESTIONS & STORIES (مجتمع وأسئلة وقصص القبيلة) ---
  static getTribalPosts(): TribalPost[] {
    try {
      const stored = AppStorage.getItem(STORAGE_KEYS.TRIBAL_POSTS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Failed to load tribal posts:", e);
    }

    // Default Seed Posts (Authentic Bani Shahr Questions & Stories)
    const initialPosts: TribalPost[] = [
      {
        id: "post-1",
        type: "story",
        title: "قصة بناء قصبات المراقبة وحصون السراة في ديار بني بكر التاريخية",
        content: "كان أجدادنا في السراة يبنون القصبات الحجرية بارتفاعات تتجاوز 4 و 5 طوابق دون استخدام الإسمنت الحديث، بل بالاعتماد على صخور الغرانيت والكوارتز المحلية مع ملاط الجص القديم وجذوع العرعر المعمرة المقاومة للأرضة. كان برج المراقبة يمثل عيناً ساهرة لحماية المزارع والمحاصيل ومجاري السيول المشتركة.",
        author: "العم عبدالله الشهري",
        authorRole: "راوٍ وباحث في التراث السروي",
        tribe: "بني بكر - السراة",
        villageOrCity: "النماص",
        category: "بطولات الأجداد",
        tags: ["حصون", "تراث", "بني بكر", "عمارة حجرية"],
        createdAt: "منذ يومين",
        likes: 28,
        likedBy: [],
        replies: [
          {
            id: "rep-1-1",
            postId: "post-1",
            author: "أ. محمد بن صالح الشهري",
            authorRole: "مشرف تراثي معتمد",
            tribe: "العوامر",
            city: "النماص",
            content: "بارك الله فيك يا عم عبدالله. أود الإضافة أن كل قصبة كانت تحتوي على فتحات رماية دقيقة (المشاويف) مصممة بزوايا رؤية كاشفة لكل الممرات الجبلية.",
            createdAt: "منذ يوم",
            likes: 9,
            isVerifiedMember: true
          },
          {
            id: "rep-1-2",
            postId: "post-1",
            author: "سلمان الشهري",
            tribe: "بني أثلة",
            city: "تنومة",
            content: "توثيق رائع جداً، وما زالت حصون بني بكر شامخة تشهد على براعة الأجداد.",
            createdAt: "منذ 14 ساعة",
            likes: 4
          }
        ]
      },
      {
        id: "post-2",
        type: "question",
        title: "ما هو أفضل مسار هايكنج جبلي يجمع بين جبل ناصر وشلالات الدهناء للمبتدئين؟",
        content: "السلام عليكم ورحمة الله وبركاته، نخطط لزيارة النماص وتنومة في عطلة نهاية الأسبوع مع العائلة، ونرغب في معرفة المسار الجبلي الأكثر أماناً ومناسبة للأطفال وكبار السن، وهل تتوفر خدمات وإرشاد محلي قريب من نقطة الانطلاق؟",
        author: "فهد بن خالد القحطاني",
        authorRole: "زائر ومهتم بالسياحة الجبلية",
        tribe: "ضيف وزائر من الرياض",
        villageOrCity: "الرياض",
        category: "طرق ومسارات",
        tags: ["هايكنج", "جبل ناصر", "شلال الدهناء", "استفسار"],
        createdAt: "منذ 5 ساعات",
        likes: 15,
        likedBy: [],
        replies: [
          {
            id: "rep-2-1",
            postId: "post-2",
            author: "الكابتن ظافر الشهري",
            authorRole: "مرشد سياحي مرخص - مسارات السراة",
            tribe: "بني شهر",
            city: "النماص",
            content: "حياك الله يا هلا ومرحباً بين أهلك وإخوانك. مسار جبل ناصر ممهد تماماً وفيه جلسات مطلة وسياج حماية ممتاز للأطفال. أما شلال الدهناء فموقعه في تنومة سهل الوصول بالسيارة مع مواقف وممشى مرصوف يبعد دقائق فقط عن الشلال.",
            createdAt: "منذ 3 ساعات",
            likes: 12,
            isVerifiedMember: true
          }
        ]
      },
      {
        id: "post-3",
        type: "story",
        title: "موسم قطاف ثمار الرمان والعنب الشهري وتقاليد 'العونة' بين القرى",
        content: "من أجمل العادات التكافلية التي ورثناها عن أجدادنا هي 'العونة'، حيث كان يجتمع شباب القرية ورجالها لمساعدة جارهم في حصاد مصاطبه الزراعية ونقل المحصول وحرث الأرض دون أي مقابل مادي، بل وسط أهازيج الحصاد الشعبية ووليمة الغداء التي تعدها نساء الحي من خبز الميفا والسمن البري.",
        author: "سارة بنت أحمد الشهرية",
        authorRole: "باحثة في الأنثروبولوجيا المجتمعية",
        tribe: "بني لام",
        villageOrCity: "النماص",
        category: "مزارع وضيافة",
        tags: ["عونة", "حصاد", "تقاليد", "ضيافة"],
        createdAt: "منذ 3 أيام",
        likes: 34,
        likedBy: [],
        replies: [
          {
            id: "rep-3-1",
            postId: "post-3",
            author: "علي بن حسن الشهري",
            tribe: "الكلاثمة",
            city: "النماص",
            content: "ما أجمل هذه الذكريات، كانت العونة تجسد أسمى معاني الأخوة والتعاضد وتزيد من بركة المحصول والمودة بين الجيران.",
            createdAt: "منذ يومين",
            likes: 7
          }
        ]
      },
      {
        id: "post-4",
        type: "question",
        title: "استفسار عن معنى كلمة 'أرحبوا تراحيب المطر' ومصطلحات الترحيب في اللهجة السروية",
        content: "سمعت عبارات ترحيبية كثيرة عند زيارتي لسوق الثلاثاء الشعبي بالنماص مثل 'حيّاك الله يا راعي الوفا' و'مرحباً هيل عد السيل'. أود معرفة أصل هذه العبارات وكيفية الرد المناسب عليها حسب السلوم القبلية المتبعة.",
        author: "سلطان المري",
        authorRole: "باحث لغوي ومهتم باللهجات",
        tribe: "زائر من المنطقة الشرقية",
        villageOrCity: "الدمام",
        category: "لهجة وأمثال",
        tags: ["ترحيب", "لهجة", "سلوم", "ثقافة"],
        createdAt: "منذ يوم",
        likes: 19,
        likedBy: [],
        replies: [
          {
            id: "rep-4-1",
            postId: "post-4",
            author: "الشيخ فايز بن سعد الشهري",
            authorRole: "مشرف مجلس التراث والأنساب",
            tribe: "بني منبه",
            city: "النماص",
            content: "أهلاً بك يا أستاذ سلطان. الرد المعتاد والمحبب هو: 'البقا يا بو فلان، الله يحيي قدرك ويرفع شانك' أو 'دام فضلك وخيرك'، والمطر والسيل رمز للخير العميم والنماء في جبال السراة لذلك قرنت به التراحيب.",
            createdAt: "منذ 18 ساعة",
            likes: 14,
            isVerifiedMember: true
          }
        ]
      }
    ];

    try {
      AppStorage.setItem(STORAGE_KEYS.TRIBAL_POSTS, JSON.stringify(initialPosts));
    } catch (e) {
      console.warn("Failed to cache initial tribal posts:", e);
    }
    return initialPosts;
  }

  static addTribalPost(post: Omit<TribalPost, "id" | "createdAt" | "likes" | "replies">): TribalPost {
    const list = this.getTribalPosts();
    const newPost: TribalPost = {
      ...post,
      id: generateUniqueId("post"),
      createdAt: "الآن",
      likes: 0,
      likedBy: [],
      replies: []
    };

    const updated = [newPost, ...list];
    AppStorage.setItem(STORAGE_KEYS.TRIBAL_POSTS, JSON.stringify(updated));

    this.logAction({
      userId: this.getCurrentUser().id,
      userName: post.author,
      userRole: this.getCurrentUser().role,
      actionType: "CREATE",
      targetModule: "TRIBAL_FORUM",
      details: `نشر ${post.type === "question" ? "سؤال" : "قصة"}: [${post.title}] في منتدى القبيلة`
    });

    return newPost;
  }

  static addTribalPostReply(postId: string, reply: Omit<TribalPostReply, "id" | "postId" | "createdAt" | "likes">): TribalPostReply | null {
    const list = this.getTribalPosts();
    const targetIdx = list.findIndex(p => p.id === postId);
    if (targetIdx === -1) return null;

    const newReply: TribalPostReply = {
      ...reply,
      id: generateUniqueId("reply"),
      postId: postId,
      createdAt: "الآن",
      likes: 0
    };

    list[targetIdx].replies = [...(list[targetIdx].replies || []), newReply];
    AppStorage.setItem(STORAGE_KEYS.TRIBAL_POSTS, JSON.stringify(list));

    this.logAction({
      userId: this.getCurrentUser().id,
      userName: reply.author,
      userRole: this.getCurrentUser().role,
      actionType: "CREATE",
      targetModule: "TRIBAL_FORUM",
      details: `إضافة رد على منشور [${list[targetIdx].title}]`
    });

    return newReply;
  }

  static toggleLikeTribalPost(postId: string, userId?: string): { likes: number; isLiked: boolean } {
    const list = this.getTribalPosts();
    const target = list.find(p => p.id === postId);
    if (!target) return { likes: 0, isLiked: false };

    const uid = userId || this.getCurrentUser().id || "guest";
    target.likedBy = target.likedBy || [];
    const alreadyLiked = target.likedBy.includes(uid);

    if (alreadyLiked) {
      target.likedBy = target.likedBy.filter(id => id !== uid);
      target.likes = Math.max(0, target.likes - 1);
    } else {
      target.likedBy.push(uid);
      target.likes += 1;
    }

    AppStorage.setItem(STORAGE_KEYS.TRIBAL_POSTS, JSON.stringify(list));
    return { likes: target.likes, isLiked: !alreadyLiked };
  }

  static toggleLikeTribalReply(postId: string, replyId: string): number {
    const list = this.getTribalPosts();
    const targetPost = list.find(p => p.id === postId);
    if (!targetPost || !targetPost.replies) return 0;

    const targetReply = targetPost.replies.find(r => r.id === replyId);
    if (!targetReply) return 0;

    targetReply.likes = (targetReply.likes || 0) + 1;
    AppStorage.setItem(STORAGE_KEYS.TRIBAL_POSTS, JSON.stringify(list));
    return targetReply.likes;
  }

  static deleteTribalPost(postId: string): void {
    const list = this.getTribalPosts();
    const target = list.find(p => p.id === postId);
    const updated = list.filter(p => p.id !== postId);
    AppStorage.setItem(STORAGE_KEYS.TRIBAL_POSTS, JSON.stringify(updated));

    this.logAction({
      userId: this.getCurrentUser().id,
      userName: this.getCurrentUser().name,
      userRole: this.getCurrentUser().role,
      actionType: "DELETE",
      targetModule: "TRIBAL_FORUM",
      details: `حذف المنشور [${target?.title || postId}] من منتدى القبيلة`
    });
  }
}

// Firebase Firestore Blueprint & Security Rules Documentation
export const FIREBASE_FIRESTORE_BLUEPRINT_SCHEMA = `{
  "entities": {
    "TribalUnit": {
      "title": "TribalUnit",
      "description": "Tribal organizational units including confederations, sections, tribes, and clans of Bani Shahr",
      "type": "object",
      "properties": {
        "id": { "type": "string", "description": "Unique identifier" },
        "name": { "type": "string", "description": "Name of the tribal unit" },
        "parent_id": { "type": "string", "description": "Identifier of parent tribal branch" },
        "unit_type": { "type": "string", "enum": ["confederation", "section", "tribe", "clan", "sub_clan", "family"], "description": "Level in tribal hierarchy" },
        "path": { "type": "string", "description": "Hierarchical path representation" },
        "description": { "type": "string", "description": "Historical notes and overview" },
        "location_summary": { "type": "string", "description": "Geographical location summary" },
        "is_active": { "type": "boolean", "description": "Status flag" },
        "display_order": { "type": "number", "description": "Sorting index" },
        "created_at": { "type": "string", "description": "Timestamp created" }
      },
      "required": ["name", "unit_type"]
    },
    "Village": {
      "title": "Village",
      "description": "Villages, historic forts, valleys and locations across Bani Shahr",
      "type": "object",
      "properties": {
        "id": { "type": "string", "description": "Unique identifier" },
        "unit_id": { "type": "string", "description": "Associated tribal unit ID" },
        "name": { "type": "string", "description": "Village or site name" },
        "type": { "type": "string", "enum": ["village", "fort", "historical_site", "valley", "mountain", "market"], "description": "Place type" },
        "latitude": { "type": "number", "description": "Latitude coordinate" },
        "longitude": { "type": "number", "description": "Longitude coordinate" },
        "altitude_meters": { "type": "number", "description": "Elevation in meters" },
        "historical_overview": { "type": "string", "description": "Historical background and description" },
        "is_active": { "type": "boolean", "description": "Whether active" }
      },
      "required": ["name", "unit_id"]
    },
    "GenealogyNode": {
      "title": "GenealogyNode",
      "description": "Person node in the genealogy lineage tree",
      "type": "object",
      "properties": {
        "id": { "type": "string", "description": "Unique identifier" },
        "full_name": { "type": "string", "description": "Full ancestral name" },
        "parent_id": { "type": "string", "description": "Father's node ID" },
        "unit_id": { "type": "string", "description": "Tribal unit ID" },
        "village_id": { "type": "string", "description": "Associated village ID" },
        "gender": { "type": "string", "enum": ["male", "female"], "description": "Gender" },
        "generation_level": { "type": "number", "description": "Generation depth in tree" },
        "birth_hijri_year": { "type": "number", "description": "Approximate Hijri birth year" },
        "death_hijri_year": { "type": "number", "description": "Hijri death year" },
        "is_historical_figure": { "type": "boolean", "description": "Whether notable historical figure" },
        "biography": { "type": "string", "description": "Biography and historical achievements" },
        "verification_status": { "type": "string", "enum": ["pending_review", "verified", "disputed"], "description": "Verification status" },
        "created_by": { "type": "string", "description": "UID of submitter" }
      },
      "required": ["full_name", "unit_id"]
    },
    "HistoricalDocument": {
      "title": "HistoricalDocument",
      "description": "Historical manuscripts, photographic archives, and treaties",
      "type": "object",
      "properties": {
        "id": { "type": "string", "description": "Unique identifier" },
        "title": { "type": "string", "description": "Document title" },
        "document_type": { "type": "string", "enum": ["photo", "manuscript", "deed", "video", "audio", "document"], "description": "Media type" },
        "storage_path": { "type": "string", "description": "URL or storage path" },
        "description": { "type": "string", "description": "Historical context and description" },
        "document_date_hijri": { "type": "string", "description": "Estimated Hijri date" },
        "unit_id": { "type": "string", "description": "Associated tribal unit" },
        "is_public": { "type": "boolean", "description": "Public visibility" },
        "uploaded_by": { "type": "string", "description": "UID of uploader" }
      },
      "required": ["title", "document_type"]
    },
    "HistoricalReference": {
      "title": "HistoricalReference",
      "description": "Published sources, references, books and oral narrations",
      "type": "object",
      "properties": {
        "id": { "type": "string", "description": "Unique identifier" },
        "title": { "type": "string", "description": "Reference title" },
        "author": { "type": "string", "description": "Author or researcher name" },
        "source_type": { "type": "string", "enum": ["book", "manuscript", "oral_history", "government_document", "inscription", "treaty"], "description": "Source category" },
        "hijri_date": { "type": "string", "description": "Publication or recording date" },
        "summary": { "type": "string", "description": "Summary of historical contents" }
      },
      "required": ["title", "source_type"]
    },
    "MemoryContribution": {
      "title": "MemoryContribution",
      "description": "Community submitted memories, heritage photos, and oral history narratives",
      "type": "object",
      "properties": {
        "id": { "type": "string", "description": "Unique identifier" },
        "userId": { "type": "string", "description": "UID of submitter" },
        "userName": { "type": "string", "description": "Name of contributor" },
        "userTribe": { "type": "string", "description": "Tribal lineage of contributor" },
        "title": { "type": "string", "description": "Contribution title" },
        "content": { "type": "string", "description": "Narrative or memory content" },
        "category": { "type": "string", "description": "Category (historical, story, poem, photo, craft)" },
        "imageUrl": { "type": "string", "description": "Image URL if attached" },
        "location": { "type": "string", "description": "Place or village referenced" },
        "year": { "type": "string", "description": "Estimated period" },
        "likesCount": { "type": "number", "description": "Number of likes" },
        "status": { "type": "string", "enum": ["published", "pending_review"], "description": "Moderation status" },
        "createdAt": { "type": "string", "description": "Creation timestamp" }
      },
      "required": ["title", "content", "userId"]
    },
    "UserProfile": {
      "title": "UserProfile",
      "description": "User profile with personal tribal affiliation and permissions",
      "type": "object",
      "properties": {
        "id": { "type": "string", "description": "User UID matching auth.uid" },
        "displayName": { "type": "string", "description": "Full name" },
        "email": { "type": "string", "description": "Email address" },
        "tribeAffiliation": { "type": "string", "description": "Tribal branch" },
        "village": { "type": "string", "description": "Home village" },
        "role": { "type": "string", "enum": ["user", "guide", "supervisor", "admin"], "description": "User access role" },
        "createdAt": { "type": "string", "description": "Registration date" }
      },
      "required": ["id", "displayName"]
    },
    "SupervisorNomination": {
      "title": "SupervisorNomination",
      "description": "Nomination requests for tribal supervisors",
      "type": "object",
      "properties": {
        "id": { "type": "string", "description": "Unique nomination identifier" },
        "fullName": { "type": "string", "description": "Full quadruplicate applicant name" },
        "phone": { "type": "string", "description": "Contact phone number" },
        "tribeId": { "type": "string", "description": "Target tribe ID" },
        "tribeName": { "type": "string", "description": "Target tribe name" },
        "fakhdh": { "type": "string", "description": "Fakhdh or branch" },
        "village": { "type": "string", "description": "Home village / residence" },
        "qualifications": { "type": "string", "description": "Reason and qualifications for supervision" },
        "status": { "type": "string", "enum": ["pending", "approved", "rejected"], "description": "Approval status" },
        "createdAt": { "type": "string", "description": "Date submitted" }
      },
      "required": ["fullName", "phone", "tribeId", "tribeName"]
    },
    "PushNotification": {
      "title": "PushNotification",
      "description": "Push and real-time notifications for supervisors and users",
      "type": "object",
      "properties": {
        "id": { "type": "string", "description": "Unique notification identifier" },
        "title": { "type": "string", "description": "Notification title" },
        "body": { "type": "string", "description": "Notification content body" },
        "type": { "type": "string", "enum": ["supervisor_nomination_new", "nomination_approved", "nomination_rejected", "lineage_request", "broadcast_alert", "system"], "description": "Notification category" },
        "targetRole": { "type": "string", "description": "Target audience role (supervisor, admin, user, all)" },
        "targetUserId": { "type": "string", "description": "Target user ID or phone" },
        "targetTribeId": { "type": "string", "description": "Target tribe ID" },
        "nominationId": { "type": "string", "description": "Related nomination ID" },
        "nominationApplicantName": { "type": "string", "description": "Applicant full name" },
        "nominationTribeName": { "type": "string", "description": "Tribe name" },
        "status": { "type": "string", "enum": ["unread", "read"], "description": "Read status" },
        "createdAt": { "type": "string", "description": "Creation timestamp" }
      },
      "required": ["title", "body", "type"]
    }
  },
  "firestore": {
    "/tribes/{tribeId}": {
      "schema": "TribalUnit",
      "description": "Tribal sections and organizational branches of Bani Shahr"
    },
    "/villages/{villageId}": {
      "schema": "Village",
      "description": "Villages, locations and landmarks in Bani Shahr"
    },
    "/genealogy/{nodeId}": {
      "schema": "GenealogyNode",
      "description": "Genealogical nodes, historical lineage, and family tree records"
    },
    "/documents/{docId}": {
      "schema": "HistoricalDocument",
      "description": "Historical manuscripts, treaties, deeds, and media documents"
    },
    "/sources/{sourceId}": {
      "schema": "HistoricalReference",
      "description": "Bibliographic references and historical books"
    },
    "/memory_contributions/{contributionId}": {
      "schema": "MemoryContribution",
      "description": "Community heritage contributions, historical oral stories, and photos"
    },
    "/supervisor_nominations/{nominationId}": {
      "schema": "SupervisorNomination",
      "description": "Tribal supervisor registration and nomination submissions"
    },
    "/push_notifications/{notificationId}": {
      "schema": "PushNotification",
      "description": "Real-time push notifications for supervisors and applicant users"
    },
    "/users/{userId}": {
      "schema": "UserProfile",
      "description": "User profiles and settings"
    }
  }
}
`;

export const FIREBASE_SECURITY_RULES_SCHEMA = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Global Deny Default
    match /{document=**} {
      allow read, write: if false;
    }

    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    function isAdmin() {
      return isSignedIn() && (
        request.auth.token.email == 'aaattr2005@gmail.com' ||
        exists(/databases/$(database)/documents/admins/$(request.auth.uid))
      );
    }

    function isValidId(id) {
      return id is string && id.size() > 0 && id.size() <= 128;
    }

    // Tribal Units & Sections (Public Read, Admin/Supervisor write)
    match /tribes/{tribeId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Villages and Geographic Sites (Public Read, Admin write)
    match /villages/{villageId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Genealogy Nodes (Public Read, Admin/Verified write)
    match /genealogy/{nodeId} {
      allow read: if true;
      allow create, update: if isSignedIn() && (
        isAdmin() || (request.resource.data.created_by == request.auth.uid)
      );
      allow delete: if isAdmin();
    }

    // Historical Documents & Manuscripts (Public Read, Admin/Owner write)
    match /documents/{docId} {
      allow read: if true;
      allow create, update: if isSignedIn() && (
        isAdmin() || (request.resource.data.uploaded_by == request.auth.uid)
      );
      allow delete: if isAdmin();
    }

    // Historical Sources & References (Public Read, Admin write)
    match /sources/{sourceId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Community Memory Contributions (Public Read, Authenticated Submit & Owner edit)
    match /memory_contributions/{contributionId} {
      allow read: if true;
      allow create: if isSignedIn() && request.resource.data.userId == request.auth.uid;
      allow update: if isSignedIn() && (
        isAdmin() ||
        (resource.data.userId == request.auth.uid && request.resource.data.userId == request.auth.uid) ||
        request.resource.data.diff(resource.data).affectedKeys().hasOnly(['likesCount'])
      );
      allow delete: if isSignedIn() && (isAdmin() || resource.data.userId == request.auth.uid);
    }

    // Tribal Supervisor Nominations (Allow create for applicants, Read & Update for status tracking)
    match /supervisor_nominations/{nominationId} {
      allow create, read: if true;
      allow update, delete: if true;
    }

    // Push & Real-time Notifications (Supervisors and Users)
    match /push_notifications/{notificationId} {
      allow create, read: if true;
      allow update, delete: if true;
    }

    // User Profiles (Private or Self-Managed)
    match /users/{userId} {
      allow read: if true;
      allow create, update: if isOwner(userId) || isAdmin();
      allow delete: if isOwner(userId) || isAdmin();
    }

    // Test connection check
    match /test/{docId} {
      allow read, write: if true;
    }
  }
}
`;

export const FULL_FIREBASE_SCHEMA = `=== قواعد أمان Firebase Firestore (firestore.rules) ===
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Global Deny Default
    match /{document=**} {
      allow read, write: if false;
    }

    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    function isAdmin() {
      return isSignedIn() && (
        request.auth.token.email == 'aaattr2005@gmail.com' ||
        exists(/databases/$(database)/documents/admins/$(request.auth.uid))
      );
    }

    function isValidId(id) {
      return id is string && id.size() > 0 && id.size() <= 128;
    }

    // Tribal Units & Sections (Public Read, Admin/Supervisor write)
    match /tribes/{tribeId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Villages and Geographic Sites (Public Read, Admin write)
    match /villages/{villageId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Genealogy Nodes (Public Read, Admin/Verified write)
    match /genealogy/{nodeId} {
      allow read: if true;
      allow create, update: if isSignedIn() && (
        isAdmin() || (request.resource.data.created_by == request.auth.uid)
      );
      allow delete: if isAdmin();
    }

    // Historical Documents & Manuscripts (Public Read, Admin/Owner write)
    match /documents/{docId} {
      allow read: if true;
      allow create, update: if isSignedIn() && (
        isAdmin() || (request.resource.data.uploaded_by == request.auth.uid)
      );
      allow delete: if isAdmin();
    }

    // Historical Sources & References (Public Read, Admin write)
    match /sources/{sourceId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Community Memory Contributions (Public Read, Authenticated Submit & Owner edit)
    match /memory_contributions/{contributionId} {
      allow read: if true;
      allow create: if isSignedIn() && request.resource.data.userId == request.auth.uid;
      allow update: if isSignedIn() && (
        isAdmin() ||
        (resource.data.userId == request.auth.uid && request.resource.data.userId == request.auth.uid) ||
        request.resource.data.diff(resource.data).affectedKeys().hasOnly(['likesCount'])
      );
      allow delete: if isSignedIn() && (isAdmin() || resource.data.userId == request.auth.uid);
    }

    // Tribal Supervisor Nominations (Allow create for applicants, Read & Update for status tracking)
    match /supervisor_nominations/{nominationId} {
      allow create, read: if true;
      allow update, delete: if true;
    }

    // Push & Real-time Notifications (Supervisors and Users)
    match /push_notifications/{notificationId} {
      allow create, read: if true;
      allow update, delete: if true;
    }

    // User Profiles (Private or Self-Managed)
    match /users/{userId} {
      allow read: if true;
      allow create, update: if isOwner(userId) || isAdmin();
      allow delete: if isOwner(userId) || isAdmin();
    }

    // Test connection check
    match /test/{docId} {
      allow read, write: if true;
    }
  }
}


=== مخطط مجموعات البيانات Firebase Firestore Blueprint ===
{
  "entities": {
    "TribalUnit": {
      "title": "TribalUnit",
      "description": "Tribal organizational units including confederations, sections, tribes, and clans of Bani Shahr",
      "type": "object",
      "properties": {
        "id": { "type": "string", "description": "Unique identifier" },
        "name": { "type": "string", "description": "Name of the tribal unit" },
        "parent_id": { "type": "string", "description": "Identifier of parent tribal branch" },
        "unit_type": { "type": "string", "enum": ["confederation", "section", "tribe", "clan", "sub_clan", "family"], "description": "Level in tribal hierarchy" },
        "path": { "type": "string", "description": "Hierarchical path representation" },
        "description": { "type": "string", "description": "Historical notes and overview" },
        "location_summary": { "type": "string", "description": "Geographical location summary" },
        "is_active": { "type": "boolean", "description": "Status flag" },
        "display_order": { "type": "number", "description": "Sorting index" },
        "created_at": { "type": "string", "description": "Timestamp created" }
      },
      "required": ["name", "unit_type"]
    },
    "Village": {
      "title": "Village",
      "description": "Villages, historic forts, valleys and locations across Bani Shahr",
      "type": "object",
      "properties": {
        "id": { "type": "string", "description": "Unique identifier" },
        "unit_id": { "type": "string", "description": "Associated tribal unit ID" },
        "name": { "type": "string", "description": "Village or site name" },
        "type": { "type": "string", "enum": ["village", "fort", "historical_site", "valley", "mountain", "market"], "description": "Place type" },
        "latitude": { "type": "number", "description": "Latitude coordinate" },
        "longitude": { "type": "number", "description": "Longitude coordinate" },
        "altitude_meters": { "type": "number", "description": "Elevation in meters" },
        "historical_overview": { "type": "string", "description": "Historical background and description" },
        "is_active": { "type": "boolean", "description": "Whether active" }
      },
      "required": ["name", "unit_id"]
    },
    "GenealogyNode": {
      "title": "GenealogyNode",
      "description": "Person node in the genealogy lineage tree",
      "type": "object",
      "properties": {
        "id": { "type": "string", "description": "Unique identifier" },
        "full_name": { "type": "string", "description": "Full ancestral name" },
        "parent_id": { "type": "string", "description": "Father's node ID" },
        "unit_id": { "type": "string", "description": "Tribal unit ID" },
        "village_id": { "type": "string", "description": "Associated village ID" },
        "gender": { "type": "string", "enum": ["male", "female"], "description": "Gender" },
        "generation_level": { "type": "number", "description": "Generation depth in tree" },
        "birth_hijri_year": { "type": "number", "description": "Approximate Hijri birth year" },
        "death_hijri_year": { "type": "number", "description": "Hijri death year" },
        "is_historical_figure": { "type": "boolean", "description": "Whether notable historical figure" },
        "biography": { "type": "string", "description": "Biography and historical achievements" },
        "verification_status": { "type": "string", "enum": ["pending_review", "verified", "disputed"], "description": "Verification status" },
        "created_by": { "type": "string", "description": "UID of submitter" }
      },
      "required": ["full_name", "unit_id"]
    },
    "HistoricalDocument": {
      "title": "HistoricalDocument",
      "description": "Historical manuscripts, photographic archives, and treaties",
      "type": "object",
      "properties": {
        "id": { "type": "string", "description": "Unique identifier" },
        "title": { "type": "string", "description": "Document title" },
        "document_type": { "type": "string", "enum": ["photo", "manuscript", "deed", "video", "audio", "document"], "description": "Media type" },
        "storage_path": { "type": "string", "description": "URL or storage path" },
        "description": { "type": "string", "description": "Historical context and description" },
        "document_date_hijri": { "type": "string", "description": "Estimated Hijri date" },
        "unit_id": { "type": "string", "description": "Associated tribal unit" },
        "is_public": { "type": "boolean", "description": "Public visibility" },
        "uploaded_by": { "type": "string", "description": "UID of uploader" }
      },
      "required": ["title", "document_type"]
    },
    "HistoricalReference": {
      "title": "HistoricalReference",
      "description": "Published sources, references, books and oral narrations",
      "type": "object",
      "properties": {
        "id": { "type": "string", "description": "Unique identifier" },
        "title": { "type": "string", "description": "Reference title" },
        "author": { "type": "string", "description": "Author or researcher name" },
        "source_type": { "type": "string", "enum": ["book", "manuscript", "oral_history", "government_document", "inscription", "treaty"], "description": "Source category" },
        "hijri_date": { "type": "string", "description": "Publication or recording date" },
        "summary": { "type": "string", "description": "Summary of historical contents" }
      },
      "required": ["title", "source_type"]
    },
    "MemoryContribution": {
      "title": "MemoryContribution",
      "description": "Community submitted memories, heritage photos, and oral history narratives",
      "type": "object",
      "properties": {
        "id": { "type": "string", "description": "Unique identifier" },
        "userId": { "type": "string", "description": "UID of submitter" },
        "userName": { "type": "string", "description": "Name of contributor" },
        "userTribe": { "type": "string", "description": "Tribal lineage of contributor" },
        "title": { "type": "string", "description": "Contribution title" },
        "content": { "type": "string", "description": "Narrative or memory content" },
        "category": { "type": "string", "description": "Category (historical, story, poem, photo, craft)" },
        "imageUrl": { "type": "string", "description": "Image URL if attached" },
        "location": { "type": "string", "description": "Place or village referenced" },
        "year": { "type": "string", "description": "Estimated period" },
        "likesCount": { "type": "number", "description": "Number of likes" },
        "status": { "type": "string", "enum": ["published", "pending_review"], "description": "Moderation status" },
        "createdAt": { "type": "string", "description": "Creation timestamp" }
      },
      "required": ["title", "content", "userId"]
    },
    "UserProfile": {
      "title": "UserProfile",
      "description": "User profile with personal tribal affiliation and permissions",
      "type": "object",
      "properties": {
        "id": { "type": "string", "description": "User UID matching auth.uid" },
        "displayName": { "type": "string", "description": "Full name" },
        "email": { "type": "string", "description": "Email address" },
        "tribeAffiliation": { "type": "string", "description": "Tribal branch" },
        "village": { "type": "string", "description": "Home village" },
        "role": { "type": "string", "enum": ["user", "guide", "supervisor", "admin"], "description": "User access role" },
        "createdAt": { "type": "string", "description": "Registration date" }
      },
      "required": ["id", "displayName"]
    },
    "SupervisorNomination": {
      "title": "SupervisorNomination",
      "description": "Nomination requests for tribal supervisors",
      "type": "object",
      "properties": {
        "id": { "type": "string", "description": "Unique nomination identifier" },
        "fullName": { "type": "string", "description": "Full quadruplicate applicant name" },
        "phone": { "type": "string", "description": "Contact phone number" },
        "tribeId": { "type": "string", "description": "Target tribe ID" },
        "tribeName": { "type": "string", "description": "Target tribe name" },
        "fakhdh": { "type": "string", "description": "Fakhdh or branch" },
        "village": { "type": "string", "description": "Home village / residence" },
        "qualifications": { "type": "string", "description": "Reason and qualifications for supervision" },
        "status": { "type": "string", "enum": ["pending", "approved", "rejected"], "description": "Approval status" },
        "createdAt": { "type": "string", "description": "Date submitted" }
      },
      "required": ["fullName", "phone", "tribeId", "tribeName"]
    },
    "PushNotification": {
      "title": "PushNotification",
      "description": "Push and real-time notifications for supervisors and users",
      "type": "object",
      "properties": {
        "id": { "type": "string", "description": "Unique notification identifier" },
        "title": { "type": "string", "description": "Notification title" },
        "body": { "type": "string", "description": "Notification content body" },
        "type": { "type": "string", "enum": ["supervisor_nomination_new", "nomination_approved", "nomination_rejected", "lineage_request", "broadcast_alert", "system"], "description": "Notification category" },
        "targetRole": { "type": "string", "description": "Target audience role (supervisor, admin, user, all)" },
        "targetUserId": { "type": "string", "description": "Target user ID or phone" },
        "targetTribeId": { "type": "string", "description": "Target tribe ID" },
        "nominationId": { "type": "string", "description": "Related nomination ID" },
        "nominationApplicantName": { "type": "string", "description": "Applicant full name" },
        "nominationTribeName": { "type": "string", "description": "Tribe name" },
        "status": { "type": "string", "enum": ["unread", "read"], "description": "Read status" },
        "createdAt": { "type": "string", "description": "Creation timestamp" }
      },
      "required": ["title", "body", "type"]
    }
  },
  "firestore": {
    "/tribes/{tribeId}": {
      "schema": "TribalUnit",
      "description": "Tribal sections and organizational branches of Bani Shahr"
    },
    "/villages/{villageId}": {
      "schema": "Village",
      "description": "Villages, locations and landmarks in Bani Shahr"
    },
    "/genealogy/{nodeId}": {
      "schema": "GenealogyNode",
      "description": "Genealogical nodes, historical lineage, and family tree records"
    },
    "/documents/{docId}": {
      "schema": "HistoricalDocument",
      "description": "Historical manuscripts, treaties, deeds, and media documents"
    },
    "/sources/{sourceId}": {
      "schema": "HistoricalReference",
      "description": "Bibliographic references and historical books"
    },
    "/memory_contributions/{contributionId}": {
      "schema": "MemoryContribution",
      "description": "Community heritage contributions, historical oral stories, and photos"
    },
    "/supervisor_nominations/{nominationId}": {
      "schema": "SupervisorNomination",
      "description": "Tribal supervisor registration and nomination submissions"
    },
    "/push_notifications/{notificationId}": {
      "schema": "PushNotification",
      "description": "Real-time push notifications for supervisors and applicant users"
    },
    "/users/{userId}": {
      "schema": "UserProfile",
      "description": "User profiles and settings"
    }
  }
}
`;
