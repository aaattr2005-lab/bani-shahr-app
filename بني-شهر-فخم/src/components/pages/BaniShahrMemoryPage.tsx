import React, { useState, useEffect } from "react";
import { MemoryItem, MemoryCategory, MemoryContentType } from "../../types";
import { DataStore } from "../../lib/datastore";
import { DETAILED_TRIBES } from "../../data/tribesData";
import { narratorEngine, NarratorGender, NarratorSpeed } from "../../lib/narratorAudioEngine";
import { 
  BookOpen, 
  History, 
  Sparkles, 
  ArrowRight, 
  Search, 
  Filter, 
  Plus, 
  Heart, 
  Share2, 
  Volume2, 
  VolumeX, 
  MapPin, 
  Users, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  Award, 
  ImageIcon, 
  Mic, 
  FileText, 
  CheckCircle2, 
  Layers,
  ChevronRight,
  ExternalLink,
  Info,
  Play,
  Pause,
  Square,
  Headphones,
  Radio,
  UserCheck,
  Type,
  Eye,
  Maximize2,
  Minimize2,
  Palette,
  Sliders
} from "lucide-react";

interface BaniShahrMemoryPageProps {
  onBack?: () => void;
  onBackToHome: () => void;
  initialTribeFilter?: string;
}

export const BaniShahrMemoryPage: React.FC<BaniShahrMemoryPageProps> = ({
  onBack,
  onBackToHome,
  initialTribeFilter
}) => {
  const [memories, setMemories] = useState<MemoryItem[]>(() => DataStore.getMemories(false));
  const [selectedTribe, setSelectedTribe] = useState<string>(initialTribeFilter || "الكل");
  const [selectedCategory, setSelectedCategory] = useState<string>("الكل");
  const [selectedContentType, setSelectedContentType] = useState<string>("الكل");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Story Reader Customization Preferences
  const [readingTheme, setReadingTheme] = useState<"sepia" | "day">(() => {
    try {
      const saved = localStorage.getItem("baniShahr_memory_reading_theme");
      if (saved === "sepia" || saved === "day") return saved;
      return "day";
    } catch {
      return "day";
    }
  });

  const [readingFontSize, setReadingFontSize] = useState<"normal" | "large" | "xlarge" | "xxlarge">(() => {
    try {
      const saved = localStorage.getItem("baniShahr_memory_font_size");
      if (saved === "normal" || saved === "large" || saved === "xlarge" || saved === "xxlarge") return saved;
      return "large";
    } catch {
      return "large";
    }
  });

  const [readingFontFamily, setReadingFontFamily] = useState<"amiri" | "tajawal">(() => {
    try {
      const saved = localStorage.getItem("baniShahr_memory_font_family");
      return saved === "tajawal" ? "tajawal" : "amiri";
    } catch {
      return "amiri";
    }
  });

  const [readingLineHeight, setReadingLineHeight] = useState<"comfortable" | "loose">(() => {
    try {
      const saved = localStorage.getItem("baniShahr_memory_line_height");
      return saved === "comfortable" ? "comfortable" : "loose";
    } catch {
      return "loose";
    }
  });

  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [showReaderSettings, setShowReaderSettings] = useState<boolean>(false);

  // Detail Modal
  const [activeMemory, setActiveMemory] = useState<MemoryItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSetReadingTheme = (theme: "sepia" | "day") => {
    setReadingTheme(theme);
    try {
      localStorage.setItem("baniShahr_memory_reading_theme", theme);
    } catch {}
  };

  const handleSetFontSize = (size: "normal" | "large" | "xlarge" | "xxlarge") => {
    setReadingFontSize(size);
    try {
      localStorage.setItem("baniShahr_memory_font_size", size);
    } catch {}
  };

  const handleSetFontFamily = (family: "amiri" | "tajawal") => {
    setReadingFontFamily(family);
    try {
      localStorage.setItem("baniShahr_memory_font_family", family);
    } catch {}
  };

  const handleSetLineHeight = (lh: "comfortable" | "loose") => {
    setReadingLineHeight(lh);
    try {
      localStorage.setItem("baniShahr_memory_line_height", lh);
    } catch {}
  };

  // Advanced Audio Narration Engine State
  const [narratorGender, setNarratorGender] = useState<NarratorGender>("male");
  const [narratorSpeed, setNarratorSpeed] = useState<NarratorSpeed>(0.92);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activePlayingStoryId, setActivePlayingStoryId] = useState<string | null>(null);
  const [currentSentence, setCurrentSentence] = useState<string>("");
  const [engineResolvedName, setEngineResolvedName] = useState<string>("صوت استوديو طبيعي مع وقفات سردية");

  // Submission Modal
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);

  // Stop narration on unmount
  useEffect(() => {
    return () => {
      narratorEngine.stop();
    };
  }, []);

  // Browser/device back button synchronization
  useEffect(() => {
    const handlePop = () => {
      if (activeMemory) {
        narratorEngine.stop();
        setIsSpeaking(false);
        setIsPaused(false);
        setActivePlayingStoryId(null);
        setActiveMemory(null);
        return;
      }
      if (isSubmitModalOpen) {
        setIsSubmitModalOpen(false);
        return;
      }
    };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, [activeMemory, isSubmitModalOpen]);
  const [submittingTribe, setSubmittingTribe] = useState<string>("شهر ثرامين");
  const [submittingCategory, setSubmittingCategory] = useState<MemoryCategory>("قصص زمان وروايات الأجداد");
  const [submittingContentType, setSubmittingContentType] = useState<MemoryContentType>("oral_narration");
  const [submittingTitle, setSubmittingTitle] = useState<string>("");
  const [submittingNarrator, setSubmittingNarrator] = useState<string>("");
  const [submittingNarratorAge, setSubmittingNarratorAge] = useState<string>("");
  const [submittingContributor, setSubmittingContributor] = useState<string>(() => DataStore.getCurrentUser().name || "");
  const [submittingPhone, setSubmittingPhone] = useState<string>(() => DataStore.getCurrentUser().phone || "");
  const [submittingLocation, setSubmittingLocation] = useState<string>("");
  const [submittingRegion, setSubmittingRegion] = useState<"النماص" | "تنومة" | "المجاردة" | "السراة" | "تهامة">("النماص");
  const [submittingDateEra, setSubmittingDateEra] = useState<string>("");
  const [submittingContent, setSubmittingContent] = useState<string>("");
  const [submittingImageUrl, setSubmittingImageUrl] = useState<string>("");

  // Listen to DataStore updates
  useEffect(() => {
    const refresh = () => {
      setMemories(DataStore.getMemories(false));
    };
    refresh();
  }, []);

  const tribeBranches = [
    "الكل",
    "شهر ثرامين",
    "بنو التيم",
    "بلحارث",
    "العوامر",
    "شهر الشام",
    "أثرب",
    "الشهارية",
    "ثربان",
    "آل العلاء",
    "آل الجيحني",
    "سفيان",
    "عبس",
    "عموم قبائل بني شهر",
    "بني شهر السراة",
    "تهامة بني شهر"
  ];

  const categories: { id: string; label: string; icon: any }[] = [
    { id: "الكل", label: "جميع الأقسام", icon: Layers },
    { id: "قصص زمان", label: "قصص زمان والبطولات", icon: BookOpen },
    { id: "روايات الأجداد", label: "روايات الأجداد", icon: History },
    { id: "قصص كل قبيلة", label: "قصص كل قبيلة", icon: Users },
    { id: "العادات القديمة", label: "الأعراف والتقاليد", icon: Award },
    { id: "الأمثال الشعبية", label: "الأمثال والحكم", icon: Sparkles },
    { id: "الحياة قديمًا", label: "الحياة اليومية قديماً", icon: Clock },
    { id: "الزراعة والرعي", label: "المدرجات ومواسم الحصاد", icon: MapPin },
    { id: "الأسواق القديمة", label: "الأسواق وقوافل التجارة", icon: MapPin },
    { id: "الأعراس والمناسبات", label: "أفراح وعرضات بني شهر", icon: Award },
    { id: "صور قديمة", label: "صور قديمة ونفائس", icon: ImageIcon },
    { id: "تسجيلات صوتية لكبار السن", label: "تسجيلات الرواة كبار السن", icon: Mic },
  ];

  const filteredMemories = memories.filter(item => {
    const matchTribe = selectedTribe === "الكل" || 
      item.tribeBranch.includes(selectedTribe) ||
      (selectedTribe === "بني شهر السراة" && (item.region === "النماص" || item.region === "تنومة" || item.region === "السراة")) ||
      (selectedTribe === "قبائل تهامة وبني شهر" && item.region === "تهامة");

    const matchCategory = selectedCategory === "الكل" || 
      item.category === selectedCategory || 
      item.category.includes(selectedCategory) ||
      selectedCategory.includes(item.category);

    const matchType = selectedContentType === "الكل" || item.contentType === selectedContentType;

    const matchSearch = searchQuery.trim() === "" || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.narratorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tribeBranch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.villageOrLocation.toLowerCase().includes(searchQuery.toLowerCase());

    return matchTribe && matchCategory && matchType && matchSearch;
  });

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    DataStore.likeMemory(id);
    setMemories(DataStore.getMemories(false));
  };

  const handleShare = (item: MemoryItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const text = `📖 من ذاكرة بني شهر: "${item.title}"\nقبيلة: ${item.tribeBranch}\nالراوي: ${item.narratorName}\nالموثق: ${item.contributorName}\n\n${item.content.slice(0, 200)}...\n\nعبر تطبيق ومنصة بني شهر`;
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: text,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  // Advanced Narration Engine Handlers
  const handleToggleNarration = (story: MemoryItem, e?: React.MouseEvent) => {
    e?.stopPropagation();

    // If already playing this same story, toggle pause / resume
    if (activePlayingStoryId === story.id && isSpeaking) {
      if (isPaused) {
        narratorEngine.resume();
        setIsPaused(false);
      } else {
        narratorEngine.pause();
        setIsPaused(true);
      }
      return;
    }

    // Start playing narration
    const narrationFullText = `${story.title}. من توثيق ${story.narratorName}. ${story.content}`;
    setActivePlayingStoryId(story.id);
    setIsSpeaking(true);
    setIsPaused(false);
    setCurrentSentence(story.title);

    narratorEngine.speak(narrationFullText, {
      gender: narratorGender,
      speed: narratorSpeed,
      onStart: () => {
        setIsSpeaking(true);
        setIsPaused(false);
      },
      onSentenceChange: (chunk) => {
        setCurrentSentence(chunk);
      },
      onEnd: () => {
        setIsSpeaking(false);
        setIsPaused(false);
        setActivePlayingStoryId(null);
        setCurrentSentence("");
      },
      onError: () => {
        setIsSpeaking(false);
        setIsPaused(false);
        setActivePlayingStoryId(null);
      },
      onEngineResolved: (eng) => {
        setEngineResolvedName(eng);
      }
    });
  };

  const handleStopNarration = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    narratorEngine.stop();
    setIsSpeaking(false);
    setIsPaused(false);
    setActivePlayingStoryId(null);
    setCurrentSentence("");
  };

  const handleChangeGender = (gender: NarratorGender) => {
    setNarratorGender(gender);
    if (isSpeaking && activePlayingStoryId) {
      const currentStory = memories.find(m => m.id === activePlayingStoryId) || activeMemory;
      if (currentStory) {
        narratorEngine.stop();
        setTimeout(() => {
          handleToggleNarration(currentStory);
        }, 150);
      }
    }
  };

  const handleChangeSpeed = (speed: NarratorSpeed) => {
    setNarratorSpeed(speed);
    if (isSpeaking && activePlayingStoryId) {
      const currentStory = memories.find(m => m.id === activePlayingStoryId) || activeMemory;
      if (currentStory) {
        narratorEngine.stop();
        setTimeout(() => {
          handleToggleNarration(currentStory);
        }, 150);
      }
    }
  };

  const handleSubmitContribution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingTitle.trim() || !submittingContent.trim()) return;

    DataStore.submitMemoryContribution({
      title: submittingTitle.trim(),
      tribeBranch: submittingTribe,
      category: submittingCategory,
      contentType: submittingContentType,
      narratorName: submittingNarrator.trim() || "راوية من كبار السن",
      narratorAgeOrEra: submittingNarratorAge.trim() || undefined,
      contributorName: submittingContributor.trim() || "أحد أبناء بني شهر",
      contributorPhone: submittingPhone.trim() || undefined,
      villageOrLocation: submittingLocation.trim() || "ديار بني شهر",
      region: submittingRegion,
      dateOfEventOrEra: submittingDateEra.trim() || "القرن الماضي",
      content: submittingContent.trim(),
      imageUrl: submittingImageUrl.trim() || undefined
    });

    setSubmissionSuccess(true);
    setTimeout(() => {
      setSubmissionSuccess(false);
      setIsSubmitModalOpen(false);
      setSubmittingTitle("");
      setSubmittingContent("");
      setSubmittingNarrator("");
      setSubmittingNarratorAge("");
      setSubmittingLocation("");
      setSubmittingImageUrl("");
      setMemories(DataStore.getMemories(false));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8F4EA] text-stone-900 font-['Tajawal',sans-serif] flex flex-col selection:bg-amber-800 selection:text-white transition-colors duration-300">
      
      {/* Top Breadcrumbs & Header Bar */}
      <header className="sticky top-0 z-40 bg-[#12201A]/95 border-[#7C9D86]/20 backdrop-blur-md border-b text-[#F8F4EA] shadow-xl transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (activeMemory) {
                  if (isSpeaking) window.speechSynthesis.cancel();
                  setIsSpeaking(false);
                  setActiveMemory(null);
                } else if (isSubmitModalOpen) {
                  setIsSubmitModalOpen(false);
                } else if (onBack) {
                  onBack();
                } else {
                  onBackToHome();
                }
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs sm:text-sm font-bold shadow-md transition-all hover:-translate-x-0.5"
            >
              <ArrowRight className="w-4 h-4 shrink-0" />
              <span>{activeMemory ? "العودة للذاكرة" : "العودة"}</span>
            </button>

            <div className="h-5 w-px bg-stone-700 hidden sm:block" />

            <div className="hidden sm:flex items-center gap-1.5 text-xs sm:text-sm text-stone-300">
              <button onClick={onBackToHome} className="hover:text-amber-300 transition-colors">الرئيسية</button>
              <span>/</span>
              <span className="text-amber-400 font-bold">ذاكرة بني شهر</span>
            </div>
          </div>

          {/* Header Controls: Submit Story */}
          <div className="flex items-center gap-2.5">
            {/* Quick Submit Story Action */}
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs sm:text-sm font-bold shadow-lg transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden xs:inline">توثيق قصة أو رواية</span>
              <span className="xs:hidden">توثيق</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Page Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* Page Hero Showcase */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#12241b] via-[#1a382a] to-[#2b1e14] border border-[#7C9D86]/30 p-6 sm:p-10 shadow-2xl text-white">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold">
              <History className="w-3.5 h-3.5" />
              <span>الأرشيف التراثي والتاريخي الشامل لبني شهر</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold font-['Amiri'] leading-tight text-white drop-shadow-md">
              ذاكرة بني شهر: السير والروايات والأصالة
            </h1>

            <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-2xl">
              سجل حي متكامل يوثق قصص الأجداد، بطولات القبائل، العادات والأعراف القديمة، نوادر الوثائق، وتسجيلات الرواة الشفهية لكبار السن في السراة وتهامة.
            </p>

            {/* Quick Filter Counts */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-stone-300">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/30 border border-stone-700/60">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span><strong>{memories.length}</strong> قصة ورواية معتمدة وموثقة</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/30 border border-stone-700/60">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>إشراف وتدقيق من مشايخ ومشرفي القبائل</span>
              </div>
            </div>
          </div>
        </section>

        {/* Search & Filters Controls */}
        <section className="bg-white border-stone-200 text-stone-900 rounded-3xl p-6 border shadow-sm space-y-6">
          
          {/* Top Search & Filter Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="ابحث في ذاكرة بني شهر بالاسم، العنوان، القرية، أو الراوي..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-3.5 rounded-2xl text-sm transition-all shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-600 bg-stone-50 border border-stone-300 text-stone-900 placeholder-stone-400 focus:bg-white"
              />
            </div>

            {/* Content Type Selector */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              {[
                { id: "الكل", label: "كافة الأنواع" },
                { id: "oral_narration", label: "روايات شفهية" },
                { id: "verified_info", label: "معلومات موثقة" },
                { id: "historical_document", label: "وثائق تاريخية" }
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedContentType(type.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    selectedContentType === type.id
                      ? "bg-amber-600 text-white shadow-md"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tribe Filter Tabs */}
          <div className="space-y-2">
            <label className="text-xs font-bold flex items-center gap-1.5 text-stone-600">
              <Users className="w-3.5 h-3.5 text-amber-500" />
              <span>تصفية حسب القبيلة أو الفرع:</span>
            </label>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {tribeBranches.map((tribe) => (
                <button
                  key={tribe}
                  onClick={() => setSelectedTribe(tribe)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all border ${
                    selectedTribe === tribe
                      ? "bg-stone-900 border-stone-900 text-amber-400 shadow-sm"
                      : "bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-400 hover:bg-stone-100"
                  }`}
                >
                  {tribe}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <label className="text-xs font-bold flex items-center gap-1.5 text-stone-600">
              <Layers className="w-3.5 h-3.5 text-amber-500" />
              <span>الأقسام والمواضيع التراثية:</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-emerald-700 text-white shadow-sm"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </section>

        {/* Stories Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-['Amiri'] flex items-center gap-2 text-stone-900">
              <span>الروايات والقصص المعروضة</span>
              <span className="text-xs font-sans px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900">
                {filteredMemories.length} قصة
              </span>
            </h2>
          </div>

          {filteredMemories.length === 0 ? (
            <div className="p-12 text-center rounded-3xl border space-y-4 bg-white border-stone-200">
              <BookOpen className="w-12 h-12 text-stone-500 mx-auto" />
              <h3 className="text-lg font-bold font-['Amiri'] text-stone-800">لا توجد قصص مطابقة لخيارات البحث</h3>
              <p className="text-xs text-stone-400 max-w-md mx-auto">
                جرب تغيير خيارات التصفية أو القبيلة المحددة، أو كن أول من يوثق قصة ورواية جديدة في هذا القسم!
              </p>
              <button
                onClick={() => {
                  setSelectedTribe("الكل");
                  setSelectedCategory("الكل");
                  setSelectedContentType("الكل");
                  setSearchQuery("");
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-500"
              >
                إعادة ضبط الفلاتر
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMemories.map((story) => (
                <div
                  key={story.id}
                  onClick={() => {
                    setActiveMemory(story);
                  }}
                  className="group cursor-pointer rounded-3xl bg-white border border-stone-200 hover:border-amber-500/60 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Story Image / Banner */}
                    <div className="relative h-48 w-full bg-stone-900 overflow-hidden">
                      <img
                        src={story.imageUrl}
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Tribe & Category Badges */}
                      <div className="absolute top-3 right-3 left-3 flex items-center justify-between gap-2">
                        <span className="px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-bold">
                          {story.tribeBranch}
                        </span>
                        <span className="px-2.5 py-1 rounded-xl bg-amber-600/90 text-white text-[11px] font-semibold">
                          {story.category}
                        </span>
                      </div>

                      {/* Content Type Badge */}
                      <div className="absolute bottom-3 right-3">
                        <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${
                          story.contentType === "historical_document"
                            ? "bg-blue-900/80 text-blue-200 border-blue-400/40"
                            : story.contentType === "verified_info"
                            ? "bg-emerald-900/80 text-emerald-200 border-emerald-400/40"
                            : "bg-amber-900/80 text-amber-200 border-amber-400/40"
                        }`}>
                          {story.contentType === "historical_document" ? "وثيقة تاريخية" : story.contentType === "verified_info" ? "معلومة موثقة" : "رواية شفهية"}
                        </span>
                      </div>
                    </div>

                    {/* Story Body */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs text-stone-500">
                        <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{story.villageOrLocation} ({story.region})</span>
                        {story.dateOfEventOrEra && (
                          <>
                            <span>•</span>
                            <span className="truncate">{story.dateOfEventOrEra}</span>
                          </>
                        )}
                      </div>

                      <h3 className="text-xl font-bold font-['Amiri'] text-stone-900 group-hover:text-amber-700 transition-colors line-clamp-2">
                        {story.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-stone-600 line-clamp-3 leading-relaxed">
                        {story.content}
                      </p>
                    </div>
                  </div>

                  {/* Story Footer with Narrator & Actions */}
                  <div className="p-5 pt-3 border-t border-stone-100 bg-stone-50/50 text-stone-500 flex items-center justify-between text-xs">
                    <div className="flex flex-col min-w-0">
                      <span className="truncate">الراوي: <strong className="text-stone-800">{story.narratorName}</strong></span>
                      <span className="text-[11px] truncate text-stone-400">الموثق: {story.contributorName}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Quick Listen Button */}
                      <button
                        onClick={(e) => handleToggleNarration(story, e)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all text-xs ${
                          activePlayingStoryId === story.id && isSpeaking
                            ? isPaused
                              ? "bg-amber-100 text-amber-900 border border-amber-300"
                              : "bg-emerald-600 text-white shadow-md animate-pulse"
                            : "bg-amber-100/80 hover:bg-amber-200 text-amber-900"
                        }`}
                        title="استمع للرواية بالصوت الطبيعي"
                      >
                        {activePlayingStoryId === story.id && isSpeaking ? (
                          isPaused ? (
                            <>
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>متابعة</span>
                            </>
                          ) : (
                            <>
                              <Pause className="w-3.5 h-3.5 fill-current" />
                              <span>إيقاف</span>
                            </>
                          )
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                            <span>استماع</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={(e) => handleLike(story.id, e)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-rose-500 transition-colors hover:bg-rose-50"
                        title="إعجاب بالقصة"
                      >
                        <Heart className="w-4 h-4 fill-rose-600/30" />
                        <span className="font-bold text-[11px]">{story.likesCount}</span>
                      </button>

                      <button
                        onClick={(e) => handleShare(story, e)}
                        className="p-1.5 rounded-xl transition-colors hover:bg-stone-200 text-stone-600"
                        title="مشاركة القصة"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </section>

      </main>

      {/* Story Reader Detail Modal with Comprehensive Dark Mode & Eye Comfort Controls */}
      {activeMemory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div 
            className={`w-full ${
              isFocusMode ? "max-w-5xl h-[96vh]" : "max-w-3xl max-h-[92vh]"
            } rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 ${
              readingTheme === "night"
                ? "bg-[#0E131A] text-[#E5D7BF] border border-[#253242]"
                : readingTheme === "sepia"
                ? "bg-[#251D16] text-[#E8DCCF] border border-[#423427]"
                : "bg-[#FCFAF6] text-stone-900 border border-stone-200"
            }`}
          >
            
            {/* Modal Header */}
            <div className={`p-4 sm:p-6 ${
              readingTheme === "sepia"
                ? "bg-[#1B140E] border-b border-[#36291E]"
                : "bg-stone-900"
            } text-white flex items-start justify-between gap-4 transition-colors`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold">
                    {activeMemory.tribeBranch}
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-white/10 text-stone-300 text-xs">
                    {activeMemory.category}
                  </span>
                </div>
                <h3 className="text-xl sm:text-3xl font-bold font-['Amiri'] text-amber-400 leading-tight">
                  {activeMemory.title}
                </h3>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {/* Focus Mode Fullscreen toggle */}
                <button
                  onClick={() => setIsFocusMode(!isFocusMode)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors"
                  title={isFocusMode ? "تصغير نافذة القراءة" : "وضع التركيز الموسع"}
                >
                  {isFocusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                {/* Reader Settings toggle */}
                <button
                  onClick={() => setShowReaderSettings(!showReaderSettings)}
                  className={`p-2 rounded-xl transition-colors ${
                    showReaderSettings 
                      ? "bg-amber-600 text-white" 
                      : "bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white"
                  }`}
                  title="تخصيص نمط وخط القراءة"
                >
                  <Sliders className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    handleStopNarration();
                    setActiveMemory(null);
                  }}
                  className="p-2 rounded-xl bg-white/10 hover:bg-rose-900/60 text-stone-300 hover:text-rose-200 transition-colors"
                  title="إغلاق"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Custom Reading Settings Bar (Theme, Font Size, Font Style) */}
            <div className={`px-4 sm:px-6 py-3 border-b flex flex-wrap items-center justify-between gap-3 text-xs ${
              readingTheme === "sepia"
                ? "bg-[#1E1610] border-[#382B1F] text-[#E0D2C2]"
                : "bg-stone-100 border-stone-200 text-stone-700"
            }`}>
              
              {/* Reading Theme Selector */}
              <div className="flex items-center gap-1.5">
                <span className="font-bold flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5 text-amber-500" />
                  <span>النمط:</span>
                </span>

                {/* Day Option */}
                <button
                  onClick={() => handleSetReadingTheme("day")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all ${
                    readingTheme === "day"
                      ? "bg-amber-600 text-white shadow-sm"
                      : "bg-stone-200 hover:bg-stone-300 text-stone-700"
                  }`}
                  title="نمط نهاري فاتح"
                >
                  <span>نهاري</span>
                </button>

                {/* Sepia Option */}
                <button
                  onClick={() => handleSetReadingTheme("sepia")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all ${
                    readingTheme === "sepia"
                      ? "bg-amber-700 text-amber-100 shadow-sm"
                      : "bg-stone-200 hover:bg-stone-300 text-stone-700"
                  }`}
                  title="نمط سيبيا تراثي دافئ"
                >
                  <span>📜</span>
                  <span>سيبيا دافئ</span>
                </button>
              </div>

              {/* Font Size Selector */}
              <div className="flex items-center gap-1.5">
                <span className="font-bold flex items-center gap-1">
                  <Type className="w-3.5 h-3.5 text-amber-500" />
                  <span>الخط:</span>
                </span>
                
                {[
                  { id: "normal", label: "عادي" },
                  { id: "large", label: "كبير" },
                  { id: "xlarge", label: "كبير جداً" },
                  { id: "xxlarge", label: "أقصى" }
                ].map((sz) => (
                  <button
                    key={sz.id}
                    onClick={() => handleSetFontSize(sz.id as any)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      readingFontSize === sz.id
                        ? "bg-amber-600 text-white shadow-sm"
                        : readingTheme === "sepia"
                        ? "bg-[#2D2218] text-stone-300 hover:text-white"
                        : "bg-white text-stone-700 hover:bg-stone-200 border border-stone-300"
                    }`}
                  >
                    {sz.label}
                  </button>
                ))}
              </div>

              {/* Font Family & Line Spacing dropdown/buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleSetFontFamily(readingFontFamily === "amiri" ? "tajawal" : "amiri")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                    readingTheme === "sepia"
                      ? "bg-[#2D2218] border-[#443324] text-stone-200 hover:text-white"
                      : "bg-white border-stone-300 text-stone-800"
                  }`}
                  title="التبديل بين خط أميري الأصيل وخط تجوال"
                >
                  {readingFontFamily === "amiri" ? "خط: أميري (تراثي)" : "خط: تجوال (عصري)"}
                </button>
              </div>

            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-8 overflow-y-auto space-y-6 flex-1">
              
              {/* Optional Image banner */}
              {activeMemory.imageUrl && (
                <div className="rounded-2xl overflow-hidden h-52 sm:h-64 w-full border border-white/10 shadow-lg">
                  <img
                    src={activeMemory.imageUrl}
                    alt={activeMemory.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Metadata Bar */}
              <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl border text-xs ${
                readingTheme === "sepia"
                  ? "bg-[#1B140E] border-[#36291E] text-[#D8C7B5]"
                  : "bg-stone-100 border-stone-200 text-stone-800"
              }`}>
                <div>
                  <span className="text-stone-500 block">الموقع / القرية:</span>
                  <strong className={readingTheme === "sepia" ? "text-amber-300" : "text-stone-900"}>{activeMemory.villageOrLocation}</strong>
                </div>
                <div>
                  <span className="text-stone-500 block">الراوي:</span>
                  <strong className={readingTheme === "sepia" ? "text-stone-100" : "text-stone-900"}>{activeMemory.narratorName}</strong>
                </div>
                <div>
                  <span className="text-stone-500 block">الموثق:</span>
                  <strong className={readingTheme === "sepia" ? "text-stone-100" : "text-stone-900"}>{activeMemory.contributorName}</strong>
                </div>
                <div>
                  <span className="text-stone-500 block">الحقبة الزمنية:</span>
                  <strong className={readingTheme === "sepia" ? "text-stone-100" : "text-stone-900"}>{activeMemory.dateOfEventOrEra || "موروث عريق"}</strong>
                </div>
              </div>

              {/* High Quality Audio Narration Player */}
              <div className={`rounded-2xl p-4 shadow-sm space-y-3 border ${
                readingTheme === "sepia"
                  ? "bg-[#1D1610] border-[#3B2C20]"
                  : "bg-gradient-to-br from-amber-50 to-stone-50 border-amber-200/80"
              }`}>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow">
                      <Headphones className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className={`text-xs sm:text-sm font-bold ${
                        readingTheme === "sepia" ? "text-stone-100" : "text-stone-900"
                      }`}>
                        الاستماع السردي بصوت طبيعي
                      </h4>
                      <p className="text-[11px] text-stone-400">
                        نبرة صوتية مريحة مع وقفات سردية للأجداد
                      </p>
                    </div>
                  </div>

                  {/* Voice Selector: Male vs Female */}
                  <div className={`flex items-center gap-1.5 p-1 rounded-xl border text-xs ${
                    readingTheme === "sepia"
                      ? "bg-[#251D16] border-[#3E3025]"
                      : "bg-white border-stone-200"
                  }`}>
                    <button
                      onClick={() => handleChangeGender("male")}
                      className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                        narratorGender === "male"
                          ? "bg-amber-600 text-white shadow-sm"
                          : "text-stone-400 hover:text-white"
                      }`}
                    >
                      <span>الراوي (صوت وقور)</span>
                    </button>
                    <button
                      onClick={() => handleChangeGender("female")}
                      className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                        narratorGender === "female"
                          ? "bg-amber-600 text-white shadow-sm"
                          : "text-stone-400 hover:text-white"
                      }`}
                    >
                      <span>الراوية (نبرة هادئة)</span>
                    </button>
                  </div>
                </div>

                {/* Player Controls & Pace */}
                <div className={`flex items-center justify-between gap-3 pt-2 border-t flex-wrap ${
                  readingTheme === "sepia" ? "border-[#36291E]" : "border-amber-200/60"
                }`}>
                  
                  {/* Play / Pause / Stop Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleNarration(activeMemory)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow ${
                        activePlayingStoryId === activeMemory.id && isSpeaking
                          ? isPaused
                            ? "bg-amber-600 hover:bg-amber-500 text-white"
                            : "bg-emerald-600 hover:bg-emerald-500 text-white"
                          : "bg-amber-700 hover:bg-amber-600 text-white"
                      }`}
                    >
                      {activePlayingStoryId === activeMemory.id && isSpeaking ? (
                        isPaused ? (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>متابعة الاستماع</span>
                          </>
                        ) : (
                          <>
                            <Pause className="w-3.5 h-3.5 fill-current" />
                            <span>إيقاف مؤقت</span>
                          </>
                        )
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>بدء السرد الصوتي</span>
                        </>
                      )}
                    </button>

                    {activePlayingStoryId === activeMemory.id && isSpeaking && (
                      <button
                        onClick={handleStopNarration}
                        className="px-3 py-2 rounded-xl bg-stone-700 hover:bg-stone-600 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                      >
                        <Square className="w-3 h-3 fill-current" />
                        <span>إنهاء</span>
                      </button>
                    )}
                  </div>

                  {/* Speed Controls */}
                  <div className="flex items-center gap-1 text-[11px]">
                    <span className="text-stone-400 ml-1">السرعة:</span>
                    {([0.85, 0.92, 1.0] as NarratorSpeed[]).map((spd) => (
                      <button
                        key={spd}
                        onClick={() => handleChangeSpeed(spd)}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                          narratorSpeed === spd
                            ? "bg-amber-600 text-white shadow-sm"
                            : readingTheme === "sepia"
                            ? "bg-[#2B2117] text-stone-300 hover:text-white"
                            : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
                        }`}
                      >
                        {spd === 0.85 ? "سردي 0.85x" : spd === 0.92 ? "هادئ 0.92x" : "عادي 1.0x"}
                      </button>
                    ))}
                  </div>

                </div>

                {/* Real-time speech sentence indicator */}
                {activePlayingStoryId === activeMemory.id && isSpeaking && (
                  <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 animate-fadeIn ${
                    readingTheme === "sepia"
                      ? "bg-[#261D15] border-amber-600/40 text-amber-200"
                      : "bg-white/90 border-amber-300 text-stone-700"
                  }`}>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="w-1.5 h-3 bg-amber-500 rounded-full animate-bounce" />
                      <span className="w-1.5 h-4 bg-amber-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                      <span className="w-1.5 h-2 bg-amber-600 rounded-full animate-bounce [animation-delay:0.3s]" />
                    </div>
                    <span className="truncate font-semibold">
                      {isPaused ? "الصوت متوقف مؤقتًا..." : currentSentence || "جاري السرد الآن..."}
                    </span>
                  </div>
                )}
              </div>

              {/* Full Content with Reading Mode Styling (Font Size, Family, Theme) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-bold flex items-center gap-2 ${
                    readingTheme === "sepia" ? "text-amber-300" : "text-stone-900"
                  }`}>
                    <BookOpen className="w-4 h-4" />
                    <span>نص الرواية الكامل:</span>
                  </h4>
                  <div className="text-[11px] text-stone-400">
                    استعراض مريح بدون إجهاد
                  </div>
                </div>

                <div 
                  className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 ${
                    readingTheme === "sepia"
                      ? "bg-[#1E1711] border-[#382B1F] text-[#EFE5D8] shadow-inner"
                      : "bg-stone-50/70 border-stone-200 text-stone-900"
                  }`}
                >
                  <p 
                    className={`whitespace-pre-line ${
                      readingFontFamily === "amiri" ? "font-['Amiri']" : "font-['Tajawal']"
                    } ${
                      readingFontSize === "normal"
                        ? "text-lg leading-[2.2]"
                        : readingFontSize === "large"
                        ? "text-xl sm:text-2xl leading-[2.3]"
                        : readingFontSize === "xlarge"
                        ? "text-2xl sm:text-3xl leading-[2.4]"
                        : "text-3xl sm:text-4xl leading-[2.6]"
                    }`}
                  >
                    {activeMemory.content}
                  </p>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className={`p-4 border-t flex items-center justify-between ${
              readingTheme === "sepia"
                ? "bg-[#1B140E] border-[#36291E]"
                : "bg-stone-50 border-stone-200"
            }`}>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleLike(activeMemory.id, e)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                    readingTheme === "sepia"
                      ? "bg-rose-950/50 hover:bg-rose-950/80 text-rose-300 border border-rose-800/40"
                      : "bg-rose-50 hover:bg-rose-100 text-rose-700"
                  }`}
                >
                  <Heart className="w-4 h-4 fill-rose-600" />
                  <span>إعجاب ({activeMemory.likesCount})</span>
                </button>

                <button
                  onClick={() => handleShare(activeMemory)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                    readingTheme === "sepia"
                      ? "bg-[#161F2C] hover:bg-[#202B3D] text-stone-200 border border-[#2D3C52]"
                      : "bg-stone-200 hover:bg-stone-300 text-stone-800"
                  }`}
                >
                  <Share2 className="w-4 h-4" />
                  <span>{copiedId === activeMemory.id ? "تم النسخ ✓" : "مشاركة الرواية"}</span>
                </button>
              </div>

              <button
                onClick={() => {
                  handleStopNarration();
                  setActiveMemory(null);
                }}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                  readingTheme === "sepia"
                    ? "bg-amber-600 hover:bg-amber-500 text-white shadow-md"
                    : "bg-stone-900 text-white hover:bg-stone-800"
                }`}
              >
                إغلاق
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Submission Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-white text-stone-700 border-stone-200 rounded-3xl shadow-2xl border overflow-hidden max-h-[92vh] flex flex-col justify-between">
            
            <div className="p-6 bg-gradient-to-r from-[#12201A] to-[#1B2B22] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-6 h-6 text-amber-400" />
                <div>
                  <h3 className="text-xl font-bold font-['Amiri'] text-white">
                    توثيق قصة أو رواية في ذاكرة بني شهر
                  </h3>
                  <p className="text-xs text-stone-300">
                    تُحفظ القصة وتُرسل لمشرف القبيلة المعني للاعتماد قبل النشر
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="p-1.5 rounded-xl bg-stone-800 text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {submissionSuccess ? (
              <div className="p-10 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-2xl font-bold font-['Amiri'] text-emerald-900">
                  تم إرسال القصة بنجاح!
                </h4>
                <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                  تم حفظ القصة بحالة <strong className="text-amber-500">"بانتظار المراجعة"</strong> وتم تحويلها إلى مشرف القبيلة لتدقيقها واعتمادها في ذاكرة بني شهر.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitContribution} className="p-6 overflow-y-auto space-y-4 text-xs text-stone-700">
                
                <div>
                  <label className="font-bold text-stone-900 block mb-1">عنوان القصة أو الحدث *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: قصة وفادة بني شهر وحصن العقيقة، أو بطولة راعي الغنم في جبل منعاء"
                    value={submittingTitle}
                    onChange={(e) => setSubmittingTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border-stone-300 text-stone-900 border focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-stone-900 block mb-1">القبيلة المرتبطة بالقصة *</label>
                    <select
                      value={submittingTribe}
                      onChange={(e) => setSubmittingTribe(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-stone-50 border-stone-300 text-stone-900 border font-medium"
                    >
                      {DETAILED_TRIBES.map((t) => (
                        <option key={t.id} value={t.name}>{t.name}</option>
                      ))}
                      <option value="عموم قبائل بني شهر">عموم قبائل بني شهر</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-stone-900 block mb-1">القسم والتصنيف *</label>
                    <select
                      value={submittingCategory}
                      onChange={(e) => setSubmittingCategory(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl bg-stone-50 border-stone-300 text-stone-900 border font-medium"
                    >
                      <option value="قصص زمان وروايات الأجداد">قصص زمان وروايات الأجداد</option>
                      <option value="قصص كل قبيلة">قصص كل قبيلة</option>
                      <option value="العادات القديمة والأعراف">العادات القديمة والأعراف</option>
                      <option value="الأمثال الشعبية والحكم">الأمثال الشعبية والحكم</option>
                      <option value="الحياة قديمًا والزراعة">الحياة قديمًا والزراعة</option>
                      <option value="الأسواق القديمة والقوافل">الأسواق القديمة والقوافل</option>
                      <option value="الأعراس والمناسبات التراثية">الأعراس والمناسبات التراثية</option>
                      <option value="صور قديمة ونوادر">صور قديمة ونوادر</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-stone-900 block mb-1">اسم الراوي (إن وجد)</label>
                    <input
                      type="text"
                      placeholder="اسم الراوي أو المصدر..."
                      value={submittingNarrator}
                      onChange={(e) => setSubmittingNarrator(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-stone-50 border-stone-300 text-stone-900 border"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-900 block mb-1">الموقع أو القرية</label>
                    <input
                      type="text"
                      placeholder="اسم القرية أو الحصن أو الوادي..."
                      value={submittingLocation}
                      onChange={(e) => setSubmittingLocation(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-stone-50 border-stone-300 text-stone-900 border"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-stone-900 block mb-1">نص وتفاصيل القصة أو الرواية *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="اكتب تفاصيل القصة بدقة، والمواقف والأشعار المرتبطة بها..."
                    value={submittingContent}
                    onChange={(e) => setSubmittingContent(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border-stone-300 text-stone-900 border leading-relaxed font-sans"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-900 block mb-1">رابط صورة داعمة (اختياري)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={submittingImageUrl}
                    onChange={(e) => setSubmittingImageUrl(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-50 border-stone-300 text-stone-900 border"
                  />
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs shadow-lg"
                  >
                    إرسال القصة للاعتماد
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="px-5 py-3 rounded-xl bg-stone-200 text-stone-700 hover:bg-stone-300 font-bold text-xs"
                  >
                    إلغاء
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
