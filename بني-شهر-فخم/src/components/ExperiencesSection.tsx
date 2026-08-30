import React, { useState, useMemo } from "react";
import { 
  Sparkles, 
  Clock, 
  MapPin, 
  Users, 
  Star, 
  CheckCircle2, 
  Calendar, 
  DollarSign, 
  Percent, 
  ChefHat, 
  Hammer, 
  Trees, 
  Camera, 
  Smile, 
  Compass, 
  Check, 
  CreditCard, 
  Phone, 
  ChevronRight, 
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Award
} from "lucide-react";
import { BaniShahrExperience, ExperienceBooking } from "../types";
import { DataStore } from "../lib/datastore";

export const ExperiencesSection: React.FC = () => {
  const [experiences, setExperiences] = useState<BaniShahrExperience[]>(() => DataStore.getExperiences());
  const [selectedCategory, setSelectedCategory] = useState<string>("الكل");
  const [selectedRegion, setSelectedRegion] = useState<string>("الكل");
  const [activeExperience, setActiveExperience] = useState<BaniShahrExperience | null>(null);
  
  // Booking modal state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingExperience, setBookingExperience] = useState<BaniShahrExperience | null>(null);
  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [bookingDate, setBookingDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split("T")[0];
  });
  const [timeSlot, setTimeSlot] = useState<string>("4:30 عصراً - 7:00 مساءً");
  const [guestName, setGuestName] = useState<string>(() => DataStore.getCurrentUser().name);
  const [guestPhone, setGuestPhone] = useState<string>(() => DataStore.getCurrentUser().phone);
  const [paymentMethod, setPaymentMethod] = useState<"apple_pay" | "mada" | "stc_pay">("apple_pay");
  const [bookingSuccessData, setBookingSuccessData] = useState<ExperienceBooking | null>(null);

  // Categories list
  const categories = [
    { id: "الكل", label: "جميع التجارب", icon: Sparkles },
    { id: "طبخ ومأكولات شعبية", label: "طبخ ومأكولات شعبية", icon: ChefHat },
    { id: "طبيعة وزراعة وعسل", label: "مناحل وزراعة وعسل", icon: Trees },
    { id: "حرف وصناعات تقليدية", label: "حرف يدوية وقط", icon: Hammer },
    { id: "تراث وتصوير", label: "أمسيات وتصوير فلكي", icon: Camera },
    { id: "أنشطة عائلية وأطفال", label: "أطفال وعائلات", icon: Smile },
  ];

  const regions = ["الكل", "النماص", "تنومة", "المجاردة", "السراة", "تهامة"];

  const filteredExperiences = useMemo(() => {
    return experiences.filter(exp => {
      const matchCategory = selectedCategory === "الكل" || exp.category === selectedCategory;
      const matchRegion = selectedRegion === "الكل" || exp.region === selectedRegion;
      return matchCategory && matchRegion;
    });
  }, [experiences, selectedCategory, selectedRegion]);

  const handleOpenBooking = (exp: BaniShahrExperience) => {
    setBookingExperience(exp);
    setGuestsCount(2);
    setBookingSuccessData(null);
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingExperience) return;

    const commissionPercent = 12; // 12% platform commission
    const subtotal = bookingExperience.pricePerPerson * guestsCount;
    const platformCommissionAmount = Math.round((subtotal * (commissionPercent / 100)) * 100) / 100;
    const hostEarnings = Math.round((subtotal - platformCommissionAmount) * 100) / 100;

    const newBooking: ExperienceBooking = {
      id: "EBK-" + Math.floor(100000 + Math.random() * 900000),
      experienceId: bookingExperience.id,
      experienceTitle: bookingExperience.title,
      hostName: bookingExperience.hostName,
      userId: DataStore.getCurrentUser().id,
      userName: guestName || DataStore.getCurrentUser().name,
      userPhone: guestPhone || DataStore.getCurrentUser().phone,
      bookingDate,
      timeSlot,
      guestsCount,
      pricePerPerson: bookingExperience.pricePerPerson,
      subtotal,
      platformCommissionPercent: commissionPercent,
      platformCommissionAmount,
      hostEarnings,
      status: "confirmed",
      paymentMethod,
      paymentStatus: "paid",
      createdAt: new Date().toISOString()
    };

    DataStore.createExperienceBooking(newBooking);
    setBookingSuccessData(newBooking);
  };

  return (
    <section id="experiences" className="py-10 sm:py-20 relative w-full max-w-full overflow-hidden scroll-mt-20 sm:scroll-mt-24">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Business Model Highlight */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-semibold mb-3 sm:mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            <span>تجارب بني شهر الحية مع أهالي المنطقة</span>
          </div>
          <h2 className="font-['Amiri'] text-2xl sm:text-4xl md:text-5xl font-bold text-[#12201A] mb-2 sm:mb-4 leading-tight">
            عِش أصالة بني شهر <span className="text-[#BD3A2B]">بتجارب تفاعلية فريدة</span>
          </h2>
          <p className="text-[#5A524C] text-xs sm:text-base leading-relaxed px-2">
            انضم إلى سيدات ورجال المنطقة في بيوتهم ومزارعهم ومناحلهم لتعلم الطبخ الشعبي، جني العسل، خض السمن، وفن القط العسيري.
          </p>

          {/* Visitor Trust & Experience Highlights */}
          <div className="mt-4 sm:mt-6 p-2.5 sm:p-4 rounded-2xl bg-white/90 border border-[#E6DEC8] shadow-sm grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 text-right">
            <div className="flex items-center gap-2 p-1 sm:p-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] sm:text-xs text-stone-500 truncate">تجارب أصيلة</span>
                <span className="text-[11px] sm:text-xs font-bold text-stone-800 truncate block">مزارع وبيوت حقيقية</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-1 sm:p-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] sm:text-xs text-stone-500 truncate">أصحاب التجارب</span>
                <span className="text-[11px] sm:text-xs font-bold text-stone-800 truncate block">أهالي معتمدون</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-1 sm:p-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-200">
                <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] sm:text-xs text-stone-500 truncate">دفع آمن</span>
                <span className="text-[11px] sm:text-xs font-bold text-stone-800 truncate block">مدى، Apple Pay</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-1 sm:p-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 border border-purple-200">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] sm:text-xs text-stone-500 truncate">تأكيد فوري</span>
                <span className="text-[11px] sm:text-xs font-bold text-stone-800 truncate block">تذكرة إلكترونية</span>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 sm:pb-3 mb-3 sm:mb-5 no-scrollbar">
          {categories.map(cat => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl text-[11px] sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  isSelected 
                    ? "bg-[#12201A] text-[#F8F4EA] shadow-md border border-[#12201A]" 
                    : "bg-white text-stone-700 hover:bg-stone-50 border border-[#E6DEC8]"
                }`}
              >
                <Icon className={`w-3 h-3 sm:w-4 sm:h-4 ${isSelected ? "text-amber-300" : "text-amber-600"}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Region Filter */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-4 sm:mb-8 text-xs text-stone-600">
          <span className="font-semibold text-stone-800">المنطقة:</span>
          <div className="flex flex-wrap gap-1 sm:gap-1.5">
            {regions.map(r => (
              <button
                key={r}
                onClick={() => setSelectedRegion(r)}
                className={`px-2.5 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs transition-all ${
                  selectedRegion === r
                    ? "bg-emerald-800 text-white font-bold border border-emerald-800 shadow-sm"
                    : "bg-white text-stone-600 hover:text-stone-900 border border-[#E6DEC8]"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <span className="mr-auto text-stone-500 text-[11px] sm:text-xs">
            عرض {filteredExperiences.length} تجارب
          </span>
        </div>

        {/* Experiences Grid (2 columns on mobile, 2 on md, 3 on lg) */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
          {filteredExperiences.map(exp => (
            <div 
              key={exp.id}
              className="group bg-white rounded-2xl sm:rounded-3xl border border-[#E6DEC8] overflow-hidden hover:border-[#C7A25C]/60 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col justify-between"
            >
              {/* Image & Badges */}
              <div className="relative aspect-[4/3] sm:h-56 overflow-hidden">
                <img 
                  src={exp.imageUrl} 
                  alt={exp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
                
                {/* Popular Badge */}
                {exp.isPopular && (
                  <div className="absolute top-1.5 sm:top-3 right-1.5 sm:right-3 bg-amber-500 text-stone-950 text-[9px] sm:text-[11px] font-extrabold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl shadow-lg flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                    <span className="hidden sm:inline">الأكثر طلباً</span>
                  </div>
                )}

                {/* Duration & Group Size Badge */}
                <div className="absolute top-1.5 sm:top-3 left-1.5 sm:left-3 bg-stone-900/85 backdrop-blur-md text-stone-200 text-[9px] sm:text-[11px] px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl border border-stone-700 flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" />
                  <span>{exp.duration}</span>
                </div>

                {/* Rating and Reviews */}
                <div className="absolute bottom-1.5 sm:bottom-3 left-1.5 sm:left-3 bg-stone-900/90 backdrop-blur-md px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl border border-stone-700 flex items-center gap-1 text-[10px] sm:text-xs text-stone-100">
                  <Star className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold">{exp.rating}</span>
                </div>

                {/* Category Pill */}
                <div className="absolute bottom-1.5 sm:bottom-3 right-1.5 sm:right-3 bg-emerald-950/90 backdrop-blur-md text-emerald-300 text-[9px] sm:text-[11px] px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl border border-emerald-600/40 font-medium truncate max-w-[55%]">
                  {exp.category}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-2.5 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-['Amiri'] text-xs sm:text-xl font-bold text-[#12201A] group-hover:text-emerald-800 transition-colors leading-tight sm:leading-snug mb-1 sm:mb-2 line-clamp-1">
                    {exp.title}
                  </h3>

                  {/* Host Info */}
                  <div className="flex items-center gap-1.5 sm:gap-3 p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl bg-[#F8F4EA] border border-[#E6DEC8] mb-2 sm:mb-3">
                    {exp.hostAvatar ? (
                      <img 
                        src={exp.hostAvatar} 
                        alt={exp.hostName} 
                        className="w-6 h-6 sm:w-10 sm:h-10 rounded-full object-cover border border-amber-500/40 shrink-0" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-amber-800 text-white flex items-center justify-center font-bold font-['Amiri'] text-xs sm:text-base shrink-0">
                        {exp.hostName[0]}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-[10px] sm:text-xs font-bold text-stone-800 truncate">{exp.hostName}</div>
                      <div className="text-[9px] sm:text-[11px] text-stone-500 truncate hidden sm:block">{exp.hostRole}</div>
                    </div>
                  </div>

                  {/* Location & Village */}
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs text-stone-500 mb-1.5 sm:mb-3">
                    <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="truncate font-medium text-stone-700">{exp.villageOrCity}</span>
                  </div>

                  {/* Description snippet */}
                  <p className="text-[10px] sm:text-xs text-[#5A524C] leading-tight sm:leading-relaxed line-clamp-1 sm:line-clamp-2 mb-2 sm:mb-4">
                    {exp.description}
                  </p>
                </div>

                {/* Pricing and Actions */}
                <div className="pt-2 sm:pt-3 border-t border-[#E6DEC8] flex items-center justify-between gap-1">
                  <div>
                    <div className="flex items-baseline gap-0.5 sm:gap-1">
                      <span className="text-sm sm:text-xl font-bold text-emerald-800">{exp.pricePerPerson}</span>
                      <span className="text-[9px] sm:text-xs text-stone-500 font-medium">ر.س</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 sm:gap-2">
                    <button
                      onClick={() => setActiveExperience(exp)}
                      className="p-1 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-[10px] sm:text-xs font-semibold border border-[#E6DEC8] transition-colors hidden sm:block"
                    >
                      التفاصيل
                    </button>
                    <button
                      onClick={() => handleOpenBooking(exp)}
                      className="px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-600 text-white font-bold text-[10px] sm:text-xs shadow-sm transition-all active:scale-95"
                    >
                      حجز
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Experience Details Modal */}
      {activeExperience && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-stone-900 border border-stone-700 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 text-right shadow-2xl relative">
            <button
              onClick={() => setActiveExperience(null)}
              className="absolute top-5 left-5 w-9 h-9 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition-colors"
            >
              ✕
            </button>

            <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
              <img 
                src={activeExperience.imageUrl} 
                alt={activeExperience.title}
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/30" />
              <div className="absolute bottom-4 right-4 text-right">
                <span className="inline-block bg-amber-500 text-stone-950 text-xs font-bold px-3 py-1 rounded-full mb-2">
                  {activeExperience.category}
                </span>
                <h3 className="font-['Amiri'] text-2xl font-bold text-white">
                  {activeExperience.title}
                </h3>
              </div>
            </div>

            {/* Host Bar */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-stone-950 border border-stone-800 mb-6">
              {activeExperience.hostAvatar && (
                <img src={activeExperience.hostAvatar} alt="" className="w-12 h-12 rounded-full object-cover border border-amber-500/50" />
              )}
              <div>
                <div className="text-sm font-bold text-stone-100">{activeExperience.hostName}</div>
                <div className="text-xs text-amber-400">{activeExperience.hostRole}</div>
                <div className="text-xs text-stone-400">{activeExperience.villageOrCity}</div>
              </div>
              <div className="mr-auto text-left">
                <div className="text-xs text-stone-400">المدة والحد الأقصى</div>
                <div className="text-xs font-bold text-stone-200">{activeExperience.duration} • حتى {activeExperience.maxGroupSize} أشخاص</div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h4 className="font-['Amiri'] text-lg font-bold text-amber-300 mb-2">عن التجربة:</h4>
              <p className="text-sm text-stone-300 leading-relaxed">
                {activeExperience.description}
              </p>
            </div>

            {/* Included */}
            <div className="mb-6">
              <h4 className="font-['Amiri'] text-lg font-bold text-emerald-400 mb-2">ما الذي تشمله التجربة؟</h4>
              <ul className="space-y-2">
                {activeExperience.included.map((inc, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs sm:text-sm text-stone-200 bg-stone-950/50 p-2 rounded-xl border border-stone-800/80">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements & Schedule */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-xs">
              <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800">
                <span className="font-bold text-amber-300 block mb-1">المواعيد:</span>
                <span className="text-stone-300">{activeExperience.schedule}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800">
                <span className="font-bold text-blue-300 block mb-1">الموقع المحدد:</span>
                <span className="text-stone-300">{activeExperience.locationDetails}</span>
              </div>
            </div>

            {/* Footer Book Button */}
            <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-400 block">السعر الإجمالي للشخص</span>
                <span className="text-2xl font-bold text-amber-400">{activeExperience.pricePerPerson} ريال</span>
              </div>
              <button
                onClick={() => {
                  const exp = activeExperience;
                  setActiveExperience(null);
                  handleOpenBooking(exp);
                }}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-sm shadow-xl shadow-amber-950 transition-all hover:scale-105"
              >
                حجز التجربة الآن
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Booking Checkout Modal */}
      {isBookingModalOpen && bookingExperience && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-stone-900 border border-amber-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-right shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsBookingModalOpen(false);
                setBookingSuccessData(null);
              }}
              className="absolute top-5 left-5 w-9 h-9 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition-colors"
            >
              ✕
            </button>

            {!bookingSuccessData ? (
              <form onSubmit={handleConfirmBooking}>
                <div className="flex items-center gap-2 text-xs text-amber-400 font-bold mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>تأكيد حجز التجربة السياحية التراثية</span>
                </div>
                
                <h3 className="font-['Amiri'] text-2xl font-bold text-stone-100 mb-1">
                  {bookingExperience.title}
                </h3>
                <p className="text-xs text-stone-400 mb-6">
                  المضيف: {bookingExperience.hostName} ({bookingExperience.villageOrCity})
                </p>

                {/* Form Fields */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                      عدد الضيوف والمشاركين:
                    </label>
                    <div className="flex items-center gap-3">
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <button
                          type="button"
                          key={num}
                          onClick={() => setGuestsCount(num)}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                            guestsCount === num
                              ? "bg-amber-500 text-stone-950 border border-amber-300"
                              : "bg-stone-800 text-stone-300 hover:bg-stone-700 border border-stone-700"
                          }`}
                        >
                          {num} {num === 1 ? "شخص" : "أشخاص"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                        تاريخ التجربة:
                      </label>
                      <input 
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        required
                        className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                        الفترة الزمنية:
                      </label>
                      <select
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                      >
                        <option value="4:30 عصراً - 7:00 مساءً">الفترة المسائية (4:30 م - 7:00 م)</option>
                        <option value="7:00 صباحاً - 10:00 صباحاً">الفترة الصباحية (7:00 ص - 10:00 ص)</option>
                        <option value="7:30 مساءً - 10:30 ليلاً">أمسية السمر (7:30 م - 10:30 م)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                        اسم الحاجز:
                      </label>
                      <input 
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        required
                        className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                        رقم الجوال لتلقي التذكرة:
                      </label>
                      <input 
                        type="tel"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        required
                        className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                      طريقة الدفع الفوري:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("apple_pay")}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                          paymentMethod === "apple_pay"
                            ? "bg-amber-500/20 border-amber-400 text-amber-200"
                            : "bg-stone-950 border-stone-800 text-stone-400 hover:bg-stone-800"
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Apple Pay</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("mada")}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                          paymentMethod === "mada"
                            ? "bg-emerald-500/20 border-emerald-400 text-emerald-200"
                            : "bg-stone-950 border-stone-800 text-stone-400 hover:bg-stone-800"
                        }`}
                      >
                        <Check className="w-4 h-4" />
                        <span>بطاقة مدى</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("stc_pay")}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                          paymentMethod === "stc_pay"
                            ? "bg-purple-500/20 border-purple-400 text-purple-200"
                            : "bg-stone-950 border-stone-800 text-stone-400 hover:bg-stone-800"
                        }`}
                      >
                        <Phone className="w-4 h-4" />
                        <span>STC Pay</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown with Platform Commission */}
                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2 mb-6 text-xs">
                  <div className="flex justify-between text-stone-400">
                    <span>السعر للشخص ({bookingExperience.pricePerPerson} ريال × {guestsCount} ضيوف)</span>
                    <span className="text-stone-200 font-bold">{bookingExperience.pricePerPerson * guestsCount} ريال</span>
                  </div>
                  <div className="flex justify-between text-stone-400 text-[11px]">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" />
                      رسوم الخدمة والتأمين الشامل
                    </span>
                    <span className="text-emerald-300">مشمولة بالكامل في الإجمالي</span>
                  </div>
                  <div className="pt-2 border-t border-stone-800 flex justify-between text-sm font-bold text-amber-400">
                    <span>الإجمالي المستحق للدفع:</span>
                    <span>{bookingExperience.pricePerPerson * guestsCount} ريال</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-emerald-600 hover:from-amber-500 hover:to-emerald-500 text-stone-950 font-extrabold text-sm shadow-xl shadow-amber-950 transition-all hover:scale-[1.02]"
                >
                  تأكيد الحجز والدفع ({bookingExperience.pricePerPerson * guestsCount} ريال)
                </button>
              </form>
            ) : (
              /* Booking Success Ticket View */
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-['Amiri'] text-2xl font-bold text-stone-100 mb-1">
                  تم تأكيد حجز التجربة بنجاح!
                </h4>
                <p className="text-xs text-stone-400 mb-6">
                  رقم الحجز: <span className="text-amber-400 font-mono font-bold">{bookingSuccessData.id}</span>
                </p>

                {/* Ticket Details */}
                <div className="p-4 rounded-2xl bg-stone-950 border border-emerald-500/30 text-right space-y-2.5 mb-6 text-xs">
                  <div className="flex justify-between border-b border-stone-800 pb-2">
                    <span className="text-stone-400">التجربة:</span>
                    <span className="text-stone-100 font-bold">{bookingSuccessData.experienceTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">المضيف:</span>
                    <span className="text-amber-300 font-bold">{bookingSuccessData.hostName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">الموعد والتاريخ:</span>
                    <span className="text-stone-200">{bookingSuccessData.bookingDate} ({bookingSuccessData.timeSlot})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">عدد الضيوف:</span>
                    <span className="text-stone-200">{bookingSuccessData.guestsCount} أشخاص</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-stone-800 text-sm">
                    <span className="text-stone-300 font-bold">المبلغ المدفوع:</span>
                    <span className="text-emerald-400 font-bold">{bookingSuccessData.subtotal} ريال (مدفوع)</span>
                  </div>
                </div>

                <p className="text-[11px] text-stone-400 leading-relaxed mb-6">
                  تم إرسال إشعار للمضيف وتأكيد التذكرة على جوالك. كرم الضيافة الشهري بانتظارك!
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setIsBookingModalOpen(false);
                    setBookingSuccessData(null);
                  }}
                  className="w-full py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold border border-stone-700 transition-colors"
                >
                  إغلاق ومتابعة الاستكشاف
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </section>
  );
};
