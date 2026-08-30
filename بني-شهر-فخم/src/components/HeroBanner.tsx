import React from "react";
import { 
  Sparkles, 
  MapPin, 
  Landmark, 
  Compass, 
  Volume2, 
  VolumeX, 
  ArrowDown, 
  TreePine, 
  Mountain, 
  Castle, 
  CloudFog,
  Users,
  ShieldCheck
} from "lucide-react";
import { useLanguage } from "../lib/i18n";

interface HeroBannerProps {
  onOpenTribes: () => void;
  onExploreHeritage: () => void;
  onExploreAttractions: () => void;
  onPlanTrip?: () => void;
  onOpenAiGuide?: () => void;
  onNominateSupervisor?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onOpenTribes,
  onExploreHeritage,
  onExploreAttractions,
}) => {
  const { language, t } = useLanguage();
  const [isPlayingAudio, setIsPlayingAudio] = React.useState(false);

  // Simulated ambient mountain breeze & traditional rhythm
  const toggleAmbientSound = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  return (
    <section id="hero" className="relative min-h-[90vh] w-full max-w-full flex items-center justify-center overflow-hidden bg-[#12201A] text-[#F8F4EA]">
      
      {/* Visual Mountain & Mist Overlay Backdrop */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-1000"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=85')`,
        }}
      >
        {/* Mountain fog and juniper gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#12201A] via-[#12201A]/80 to-[#1B2B22]/65" />
        <div className="absolute inset-0 bg-[#7C9D86]/15 mix-blend-overlay" />
      </div>

      {/* Decorative Traditional Arabic Floral / Geometric Watermark */}
      <div className="absolute top-12 left-8 w-72 h-72 rounded-full bg-[#7C9D86]/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-12 right-8 w-96 h-96 rounded-full bg-[#C7A25C]/15 blur-3xl pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center">
        
        {/* Heritage Region Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-full bg-[#1B2B22]/90 border border-[#7C9D86]/40 text-[#D8BE8B] text-[11px] sm:text-sm font-medium mb-5 sm:mb-6 backdrop-blur-md shadow-lg shadow-black/40 max-w-full">
          <Mountain className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C7A25C] shrink-0" />
          <span className="truncate">
            {language === "ar" 
              ? "ديار العز والأصالة • النماص وتنومة والمجاردة وسراة عسير" 
              : "Land of Pride & Authenticity • Al-Namas, Tanomah, Al-Majardah"}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#7C9D86] animate-ping shrink-0" />
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight font-['Markazi_Text'] leading-tight sm:leading-tight mb-4 sm:mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D8BE8B] via-[#C7A25C] to-[#7C9D86]">
            {language === "ar" ? "تطبيق بني شهر" : "Bani Shahr Platform"}
          </span>
          <br />
          <span className="text-lg sm:text-3xl md:text-4xl lg:text-5xl font-normal text-[#F8F4EA] font-['Markazi_Text'] mt-2 sm:mt-3 block leading-snug">
            {language === "ar" 
              ? "أصالة التراث، خضرة الجبال، وخدمات سياحية متكاملة" 
              : "Authentic Heritage, Verdant Peaks & Integrated Tourism"}
          </span>
        </h1>

        {/* Regional Welcome Verse */}
        <p className="max-w-3xl mx-auto text-sm sm:text-lg md:text-xl text-[#F8F4EA]/90 font-light leading-relaxed mb-8 sm:mb-10 px-2">
          {language === "ar"
            ? "«أرحبوا تراحيب المطر والسيل» في البوابة الشاملة لاستكشاف تاريخ وحصون وقلاع بني شهر، وشلالات وغابات تنومة، ومتاحف ومطلات الضباب في النماص، مع خدمات الضيافة والمرشد السياحي الذكي."
            : "Welcome to the official comprehensive portal exploring the history, castles, and forts of Bani Shahr, waterfalls of Tanomah, cloud viewpoints of Al-Namas, authentic local experiences, and smart AI guidance."}
        </p>

        {/* Main Interactive Action Buttons - Hierarchical Layout */}
        <div className="flex flex-col items-center gap-3 mb-8 sm:mb-12 max-w-xl mx-auto w-full">
          
          {/* Primary Top Button: جميع قبائل بني شهر */}
          <button
            id="hero-tribes-btn"
            onClick={onOpenTribes}
            className="w-full relative overflow-hidden flex items-center justify-center gap-3 px-6 py-3.5 sm:py-4 rounded-2xl text-white font-bold shadow-xl shadow-black/40 hover:-translate-y-0.5 active:scale-[0.99] transition-all border border-[#D8BE8B]/60 hover:border-[#E9D9B8] group"
            style={{
              background: "linear-gradient(90deg, #163826 0%, #294D38 32%, #5C7765 52%, #C7A25C 78%, #C7A25C 100%)",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.45), inset 0 1px 1px 0 rgba(255, 255, 255, 0.25)"
            }}
          >
            {/* Ambient light glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            
            <div className="w-8 h-8 rounded-xl bg-black/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-amber-200 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5 shrink-0 drop-shadow" />
            </div>
            <span className="font-['Markazi_Text'] text-2xl sm:text-3xl tracking-wide drop-shadow-md">{language === "ar" ? "جميع قبائل بني شهر" : "Bani Shahr Tribes"}</span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white font-semibold font-['Tajawal'] mr-auto sm:mr-0 sm:ml-1 border border-white/30 shadow-sm">
              {language === "ar" ? "شجرة الأنساب" : "Tree"}
            </span>
          </button>

          {/* Secondary Paired Buttons: Two columns side-by-side */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 w-full">
            
            {/* تاريخ وحصون القبيلة */}
            <button
              id="hero-explore-heritage-btn"
              onClick={onExploreHeritage}
              className="flex items-center justify-center gap-2 px-3 sm:px-5 py-3 rounded-xl bg-[#1B3B2B]/90 hover:bg-[#234d38] text-[#F8F4EA] font-medium border border-[#7C9D86]/40 hover:border-amber-400/50 shadow-md hover:-translate-y-0.5 transition-all text-center group backdrop-blur-sm"
            >
              <Landmark className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="font-['Markazi_Text'] text-lg sm:text-xl font-bold">{language === "ar" ? "تاريخ وحصون" : "Heritage & Forts"}</span>
            </button>

            {/* استكشف المعالم والطبيعة */}
            <button
              id="hero-explore-attractions-btn"
              onClick={onExploreAttractions}
              className="flex items-center justify-center gap-2 px-3 sm:px-5 py-3 rounded-xl bg-[#1B3B2B]/90 hover:bg-[#234d38] text-[#F8F4EA] font-medium border border-[#7C9D86]/40 hover:border-emerald-400/50 shadow-md hover:-translate-y-0.5 transition-all text-center group backdrop-blur-sm"
            >
              <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="font-['Markazi_Text'] text-lg sm:text-xl font-bold">{language === "ar" ? "استكشف المعالم" : "Explore Nature"}</span>
            </button>

          </div>

        </div>

        {/* Live Regional Statistics - Streamlined Horizontal Glass Bar */}
        <div className="max-w-3xl mx-auto w-full pt-4">
          <div className="bg-[#142A1E]/80 backdrop-blur-md border border-[#7C9D86]/35 rounded-2xl p-2.5 sm:p-3.5 shadow-xl">
            <div className="grid grid-cols-4 divide-x divide-x-reverse divide-[#7C9D86]/25">
              
              {/* Stat 1 */}
              <div className="text-center px-1 sm:px-2">
                <div className="flex items-center justify-center gap-1 text-emerald-400 mb-0.5">
                  <Mountain className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                  <span className="text-base sm:text-2xl font-bold font-['Markazi_Text'] text-white">2,600م</span>
                </div>
                <span className="text-[10px] sm:text-xs text-[#D8BE8B]/85 block font-medium truncate">
                  {language === "ar" ? "قمم السراة" : "Peaks"}
                </span>
              </div>

              {/* Stat 2 */}
              <div className="text-center px-1 sm:px-2">
                <div className="flex items-center justify-center gap-1 text-amber-400 mb-0.5">
                  <Castle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                  <span className="text-base sm:text-2xl font-bold font-['Markazi_Text'] text-white">+100</span>
                </div>
                <span className="text-[10px] sm:text-xs text-[#D8BE8B]/85 block font-medium truncate">
                  {language === "ar" ? "حصن وقصبة" : "Forts"}
                </span>
              </div>

              {/* Stat 3 */}
              <div className="text-center px-1 sm:px-2">
                <div className="flex items-center justify-center gap-1 text-teal-400 mb-0.5">
                  <TreePine className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-400" />
                  <span className="text-base sm:text-2xl font-bold font-['Markazi_Text'] text-white">+40</span>
                </div>
                <span className="text-[10px] sm:text-xs text-[#D8BE8B]/85 block font-medium truncate">
                  {language === "ar" ? "شلال وغابة" : "Waterfalls"}
                </span>
              </div>

              {/* Stat 4 */}
              <div className="text-center px-1 sm:px-2">
                <div className="flex items-center justify-center gap-1 text-amber-300 mb-0.5">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
                  <span className="text-base sm:text-2xl font-bold font-['Markazi_Text'] text-white">24/7</span>
                </div>
                <span className="text-[10px] sm:text-xs text-[#D8BE8B]/85 block font-medium truncate">
                  {language === "ar" ? "مرشد ذكي" : "AI Guide"}
                </span>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Floating Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-xs text-[#D8BE8B] animate-bounce">
        <span>{language === "ar" ? "استكشف ديار بني شهر" : "Discover Bani Shahr"}</span>
        <ArrowDown className="w-4 h-4 text-[#7C9D86]" />
      </div>

    </section>
  );
};

