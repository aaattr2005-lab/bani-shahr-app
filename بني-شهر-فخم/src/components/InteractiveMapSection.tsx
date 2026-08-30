import React, { useState } from "react";
import { ATTRACTIONS_DATA, HIKING_TRAILS_DATA, TOUR_GUIDES_DATA } from "../data/baniShahrData";
import { 
  MapPin, 
  Layers, 
  Navigation, 
  Compass, 
  Mountain, 
  ExternalLink, 
  Sparkles, 
  Info,
  Maximize2,
  TreePine,
  Landmark,
  Footprints
} from "lucide-react";
import { WeatherWidget } from "./WeatherWidget";

interface MapPinItem {
  id: string;
  name: string;
  type: "nature" | "heritage" | "hiking" | "guide";
  city: string;
  coords: { lat: number; lng: number };
  elevation?: string;
  desc: string;
  image: string;
}

export const InteractiveMapSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<"all" | "nature" | "heritage" | "hiking">("all");
  const [selectedPin, setSelectedPin] = useState<MapPinItem | null>(null);

  // Consolidated map locations
  const pins: MapPinItem[] = [
    {
      id: "pin-1",
      name: "شلال الدهناء والبحيرة الجبلية",
      type: "nature",
      city: "تنومة",
      coords: { lat: 18.9482, lng: 42.1528 },
      elevation: "2,200 م",
      desc: "أشهر شلالات السراة الجارية وسط غابات العرعر والمسطحات الخضراء.",
      image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "pin-2",
      name: "قصر المقر الحضاري والقرية التراثية",
      type: "heritage",
      city: "النماص",
      coords: { lat: 19.1167, lng: 42.1333 },
      elevation: "2,450 م",
      desc: "تحفة معمارية أندلسية فريدة بأكثر من 20 ألف قطعة أثرية ومخطوطة.",
      image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "pin-3",
      name: "جبل مَنعاء ومسار الهايكنج الصخري",
      type: "hiking",
      city: "تنومة",
      coords: { lat: 18.9612, lng: 42.1741 },
      elevation: "2,600 م",
      desc: "تكوينات جرانيتية أسطورية ونقوش ثمودية ومسارات تسلق عالمية.",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "pin-4",
      name: "منتزه المحفار وغابات العرعر",
      type: "nature",
      city: "تنومة",
      coords: { lat: 18.932, lng: 42.141 },
      elevation: "2,350 م",
      desc: "مطل شاهق على منحدرات تهامة وسط الضباب الدائم وأشجار العرعر.",
      image: "https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "pin-5",
      name: "قرية الغال التراثية وحصون الحجر",
      type: "heritage",
      city: "النماص",
      coords: { lat: 19.145, lng: 42.112 },
      elevation: "2,380 م",
      desc: "قرية حجرية أصيلة بقصبات مراقبة دفاعية ومدرجات زراعية.",
      image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "pin-6",
      name: "شعف آل وليد ومطلات السحاب",
      type: "nature",
      city: "النماص",
      coords: { lat: 19.135, lng: 42.14 },
      elevation: "2,500 م",
      desc: "قمم تعانق الضباب وإطلالات بانورامية مفتوحة على تهامة.",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "pin-7",
      name: "وادي خاط وجبال ثربان الخضراء",
      type: "nature",
      city: "المجاردة",
      coords: { lat: 19.124, lng: 41.912 },
      elevation: "800 م",
      desc: "مياه جارية ومزارع استوائية دافئة في تهامة بني شهر.",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const filteredPins = activeFilter === "all" 
    ? pins 
    : pins.filter(p => p.type === activeFilter);

  const getPinIcon = (type: MapPinItem["type"]) => {
    switch (type) {
      case "nature":
        return <TreePine className="w-3.5 h-3.5 text-emerald-300" />;
      case "heritage":
        return <Landmark className="w-3.5 h-3.5 text-amber-300" />;
      case "hiking":
        return <Footprints className="w-3.5 h-3.5 text-teal-300" />;
      default:
        return <MapPin className="w-3.5 h-3.5 text-white" />;
    }
  };

  const getPinColor = (type: MapPinItem["type"]) => {
    switch (type) {
      case "nature":
        return "bg-emerald-700 border-emerald-500";
      case "heritage":
        return "bg-amber-700 border-amber-500";
      case "hiking":
        return "bg-teal-700 border-teal-500";
      default:
        return "bg-emerald-700 border-emerald-500";
    }
  };

  return (
    <section id="interactive-map" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full max-w-full overflow-hidden scroll-mt-20 sm:scroll-mt-24">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-4 shadow-inner">
          <Navigation className="w-3.5 h-3.5 text-emerald-400" />
          <span>الخريطة التفاعلية لديار بني شهر</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-[#12201A] font-['Amiri'] tracking-wide">
          استكشف جغرافية السراة وتهامة والمعالم بنقرة واحدة
        </h2>

        <p className="mt-3 text-[#5A524C] text-sm sm:text-base leading-relaxed">
          خريطة رقمية مخصصة توضح ترابط محافظات ومراكز بني شهر (النماص، تنومة، المجاردة، خاط، وثربان) مع إحداثيات GPS ونقاط الجذب السياحي والمغامرات.
        </p>

        {/* Filter Pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {[
            { id: "all", label: "كافة المعالم والمسارات" },
            { id: "nature", label: "الطبيعة والشلالات" },
            { id: "heritage", label: "القصور والمتاحف" },
            { id: "hiking", label: "مسارات الهايكنج" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeFilter === tab.id
                  ? "bg-emerald-800 text-white font-bold shadow-sm"
                  : "bg-white border border-[#E6DEC8] text-stone-600 hover:text-stone-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* Weather Widget (خدمة الطقس الحالية لمساعدة السياح) */}
      <WeatherWidget />

      {/* Map Board Container */}
      <div className="relative rounded-3xl bg-white border border-[#E6DEC8] overflow-hidden shadow-md p-4 sm:p-6 flex flex-col lg:flex-row gap-6">
        
        {/* Visual Map Stage (Stylized High-Contrast Topographical Canvas) */}
        <div className="relative flex-1 min-h-[420px] rounded-2xl bg-gradient-to-b from-[#F5EFE6] via-[#F8F4EA] to-[#EAE0D0] border border-[#E6DEC8] overflow-hidden flex items-center justify-center p-4">
          
          {/* Topographic Background Gradients & Grid Lines */}
          <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:24px_24px]" />
          
          {/* Regional Geography Zones Outline */}
          <div className="absolute inset-x-8 top-10 bottom-10 rounded-3xl border border-dashed border-emerald-600/30 pointer-events-none flex flex-col justify-between p-4">
            <div className="flex justify-between items-center text-[11px] text-emerald-800 font-mono font-semibold">
              <span>شمالاً: سراة بني شهر (النماص - 2,500 م)</span>
              <span>جبال السروات الشاهقة</span>
            </div>
            <div className="flex justify-between items-center text-[11px] text-teal-800 font-mono font-semibold">
              <span>وسطاً: تنومة وشلال الدهناء وجبل منعاء (2,600 م)</span>
              <span>سلاسل الجرانيت والضباب</span>
            </div>
            <div className="flex justify-between items-center text-[11px] text-amber-800 font-mono font-semibold">
              <span>غرباً وجنوباً: تهامة بني شهر (المجاردة، خاط، ثربان - 800 م)</span>
              <span>الأودية والينابيع الدافئة</span>
            </div>
          </div>

          {/* Interactive Pins Nodes */}
          <div className="relative w-full h-full min-h-[380px] flex flex-wrap items-center justify-around gap-4 p-4 z-10">
            {filteredPins.map((pin, index) => {
              const isSelected = selectedPin?.id === pin.id;
              return (
                <button
                  key={pin.id}
                  onClick={() => setSelectedPin(pin)}
                  className={`group relative flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-2xl border transition-all duration-300 ${
                    isSelected
                      ? "bg-emerald-900 border-emerald-600 text-white shadow-lg scale-105"
                      : "bg-white/90 border-[#E6DEC8] text-stone-800 hover:border-emerald-600 hover:bg-white shadow-sm"
                  }`}
                  style={{
                    transform: `translateY(${((index % 3) - 1) * 12}px)`,
                  }}
                >
                  <div className={`p-1.5 rounded-xl border shadow-sm ${getPinColor(pin.type)}`}>
                    {getPinIcon(pin.type)}
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold block font-['Amiri']">{pin.name}</span>
                    <span className={`text-[10px] ${isSelected ? "text-emerald-200" : "text-stone-500"}`}>{pin.city} {pin.elevation ? `(${pin.elevation})` : ""}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Map Compass */}
          <div className="absolute top-4 left-4 p-2.5 rounded-2xl bg-white/90 backdrop-blur-md border border-[#E6DEC8] text-stone-700 flex items-center gap-2 text-xs shadow-sm">
            <Compass className="w-4 h-4 text-emerald-700 animate-spin" style={{ animationDuration: "12s" }} />
            <span className="font-mono font-bold">N 19°07' E 42°08'</span>
          </div>

        </div>

        {/* Selected Location Details Panel */}
        <div className="w-full lg:w-80 flex flex-col justify-between bg-[#F8F4EA] rounded-2xl border border-[#E6DEC8] p-5 shadow-sm">
          {selectedPin ? (
            <div className="space-y-4">
              <div className="relative h-40 rounded-xl overflow-hidden shadow-sm">
                <img 
                  src={selectedPin.image} 
                  alt={selectedPin.name} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-black/70 text-[10px] font-bold text-amber-300">
                  {selectedPin.city}
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#12201A] font-['Amiri']">{selectedPin.name}</h3>
                {selectedPin.elevation && (
                  <span className="text-xs text-emerald-800 font-medium block mt-0.5">
                    الارتفاع عن سطح البحر: {selectedPin.elevation}
                  </span>
                )}
                <p className="text-xs text-[#5A524C] mt-2 leading-relaxed">{selectedPin.desc}</p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#E6DEC8] text-[11px] text-stone-600 space-y-1 shadow-sm">
                <div className="flex justify-between">
                  <span>خط العرض:</span>
                  <span className="font-mono text-stone-800 font-bold">{selectedPin.coords.lat}</span>
                </div>
                <div className="flex justify-between">
                  <span>خط الطول:</span>
                  <span className="font-mono text-stone-800 font-bold">{selectedPin.coords.lng}</span>
                </div>
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${selectedPin.coords.lat},${selectedPin.coords.lng}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>فتح الاتجاهات في خرائط Google</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-stone-500 space-y-3">
              <MapPin className="w-10 h-10 text-emerald-600" />
              <div>
                <h4 className="text-sm font-bold text-stone-800">اختر معلماً من الخريطة</h4>
                <p className="text-xs text-stone-500 mt-1">انقر على أي نقطة أو معلم لاستعراض تفاصيله وإحداثياته الجغرافية والتنقل المباشر.</p>
              </div>
            </div>
          )}
        </div>

      </div>

    </section>
  );
};
export default InteractiveMapSection;
