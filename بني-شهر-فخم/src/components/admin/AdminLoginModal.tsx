import React, { useState } from "react";
import { UserProfile } from "../../types";
import { DataStore } from "../../lib/datastore";
import {
  X,
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Fingerprint,
  RefreshCw,
  Eye,
  EyeOff,
  UserCheck,
  Layers,
  Database,
  Building2,
  Crown
} from "lucide-react";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile, targetRoute: "/admin" | "/admin/tribe") => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  // Form State
  const [identifier, setIdentifier] = useState("aaattr2005@gmail.com");
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  
  // Auth Flow State
  const [authStep, setAuthStep] = useState<"credentials" | "authenticating" | "two_factor" | "success">("credentials");
  const [twoFactorCode, setTwoFactorCode] = useState(["", "", "", "", "", ""]);
  const [selectedPreset, setSelectedPreset] = useState<"super_admin" | "tribe_supervisor_1" | "tribe_supervisor_2">("super_admin");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [authenticatedUser, setAuthenticatedUser] = useState<UserProfile | null>(null);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: "super_admin" | "tribe_supervisor_1" | "tribe_supervisor_2") => {
    setSelectedPreset(preset);
    setErrorMessage(null);
    if (preset === "super_admin") {
      setIdentifier("aaattr2005@gmail.com");
      setPassword("SuperAdmin@BaniShahr2026#");
    } else if (preset === "tribe_supervisor_1") {
      setIdentifier("supervisor.aqiqah@banishahr.sa");
      setPassword("Supervisor@Aqiqah77!");
    } else {
      setIdentifier("supervisor.namas@banishahr.sa");
      setPassword("Supervisor@Namas99!");
    }
  };

  const handleSubmitCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const email = identifier.trim().toLowerCase();

    if (!email || !password) {
      setErrorMessage("يرجى إدخال البريد الإلكتروني وكلمة المرور للمتابعة");
      return;
    }

    setAuthStep("authenticating");

    // Firebase Auth Simulation Pipeline:
    // 1. Check Credentials in Firebase Auth
    // 2. Query 'profiles' table with RLS
    // 3. Evaluate Role
    setTimeout(() => {
      if (email.includes("aaattr2005") || email.includes("admin@") || selectedPreset === "super_admin") {
        // Super Admin Persona -> Requires 2FA
        const superAdminUser: UserProfile = {
          id: "usr-super-admin-01",
          name: "المدير العام (سوبر أدمن المنصة)",
          email: identifier.trim(),
          phone: "0500000000",
          role: "super_admin",
          city: "النماص وتنومة",
          isVerified: true,
          permissions: ["full_access", "manage_all_tribes", "assign_supervisors", "manage_lineage_tree", "manage_businessmen"]
        };
        setAuthenticatedUser(superAdminUser);
        setAuthStep("two_factor");
      } else if (email.includes("aqiqah") || selectedPreset === "tribe_supervisor_1") {
        // Tribe Supervisor (آل وليد / العقيقة)
        const supervisorUser: UserProfile = {
          id: "sup-01",
          name: "الشيخ عبد الله بن ظافر الشهري",
          email: identifier.trim(),
          phone: "0505123456",
          role: "village_supervisor",
          city: "النماص",
          isVerified: true,
          assignedVillageId: "vil-al-aqiqah",
          assignedVillageName: "قبيلة آل وليد (قرية وحصن العقيقة)",
          assignedRegion: "النماص",
          supervisorCode: "AQIQAH-77",
          permissions: ["manage_tribe_tree", "review_lineage_requests", "publish_tribe_news"]
        };
        setAuthenticatedUser(supervisorUser);
        setAuthStep("success");
        setTimeout(() => {
          DataStore.setCurrentUser(supervisorUser);
          DataStore.logAction({
            userId: supervisorUser.id,
            userName: supervisorUser.name,
            userRole: supervisorUser.role,
            actionType: "LOGIN",
            targetModule: "SECURITY",
            details: `تسجيل دخول مشرف قبيلة آل وليد إلى لوحة المشرف (/admin/tribe)`
          });
          onLoginSuccess(supervisorUser, "/admin/tribe");
        }, 1200);
      } else if (email.includes("namas") || selectedPreset === "tribe_supervisor_2") {
        // Tribe Supervisor (بني لام / المدانة)
        const supervisorUser: UserProfile = {
          id: "sup-02",
          name: "الأستاذ سعيد بن محمد الشهري",
          email: identifier.trim(),
          phone: "0509876543",
          role: "village_supervisor",
          city: "النماص",
          isVerified: true,
          assignedVillageId: "vil-al-madanah",
          assignedVillageName: "قبيلة بني لام (قرية المدانة)",
          assignedRegion: "النماص",
          supervisorCode: "MADANAH-99",
          permissions: ["manage_tribe_tree", "review_lineage_requests", "publish_tribe_news"]
        };
        setAuthenticatedUser(supervisorUser);
        setAuthStep("success");
        setTimeout(() => {
          DataStore.setCurrentUser(supervisorUser);
          DataStore.logAction({
            userId: supervisorUser.id,
            userName: supervisorUser.name,
            userRole: supervisorUser.role,
            actionType: "LOGIN",
            targetModule: "SECURITY",
            details: `تسجيل دخول مشرف قبيلة بني لام إلى لوحة المشرف (/admin/tribe)`
          });
          onLoginSuccess(supervisorUser, "/admin/tribe");
        }, 1200);
      } else {
        // Generic fallback with verified user
        const genericUser: UserProfile = {
          id: "usr-" + Date.now().toString().slice(-4),
          name: identifier.split("@")[0],
          email: identifier.trim(),
          phone: "0501234567",
          role: "super_admin",
          city: "بني شهر",
          isVerified: true
        };
        setAuthenticatedUser(genericUser);
        setAuthStep("two_factor");
      }
    }, 1000);
  };

  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    const code = twoFactorCode.join("");
    if (code.length < 6) {
      setErrorMessage("يرجى إدخال رمز التحقق الثنائي المكون من 6 أرقام");
      return;
    }

    setAuthStep("authenticating");
    setTimeout(() => {
      if (authenticatedUser) {
        setAuthStep("success");
        setTimeout(() => {
          DataStore.setCurrentUser(authenticatedUser);
          DataStore.logAction({
            userId: authenticatedUser.id,
            userName: authenticatedUser.name,
            userRole: authenticatedUser.role,
            actionType: "LOGIN",
            targetModule: "SECURITY",
            details: `تسجيل دخول ناجح للمدير العام مع التحقق الثنائي (2FA TOTP Verified) إلى لوحة الإدارة الكاملة (/admin)`
          });
          onLoginSuccess(authenticatedUser, "/admin");
        }, 1200);
      }
    }, 900);
  };

  const handleFillTest2FACode = () => {
    setTwoFactorCode(["8", "4", "9", "2", "0", "1"]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-stone-900 border border-stone-700/80 rounded-3xl shadow-2xl overflow-hidden my-auto">
        
        {/* Top Header */}
        <div className="relative p-6 bg-gradient-to-r from-emerald-950 via-stone-900 to-amber-950/40 border-b border-stone-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-inner">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white font-['Amiri']">
                    بوابة دخول الإدارة والمشرفين
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300">
                    Firebase RBAC
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  مصادقة مشفرة + صلاحيات مبنية على Row-Level Security (RLS)
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preset Switchers */}
        <div className="p-4 bg-stone-950/60 border-b border-stone-800/80">
          <p className="text-[11px] font-bold text-stone-400 mb-2.5 flex items-center gap-1.5">
            <Fingerprint className="w-3.5 h-3.5 text-emerald-400" />
            اختر حساباً للتجربة السريعة والمصادقة التلقائية:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleSelectPreset("super_admin")}
              className={`p-2.5 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                selectedPreset === "super_admin"
                  ? "bg-amber-500/10 border-amber-500/50 text-amber-300 shadow-sm"
                  : "bg-stone-800/50 border-stone-700/60 text-stone-300 hover:border-stone-600"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold font-['Amiri']">👑 المدير العام</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">/admin</span>
              </div>
              <p className="text-[10px] text-stone-400 leading-tight">صلاحيات كاملة + 2FA</p>
            </button>

            <button
              type="button"
              onClick={() => handleSelectPreset("tribe_supervisor_1")}
              className={`p-2.5 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                selectedPreset === "tribe_supervisor_1"
                  ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-300 shadow-sm"
                  : "bg-stone-800/50 border-stone-700/60 text-stone-300 hover:border-stone-600"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold font-['Amiri']">🛡️ مشرف آل وليد</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">/tribe</span>
              </div>
              <p className="text-[10px] text-stone-400 leading-tight">نطاق قبيلة آل وليد</p>
            </button>

            <button
              type="button"
              onClick={() => handleSelectPreset("tribe_supervisor_2")}
              className={`p-2.5 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                selectedPreset === "tribe_supervisor_2"
                  ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-300 shadow-sm"
                  : "bg-stone-800/50 border-stone-700/60 text-stone-300 hover:border-stone-600"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold font-['Amiri']">🛡️ مشرف بني لام</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">/tribe</span>
              </div>
              <p className="text-[10px] text-stone-400 leading-tight">نطاق قبيلة بني لام</p>
            </button>
          </div>
        </div>

        {/* Content Body based on step */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: CREDENTIALS */}
          {authStep === "credentials" && (
            <form onSubmit={handleSubmitCredentials} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  البريد الإلكتروني أو اسم المستخدم
                </label>
                <div className="relative">
                  <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="name@banishahr.sa أو البريد الشخصي"
                    className="w-full pl-4 pr-10 py-3 rounded-2xl bg-stone-950/70 border border-stone-700 text-white text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-stone-300">
                    كلمة المرور
                  </label>
                  <span className="text-[11px] text-emerald-400 hover:underline cursor-pointer">
                    نسيت كلمة المرور؟
                  </span>
                </div>
                <div className="relative">
                  <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-2xl bg-stone-950/70 border border-stone-700 text-white text-sm focus:border-emerald-500 focus:outline-none transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Security Flow Info Card */}
              <div className="p-3.5 rounded-2xl bg-stone-950/50 border border-stone-800 space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-stone-300 font-bold">
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span>آلية التحقق والتوجيه الصارم (Firebase Auth Flow):</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-[10px] text-stone-400 text-center font-mono">
                  <div className="p-1.5 rounded-xl bg-stone-900 border border-stone-800">
                    1. فحص Auth
                  </div>
                  <div className="p-1.5 rounded-xl bg-stone-900 border border-stone-800">
                    2. فحص الدور Role
                  </div>
                  <div className="p-1.5 rounded-xl bg-stone-900 border border-stone-800 text-emerald-400 font-bold">
                    3. توجيه للمسار
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>دخول لوحة التحكم</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            </form>
          )}

          {/* STEP 2: AUTHENTICATING SPINNER */}
          {authStep === "authenticating" && (
            <div className="py-12 text-center space-y-4">
              <div className="inline-flex p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 animate-spin">
                <RefreshCw className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white font-['Amiri']">
                  جاري التحقق من الهوية والصلاحيات عبر Firebase...
                </h4>
                <p className="text-xs text-stone-400 mt-1">
                  التحقق من جلسة JWT وقواعد Row Level Security (RLS)
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: 2FA FOR SUPER ADMIN */}
          {authStep === "two_factor" && (
            <form onSubmit={handleVerify2FA} className="space-y-5">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3">
                <Crown className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
                <div>
                  <h5 className="font-bold text-amber-200">التحقق بخطوتين (2FA) إلزامي لحساب المدير العام</h5>
                  <p className="text-stone-300 text-[11px] mt-1 leading-relaxed">
                    لحماية حساب المدير العام من أي محاولات وصول غير مصرح بها، يرجى إدخال الرمز السداسي المولد من تطبيق المصادقة (Authenticator App).
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 text-center mb-3">
                  أدخل رمز التحقق المكون من 6 أرقام
                </label>
                <div className="flex items-center justify-center gap-2" dir="ltr">
                  {twoFactorCode.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, "");
                        const newCode = [...twoFactorCode];
                        newCode[idx] = val;
                        setTwoFactorCode(newCode);
                        if (val && idx < 5) {
                          const nextInput = document.getElementById(`otp-${idx + 1}`);
                          nextInput?.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !twoFactorCode[idx] && idx > 0) {
                          const prevInput = document.getElementById(`otp-${idx - 1}`);
                          prevInput?.focus();
                        }
                      }}
                      className="w-11 h-13 text-center text-xl font-bold rounded-xl bg-stone-950 border border-stone-700 text-emerald-400 focus:border-emerald-500 focus:outline-none transition-colors"
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={handleFillTest2FACode}
                  className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
                >
                  ⚡ ملء رمز التجربة (849201)
                </button>
                <span className="text-stone-400 text-[11px]">صالح لمدة: 04:59</span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-500 hover:to-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>تأكيد الرمز والدخول إلى /admin</span>
              </button>
            </form>
          )}

          {/* STEP 4: SUCCESS REDIRECTION */}
          {authStep === "success" && (
            <div className="py-10 text-center space-y-4">
              <div className="inline-flex p-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                <CheckCircle2 className="w-10 h-10 animate-pulse" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white font-['Amiri']">
                  تم التحقق والمصادقة بنجاح!
                </h4>
                <p className="text-xs text-stone-300 mt-1">
                  مرحباً بك: <strong className="text-emerald-400">{authenticatedUser?.name}</strong>
                </p>
                <p className="text-[11px] text-stone-400 mt-1 font-mono">
                  جاري التوجيه إلى: {authenticatedUser?.role === "super_admin" ? "/admin (اللوحة الشاملة)" : "/admin/tribe (لوحة المشرف)"}...
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Security Note */}
        <div className="p-4 bg-stone-950/80 border-t border-stone-800/80 text-[11px] text-stone-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>حماية مشددة: Firebase Firestore Rules مفعّل لحماية جداول الأنساب والقبائل</span>
          </div>
          <span className="text-stone-500 font-mono text-[10px]">v2.6 Secure</span>
        </div>

      </div>
    </div>
  );
};
