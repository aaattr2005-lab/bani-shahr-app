import React, { useState } from "react";
import { TOUR_GUIDES_DATA } from "../data/baniShahrData";
import { TourGuide, GuideBooking } from "../types";
import { GuideBookingModal } from "./GuideBookingModal";
import { 
  Compass, 
  ShieldCheck, 
  Star, 
  MapPin, 
  Calendar, 
  Award, 
  Phone, 
  CheckCircle,
  Users,
  Clock,
  Sparkles
} from "lucide-react";

interface TourGuidesSectionProps {
  onBookingSuccess?: (booking: GuideBooking) => void;
}

export const TourGuidesSection: React.FC<TourGuidesSectionProps> = ({ onBookingSuccess }) => {
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  const [selectedGuideForBooking, setSelectedGuideForBooking] = useState<TourGuide | null>(null);

  const filteredGuides = TOUR_GUIDES_DATA.filter((guide) => {
    const cityMatch = selectedCity === "all" || guide.city === selectedCity || guide.city.includes("كافة");
    const specialtyMatch = selectedSpecialty === "all" || guide.specialties.some(s => s.includes(selectedSpecialty));
    return cityMatch && specialtyMatch;
  });

  return (
    <section id="tour-guides" className="py-10 sm:py-20 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full max-w-full overflow-hidden scroll-mt-20 sm:scroll-mt-24">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3 sm:mb-4 shadow-inner">
          <Compass className="w-3.5 h-3.5 text-emerald-400" />
          <span>مرشدون محليون معتمدون</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-bold text-[#12201A] font-['Amiri'] tracking-wide">
          المرشدون السياحيون والتراثيون لديار بني شهر
        </h2>

        <p className="mt-2 sm:mt-3 text-[#5A524C] text-xs sm:text-base leading-relaxed px-2">
          نخبة من أبناء وبنات المنطقة المرخصين من وزارة السياحة؛ خبراء في مسارات الهايكنج، تسلق جبل منعاء، تاريخ القصور وقصر المقر، والأودية التهامية.
        </p>

        {/* Filter Controls */}
        <div className="mt-4 sm:mt-8 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 sm:gap-3">
          
          {/* City Filter */}
          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 p-1 bg-white rounded-2xl border border-[#E6DEC8] w-full sm:w-auto shadow-sm">
            {[
              { id: "all", label: "كافة المناطق" },
              { id: "تنومة", label: "تنومة" },
              { id: "النماص", label: "النماص" },
              { id: "المجاردة", label: "المجاردة وتهامة" },
            ].map((city) => (
              <button
                key={city.id}
                onClick={() => setSelectedCity(city.id)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-medium transition-all ${
                  selectedCity === city.id
                    ? "bg-emerald-800 text-white shadow-sm font-bold"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                {city.label}
              </button>
            ))}
          </div>

          {/* Specialty Filter */}
          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 p-1 bg-white rounded-2xl border border-[#E6DEC8] w-full sm:w-auto shadow-sm">
            {[
              { id: "all", label: "كل التخصصات" },
              { id: "هايكنج", label: "هايكنج وتسلق" },
              { id: "تاريخ", label: "تاريخ وقصور" },
              { id: "زراعية", label: "عائلات ومزارع" },
            ].map((spec) => (
              <button
                key={spec.id}
                onClick={() => setSelectedSpecialty(spec.id)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-medium transition-all ${
                  selectedSpecialty === spec.id
                    ? "bg-amber-700 text-white shadow-sm font-bold"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                {spec.label}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* Guides Grid (2 columns on mobile, 3 on md, 4 on xl) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-6">
        {filteredGuides.map((guide) => (
          <div 
            key={guide.id}
            className="group relative bg-white rounded-2xl sm:rounded-3xl border border-[#E6DEC8] hover:border-emerald-600/40 transition-all duration-300 shadow-sm hover:shadow-lg flex flex-col justify-between overflow-hidden hover:-translate-y-1"
          >
            
            {/* Guide Card Header */}
            <div className="p-2.5 sm:p-5 pb-0">
              
              <div className="relative mb-2 sm:mb-4">
                <img 
                  src={guide.avatarUrl} 
                  alt={guide.name}
                  className="w-full aspect-[4/3] sm:h-48 rounded-xl sm:rounded-2xl object-cover border border-[#E6DEC8] group-hover:scale-[1.02] transition-all"
                />
                
                {/* Rating Badge */}
                <div className="absolute top-1.5 sm:top-3 left-1.5 sm:left-3 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-[9px] sm:text-xs font-bold text-amber-300 flex items-center gap-0.5 sm:gap-1 shadow-md">
                  <Star className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
                  <span>{guide.rating}</span>
                  <span className="text-stone-300 font-normal hidden sm:inline">({guide.reviewsCount})</span>
                </div>

                {/* Location Badge */}
                <div className="absolute bottom-1.5 sm:bottom-3 right-1.5 sm:right-3 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-[9px] sm:text-xs font-medium text-white flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400" />
                  <span>{guide.city}</span>
                </div>

                {/* Verified License */}
                <div className="absolute top-1.5 sm:top-3 right-1.5 sm:right-3 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl bg-emerald-900/90 backdrop-blur-md border border-emerald-500/40 text-[8px] sm:text-[10px] font-bold text-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400" />
                  <span>مرخص</span>
                </div>

              </div>

              {/* Guide Details */}
              <div>
                <h3 className="text-xs sm:text-lg font-bold text-[#12201A] font-['Amiri'] group-hover:text-emerald-800 transition-colors truncate">
                  {guide.name}
                </h3>
                <p className="text-[10px] sm:text-xs text-emerald-700 font-medium mt-0.5 truncate">
                  {guide.title}
                </p>

                <p className="text-[10px] sm:text-xs text-[#5A524C] mt-1 sm:mt-2.5 line-clamp-1 sm:line-clamp-2 leading-tight sm:leading-relaxed">
                  {guide.bio}
                </p>
              </div>

              {/* Specialties Tags */}
              <div className="mt-1.5 sm:mt-3.5 flex flex-wrap gap-1">
                {guide.specialties.slice(0, 2).map((spec, i) => (
                  <span 
                    key={i}
                    className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg bg-[#F8F4EA] border border-[#E6DEC8] text-stone-700 truncate"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              {/* Stats row */}
              <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-[#E6DEC8] grid grid-cols-2 gap-1 sm:gap-2 text-center text-xs">
                <div className="p-1 sm:p-1.5 rounded-lg sm:rounded-xl bg-[#F8F4EA]">
                  <span className="text-[8px] sm:text-[10px] text-stone-500 block">الخبرة</span>
                  <span className="font-bold text-stone-800 text-[10px] sm:text-xs">{guide.yearsExperience} س</span>
                </div>
                <div className="p-1 sm:p-1.5 rounded-lg sm:rounded-xl bg-[#F8F4EA]">
                  <span className="text-[8px] sm:text-[10px] text-stone-500 block">الرحلات</span>
                  <span className="font-bold text-emerald-800 text-[10px] sm:text-xs">{guide.totalTripsCompleted}+</span>
                </div>
              </div>

            </div>

            {/* Bottom Actions & Price */}
            <div className="p-2.5 sm:p-5 pt-2 sm:pt-4">
              
              <div className="flex items-baseline justify-between mb-2 sm:mb-3">
                <span className="text-[9px] sm:text-xs text-stone-500">اليوم:</span>
                <div className="flex items-baseline gap-0.5 sm:gap-1">
                  <span className="text-sm sm:text-xl font-bold text-amber-800 font-['Amiri']">{guide.dayRate}</span>
                  <span className="text-[8px] sm:text-[10px] text-stone-500">ر.س</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1 sm:gap-2">
                <button
                  onClick={() => setSelectedGuideForBooking(guide)}
                  className="w-full py-1.5 sm:py-2.5 px-1.5 sm:px-3 rounded-xl bg-emerald-800 text-white font-bold text-[10px] sm:text-xs shadow-sm hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-1"
                >
                  <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>حجز</span>
                </button>

                <a
                  href={`tel:${guide.phone}`}
                  className="w-full py-1.5 sm:py-2.5 px-1.5 sm:px-3 rounded-xl bg-[#F8F4EA] border border-[#E6DEC8] text-stone-700 hover:bg-stone-100 font-medium text-[10px] sm:text-xs transition-all flex items-center justify-center gap-1"
                >
                  <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-700" />
                  <span>اتصال</span>
                </a>
              </div>

            </div>

          </div>
        ))}
      </div>

      {/* Booking Modal */}
      <GuideBookingModal
        guide={selectedGuideForBooking}
        isOpen={Boolean(selectedGuideForBooking)}
        onClose={() => setSelectedGuideForBooking(null)}
        onBookingComplete={(booking) => {
          if (onBookingSuccess) {
            onBookingSuccess(booking);
          }
        }}
      />

    </section>
  );
};
