import React, { useState } from "react";
import { 
  Landmark, 
  Castle, 
  Music, 
  Scissors, 
  Utensils, 
  Sparkles, 
  ChevronLeft, 
  BookOpen, 
  Scroll, 
  X, 
  Share2, 
  Volume2,
  CheckCircle2,
  Quote
} from "lucide-react";
import { HERITAGE_TOPICS } from "../data/baniShahrData";
import { HeritageTopic } from "../types";

interface HeritageSectionProps {
  onOpenFortsDirectory?: () => void;
}

export const HeritageSection: React.FC<HeritageSectionProps> = ({
  onOpenFortsDirectory
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeTopic, setActiveTopic] = useState<HeritageTopic | null>(null);
  
  // AI Story Generator State
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [aiGeneratedStory, setAiGeneratedStory] = useState<{
    title: string;
    story: string;
    historicalFact?: string;
    folkPoem?: string;
  } | null>(null);
  const [aiStoryModalOpen, setAiStoryModalOpen] = useState(false);
  const [customTopicInput, setCustomTopicInput] = useState("");

  const categories = [
    { id: "all", label: "كافة مجالات التراث", icon: Landmark },
    { id: "history", label: "النسب والتاريخ", icon: Scroll },
    { id: "villages", label: "الحصون والقرى", icon: Castle },
    { id: "arts", label: "الفنون والأهازيج", icon: Music },
    { id: "crafts", label: "الأزياء والحرف", icon: Scissors },
    { id: "cuisine", label: "المطبخ الشعبي", icon: Utensils },
  ];

  const filteredTopics = selectedCategory === "all"
    ? HERITAGE_TOPICS
    : HERITAGE_TOPICS.filter((t) => t.category === selectedCategory);

  const handleGenerateAiStory = async (topicTitle?: string) => {
    const topicToQuery = topicTitle || customTopicInput || "قصر المقر وتاريخ حصون السراة في بني شهر";
    setIsGeneratingStory(true);
    setAiStoryModalOpen(true);
    try {
      const res = await fetch("/api/gemini/heritage-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topicToQuery }),
      });
      const data = await res.json();
      setAiGeneratedStory(data);
    } catch (err) {
      console.error(err);
      setAiGeneratedStory({
        title: "شموخ السراة وعزة بني شهر",
        story: "تقف جبال السراة وحصونها الحجرية شواهد حية على بسالة وكرم قبائل بني شهر عبر القرون؛ حيث تناقل الأبناء عن الأجداد قصص المروءة، وبناء المدرجات الزراعية المعلقة، وحماية الثغور بأهازيج العرضة والمدقال الشهري المهيب.",
        folkPoem: "سلام يا دار الكرم والشهامة ** بني شهر ربعي دروع القبيلة\nأهل السراة اللي تسوق الكرامة ** وسيوفهم في كل هية صقيلة",
        historicalFact: "تتميز قصبات وحصون بني شهر بهندستها المقاومة للهزات والمناخ البارد، واعتمادها على خشب العرعر الصلب.",
      });
    } finally {
      setIsGeneratingStory(false);
    }
  };

  return (
    <section id="heritage" className="py-20 relative w-full max-w-full overflow-hidden scroll-mt-20 sm:scroll-mt-24 text-stone-900">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold mb-3 shadow-sm">
            <Landmark className="w-3.5 h-3.5 text-emerald-700" />
            <span>إرث الأجداد وحضارة السراة</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-['Amiri'] text-[#12201A] mb-4">
            تاريخ وتراث قبائل بني شهر العريق
          </h2>
          <p className="text-[#5A524C] text-base sm:text-lg leading-relaxed font-light">
            تعرّف على الجذور الأزدية الأصيلة، والهندسة الحجرية للقلاع والقصبات، وفنون العرضة والمدقال،
            والأزياء التقليدية والمأكولات الشعبية التي تروي حكاية الكرم والشهامة.
          </p>
        </div>

        {/* AI Storytelling Generator Prompt Banner */}
        <div className="mb-12 p-6 rounded-3xl bg-gradient-to-r from-[#12201A] via-[#1B2B22] to-[#12201A] border border-[#C7A25C]/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 text-[#F8F4EA]">
          <div className="flex items-start gap-4 text-right">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-500/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#F8F4EA] font-['Amiri']">
                الراوي التراثي الذكي: استمع لقصة أو قصيدة مخصصة
              </h3>
              <p className="text-xs sm:text-sm text-[#D8BE8B] font-light mt-1">
                اطلب من الذكاء الاصطناعي سرداً تاريخياً أو شعرياً موثقاً عن أي قرية، معلم، أو مناسبة في بني شهر.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="مثال: قصة شلال الدهناء، فن المدقال..."
              value={customTopicInput}
              onChange={(e) => setCustomTopicInput(e.target.value)}
              className="w-full sm:w-64 px-4 py-2.5 rounded-xl bg-black/40 border border-[#7C9D86]/40 text-sm text-[#F8F4EA] placeholder-[#D8BE8B]/60 focus:outline-none focus:border-[#C7A25C]"
            />
            <button
              id="generate-heritage-story-btn"
              onClick={() => handleGenerateAiStory(customTopicInput)}
              className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-sm font-semibold shadow-md transition-all border border-amber-400/40"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>اسرد لي حكاية</span>
            </button>
          </div>
        </div>

        {/* Category Filters & Quick Launch Forts Directory */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-[#E6DEC8]">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`heritage-cat-${cat.id}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isSelected
                      ? "bg-emerald-800 text-white border border-emerald-800 shadow-sm"
                      : "bg-white text-stone-700 hover:bg-stone-50 border border-[#E6DEC8]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? "text-amber-300" : "text-amber-700"}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {onOpenFortsDirectory && (
            <button
              id="open-full-forts-encyclopedia-btn"
              onClick={onOpenFortsDirectory}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-bold shadow-md border border-amber-400/40 transition-all shrink-0 hover:scale-105"
            >
              <Castle className="w-4 h-4 text-amber-200" />
              <span>موسوعة حصون وقلاع بني شهر</span>
            </button>
          )}
        </div>

        {/* Heritage Topic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredTopics.map((topic) => (
            <div
              key={topic.id}
              id={`heritage-card-${topic.id}`}
              className="group bg-white rounded-3xl border border-[#E6DEC8] overflow-hidden shadow-md hover:shadow-xl hover:border-emerald-600/50 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                {/* Topic Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={topic.coverImage}
                    alt={topic.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                  
                  {/* Category Badge */}
                  <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-300 text-xs font-semibold border border-amber-500/30">
                    {categories.find((c) => c.id === topic.category)?.label || "تراث"}
                  </span>
                </div>

                {/* Topic Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold font-['Amiri'] text-[#12201A] mb-2 group-hover:text-emerald-800 transition-colors">
                    {topic.title}
                  </h3>
                  <p className="text-xs text-emerald-700 font-medium mb-3">
                    {topic.subtitle}
                  </p>
                  <p className="text-[#5A524C] text-sm font-light leading-relaxed line-clamp-3 mb-4">
                    {topic.summary}
                  </p>

                  {/* Poetic excerpt if present */}
                  {topic.quoteOrPoem && (
                    <div className="p-3 rounded-xl bg-[#F8F4EA] border border-[#E6DEC8] text-xs text-[#8F7238] font-['Amiri'] italic mb-4 leading-relaxed">
                      <Quote className="w-3.5 h-3.5 text-amber-600 inline ml-1.5" />
                      {topic.quoteOrPoem.split("\n")[0]}
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {topic.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 flex items-center justify-between border-t border-[#E6DEC8] gap-2">
                <button
                  id={`view-heritage-${topic.id}`}
                  onClick={() => setActiveTopic(topic)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-semibold transition-colors border border-emerald-300"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>قراءة التفاصيل الشاملة</span>
                </button>
                <button
                  onClick={() => handleGenerateAiStory(topic.title)}
                  title="سرد حكاية تراثية بالذكاء الاصطناعي"
                  className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Deep Topic Details Modal */}
      {activeTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-stone-900 border border-stone-700 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-stone-100">
            
            {/* Modal Image Header */}
            <div className="relative h-64 sm:h-80">
              <img
                src={activeTopic.coverImage}
                alt={activeTopic.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/60 to-transparent" />
              
              <button
                id="close-topic-modal"
                onClick={() => setActiveTopic(null)}
                className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/60 text-stone-300 hover:text-white flex items-center justify-center backdrop-blur-sm border border-stone-600"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-6 right-6 left-6 text-right">
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-900/80 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-600/40">
                  {activeTopic.subtitle}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-['Amiri'] text-stone-50">
                  {activeTopic.title}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Poetic Highlight */}
              {activeTopic.quoteOrPoem && (
                <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-600/30 text-amber-200 font-['Amiri'] text-base sm:text-lg leading-loose text-center whitespace-pre-line shadow-inner">
                  {activeTopic.quoteOrPoem}
                </div>
              )}

              {/* Main Content Paragraphs */}
              <div className="space-y-4 text-stone-300 text-sm sm:text-base leading-relaxed font-light">
                {activeTopic.content.map((paragraph, i) => (
                  <p key={i} className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0" />
                    <span>{paragraph}</span>
                  </p>
                ))}
              </div>

              {/* Featured Items / Highlights */}
              {activeTopic.featuredItems && (
                <div className="pt-4 border-t border-stone-800">
                  <h4 className="text-lg font-bold font-['Amiri'] text-emerald-400 mb-3">
                    عناصر ومعالم بارزة:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeTopic.featuredItems.map((item, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700/60">
                        <h5 className="font-bold text-amber-300 text-sm mb-1">{item.name}</h5>
                        <p className="text-xs text-stone-400 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer Actions inside Modal */}
              <div className="pt-4 border-t border-stone-800 flex items-center justify-between gap-3">
                <button
                  onClick={() => handleGenerateAiStory(activeTopic.title)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-900 font-bold text-xs sm:text-sm shadow-md transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>توليد قصة ذكية موسعة حول هذا الموضوع</span>
                </button>
                <button
                  onClick={() => setActiveTopic(null)}
                  className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs sm:text-sm"
                >
                  إغلاق
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* AI Story Modal */}
      {aiStoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-stone-900 border border-amber-500/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl text-stone-100 relative">
            
            <button
              onClick={() => setAiStoryModalOpen(false)}
              className="absolute top-4 left-4 p-2 rounded-full bg-stone-800 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: "8s" }} />
              </div>
              <div>
                <span className="text-xs text-amber-400 font-medium">الراوي التراثي بالذكاء الاصطناعي</span>
                <h3 className="text-xl font-bold font-['Amiri'] text-stone-100">
                  {aiGeneratedStory?.title || "جاري استحضار الرواية التراثية..."}
                </h3>
              </div>
            </div>

            {isGeneratingStory ? (
              <div className="py-12 flex flex-col items-center justify-center gap-4 text-stone-400">
                <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-400 rounded-full animate-spin" />
                <p className="text-sm font-light">يستحضر الذكاء الاصطناعي وثائق وقصائد وتاريخ بني شهر...</p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700/60 text-stone-200 text-sm sm:text-base leading-relaxed font-light">
                  {aiGeneratedStory?.story}
                </div>

                {aiGeneratedStory?.folkPoem && (
                  <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-600/30 text-amber-200 font-['Amiri'] text-base sm:text-lg text-center leading-loose whitespace-pre-line">
                    <Quote className="w-4 h-4 text-amber-400 mx-auto mb-2" />
                    {aiGeneratedStory.folkPoem}
                  </div>
                )}

                {aiGeneratedStory?.historicalFact && (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-950/40 border border-emerald-700/40 text-emerald-300 text-xs">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span><strong>إضاءة تاريخية:</strong> {aiGeneratedStory.historicalFact}</span>
                  </div>
                )}

                <div className="pt-3 flex justify-end">
                  <button
                    onClick={() => setAiStoryModalOpen(false)}
                    className="px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-sm"
                  >
                    تم، شكراً للراوي
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </section>
  );
};
