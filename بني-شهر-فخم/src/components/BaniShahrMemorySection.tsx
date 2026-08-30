import React, { useState, useMemo } from "react";
import { 
  History, 
  BookOpen, 
  Mic, 
  FileText, 
  Image as ImageIcon, 
  Send, 
  CheckCircle2, 
  Filter, 
  Heart, 
  Share2, 
  Volume2, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  Users, 
  Calendar, 
  MapPin, 
  AlertCircle,
  Play,
  Pause,
  Clock,
  Award,
  Search
} from "lucide-react";
import { MemoryItem, MemoryCategory, MemoryContentType, MemoryContributionSubmission } from "../types";
import { DataStore } from "../lib/datastore";

export const BaniShahrMemorySection: React.FC = () => {
  const [memories, setMemories] = useState<MemoryItem[]>(() => DataStore.getMemories(false));
  const [selectedTribe, setSelectedTribe] = useState<string>("الكل");
  const [selectedCategory, setSelectedCategory] = useState<string>("الكل");
  const [selectedContentType, setSelectedContentType] = useState<string>("الكل");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Selected detail modal
  const [activeMemory, setActiveMemory] = useState<MemoryItem | null>(null);

  // Audio player mock state
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // Contribution Submission Modal
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const [submittingTribe, setSubmittingTribe] = useState<string>("بني أثلة");
  const [submittingCategory, setSubmittingCategory] = useState<MemoryCategory>("قصص زمان وروايات الأجداد");
  const [submittingContentType, setSubmittingContentType] = useState<MemoryContentType>("oral_narration");
  const [submittingTitle, setSubmittingTitle] = useState<string>("");
  const [submittingNarrator, setSubmittingNarrator] = useState<string>("");
  const [submittingNarratorAge, setSubmittingNarratorAge] = useState<string>("");
  const [submittingContributor, setSubmittingContributor] = useState<string>(() => DataStore.getCurrentUser().name);
  const [submittingPhone, setSubmittingPhone] = useState<string>(() => DataStore.getCurrentUser().phone);
  const [submittingLocation, setSubmittingLocation] = useState<string>("");
  const [submittingRegion, setSubmittingRegion] = useState<"النماص" | "تنومة" | "المجاردة" | "السراة" | "تهامة">("النماص");
  const [submittingDateEra, setSubmittingDateEra] = useState<string>("");
  const [submittingContent, setSubmittingContent] = useState<string>("");
  const [submittingImageUrl, setSubmittingImageUrl] = useState<string>("");
  const [submittingAudioUrl, setSubmittingAudioUrl] = useState<string>("");
  const [submittingDocUrl, setSubmittingDocUrl] = useState<string>("");

  // List of major tribe branches of Bani Shahr (السراة وتهامة)
  const tribeBranches = [
    "الكل",
    "بني أثلة",
    "بني ثابت",
    "العمرة",
    "آل بهيش",
    "الكلاثمة",
    "بلحصين",
    "بني مشهور",
    "بني شهر السراة",
    "قبائل تهامة وبني شهر",
    "آل ليلح وبني يوس",
    "الجبيهة والشعبين"
  ];

  const categories: { id: string; label: string; icon: any }[] = [
    { id: "الكل", label: "جميع الأقسام التراثية", icon: Layers },
    { id: "قصص زمان", label: "قصص زمان", icon: BookOpen },
    { id: "روايات الأجداد", label: "روايات الأجداد", icon: History },
    { id: "قصص كل قبيلة", label: "قصص كل قبيلة", icon: Users },
    { id: "العادات القديمة", label: "العادات القديمة والأعراف", icon: Award },
    { id: "الأمثال الشعبية", label: "الأمثال الشعبية والحكم", icon: Sparkles },
    { id: "الحياة قديمًا", label: "الحياة قديمًا", icon: Clock },
    { id: "الزراعة والرعي", label: "الزراعة والرعي والمدرجات", icon: MapPin },
    { id: "الأسواق القديمة", label: "الأسواق القديمة والقوافل", icon: MapPin },
    { id: "الأعراس والمناسبات", label: "الأعراس والمناسبات", icon: Award },
    { id: "الملابس التقليدية", label: "الملابس التقليدية والزينة", icon: History },
    { id: "الألعاب الشعبية", label: "الألعاب الشعبية", icon: Sparkles },
    { id: "صور قديمة", label: "صور قديمة ونوادر الأرشيف", icon: ImageIcon },
    { id: "تسجيلات صوتية لكبار السن", label: "تسجيلات صوتية لكبار السن", icon: Mic },
  ];

  const contentTypes = [
    { id: "الكل", label: "كافة الأنواع" },
    { id: "oral_narration", label: "رواية شفهية", badgeColor: "bg-amber-900/60 text-amber-300 border-amber-600/40" },
    { id: "verified_info", label: "معلومة موثقة", badgeColor: "bg-emerald-900/60 text-emerald-300 border-emerald-600/40" },
    { id: "historical_document", label: "وثيقة تاريخية", badgeColor: "bg-blue-900/60 text-blue-300 border-blue-600/40" },
  ];

  const filteredMemories = useMemo(() => {
    return memories.filter(item => {
      const matchTribe = selectedTribe === "الكل" || item.tribeBranch.includes(selectedTribe) || (selectedTribe === "بني شهر السراة" && item.region === "النماص");
      const matchCategory = selectedCategory === "الكل" || 
        item.category === selectedCategory || 
        item.category.includes(selectedCategory) ||
        selectedCategory.includes(item.category);
      const matchType = selectedContentType === "الكل" || item.contentType === selectedContentType;
      const matchSearch = searchQuery.trim() === "" || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.narratorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tribeBranch.toLowerCase().includes(searchQuery.toLowerCase());

      return matchTribe && matchCategory && matchType && matchSearch;
    });
  }, [memories, selectedTribe, selectedCategory, selectedContentType, searchQuery]);

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    DataStore.likeMemory(id);
    setMemories(DataStore.getMemories(false));
  };

  const handleToggleAudio = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (playingAudioId === id) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(id);
    }
  };

  const handleOpenSubmit = () => {
    setSubmissionSuccess(false);
    setSubmittingTitle("");
    setSubmittingNarrator("");
    setSubmittingNarratorAge("");
    setSubmittingLocation("");
    setSubmittingDateEra("");
    setSubmittingContent("");
    setSubmittingImageUrl("");
    setSubmittingAudioUrl("");
    setSubmittingDocUrl("");
    setIsSubmitModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingTitle || !submittingContent) return;

    const submission: MemoryContributionSubmission = {
      title: submittingTitle,
      tribeBranch: submittingTribe,
      category: submittingCategory,
      contentType: submittingContentType,
      narratorName: submittingNarrator || "راوٍ من كبار السن",
      narratorAgeOrEra: submittingNarratorAge,
      contributorName: submittingContributor || DataStore.getCurrentUser().name,
      contributorPhone: submittingPhone || DataStore.getCurrentUser().phone,
      villageOrLocation: submittingLocation || "السراة",
      region: submittingRegion,
      dateOfEventOrEra: submittingDateEra,
      content: submittingContent,
      imageUrl: submittingImageUrl,
      audioRecordingUrl: submittingAudioUrl || (submittingContentType === "oral_narration" ? "https://actions.google.com/sounds/v1/crowds/outdoor_festival_cheer.ogg" : undefined),
      documentScanUrl: submittingDocUrl
    };

    DataStore.submitMemoryContribution(submission);
    setMemories(DataStore.getMemories(false));
    setSubmissionSuccess(true);
  };

  return (
    <section id="bani-shahr-memory" className="py-24 relative overflow-hidden w-full max-w-full scroll-mt-20 sm:scroll-mt-24 text-stone-900">
      
      {/* Visual Accent Ambient Lighting */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Title */}
        <div className="text-center max-w-4xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-semibold mb-4 shadow-sm">
            <History className="w-4 h-4 text-amber-600" />
            <span>الأرشيف الرقمي للتراث الشفهي والوثائقي</span>
            <span className="bg-amber-100 text-amber-900 text-[10px] px-2.5 py-0.5 rounded-full font-bold border border-amber-300">
              قسم خاص لكل قبيلة
            </span>
          </div>
          
          <h2 className="font-['Markazi_Text'] text-4xl sm:text-6xl font-bold text-[#12201A] mb-4 leading-tight">
            ذاكرة <span className="text-transparent bg-clip-text bg-gradient-to-l from-amber-700 via-[#BD3A2B] to-emerald-800">بني شهر</span>
          </h2>
          
          <p className="text-[#5A524C] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-8 font-light">
            توثيق حي لقصص زمان، روايات الأجداد، العادات القديمة، الأمثال الشعبية، الأسواق، الأعراس، الزراعة والرعي، الصور التاريخية والتسجيلات الصوتية النادرة، مع فرز دقيق حسب كل قبيلة ونوع المحتوى ومراجعته قبل النشر.
          </p>

          {/* Action Call to contribute button */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleOpenSubmit}
              className="group flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-800 to-[#12201A] hover:from-emerald-700 hover:to-[#1B2B22] text-white font-bold text-sm shadow-lg border border-emerald-600/30 transition-all hover:scale-105"
            >
              <Send className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
              <span>إرسال مساهمة في الذاكرة (قصة، صورة، تسجيل، وثيقة)</span>
            </button>
          </div>
        </div>

        {/* Content Type Legend & Moderation Verification Bar */}
        <div className="p-4 rounded-2xl bg-white border border-[#E6DEC8] shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-stone-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold">تصنيف المحتوى المعتمد بالمنصة:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              رواية شفهية (من كبار السن)
            </span>
            <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              معلومة موثقة (من مراجع ومؤرخين)
            </span>
            <span className="px-3 py-1 rounded-xl bg-blue-50 text-blue-900 border border-blue-200 flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              وثيقة تاريخية (مخطوطات وصكوك)
            </span>
          </div>
          <div className="text-stone-500 text-[11px]">
            * تخضع كافة المشاركات للمراجعة والتدقيق التاريخي قبل النشر
          </div>
        </div>

        {/* Filters Area: Tribe Branches Pills */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-700" />
              اختر القبيلة / البطن لتصفح روايات أجدادها:
            </span>
            <span className="text-[11px] text-stone-500">
              {selectedTribe === "الكل" ? "عرض روايات كافة القبائل" : `قبيلة ${selectedTribe}`}
            </span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-3 no-scrollbar">
            {tribeBranches.map(tribe => (
              <button
                key={tribe}
                onClick={() => setSelectedTribe(tribe)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedTribe === tribe
                    ? "bg-[#12201A] text-[#F8F4EA] font-bold border border-[#12201A] shadow-sm"
                    : "bg-white text-stone-700 hover:bg-stone-50 border border-[#E6DEC8]"
                }`}
              >
                {tribe}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Bar */}
        <div className="mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-3 no-scrollbar">
            {categories.map(cat => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? "bg-emerald-800 text-white border border-emerald-800 shadow-sm"
                      : "bg-white text-stone-600 hover:text-stone-900 border border-[#E6DEC8]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Content Type Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          <div className="relative md:col-span-2">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input 
              type="text"
              placeholder="ابحث في قصص زمان، اسم الراوي، أو كلمات من التراث..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#E6DEC8] rounded-2xl pr-10 pl-4 py-2.5 text-xs text-stone-800 focus:outline-none focus:border-amber-600 placeholder-stone-400 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-1 bg-white border border-[#E6DEC8] rounded-2xl p-1 text-xs shadow-sm">
            {contentTypes.map(ct => (
              <button
                key={ct.id}
                onClick={() => setSelectedContentType(ct.id)}
                className={`flex-1 py-1.5 rounded-xl transition-all font-medium ${
                  selectedContentType === ct.id
                    ? "bg-stone-100 text-amber-800 font-bold shadow-sm"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                {ct.label}
              </button>
            ))}
          </div>
        </div>

        {/* Memory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMemories.map(item => {
            const isPlaying = playingAudioId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setActiveMemory(item)}
                className="group bg-white rounded-3xl border border-[#E6DEC8] overflow-hidden hover:border-[#C7A25C]/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Media Header */}
                  <div className="relative h-48 overflow-hidden bg-stone-100">
                    <img 
                      src={item.imageUrl || "https://images.unsplash.com/photo-1599818816942-0f0489a24ca3?auto=format&fit=crop&w=800&q=80"}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

                    {/* Tribe Branch Badge */}
                    <div className="absolute top-3 right-3 bg-stone-900/90 backdrop-blur-md text-amber-300 text-[11px] font-bold px-2.5 py-1 rounded-xl border border-amber-500/30 flex items-center gap-1">
                      <Users className="w-3 h-3 text-amber-400" />
                      <span>{item.tribeBranch}</span>
                    </div>

                    {/* Content Type Pill */}
                    <div className="absolute top-3 left-3">
                      {item.contentType === "oral_narration" && (
                        <span className="bg-amber-950/90 backdrop-blur-md text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-xl border border-amber-600/40 flex items-center gap-1">
                          <Mic className="w-3 h-3 text-amber-400" />
                          رواية شفهية
                        </span>
                      )}
                      {item.contentType === "verified_info" && (
                        <span className="bg-emerald-950/90 backdrop-blur-md text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-xl border border-emerald-600/40 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          معلومة موثقة
                        </span>
                      )}
                      {item.contentType === "historical_document" && (
                        <span className="bg-blue-950/90 backdrop-blur-md text-blue-300 text-[10px] font-bold px-2.5 py-1 rounded-xl border border-blue-600/40 flex items-center gap-1">
                          <FileText className="w-3 h-3 text-blue-400" />
                          وثيقة تاريخية
                        </span>
                      )}
                    </div>

                    {/* Audio Preview Button if Available */}
                    {item.audioRecordingUrl && (
                      <div className="absolute bottom-3 right-3">
                        <button
                          onClick={(e) => handleToggleAudio(item.id, e)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg transition-all ${
                            isPlaying
                              ? "bg-amber-500 text-stone-950 animate-pulse"
                              : "bg-stone-900/90 text-amber-300 hover:bg-amber-600 hover:text-stone-950 border border-amber-500/40"
                          }`}
                        >
                          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                          <span>{isPlaying ? "إيقاف الصوت" : `استمع (${item.audioDuration || "03:40"})`}</span>
                        </button>
                      </div>
                    )}

                    {/* Category Label */}
                    <div className="absolute bottom-3 left-3 text-[11px] text-stone-200 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-lg">
                      {item.category}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <h3 className="font-['Amiri'] text-xl font-bold text-[#12201A] group-hover:text-emerald-800 transition-colors leading-snug mb-2.5">
                      {item.title}
                    </h3>

                    {/* Narrator Info */}
                    <div className="flex items-center gap-2 text-xs text-stone-500 mb-3 p-2 rounded-xl bg-[#F8F4EA] border border-[#E6DEC8]">
                      <div className="w-6 h-6 rounded-full bg-amber-800 text-white flex items-center justify-center font-bold text-[10px]">
                        {item.narratorName[0]}
                      </div>
                      <div className="truncate">
                        <span className="text-stone-800 font-semibold">{item.narratorName}</span>
                        {item.narratorAgeOrEra && (
                          <span className="text-stone-500 mr-1 text-[11px]">({item.narratorAgeOrEra})</span>
                        )}
                      </div>
                    </div>

                    {/* Snippet text */}
                    <p className="text-xs text-[#5A524C] leading-relaxed line-clamp-3 mb-3">
                      {item.content}
                    </p>

                    {/* Location and era */}
                    <div className="flex items-center justify-between text-[11px] text-stone-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        {item.villageOrLocation}
                      </span>
                      {item.dateOfEventOrEra && (
                        <span className="text-stone-400">
                          {item.dateOfEventOrEra}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Likes & Details */}
                <div className="p-4 border-t border-[#E6DEC8] flex items-center justify-between text-xs bg-[#F8F4EA]/60">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => handleLike(item.id, e)}
                      className="flex items-center gap-1 text-stone-500 hover:text-red-500 transition-colors"
                    >
                      <Heart className="w-3.5 h-3.5 fill-red-500/20 text-red-500" />
                      <span>{item.likesCount}</span>
                    </button>
                    <span className="text-stone-400 text-[11px]">
                      مرسل: {item.contributorName}
                    </span>
                  </div>

                  <span className="text-emerald-800 group-hover:translate-x-1 transition-transform font-bold text-xs flex items-center gap-1">
                    قراءة كامل الرواية ←
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredMemories.length === 0 && (
          <div className="text-center py-16 bg-stone-900/40 rounded-3xl border border-stone-800">
            <BookOpen className="w-12 h-12 text-stone-600 mx-auto mb-3" />
            <h4 className="font-['Amiri'] text-xl font-bold text-stone-300 mb-1">
              لا توجد روايات مطابقة لهذا الفلتر
            </h4>
            <p className="text-xs text-stone-500 mb-4">
              كن أول من يوثق قصة أو رواية أو وثيقة لهذه القبيلة
            </p>
            <button
              onClick={handleOpenSubmit}
              className="px-5 py-2.5 rounded-xl bg-amber-600 text-stone-950 font-bold text-xs"
            >
              إرسال مساهمة الآن
            </button>
          </div>
        )}

      </div>

      {/* Memory Detail Modal */}
      {activeMemory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-stone-900 border border-stone-700 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 text-right shadow-2xl relative">
            <button
              onClick={() => setActiveMemory(null)}
              className="absolute top-5 left-5 w-9 h-9 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition-colors"
            >
              ✕
            </button>

            {/* Header badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                قبيلة: {activeMemory.tribeBranch}
              </span>
              <span className="px-3 py-1 rounded-xl bg-stone-800 text-stone-300 text-xs border border-stone-700">
                {activeMemory.category}
              </span>
              <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${
                activeMemory.contentType === "oral_narration" ? "bg-amber-950 text-amber-300 border-amber-700" :
                activeMemory.contentType === "verified_info" ? "bg-emerald-950 text-emerald-300 border-emerald-700" :
                "bg-blue-950 text-blue-300 border-blue-700"
              }`}>
                {activeMemory.contentType === "oral_narration" ? "رواية شفهية من كبار السن" :
                 activeMemory.contentType === "verified_info" ? "معلومة تاريخية موثقة" : "وثيقة ومخطوطة تاريخية"}
              </span>
            </div>

            <h3 className="font-['Amiri'] text-2xl sm:text-3xl font-bold text-stone-100 mb-4 leading-tight">
              {activeMemory.title}
            </h3>

            {/* Media Image */}
            {activeMemory.imageUrl && (
              <div className="relative h-64 rounded-2xl overflow-hidden mb-6 border border-stone-800">
                <img 
                  src={activeMemory.imageUrl} 
                  alt="" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {/* Audio player if present */}
            {activeMemory.audioRecordingUrl && (
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-amber-200 block">تسجيل صوتي نادر بصوت الراوي</span>
                    <span className="text-[11px] text-stone-400">المدة: {activeMemory.audioDuration || "04:15 دقيقة"}</span>
                  </div>
                </div>
                <button
                  onClick={(e) => handleToggleAudio(activeMemory.id, e)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  {playingAudioId === activeMemory.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{playingAudioId === activeMemory.id ? "إيقاف" : "تشغيل الصوت"}</span>
                </button>
              </div>
            )}

            {/* Document Scan if present */}
            {activeMemory.documentScanUrl && (
              <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 mb-6">
                <span className="text-xs font-bold text-blue-200 block mb-2">صورة الوثيقة التاريخية الأصلية:</span>
                <img src={activeMemory.documentScanUrl} alt="" className="rounded-xl max-h-60 w-full object-cover border border-blue-500/20" />
              </div>
            )}

            {/* Narrator & Contributor Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-stone-950 border border-stone-800 mb-6 text-xs">
              <div>
                <span className="text-stone-400 block text-[11px]">الراوي / المصدر:</span>
                <span className="font-bold text-amber-300">{activeMemory.narratorName}</span>
                {activeMemory.narratorAgeOrEra && (
                  <span className="block text-stone-400 text-[11px]">{activeMemory.narratorAgeOrEra}</span>
                )}
              </div>

              <div>
                <span className="text-stone-400 block text-[11px]">الموقع والحقبة:</span>
                <span className="font-bold text-stone-200">{activeMemory.villageOrLocation} ({activeMemory.region})</span>
                {activeMemory.dateOfEventOrEra && (
                  <span className="block text-stone-400 text-[11px]">{activeMemory.dateOfEventOrEra}</span>
                )}
              </div>
            </div>

            {/* Full Story Content */}
            <div className="mb-6">
              <h4 className="font-['Amiri'] text-xl font-bold text-amber-300 mb-3">نص الرواية الكامل:</h4>
              <div className="text-sm sm:text-base text-stone-200 leading-loose whitespace-pre-line bg-stone-950/50 p-5 rounded-2xl border border-stone-800/80 font-['Amiri'] text-lg">
                {activeMemory.content}
              </div>
            </div>

            {/* Tags */}
            {activeMemory.tags && activeMemory.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-6">
                {activeMemory.tags.map((t, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-stone-800 text-stone-300 text-[11px]">
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* Footer verification & contribution info */}
            <div className="pt-4 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
              <span>
                مرسل المساهمة: <strong className="text-stone-200">{activeMemory.contributorName}</strong>
              </span>
              <span className="text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                معتمدة ومنشورة في الأرشيف
              </span>
            </div>

          </div>
        </div>
      )}

      {/* Submission Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-stone-900 border border-amber-500/40 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 text-right shadow-2xl relative">
            <button
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute top-5 left-5 w-9 h-9 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition-colors"
            >
              ✕
            </button>

            {!submissionSuccess ? (
              <form onSubmit={handleFormSubmit}>
                <div className="flex items-center gap-2 text-xs text-amber-400 font-bold mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>إرسال مساهمة لأرشيف ذاكرة بني شهر</span>
                </div>
                
                <h3 className="font-['Amiri'] text-2xl sm:text-3xl font-bold text-stone-100 mb-2">
                  وثّق قصة أو صورة أو تسجيلاً أو وثيقة لقبيلتك
                </h3>
                <p className="text-xs text-stone-400 mb-6 leading-relaxed">
                  نرحب بمساهمات أبناء وبنات بني شهر لحفظ التاريخ. ستتم مراجعة المساهمة وتدقيقها من قبل لجنة التوثيق التراثي بالمنصة قبل نشرها.
                </p>

                <div className="space-y-4 mb-6">
                  {/* Tribe & Content Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">
                        القبيلة / البطن:
                      </label>
                      <select
                        value={submittingTribe}
                        onChange={(e) => setSubmittingTribe(e.target.value)}
                        required
                        className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                      >
                        {tribeBranches.filter(t => t !== "الكل").map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">
                        تصنيف المحتوى:
                      </label>
                      <select
                        value={submittingContentType}
                        onChange={(e) => setSubmittingContentType(e.target.value as MemoryContentType)}
                        className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500 font-bold text-amber-300"
                      >
                        <option value="oral_narration">رواية شفهية (من كبار السن)</option>
                        <option value="verified_info">معلومة موثقة (من مراجع ومؤرخين)</option>
                        <option value="historical_document">وثيقة ومخطوطة تاريخية</option>
                      </select>
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      القسم التراثي:
                    </label>
                    <select
                      value={submittingCategory}
                      onChange={(e) => setSubmittingCategory(e.target.value as MemoryCategory)}
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                    >
                      {categories.filter(c => c.id !== "الكل").map(c => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      عنوان القصة أو الوثيقة:
                    </label>
                    <input 
                      type="text"
                      placeholder="مثال: حكاية حلف وسوق القرية القديم عام 1350هـ"
                      value={submittingTitle}
                      onChange={(e) => setSubmittingTitle(e.target.value)}
                      required
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Narrator Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">
                        اسم الراوي / صاحب الرواية:
                      </label>
                      <input 
                        type="text"
                        placeholder="مثال: الشيخ علي بن محمد الشهري"
                        value={submittingNarrator}
                        onChange={(e) => setSubmittingNarrator(e.target.value)}
                        required
                        className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">
                        عمر الراوي / تاريخ الميلاد / الحقبة:
                      </label>
                      <input 
                        type="text"
                        placeholder="مثال: 85 عاماً / من مواليد 1360هـ"
                        value={submittingNarratorAge}
                        onChange={(e) => setSubmittingNarratorAge(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Location & Region */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-stone-300 mb-1">
                        القرية أو المكان المحدد:
                      </label>
                      <input 
                        type="text"
                        placeholder="مثال: قرية العقيقة / وادي ترج / حصن آل قاسم"
                        value={submittingLocation}
                        onChange={(e) => setSubmittingLocation(e.target.value)}
                        required
                        className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">
                        المنطقة:
                      </label>
                      <select
                        value={submittingRegion}
                        onChange={(e) => setSubmittingRegion(e.target.value as any)}
                        className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                      >
                        <option value="النماص">النماص</option>
                        <option value="تنومة">تنومة</option>
                        <option value="المجاردة">المجاردة</option>
                        <option value="السراة">السراة</option>
                        <option value="تهامة">تهامة</option>
                      </select>
                    </div>
                  </div>

                  {/* Story Text */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      نص القصة / الرواية / تفاصيل الوثيقة:
                    </label>
                    <textarea 
                      rows={5}
                      placeholder="اكتب الرواية كاملة كما سمعتها من كبار السن، أو تفاصيل العادة القديمة والأهازيج..."
                      value={submittingContent}
                      onChange={(e) => setSubmittingContent(e.target.value)}
                      required
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500 leading-relaxed font-['Amiri'] text-base"
                    />
                  </div>

                  {/* Contributor Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">
                        اسمك (مرسل المشاركة):
                      </label>
                      <input 
                        type="text"
                        value={submittingContributor}
                        onChange={(e) => setSubmittingContributor(e.target.value)}
                        required
                        className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">
                        رقم جوالك (للتواصل والتحقق):
                      </label>
                      <input 
                        type="tel"
                        value={submittingPhone}
                        onChange={(e) => setSubmittingPhone(e.target.value)}
                        required
                        className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/20 text-amber-300 text-[11px] mb-6 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    إشعار: تُراجع جميع المواد المرسلة بعناية من قِبل المؤرخين ومشرفي المنصة لضمان دقة التوثيق وحفظ الحقوق قبل نشرها في الأرشيف العام.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-700 to-emerald-700 hover:from-amber-500 hover:to-emerald-600 text-stone-950 font-extrabold text-sm shadow-xl shadow-amber-950 transition-all hover:scale-[1.01]"
                >
                  إرسال المساهمة للمراجعة والاعتماد
                </button>
              </form>
            ) : (
              /* Success View */
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-['Amiri'] text-2xl font-bold text-stone-100 mb-2">
                  تم استلام مساهمتك في ذاكرة بني شهر بنجاح!
                </h4>
                <p className="text-xs text-stone-300 max-w-md mx-auto mb-6 leading-relaxed">
                  شكراً لوفائك وحرصك على تخليد تراث قبيلتك وأجدادك. تم تحويل القصة إلى لجنة التوثيق والمراجعة للمصادقة عليها ونشرها قريباً في الأرشيف الرسمي.
                </p>

                <button
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs"
                >
                  إغلاق وتصفح الذاكرة
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </section>
  );
};
