import React, { useState } from "react";
import { UserProfile } from "../types";
import { DataStore } from "../lib/datastore";
import { auth, googleProvider } from "../lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { PrivacyPolicyModal } from "./PrivacyPolicyModal";
import { 
  X, 
  Phone, 
  ShieldCheck, 
  User, 
  KeyRound, 
  CheckCircle2, 
  Sparkles,
  Compass,
  Utensils,
  Lock,
  Building,
  Key,
  Award,
  LogIn,
  LogOut,
  AlertCircle
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUserUpdated: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserUpdated,
}) => {
  const [authMode, setAuthMode] = useState<"phone" | "supervisor_code">("phone");
  const [step, setStep] = useState<"phone" | "otp" | "role">("phone");
  const [phone, setPhone] = useState(currentUser.phone || "0501234567");
  const [name, setName] = useState(currentUser.name || "ضيف بني شهر");
  const [selectedRole, setSelectedRole] = useState<UserProfile["role"]>(currentUser.role || "visitor");
  const [supervisorCodeInput, setSupervisorCodeInput] = useState("AQIQAH-77");
  const [selectedVillageId, setSelectedVillageId] = useState<string>("vil-al-aqiqah");
  const [otpCode, setOtpCode] = useState("1234");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hasAgreedPrivacy, setHasAgreedPrivacy] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  if (!isOpen) return null;

  const villages = DataStore.getVillages();

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasAgreedPrivacy) {
      setErrorMsg("يجب الموافقة على سياسة الخصوصية للمتابعة");
      return;
    }
    if (!phone || phone.length < 9) {
      setErrorMsg("يرجى إدخال رقم جوال صحيح");
      return;
    }
    setErrorMsg(null);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep("otp");
    }, 500);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasAgreedPrivacy) {
      setErrorMsg("يجب الموافقة على سياسة الخصوصية للمتابعة");
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep("role");
    }, 500);
  };

  const handleSupervisorCodeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasAgreedPrivacy) {
      setErrorMsg("يجب الموافقة على سياسة الخصوصية للمتابعة");
      return;
    }
    const code = supervisorCodeInput.trim().toUpperCase();
    const matchedVillage = villages.find(v => v.supervisorCode && v.supervisorCode.toUpperCase() === code);

    if (matchedVillage) {
      const supervisorProfile: UserProfile = {
        id: matchedVillage.supervisorId || "usr-sup-" + matchedVillage.id,
        name: matchedVillage.supervisorName || `مشرف ${matchedVillage.name}`,
        phone: matchedVillage.supervisorPhone || "0505123456",
        role: "village_supervisor",
        city: matchedVillage.region,
        isVerified: true,
        assignedVillageId: matchedVillage.id,
        assignedVillageName: matchedVillage.name,
        assignedRegion: matchedVillage.region,
        supervisorCode: matchedVillage.supervisorCode,
        subscriptionPlan: matchedVillage.subscriptionTier === "pro_annual" ? "annual" : "monthly",
        subscriptionStatus: "active",
        permissions: ["manage_village_content", "publish_events", "edit_castles", "view_village_stats"]
      };

      DataStore.setCurrentUser(supervisorProfile);
      onUserUpdated(supervisorProfile);
      onClose();
    } else {
      setErrorMsg("كود المشرف غير صحيح. جرب AQIQAH-77 أو MADANAH-99");
    }
  };

  const handleSaveProfile = () => {
    if (!hasAgreedPrivacy) {
      setErrorMsg("يجب الموافقة على سياسة الخصوصية للمتابعة");
      return;
    }
    let villageName = undefined;
    if (selectedRole === "village_supervisor") {
      const v = villages.find(vil => vil.id === selectedVillageId);
      villageName = v?.name;
    }

    const updatedUser: UserProfile = {
      ...currentUser,
      name,
      phone,
      role: selectedRole,
      isVerified: true,
      assignedVillageId: selectedRole === "village_supervisor" ? selectedVillageId : undefined,
      assignedVillageName: villageName,
      supervisorCode: selectedRole === "village_supervisor" ? (selectedVillageId.includes("aqiqah") ? "AQIQAH-77" : "MADANAH-99") : undefined,
      subscriptionPlan: "annual",
      subscriptionStatus: "active"
    };

    DataStore.setCurrentUser(updatedUser);
    onUserUpdated(updatedUser);
    onClose();
  };

  const handleGoogleSignIn = async () => {
    if (!hasAgreedPrivacy) {
      setErrorMsg("يجب الموافقة على سياسة الخصوصية للمتابعة");
      return;
    }
    try {
      setIsProcessing(true);
      setErrorMsg(null);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const updatedUser: UserProfile = {
        ...currentUser,
        id: user.uid,
        name: user.displayName || name,
        email: user.email || undefined,
        isVerified: true,
        role: user.email === 'aaattr2005@gmail.com' ? 'admin' : (currentUser.role || 'visitor'),
      };

      DataStore.setCurrentUser(updatedUser);
      onUserUpdated(updatedUser);
      setIsProcessing(false);
      onClose();
    } catch (err: any) {
      console.error("Firebase Google Auth Error:", err);
      setIsProcessing(false);
      setErrorMsg(err?.message || "تعذر تسجيل الدخول بواسطة Google");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-stone-900 border border-stone-700/80 rounded-3xl shadow-2xl overflow-hidden font-['IBM_Plex_Sans_Arabic',sans-serif]">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-950 via-stone-900 to-stone-900 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-['Amiri']">تسجيل الدخول / إنشاء حساب</h3>
              <p className="text-[11px] text-stone-400">نظام توثيق المشرفين والزوار والمقدمين</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-2 bg-stone-950 border-b border-stone-800 gap-1.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setAuthMode("phone");
              setErrorMsg(null);
            }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              authMode === "phone"
                ? "bg-emerald-900/60 border border-emerald-500/40 text-emerald-300"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>دخول برقم الجوال</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode("supervisor_code");
              setErrorMsg(null);
            }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              authMode === "supervisor_code"
                ? "bg-amber-900/60 border border-amber-500/40 text-amber-300"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>كود مشرف قرية</span>
          </button>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Body based on step */}
        <div className="p-6">
          
          {/* Privacy Policy Mandatory Agreement Checkbox */}
          <div className="mb-4">
            <label 
              className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                hasAgreedPrivacy 
                  ? "bg-emerald-950/30 border-emerald-500/40 text-stone-200" 
                  : "bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700"
              }`}
            >
              <input
                type="checkbox"
                checked={hasAgreedPrivacy}
                onChange={(e) => {
                  setHasAgreedPrivacy(e.target.checked);
                  if (e.target.checked) setErrorMsg(null);
                }}
                className="mt-0.5 w-4 h-4 rounded border-stone-700 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-stone-900 accent-emerald-600 cursor-pointer"
                id="checkbox-agree-privacy-auth-modal"
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
                <span> واستخدام بياناتي المسجلة لتشغيل الحساب والتنبيهات.</span>
              </div>
            </label>
          </div>

          {/* SUPERVISOR CODE LOGIN */}
          {authMode === "supervisor_code" ? (
            <form onSubmit={handleSupervisorCodeLogin} className="space-y-4">
              <p className="text-xs text-stone-300 leading-relaxed">
                إذا كنت مشرفاً معتمداً لإحدى قرى بني شهر، أدخل كود الدخول الخاص بقريتك للوصول الفوري للوحة التحكم وإدارة محتوى قريتك.
              </p>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  كود الدخول المخصص للقرية
                </label>
                <input
                  type="text"
                  value={supervisorCodeInput}
                  onChange={(e) => setSupervisorCodeInput(e.target.value.toUpperCase())}
                  placeholder="مثال: AQIQAH-77 أو MADANAH-99"
                  required
                  className="w-full px-3.5 py-3 rounded-xl bg-stone-950 border border-stone-700 text-amber-300 text-sm font-mono font-bold focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-[11px] text-stone-400 space-y-1">
                <span className="text-stone-300 font-bold block">أكواد تجريبية جاهزة للمعاينة:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSupervisorCodeInput("AQIQAH-77")}
                    className="px-2 py-1 rounded bg-stone-900 border border-stone-700 text-amber-400 font-mono text-[10px] hover:border-amber-500"
                  >
                    AQIQAH-77 (قرية العقيقة)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSupervisorCodeInput("MADANAH-99")}
                    className="px-2 py-1 rounded bg-stone-900 border border-stone-700 text-amber-400 font-mono text-[10px] hover:border-amber-500"
                  >
                    MADANAH-99 (قرية المدانة)
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={!hasAgreedPrivacy || isProcessing}
                className={`w-full py-3 rounded-xl font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 ${
                  hasAgreedPrivacy
                    ? "bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 hover:from-amber-500 hover:to-amber-400 cursor-pointer"
                    : "bg-stone-800 text-stone-500 cursor-not-allowed opacity-60"
                }`}
              >
                <Key className="w-4 h-4" />
                <span>دخول لوحة مشرف القرية</span>
              </button>
            </form>
          ) : (
            <>
              {/* STEP 1: Phone input */}
              {step === "phone" && (
                <div className="space-y-4">
                  {/* Google Login via Firebase */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={!hasAgreedPrivacy || isProcessing}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2.5 border ${
                      hasAgreedPrivacy
                        ? "bg-white hover:bg-stone-100 text-stone-900 border-stone-300 active:scale-[0.99] cursor-pointer"
                        : "bg-stone-800/70 text-stone-500 border-stone-700/60 cursor-not-allowed opacity-60"
                    }`}
                    title={!hasAgreedPrivacy ? "يرجى الموافقة على سياسة الخصوصية أولاً" : "الدخول بحساب Google"}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>الدخول بحساب Google (Firebase Auth)</span>
                  </button>

                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-stone-800"></div>
                    <span className="flex-shrink mx-3 text-[11px] text-stone-400 font-medium">أو عبر رقم الجوال</span>
                    <div className="flex-grow border-t border-stone-800"></div>
                  </div>

                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <p className="text-xs text-stone-300 leading-relaxed">
                      أدخل رقم الجوال لتسجيل الدخول السريع عبر رمز التحقق (OTP) أو إدارة حسابك وخدماتك.
                    </p>

                    <div>
                      <label className="block text-xs font-medium text-stone-300 mb-1.5 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        رقم الجوال
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="05XXXXXXXX"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white text-sm focus:border-emerald-500 focus:outline-none font-mono"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!hasAgreedPrivacy || isProcessing}
                      className={`w-full py-3 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 ${
                        hasAgreedPrivacy
                          ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white hover:from-emerald-500 hover:to-teal-600 cursor-pointer"
                          : "bg-stone-800 text-stone-500 cursor-not-allowed opacity-60"
                      }`}
                    >
                      {isProcessing ? "جاري الإرسال..." : "إرسال رمز التحقق (SMS)"}
                    </button>
                  </form>
                </div>
              )}

              {/* STEP 2: OTP verification */}
              {step === "otp" && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="text-center space-y-1">
                    <span className="text-xs text-stone-400">تم إرسال رمز التحقق إلى</span>
                    <span className="text-sm font-mono font-bold text-emerald-400 block">{phone}</span>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1.5 flex items-center justify-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                      أدخل رمز التحقق (رمز تجريبي: 1234)
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full text-center px-4 py-3 rounded-xl bg-stone-950 border border-stone-700 text-white text-xl tracking-widest font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!hasAgreedPrivacy || isProcessing}
                    className={`w-full py-3 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 ${
                      hasAgreedPrivacy
                        ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-500 hover:to-amber-600 cursor-pointer"
                        : "bg-stone-800 text-stone-500 cursor-not-allowed opacity-60"
                    }`}
                  >
                    {isProcessing ? "جاري التحقق..." : "تأكيد الدخول"}
                  </button>
                </form>
              )}

              {/* STEP 3: Role & Name Selection */}
              {step === "role" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">الاسم الكامل</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white text-sm focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-2">نوع الحساب / الدور في المنصة:</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "visitor", name: "زائر وسائح", icon: User },
                        { id: "village_supervisor", name: "مشرف قرية", icon: Building },
                        { id: "tour_guide", name: "مرشد سياحي", icon: Compass },
                        { id: "food_seller", name: "أسرة منتجة / متجر", icon: Utensils },
                        { id: "admin", name: "مدير النظام (Admin)", icon: Lock },
                      ].map((r) => {
                        const Icon = r.icon;
                        return (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => setSelectedRole(r.id as any)}
                            className={`p-3 rounded-xl border text-xs font-medium transition-all text-right flex items-center gap-2 ${
                              selectedRole === r.id
                                ? "bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-950"
                                : "bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700"
                            }`}
                          >
                            <Icon className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>{r.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {selectedRole === "village_supervisor" && (
                    <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 space-y-1.5">
                      <label className="block text-[11px] font-bold text-amber-300">القرية المخصصة للإشراف:</label>
                      <select
                        value={selectedVillageId}
                        onChange={(e) => setSelectedVillageId(e.target.value)}
                        className="w-full p-2 rounded-lg bg-stone-900 border border-stone-700 text-xs text-white"
                      >
                        {villages.map(v => (
                          <option key={v.id} value={v.id}>{v.name} ({v.region})</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={!hasAgreedPrivacy}
                    className={`w-full py-3 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 ${
                      hasAgreedPrivacy
                        ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white hover:from-emerald-500 hover:to-teal-600 cursor-pointer"
                        : "bg-stone-800 text-stone-500 cursor-not-allowed opacity-60"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>حفظ الملف وبدء الجلسة</span>
                  </button>
                </div>
              )}
            </>
          )}

        </div>

      </div>

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        onAccept={() => {
          setHasAgreedPrivacy(true);
          setShowPrivacyModal(false);
          setErrorMsg(null);
        }}
        showAcceptButton={!hasAgreedPrivacy}
      />
    </div>
  );
};
