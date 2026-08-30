import { 
  collection, 
  addDoc, 
  setDoc,
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  where 
} from "firebase/firestore";
import { getToken, onMessage, isSupported } from "firebase/messaging";
import { db, getFirebaseMessaging, firebaseConfig } from "./firebase";
import { DataStore } from "./datastore";
import { AppStorage } from "./nativeStorage";
import { FirebasePushNotification, PushNotificationType, SupervisorNominationData } from "../types";

/**
 * Web Audio API synthesizer for notification chime
 * Works 100% offline and in all modern browsers without external audio assets
 */
export function playNotificationSound(type: "nomination_new" | "approved" | "rejected" | "weather" | "general" = "general") {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "weather") {
      // Natural rain chime / soothing double bell (F5 -> A5 -> C6)
      osc.type = "sine";
      osc.frequency.setValueAtTime(698.46, now); // F5
      osc.frequency.setValueAtTime(880.00, now + 0.12); // A5
      osc.frequency.setValueAtTime(1046.50, now + 0.24); // C6
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
      osc.start(now);
      osc.stop(now + 0.65);
    } else if (type === "approved") {
      // Ascending triumphant melody (C5 -> E5 -> G5)
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (type === "nomination_new") {
      // Alert chime (A5 -> D6)
      osc.type = "triangle";
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(1174.66, now + 0.15);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.45);
    } else if (type === "rejected") {
      // Soft gentle tone (D5 -> A4)
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.setValueAtTime(440, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else {
      // Clean pop chime
      osc.type = "sine";
      osc.frequency.setValueAtTime(659.25, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  } catch (e) {
    console.debug("Audio notification suppressed or unsupported:", e);
  }
}

/**
 * Browser Web Notification API helpers
 */
export async function requestBrowserPushPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) {
    console.warn("هذا المتصفح لا يدعم إشعارات سطح المكتب/النظام.");
    return "denied";
  }

  if (Notification.permission === "granted") {
    return "granted";
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
}

export function showBrowserPushNotification(
  title: string, 
  body: string, 
  options?: { tag?: string; icon?: string; onClick?: () => void; data?: any }
) {
  if (!("Notification" in window)) return;

  if (Notification.permission === "granted") {
    try {
      const notification = new Notification(title, {
        body,
        icon: options?.icon || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=128&q=80",
        tag: options?.tag || `notif_${Date.now()}`,
        badge: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=64&q=80",
        dir: "rtl",
        lang: "ar",
        data: options?.data
      });

      notification.onclick = function() {
        window.focus();
        if (options?.onClick) options.onClick();
        notification.close();
      };
    } catch (err) {
      console.warn("Failed to display browser notification:", err);
    }
  }
}

/**
 * LocalStorage Fallback Cache & FCM Token keys
 */
const LOCAL_NOTIFS_KEY = "bani_shahr_firebase_push_notifications";
const FCM_TOKEN_KEY = "bani_shahr_fcm_token";
const FCM_SYNC_STATUS_KEY = "bani_shahr_fcm_sync_status";

function getLocalNotifications(): FirebasePushNotification[] {
  try {
    const saved = AppStorage.getItem(LOCAL_NOTIFS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveLocalNotifications(list: FirebasePushNotification[]) {
  try {
    AppStorage.setItem(LOCAL_NOTIFS_KEY, JSON.stringify(list.slice(0, 100)));
  } catch (e) {
    console.error(e);
  }
}

/**
 * Push Notification Service singleton with Firebase Cloud Messaging (FCM) and Firebase Firestore binding
 */
export const pushNotificationService = {
  /**
   * Get cached FCM token from local storage
   */
  getCachedFCMToken(): string | null {
    return AppStorage.getItem(FCM_TOKEN_KEY);
  },

  /**
   * 1. Initialize FCM, Request Permission, Register Service Worker, and bind FCM token to Firebase Firestore
   */
  async requestAndRegisterFCMToken(targetUser?: { 
    id?: string; 
    phone?: string; 
    role?: string; 
    tribeId?: string;
    supervisorCode?: string; 
    name?: string;
  }): Promise<string | null> {
    try {
      if (typeof window === "undefined") return null;

      // 1. Request standard Notification permission first
      const permission = await requestBrowserPushPermission();
      if (permission !== "granted") {
        console.warn("Notification permission was not granted:", permission);
        return null;
      }

      // 2. Check if Firebase Messaging is supported
      const messaging = await getFirebaseMessaging();
      if (!messaging) {
        console.info("FCM messaging not supported in current environment; proceeding with Web Push + Firestore notifications.");
        return null;
      }

      // 3. Register Service Worker if supported
      let swRegistration: ServiceWorkerRegistration | undefined;
      if ("serviceWorker" in navigator) {
        try {
          swRegistration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
          console.log("✅ Firebase Messaging Service Worker registered:", swRegistration.scope);
        } catch (swErr) {
          console.warn("ServiceWorker registration warning:", swErr);
        }
      }

      // 4. Retrieve FCM Token
      const vapidKey = (import.meta as any).env?.VITE_FIREBASE_VAPID_KEY || undefined;
      const currentToken = await getToken(messaging, {
        vapidKey: vapidKey,
        serviceWorkerRegistration: swRegistration
      });

      if (currentToken) {
        console.log("🔥 Firebase Cloud Messaging (FCM) Token retrieved successfully:", currentToken);
        AppStorage.setItem(FCM_TOKEN_KEY, currentToken);
        AppStorage.setItem(FCM_SYNC_STATUS_KEY, JSON.stringify({
          syncedAt: new Date().toISOString(),
          token: currentToken.substring(0, 16) + "..."
        }));

        // 5. Bind FCM Token to Firebase Firestore & Local DataStore
        const userId = targetUser?.id || DataStore.getCurrentUser().id;
        const userPhone = targetUser?.phone || DataStore.getCurrentUser().phone;
        const userRole = targetUser?.role || DataStore.getCurrentUser().role;

        if (userId) {
          await DataStore.updateUserFCMToken(userId, currentToken);
        }
        if (userPhone && userPhone !== userId) {
          await DataStore.updateUserFCMToken(userPhone, currentToken);
        }

        // If user is a supervisor, link directly with supervisor identifier
        if (userRole === "village_supervisor" || userRole === "admin" || userRole === "super_admin" || targetUser?.supervisorCode) {
          if (targetUser?.supervisorCode) {
            await DataStore.linkSupervisorFCMToken(targetUser.supervisorCode, currentToken);
          }
          if (userId) {
            await DataStore.linkSupervisorFCMToken(userId, currentToken);
          }
          if (userPhone) {
            await DataStore.linkSupervisorFCMToken(userPhone, currentToken);
          }
        }

        // 6. Save FCM Token record in Firestore for multi-platform server push delivery
        try {
          const tokenDocRef = doc(db, "fcm_tokens", `${userId || "guest"}_${currentToken.substring(0, 10)}`);
          await setDoc(tokenDocRef, {
            token: currentToken,
            userId: userId || null,
            phone: userPhone || null,
            role: userRole || "visitor",
            tribeId: targetUser?.tribeId || null,
            name: targetUser?.name || DataStore.getCurrentUser().name,
            platform: "web",
            browser: navigator.userAgent,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        } catch (fErr) {
          console.debug("Firestore fcm_tokens write:", fErr);
        }

        return currentToken;
      } else {
        console.warn("No registration token available. Request permission to generate one.");
        return null;
      }
    } catch (error) {
      console.warn("Error retrieving Firebase Cloud Messaging token:", error);
      return null;
    }
  },

  /**
   * 2. Setup Foreground FCM Message listener
   */
  async setupFCMForegroundListener(onReceivedMessage?: (payload: any) => void): Promise<() => void> {
    try {
      const messaging = await getFirebaseMessaging();
      if (!messaging) return () => {};

      const unsubscribe = onMessage(messaging, (payload) => {
        console.log("📨 Received foreground FCM push message:", payload);

        const title = payload.notification?.title || payload.data?.title || "إشعار جديد - بني شهر";
        const body = payload.notification?.body || payload.data?.body || "لديك تنبيه فوري جديد.";
        const type = (payload.data?.type as PushNotificationType) || "system";

        const soundType = type === "supervisor_nomination_new" ? "nomination_new" :
                          type === "nomination_approved" ? "approved" :
                          type === "nomination_rejected" ? "rejected" : "general";

        playNotificationSound(soundType);
        showBrowserPushNotification(title, body, {
          data: payload.data
        });

        // Add to local real-time feed
        const incomingItem: FirebasePushNotification = {
          id: payload.messageId || `fcm_${Date.now()}`,
          title,
          body,
          type,
          status: "unread",
          isRead: false,
          createdAt: new Date().toISOString(),
          fcmMessageId: payload.messageId,
          deliveredViaFcm: true,
          metadata: payload.data
        };

        const list = getLocalNotifications();
        saveLocalNotifications([incomingItem, ...list]);

        if (onReceivedMessage) {
          onReceivedMessage(payload);
        }
      });

      return unsubscribe;
    } catch (err) {
      console.warn("Failed to attach FCM foreground listener:", err);
      return () => {};
    }
  },

  /**
   * 3. Send Push Notification to Supervisors when a user submits a nomination
   */
  async sendNewNominationPushToSupervisors(nomination: SupervisorNominationData): Promise<FirebasePushNotification> {
    // Get supervisor tokens for targeting
    const supervisorTokens = DataStore.getSupervisorFCMTokens(nomination.tribeId);

    const notificationPayload: Omit<FirebasePushNotification, "id"> = {
      title: "🚨 وصول طلب ترشح مشرف جديد",
      body: `ورد طلب ترشيح جديد من (${nomination.fullName}) للإشراف على ${nomination.tribeName} (${nomination.fakhdh || nomination.village}). يرجى مراجعة الطلب واتخاذ الإجراء.`,
      type: "supervisor_nomination_new",
      targetRole: "supervisor",
      targetTribeId: nomination.tribeId,
      nominationId: nomination.id || `nom_${Date.now()}`,
      nominationApplicantName: nomination.fullName,
      nominationTribeName: nomination.tribeName,
      status: "unread",
      isRead: false,
      createdAt: new Date().toISOString(),
      deliveredViaFcm: supervisorTokens.length > 0,
      metadata: {
        phone: nomination.phone,
        fakhdh: nomination.fakhdh,
        village: nomination.village,
        qualifications: nomination.qualifications,
        targetTokensCount: supervisorTokens.length
      }
    };

    // Trigger immediate audio chime and browser notification
    playNotificationSound("nomination_new");
    showBrowserPushNotification(notificationPayload.title, notificationPayload.body);

    try {
      const docRef = await addDoc(collection(db, "push_notifications"), notificationPayload);
      const createdNotification: FirebasePushNotification = {
        id: docRef.id,
        ...notificationPayload
      };

      // Save to local cache
      const list = getLocalNotifications();
      saveLocalNotifications([createdNotification, ...list]);

      return createdNotification;
    } catch (error) {
      console.warn("Firestore push_notifications write fallback:", error);
      const fallbackNotif: FirebasePushNotification = {
        id: `local_${Date.now()}`,
        ...notificationPayload
      };
      const list = getLocalNotifications();
      saveLocalNotifications([fallbackNotif, ...list]);
      return fallbackNotif;
    }
  },

  /**
   * 4. Send Push Notification to User when their nomination is accepted or rejected
   */
  async sendNominationStatusPushToUser(
    nomination: SupervisorNominationData, 
    status: "approved" | "rejected",
    notes?: string
  ): Promise<FirebasePushNotification> {
    const isApproved = status === "approved";
    const applicantToken = nomination.applicantFcmToken || DataStore.getCurrentUser().fcmToken;
    
    const notificationPayload: Omit<FirebasePushNotification, "id"> = {
      title: isApproved 
        ? "🎉 تهانينا! تم قبول طلب ترشيحك مشرفاً" 
        : "📋 إشعار بخصوص طلب الترشح للإشراف",
      body: isApproved
        ? `يسر إدارة منصة بني شهر إبلاغك باعتماد ترشيحك مشرفاً رسمياً على (${nomination.tribeName}). تم منحك الصلاحيات وتفعيل حسابك.`
        : `نعتذر منك، لم يتم قبول طلب ترشيحك على (${nomination.tribeName}) حالياً. ${notes ? `ملاحظات: ${notes}` : "نشكر لك حرصك ومبادرتك الكريمة."}`,
      type: isApproved ? "nomination_approved" : "nomination_rejected",
      targetRole: "user",
      targetUserId: nomination.phone, // match user by phone or ID
      targetUserPhone: nomination.phone,
      targetTribeId: nomination.tribeId,
      nominationId: nomination.id,
      nominationApplicantName: nomination.fullName,
      nominationTribeName: nomination.tribeName,
      status: "unread",
      isRead: false,
      createdAt: new Date().toISOString(),
      deliveredViaFcm: Boolean(applicantToken),
      metadata: {
        status,
        notes: notes || "",
        reviewedAt: new Date().toISOString(),
        hasFcmToken: Boolean(applicantToken)
      }
    };

    // Play tone and show browser push
    playNotificationSound(isApproved ? "approved" : "rejected");
    showBrowserPushNotification(notificationPayload.title, notificationPayload.body);

    try {
      const docRef = await addDoc(collection(db, "push_notifications"), notificationPayload);
      const createdNotification: FirebasePushNotification = {
        id: docRef.id,
        ...notificationPayload
      };

      const list = getLocalNotifications();
      saveLocalNotifications([createdNotification, ...list]);

      return createdNotification;
    } catch (error) {
      console.warn("Firestore push_notifications write fallback:", error);
      const fallbackNotif: FirebasePushNotification = {
        id: `local_${Date.now()}`,
        ...notificationPayload
      };
      const list = getLocalNotifications();
      saveLocalNotifications([fallbackNotif, ...list]);
      return fallbackNotif;
    }
  },

  /**
   * 5. Send a general test push notification to verify push system
   */
  async sendTestPushNotification(title?: string, body?: string): Promise<FirebasePushNotification> {
    const payload: Omit<FirebasePushNotification, "id"> = {
      title: title || "🔔 اختبار خدمة Firebase Cloud Messaging (FCM)",
      body: body || "تم تفعيل استقبال الإشعارات عبر المتصفح وربط FCM Token مع جدول profiles للمشرفين في Firebase Firestore بنجاح!",
      type: "system",
      targetRole: "all",
      status: "unread",
      isRead: false,
      createdAt: new Date().toISOString(),
      deliveredViaFcm: true
    };

    playNotificationSound("general");
    showBrowserPushNotification(payload.title, payload.body);

    try {
      const docRef = await addDoc(collection(db, "push_notifications"), payload);
      const item: FirebasePushNotification = { id: docRef.id, ...payload };
      const list = getLocalNotifications();
      saveLocalNotifications([item, ...list]);
      return item;
    } catch {
      const item: FirebasePushNotification = { id: `test_${Date.now()}`, ...payload };
      const list = getLocalNotifications();
      saveLocalNotifications([item, ...list]);
      return item;
    }
  },

  /**
   * 5b. Send or trigger instant Weather Rain Alert push notification
   * Dispatches to all users who enabled weather alerts
   */
  async sendWeatherRainPushAlert(params: {
    cityName: string;
    severity?: "none" | "light" | "moderate" | "heavy";
    severityAr?: string;
    precipMm?: number;
    details?: string;
    isTest?: boolean;
  }): Promise<FirebasePushNotification> {
    const cityName = params.cityName || "النماص وتنومة";
    const severityAr = params.severityAr || (params.severity === "heavy" ? "أمطار غزيرة ورعدية" : params.severity === "moderate" ? "أمطار متوسطة" : "أمطار خفيفة وضباب");
    const title = params.isTest 
      ? `🌧️ [تجربة] تنبيه هطول أمطار - ${cityName}`
      : `🌧️ تنبيه طقس مباشر: توقعات ${severityAr} على ${cityName}`;
    
    const body = params.details || (params.precipMm 
      ? `رصدت مؤشرات Open-Meteo تشكل سحب ماطرة بمعدل (${params.precipMm} ملم) مع تشكل ضباب السراة. يرجى توخي الحذر في المنحدرات والعقبات.`
      : `تشير بيانات الأرصاد في Open-Meteo إلى رصد حالة مطرية وضباب كثيف يعانق قمم ${cityName}.`);

    const payload: Omit<FirebasePushNotification, "id"> = {
      title,
      body,
      type: "weather_alert",
      targetRole: "weather_subscribers",
      status: "unread",
      isRead: false,
      createdAt: new Date().toISOString(),
      actionUrl: "/#weather",
      cityName,
      severity: params.severity || "light",
      weatherCondition: severityAr,
      precipMm: params.precipMm || 0,
      deliveredViaFcm: true,
      metadata: {
        provider: "Open-Meteo API (Hourly Weather Engine)",
        cityName,
        isTest: Boolean(params.isTest)
      }
    };

    // Play weather chime and show native system push
    playNotificationSound("weather");
    showBrowserPushNotification(title, body, {
      tag: `weather_alert_${Date.now()}`,
      data: { actionUrl: "/#weather", type: "weather_alert" }
    });

    try {
      const docRef = await addDoc(collection(db, "push_notifications"), payload);
      const item: FirebasePushNotification = { id: docRef.id, ...payload };
      const list = getLocalNotifications();
      saveLocalNotifications([item, ...list]);
      return item;
    } catch {
      const item: FirebasePushNotification = { id: `weather_${Date.now()}`, ...payload };
      const list = getLocalNotifications();
      saveLocalNotifications([item, ...list]);
      return item;
    }
  },

  /**
   * 5c. Trigger immediate server-side background weather check for Al-Namas & Tanomah
   */
  async triggerServerWeatherCheck(): Promise<{ success: boolean; triggeredAlert: boolean; message: string; summary?: any }> {
    try {
      const res = await fetch("/api/weather/check-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e: any) {
      console.warn("Failed to trigger server weather check:", e);
      return {
        success: false,
        triggeredAlert: false,
        message: e?.message || "تعذر الاتصال بخادم فحص الطقس بالخلفية"
      };
    }
  },

  /**
   * 6. Real-time listener for incoming Push Notifications from Firebase Firestore
   */
  subscribeToNotifications(
    filterOrCallback: { role?: string; phone?: string; tribeId?: string } | ((notifications: FirebasePushNotification[], isInitial: boolean) => void),
    maybeCallback?: (notifications: FirebasePushNotification[], isInitial: boolean) => void
  ) {
    const filter = typeof filterOrCallback === "function" ? {} : filterOrCallback;
    const onReceived = typeof filterOrCallback === "function" ? filterOrCallback : (maybeCallback || (() => {}));

    let isInitialLoad = true;
    let initialCount = 0;

    try {
      const notifsCol = collection(db, "push_notifications");
      const q = query(notifsCol, orderBy("createdAt", "desc"), limit(50));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items: FirebasePushNotification[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as Omit<FirebasePushNotification, "id">;
          items.push({
            id: docSnap.id,
            ...data
          });
        });

        const weatherAlertsEnabled = DataStore.getWeatherAlertsPreference();
        const tribalAlertsEnabled = DataStore.getTribalAlertsPreference();

        // Filter based on user preferences, role or phone
        const filtered = items.filter((n) => {
          // Weather alert check
          if (n.type === "weather_alert") {
            return weatherAlertsEnabled;
          }

          // Tribal alert check
          if (n.type === "supervisor_nomination_new" || n.type === "nomination_approved" || n.type === "nomination_rejected" || n.type === "lineage_request") {
            if (!tribalAlertsEnabled && filter.role !== "admin" && filter.role !== "super_admin") {
              return false;
            }
          }

          if (n.targetRole === "all" || n.targetRole === "weather_subscribers") return true;
          if (filter.role === "admin" || filter.role === "super_admin") return true;
          if (filter.role === "village_supervisor" || filter.role === "tribe_supervisor") {
            return n.targetRole === "supervisor" || (filter.tribeId && n.targetTribeId === filter.tribeId);
          }
          if (filter.phone && n.targetUserPhone === filter.phone) return true;
          return n.targetRole === "user" || !n.targetRole;
        });

        // Detect new incoming real-time notification (after initial load)
        if (!isInitialLoad && filtered.length > initialCount) {
          const newest = filtered[0];
          if (newest && (newest.status === "unread" || !newest.isRead)) {
            const soundType = newest.type === "supervisor_nomination_new" ? "nomination_new" : 
                              newest.type === "nomination_approved" ? "approved" : 
                              newest.type === "nomination_rejected" ? "rejected" : "general";
            playNotificationSound(soundType);
            showBrowserPushNotification(newest.title, newest.body);
          }
        }

        initialCount = filtered.length;
        onReceived(filtered, isInitialLoad);
        isInitialLoad = false;
      }, (err) => {
        console.warn("Firestore snapshot listener error for push_notifications:", err);
        // Fallback to local cache
        const local = getLocalNotifications();
        onReceived(local, true);
      });

      return unsubscribe;
    } catch (err) {
      console.warn("Failed to subscribe to push notifications:", err);
      const local = getLocalNotifications();
      onReceived(local, true);
      return () => {};
    }
  },

  /**
   * 7. Mark notification as read
   */
  async markAsRead(id: string): Promise<void> {
    // Update local cache
    const local = getLocalNotifications();
    const updated = local.map((n) => (n.id === id ? { ...n, status: "read" as const, isRead: true } : n));
    saveLocalNotifications(updated);

    try {
      if (!id.startsWith("local_") && !id.startsWith("test_")) {
        const notifRef = doc(db, "push_notifications", id);
        await updateDoc(notifRef, { status: "read", isRead: true });
      }
    } catch (e) {
      console.debug("markAsRead Firestore:", e);
    }
  },

  /**
   * 8. Mark all as read
   */
  async markAllAsRead(notifications?: FirebasePushNotification[]): Promise<void> {
    const local = getLocalNotifications();
    const updated = local.map((n) => ({ ...n, status: "read" as const, isRead: true }));
    saveLocalNotifications(updated);

    try {
      const targetList = notifications || local;
      for (const n of targetList) {
        if (!n.id.startsWith("local_") && !n.id.startsWith("test_")) {
          const notifRef = doc(db, "push_notifications", n.id);
          await updateDoc(notifRef, { status: "read", isRead: true });
        }
      }
    } catch (e) {
      console.debug("markAllAsRead Firestore:", e);
    }
  },

  /**
   * 9. Delete notification
   */
  async deleteNotification(id: string): Promise<void> {
    const local = getLocalNotifications();
    const updated = local.filter((n) => n.id !== id);
    saveLocalNotifications(updated);

    try {
      if (!id.startsWith("local_") && !id.startsWith("test_")) {
        const notifRef = doc(db, "push_notifications", id);
        await deleteDoc(notifRef);
      }
    } catch (e) {
      console.debug("deleteNotification Firestore:", e);
    }
  },

  /**
   * 10. Clear all notifications
   */
  async clearAll(): Promise<void> {
    const local = getLocalNotifications();
    saveLocalNotifications([]);

    try {
      for (const n of local) {
        if (!n.id.startsWith("local_") && !n.id.startsWith("test_")) {
          const notifRef = doc(db, "push_notifications", n.id);
          await deleteDoc(notifRef);
        }
      }
    } catch (e) {
      console.debug("clearAll Firestore:", e);
    }
  }
};

