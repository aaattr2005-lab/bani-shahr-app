import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Users,
  Phone,
  User,
  MapPin,
  FileText,
  Sparkles,
  Award,
  Check,
  Send,
  Building,
  GraduationCap
} from "lucide-react";
import { DETAILED_TRIBES } from "../data/tribesData";
import { db } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { pushNotificationService } from "../lib/pushNotifications";
import { SupervisorNominationData } from "../types";
import { AppStorage } from "../lib/nativeStorage";

interface SupervisorNominationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTribeId?: string;
  onSuccessSubmitted?: (data: { name: string; tribeName: string; id: string; timestamp: string }) => void;
}

export const SupervisorNominationModal: React.FC<SupervisorNominationModalProps> = ({
  isOpen,
  onClose,
  defaultTribeId,
  onSuccessSubmitted
}) => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [tribeId, setTribeId] = useState(defaultTribeId || DETAILED_TRIBES[0]?.id || "shahr-tharameen");
  const [fakhdh, setFakhdh] = useState("");
  const [village, setVillage] = useState("");
  const [age, setAge] = useState("");
  const [qualification, setQualification] = useState("");
  const [roles, setRoles] = useState<string[]>([
    "توثيق شجرة الأنساب وتحديث الفخوذ",
    "نشر مناسبات وأعراس واجتماعات القبيلة"
  ]);
  const [reason, setReason] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    id: string;
    fullName: string;
    tribeName: string;
    date: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  React.useEffect(() => {
    if (isOpen && defaultTribeId) {
      setTribeId(defaultTribeId);
      setIsSuccess(false);
      setErrorMessage("");
    }
  }, [isOpen, defaultTribeId]);

  if (!isOpen) return null;

  const roleOptions = [
    "توثيق شجرة الأنساب وتحديث الفخوذ",
    "نشر مناسبات وأعراس واجتماعات القبيلة",
    "توثيق قصص وتاريخ وتراث الأجداد (ذاكرة القبيلة)",
    "إدارة الصناديق والمبادرات التكافلية للقبيلة",
    "الرد على استفسارات أفراد القبيلة وتحديث بياناتهم"
  ];

  const handleRoleToggle = (role: string) => {
    if (roles.includes(role)) {
      setRoles(roles.filter(r => r !== role));
    } else {
      setRoles([...roles, role]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!fullName.trim() || !phone.trim() || !tribeId) {
      setErrorMessage("يرجى تعبئة الاسم الرباعي ورقم الجوال واختيار القبيلة.");
      return;
    }

    if (!agreedToTerms) {
      setErrorMessage("يرجى الموافقة على إقرار الأمانة والدقة في توثيق ونشر بيانات القبيلة.");
      return;
    }

    setIsSubmitting(true);
    const targetTribe = DETAILED_TRIBES.find(t => t.id === tribeId);
    const tribeName = targetTribe?.name || tribeId;
    const nominationId = "sup-nom-" + Date.now();
    const currentDateFormatted = new Date().toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    const nominationRecord: SupervisorNominationData = {
      id: nominationId,
      fullName: fullName.trim(),
      phone: phone.trim(),
      tribeId: tribeId,
      tribeName: tribeName,
      fakhdh: fakhdh.trim(),
      village: village.trim(),
      age: age.trim(),
      qualifications: qualification.trim() + (roles.length > 0 ? " | مجالات الإشراف: " + roles.join("، ") : "") + (reason.trim() ? " | " + reason.trim() : ""),
      status: "pending",
      createdAt: new Date().toISOString()
    };

    try {
      // 1. Save to Firebase Firestore
      await addDoc(collection(db, "supervisor_nominations"), nominationRecord);
    } catch (err) {
      console.warn("Firestore save warning (fallback to local):", err);
    }

    // 2. Trigger Firebase Push Notification to Supervisors & Admins
    try {
      await pushNotificationService.sendNewNominationPushToSupervisors(nominationRecord);
    } catch (pushErr) {
      console.warn("Push notification warning:", pushErr);
    }

    // 3. Save to native storage for quick access & application badge
    try {
      AppStorage.setItem("bani_shahr_last_nomination", JSON.stringify({
        id: nominationId,
        name: fullName.trim(),
        tribeName: tribeName,
        timestamp: currentDateFormatted
      }));

      const existingNominations = JSON.parse(AppStorage.getItem("bani_shahr_all_nominations") || "[]");
      existingNominations.unshift(nominationRecord);
      AppStorage.setItem("bani_shahr_all_nominations", JSON.stringify(existingNominations));
    } catch (err) {
      console.error(err);
    }

    setSubmittedData({
      id: nominationId,
      fullName: fullName.trim(),
      tribeName: tribeName,
      date: currentDateFormatted
    });

    if (onSuccessSubmitted) {
      onSuccessSubmitted({
        name: fullName.trim(),
        tribeName: tribeName,
        id: nominationId,
        timestamp: currentDateFormatted
      });
    }

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setSubmittedData(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[94vh] flex flex-col bg-[#12201A] border border-[#7C9D86]/40 rounded-3xl shadow-2xl overflow-hidden text-[#F8F4EA] font-['IBM_Plex_Sans_Arabic']">
        
        {/* Al-Qatt Al-Asiri Decorative Top Strip */}
        <div className="qatt-asiri-header-strip" />

        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-[#12201A] via-[#1B2B22] to-[#12201A] border-b border-[#7C9D86]/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C7A25C] to-[#9C4A38] flex items-center justify-center text-[#F8F4EA] shadow-lg shadow-black/40 border border-[#D8BE8B]/40">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold font-['Markazi_Text'] text-[#F8F4EA]">
                  تسجيل وترشيح مشرف القبيلة
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#C7A25C]/20 text-[#D8BE8B] border border-[#C7A25C]/40 text-[10px] sm:text-xs font-bold">
                  اعتماد رسمي
                </span>
              </div>
              <p className="text-xs text-[#D8BE8B]/90 mt-0.5">
                خدمة أفراد القبيلة، توثيق شجرة الأنساب، ونشر مناسبات وأعراس وذاكرة الأجداد
              </p>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-2 rounded-xl bg-[#1B2B22] hover:bg-[#7C9D86]/30 text-[#D8BE8B] hover:text-white transition-colors border border-[#7C9D86]/30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin">
          {isSuccess && submittedData ? (
            /* Success State Screen */
            <div className="py-8 px-4 text-center space-y-6 animate-fadeIn">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#1B2B22] via-[#7C9D86]/40 to-[#C7A25C]/30 border-2 border-[#7C9D86] flex items-center justify-center mx-auto shadow-2xl text-[#C7A25C]">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-bold font-['Markazi_Text'] text-[#F8F4EA]">
                  تم استلام طلب ترشيحك بنجاح!
                </h3>
                <p className="text-sm text-[#D8BE8B] max-w-md mx-auto leading-relaxed">
                  شكراً لحرصك واهتمامك بخدمة قبيلتك وتوثيق تراث وأخبار بني شهر. سيتم التواصل معك عبر رقم الجوال للتحقق وتفعيل صلاحيات المشرف.
                </p>
              </div>

              {/* Summary Card */}
              <div className="max-w-md mx-auto p-4 rounded-2xl bg-[#1B2B22]/90 border border-[#7C9D86]/40 text-right space-y-2 text-xs">
                <div className="flex justify-between border-b border-[#7C9D86]/20 pb-2">
                  <span className="text-[#D8BE8B]">الاسم:</span>
                  <span className="font-bold text-[#F8F4EA]">{submittedData.fullName}</span>
                </div>
                <div className="flex justify-between border-b border-[#7C9D86]/20 pb-2">
                  <span className="text-[#D8BE8B]">القبيلة المرشح لها:</span>
                  <span className="font-bold text-[#C7A25C]">{submittedData.tribeName}</span>
                </div>
                <div className="flex justify-between border-b border-[#7C9D86]/20 pb-2">
                  <span className="text-[#D8BE8B]">رقم الطلب المرجعي:</span>
                  <span className="font-mono text-[#7C9D86] font-bold">{submittedData.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#D8BE8B]">حالة الطلب:</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#C7A25C]/20 text-[#C7A25C] font-bold border border-[#C7A25C]/30">
                    قيد المراجعة والاعتماد
                  </span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleResetAndClose}
                  className="px-8 py-3 rounded-2xl bg-gradient-to-r from-[#C7A25C] to-[#9C4A38] text-white font-bold text-sm shadow-xl shadow-black/40 border border-[#D8BE8B]/40 hover:opacity-95 transition-all"
                >
                  تم، العودة إلى دليل القبائل
                </button>
              </div>
            </div>
          ) : (
            /* Nomination Registration Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-[#9C4A38]/20 border border-[#9C4A38]/50 flex items-center gap-2.5 text-xs text-red-200">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Step 1: Personal Info */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-[#D8BE8B] flex items-center gap-2 border-b border-[#7C9D86]/20 pb-2">
                  <User className="w-4 h-4 text-[#C7A25C]" />
                  <span>1. البيانات الشخصية لمقدم الطلب</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#F8F4EA]/90 block mb-1">
                      الاسم الرباعي الكامل <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: عبدالله بن محمد بن ظافر الشهري"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1B2B22] border border-[#7C9D86]/40 text-xs sm:text-sm text-[#F8F4EA] placeholder-[#7C9D86]/70 focus:outline-none focus:border-[#C7A25C]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#F8F4EA]/90 block mb-1">
                      رقم الجوال (للتواصل والتحقق) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      dir="ltr"
                      placeholder="05XXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1B2B22] border border-[#7C9D86]/40 text-xs sm:text-sm text-[#F8F4EA] placeholder-[#7C9D86]/70 focus:outline-none focus:border-[#C7A25C] text-right"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#F8F4EA]/90 block mb-1">
                      العمر
                    </label>
                    <input
                      type="number"
                      placeholder="مثال: 32"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1B2B22] border border-[#7C9D86]/40 text-xs sm:text-sm text-[#F8F4EA] placeholder-[#7C9D86]/70 focus:outline-none focus:border-[#C7A25C]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#F8F4EA]/90 block mb-1">
                      المؤهل أو مجال العمل
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: باحث تاريخي / مهندس / معلم..."
                      value={qualification}
                      onChange={(e) => setQualification(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1B2B22] border border-[#7C9D86]/40 text-xs sm:text-sm text-[#F8F4EA] placeholder-[#7C9D86]/70 focus:outline-none focus:border-[#C7A25C]"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Tribal Affiliation */}
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-bold text-[#D8BE8B] flex items-center gap-2 border-b border-[#7C9D86]/20 pb-2">
                  <Users className="w-4 h-4 text-[#C7A25C]" />
                  <span>2. القبيلة المراد الإشراف عليها والانتماء</span>
                </h4>

                <div>
                  <label className="text-xs font-semibold text-[#F8F4EA]/90 block mb-1">
                    اختر القبيلة من قبائل بني شهر <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={tribeId}
                    onChange={(e) => setTribeId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1B2B22] border border-[#7C9D86]/40 text-xs sm:text-sm text-[#F8F4EA] focus:outline-none focus:border-[#C7A25C]"
                  >
                    {DETAILED_TRIBES.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.division} - {t.center})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#F8F4EA]/90 block mb-1">
                      الفخذ أو البطن
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: آل دحمان، آل صميد..."
                      value={fakhdh}
                      onChange={(e) => setFakhdh(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1B2B22] border border-[#7C9D86]/40 text-xs sm:text-sm text-[#F8F4EA] placeholder-[#7C9D86]/70 focus:outline-none focus:border-[#C7A25C]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#F8F4EA]/90 block mb-1">
                      القرية / مكان الإقامة
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: النماص - قرية النمور"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1B2B22] border border-[#7C9D86]/40 text-xs sm:text-sm text-[#F8F4EA] placeholder-[#7C9D86]/70 focus:outline-none focus:border-[#C7A25C]"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Supervision Roles */}
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-bold text-[#D8BE8B] flex items-center gap-2 border-b border-[#7C9D86]/20 pb-2">
                  <Award className="w-4 h-4 text-[#C7A25C]" />
                  <span>3. مجالات الإشراف والمساهمة المستهدفة</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {roleOptions.map((option) => {
                    const isChecked = roles.includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleRoleToggle(option)}
                        className={`p-2.5 rounded-xl border text-right flex items-center justify-between text-xs transition-all ${
                          isChecked
                            ? "bg-[#1B2B22] border-[#C7A25C] text-[#F8F4EA] font-bold"
                            : "bg-[#12201A] border-[#7C9D86]/30 text-[#D8BE8B]/80 hover:border-[#7C9D86]"
                        }`}
                      >
                        <span>{option}</span>
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                            isChecked
                              ? "bg-[#C7A25C] border-[#C7A25C] text-white"
                              : "border-[#7C9D86]/50"
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 4: Reason & Background */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-[#F8F4EA]/90 block">
                  نبذة عن اهتمامك، مصادرك، أو سبب الرغبة في الإشراف (اختياري)
                </label>
                <textarea
                  rows={2}
                  placeholder="مثال: لدي شجرة أنساب موثقة من كبار السن، أو أرغب في نشر مناسبات وأعراس القبيلة بانتظام..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1B2B22] border border-[#7C9D86]/40 text-xs sm:text-sm text-[#F8F4EA] placeholder-[#7C9D86]/70 focus:outline-none focus:border-[#C7A25C]"
                />
              </div>

              {/* Step 5: Trust and Accuracy Declaration */}
              <div className="p-3.5 rounded-2xl bg-[#1B2B22]/80 border border-[#7C9D86]/40 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agree-terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-[#C7A25C] focus:ring-0 focus:ring-offset-0 bg-[#12201A] border-[#7C9D86]"
                />
                <label htmlFor="agree-terms" className="text-[11px] sm:text-xs text-[#D8BE8B] leading-relaxed cursor-pointer">
                  أقر بصحة البيانات المدخلة، وأتعهد بالأمانة والحيادية التامة والاعتماد على الروايات والوثائق الموثقة في نشر المناسبات وإدارة شجرة أنساب القبيلة.
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#7C9D86]/20">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-5 py-2.5 rounded-xl bg-[#1B2B22] hover:bg-[#7C9D86]/20 text-[#D8BE8B] text-xs font-bold transition-colors"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C7A25C] via-[#9C4A38] to-[#C7A25C] hover:opacity-95 text-[#F8F4EA] text-xs sm:text-sm font-bold shadow-xl shadow-black/40 border border-[#D8BE8B]/40 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>جارٍ إرسال طلب الترشيح...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>إرسال طلب الترشيح والاعتماد</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
