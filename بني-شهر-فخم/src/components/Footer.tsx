import React from "react";
import { 
  Mountain, 
  PhoneCall, 
  ShieldCheck, 
  Heart, 
  Compass, 
  Landmark, 
  MapPin, 
  Hotel,
  BookOpen,
  ArrowUp
} from "lucide-react";

interface FooterProps {
  openAdminLogin?: () => void;
  openPrivacyPolicy?: () => void;
  onScrollToTop?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ openAdminLogin, openPrivacyPolicy, onScrollToTop }) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollTop = () => {
    if (onScrollToTop) {
      onScrollToTop();
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full max-w-full overflow-hidden bg-[#12201A] text-[#F8F4EA]/80 border-t border-[#7C9D86]/30 text-xs font-['IBM_Plex_Sans_Arabic']">
      
      {/* Al-Qatt Al-Asiri Decorative Stripe */}
      <div className="qatt-asiri-header-strip" />

      {/* Mountain Emergency Numbers Bar */}
      <div className="bg-[#1B2B22] border-b border-[#7C9D86]/30 py-3 sm:py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 text-[#D8BE8B] font-medium text-xs">
            <ShieldCheck className="w-4 h-4 text-[#C7A25C] shrink-0" />
            <span>أرقام الطوارئ والإرشاد في مرتفعات السراة:</span>
          </div>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto text-[11px] sm:text-xs">
            <span className="flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#12201A] text-[#F8F4EA] border border-[#7C9D86]/30">
              <PhoneCall className="w-3 h-3 text-[#9C4A38] shrink-0" />
              <span>الدفاع المدني:</span> <strong className="text-white font-mono">998</strong>
            </span>
            <span className="flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#12201A] text-[#F8F4EA] border border-[#7C9D86]/30">
              <PhoneCall className="w-3 h-3 text-[#9C4A38] shrink-0" />
              <span>الهلال الأحمر:</span> <strong className="text-white font-mono">997</strong>
            </span>
            <span className="flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#12201A] text-[#F8F4EA] border border-[#7C9D86]/30">
              <PhoneCall className="w-3 h-3 text-[#7C9D86] shrink-0" />
              <span>الإرشاد السياحي:</span> <strong className="text-white font-mono">930</strong>
            </span>
            <span className="flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#12201A] text-[#F8F4EA] border border-[#7C9D86]/30">
              <PhoneCall className="w-3 h-3 text-[#C7A25C] shrink-0" />
              <span>أمن الطرق:</span> <strong className="text-white font-mono">996</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1B2B22] via-[#7C9D86] to-[#C7A25C] flex items-center justify-center border border-[#C7A25C]/40">
                <span className="font-['Markazi_Text'] font-bold text-2xl text-[#F8F4EA]">ب</span>
              </div>
              <div>
                <h3 className="font-['Markazi_Text'] font-bold text-2xl text-[#F8F4EA]">
                  تطبيق بني شهر
                </h3>
                <span className="text-[#D8BE8B] text-xs">
                  بوابة التراث والتاريخ والسياحة المتكاملة
                </span>
              </div>
            </div>
            <p className="text-[#F8F4EA]/80 text-xs leading-relaxed max-w-md font-light">
              منصة توثيقية وسياحية مكرسة للتعريف بتاريخ وحصون وفنون قبائل بني شهر العريقة في قمم السراة وسهول تهامة، وإرشاد الزوار لأجمل الشلالات والمطلات والمسارات الجبلية.
            </p>
            <div className="text-xs text-[#D8BE8B] font-['Markazi_Text'] text-sm italic">
              «يا مرحبا ترحيبةٍ تملأ السراة ** بأهل الوفا والجود والشان الرفيع»
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-stone-100 text-sm font-['Amiri']">أقسام المنصة:</h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button onClick={() => scrollToSection("heritage")} className="hover:text-emerald-400 transition-colors">
                  تاريخ ونسب بني شهر
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("attractions")} className="hover:text-emerald-400 transition-colors">
                  شلال الدهناء وجبل منعاء
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("planner")} className="hover:text-emerald-400 transition-colors">
                  مخطط الرحلات الذكي
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("dialect")} className="hover:text-emerald-400 transition-colors">
                  معجم اللهجة والأمثال
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("hospitality")} className="hover:text-emerald-400 transition-colors">
                  النزل الريفية ومزارع العسل
                </button>
              </li>
            </ul>
          </div>

          {/* Geographical Centers */}
          <div className="space-y-3">
            <h4 className="font-bold text-stone-100 text-sm font-['Amiri']">ديار ومراكز بني شهر:</h4>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              {["محافظة تنومة", "محافظة النماص", "محافظة المجاردة", "مركز خاط", "مركز عبس", "مركز ثربان", "وادي ترج", "وادي حوران", "شعف آل وليد", "جبل منعاء"].map((c, i) => (
                <span key={i} className="px-2 py-1 rounded-lg bg-[#1B2B22] border border-[#7C9D86]/30 text-[#D8BE8B]">
                  {c}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar & Scroll to top */}
        <div className="mt-10 pt-6 border-t border-[#7C9D86]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#D8BE8B]/70 text-[11px]">
          <div className="flex items-center gap-3">
            <span>
              جميع الحقوق محفوظة © {new Date().getFullYear()} تطبيق بني شهر التراثي والسياحي.
            </span>
            {openPrivacyPolicy && (
              <>
                <span className="text-[#7C9D86]/50">•</span>
                <button
                  onClick={openPrivacyPolicy}
                  className="text-emerald-400 hover:text-emerald-300 font-bold underline transition-colors"
                >
                  سياسة الخصوصية وحماية البيانات
                </button>
              </>
            )}
          </div>

          {/* Quick scroll to top in footer */}
          <button
            onClick={handleScrollTop}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#1B2B22] hover:bg-[#2A4D3B] text-amber-300 hover:text-white border border-[#7C9D86]/40 transition-all text-xs font-bold shadow-sm group"
          >
            <span>العودة لأعلى الصفحة</span>
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>

          <div className="flex items-center gap-4">
            {openAdminLogin && (
              <button
                onClick={openAdminLogin}
                className="text-[#D8BE8B] hover:text-[#C7A25C] transition-colors flex items-center gap-1 font-bold"
              >
                <span>بوابة دخول الإدارة والمشرفين (Firebase)</span>
              </button>
            )}
            <span className="flex items-center gap-1 text-[#7C9D86]">
              صُنع بعناية وفخر بإرث عسير والمملكة العربية السعودية 🇸🇦
            </span>
          </div>
        </div>

      </div>

    </footer>
  );
};
