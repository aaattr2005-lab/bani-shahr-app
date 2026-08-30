export type CategoryType = 
  | "all"
  | "nature"
  | "heritage"
  | "viewpoints"
  | "hiking"
  | "museums"
  | "markets";

export type AttractionFilterChip = 
  | "الكل" 
  | "طبيعة" 
  | "تراث" 
  | "مطاعم" 
  | "فعاليات" 
  | "ديار قديمة";

export interface TribalPostReply {
  id: string;
  postId: string;
  author: string;
  authorRole?: string;
  tribe?: string;
  city?: string;
  content: string;
  createdAt: string;
  likes: number;
  isVerifiedMember?: boolean;
}

export interface TribalPost {
  id: string;
  type: "question" | "story";
  title: string;
  content: string;
  author: string;
  authorRole?: string;
  tribe: string;
  tribeId?: string;
  villageOrCity: string;
  category: "طرق ومسارات" | "أنساب وتاريخ" | "مزارع وضيافة" | "بطولات الأجداد" | "لهجة وأمثال" | "عام ومفتوح";
  tags?: string[];
  createdAt: string;
  likes: number;
  likedBy?: string[];
  replies: TribalPostReply[];
}

export interface Attraction {
  id: string;
  name: string;
  nameEn?: string;
  category: "nature" | "heritage" | "viewpoints" | "hiking" | "museums" | "markets";
  city: "تنومة" | "النماص" | "المجاردة" | "السراة وتهامة";
  elevation: string;
  description: string;
  fullDetails: string;
  highlights: string[];
  imageUrl: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  bestTime: string;
  entryFee: string;
  rating: number;
  reviewsCount: number;
  tags: string[];
  isFeatured?: boolean;
  facilities: string[];
}

export interface Village {
  id: string;
  name: string;
  tribalBranch: string;
  region: "تنومة" | "النماص" | "المجاردة" | "السراة" | "تهامة بني شهر";
  description: string;
  historyAndCastles: string;
  famousFor: string[];
  elevation: string;
  imageUrl: string;
  coordinates: { lat: number; lng: number };
  supervisorId?: string;
  supervisorName?: string;
  supervisorPhone?: string;
  supervisorCode?: string;
  subscriptionTier?: "free" | "basic_monthly" | "pro_annual";
  subscriptionStatus?: "active" | "pending_renewal" | "expired";
  subscriptionExpiresAt?: string;
  castlesCount?: number;
  lastModifiedBy?: string;
  lastModifiedAt?: string;
  newsAndEvents?: { id: string; title: string; date: string; content: string; author: string }[];
  lineageAndHistory?: string;
  localServices?: { id: string; name: string; type: string; contact: string }[];
}

export interface HikingTrail {
  id: string;
  title: string;
  location: string;
  city: "تنومة" | "النماص" | "المجاردة";
  distanceKm: number;
  durationHours: string;
  difficulty: "سهل للمبتدئين" | "متوسط" | "متقدم وشاق";
  elevationGain: string;
  highestPoint: string;
  description: string;
  requiredGear: string[];
  highlights: string[];
  imageUrl: string;
  safetyTips: string[];
  coordinates: { lat: number; lng: number };
}

export interface Museum {
  id: string;
  name: string;
  owner: string;
  city: "تنومة" | "النماص" | "المجاردة";
  location: string;
  description: string;
  artifactsCount: string;
  ticketPrice: string;
  phone: string;
  workingHours: string;
  imageUrl: string;
  highlights: string[];
}

export interface TourGuide {
  id: string;
  name: string;
  title: string;
  bio: string;
  licenseNumber: string;
  city: "تنومة" | "النماص" | "المجاردة" | "كافة مناطق بني شهر";
  languages: string[];
  specialties: string[];
  rating: number;
  reviewsCount: number;
  hourlyRate: number;
  dayRate: number;
  phone: string;
  avatarUrl: string;
  coverUrl?: string;
  availableDates: string[];
  badges: string[];
  yearsExperience: number;
  totalTripsCompleted: number;
}

export interface GuideBooking {
  id: string;
  guideId: string;
  guideName: string;
  userId: string;
  userName: string;
  userPhone: string;
  date: string;
  timeSlot: string;
  numberOfGuests: number;
  destination: string;
  notes?: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentStatus: "paid" | "unpaid";
  paymentMethod: "mada" | "apple_pay" | "visa" | "stc_pay" | "cash";
  createdAt: string;
}

export interface FoodSeller {
  id: string;
  storeName: string;
  ownerName: string;
  city: "تنومة" | "النماص" | "المجاردة";
  village?: string;
  district: string;
  rating: number;
  reviewsCount: number;
  specialty: string;
  avatarUrl: string;
  bannerUrl: string;
  galleryUrls?: string[];
  phone: string;
  isVerified: boolean;
  deliveryAvailable: boolean;
  deliveryOrPickup?: "pickup" | "delivery" | "both";
  workingHours?: string;
  minOrder: number;
  deliveryFee: number;
  bio?: string;
  registeredAt?: string;
}

export interface FoodItem {
  id: string;
  sellerId: string;
  sellerName: string;
  name: string;
  description: string;
  price: number;
  category: "مأكولات شعبية رئيسية" | "مخبوزات وحلويات" | "عسل وسمن شهري" | "مشروبات وبهارات";
  preparationTime: string;
  imageUrl: string;
  isAvailable: boolean;
  stockQuantity?: number;
  ingredients: string[];
  tags: string[];
  portion: string;
}

export interface CartItem {
  item: FoodItem;
  quantity: number;
  notes?: string;
}

export type OrderStatus = 
  | "pending_acceptance"        // أرسل الطلب وبانتظار قبول البائعة
  | "accepted_awaiting_payment" // قبلت البائعة الطلب وبانتظار دفع العميل
  | "preparing"                 // تم الدفع وجاري تجهيز الطلب
  | "ready"                     // الطلب جاهز للاستلام أو التوصيل
  | "on_the_way"                // في الطريق للتوصيل
  | "delivered"                 // تم الاستلام والتسليم
  | "completed"                 // مكتمل ومُقيّم
  | "cancelled";                // تم الإلغاء أو الرفض

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  deliveryAddress: string;
  city: string;
  fulfillmentType?: "pickup" | "delivery";
  sellerId?: string;
  sellerName?: string;
  sellerPhone?: string;
  items: {
    itemId: string;
    name: string;
    price: number;
    quantity: number;
    sellerName: string;
  }[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  grandTotal: number;
  status: OrderStatus;
  paymentMethod: "mada" | "apple_pay" | "visa" | "stc_pay" | "cash" | "wallet";
  paymentStatus: "paid" | "pending";
  rating?: number;
  reviewComment?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: "visitor" | "tour_guide" | "food_seller" | "village_supervisor" | "admin" | "super_admin";
  avatar?: string;
  city?: string;
  isVerified: boolean;
  assignedVillageId?: string;
  assignedVillageName?: string;
  assignedRegion?: string;
  supervisorCode?: string;
  subscriptionPlan?: "free" | "monthly" | "annual";
  subscriptionStatus?: "active" | "pending_renewal" | "expired";
  subscriptionExpiry?: string;
  permissions?: string[];
  fcmToken?: string;
  fcmTokens?: string[];
  lastFcmSyncAt?: string;
  weatherAlertsEnabled?: boolean;
  tribalAlertsEnabled?: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  actionType: "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "STATUS_CHANGE" | "PAYMENT" | "SUBSCRIPTION_RENEW" | "PERMISSION_CHANGE";
  targetModule: "VILLAGES" | "FORTS" | "CONTENT" | "GUIDES" | "SELLERS" | "ORDERS" | "BOOKINGS" | "PAYMENTS" | "COMPLAINTS" | "REVIEWS" | "SECURITY" | "USERS" | "TRIBAL_FORUM";
  details: string;
  villageScope?: string;
  ipAddress?: string;
}

export interface Complaint {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  userPhone: string;
  category: "خدمات قرية" | "حجز مرشد" | "طلب متجر" | "محتوى غير لائق" | "مشكلة دفع" | "اقتراح وتطوير";
  relatedVillageOrService?: string;
  title: string;
  description: string;
  status: "new" | "in_progress" | "resolved" | "rejected";
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo?: string;
  adminResponse?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlatformPayment {
  id: string;
  transactionNumber: string;
  type: "village_subscription" | "guide_commission" | "order_commission" | "experience_commission" | "featured_listing";
  payerName: string;
  payerRole: string;
  amount: number;
  commissionRate: number; // e.g. 10
  netAmount: number;
  paymentMethod: "mada" | "apple_pay" | "visa" | "stc_pay" | "bank_transfer";
  status: "completed" | "pending" | "failed" | "refunded";
  relatedEntityId: string;
  relatedEntityName: string;
  createdAt: string;
}

export interface CommissionSettings {
  guideCommissionPercent: number;
  foodStoreCommissionPercent: number;
  villageMonthlyFee: number;
  villageAnnualFee: number;
  autoApproveReviews: boolean;
  requireSupervisorVerification: boolean;
}

export interface HeritageTopic {
  id: string;
  title: string;
  subtitle: string;
  category: "history" | "villages" | "arts" | "crafts" | "cuisine";
  coverImage: string;
  summary: string;
  content: string[];
  quoteOrPoem?: string;
  tags: string[];
  featuredItems?: {
    name: string;
    desc: string;
    image?: string;
  }[];
}

export interface DialectWord {
  id: string;
  word: string;
  meaning: string;
  exampleSentence: string;
  context: string;
  category: "ترحيب وتحية" | "حياة يومية" | "أوصاف وطبيعة" | "أمثال شعبية";
}

export interface HospitalityPlace {
  id: string;
  name: string;
  type: "نزل ريفي" | "شاليهات وفنادق" | "مقهى ومطل" | "مزرعة سياحية" | "مرشد ومغامرات";
  location: string;
  city: "تنومة" | "النماص" | "المجاردة";
  rating: number;
  features: string[];
  phone?: string;
  imageUrl: string;
  description: string;
  priceRange: "اقتصادي" | "متوسط" | "فاخر";
}

export interface TripPlanDay {
  day: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  highlight?: string;
}

export interface GeneratedPlan {
  title: string;
  summary: string;
  itinerary: TripPlanDay[];
  tips: string[];
  recommendedDishes?: string[];
}

export interface VisitorReview {
  id: string;
  author: string;
  city: string;
  comment: string;
  rating: number;
  date: string;
  attractionName: string;
  attractionId?: string;
  imageUrl?: string;
  userId?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "order" | "booking" | "payment" | "system";
  timestamp: string;
  read: boolean;
}

export interface BaniShahrExperience {
  id: string;
  title: string;
  category: "طبخ ومأكولات شعبية" | "حرف وصناعات تقليدية" | "طبيعة وزراعة وعسل" | "تراث وتصوير" | "أنشطة عائلية وأطفال" | "مغامرات وسياحة";
  hostName: string;
  hostRole: string;
  hostAvatar?: string;
  hostPhone: string;
  villageOrCity: string;
  region: "النماص" | "تنومة" | "المجاردة" | "السراة" | "تهامة";
  duration: string; // e.g., "ساعتان ونصف"
  pricePerPerson: number; // in SAR
  maxGroupSize: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  galleryImages: string[];
  description: string;
  included: string[];
  requirements: string[];
  schedule: string;
  locationDetails: string;
  coordinates: { lat: number; lng: number };
  isPopular?: boolean;
}

export interface ExperienceBooking {
  id: string;
  experienceId: string;
  experienceTitle: string;
  hostName: string;
  userId: string;
  userName: string;
  userPhone: string;
  bookingDate: string;
  timeSlot: string;
  guestsCount: number;
  pricePerPerson: number;
  subtotal: number;
  platformCommissionPercent: number; // e.g. 12%
  platformCommissionAmount: number;
  hostEarnings: number;
  status: "confirmed" | "completed" | "cancelled" | "pending";
  paymentMethod: "mada" | "apple_pay" | "visa" | "stc_pay";
  paymentStatus: "paid" | "unpaid";
  createdAt: string;
}

// -------------------------------------------------------------
// ذاكرة بني شهر - الأرشيف الرقمي للتراث والروايات والوثائق
// -------------------------------------------------------------

export type MemoryContentType = "oral_narration" | "verified_info" | "historical_document";

export type MemoryCategory = 
  | "قصص زمان"
  | "روايات الأجداد"
  | "قصص كل قبيلة"
  | "العادات القديمة"
  | "الأمثال الشعبية"
  | "الحياة قديمًا"
  | "الزراعة والرعي"
  | "الأسواق القديمة"
  | "الأعراس والمناسبات"
  | "الملابس التقليدية"
  | "الألعاب الشعبية"
  | "صور قديمة"
  | "تسجيلات صوتية لكبار السن"
  | "قصص زمان وروايات الأجداد"
  | "العادات القديمة والأعراف"
  | "الأمثال الشعبية والحكم"
  | "الحياة قديمًا والزراعة والرعي"
  | "الأسواق القديمة والقوافل"
  | "الأعراس والمناسبات والمحافل"
  | "الملابس التقليدية والزينة"
  | "الألعاب الشعبية وأهازيج الصغار"
  | "صور قديمة ونوادر الأرشيف";

export interface MemoryItem {
  id: string;
  title: string;
  tribeBranch: string; // e.g., "بني أثلة", "بني شهر السراة", "بني ثابت", "العمرة", "آل بهيش", "الكلاثمة", "بلحصين", etc.
  category: MemoryCategory;
  contentType: MemoryContentType; // رواية شفهية | معلومة موثقة | وثيقة تاريخية
  narratorName: string; // اسم الراوي أو الناقل
  narratorAgeOrEra?: string; // مثلاً: 85 عاماً / من مواليد 1360هـ
  contributorName: string; // اسم مرسل المشاركة
  contributorPhone?: string;
  villageOrLocation: string;
  region: "النماص" | "تنومة" | "المجاردة" | "السراة" | "تهامة" | "وادي خاط";
  dateOfEventOrEra?: string; // مثلاً: قبل 90 عاماً / عصر حصار الحصون
  content: string; // نص الرواية الكامل
  imageUrl?: string;
  documentScanUrl?: string;
  audioRecordingUrl?: string; // رابط أو تسجيل صوتي لكبار السن
  audioDuration?: string; // e.g. "03:45"
  status: "published" | "pending_review" | "rejected";
  moderationNotes?: string;
  reviewedBy?: string;
  likesCount: number;
  sharesCount: number;
  tags: string[];
  createdAt: string;
}

export interface MemoryContributionSubmission {
  title: string;
  tribeBranch: string;
  category: MemoryCategory;
  contentType: MemoryContentType;
  narratorName: string;
  narratorAgeOrEra?: string;
  contributorName: string;
  contributorPhone: string;
  villageOrLocation: string;
  region: "النماص" | "تنومة" | "المجاردة" | "السراة" | "تهامة";
  dateOfEventOrEra?: string;
  content: string;
  imageUrl?: string;
  audioRecordingUrl?: string;
  documentScanUrl?: string;
  tags?: string[];
}

// -------------------------------------------------------------
// نظام المحادثات الداخلي الآمن ومنع تجاوز التطبيق (Secure In-App Chat & Anti-Bypass System)
// -------------------------------------------------------------

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: "visitor" | "tour_guide" | "food_seller" | "village_supervisor" | "admin";
  content: string;
  isSystemNotice?: boolean;
  systemNoticeType?: "warning_bypass" | "order_status" | "booking_status" | "payment_verified";
  timestamp: string;
  isRead: boolean;
  attachments?: {
    type: "image" | "location";
    url?: string;
    label?: string;
  }[];
}

export interface ChatConversation {
  id: string;
  type: "order" | "booking" | "experience" | "support" | "direct";
  relatedEntityId: string; // Order ID, Booking ID, or Guide/Seller ID
  title: string;
  subtitle: string;
  participant1Id: string;
  participant1Name: string;
  participant1Role: string;
  participant1MaskedPhone: string;
  participant2Id: string;
  participant2Name: string;
  participant2Role: string;
  participant2MaskedPhone: string;
  lastMessage?: string;
  lastMessageTimestamp?: string;
  unreadCountParticipant1: number;
  unreadCountParticipant2: number;
  isReported?: boolean;
  status: "active" | "archived" | "under_review_dispute";
  createdAt: string;
  updatedAt: string;
}

export interface ChatReport {
  id: string;
  conversationId: string;
  reportedByUserId: string;
  reportedByUserName: string;
  reason: "تبادل أرقام خارجية وتجاوز التطبيق" | "احتيال أو طلب دفع خارجي" | "سلوك غير لائق" | "عدم الالتزام بالطلب/الحجز" | "أخرى";
  details: string;
  status: "pending" | "investigating" | "resolved" | "dismissed";
  adminNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface BypassFilterResult {
  isBlocked: boolean;
  detectedType?: "phone_number" | "external_url" | "whatsapp_link" | "social_media";
  violationDescription?: string;
  sanitizedText: string;
}

// -------------------------------------------------------------
// المحفظة الرقمية وبوابة الدفع ميسر (Digital Wallet & Moyasar Gateway)
// -------------------------------------------------------------

export type WalletTransactionType = 
  | "deposit"      // شحن رصيد (Top-up via Moyasar)
  | "payment"      // دفع حجز / طلب متجر
  | "earnings"     // أرباح مرشد / متجر أسرة منتجة
  | "payout"       // سحب أرباح إلى حساب بنكي
  | "refund"       // استرداد أموال
  | "commission";  // عمولة منصة

export interface WalletTransaction {
  id: string;
  userId: string;
  type: WalletTransactionType;
  amount: number; // المبلغ بالريال السعودي
  fee?: number; // رسوم أو عمولة
  netAmount: number;
  title: string;
  description: string;
  status: "completed" | "pending" | "failed";
  paymentGateway: "moyasar" | "system" | "bank_transfer" | "wallet";
  moyasarPaymentId?: string;
  paymentMethod?: "mada" | "apple_pay" | "visa" | "mastercard" | "stc_pay" | "wallet";
  referenceId?: string; // رقم الطلب أو الحجز المرتبط
  createdAt: string;
}

export interface WalletAccount {
  userId: string;
  balance: number; // الرصيد المتاح بالريال السعودي
  pendingBalance: number; // رصيد معلق للأرباح تحت التسوية
  currency: "SAR";
  iban: string; // SA...
  bankName: string;
  accountHolderName: string;
  moyasarCustomerId?: string;
  lastUpdated: string;
}

export interface MoyasarConfig {
  publishableKey: string;
  secretKeyPlaceholder: string;
  isLiveMode: boolean;
  webhookUrl: string;
  supportedMethods: ("mada" | "apple_pay" | "creditcard" | "stcpay")[];
  testCards: {
    name: string;
    type: string;
    cardNumber: string;
    cvv: string;
    expiry: string;
  }[];
}

// --- ADMIN PORTAL & LINEAGE MANAGEMENT TYPES ---
export interface LineageModificationRequest {
  id: string;
  applicantId: string;
  applicantName: string;
  applicantPhone: string;
  tribeId: string;
  tribeName: string;
  fakhdhName: string;
  changeType: "add_branch" | "correct_name" | "merge_family" | "document_ancestor";
  currentLineage: string;
  proposedLineage: string;
  reason: string;
  witnesses: string[];
  historicalDocuments?: string[];
  status: "pending" | "approved" | "rejected" | "under_review";
  adminNotes?: string;
  reviewedBy?: string;
  createdAt: string;
  reviewedAt?: string;
}

export interface TribeNewsEvent {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: "أخبار رسمية" | "مناسبات وأعراس" | "تهاني وتبريكات" | "تعازي ومواساة" | "فعاليات ومهرجانات";
  tribeId: string; // 'all' for platform-wide or specific tribe id
  tribeName: string;
  location?: string;
  eventDate?: string;
  imageUrl?: string;
  authorId: string;
  authorName: string;
  isPinned: boolean;
  isPublished: boolean;
  viewsCount: number;
  createdAt: string;
}

export interface PlatformAd {
  id: string;
  title: string;
  advertiserName: string;
  advertiserPhone: string;
  placement: "hero_banner" | "featured_strip" | "tribes_sidebar" | "experiences_top";
  imageUrl: string;
  linkUrl: string;
  startDate: string;
  endDate: string;
  budgetSAR: number;
  impressionsCount: number;
  clicksCount: number;
  status: "active" | "scheduled" | "expired" | "paused";
  createdAt: string;
}

export interface BusinessLeaderSponsorship {
  id: string;
  name: string;
  honorificTitle: string; // الشيخ / رجل الأعمال / المهندس
  companyOrAffiliation: string;
  phone: string;
  email: string;
  tier: "platinum" | "gold" | "silver" | "community_partner";
  annualContributionSAR: number;
  sponsoredInitiatives: string[];
  avatarUrl: string;
  quote?: string;
  status: "active" | "pending_renewal" | "pledged";
  joinedDate: string;
}

export interface BroadcastNotification {
  id: string;
  title: string;
  message: string;
  type: "announcement" | "urgent_tribal" | "event_invite" | "security_alert";
  targetAudience: "all" | "specific_tribe" | "supervisors_only" | "active_visitors";
  targetTribeId?: string;
  targetTribeName?: string;
  senderId: string;
  senderName: string;
  sentAt: string;
  deliveredCount: number;
  status: "sent" | "scheduled";
}

export interface TribeSupervisorAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  tribeId: string;
  tribeName: string;
  role: "super_admin" | "tribe_supervisor" | "village_supervisor";
  supervisorCode: string;
  is2FAEnabled: boolean;
  assignedVillages: string[];
  permissions: string[];
  status: "active" | "suspended";
  lastLoginAt?: string;
  createdAt: string;
  fcmToken?: string;
  fcmTokens?: string[];
  lastFcmSyncAt?: string;
}

export type PushNotificationType = 
  | "supervisor_nomination_new"       // وصول طلب ترشح جديد للمشرفين
  | "nomination_approved"             // قبول طلب الترشح للمستخدم
  | "nomination_rejected"             // رفض طلب الترشح للمستخدم
  | "lineage_request"                 // طلب نسب
  | "broadcast_alert"                 // تنبيه عام
  | "weather_alert"                   // تنبيه هطول أمطار وطقس فوري من Open-Meteo
  | "system";

export interface FirebasePushNotification {
  id: string;
  title: string;
  body: string;
  type: PushNotificationType;
  targetRole?: "supervisor" | "admin" | "user" | "all" | "weather_subscribers";
  targetUserId?: string;
  targetUserPhone?: string;
  targetTribeId?: string;
  nominationId?: string;
  nominationApplicantName?: string;
  nominationTribeName?: string;
  status?: "unread" | "read";
  isRead?: boolean;
  createdAt: string;
  actionUrl?: string;
  cityName?: string;
  severity?: RainSeverity;
  weatherCondition?: string;
  precipMm?: number;
  metadata?: Record<string, any>;
  fcmMessageId?: string;
  deliveredViaFcm?: boolean;
}

export interface SupervisorNominationData {
  id?: string;
  fullName: string;
  phone: string;
  email?: string;
  tribeId: string;
  tribeName: string;
  fakhdh: string;
  village: string;
  qualifications: string;
  nationalId?: string;
  age?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  adminNotes?: string;
  applicantFcmToken?: string;
}

export type RainSeverity = "none" | "light" | "moderate" | "heavy";
export type AlertLevel = "green" | "yellow" | "orange" | "red";

export interface HourlyForecastPoint {
  time: string;
  timestampIso: string;
  temp: number;
  conditionAr: string;
  rainProbability: number;
  precipMm: number;
  icon: "sun" | "cloud-sun" | "cloud" | "cloud-fog" | "cloud-rain" | "cloud-lightning";
}

export interface PlannerWeatherData {
  id: "alnamas" | "tanomah";
  cityNameAr: string;
  lat: number;
  lon: number;
  elevation: string;
  source: string;
  provider: "Open-Meteo API";
  stationName: string;
  current: {
    temp: number;
    feelsLike: number;
    conditionAr: string;
    conditionCode: string;
    weatherCode: number;
    humidity: number;
    windSpeedKmh: number;
    windDirectionAr: string;
    precipitationMm: number;
    precipProbability: number;
    updatedAt: string;
  };
  rainStatus: {
    isRaining: boolean;
    rainExpectedToday: boolean;
    severity: RainSeverity;
    severityAr: "مستقر" | "أمطار خفيفة" | "أمطار متوسطة" | "أمطار غزيرة ورعدية";
    precipAmountEstimate?: string;
    expectedRainTime?: string;
    alertLevel: AlertLevel;
    alertTitle?: string;
    alertDescription?: string;
    safetyAdvice?: string;
  };
  hourly: HourlyForecastPoint[];
  dailyForecast: Array<{
    dayName: string;
    date: string;
    maxTemp: number;
    minTemp: number;
    conditionAr: string;
    precipitationSumMm: number;
    rainProbability: number;
  }>;
}



