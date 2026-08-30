import React, { useState } from "react";
import {
  X,
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
  Info
} from "lucide-react";
import { FORTS_DATA, FortItem } from "../data/fortsData";

interface FortsAndHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FortsAndHistoryModal: React.FC<FortsAndHistoryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedTribe, setSelectedTribe] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [activeFort, setActiveFort] = useState<FortItem | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

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
    if (!("speechSynthesis" in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar-SA";
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleCopyFortDetails = (fort: FortItem) => {
    const shareText = `معلم تاريخي في ديار بني شهر:
اسم الحصن: ${fort.name}
القبيلة: ${fort.tribe} - ${fort.fakhdh}
الموقع: ${fort.location} (${fort.elevation})
عصر البناء: ${fort.builtEra}
تاريخه: ${fort.historyStory}`;

    navigator.clipboard.writeText(shareText).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-6xl max-h-[94vh] flex flex-col bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden text-stone-100 font-['Tajawal']">
        
        {/* ========================================================================= */}
        {/* VIEW 1: All Forts Directory & Explorer */}
        {/* ========================================================================= */}
        {!activeFort ? (
          <>
            {/* Top Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-950/90 via-stone-900 to-emerald-950/90 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
                  <Landmark className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-bold font-['Amiri'] text-white">
                      موسوعة تاريخ وحصون قبائل بني شهر
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold font-mono">
                      {FORTS_DATA.length} حصناً وقلعة موثقة
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-400">
                    استكشف قلاع وقصبات وحصون السراة وتهامة، موقعها، قبيلتها، تاريخ بنائها، وهندستها المعمارية
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Filter Bar */}
            <div className="p-4 sm:p-5 bg-stone-950/70 border-b border-stone-800 flex flex-col gap-3">
              
              {/* Search input & Region tabs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    placeholder="ابحث عن حصن (مثل: آل عليان، قصر المقر، آل دحمان، ثربان...) أو قبيلة أو موقع..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                  <button
                    onClick={() => setSelectedRegion("all")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedRegion === "all"
                        ? "bg-amber-600 text-white shadow-md shadow-amber-950"
                        : "bg-stone-800 text-stone-400 hover:text-white"
                    }`}
                  >
                    كافة الديار ({FORTS_DATA.length})
                  </button>
                  <button
                    onClick={() => setSelectedRegion("sarawat")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedRegion === "sarawat"
                        ? "bg-emerald-700 text-white shadow-md shadow-emerald-950"
                        : "bg-stone-800 text-stone-400 hover:text-white"
                    }`}
                  >
                    السراة (النماص وتنومة)
                  </button>
                  <button
                    onClick={() => setSelectedRegion("tihamah")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedRegion === "tihamah"
                        ? "bg-teal-700 text-white shadow-md shadow-teal-950"
                        : "bg-stone-800 text-stone-400 hover:text-white"
                    }`}
                  >
                    تهامة (المجاردة وخاط وثربان)
                  </button>
                </div>
              </div>

              {/* Tribe and Type Dropdown Selectors */}
              <div className="flex flex-wrap items-center gap-3 text-xs">
                
                {/* Tribe selector */}
                <div className="flex items-center gap-2">
                  <span className="text-stone-400 font-semibold flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    القبيلة:
                  </span>
                  <select
                    value={selectedTribe}
                    onChange={(e) => setSelectedTribe(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-amber-300 font-semibold focus:outline-none focus:border-amber-500"
                  >
                    <option value="all">جميع القبائل</option>
                    {tribeOptions.map((tr) => (
                      <option key={tr} value={tr}>{tr}</option>
                    ))}
                  </select>
                </div>

                {/* Fort type selector */}
                <div className="flex items-center gap-2">
                  <span className="text-stone-400 font-semibold flex items-center gap-1">
                    <Castle className="w-3.5 h-3.5 text-emerald-400" />
                    نوع الحصن:
                  </span>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-emerald-300 font-semibold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="all">كافة الأنواع المعمارية</option>
                    {typeOptions.map((tp) => (
                      <option key={tp} value={tp}>{tp}</option>
                    ))}
                  </select>
                </div>

                {/* Count badge */}
                <div className="mr-auto text-[11px] text-stone-400">
                  عرض <span className="text-amber-300 font-bold font-mono">{filteredForts.length}</span> حصناً
                </div>

              </div>

            </div>

            {/* Forts Grid */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {filteredForts.length === 0 ? (
                <div className="py-16 text-center text-stone-400 space-y-3">
                  <Castle className="w-12 h-12 mx-auto text-stone-600" />
                  <p className="text-sm font-semibold">لم يتم العثور على حصون تطابق معايير البحث.</p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedRegion("all");
                      setSelectedTribe("all");
                      setSelectedType("all");
                    }}
                    className="px-4 py-1.5 rounded-xl bg-stone-800 text-xs text-amber-300 hover:bg-stone-700"
                  >
                    إعادة ضبط الفلاتر
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredForts.map((fort) => (
                    <div
                      id={`fort-card-${fort.id}`}
                      key={fort.id}
                      onClick={() => setActiveFort(fort)}
                      className="group rounded-3xl bg-stone-950 border border-stone-800 hover:border-amber-500/60 overflow-hidden cursor-pointer flex flex-col justify-between transition-all hover:shadow-2xl hover:shadow-amber-950/40 hover:-translate-y-1"
                    >
                      {/* Card Image Banner */}
                      <div className="relative h-44 overflow-hidden bg-stone-900">
                        <img
                          src={fort.imageUrl}
                          alt={fort.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

                        {/* Badges on image */}
                        <div className="absolute top-3 right-3 flex flex-wrap gap-1.5">
                          <span className="px-2.5 py-1 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-amber-300 text-[11px] font-bold">
                            {fort.type}
                          </span>
                        </div>

                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-0.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-semibold">
                            {fort.currentStatus}
                          </span>
                        </div>

                        {/* Bottom overlay inside image */}
                        <div className="absolute bottom-2 right-3 left-3">
                          <span className="text-[11px] text-amber-400 font-bold block mb-0.5">
                            {fort.tribe} • {fort.fakhdh}
                          </span>
                          <h3 className="text-lg font-bold text-white font-['Amiri'] group-hover:text-amber-200 transition-colors line-clamp-1">
                            {fort.name}
                          </h3>
                        </div>
                      </div>

                      {/* Card Content Body */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-stone-400">
                            <span className="flex items-center gap-1 text-emerald-400">
                              <MapPin className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{fort.location}</span>
                            </span>
                            <span className="text-stone-300 font-mono text-[11px] bg-stone-900 px-2 py-0.5 rounded-md border border-stone-800">
                              {fort.elevation}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-stone-300">
                            <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="text-[11px] text-stone-400">العصر:</span>
                            <span className="text-stone-200 font-medium truncate">{fort.builtEra}</span>
                          </div>

                          <p className="text-xs text-stone-400 leading-relaxed line-clamp-2">
                            {fort.architecture}
                          </p>
                        </div>

                        {/* Card Action Footer */}
                        <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs">
                          <span className="text-[11px] text-stone-400 font-medium">
                            بناة الحصن: <span className="text-stone-200">{fort.builder.split(" ")[0]} ...</span>
                          </span>
                          <span className="text-amber-400 font-bold flex items-center gap-1 group-hover:translate-x-[-4px] transition-transform">
                            التفاصيل الكاملة <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          /* ========================================================================= */
          /* VIEW 2: Single Fort Detailed Showcase & Storytelling View */
          /* ========================================================================= */
          <div className="flex flex-col h-full overflow-hidden">
            
            {/* Detailed Top Navigation Bar */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-950/90 via-stone-900 to-emerald-950/90 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (isSpeaking) window.speechSynthesis.cancel();
                    setIsSpeaking(false);
                    setActiveFort(null);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-stone-800/90 hover:bg-stone-700 text-stone-300 text-xs font-bold transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>العودة لقائمة الحصون</span>
                </button>

                <div>
                  <span className="text-[11px] text-amber-400 font-bold">
                    {activeFort.tribe} • {activeFort.fakhdh}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold font-['Amiri'] text-white">
                    {activeFort.name}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Audio Narrator Button */}
                <button
                  onClick={() => toggleSpeech(`${activeFort.name}. يقع في ${activeFort.location}. شيده ${activeFort.builder}. تاريخ الحصن: ${activeFort.historyStory}. ${activeFort.architecture}`)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all ${
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
                  className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold border border-stone-700"
                >
                  {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? "تم النسخ!" : "مشاركة"}</span>
                </button>

                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Detailed Body Scroll */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
              
              {/* Hero Image & Primary Info Banner */}
              <div className="relative rounded-3xl overflow-hidden bg-stone-950 border border-stone-800 shadow-2xl">
                <div className="relative h-64 sm:h-80 w-full">
                  <img
                    src={activeFort.imageUrl}
                    alt={activeFort.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />

                  {/* Badges on image */}
                  <div className="absolute top-4 right-4 flex flex-wrap gap-2">
                    <span className="px-3.5 py-1.5 rounded-2xl bg-black/80 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-bold">
                      {activeFort.type}
                    </span>
                    <span className="px-3.5 py-1.5 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs font-bold">
                      {activeFort.currentStatus}
                    </span>
                  </div>

                  <div className="absolute bottom-5 right-5 left-5">
                    <div className="inline-block px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold mb-2">
                      قبيلة: {activeFort.tribe} — {activeFort.fakhdh}
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-['Amiri']">
                      {activeFort.name}
                    </h1>
                  </div>
                </div>

                {/* Primary Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-stone-950 border-t border-stone-800 text-center text-xs">
                  <div className="p-3 rounded-2xl bg-stone-900/80 border border-stone-800/80">
                    <span className="text-stone-400 block mb-1">الموقع والمنطقة</span>
                    <span className="font-bold text-emerald-400">{activeFort.location}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-stone-900/80 border border-stone-800/80">
                    <span className="text-stone-400 block mb-1">الارتفاع عن البحر</span>
                    <span className="font-bold text-amber-400 font-mono">{activeFort.elevation}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-stone-900/80 border border-stone-800/80">
                    <span className="text-stone-400 block mb-1">تاريخ وعصر البناء</span>
                    <span className="font-bold text-stone-200">{activeFort.builtEra}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-stone-900/80 border border-stone-800/80">
                    <span className="text-stone-400 block mb-1">عدد الطوابق</span>
                    <span className="font-bold text-teal-300 font-mono">{activeFort.floors} طوابق شاهقة</span>
                  </div>
                </div>
              </div>

              {/* Two Column Detailed Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Right Column: History, Story & Function (2 cols) */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Historical Story Card */}
                  <div className="p-6 rounded-3xl bg-stone-950 border border-stone-800 space-y-3">
                    <div className="flex items-center gap-2 text-amber-400">
                      <BookOpen className="w-5 h-5" />
                      <h4 className="text-lg font-bold font-['Amiri'] text-white">
                        القصة والتاريخ العريق للحصن
                      </h4>
                    </div>
                    <p className="text-sm text-stone-300 leading-relaxed text-justify">
                      {activeFort.historyStory}
                    </p>
                  </div>

                  {/* Architectural Description */}
                  <div className="p-6 rounded-3xl bg-stone-950 border border-stone-800 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Building2 className="w-5 h-5" />
                      <h4 className="text-lg font-bold font-['Amiri'] text-white">
                        الهندسة المعمارية ومواد البناء
                      </h4>
                    </div>
                    <p className="text-sm text-stone-300 leading-relaxed text-justify">
                      {activeFort.architecture}
                    </p>
                    <div className="pt-2 flex items-center gap-2 text-xs text-amber-300 font-medium">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>البناة المؤسسون: {activeFort.builder}</span>
                    </div>
                  </div>

                  {/* Strategic & Historical Function */}
                  <div className="p-6 rounded-3xl bg-stone-950 border border-stone-800 space-y-3">
                    <div className="flex items-center gap-2 text-teal-400">
                      <Shield className="w-5 h-5" />
                      <h4 className="text-lg font-bold font-['Amiri'] text-white">
                        الوظيفة التاريخية والاستراتيجية للحصن
                      </h4>
                    </div>
                    <p className="text-sm text-stone-300 leading-relaxed text-justify">
                      {activeFort.historicalFunction}
                    </p>
                  </div>

                </div>

                {/* Left Column: Defense & Highlights (1 col) */}
                <div className="space-y-6">
                  
                  {/* Defense Features Card */}
                  <div className="p-6 rounded-3xl bg-stone-950 border border-stone-800 space-y-4">
                    <div className="flex items-center gap-2 text-amber-400">
                      <Shield className="w-5 h-5" />
                      <h4 className="text-base font-bold font-['Amiri'] text-white">
                        التحصينات والخصائص الدفاعية
                      </h4>
                    </div>
                    <ul className="space-y-2.5 text-xs text-stone-300">
                      {activeFort.defenseFeatures.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Highlights Card */}
                  <div className="p-6 rounded-3xl bg-stone-950 border border-stone-800 space-y-4">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Sparkles className="w-5 h-5" />
                      <h4 className="text-base font-bold font-['Amiri'] text-white">
                        أبرز ما يميز الحصن للزوار
                      </h4>
                    </div>
                    <ul className="space-y-2.5 text-xs text-stone-300">
                      {activeFort.highlights.map((hl, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Coordinates & Map Link */}
                  <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800 text-center space-y-3">
                    <MapPin className="w-6 h-6 text-amber-400 mx-auto" />
                    <div>
                      <span className="text-xs text-stone-400 block">الإحداثيات الجغرافية:</span>
                      <span className="text-xs font-mono text-stone-200 font-bold">
                        {activeFort.coordinates.lat.toFixed(4)}° N, {activeFort.coordinates.lng.toFixed(4)}° E
                      </span>
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${activeFort.coordinates.lat},${activeFort.coordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-colors shadow-md shadow-emerald-950"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>فتح الموقع على خرائط Google</span>
                    </a>
                  </div>

                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
