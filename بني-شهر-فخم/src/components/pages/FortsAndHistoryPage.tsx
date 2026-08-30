import React, { useState, useEffect } from "react";
import {
  Castle,
  Landmark,
  Shield,
  MapPin,
  Search,
  SlidersHorizontal,
  Compass,
  Building2,
  Calendar,
  Layers,
  Sparkles,
  Users,
  ChevronRight,
  ExternalLink,
  Share2,
  CheckCircle2,
  Volume2,
  VolumeX,
  BookOpen,
  ArrowRight,
  Eye,
  Info,
  Crown
} from "lucide-react";
import { FORTS_DATA, FortItem } from "../../data/fortsData";
import { narratorEngine } from "../../lib/narratorAudioEngine";

interface FortsAndHistoryPageProps {
  onBack?: () => void;
  onBackToHome: () => void;
}

export const FortsAndHistoryPage: React.FC<FortsAndHistoryPageProps> = ({
  onBack,
  onBackToHome,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedTribe, setSelectedTribe] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [activeFort, setActiveFort] = useState<FortItem | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync with browser/device back navigation
  useEffect(() => {
    const handlePop = () => {
      if (activeFort) {
        narratorEngine.stop();
        setIsSpeaking(false);
        setActiveFort(null);
      }
    };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, [activeFort]);

  useEffect(() => {
    return () => {
      narratorEngine.stop();
    };
  }, []);

  // Distinct list of tribes in data
  const tribeOptions = Array.from(new Set(FORTS_DATA.map((f) => f.tribe)));
  const typeOptions = Array.from(new Set(FORTS_DATA.map((f) => f.type)));

  // Filtered Forts
  const filteredForts = FORTS_DATA.filter((fort) => {
    const matchesSearch =
      fort.name.includes(searchTerm) ||
      fort.tribe.includes(searchTerm) ||
      fort.fakhdh.includes(searchTerm) ||
      fort.location.includes(searchTerm) ||
      fort.builder.includes(searchTerm) ||
      fort.historicalFunction.includes(searchTerm) ||
      fort.architecture.includes(searchTerm);

    const matchesRegion =
      selectedRegion === "all" ||
      (selectedRegion === "sarawat" && fort.region.includes("السراة")) ||
      (selectedRegion === "tihamah" && fort.region.includes("تهامة"));

    const matchesTribe = selectedTribe === "all" || fort.tribe === selectedTribe;
    const matchesType = selectedType === "all" || fort.type === selectedType;

    return matchesSearch && matchesRegion && matchesTribe && matchesType;
  });

  // Speech synthesis for fort story
  const toggleSpeech = (text: string) => {
    if (isSpeaking) {
      narratorEngine.stop();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    narratorEngine.speak(text, {
      gender: "male",
      speed: 0.92,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleCopyFortDetails = (fort: FortItem) => {
    const shareText = `معلم تاريخي في ديار بني شهر:
اسم الحصن: ${fort.name}
القبيلة: ${fort.tribe} - ${fort.fakhdh}
الموقع: ${fort.location} (${fort.elevation})
عصر البناء: ${fort.builtEra}
نبذة تاريخية: ${fort.historyStory}`;

    navigator.clipboard.writeText(shareText);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F8F4EA] text-stone-900 font-['Tajawal',sans-serif] flex flex-col selection:bg-amber-700 selection:text-white">
      
      {/* Sticky Top Navigation & Return Bar */}
      <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => {
                if (activeFort) {
                  if (isSpeaking) window.speechSynthesis.cancel();
                  setIsSpeaking(false);
                  setActiveFort(null);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                } else if (onBack) {
                  onBack();
                } else {
                  onBackToHome();
                }
              }}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-amber-950 transition-all shrink-0 hover:-translate-x-0.5"
            >
              <ArrowRight className="w-4 h-4 shrink-0" />
              <span>{activeFort ? "العودة للحصون" : "العودة"}</span>
            </button>

            <div className="h-5 w-px bg-stone-700 hidden sm:block" />

            <div className="hidden sm:flex items-center gap-1.5 text-xs sm:text-sm text-stone-300 truncate">
              <button onClick={onBackToHome} className="hover:text-amber-300 transition-colors shrink-0">الرئيسية</button>
              <span>/</span>
              <button
                onClick={() => {
                  if (isSpeaking) window.speechSynthesis.cancel();
                  setIsSpeaking(false);
                  setActiveFort(null);
                }}
                className={`font-semibold transition-colors truncate ${activeFort ? "hover:text-amber-300 text-stone-300" : "text-amber-400"}`}
              >
                موسوعة تاريخ وحصون بني شهر
              </button>
              {activeFort && (
                <>
                  <span>/</span>
                  <span className="text-amber-400 font-bold truncate">{activeFort.name}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2.5 sm:px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] sm:text-xs font-bold font-mono whitespace-nowrap">
              {FORTS_DATA.length} حصناً وقلعة
            </span>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-10 flex-1 w-full">
        
        {!activeFort ? (
          /* ========================================================================= */
          /* VIEW 1: All Forts Directory & Exploration Grid */
          /* ========================================================================= */
          <div className="space-y-6 sm:space-y-8 animate-fadeIn">
            
            {/* Hero Header Banner */}
            <div className="relative p-5 sm:p-10 rounded-3xl bg-gradient-to-br from-amber-950/80 via-stone-900 to-emerald-950/80 border border-stone-800 shadow-2xl overflow-hidden text-center sm:text-right flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold mb-4">
                  <Landmark className="w-4 h-4 shrink-0" />
                  <span>الموسوعة الشاملة لقلاع وحصون السراة وتهامة</span>
                </div>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-['Amiri'] text-white mb-3 leading-tight">
                  تاريخ وحصون وقلاع قبائل بني شهر
                </h1>
                <p className="text-stone-300 text-xs sm:text-base leading-relaxed">
                  استكشف قلاع وقصبات وحصون السراة وتهامة، موقعها، قبيلتها، تاريخ بنائها، وهندستها المعمارية الحجرية المقاومة للحروب والظروف المناخية منذ مئات السنين.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full sm:w-auto shrink-0 text-center">
                <div className="p-3 sm:p-4 rounded-2xl bg-stone-900/90 border border-stone-800">
                  <span className="block text-xl sm:text-2xl font-bold font-mono text-amber-400">{FORTS_DATA.length}</span>
                  <span className="text-[11px] sm:text-xs text-stone-400 font-medium">حصناً موثقاً</span>
                </div>
                <div className="p-3 sm:p-4 rounded-2xl bg-stone-900/90 border border-stone-800">
                  <span className="block text-xl sm:text-2xl font-bold font-mono text-emerald-400">100%</span>
                  <span className="text-[11px] sm:text-xs text-stone-400 font-medium">توثيق جغرافي</span>
                </div>
              </div>
            </div>

            {/* Quick Filters: Region, Tribe, Type */}
            <div className="p-3.5 sm:p-6 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-xl space-y-3 sm:space-y-4">
              
              {/* Search Bar & Region Tabs */}
              <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
                <div className="relative flex-1">
                  <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    placeholder="ابحث عن حصن (مثل: آل عليان، قصر المقر، آل دحمان، ثربان...) أو قبيلة أو موقع..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 sm:py-3 rounded-xl bg-stone-950 border border-stone-700 text-xs sm:text-sm text-stone-200 placeholder-stone-400 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
                  <button
                    onClick={() => setSelectedRegion("all")}
                    className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                      selectedRegion === "all"
                        ? "bg-amber-600 text-white shadow-lg shadow-amber-950"
                        : "bg-stone-800 text-stone-300 hover:text-white"
                    }`}
                  >
                    كافة الديار ({FORTS_DATA.length})
                  </button>
                  <button
                    onClick={() => setSelectedRegion("sarawat")}
                    className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                      selectedRegion === "sarawat"
                        ? "bg-emerald-700 text-white shadow-lg shadow-emerald-950"
                        : "bg-stone-800 text-stone-300 hover:text-white"
                    }`}
                  >
                    السراة (النماص وتنومة)
                  </button>
                  <button
                    onClick={() => setSelectedRegion("tihamah")}
                    className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                      selectedRegion === "tihamah"
                        ? "bg-teal-700 text-white shadow-lg shadow-teal-950"
                        : "bg-stone-800 text-stone-300 hover:text-white"
                    }`}
                  >
                    تهامة (المجاردة وخاط وثربان)
                  </button>
                </div>
              </div>

              {/* Tribe and Type Selectors */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-stone-800 text-xs">
                <div className="flex flex-wrap items-center gap-4">
                  {/* Tribe filter */}
                  <div className="flex items-center gap-2">
                    <span className="text-stone-400 font-bold flex items-center gap-1">
                      <Users className="w-4 h-4 text-amber-400" />
                      القبيلة:
                    </span>
                    <select
                      value={selectedTribe}
                      onChange={(e) => setSelectedTribe(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-amber-300 font-semibold focus:outline-none focus:border-amber-500"
                    >
                      <option value="all">جميع القبائل</option>
                      {tribeOptions.map((tr) => (
                        <option key={tr} value={tr}>{tr}</option>
                      ))}
                    </select>
                  </div>

                  {/* Fort type filter */}
                  <div className="flex items-center gap-2">
                    <span className="text-stone-400 font-bold flex items-center gap-1">
                      <Castle className="w-4 h-4 text-emerald-400" />
                      نوع البناء:
                    </span>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-emerald-300 font-semibold focus:outline-none focus:border-emerald-500"
                    >
                      <option value="all">كافة الأنواع المعمارية</option>
                      {typeOptions.map((tp) => (
                        <option key={tp} value={tp}>{tp}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="text-stone-400 font-medium">
                  عرض <span className="text-amber-400 font-bold font-mono">{filteredForts.length}</span> حصناً
                </div>
              </div>

            </div>

            {/* Forts Grid */}
            {filteredForts.length === 0 ? (
              <div className="py-16 text-center text-stone-400 space-y-3 bg-stone-900/60 rounded-3xl border border-stone-800 p-8">
                <Castle className="w-12 h-12 mx-auto text-stone-600" />
                <p className="text-sm font-semibold">لم يتم العثور على حصون تطابق معايير البحث.</p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedRegion("all");
                    setSelectedTribe("all");
                    setSelectedType("all");
                  }}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-xs text-amber-300 hover:bg-stone-700"
                >
                  إعادة ضبط الفلاتر
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredForts.map((fort) => (
                  <div
                    key={fort.id}
                    onClick={() => setActiveFort(fort)}
                    className="group rounded-3xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/60 overflow-hidden cursor-pointer flex flex-col justify-between transition-all hover:shadow-2xl hover:shadow-amber-950/40 hover:-translate-y-1"
                  >
                    {/* Card Image Banner */}
                    <div className="relative h-48 overflow-hidden bg-stone-950">
                      <img
                        src={fort.imageUrl}
                        alt={fort.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

                      <div className="absolute top-3 right-3 flex flex-wrap gap-1.5">
                        <span className="px-3 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-amber-300 text-xs font-bold">
                          {fort.type}
                        </span>
                      </div>

                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold">
                          {fort.currentStatus}
                        </span>
                      </div>

                      <div className="absolute bottom-3 right-4 left-4">
                        <span className="text-xs text-amber-400 font-bold block mb-0.5">
                          {fort.tribe} • {fort.fakhdh}
                        </span>
                        <h3 className="text-xl font-bold text-white font-['Amiri'] group-hover:text-amber-200 transition-colors line-clamp-1">
                          {fort.name}
                        </h3>
                      </div>
                    </div>

                    {/* Card Content Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between text-xs text-stone-400">
                          <span className="flex items-center gap-1 text-emerald-400 font-medium">
                            <MapPin className="w-4 h-4 shrink-0" />
                            <span className="truncate">{fort.location}</span>
                          </span>
                          <span className="text-stone-300 font-mono text-xs bg-stone-950 px-2.5 py-1 rounded-lg border border-stone-800">
                            {fort.elevation}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-stone-300">
                          <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                          <span className="text-stone-400 font-medium">عصر البناء:</span>
                          <span className="text-stone-200 font-medium">{fort.builtEra}</span>
                        </div>

                        <p className="text-xs text-stone-300 leading-relaxed line-clamp-2">
                          {fort.architecture}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
                        <span className="text-stone-400 font-medium">
                          البناة: <span className="text-stone-200">{fort.builder.split(" ")[0]} ...</span>
                        </span>
                        <span className="text-amber-400 font-bold flex items-center gap-1 group-hover:translate-x-[-4px] transition-transform">
                          التفاصيل الكاملة <ChevronRight className="w-4 h-4 rotate-180" />
                        </span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        ) : (
          /* ========================================================================= */
          /* VIEW 2: Single Fort Detailed Showcase & Storytelling View */
          /* ========================================================================= */
          <div className="space-y-6 animate-fadeIn">
            
            {/* Top Return and Action Bar */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-950/90 via-stone-900 to-emerald-950/90 border border-stone-800 flex flex-wrap items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (isSpeaking) window.speechSynthesis.cancel();
                    setIsSpeaking(false);
                    setActiveFort(null);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-all border border-stone-700"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>العودة لقائمة الحصون</span>
                </button>

                <div>
                  <span className="text-xs text-amber-400 font-bold">
                    {activeFort.tribe} • {activeFort.fakhdh}
                  </span>
                  <h2 className="text-2xl font-bold font-['Amiri'] text-white">
                    {activeFort.name}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                {/* Audio Narrator Button */}
                <button
                  onClick={() => toggleSpeech(`${activeFort.name}. يقع في ${activeFort.location}. شيده ${activeFort.builder}. تاريخ الحصن: ${activeFort.historyStory}. ${activeFort.architecture}`)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isSpeaking
                      ? "bg-rose-700 text-white animate-pulse"
                      : "bg-amber-600/20 border border-amber-500/40 text-amber-300 hover:bg-amber-600/30"
                  }`}
                  title="استماع لسرد قصة وتاريخ الحصن"
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{isSpeaking ? "إيقاف السرد" : "استمع لقصة الحصن"}</span>
                </button>

                {/* Share Button */}
                <button
                  onClick={() => handleCopyFortDetails(activeFort)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold border border-stone-700"
                >
                  {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                  <span>{copiedLink ? "تم النسخ!" : "مشاركة الحصن"}</span>
                </button>
              </div>
            </div>

            {/* Hero Image & Primary Info Banner */}
            <div className="relative rounded-3xl overflow-hidden bg-stone-900 border border-stone-800 shadow-2xl">
              <div className="relative h-72 sm:h-96 w-full">
                <img
                  src={activeFort.imageUrl}
                  alt={activeFort.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />

                <div className="absolute top-4 right-4 flex flex-wrap gap-2">
                  <span className="px-4 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-bold">
                    {activeFort.type}
                  </span>
                  <span className="px-4 py-1.5 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs font-bold">
                    {activeFort.currentStatus}
                  </span>
                </div>

                <div className="absolute bottom-6 right-6 left-6">
                  <div className="inline-block px-3.5 py-1 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold mb-2">
                    قبيلة: {activeFort.tribe} — {activeFort.fakhdh}
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-['Amiri']">
                    {activeFort.name}
                  </h1>
                </div>
              </div>

              {/* Primary Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 bg-stone-950 border-t border-stone-800 text-center text-xs">
                <div className="p-3.5 rounded-2xl bg-stone-900/80 border border-stone-800">
                  <span className="text-stone-400 block mb-1">الموقع والمنطقة</span>
                  <span className="font-bold text-emerald-400 text-sm">{activeFort.location}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-stone-900/80 border border-stone-800">
                  <span className="text-stone-400 block mb-1">الارتفاع عن البحر</span>
                  <span className="font-bold text-amber-400 font-mono text-sm">{activeFort.elevation}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-stone-900/80 border border-stone-800">
                  <span className="text-stone-400 block mb-1">عصر البناء والتاريخ</span>
                  <span className="font-bold text-stone-200 text-sm">{activeFort.builtEra}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-stone-900/80 border border-stone-800">
                  <span className="text-stone-400 block mb-1">عدد الطوابق</span>
                  <span className="font-bold text-teal-300 font-mono text-sm">{activeFort.floors} طوابق شاهقة</span>
                </div>
              </div>
            </div>

            {/* Detailed Content Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2 space-y-6">
                {/* Historical Story */}
                <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 border border-stone-800 space-y-4 shadow-xl">
                  <div className="flex items-center gap-2.5 text-amber-400">
                    <BookOpen className="w-5 h-5" />
                    <h3 className="text-xl font-bold font-['Amiri'] text-white">
                      القصة والتاريخ العريق للحصن
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base text-stone-200 leading-relaxed text-justify">
                    {activeFort.historyStory}
                  </p>
                </div>

                {/* Architectural Description */}
                <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 border border-stone-800 space-y-4 shadow-xl">
                  <div className="flex items-center gap-2.5 text-emerald-400">
                    <Building2 className="w-5 h-5" />
                    <h3 className="text-xl font-bold font-['Amiri'] text-white">
                      الهندسة المعمارية ومواد البناء
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base text-stone-200 leading-relaxed text-justify">
                    {activeFort.architecture}
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-xs text-amber-300 font-medium">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>البناة المؤسسون: {activeFort.builder}</span>
                  </div>
                </div>
              </div>

              {/* Sidebar Specifications */}
              <div className="space-y-6">
                
                <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4 shadow-xl">
                  <h4 className="text-lg font-bold font-['Amiri'] text-amber-300 border-b border-stone-800 pb-3">
                    المواصفات العسكرية والمعمارية
                  </h4>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-stone-400 block mb-1">الوظيفة التاريخية:</span>
                      <span className="font-semibold text-stone-200">{activeFort.historicalFunction}</span>
                    </div>

                    <div>
                      <span className="text-stone-400 block mb-1">مواد البناء:</span>
                      <span className="font-semibold text-emerald-300">{activeFort.materials}</span>
                    </div>

                    <div>
                      <span className="text-stone-400 block mb-1">الروايات والوثائق:</span>
                      <span className="font-semibold text-stone-200">{activeFort.oralHistory}</span>
                    </div>

                    <div>
                      <span className="text-stone-400 block mb-1">الإحداثيات الجغرافية:</span>
                      <span className="font-mono text-amber-400 block mt-0.5">{activeFort.coordinates.lat}° N, {activeFort.coordinates.lng}° E</span>
                    </div>
                  </div>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${activeFort.coordinates.lat},${activeFort.coordinates.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-lg transition-all"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>فتح الموقع على خرائط Google</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

    </div>
  );
};
