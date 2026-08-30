import React, { useState } from "react";
import { VILLAGES_DATA, HIKING_TRAILS_DATA, MUSEUMS_DATA } from "../data/baniShahrData";
import { Village, HikingTrail, Museum } from "../types";
import { 
  Footprints, 
  Landmark, 
  Compass, 
  MapPin, 
  Mountain, 
  Clock, 
  ShieldAlert, 
  Sparkles, 
  Layers, 
  Ticket, 
  Phone,
  ChevronRight,
  TrendingUp
} from "lucide-react";

export const VillagesAndHikingSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"villages" | "hiking" | "museums">("villages");
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null);
  const [selectedTrail, setSelectedTrail] = useState<HikingTrail | null>(null);
  const [selectedMuseum, setSelectedMuseum] = useState<Museum | null>(null);

  return (
    <section id="villages-and-trails" className="py-10 sm:py-20 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full max-w-full overflow-hidden scroll-mt-20 sm:scroll-mt-24">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3 sm:mb-4 shadow-inner">
          <Mountain className="w-3.5 h-3.5 text-emerald-400" />
          <span>القرى والمسارات الجبلية والمتاحف</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-bold text-[#12201A] font-['Amiri'] tracking-wide">
          استكشف قرى بني شهر، مسارات الهايكنج والمتاحف
        </h2>

        <p className="mt-2 sm:mt-3 text-[#5A524C] text-xs sm:text-base leading-relaxed px-2">
          دليلك الشامل لقرى السراة وتهامة العريقة، مسارات المشي وتسلق الجرانيت في جبل منعاء، والمتاحف التراثية النادرة.
        </p>

        {/* Tab Switcher */}
        <div className="mt-4 sm:mt-8 flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 bg-white rounded-2xl border border-[#E6DEC8] shadow-sm max-w-full">
          <button
            onClick={() => setActiveTab("villages")}
            className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-sm font-bold transition-all flex items-center gap-1.5 sm:gap-2 ${
              activeTab === "villages"
                ? "bg-emerald-800 text-white shadow-sm"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Landmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>القرى ({VILLAGES_DATA.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("hiking")}
            className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-sm font-bold transition-all flex items-center gap-1.5 sm:gap-2 ${
              activeTab === "hiking"
                ? "bg-emerald-800 text-white shadow-sm"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Footprints className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>المسارات ({HIKING_TRAILS_DATA.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("museums")}
            className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-sm font-bold transition-all flex items-center gap-1.5 sm:gap-2 ${
              activeTab === "museums"
                ? "bg-emerald-800 text-white shadow-sm"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Ticket className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>المتاحف ({MUSEUMS_DATA.length})</span>
          </button>
        </div>

      </div>

      {/* TAB 1: VILLAGES (2 columns on mobile, 3 on lg) */}
      {activeTab === "villages" && (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
          {VILLAGES_DATA.map((village) => (
            <div
              key={village.id}
              onClick={() => setSelectedVillage(village)}
              className="group cursor-pointer bg-white rounded-2xl sm:rounded-3xl border border-[#E6DEC8] hover:border-emerald-600/50 transition-all duration-300 shadow-sm hover:shadow-lg overflow-hidden hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] sm:h-48">
                <img
                  src={village.imageUrl}
                  alt={village.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                <div className="absolute top-1.5 sm:top-3 left-1.5 sm:left-3 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-[9px] sm:text-[11px] font-medium text-emerald-300 flex items-center gap-1">
                  <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400" />
                  <span>{village.elevation}</span>
                </div>

                <div className="absolute bottom-1.5 sm:bottom-3 right-1.5 sm:right-3 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-[9px] sm:text-[11px] font-bold text-amber-300 flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" />
                  <span>{village.region}</span>
                </div>
              </div>

              <div className="p-2.5 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs sm:text-lg font-bold text-[#12201A] font-['Amiri'] group-hover:text-emerald-800 transition-colors truncate">
                    {village.name}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-emerald-700 font-medium mt-0.5 truncate">
                    {village.tribalBranch}
                  </p>
                  <p className="text-[10px] sm:text-xs text-[#5A524C] mt-1 sm:mt-2.5 line-clamp-1 sm:line-clamp-2 leading-tight sm:leading-relaxed">
                    {village.description}
                  </p>
                </div>

                <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-[#E6DEC8] flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {village.famousFor.slice(0, 1).map((item, i) => (
                      <span key={i} className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg bg-[#F8F4EA] border border-[#E6DEC8] text-stone-700 truncate max-w-[80px] sm:max-w-none">
                        {item}
                      </span>
                    ))}
                  </div>

                  <span className="text-[10px] sm:text-xs text-emerald-800 font-bold flex items-center gap-0.5 group-hover:translate-x-[-2px] transition-transform shrink-0">
                    تفاصيل
                    <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 rotate-180" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: HIKING TRAILS (2 columns on mobile, 2 on md) */}
      {activeTab === "hiking" && (
        <div className="grid grid-cols-2 md:grid-cols-2 gap-2.5 sm:gap-6">
          {HIKING_TRAILS_DATA.map((trail) => (
            <div
              key={trail.id}
              onClick={() => setSelectedTrail(trail)}
              className="group cursor-pointer bg-white rounded-2xl sm:rounded-3xl border border-[#E6DEC8] hover:border-emerald-600/50 transition-all duration-300 shadow-sm hover:shadow-lg overflow-hidden hover:-translate-y-1 flex flex-col sm:flex-row justify-between"
            >
              <div className="sm:w-2/5 relative aspect-[4/3] sm:aspect-auto sm:h-auto overflow-hidden">
                <img
                  src={trail.imageUrl}
                  alt={trail.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                />
                <div className="absolute top-1.5 sm:top-3 right-1.5 sm:right-3 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-[9px] sm:text-[10px] font-bold text-amber-300">
                  {trail.difficulty}
                </div>
              </div>

              <div className="p-2.5 sm:p-5 sm:w-3/5 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs text-emerald-800 font-semibold mb-0.5 sm:mb-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{trail.location}</span>
                  </div>

                  <h3 className="text-xs sm:text-base font-bold text-[#12201A] font-['Amiri'] group-hover:text-emerald-800 transition-colors truncate">
                    {trail.title}
                  </h3>

                  <p className="text-[10px] sm:text-xs text-[#5A524C] mt-1 line-clamp-1 sm:line-clamp-2 leading-tight sm:leading-relaxed">
                    {trail.description}
                  </p>
                </div>

                <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-[#E6DEC8] grid grid-cols-3 gap-1 sm:gap-2 text-center text-xs">
                  <div className="p-1 sm:p-1.5 rounded-lg sm:rounded-xl bg-[#F8F4EA]">
                    <span className="text-[8px] sm:text-[10px] text-stone-500 block">المسافة</span>
                    <span className="font-bold text-stone-800 text-[10px] sm:text-xs">{trail.distanceKm} كم</span>
                  </div>
                  <div className="p-1 sm:p-1.5 rounded-lg sm:rounded-xl bg-[#F8F4EA]">
                    <span className="text-[8px] sm:text-[10px] text-stone-500 block">المدة</span>
                    <span className="font-bold text-amber-800 text-[10px] sm:text-xs">{trail.durationHours}</span>
                  </div>
                  <div className="p-1 sm:p-1.5 rounded-lg sm:rounded-xl bg-[#F8F4EA]">
                    <span className="text-[8px] sm:text-[10px] text-stone-500 block">الارتفاع</span>
                    <span className="font-bold text-emerald-800 text-[10px] sm:text-xs truncate">{trail.elevationGain}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: MUSEUMS (2 columns on mobile, 4 on lg) */}
      {activeTab === "museums" && (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {MUSEUMS_DATA.map((museum) => (
            <div
              key={museum.id}
              onClick={() => setSelectedMuseum(museum)}
              className="group cursor-pointer bg-white rounded-2xl sm:rounded-3xl border border-[#E6DEC8] hover:border-emerald-600/50 transition-all duration-300 shadow-sm hover:shadow-lg overflow-hidden hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] sm:h-44">
                <img
                  src={museum.imageUrl}
                  alt={museum.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                <div className="absolute bottom-1.5 sm:bottom-3 right-1.5 sm:right-3 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-[9px] sm:text-[10px] font-bold text-emerald-300 flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400" />
                  <span>{museum.city}</span>
                </div>
              </div>

              <div className="p-2.5 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs sm:text-base font-bold text-[#12201A] font-['Amiri'] group-hover:text-emerald-800 transition-colors truncate">
                    {museum.name}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-amber-800 font-medium mt-0.5 truncate">{museum.owner}</p>
                  <p className="text-[10px] sm:text-xs text-[#5A524C] mt-1 line-clamp-1 sm:line-clamp-2 leading-tight sm:leading-relaxed">{museum.description}</p>
                </div>

                <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-[#E6DEC8] space-y-1 text-[9px] sm:text-xs text-stone-500">
                  <div className="flex justify-between">
                    <span>التذكرة:</span>
                    <span className="font-bold text-stone-800">{museum.ticketPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>المقتنيات:</span>
                    <span className="font-bold text-emerald-800">{museum.artifactsCount}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Village Details */}
      {selectedVillage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white border border-[#E6DEC8] rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="relative rounded-2xl overflow-hidden h-48">
              <img src={selectedVillage.imageUrl} alt={selectedVillage.name} className="w-full h-full object-cover" />
              <button
                onClick={() => setSelectedVillage(null)}
                className="absolute top-3 left-3 p-2 rounded-full bg-black/70 text-white hover:bg-black/90"
              >
                ✕
              </button>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-[#12201A] font-['Amiri']">{selectedVillage.name}</h3>
              <span className="text-xs text-emerald-800 font-bold block mt-0.5">{selectedVillage.tribalBranch} - {selectedVillage.region} ({selectedVillage.elevation})</span>
              <p className="text-xs text-[#5A524C] mt-3 leading-relaxed">{selectedVillage.description}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F8F4EA] border border-[#E6DEC8] text-xs">
              <span className="font-bold text-amber-800 block mb-1.5">التاريخ والحصون المعمارية:</span>
              <p className="text-stone-700 leading-relaxed">{selectedVillage.historyAndCastles}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F8F4EA] border border-[#E6DEC8] text-xs">
              <span className="font-bold text-stone-800 block mb-1.5">أبرز ما تشتهر به القرية:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedVillage.famousFor.map((f, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-white border border-[#E6DEC8] text-stone-700">
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedVillage(null)}
              className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-xs transition-colors"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* Modal: Trail Details */}
      {selectedTrail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white border border-[#E6DEC8] rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="relative rounded-2xl overflow-hidden h-48">
              <img src={selectedTrail.imageUrl} alt={selectedTrail.title} className="w-full h-full object-cover" />
              <button
                onClick={() => setSelectedTrail(null)}
                className="absolute top-3 left-3 p-2 rounded-full bg-black/70 text-white hover:bg-black/90"
              >
                ✕
              </button>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#12201A] font-['Amiri']">{selectedTrail.title}</h3>
              <span className="text-xs text-emerald-800 font-bold block mt-0.5">{selectedTrail.location} - الصعوبة: {selectedTrail.difficulty}</span>
              <p className="text-xs text-[#5A524C] mt-2.5 leading-relaxed">{selectedTrail.description}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F8F4EA] border border-[#E6DEC8] text-xs">
              <span className="font-bold text-amber-800 block mb-2">المعدات المطلوبة للهايكنج:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedTrail.requiredGear.map((gear, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-white border border-[#E6DEC8] text-stone-700">
                    ✓ {gear}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F8F4EA] border border-[#E6DEC8] text-xs">
              <span className="font-bold text-emerald-800 block mb-1">تعليمات السلامة:</span>
              {selectedTrail.safetyTips.map((tip, i) => (
                <p key={i} className="text-stone-700 leading-relaxed mt-1">• {tip}</p>
              ))}
            </div>

            <button
              onClick={() => setSelectedTrail(null)}
              className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-xs transition-colors"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* Modal: Museum Details */}
      {selectedMuseum && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white border border-[#E6DEC8] rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="relative rounded-2xl overflow-hidden h-48">
              <img src={selectedMuseum.imageUrl} alt={selectedMuseum.name} className="w-full h-full object-cover" />
              <button
                onClick={() => setSelectedMuseum(null)}
                className="absolute top-3 left-3 p-2 rounded-full bg-black/70 text-white hover:bg-black/90"
              >
                ✕
              </button>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#12201A] font-['Amiri']">{selectedMuseum.name}</h3>
              <span className="text-xs text-emerald-800 font-bold block mt-0.5">{selectedMuseum.location}</span>
              <p className="text-xs text-[#5A524C] mt-2.5 leading-relaxed">{selectedMuseum.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs p-3 bg-[#F8F4EA] rounded-2xl border border-[#E6DEC8]">
              <div>
                <span className="text-stone-500 block">أوقات العمل:</span>
                <span className="font-bold text-stone-800">{selectedMuseum.workingHours}</span>
              </div>
              <div>
                <span className="text-stone-500 block">التذكرة:</span>
                <span className="font-bold text-amber-800">{selectedMuseum.ticketPrice}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F8F4EA] border border-[#E6DEC8] text-xs">
              <span className="font-bold text-stone-800 block mb-2">أبرز المقتنيات:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedMuseum.highlights.map((h, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-white border border-[#E6DEC8] text-stone-700">
                    {h}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <a
                href={`tel:${selectedMuseum.phone}`}
                className="flex-1 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-center font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>الاتصال بالمتحف ({selectedMuseum.phone})</span>
              </a>

              <button
                onClick={() => setSelectedMuseum(null)}
                className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-xs transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
