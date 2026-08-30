import React, { useState } from "react";
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
  LocateFixed,
  Utensils,
  Calendar,
  History,
  Landmark
} from "lucide-react";
import { ATTRACTIONS_DATA } from "../data/baniShahrData";
import { Attraction, CategoryType, AttractionFilterChip } from "../types";
import { ShareModal } from "./ShareModal";
import { NearbyLandmarksMapModal } from "./NearbyLandmarksMapModal";
import { AttractionReviewsSection } from "./AttractionReviewsSection";
import { DataStore } from "../lib/datastore";

interface AttractionsExplorerProps {
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
  onAskAiAboutAttraction: (attraction: Attraction) => void;
}

export const AttractionsExplorer: React.FC<AttractionsExplorerProps> = ({
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
    <section id="attractions" className="py-10 sm:py-20 relative w-full max-w-full overflow-hidden scroll-mt-20 sm:scroll-mt-24 text-stone-900">
      
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold mb-2 sm:mb-3 shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <span>الدليل السياحي الجغرافي الشامل</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-['Amiri'] text-[#12201A] mb-2 sm:mb-3">
            استكشف معالم وطبيعة ديار بني شهر
          </h2>
          <p className="text-[#5A524C] text-xs sm:text-base font-light px-2">
            شلالات مائية دائمة، قلاع أثرية شامخة، مطلات تعانق السحاب، ومسارات هايكنج عالمية في تنومة والنماص وسراة عسير.
          </p>
        </div>

        {/* Search & Filter Bar Controls */}
        <div className="bg-white p-3 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#E6DEC8] shadow-md mb-8 sm:mb-10">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-stone-400 absolute right-3.5 sm:right-4 top-1/2 -translate-y-1/2" />
              <input
                id="search-attractions-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن شلال، جبل، قصر، مسار، أو سوق..."
                className="w-full pl-4 pr-10 sm:pr-12 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-[#F8F4EA] border border-[#E6DEC8] text-stone-900 placeholder-stone-400 text-xs sm:text-sm focus:outline-none focus:border-emerald-600 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
                >
                  مسح
                </button>
              )}
            </div>

            {/* City Selection Dropdown & View Mode Row */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 flex-1 sm:flex-initial">
                <span className="text-xs text-stone-600 font-medium shrink-0">المدينة:</span>
                <select
                  id="city-filter-select"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-[#F8F4EA] border border-[#E6DEC8] text-stone-800 text-xs sm:text-sm focus:outline-none focus:border-emerald-600 cursor-pointer"
                >
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Mode Toggle (Grid vs Map Interactive) */}
              <div className="flex items-center p-1 rounded-xl sm:rounded-2xl bg-[#F8F4EA] border border-[#E6DEC8] shrink-0">
                <button
                  id="view-grid-btn"
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs font-semibold transition-colors ${
                    viewMode === "grid"
                      ? "bg-emerald-800 text-white shadow"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <span>الشبكة</span>
                </button>
                <button
                  id="view-map-btn"
                  onClick={() => setViewMode("map")}
                  className={`flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs font-semibold transition-colors ${
                    viewMode === "map"
                      ? "bg-emerald-800 text-white shadow"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>الخريطة</span>
                </button>
              </div>

              {/* Nearby Quick Button */}
              <button
                onClick={() => setIsNearbyMapOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow transition-all flex items-center gap-1.5 shrink-0"
              >
                <LocateFixed className="w-3.5 h-3.5" />
                <span>بالقرب مني</span>
              </button>
            </div>

          </div>

          {/* Horizontal Scrollable Category Chips (الكل، طبيعة، تراث، مطاعم، فعاليات، ديار قديمة) */}
          <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-[#E6DEC8]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
                <Filter className="w-3 h-3 text-emerald-700" />
                <span>تصنيف المعالم السياحية:</span>
              </span>
              <span className="text-[10px] text-stone-400">اسحب للتنقل بين الفئات</span>
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
              {categoryChips.map((chip) => {
                const Icon = chip.icon;
                const isSelected = selectedChip === chip.id;
                return (
                  <button
                    key={chip.id}
                    id={`chip-filter-btn-${chip.id}`}
                    onClick={() => setSelectedChip(chip.id)}
                    className={`shrink-0 flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-bold transition-all shadow-sm active:scale-95 ${
                      isSelected
                        ? "bg-emerald-800 text-white shadow-md shadow-emerald-950/20 ring-2 ring-emerald-600/50 scale-[1.02]"
                        : "bg-[#F8F4EA] text-stone-700 hover:bg-[#F2ECE1] hover:text-stone-900 border border-[#E6DEC8]"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? "text-amber-300" : "text-amber-700"}`} />
                    <span>{chip.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                        isSelected
                          ? "bg-emerald-950/60 text-amber-300 border border-emerald-500/40"
                          : "bg-stone-200/80 text-stone-600"
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

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-stone-500 mb-6 px-2">
          <span>تم العثور على <strong>{filteredAttractions.length}</strong> معلم سياحي وتراثي</span>
          <span>مرتفعات تنومة والنماص • سراة عسير</span>
        </div>

        {/* Content View: Grid or Interactive Map */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {filteredAttractions.map((attraction) => {
              const isWishlisted = bookmarkedIds.includes(attraction.id);
              const ratingInfo = DataStore.getAttractionRating(attraction.id, attraction.rating, attraction.reviewsCount);

              return (
                <div
                  key={attraction.id}
                  id={`attraction-card-${attraction.id}`}
                  className="group bg-white rounded-2xl sm:rounded-2xl border border-[#E6DEC8] hover:border-emerald-600/50 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between"
                >
                  <div>
                    {/* Image & Elevation Badge */}
                    <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-stone-100">
                      <img
                        src={attraction.imageUrl}
                        alt={attraction.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30" />
                      
                      {/* City & Elevation */}
                      <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 flex items-center gap-1">
                        <span className="px-2 py-0.5 rounded-lg bg-black/65 backdrop-blur-md text-emerald-300 text-[10px] sm:text-[11px] font-bold border border-emerald-600/40">
                          {attraction.city}
                        </span>
                      </div>

                      {/* Wishlist Heart Button in Top Corner */}
                      <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 flex items-center gap-1">
                        <button
                          id={`wishlist-attraction-top-btn-${attraction.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleBookmark(attraction.id);
                          }}
                          className={`p-1.5 rounded-lg backdrop-blur-md transition-all shadow active:scale-90 ${
                            isWishlisted
                              ? "bg-rose-600 text-white"
                              : "bg-black/60 text-stone-200 hover:text-rose-400"
                          }`}
                          title={isWishlisted ? "تم الحفظ في المحفوظات" : "حفظ في المحفوظات"}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-white" : ""}`} />
                        </button>
                      </div>

                      {/* TripAdvisor-Style Star Rating & Elevation */}
                      <div className="absolute bottom-1.5 sm:bottom-2 right-1.5 sm:right-2 left-1.5 sm:left-2 flex items-center justify-between">
                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[10px] text-amber-300 border border-amber-500/20">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="font-bold">{ratingInfo.rating}</span>
                        </div>
                        <span className="px-1.5 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[10px] text-amber-200/90 font-mono border border-white/10 truncate max-w-[80px]">
                          {attraction.elevation}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-2.5 sm:p-3">
                      <h3 className="text-xs sm:text-sm font-bold font-['Amiri'] text-[#12201A] group-hover:text-emerald-800 transition-colors line-clamp-1 mb-1">
                        {attraction.name}
                      </h3>
                      
                      <p className="text-[#5A524C] text-[10px] sm:text-xs font-light leading-snug line-clamp-2">
                        {attraction.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-2 sm:p-2.5 pt-0 border-t border-[#E6DEC8]/80 flex items-center justify-between gap-1">
                    <button
                      id={`attraction-details-btn-${attraction.id}`}
                      onClick={() => setActiveAttraction(attraction)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] sm:text-xs font-bold transition-colors border border-emerald-300"
                    >
                      <Eye className="w-3 h-3" />
                      <span>التفاصيل</span>
                    </button>
                    <button
                      id={`attraction-share-btn-${attraction.id}`}
                      onClick={() => setSharingAttraction(attraction)}
                      title="مشاركة"
                      className="p-1.5 rounded-lg bg-[#F8F4EA] hover:bg-stone-100 text-stone-600 hover:text-emerald-700 border border-[#E6DEC8] transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onAskAiAboutAttraction(attraction)}
                      title="اسأل المرشد الذكي"
                      className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Interactive Simulated Mountain Coordinates & Elevation Map */
          <div className="bg-white rounded-3xl border border-[#E6DEC8] p-6 shadow-md">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E6DEC8] pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#12201A] font-['Amiri']">
                  خريطة مسارات ومعالم جبال بني شهر
                </h3>
                <p className="text-xs text-stone-500">
                  انقر على أي معلم للاطلاع على إحداثياته الجغرافية وارتفاعه وتفاصيل زيارته.
                </p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 w-fit">
                نطاق السراة (1,800 م - 2,600 م)
              </span>
            </div>

            {/* Visual Mountain Map Canvas / Interactive Pins */}
            <div className="relative h-96 sm:h-[480px] rounded-2xl bg-stone-900 border border-stone-800 overflow-hidden flex items-center justify-center p-6">
              
              {/* Topographic Background Pattern */}
              <div 
                className="absolute inset-0 opacity-20 bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80')`,
                }}
              />
              <div className="absolute inset-0 bg-black/60" />

              {/* Pin Clusters in Tanomah & Al Namas */}
              <div className="relative z-10 w-full h-full grid grid-cols-2 gap-4">
                
                {/* Tanomah Zone */}
                <div className="p-4 rounded-xl bg-stone-900/80 border border-emerald-600/40 flex flex-col justify-between backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-emerald-300 font-['Amiri']">
                      قطاع تنومة والشلالات
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400">
                      2,200 م
                    </span>
                  </div>

                  <div className="space-y-2 my-auto">
                    {filteredAttractions
                      .filter((a) => a.city === "تنومة")
                      .map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setActiveAttraction(item)}
                          className="flex items-center justify-between p-2 rounded-lg bg-stone-800/80 hover:bg-emerald-900/50 border border-stone-700 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="text-xs text-stone-200 font-medium">{item.name}</span>
                          </div>
                          <span className="text-[10px] text-stone-400">{item.elevation}</span>
                        </div>
                      ))}
                  </div>

                  <span className="text-[10px] text-stone-400">
                    جبل منعاء • شلال الدهناء • منتزه المحفار • الشرف
                  </span>
                </div>

                {/* Al-Namas Zone */}
                <div className="p-4 rounded-xl bg-stone-900/80 border border-amber-600/40 flex flex-col justify-between backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-amber-300 font-['Amiri']">
                      قطاع النماص والقصور
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-400">
                      2,450 م
                    </span>
                  </div>

                  <div className="space-y-2 my-auto">
                    {filteredAttractions
                      .filter((a) => a.city === "النماص")
                      .map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setActiveAttraction(item)}
                          className="flex items-center justify-between p-2 rounded-lg bg-stone-800/80 hover:bg-amber-900/50 border border-stone-700 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span className="text-xs text-stone-200 font-medium">{item.name}</span>
                          </div>
                          <span className="text-[10px] text-stone-400">{item.elevation}</span>
                        </div>
                      ))}
                  </div>

                  <span className="text-[10px] text-stone-400">
                    قصر المقر • قرية الغال • متحف النماص • شعف آل وليد
                  </span>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>

      {/* Detailed Attraction Modal */}
      {activeAttraction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-stone-900 border border-stone-700 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-stone-100">
            
            {/* Modal Image */}
            <div className="relative h-64 sm:h-80">
              <img
                src={activeAttraction.imageUrl}
                alt={activeAttraction.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/50 to-transparent" />
              
              <button
                id="close-attraction-modal-btn"
                onClick={() => setActiveAttraction(null)}
                className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/60 text-stone-300 hover:text-white flex items-center justify-center backdrop-blur-sm border border-stone-600"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-6 right-6 left-6 text-right">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-0.5 rounded-full bg-emerald-900/90 text-emerald-300 text-xs font-semibold border border-emerald-600">
                    {activeAttraction.city}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-900/90 text-amber-300 text-xs font-semibold border border-amber-600">
                    الارتفاع: {activeAttraction.elevation}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-['Amiri'] text-stone-50">
                  {activeAttraction.name}
                </h3>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Full Description */}
              <div className="space-y-3">
                <h4 className="text-base font-bold text-emerald-400 font-['Amiri']">عن هذا المعلم:</h4>
                <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light">
                  {activeAttraction.fullDetails}
                </p>
              </div>

              {/* Highlights & Features */}
              <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700/60">
                <h5 className="font-bold text-amber-300 text-sm mb-3">أبرز ما يميز الزيارة:</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeAttraction.highlights.map((hl, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-stone-200">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Practical Visitor Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-stone-800/60 border border-stone-700">
                  <span className="text-stone-400 block mb-1">أفضل أوقات الزيارة</span>
                  <strong className="text-stone-200">{activeAttraction.bestTime}</strong>
                </div>
                <div className="p-3.5 rounded-xl bg-stone-800/60 border border-stone-700">
                  <span className="text-stone-400 block mb-1">رسوم الدخول</span>
                  <strong className="text-stone-200">{activeAttraction.entryFee}</strong>
                </div>
                <div className="p-3.5 rounded-xl bg-stone-800/60 border border-stone-700">
                  <span className="text-stone-400 block mb-1">الإحداثيات الجغرافية</span>
                  <strong className="text-stone-200">{activeAttraction.coordinates.lat.toFixed(3)}N, {activeAttraction.coordinates.lng.toFixed(3)}E</strong>
                </div>
              </div>

              {/* Facilities */}
              <div>
                <h5 className="font-bold text-stone-300 text-xs mb-2">المرافق والخدمات المتوفرة:</h5>
                <div className="flex flex-wrap gap-2">
                  {activeAttraction.facilities.map((fac, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1 rounded-lg bg-stone-800 text-stone-300 border border-stone-700"
                    >
                      {fac}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer Actions inside Modal */}
              <div className="pt-4 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => onToggleBookmark(activeAttraction.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      bookmarkedIds.includes(activeAttraction.id)
                        ? "bg-amber-600 text-white"
                        : "bg-stone-800 text-stone-300 hover:text-white border border-stone-700"
                    }`}
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                    <span>{bookmarkedIds.includes(activeAttraction.id) ? "محفوظ في رحلتي" : "حفظ في المفضلة"}</span>
                  </button>

                  <button
                    id="modal-share-attraction-btn"
                    onClick={() => setSharingAttraction(activeAttraction)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-emerald-300 text-xs font-semibold border border-stone-700 transition-colors"
                  >
                    <Share2 className="w-4 h-4 text-emerald-400" />
                    <span>مشاركة المعلم</span>
                  </button>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${activeAttraction.coordinates.lat},${activeAttraction.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-emerald-400 text-xs font-semibold border border-stone-700"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>فتح في خرائط جوجل</span>
                  </a>
                </div>

                <button
                  onClick={() => {
                    onAskAiAboutAttraction(activeAttraction);
                    setActiveAttraction(null);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-semibold shadow-md"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>اسأل المرشد الذكي عن هذا المعلم</span>
                </button>
              </div>

              {/* TRIPADVISOR-STYLE REVIEWS AND RATINGS SECTION */}
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

      {/* Share Attraction Modal */}
      <ShareModal
        isOpen={Boolean(sharingAttraction)}
        onClose={() => setSharingAttraction(null)}
        attraction={sharingAttraction}
      />

      {/* Nearby Interactive Map Modal */}
      <NearbyLandmarksMapModal
        isOpen={isNearbyMapOpen}
        onClose={() => setIsNearbyMapOpen(false)}
        onSelectAttraction={(attr) => setActiveAttraction(attr)}
      />

    </section>
  );
};
