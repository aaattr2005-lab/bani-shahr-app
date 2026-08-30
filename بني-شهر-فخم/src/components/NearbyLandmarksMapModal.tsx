import React, { useState, useEffect, useMemo } from "react";
import { 
  MapPin, 
  Navigation, 
  X, 
  Compass, 
  Star, 
  ChevronRight, 
  ChevronLeft, 
  Layers, 
  TreePine, 
  Castle, 
  Mountain, 
  CloudFog, 
  ExternalLink, 
  Sparkles, 
  LocateFixed, 
  SlidersHorizontal,
  Info,
  Maximize2
} from "lucide-react";
import { Attraction } from "../types";
import { ATTRACTIONS_DATA } from "../data/baniShahrData";
import { DataStore } from "../lib/datastore";

interface NearbyLandmarksMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAttraction: (attraction: Attraction) => void;
  userCoords?: { lat: number; lng: number };
}

// Calculate distance in km between two GPS coordinates
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

export const NearbyLandmarksMapModal: React.FC<NearbyLandmarksMapModalProps> = ({
  isOpen,
  onClose,
  onSelectAttraction,
  userCoords = { lat: 19.1167, lng: 42.1333 } // Center of Al-Namas / Bani Shahr
}) => {
  // Current user GPS position
  const [currentUserPos, setCurrentUserPos] = useState<{ lat: number; lng: number }>(userCoords);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string>("موقع ديار بني شهر الافتراضي (النماص)");
  const [selectedAttractionId, setSelectedAttractionId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [mapZoom, setMapZoom] = useState<number>(1);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(userCoords);

  // Request actual device geolocation if permitted
  const handleGetLiveLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("المتصفح لا يدعم تحديد الموقع، تم استخدام موقع النماص الافتراضي");
      return;
    }
    setIsLocating(true);
    setLocationStatus("جاري تحديد موقعك الجغرافي الدقيق...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCurrentUserPos(coords);
        setMapCenter(coords);
        setIsLocating(false);
        setLocationStatus("تم تحديد موقعك الحالي بنجاح");
      },
      (err) => {
        console.warn("Geolocation error:", err);
        setIsLocating(false);
        setLocationStatus("تعذر الوصول لموقعك الدقيق، تم استخدام مركز ديار بني شهر");
      },
      { timeout: 8000 }
    );
  };

  // Calculate distance for all attractions and sort by closest
  const attractionsWithDistance = useMemo(() => {
    return ATTRACTIONS_DATA.map((item) => {
      const distance = calculateDistanceKm(
        currentUserPos.lat,
        currentUserPos.lng,
        item.coordinates.lat,
        item.coordinates.lng
      );
      const ratingData = DataStore.getAttractionRating(item.id, item.rating, item.reviewsCount);
      return {
        ...item,
        distanceKm: distance,
        dynamicRating: ratingData.rating,
        dynamicReviewsCount: ratingData.count
      };
    }).sort((a, b) => a.distanceKm - b.distanceKm);
  }, [currentUserPos]);

  // Filtered list
  const filteredAttractions = useMemo(() => {
    if (selectedCategory === "all") return attractionsWithDistance;
    return attractionsWithDistance.filter((a) => a.category === selectedCategory);
  }, [attractionsWithDistance, selectedCategory]);

  const activeAttraction = useMemo(() => {
    if (!selectedAttractionId) return filteredAttractions[0] || null;
    return filteredAttractions.find((a) => a.id === selectedAttractionId) || filteredAttractions[0] || null;
  }, [selectedAttractionId, filteredAttractions]);

  // Determine bounding box for plotting pins on styled SVG canvas
  // Region bounds around Tanomah/Namas: Lat ~ 18.80 to 19.35, Lng ~ 41.95 to 42.35
  const minLat = 18.75;
  const maxLat = 19.45;
  const minLng = 41.90;
  const maxLng = 42.40;

  const getPinPosition = (lat: number, lng: number) => {
    // Map Lat/Lng to percentage (0% to 100%)
    // Latitude increases upwards, so inverted for Y
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = 100 - ((lat - minLat) / (maxLat - minLat)) * 100;
    // Bound inside 5% to 95%
    const clampedX = Math.max(5, Math.min(95, x));
    const clampedY = Math.max(5, Math.min(95, y));
    return { left: `${clampedX}%`, top: `${clampedY}%` };
  };

  const userPinPos = getPinPosition(currentUserPos.lat, currentUserPos.lng);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/85 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-5xl bg-stone-900 border border-stone-800 text-stone-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[94vh] max-h-[850px] font-['IBM_Plex_Sans_Arabic',sans-serif]"
        style={{
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.08)"
        }}
      >
        {/* Top Header Bar */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-stone-800 flex items-center justify-between bg-stone-900/95 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-inner shrink-0">
              <Navigation className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white font-['Amiri']">
                  خريطة المعالم التفاعلية (بالقرب مني)
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                  {filteredAttractions.length} معلم حولك
                </span>
              </div>
              <p className="text-xs text-stone-400 truncate max-w-xs sm:max-w-md">
                {locationStatus}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGetLiveLocation}
              disabled={isLocating}
              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-emerald-300 border border-stone-700 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              title="تحديد موقعك الجغرافي الفعلي"
            >
              <LocateFixed className={`w-4 h-4 ${isLocating ? "animate-spin text-amber-400" : "text-emerald-400"}`} />
              <span className="hidden sm:inline">{isLocating ? "جاري التحديد..." : "موقعي الحالي"}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
              aria-label="إغلاق الخريطة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="px-4 py-2.5 bg-stone-950/80 border-b border-stone-800 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: "all", label: "جميع المعالم", icon: Compass },
            { id: "nature", label: "شلالات وطبيعة", icon: TreePine },
            { id: "heritage", label: "قلاع وقرى أثرية", icon: Castle },
            { id: "hiking", label: "مسارات هايكنج", icon: Mountain },
            { id: "viewpoints", label: "مطلات وضباب", icon: CloudFog },
          ].map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-950 border border-emerald-400/40"
                    : "bg-stone-900 text-stone-300 hover:text-white border border-stone-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Map & Side Sheet Split View */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden relative">
          
          {/* MAP CANVAS AREA */}
          <div className="flex-1 relative bg-gradient-to-br from-[#12231A] via-[#1A2E23] to-[#0E1A13] overflow-hidden select-none border-b md:border-b-0 md:border-l border-stone-800">
            
            {/* Topographic Background Pattern & Contour Grid */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />
            
            {/* Mountain Range Topography Vector Illustrations */}
            <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="topo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#C7A25C" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              {/* Topographic contours */}
              <ellipse cx="50%" cy="45%" rx="35%" ry="25%" fill="none" stroke="url(#topo-grad)" strokeWidth="1.5" strokeDasharray="6 4" />
              <ellipse cx="50%" cy="45%" rx="22%" ry="16%" fill="none" stroke="url(#topo-grad)" strokeWidth="1.5" />
              <ellipse cx="50%" cy="45%" rx="10%" ry="7%" fill="none" stroke="url(#topo-grad)" strokeWidth="1.5" />
              <path d="M 0,200 Q 250,120 500,220 T 1000,180" fill="none" stroke="#10B981" strokeWidth="1" opacity="0.3" />
              <path d="M 0,400 Q 300,320 600,420 T 1200,380" fill="none" stroke="#C7A25C" strokeWidth="1" opacity="0.2" />
            </svg>

            {/* Geographical Zones Labels */}
            <div className="absolute top-4 right-6 text-stone-500 font-bold text-[11px] uppercase tracking-widest pointer-events-none">
              سراة بني شهر (جبال السروات)
            </div>
            <div className="absolute bottom-6 left-6 text-stone-600 font-bold text-[11px] uppercase tracking-widest pointer-events-none">
              منحدرات تهامة بني شهر
            </div>
            <div className="absolute top-1/2 left-4 text-emerald-500/40 text-[10px] font-mono pointer-events-none -rotate-90">
              N 19° 07' • E 42° 08'
            </div>

            {/* USER LOCATION PIN (Pulsing Radar Pin) */}
            <div 
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-700"
              style={userPinPos}
              title="موقعك الحالي / نقطة الارتكاز"
            >
              <div className="relative flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-blue-400 opacity-60" />
                <div className="relative w-7 h-7 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white font-bold text-xs">
                  <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                </div>
                <span className="absolute -bottom-6 px-2 py-0.5 rounded bg-blue-950/90 text-blue-200 border border-blue-500/40 text-[10px] font-bold whitespace-nowrap shadow-md">
                  أنت هنا
                </span>
              </div>
            </div>

            {/* LANDMARK PINS */}
            {filteredAttractions.map((attr) => {
              const pos = getPinPosition(attr.coordinates.lat, attr.coordinates.lng);
              const isSelected = activeAttraction?.id === attr.id;

              return (
                <div
                  key={attr.id}
                  onClick={() => setSelectedAttractionId(attr.id)}
                  className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 group ${
                    isSelected ? "z-30 scale-125" : "hover:scale-115 hover:z-20"
                  }`}
                  style={pos}
                >
                  <div className="relative flex flex-col items-center">
                    
                    {/* Pin Badge */}
                    <div 
                      className={`px-2.5 py-1 rounded-2xl flex items-center gap-1.5 shadow-xl transition-all border ${
                        isSelected
                          ? "bg-amber-500 text-stone-950 border-white ring-4 ring-amber-500/30 font-bold"
                          : "bg-stone-900/90 hover:bg-emerald-800 text-white border-stone-700 hover:border-emerald-400"
                      }`}
                    >
                      <MapPin className={`w-3.5 h-3.5 ${isSelected ? "text-stone-950 fill-stone-950" : "text-emerald-400 fill-emerald-400"}`} />
                      <span className="text-xs font-bold whitespace-nowrap max-w-[120px] truncate">
                        {attr.name}
                      </span>
                    </div>

                    {/* Distance Tag */}
                    <span 
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono mt-0.5 border shadow ${
                        isSelected 
                          ? "bg-amber-950 text-amber-300 border-amber-500/40 font-bold" 
                          : "bg-black/80 text-emerald-300 border-emerald-500/30"
                      }`}
                    >
                      {attr.distanceKm} كم
                    </span>

                    {/* Pin pointer triangle */}
                    <div 
                      className={`w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent ${
                        isSelected ? "border-t-[6px] border-t-amber-500" : "border-t-[6px] border-t-stone-900"
                      }`} 
                    />
                  </div>
                </div>
              );
            })}

            {/* Map Legend Overlay */}
            <div className="absolute bottom-3 right-3 p-2.5 rounded-2xl bg-stone-950/90 backdrop-blur-md border border-stone-800 text-[11px] space-y-1.5 shadow-lg hidden sm:block">
              <div className="flex items-center gap-2 text-stone-300">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                <span>موقعك الحالي</span>
              </div>
              <div className="flex items-center gap-2 text-stone-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span>معلم سياحي وتراثي</span>
              </div>
              <div className="flex items-center gap-2 text-stone-300">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                <span>المعلم المحدد حالياً</span>
              </div>
            </div>

          </div>

          {/* SIDE/BOTTOM ATTRACTIONS LIST & SELECTED CARD SHEET */}
          <div className="w-full md:w-80 lg:w-96 bg-stone-900 flex flex-col shrink-0 overflow-hidden">
            
            {/* Active Highlighted Attraction Header Card */}
            {activeAttraction && (
              <div className="p-4 bg-gradient-to-b from-stone-850 to-stone-900 border-b border-stone-800 space-y-3 shrink-0 shadow-lg">
                <div className="relative h-36 rounded-2xl overflow-hidden bg-stone-950">
                  <img
                    src={activeAttraction.imageUrl}
                    alt={activeAttraction.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />
                  
                  <div className="absolute top-2.5 right-2.5">
                    <span className="px-2 py-0.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-emerald-300 text-[11px] font-bold">
                      {activeAttraction.city}
                    </span>
                  </div>

                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded-xl bg-amber-500/90 text-stone-950 text-[11px] font-mono font-bold flex items-center gap-1 shadow">
                      <Navigation className="w-3 h-3" />
                      {activeAttraction.distanceKm} كم منك
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 right-3 left-3">
                    <h3 className="text-base font-bold text-white font-['Amiri'] truncate">
                      {activeAttraction.name}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{activeAttraction.dynamicRating}</span>
                    <span className="text-stone-400">({activeAttraction.dynamicReviewsCount} مراجعة)</span>
                  </div>
                  <span className="text-stone-300 text-[11px] font-mono bg-stone-950 px-2 py-0.5 rounded-lg border border-stone-800">
                    الارتفاع: {activeAttraction.elevation}
                  </span>
                </div>

                <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
                  {activeAttraction.description}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      onClose();
                      onSelectAttraction(activeAttraction);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow flex items-center justify-center gap-1.5"
                  >
                    <span>فتح التفاصيل</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${activeAttraction.coordinates.lat},${activeAttraction.coordinates.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-colors border border-stone-700 flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                    <span>ملاحة الخرائط</span>
                  </a>
                </div>
              </div>
            )}

            {/* Scrollable Nearby Ranked List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-stone-700">
              <div className="px-1 text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center justify-between">
                <span>مرتبة حسب المسافة الأقرب إليك</span>
                <span className="text-emerald-400 font-mono">{filteredAttractions.length}</span>
              </div>

              {filteredAttractions.map((attraction, idx) => {
                const isSelected = activeAttraction?.id === attraction.id;
                return (
                  <div
                    key={attraction.id}
                    onClick={() => setSelectedAttractionId(attraction.id)}
                    className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? "bg-emerald-950/40 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30"
                        : "bg-stone-950/70 border-stone-800/80 hover:border-stone-700 hover:bg-stone-800/40"
                    }`}
                  >
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-stone-900 shrink-0">
                      <img
                        src={attraction.imageUrl}
                        alt={attraction.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0 right-0 left-0 bg-black/70 text-[9px] text-center font-mono font-bold text-amber-300">
                        #{idx + 1}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white truncate">{attraction.name}</h4>
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/60 shrink-0">
                          {attraction.distanceKm} كم
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400 mt-0.5 flex items-center gap-1">
                        <span>{attraction.city}</span>
                        <span>•</span>
                        <span className="text-amber-400 flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-amber-400" />
                          {attraction.dynamicRating}
                        </span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
