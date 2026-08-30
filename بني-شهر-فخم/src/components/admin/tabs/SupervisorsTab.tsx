import React, { useState, useEffect } from "react";
import { TribeSupervisorAccount, UserProfile, SupervisorNominationData } from "../../../types";
import { DataStore, generateUniqueId } from "../../../lib/datastore";
import { db } from "../../../lib/firebase";
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  updateDoc,
  getDocs
} from "firebase/firestore";
import { pushNotificationService, playNotificationSound } from "../../../lib/pushNotifications";
import { AppStorage } from "../../../lib/nativeStorage";
import {
  UserCheck,
  Plus,
  Search,
  ShieldCheck,
  Key,
  Trash2,
  Lock,
  Mail,
  Phone,
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Crown,
  Bell,
  Check,
  X,
  FileText,
  AlertTriangle,
  RefreshCw,
  Send,
  Smartphone,
  Radio,
  Share2
} from "lucide-react";

interface SupervisorsTabProps {
  onNotification: (msg: string) => void;
}

export const SupervisorsTab: React.FC<SupervisorsTabProps> = ({ onNotification }) => {
  const [supervisors, setSupervisors] = useState<TribeSupervisorAccount[]>(() => DataStore.getSupervisorAccounts());
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"nominations" | "active_supervisors" | "fcm_settings">("nominations");
  const [nominationFilter, setNominationFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");

  // FCM and Push status state
  const [isRegisteringFCM, setIsRegisteringFCM] = useState(false);
  const [activeFCMToken, setActiveFCMToken] = useState<string | null>(() => pushNotificationService.getCachedFCMToken());
  const [isSendingTestPush, setIsSendingTestPush] = useState(false);

  // Firebase Live Nominations state
  const [nominations, setNominations] = useState<SupervisorNominationData[]>([]);
  const [isLoadingNominations, setIsLoadingNominations] = useState(true);
  const [selectedNominationForReject, setSelectedNominationForReject] = useState<SupervisorNominationData | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Form State for manual add
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [tribeName, setTribeName] = useState("قبيلة آل وليد");
  const [villagesText, setVillagesText] = useState("قرية العقيقة، حصن العقيقة التاريخي");
  const [supervisorCode, setSupervisorCode] = useState("AQIQAH-88");

  // Sync / Register FCM Token Handler
  const handleRegisterAndSyncFCM = async () => {
    setIsRegisteringFCM(true);
    try {
      const currentUser = DataStore.getCurrentUser();
      const token = await pushNotificationService.requestAndRegisterFCMToken({
        id: currentUser.id,
        phone: currentUser.phone,
        role: currentUser.role,
        supervisorCode: currentUser.supervisorCode,
        name: currentUser.name
      });

      if (token) {
        setActiveFCMToken(token);
        setSupervisors(DataStore.getSupervisorAccounts());
        onNotification("🔥 تم تفعيل Firebase Cloud Messaging وتحديث معرف الـ FCM token في جدول profiles بـ Firebase بنجاح!");
      } else {
        onNotification("يرجى التأكد من السماح بالإشعارات في المتصفح لتفعيل FCM.");
      }
    } catch (e) {
      console.error(e);
      onNotification("حدث خطأ أثناء تهيئة FCM Token.");
    } finally {
      setIsRegisteringFCM(false);
    }
  };

  const handleSendTestPush = async () => {
    setIsSendingTestPush(true);
    try {
      await pushNotificationService.sendTestPushNotification(
        "🔔 تنبيه تجريبي - Firebase FCM & Firebase",
        "تم فحص قناة الاتصال والإشعارات الفورية للمشرفين، والمزامنة مع Firebase Firestore تعمل بنجاح!"
      );
      onNotification("تم إرسال إشعار فوري تجريبي وتشغيل نغمة التنبيه بنجاح!");
    } catch (e) {
      console.error(e);
    } finally {
      setIsSendingTestPush(false);
    }
  };


  // Real-time listener for Firebase Firestore supervisor_nominations
  useEffect(() => {
    setIsLoadingNominations(true);
    let unsubscribe: () => void = () => {};

    try {
      const nomCol = collection(db, "supervisor_nominations");
      const q = query(nomCol, orderBy("createdAt", "desc"));

      unsubscribe = onSnapshot(q, (snapshot) => {
        const items: SupervisorNominationData[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as SupervisorNominationData;
          items.push({
            id: docSnap.id,
            ...data,
            fullName: data.fullName || (data as any).name || "متقدم غير معرّف",
            phone: data.phone || "",
            tribeId: data.tribeId || "",
            tribeName: data.tribeName || "بني شهر",
            fakhdh: data.fakhdh || "",
            village: data.village || "",
            qualifications: data.qualifications || (data as any).qualification || (data as any).reason || "",
            status: data.status || "pending",
            createdAt: data.createdAt || new Date().toISOString()
          });
        });

        // Also merge local cache if empty
        if (items.length === 0) {
          try {
            const local = JSON.parse(AppStorage.getItem("bani_shahr_all_nominations") || "[]");
            if (local.length > 0) {
              setNominations(local);
              setIsLoadingNominations(false);
              return;
            }
          } catch (e) {
            console.error(e);
          }
        }

        setNominations(items);
        setIsLoadingNominations(false);
      }, (err) => {
        console.warn("Firestore nominations listener error:", err);
        // Fallback local storage
        try {
          const local = JSON.parse(AppStorage.getItem("bani_shahr_all_nominations") || "[]");
          setNominations(local);
        } catch {
          setNominations([]);
        }
        setIsLoadingNominations(false);
      });
    } catch (e) {
      console.warn("Error subscribing to nominations:", e);
      setIsLoadingNominations(false);
    }

    return () => unsubscribe();
  }, []);

  const pendingCount = nominations.filter(n => n.status === "pending").length;

  // Handle Approve Nomination
  const handleApproveNomination = async (nomination: SupervisorNominationData) => {
    try {
      // 1. Update in Firebase Firestore
      if (nomination.id && !nomination.id.startsWith("local_")) {
        const docRef = doc(db, "supervisor_nominations", nomination.id);
        await updateDoc(docRef, {
          status: "approved",
          reviewedAt: new Date().toISOString(),
          reviewedBy: "الإدارة العامة"
        });
      }

      // 2. Register as active supervisor in DataStore
      const generatedCode = `${nomination.tribeId ? nomination.tribeId.substring(0, 4).toUpperCase() : "SHR"}-${Math.floor(100 + Math.random() * 900)}`;
      const newSup: TribeSupervisorAccount = {
        id: generateUniqueId("sup"),
        name: nomination.fullName,
        email: nomination.email || `supervisor_${Date.now()}@banishahr.sa`,
        phone: nomination.phone,
        tribeId: nomination.tribeId || generateUniqueId("tribe"),
        tribeName: nomination.tribeName,
        role: "tribe_supervisor",
        supervisorCode: generatedCode,
        is2FAEnabled: true,
        assignedVillages: nomination.village ? [nomination.village] : ["كافة قرى القبيلة"],
        permissions: ["manage_tribe_tree", "review_lineage_requests", "publish_tribe_news", "view_tribe_members"],
        status: "active",
        createdAt: new Date().toISOString()
      };

      DataStore.saveSupervisorAccount(newSup);
      setSupervisors(DataStore.getSupervisorAccounts());

      // 3. Update local state
      setNominations(prev => prev.map(n => n.id === nomination.id ? { ...n, status: "approved" } : n));

      // 4. Send Firebase Push Notification to applicant user
      await pushNotificationService.sendNominationStatusPushToUser(nomination, "approved");

      playNotificationSound("approved");
      onNotification(`🎉 تم اعتماد وترشيح [${nomination.fullName}] مشرفاً لقبيلة [${nomination.tribeName}] وتم إرسال إشعار فوري له!`);
    } catch (err) {
      console.error("Error approving nomination:", err);
      onNotification(`تم تحديث حالة الترشيح بنجاح`);
    }
  };

  // Handle Reject Nomination
  const handleRejectNominationSubmit = async () => {
    if (!selectedNominationForReject) return;
    const nomination = selectedNominationForReject;

    try {
      // 1. Update in Firebase Firestore
      if (nomination.id && !nomination.id.startsWith("local_")) {
        const docRef = doc(db, "supervisor_nominations", nomination.id);
        await updateDoc(docRef, {
          status: "rejected",
          adminNotes: rejectReason.trim(),
          reviewedAt: new Date().toISOString(),
          reviewedBy: "الإدارة العامة"
        });
      }

      // 2. Update local state
      setNominations(prev => prev.map(n => n.id === nomination.id ? { ...n, status: "rejected", adminNotes: rejectReason.trim() } : n));

      // 3. Send Firebase Push Notification to applicant user with reason
      await pushNotificationService.sendNominationStatusPushToUser(nomination, "rejected", rejectReason.trim());

      playNotificationSound("rejected");
      onNotification(`تم رفض طلب الترشيح للمتقدم [${nomination.fullName}] وإشعاره بذلك عبر الإشعارات الفورية.`);
      
      setSelectedNominationForReject(null);
      setRejectReason("");
    } catch (err) {
      console.error("Error rejecting nomination:", err);
      setSelectedNominationForReject(null);
      setRejectReason("");
    }
  };

  const filteredSupervisors = supervisors.filter(s =>
    s.name.includes(searchTerm) || s.tribeName.includes(searchTerm) || s.email.includes(searchTerm)
  );

  const filteredNominations = nominations.filter(n => {
    const matchesSearch = n.fullName.includes(searchTerm) || n.tribeName.includes(searchTerm) || n.phone.includes(searchTerm) || (n.fakhdh && n.fakhdh.includes(searchTerm));
    if (!matchesSearch) return false;
    if (nominationFilter === "all") return true;
    return n.status === nominationFilter;
  });

  const handleAddSupervisor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newSupervisor: TribeSupervisorAccount = {
      id: generateUniqueId("sup"),
      name,
      email,
      phone: phone || "0500000000",
      tribeId: generateUniqueId("tribe"),
      tribeName,
      role: "tribe_supervisor",
      supervisorCode: supervisorCode.toUpperCase(),
      is2FAEnabled: true,
      assignedVillages: villagesText.split("،").map(s => s.trim()).filter(Boolean),
      permissions: ["manage_tribe_tree", "review_lineage_requests", "publish_tribe_news", "view_tribe_members"],
      status: "active",
      createdAt: new Date().toISOString()
    };

    DataStore.saveSupervisorAccount(newSupervisor);
    setSupervisors(DataStore.getSupervisorAccounts());
    setShowAddModal(false);
    setName("");
    setEmail("");
    setPhone("");
    onNotification(`تم تعيين المشرف [${newSupervisor.name}] ومنحه صلاحيات إدارة [${newSupervisor.tribeName}]`);
  };

  const handleDeleteSupervisor = (id: string, name: string) => {
    if (confirm(`هل أنت متأكد من سحب الصلاحيات وحذف حساب المشرف: ${name}؟`)) {
      DataStore.deleteSupervisorAccount(id);
      setSupervisors(DataStore.getSupervisorAccounts());
      onNotification(`تم سحب صلاحيات المشرف [${name}] بنجاح`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-stone-950/70 border border-stone-800">
        <div>
          <h3 className="text-base font-bold text-white font-['Amiri'] flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-400" />
            <span>إدارة مشرفي القبائل وطلبات الترشيح المباشرة (Firebase Push)</span>
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            استقبال طلبات الترشيح الفورية، اعتماد وتعيين المشرفين، وإرسال تنبيهات القبول والرفض للمستخدمين
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>تعيين مشرف يدوي</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab("nominations")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeSubTab === "nominations"
                ? "bg-amber-500 text-stone-950 shadow-md shadow-amber-950/40"
                : "bg-stone-900 text-stone-300 hover:text-white border border-stone-800"
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>طلبات الترشيح الواردة</span>
            {pendingCount > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeSubTab === "nominations" ? "bg-stone-950 text-amber-400" : "bg-amber-500 text-stone-950 animate-pulse"
              }`}>
                {pendingCount} جديد
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab("active_supervisors")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeSubTab === "active_supervisors"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/40"
                : "bg-stone-900 text-stone-300 hover:text-white border border-stone-800"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>المشرفون المعتمدون ({supervisors.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("fcm_settings")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeSubTab === "fcm_settings"
                ? "bg-sky-600 text-white shadow-md shadow-sky-950/40"
                : "bg-stone-900 text-stone-300 hover:text-white border border-stone-800"
            }`}
          >
            <Radio className="w-4 h-4 text-sky-400" />
            <span>ربط FCM Token وFirebase Firestore</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[240px] flex-1 max-w-md">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="البحث بالاسم، القبيلة، أو الجوال..."
            className="w-full pl-4 pr-10 py-2 rounded-2xl bg-stone-900 border border-stone-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* TAB 1: INCOMING NOMINATIONS FROM FIREBASE */}
      {activeSubTab === "nominations" && (
        <div className="space-y-4">
          {/* Filter Chips */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400">تصفية الطلبات:</span>
              <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-xl border border-stone-800 text-xs">
                <button
                  onClick={() => setNominationFilter("pending")}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                    nominationFilter === "pending"
                      ? "bg-amber-500 text-stone-950"
                      : "text-stone-300 hover:text-white"
                  }`}
                >
                  قيد المراجعة ({nominations.filter(n => n.status === "pending").length})
                </button>
                <button
                  onClick={() => setNominationFilter("approved")}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                    nominationFilter === "approved"
                      ? "bg-emerald-600 text-white"
                      : "text-stone-300 hover:text-white"
                  }`}
                >
                  المعتمدة ({nominations.filter(n => n.status === "approved").length})
                </button>
                <button
                  onClick={() => setNominationFilter("rejected")}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                    nominationFilter === "rejected"
                      ? "bg-rose-600 text-white"
                      : "text-stone-300 hover:text-white"
                  }`}
                >
                  المرفوضة ({nominations.filter(n => n.status === "rejected").length})
                </button>
                <button
                  onClick={() => setNominationFilter("all")}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                    nominationFilter === "all"
                      ? "bg-stone-700 text-white"
                      : "text-stone-300 hover:text-white"
                  }`}
                >
                  الكل ({nominations.length})
                </button>
              </div>
            </div>

            <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping" />
              مزامنة فورية مع Firebase Cloud Firestore
            </span>
          </div>

          {/* Nominations Cards List */}
          {isLoadingNominations ? (
            <div className="p-12 text-center text-stone-400">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-400" />
              <span>جاري تحميل طلبات الترشيح من فايربيس...</span>
            </div>
          ) : filteredNominations.length === 0 ? (
            <div className="p-10 rounded-3xl bg-stone-900/60 border border-stone-800 text-center space-y-2">
              <UserCheck className="w-10 h-10 text-stone-600 mx-auto" />
              <h4 className="font-bold text-sm text-stone-300">لا توجد طلبات ترشيح مطابقة</h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                عند تقديم أي متقدم لطلب ترشح عبر نافذة القبائل، سيظهر هنا فوراً مع إشعار فوري.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredNominations.map((nom) => {
                const isPending = nom.status === "pending";
                const isApproved = nom.status === "approved";
                const isRejected = nom.status === "rejected";

                return (
                  <div
                    key={nom.id}
                    className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                      isPending
                        ? "bg-stone-900/90 border-amber-500/40 shadow-lg shadow-amber-950/20"
                        : isApproved
                        ? "bg-stone-900/60 border-emerald-500/30"
                        : "bg-stone-900/40 border-rose-500/30 opacity-80"
                    }`}
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-base ${
                            isPending
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                              : isApproved
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                              : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                          }`}>
                            <UserCheck className="w-5 h-5" />
                          </div>

                          <div>
                            <h4 className="font-bold text-sm text-white font-['Amiri']">{nom.fullName}</h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs font-bold text-amber-400">{nom.tribeName}</span>
                              {nom.fakhdh && (
                                <span className="text-[11px] text-stone-400">• فخذ {nom.fakhdh}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          isPending
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse"
                            : isApproved
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                        }`}>
                          {isPending ? "⏳ قيد المراجعة" : isApproved ? "✅ معتمد رسمياً" : "❌ مرفوض"}
                        </span>
                      </div>

                      {/* Details Box */}
                      <div className="p-3 rounded-2xl bg-stone-950/70 border border-stone-800/80 space-y-1.5 text-xs text-stone-300">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-stone-400 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-emerald-400" />
                            رقم الجوال:
                          </span>
                          <span className="font-mono text-stone-200 font-bold" dir="ltr">{nom.phone}</span>
                        </div>

                        {nom.village && (
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-stone-400">القرية / الإقامة:</span>
                            <span className="text-stone-200">{nom.village}</span>
                          </div>
                        )}

                        {nom.age && (
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-stone-400">العمر:</span>
                            <span className="text-stone-200">{nom.age} عاماً</span>
                          </div>
                        )}

                        {nom.qualifications && (
                          <div className="pt-1.5 border-t border-stone-800 text-[11px] leading-relaxed text-stone-300">
                            <span className="text-stone-400 block mb-0.5">المؤهلات والأسباب:</span>
                            <p className="bg-stone-900/80 p-2 rounded-xl border border-stone-800 text-stone-200 text-[11px]">
                              {nom.qualifications}
                            </p>
                          </div>
                        )}

                        {nom.adminNotes && (
                          <div className="pt-1.5 border-t border-stone-800 text-[11px] text-rose-300">
                            <span className="font-bold">ملاحظات الإدارة:</span> {nom.adminNotes}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons for Pending Nominations */}
                    {isPending ? (
                      <div className="pt-2 border-t border-stone-800 flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedNominationForReject(nom);
                            setRejectReason("");
                          }}
                          className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/30 transition-colors flex items-center gap-1.5"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>رفض الطلب</span>
                        </button>

                        <button
                          onClick={() => handleApproveNomination(nom)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 border border-emerald-400/40 transition-all flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          <span>قبول واعتماد المشرف وتنبيهه فوراً</span>
                        </button>
                      </div>
                    ) : (
                      <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-500">
                        <span>تاريخ الإرسال: {new Date(nom.createdAt).toLocaleDateString("ar-SA")}</span>
                        <span className="font-mono text-[10px] text-stone-600">{nom.id}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ACTIVE SUPERVISORS GRID */}
      {activeSubTab === "active_supervisors" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSupervisors.map(sup => (
            <div
              key={sup.id}
              className="p-5 rounded-3xl bg-stone-900/80 border border-stone-800 hover:border-stone-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-['Amiri']">{sup.name}</h4>
                      <span className="text-[11px] text-emerald-400 font-bold block">{sup.tribeName}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteSupervisor(sup.id, sup.name)}
                    className="p-2 rounded-xl text-stone-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="سحب الصلاحيات وحذف المشرف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 rounded-2xl bg-stone-950/60 border border-stone-800/80 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-stone-400">
                    <span>كود المشرف:</span>
                    <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {sup.supervisorCode}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-stone-400">
                    <span>المسار المخصص:</span>
                    <span className="font-mono text-emerald-400">/admin/tribe</span>
                  </div>
                  <div className="flex items-center justify-between text-stone-400">
                    <span>التحقق بخطوتين:</span>
                    <span className="text-stone-300">{sup.is2FAEnabled ? "🛡️ مفعّل" : "غير مفعّل"}</span>
                  </div>
                </div>

                {/* Villages Scopes */}
                <div className="mt-3">
                  <span className="text-[10px] text-stone-400 block mb-1.5 font-medium">القرى والمعالم التابعة للنطاق:</span>
                  <div className="flex flex-wrap gap-1">
                    {sup.assignedVillages.map((vil, vIdx) => (
                      <span key={vIdx} className="px-2 py-0.5 rounded-md bg-stone-800 text-[10px] text-stone-300">
                        📍 {vil}
                      </span>
                    ))}
                  </div>
                </div>

                {/* FCM Token Status in Firebase Firestore */}
                <div className="mt-3 p-2.5 rounded-xl bg-stone-950/70 border border-stone-800 flex items-center justify-between text-[10px]">
                  <span className="text-stone-400 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-sky-400" />
                    <span>FCM Token في Firebase Firestore:</span>
                  </span>
                  {sup.fcmToken ? (
                    <span className="text-emerald-400 font-mono font-bold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      مرتبط ({sup.fcmToken.substring(0, 8)}...)
                    </span>
                  ) : (
                    <span className="text-amber-400 font-medium bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      بانتظار تسجيل الدخول بالجهاز
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-500">
                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {sup.email}</span>
                <span className="text-emerald-400 font-bold">نشط</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: FCM & FIREBASE INTEGRATION SETTINGS */}
      {activeSubTab === "fcm_settings" && (
        <div className="space-y-6">
          {/* Main Status Hero */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-sky-950/40 via-stone-900 to-stone-950 border border-sky-500/30 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center">
                  <Radio className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white font-['Amiri']">
                    منظومة إشعارات Firebase Cloud Messaging (FCM) & Firebase
                  </h4>
                  <p className="text-xs text-stone-400">
                    استقبال الإشعارات المباشرة في المتصفح وربط معرفات أجهزة المشرفين (FCM Tokens) بجدول profiles في Firebase Firestore
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleRegisterAndSyncFCM}
                  disabled={isRegisteringFCM}
                  className="px-4 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-sky-950/50 transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isRegisteringFCM ? 'animate-spin' : ''}`} />
                  <span>{isRegisteringFCM ? "جاري التفعيل والربط..." : "تفعيل FCM وربط جهاز المشرف الحالي"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendTestPush}
                  disabled={isSendingTestPush}
                  className="px-4 py-2.5 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs flex items-center gap-2 border border-stone-700 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4 text-emerald-400" />
                  <span>إرسال إشعار تجريبي (Test Push)</span>
                </button>
              </div>
            </div>

            {/* FCM Token Live Display */}
            <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-stone-400 font-medium flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-sky-400" />
                  معرف جهاز المشرف الحالي (Active FCM Web Token):
                </span>
                {activeFCMToken ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    مفعل ومربوط مع Firebase Firestore
                  </span>
                ) : (
                  <span className="text-amber-400 font-medium">غير مسجل بعد في هذا المتصفح</span>
                )}
              </div>

              <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 font-mono text-[11px] text-sky-300 break-all select-all">
                {activeFCMToken || "اضغط على زر (تفعيل FCM وربط جهاز المشرف الحالي) لطلب إذن المتصفح واستخراج المعرف"}
              </div>
            </div>
          </div>

          {/* Supervisors & FCM Mapping Table */}
          <div className="p-5 rounded-3xl bg-stone-900/80 border border-stone-800 space-y-4">
            <div className="flex items-center justify-between">
              <h5 className="font-bold text-sm text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>حالة ربط الـ FCM Token لكل مشرف في جدول profiles (Firebase)</span>
              </h5>
              <span className="text-xs text-stone-400">
                إجمالي المشرفين: {supervisors.length}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-stone-800 text-stone-400">
                    <th className="pb-3 pr-2 font-medium">المشرف</th>
                    <th className="pb-3 font-medium">القبيلة / النطاق</th>
                    <th className="pb-3 font-medium">كود المشرف</th>
                    <th className="pb-3 font-medium">الجوال</th>
                    <th className="pb-3 font-medium">معرف الـ FCM Token في Firebase Firestore</th>
                    <th className="pb-3 font-medium">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60">
                  {supervisors.map((s) => (
                    <tr key={s.id} className="hover:bg-stone-950/40">
                      <td className="py-3 pr-2 font-bold text-white font-['Amiri']">{s.name}</td>
                      <td className="py-3 text-stone-300">{s.tribeName}</td>
                      <td className="py-3">
                        <span className="font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px]">
                          {s.supervisorCode}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-stone-400">{s.phone}</td>
                      <td className="py-3">
                        {s.fcmToken ? (
                          <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[10px]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span className="truncate max-w-[180px]">{s.fcmToken}</span>
                          </div>
                        ) : (
                          <span className="text-stone-500 text-[11px]">لم يتم تسجيل جهاز بعد</span>
                        )}
                      </td>
                      <td className="py-3">
                        <button
                          onClick={async () => {
                            if (activeFCMToken) {
                              await DataStore.linkSupervisorFCMToken(s.id, activeFCMToken);
                              await DataStore.linkSupervisorFCMToken(s.phone, activeFCMToken);
                              await DataStore.linkSupervisorFCMToken(s.supervisorCode, activeFCMToken);
                              setSupervisors(DataStore.getSupervisorAccounts());
                              onNotification(`تم ربط توكن الجهاز الحالي بحساب المشرف [${s.name}] في Firebase Firestore!`);
                            } else {
                              handleRegisterAndSyncFCM();
                            }
                          }}
                          className="px-2.5 py-1 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] font-bold transition-all"
                        >
                          ربط توكن جهازي
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Database Schema Sync Information */}
          <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800/80 space-y-2 text-xs text-stone-400">
            <h6 className="font-bold text-stone-300 flex items-center gap-1.5 text-xs">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>مخطط الأعمدة المضافة في جدول profiles بـ Firebase:</span>
            </h6>
            <pre className="p-3 rounded-xl bg-stone-900 font-mono text-[11px] text-emerald-400 overflow-x-auto text-left dir-ltr">
{`ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS fcm_token VARCHAR(255),
  ADD COLUMN IF NOT EXISTS fcm_tokens TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS last_fcm_sync_at TIMESTAMPTZ;`}
            </pre>
          </div>
        </div>
      )}

      {/* REJECT NOMINATION MODAL WITH REASON */}
      {selectedNominationForReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-stone-900 border border-stone-700 rounded-3xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center gap-3 border-b border-stone-800 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-['Amiri']">
                  رفض طلب ترشيح: {selectedNominationForReject.fullName}
                </h4>
                <p className="text-[11px] text-stone-400">سيتم إرسال إشعار فوري (Firebase Push) للمتقدم بقرار الرفض والملاحظات</p>
              </div>
            </div>

            <div>
              <label className="block text-stone-300 mb-1.5 font-medium">
                سبب الرفض أو ملاحظات التوجيه (اختياري - ستصل للمتقدم):
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="مثال: يرجى استكمال شجرة أنساب الفخذ أولاً، أو تم تعيين مشرف مسبقاً لهذه القبيلة..."
                className="w-full p-3 rounded-2xl bg-stone-950 border border-stone-700 text-white text-xs placeholder-stone-600 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedNominationForReject(null)}
                className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 hover:text-white"
              >
                تراجع
              </button>
              <button
                type="button"
                onClick={handleRejectNominationSubmit}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>تأكيد الرفض وإرسال الإشعار</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD SUPERVISOR MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-stone-900 border border-stone-700 rounded-3xl p-6 shadow-2xl space-y-4 text-xs">
            <h4 className="text-base font-bold text-white font-['Amiri'] flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-400" />
              <span>تعيين مشرف قبيلة جديد مع تحديد النطاق</span>
            </h4>

            <form onSubmit={handleAddSupervisor} className="space-y-3">
              <div>
                <label className="block text-stone-300 mb-1 font-medium">اسم المشرف الرباعي</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="الشيخ / الأستاذ ..."
                  className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">البريد الإلكتروني</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="supervisor@banishahr.sa"
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">رقم الجوال</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0500000000"
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">القبيلة المسندة</label>
                  <input
                    type="text"
                    required
                    value={tribeName}
                    onChange={(e) => setTribeName(e.target.value)}
                    placeholder="قبيلة آل وليد"
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">كود المشرف</label>
                  <input
                    type="text"
                    required
                    value={supervisorCode}
                    onChange={(e) => setSupervisorCode(e.target.value.toUpperCase())}
                    placeholder="AQIQAH-88"
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-medium">القرى والمعالم التابعة (مفصولة بفاصلة)</label>
                <input
                  type="text"
                  value={villagesText}
                  onChange={(e) => setVillagesText(e.target.value)}
                  placeholder="قرية العقيقة، حصن العقيقة، آل قاسم"
                  className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px]">
                🛡️ سيتم توجيه هذا المشرف تلقائياً إلى مسار <strong>/admin/tribe</strong> ولن يستطيع الوصول إلا لبيانات قبيلته بموجب RLS.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  اعتماد وتعيين
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

