import React, { useState, useEffect } from "react";
import { 
  MapPin, 
  Search, 
  Filter, 
  Star, 
  Mountain, 
  Clock, 
  Bookmark, 
  Heart,
  Check, 
  Navigation, 
  Layers, 
  Sparkles, 
  X,
  Compass, 
  TreePine, 
  Castle, 
  CloudFog, 
  Eye, 
  Share2, 
  ArrowRight, 
  ExternalLink, 
  MessageSquare, 
  Thermometer, 
  Wind,
  LocateFixed,
  Map as MapIcon,
  Utensils,
  Calendar,
  History,
  Landmark
} from "lucide-react";
import { ATTRACTIONS_DATA } from "../../data/baniShahrData";
import { Attraction, CategoryType, AttractionFilterChip } from "../../types";
import { ShareModal } from "../ShareModal";
import { NearbyLandmarksMapModal } from "../NearbyLandmarksMapModal";
import { AttractionReviewsSection } from "../AttractionReviewsSection";
import { DataStore } from "../../lib/datastore";

interface AttractionsPageProps {
  onBack?: () => void;
  onBackToHome: () => void;
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
  onAskAiAboutAttraction: (attraction: Attraction) => void;
}

export const AttractionsPage: React.FC<AttractionsPageProps> = ({
  onBack,
  onBackToHome,
  bookmarkedIds,
  onToggleBookmark,
  onAskAiAboutAttraction,
}) => {
  const [selectedChip, setSelectedChip] = useState<AttractionFilterChip>("الكل");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [activeAttraction, setActiveAttraction] = useState<Attraction | null>(null);
  const [sharingAttraction, setSharingAttraction] = useState<Attraction | null>(null);
  const [isNearbyMapOpen, setIsNearbyMapOpen] = useState(false);
  const [reviewUpdateTick, setReviewUpdateTick] = useState(0);

  // Sync with browser/device back navigation
  useEffect(() => {
    const handlePop = () => {
      if (activeAttraction) {
        setActiveAttraction(null);
        return;
      }
      if (sharingAttraction) {
        setSharingAttraction(null);
        return;
      }
      if (isNearbyMapOpen) {
        setIsNearbyMapOpen(false);
        return;
      }
    };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, [activeAttraction, sharingAttraction, isNearbyMapOpen]);

  const categoryChips: { id: AttractionFilterChip; label: string; icon: any; count: number }[] = [
    { 
      id: "الكل", 
      label: "الكل", 
      icon: Compass, 
      count: ATTRACTIONS_DATA.length 
    },
    { 
      id: "طبيعة", 
      label: "طبيعة", 
      icon: TreePine, 
      count: ATTRACTIONS_DATA.filter(a => a.category === "nature" || a.category === "viewpoints" || a.tags.some(t => ["طبيعة", "شلالات", "مطلات", "جبال", "أودية"].includes(t))).length 
    },
    { 
      id: "تراث", 
      label: "تراث", 
      icon: Landmark, 
      count: ATTRACTIONS_DATA.filter(a => a.category === "heritage" || a.category === "museums" || a.tags.some(t => ["تراث", "قلاع", "متاحف", "آثار", "تاريخ"].includes(t))).length 
    },
    { 
      id: "مطاعم", 
      label: "مطاعم", 
      icon: Utensils, 
      count: ATTRACTIONS_DATA.filter(a => a.tags.some(t => ["مطاعم", "أكلات شعبية", "ميفا", "مطبخ", "عسل", "ضيافة"].includes(t)) || a.name.includes("مطعم") || a.name.includes("مطبخ")).length 
    },
    { 
      id: "فعاليات", 
      label: "فعاليات", 
      icon: Calendar, 
      count: ATTRACTIONS_DATA.filter(a => a.tags.some(t => ["فعاليات", "مهرجانات", "صيف", "ترفيه", "فلكلور", "عرضة"].includes(t)) || a.name.includes("مهرجان") || a.name.includes("فعاليات")).length 
    },
    { 
      id: "ديار قديمة", 
      label: "ديار قديمة", 
      icon: History, 
      count: ATTRACTIONS_DATA.filter(a => a.tags.some(t => ["ديار قديمة", "قرى تراثية", "حصون"].includes(t)) || a.name.includes("ديار") || a.name.includes("قرية") || a.name.includes("حصن")).length 
    },
  ];

  const cities = [
    { id: "all", label: "جميع مدن وقرى بني شهر" },
    { id: "تنومة", label: "تنومة (شلالات وجبال)" },
    { id: "النماص", label: "النماص (مدينة الضباب والقلاع)" },
    { id: "المجاردة", label: "تهامة بني شهر" },
  ];

  const filteredAttractions = ATTRACTIONS_DATA.filter((item) => {
    // Chip Filter Logic
    let matchesChip = true;
    if (selectedChip === "طبيعة") {
      matchesChip = item.category === "nature" || item.category === "viewpoints" || item.tags.some(t => ["طبيعة", "شلالات", "مطلات", "جبال", "أودية"].includes(t));
    } else if (selectedChip === "تراث") {
      matchesChip = item.category === "heritage" || item.category === "museums" || item.tags.some(t => ["تراث", "قلاع", "متاحف", "آثار", "تاريخ"].includes(t));
    } else if (selectedChip === "مطاعم") {
      matchesChip = item.tags.some(t => ["مطاعم", "أكلات شعبية", "ميفا", "مطبخ", "عسل", "ضيافة"].includes(t)) || item.name.includes("مطعم") || item.name.includes("مطبخ");
    } else if (selectedChip === "فعاليات") {
      matchesChip = item.tags.some(t => ["فعاليات", "مهرجانات", "صيف", "ترفيه", "فلكلور", "عرضة"].includes(t)) || item.name.includes("مهرجان") || item.name.includes("فعاليات");
    } else if (selectedChip === "ديار قديمة") {
      matchesChip = item.tags.some(t => ["ديار قديمة", "قرى تراثية", "حصون"].includes(t)) || item.name.includes("ديار") || item.name.includes("قرية") || item.name.includes("حصن");
    }

    const matchesCity = selectedCity === "all" || item.city.includes(selectedCity);
    const matchesSearch =
      searchQuery.trim() === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesChip && matchesCity && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8F4EA] text-stone-900 font-['Tajawal',sans-serif] flex flex-col selection:bg-emerald-800 selection:text-white">
      
      {/* Sticky Top Header Bar */}
      <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => {
                if (activeAttraction) {
                  setActiveAttraction(null);
                } else if (isNearbyMapOpen) {
                  setIsNearbyMapOpen(false);
                } else if (sharingAttraction) {
                  setSharingAttraction(null);
                } else if (onBack) {
                  onBack();
                } else {
                  onBackToHome();
                }
              }}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-950 transition-all shrink-0 hover:-translate-x-0.5"
            >
              <ArrowRight className="w-4 h-4 shrink-0" />
              <span>العودة</span>
            </button>

            <div className="h-5 w-px bg-stone-700 hidden sm:block" />

            <div className="hidden sm:flex items-center gap-1.5 text-xs sm:text-sm text-stone-300 truncate">
              <button onClick={onBackToHome} className="hover:text-emerald-300 transition-colors shrink-0">الرئيسية</button>
              <span>/</span>
              <span className="text-emerald-400 font-bold truncate">دليل المعالم والطبيعة في بني شهر</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsNearbyMapOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-all shadow-md hover:scale-105"
            >
              <LocateFixed className="w-3.5 h-3.5" />
              <span>بالقرب مني</span>
            </button>

            <span className="px-2.5 sm:px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] sm:text-xs font-bold font-mono whitespace-nowrap">
              {ATTRACTIONS_DATA.length} معلماً
            </span>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-10 flex-1 w-full space-y-6 sm:space-y-8 animate-fadeIn">
        
        {/* Hero Header Banner */}
        <div className="relative p-5 sm:p-10 rounded-3xl bg-gradient-to-br from-emerald-950/80 via-stone-900 to-amber-950/80 border border-stone-800 shadow-2xl overflow-hidden text-center sm:text-right flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold mb-4">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>الدليل السياحي الجغرافي الشامل</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-['Amiri'] text-white mb-3 leading-tight">
              استكشف معالم وطبيعة ديار بني شهر
            </h1>
            <p className="text-stone-300 text-xs sm:text-base leading-relaxed mb-4">
              شلالات مائية دائمة، قلاع أثرية شامخة، مطلات تعانق السحاب، ومسارات هايكنج في تنومة والنماص والمجاردة وسراة عسير مع خدمات المرشد الذكي والتقييمات الحية.
            </p>

            {/* Quick Action Pills in Hero */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setIsNearbyMapOpen(true)}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 hover:-translate-y-0.5"
              >
                <LocateFixed className="w-4 h-4 text-amber-300" />
                <span>استعراض المعالم "بالقرب مني" على الخريطة</span>
              </button>

              <button
                onClick={() => setViewMode(viewMode === "grid" ? "map" : "grid")}
                className="px-4 py-2 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-stone-200 border border-stone-700 text-xs font-bold transition-all flex items-center gap-2"
              >
                <MapIcon className="w-4 h-4 text-emerald-400" />
                <span>{viewMode === "grid" ? "عرض الخريطة التفاعلية" : "عرض شبكة البطاقات"}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full sm:w-auto shrink-0 text-center">
            <div className="p-3 sm:p-4 rounded-2xl bg-stone-900/90 border border-stone-800">
              <span className="block text-xl sm:text-2xl font-bold font-mono text-emerald-400">{ATTRACTIONS_DATA.length}</span>
              <span className="text-[11px] sm:text-xs text-stone-400 font-medium">معلماً مصنفاً</span>
            </div>
            <div className="p-3 sm:p-4 rounded-2xl bg-stone-900/90 border border-stone-800">
              <span className="block text-xl sm:text-2xl font-bold font-mono text-amber-400">2,600م+</span>
              <span className="text-[11px] sm:text-xs text-stone-400 font-medium">ارتفاع القمم</span>
            </div>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-stone-900/90 p-3.5 sm:p-6 rounded-3xl border border-stone-800 shadow-xl space-y-3 sm:space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ابحث عن معلم، شلال، قصر، مسار هايكنج، أو موقع..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 sm:py-3 rounded-xl bg-stone-950 border border-stone-700 text-xs sm:text-sm text-stone-200 placeholder-stone-400 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* City Selector & View Mode */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full sm:w-auto px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-stone-950 border border-stone-700 text-xs sm:text-sm text-emerald-300 font-semibold focus:outline-none focus:border-emerald-500"
              >
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.label}
                  </option>
                ))}
              </select>

              <div className="flex bg-stone-950 p-1 rounded-xl border border-stone-700 shrink-0 self-center sm:self-auto">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    viewMode === "grid"
                      ? "bg-emerald-700 text-white shadow"
                      : "text-stone-400 hover:text-stone-200"
                  }`}
                >
                  شبكة البطاقات
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    viewMode === "map"
                      ? "bg-emerald-700 text-white shadow"
                      : "text-stone-400 hover:text-stone-200"
                  }`}
                >
                  الخريطة
                </button>
              </div>

              <button
                onClick={() => setIsNearbyMapOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-amber-500/90 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-all shadow flex items-center justify-center gap-1.5 shrink-0"
                title="فتح خريطة المعالم بالقرب مني"
              >
                <LocateFixed className="w-3.5 h-3.5" />
                <span>بالقرب مني</span>
              </button>
            </div>

          </div>

          {/* Horizontal Scrollable Category Chips (الكل، طبيعة، تراث، مطاعم، فعاليات، ديار قديمة) */}
          <div className="pt-3 border-t border-stone-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-stone-400 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-emerald-400" />
                <span>تصنيف المعالم السياحية:</span>
              </span>
              <span className="text-[10px] text-stone-400">اسحب للتنقل بين الفئات</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 scroll-smooth">
              {categoryChips.map((chip) => {
                const Icon = chip.icon;
                const isSelected = selectedChip === chip.id;
                return (
                  <button
                    key={chip.id}
                    id={`page-chip-btn-${chip.id}`}
                    onClick={() => setSelectedChip(chip.id)}
                    className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shrink-0 active:scale-95 ${
                      isSelected
                        ? "bg-emerald-700 text-white shadow-lg shadow-emerald-950 border border-emerald-400/40 ring-2 ring-emerald-500/30 scale-[1.02]"
                        : "bg-stone-950 text-stone-300 hover:text-white hover:bg-stone-900 border border-stone-800"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isSelected ? "text-amber-300" : "text-amber-400"}`} />
                    <span>{chip.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                        isSelected
                          ? "bg-emerald-950/80 text-amber-300 border border-emerald-500/30"
                          : "bg-stone-900 text-stone-400"
                      }`}
                    >
                      {chip.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* VIEW: Grid Mode */}
        {viewMode === "grid" ? (
          <div>
            {filteredAttractions.length === 0 ? (
              <div className="text-center py-20 bg-stone-900/60 rounded-3xl border border-stone-800 p-8 space-y-4">
                <Compass className="w-12 h-12 mx-auto text-stone-600" />
                <h3 className="text-lg font-bold text-stone-300">لم يتم العثور على معالم تطابق بحثك</h3>
                <p className="text-xs text-stone-400">جرب البحث بكلمة أخرى أو تغيير تصنيف المدينة والتصنيفات.</p>
                <button
                  onClick={() => {
                    setSelectedChip("الكل");
                    setSelectedCity("all");
                    setSearchQuery("");
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold shadow"
                >
                  إعادة تعيين الفلاتر
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
                {filteredAttractions.map((attraction) => {
                  const isWishlisted = bookmarkedIds.includes(attraction.id);
                  const ratingInfo = DataStore.getAttractionRating(attraction.id, attraction.rating, attraction.reviewsCount);

                  return (
                    <div
                      key={attraction.id}
                      className="group rounded-2xl bg-stone-900/95 border border-stone-800 hover:border-emerald-500/60 overflow-hidden flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-emerald-950/40 hover:-translate-y-0.5"
                    >
                      {/* Image Banner */}
                      <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-stone-950">
                        <img
                          src={attraction.imageUrl}
                          alt={attraction.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

                        {/* City Badge */}
                        <div className="absolute top-1.5 sm:top-2.5 right-1.5 sm:right-2.5">
                          <span className="px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 text-emerald-300 text-[10px] sm:text-xs font-bold flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-emerald-400" />
                            {attraction.city}
                          </span>
                        </div>

                        {/* Wishlist Heart Button in Top Corner */}
                        <div className="absolute top-1.5 sm:top-2.5 left-1.5 sm:left-2.5 flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleBookmark(attraction.id);
                            }}
                            className={`p-1.5 rounded-lg backdrop-blur-md transition-all shadow active:scale-95 ${
                              isWishlisted
                                ? "bg-rose-600 text-white ring-1 ring-rose-400/50"
                                : "bg-black/70 text-stone-300 hover:text-rose-400 hover:bg-black/90"
                            }`}
                            title={isWishlisted ? "تم الحفظ في المحفوظات" : "حفظ في المحفوظات"}
                          >
                            <Heart className={`w-3.5 h-3.5 transition-transform ${isWishlisted ? "fill-white" : ""}`} />
                          </button>
                        </div>

                        {/* Title & Rating overlay */}
                        <div className="absolute bottom-1.5 sm:bottom-2 right-2 left-2 flex items-center justify-between">
                          <span className="text-[10px] sm:text-[11px] text-amber-400 font-bold font-mono bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded border border-white/10">
                            {attraction.elevation}
                          </span>
                          <div className="flex items-center gap-1 text-amber-400 font-bold font-mono text-[10px] bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded border border-white/10">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{ratingInfo.rating}</span>
                          </div>
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between space-y-2">
                        <div>
                          <h3 className="text-xs sm:text-sm font-bold text-white font-['Amiri'] group-hover:text-emerald-300 transition-colors line-clamp-1 mb-1">
                            {attraction.name}
                          </h3>
                          <p className="text-[10px] sm:text-xs text-stone-400 line-clamp-2 leading-snug">
                            {attraction.description}
                          </p>
                        </div>

                        {/* Card Actions */}
                        <div className="pt-2 flex items-center gap-1 border-t border-stone-800/80">
                          <button
                            onClick={() => setActiveAttraction(attraction)}
                            className="flex-1 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-[10px] sm:text-xs font-bold transition-colors shadow"
                          >
                            التفاصيل
                          </button>

                          <button
                            onClick={() => onAskAiAboutAttraction(attraction)}
                            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-400 border border-stone-700"
                            title="اسأل المرشد الذكي"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setSharingAttraction(attraction)}
                            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700"
                            title="مشاركة"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* VIEW: Map Mode */
          <div className="rounded-3xl bg-stone-900 border border-stone-800 p-6 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-emerald-400" />
                  <span>الخريطة التفاعلية وتوزيع معالم ديار بني شهر</span>
                </h3>
                <p className="text-xs text-stone-400 mt-1">انقر على أي معلم لفتح الإحداثيات والتفاصيل الكاملة</p>
              </div>

              <button
                onClick={() => setIsNearbyMapOpen(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-all shadow flex items-center gap-1.5"
              >
                <LocateFixed className="w-4 h-4" />
                <span>فتح خريطة "بالقرب مني" الدقيقة</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAttractions.map((attraction) => {
                const isWishlisted = bookmarkedIds.includes(attraction.id);
                const ratingInfo = DataStore.getAttractionRating(attraction.id, attraction.rating, attraction.reviewsCount);

                return (
                  <div
                    key={attraction.id}
                    onClick={() => setActiveAttraction(attraction)}
                    className="p-4 rounded-2xl bg-stone-950 border border-stone-800 hover:border-emerald-500/50 cursor-pointer flex items-start gap-3 transition-all relative group"
                  >
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <img
                        src={attraction.imageUrl}
                        alt={attraction.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white truncate">{attraction.name}</h4>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleBookmark(attraction.id);
                          }}
                          className={`p-1 rounded-lg transition-colors ${
                            isWishlisted ? "text-rose-400" : "text-stone-500 hover:text-rose-400"
                          }`}
                          title="حفظ في المحفوظات"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-rose-400" : ""}`} />
                        </button>
                      </div>
                      <p className="text-xs text-emerald-400 mt-0.5">{attraction.city}</p>
                      
                      <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-bold mt-1">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{ratingInfo.rating}</span>
                        <span className="text-stone-400 font-normal">({ratingInfo.count} مراجعة)</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>

      {/* Attraction Detailed Modal with TripAdvisor-Style Reviews */}
      {activeAttraction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl bg-stone-900 border border-stone-700 rounded-3xl overflow-hidden shadow-2xl space-y-5 max-h-[92vh] flex flex-col">
            
            <div className="relative h-60 w-full shrink-0">
              <img
                src={activeAttraction.imageUrl}
                alt={activeAttraction.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent" />
              
              <button
                onClick={() => setActiveAttraction(null)}
                className="absolute top-4 left-4 p-2 rounded-full bg-black/70 text-white hover:bg-black"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Wishlist Heart in Modal */}
              <button
                onClick={() => onToggleBookmark(activeAttraction.id)}
                className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all shadow-lg ${
                  bookmarkedIds.includes(activeAttraction.id)
                    ? "bg-rose-600 text-white"
                    : "bg-black/70 text-white hover:text-rose-400"
                }`}
                title={bookmarkedIds.includes(activeAttraction.id) ? "محفوظ في المفضلة" : "حفظ في المحفوظات"}
              >
                <Heart className={`w-4 h-4 ${bookmarkedIds.includes(activeAttraction.id) ? "fill-white" : ""}`} />
              </button>

              <div className="absolute bottom-4 right-4 left-4">
                <span className="text-xs text-emerald-400 font-bold">{activeAttraction.city} • {activeAttraction.elevation}</span>
                <h3 className="text-2xl font-bold text-white font-['Amiri']">{activeAttraction.name}</h3>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 pt-0 scrollbar-thin scrollbar-thumb-stone-700">
              <p className="text-sm text-stone-200 leading-relaxed text-justify">
                {activeAttraction.fullDetails || activeAttraction.description}
              </p>

              {/* Highlights tags */}
              {activeAttraction.highlights && activeAttraction.highlights.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 block">أبرز مميزات المعلم:</span>
                  <div className="flex flex-wrap gap-2">
                    {activeAttraction.highlights.map((hl, idx) => (
                      <span key={idx} className="text-xs px-2.5 py-1 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{hl}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-stone-950 border border-stone-800">
                  <span className="text-stone-400 block mb-1">المنطقة الجغرافية</span>
                  <span className="font-bold text-stone-200">{activeAttraction.city}</span>
                </div>
                <div className="p-3 rounded-xl bg-stone-950 border border-stone-800">
                  <span className="text-stone-400 block mb-1">أفضل وقت للزيارة</span>
                  <span className="font-bold text-emerald-300">{activeAttraction.bestTime}</span>
                </div>
                <div className="p-3 rounded-xl bg-stone-950 border border-stone-800">
                  <span className="text-stone-400 block mb-1">رسوم الدخول</span>
                  <span className="font-bold text-amber-300">{activeAttraction.entryFee}</span>
                </div>
              </div>

              {/* Navigation and AI Guide Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${activeAttraction.coordinates.lat},${activeAttraction.coordinates.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow"
                >
                  <Navigation className="w-4 h-4" />
                  <span>بدء الملاحة عبر خرائط Google</span>
                </a>

                <button
                  onClick={() => {
                    const attr = activeAttraction;
                    setActiveAttraction(null);
                    onAskAiAboutAttraction(attr);
                  }}
                  className="px-4 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>اسأل المرشد الذكي</span>
                </button>
              </div>

              {/* TRIPADVISOR-STYLE RATINGS & VISITOR REVIEWS SECTION */}
              <AttractionReviewsSection
                key={`${activeAttraction.id}-${reviewUpdateTick}`}
                attractionId={activeAttraction.id}
                attractionName={activeAttraction.name}
                baseRating={activeAttraction.rating}
                baseReviewsCount={activeAttraction.reviewsCount}
                onReviewAdded={() => setReviewUpdateTick(prev => prev + 1)}
              />

            </div>

          </div>
        </div>
      )}

      {/* Share Modal */}
      {sharingAttraction && (
        <ShareModal
          isOpen={true}
          onClose={() => setSharingAttraction(null)}
          title={sharingAttraction.name}
          description={`معلم سياحي وطبيعي في ديار بني شهر: ${sharingAttraction.name} - ${sharingAttraction.city}`}
          url={window.location.href}
        />
      )}

      {/* Nearby Interactive Map Modal */}
      <NearbyLandmarksMapModal
        isOpen={isNearbyMapOpen}
        onClose={() => setIsNearbyMapOpen(false)}
        onSelectAttraction={(attr) => {
          setActiveAttraction(attr);
        }}
      />

    </div>
  );
};
