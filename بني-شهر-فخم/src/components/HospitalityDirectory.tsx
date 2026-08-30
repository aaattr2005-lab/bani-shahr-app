import React, { useState } from "react";
import { 
  Hotel, 
  Coffee, 
  TreePine, 
  Compass, 
  Star, 
  MapPin, 
  Phone, 
  Check, 
  Filter, 
  ExternalLink,
  Sparkles
} from "lucide-react";
import { HOSPITALITY_PLACES } from "../data/baniShahrData";
import { HospitalityPlace } from "../types";

export const HospitalityDirectory: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");

  const types = [
    { id: "all", label: "كافة الخدمات والضيافة" },
    { id: "نزل ريفي", label: "نزل وبيوت ريفية" },
    { id: "شاليهات وفنادق", label: "شاليهات ومطلات" },
    { id: "مقهى ومطل", label: "مقاهي السحاب" },
    { id: "مزرعة سياحية", label: "مزارع رمان وعسل" },
    { id: "مرشد ومغامرات", label: "مرشدو هايكنج" },
  ];

  const filteredPlaces = HOSPITALITY_PLACES.filter((place) => {
    const matchesType = selectedType === "all" || place.type === selectedType;
    const matchesCity = selectedCity === "all" || place.city === selectedCity;
    return matchesType && matchesCity;
  });

  return (
    <section id="hospitality" className="py-10 sm:py-20 relative w-full max-w-full overflow-hidden scroll-mt-20 sm:scroll-mt-24 text-stone-900">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold mb-2 sm:mb-3 shadow-sm">
            <Hotel className="w-3.5 h-3.5 text-amber-700" />
            <span>كرم الضيافة والخدمات السياحية</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-['Amiri'] text-[#12201A] mb-2 sm:mb-3">
            دليل الإقامة والمقاهي والمزارع في بني شهر
          </h2>
          <p className="text-[#5A524C] text-xs sm:text-base font-light px-2">
            استمتع بإقامة ريفية فاخرة وسط مزارع الرمان والعرعر، وتذوق القهوة السعودية فوق السحاب، ورافق نخبة المرشدين في قمم تنومة والنماص.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 bg-white p-2.5 sm:p-4 rounded-2xl sm:rounded-3xl border border-[#E6DEC8] mb-6 sm:mb-10 shadow-sm sm:shadow-md">
          
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar pb-1 sm:pb-0">
            {types.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                className={`shrink-0 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-medium transition-colors ${
                  selectedType === t.id
                    ? "bg-amber-700 text-white font-bold shadow-sm"
                    : "bg-[#F8F4EA] text-stone-700 hover:bg-stone-100 border border-[#E6DEC8]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-stone-600">المدينة:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-3 py-1.5 sm:py-2 rounded-xl bg-[#F8F4EA] border border-[#E6DEC8] text-xs text-stone-800 focus:outline-none focus:border-amber-600"
            >
              <option value="all">كافة المدن</option>
              <option value="تنومة">تنومة</option>
              <option value="النماص">النماص</option>
            </select>
          </div>

        </div>

        {/* Places Grid (2 columns on mobile, 3 on lg) */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
          {filteredPlaces.map((place) => (
            <div
              key={place.id}
              className="bg-white rounded-2xl sm:rounded-3xl border border-[#E6DEC8] hover:border-emerald-600/50 overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                
                {/* Photo & Type Tag */}
                <div className="relative aspect-[4/3] sm:h-48 overflow-hidden">
                  <img
                    src={place.imageUrl}
                    alt={place.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                  
                  <div className="absolute top-1.5 sm:top-3 right-1.5 sm:right-3 flex items-center gap-1">
                    <span className="px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-300 text-[9px] sm:text-xs font-semibold border border-amber-600/40 truncate max-w-[75px] sm:max-w-none">
                      {place.type}
                    </span>
                    <span className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-black/60 backdrop-blur-md text-emerald-300 text-[9px] sm:text-xs font-medium hidden sm:inline">
                      {place.city}
                    </span>
                  </div>

                  <div className="absolute bottom-1.5 sm:bottom-3 right-1.5 sm:right-3 flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-black/60 backdrop-blur-md text-[9px] sm:text-xs text-amber-300">
                    <Star className="w-2.5 sm:w-3.5 h-2.5 sm:h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold">{place.rating}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-2.5 sm:p-6">
                  <h3 className="text-xs sm:text-xl font-bold font-['Amiri'] text-[#12201A] mb-1 sm:mb-2 truncate">
                    {place.name}
                  </h3>

                  <div className="flex items-center gap-1 text-[10px] sm:text-xs text-emerald-700 mb-1 sm:mb-3">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{place.location}</span>
                  </div>

                  <p className="text-[#5A524C] text-[10px] sm:text-xs font-light leading-tight sm:leading-relaxed mb-2 sm:mb-4 line-clamp-1 sm:line-clamp-2">
                    {place.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-1 mb-2 sm:mb-4 hidden sm:block">
                    {place.features.slice(0, 2).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-stone-700">
                        <Check className="w-3 h-3 text-emerald-700 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Contact Footer */}
              <div className="p-2.5 sm:p-6 pt-0 border-t border-[#E6DEC8] flex items-center justify-between gap-1 sm:gap-3">
                <span className="text-[9px] sm:text-xs text-stone-500 truncate">
                  <strong className="text-amber-800">{place.priceRange}</strong>
                </span>
                
                {place.phone ? (
                  <a
                    href={`tel:${place.phone}`}
                    className="flex items-center gap-1 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-[10px] sm:text-xs font-semibold shadow-sm transition-colors shrink-0"
                  >
                    <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>اتصال</span>
                  </a>
                ) : (
                  <span className="text-[9px] sm:text-xs text-emerald-700 font-semibold">متاح للزيارة</span>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
