import React from "react";
import { 
  ShieldCheck, 
  X, 
  Lock, 
  UserCheck, 
  FileText, 
  Mail, 
  Server, 
  Trash2, 
  CheckCircle2,
  ExternalLink
} from "lucide-react";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
  showAcceptButton?: boolean;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
  onAccept,
  showAcceptButton = false,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-stone-950/85 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 text-stone-100 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] font-['IBM_Plex_Sans_Arabic',sans-serif]"
        style={{
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.08)"
        }}
      >
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-950 via-stone-900 to-stone-900 border-b border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-['Amiri']">
                سياسة الخصوصية — تطبيق بني شهر
              </h3>
              <p className="text-xs text-emerald-400 font-mono">
                آخر تحديث: 29 أغسطس 2026 م (16 ربيع الأول 1448 هـ)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700 transition-colors"
            title="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Policy Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm leading-relaxed text-stone-300">
          
          {/* Introductory Note */}
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-stone-200">
            <p className="text-sm font-medium">
              نحن في تطبيق <strong className="text-emerald-400">«بني شهر»</strong> نحترم خصوصيتك، وهذي السياسة توضح لك أي بيانات نجمعها وكيف نستخدمها لضمان تجربة تراثية وسياحية آمنة وموثوقة.
            </p>
          </div>

          {/* Section 1: Data Collected */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-stone-100 font-bold text-sm sm:text-base font-['Amiri']">
              <div className="w-6 h-6 rounded-lg bg-stone-800 text-emerald-400 flex items-center justify-center text-xs font-mono">1</div>
              <h4>البيانات التي نجمعها</h4>
            </div>
            <div className="grid gap-2.5 pr-2 sm:pr-4">
              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-start gap-2.5">
                <UserCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">من الأعضاء العاديين:</strong>
                  <span>رقم الجوال والبريد الإلكتروني (لتسجيل الدخول، التحقق الآمن وإرسال التنبيهات والإشعارات المهمة).</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">من مشرفي القبائل والقرى:</strong>
                  <span>بالإضافة لما سبق، الاسم الكامل والصفة الرسمية (لأن المشرف ينشر الرسائل والإعلانات والوثائق باسمه الرسمي نيابة عن قبيلته، ولضمان المصداقية والمساءلة التاريخية والمجتمعية).</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Consent and Usage */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-stone-100 font-bold text-sm sm:text-base font-['Amiri']">
              <div className="w-6 h-6 rounded-lg bg-stone-800 text-emerald-400 flex items-center justify-center text-xs font-mono">2</div>
              <h4>موافقتك على استخدام البيانات</h4>
            </div>
            <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 text-stone-300 space-y-2">
              <p>
                بتسجيلك في التطبيق، أنت توافق على أن يقوم تطبيق بني شهر بجمع بياناتك المسجَّلة (الاسم، رقم الجوال، البريد الإلكتروني) واستخدامها في الأغراض التالية:
              </p>
              <ul className="list-disc list-inside space-y-1 text-stone-300 pr-2">
                <li>تشغيل وإدارة حسابك وملفك الشخصي في المنصة.</li>
                <li>إرسال التنبيهات والإشعارات الخاصة بقبيلتك وأخبار الديار والفعاليات التراثية.</li>
                <li>تحسين وتطوير خدمات التطبيق وتجربة الاستخدام.</li>
                <li>التواصل معك عند الحاجة أو عند متابعة طلباتك وتذاكر الدعم الفني.</li>
              </ul>
              <p className="text-[11px] text-stone-400 pt-1 border-t border-stone-800">
                كما تقر بأن التطبيق قد يُحدّث طريقة استخدام هذي البيانات مستقبلًا بما يخدم تطوير الخدمة، على أن يتم إخطارك بأي تغيير جوهري في سياسة الخصوصية عبر إشعار رسمي داخل التطبيق.
              </p>
            </div>
          </div>

          {/* Section 3: Data Sharing */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-stone-100 font-bold text-sm sm:text-base font-['Amiri']">
              <div className="w-6 h-6 rounded-lg bg-stone-800 text-emerald-400 flex items-center justify-center text-xs font-mono">3</div>
              <h4>مشاركة البيانات</h4>
            </div>
            <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 flex items-start gap-3">
              <Server className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <p>
                  <strong className="text-white">لا نبيع بياناتك ولا نشاركها مع أي طرف ثالث لأغراض تسويقية أو إعلانية.</strong> قد تُخزَّن بياناتك بشكل مشفّر على خوادم مزودي خدمات تقنية معتمدين (مثل منصة Firebase السحابية من Google) لأغراض تشغيل التطبيق وقواعد البيانات والحماية فقط.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Your Rights */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-stone-100 font-bold text-sm sm:text-base font-['Amiri']">
              <div className="w-6 h-6 rounded-lg bg-stone-800 text-emerald-400 flex items-center justify-center text-xs font-mono">4</div>
              <h4>حقوقك والتحكم في البيانات</h4>
            </div>
            <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 flex items-start gap-3">
              <Trash2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p>
                  يحق لك في أي وقت طلب حذف حسابك وبياناتك نهائياً، أو تعديل معلوماتك، من خلال 
                  <strong className="text-emerald-400"> صفحة «حسابي» </strong> 
                  في التطبيق أو عبر التواصل معنا مباشرة عبر البريد الإلكتروني: 
                  <a href="mailto:aaattr2005@gmail.com" className="text-emerald-400 underline font-mono mr-1 dir-ltr inline-block">
                    aaattr2005@gmail.com
                  </a>.
                </p>
              </div>
            </div>
          </div>

          {/* Section 5: Data Security */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-stone-100 font-bold text-sm sm:text-base font-['Amiri']">
              <div className="w-6 h-6 rounded-lg bg-stone-800 text-emerald-400 flex items-center justify-center text-xs font-mono">5</div>
              <h4>أمان البيانات وحمايتها</h4>
            </div>
            <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 flex items-start gap-3">
              <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p>
                  نتخذ إجراءات تقنية ومعايير أمنية مشددة ومعقولة لحماية بياناتك من الوصول غير المصرح به، الفقدان أو التعديل، مع تشفير الجلسات وبروتوكولات النقل الآمن (SSL/TLS).
                </p>
              </div>
            </div>
          </div>

          {/* Section 6: Contact */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-stone-100 font-bold text-sm sm:text-base font-['Amiri']">
              <div className="w-6 h-6 rounded-lg bg-stone-800 text-emerald-400 flex items-center justify-center text-xs font-mono">6</div>
              <h4>التواصل والاستفسارات</h4>
            </div>
            <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 flex items-start gap-3">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p>
                  لأي استفسار أو طلب بخصوص سياسة الخصوصية وحماية البيانات، يسعدنا تواصلك معنا عبر:
                </p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <a 
                    href="mailto:aaattr2005@gmail.com" 
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-700 text-emerald-400 font-mono hover:border-emerald-500 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>aaattr2005@gmail.com</span>
                  </a>
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-400">
                    أو عبر مركز الدعم الفني في صفحة «حسابي»
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-stone-950 border-t border-stone-800 flex items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] text-stone-400">
            تطبيق بني شهر © {new Date().getFullYear()} — وثيقة الخصوصية الرسمية
          </span>
          <div className="flex items-center gap-2">
            {showAcceptButton && onAccept && (
              <button
                onClick={() => {
                  onAccept();
                  onClose();
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>أوافق على السياسة</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs transition-colors"
            >
              إغلاق
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
