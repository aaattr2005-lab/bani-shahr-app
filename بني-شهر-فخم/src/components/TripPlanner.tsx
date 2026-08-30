import React, { useState } from "react";
import { 
  Sparkles, 
  Calendar, 
  Sun, 
  Sunset, 
  Moon, 
  Copy, 
  Check, 
  Compass, 
  MapPin, 
  Coffee, 
  ShieldAlert,
  Download,
  Share2
} from "lucide-react";
import { GeneratedPlan, TripPlanDay } from "../types";
import { OpenMeteoWeatherCard } from "./OpenMeteoWeatherCard";

export const TripPlanner: React.FC = () => {
  const [days, setDays] = useState(2);
  const [interest, setInterest] = useState("شامل (طبيعة وتراث)");
  const [pace, setPace] = useState("متوسط");
  const [companions, setCompanions] = useState("عائلة");
  
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [activePlan, setActivePlan] = useState<GeneratedPlan>({
    title: "رحلة عطلة السراة في ديار بني شهر (تنومة والنماص)",
    summary: "خطة سياحية متوازنة تجمع بين انسياب شلال الدهناء والهايكنج الصخري في جبل منعاء، وزيارة قصر المقر وقرية الغال التراثية، مع الاستمتاع بالمطلات الضبابية والمأكولات الشعبية.",
    itinerary: [
      {
        day: 1,
        title: "اليوم الأول: طبيعة وشلالات تنومة الساحرة",
        morning: "الانطلاق صباحاً إلى شلال الدهناء، الاستمتاع بتدفق المياه والأجواء العليلة، والتنزه في منتزه الشرف.",
        afternoon: "زيارة جبل منعاء واستكشاف النقوش الصخرية القديمة، يليه تناول وجبة غداء تراثية (العريكة والعصيدة بالسمن وعسل السدر).",
        evening: "جلسة قهوة سعودية بمقهى مطل المحفار وسط تدفق السحب والضباب، وجولة تسوق للمنتجات المحلية.",
        highlight: "انسياب شلال الدهناء والغروب فوق غيوم المحفار",
      },
      {
        day: 2,
        title: "اليوم الثاني: تاريخ وقصور وقرى النماص التراثية",
        morning: "زيارة قصر المقر التاريخي (القرية التراثية) والاستمتاع بالتحف والمخطوطات النادرة والإطلالة الشاهقة على تهامة.",
        afternoon: "جولة في قرية الغال التراثية ومتحف النماص الأثري، ثم التسوق في سوق النماص الشعبي لاقتناء العسل والفضيات.",
        evening: "الاسترخاء في منتزه شعف آل وليد وجبل ناصر، وتناول وجبة حنيذ لحم طازج في أحد المطاعم التراثية.",
        highlight: "العمارة الأندلسية والسروية في قصر المقر وقرية الغال",
      },
    ],
    tips: [
      "احرص على إحضار ملابس دافئة؛ تنخفض درجات الحرارة وتزداد كثافة الضباب في المساء.",
      "استمتع بشراء عسل السدر والشوكة الأصيل من مناحل تنومة والنماص المعتمدة.",
      "يُفضل استخدام سيارة دفع رباعي للوصول لبعض المسارات الجبلية الوعرة.",
    ],
    recommendedDishes: ["العصيدة بالسمن والمرق", "العريكة الجنوبية بعسل السدر", "الحنيذ السروي بالميفا", "خبز التنور البلدي"],
  });

  const handleGenerateCustomPlan = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/gemini/plan-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days, interest, pace, companions }),
      });
      const data = await res.json();
      if (data.itinerary && data.itinerary.length > 0) {
        setActivePlan(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyItinerary = () => {
    const textToCopy = `📋 ${activePlan.title}\n\n${activePlan.summary}\n\n` +
      activePlan.itinerary
        .map(
          (d) =>
            `🗓️ اليوم ${d.day}: ${d.title}\n- الصباح: ${d.morning}\n- الظهيرة والمساء: ${d.afternoon}\n- الليل: ${d.evening}\n`
        )
        .join("\n") +
      `\n💡 نصائح مهمة:\n` +
      activePlan.tips.map((t) => `- ${t}`).join("\n");

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="planner" className="py-20 relative w-full max-w-full overflow-hidden scroll-mt-20 sm:scroll-mt-24 text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>مخطط الرحلات الذكي بالذكاء الاصطناعي</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-['Amiri'] text-[#12201A] mb-3">
            صمم جدول رحلتك المثالية في ديار بني شهر
          </h2>
          <p className="text-[#5A524C] text-base sm:text-lg font-light">
            حدد مدة إقامتك واهتماماتك وسيقوم مرشد بني شهر الذكي بجدولة أفضل الأماكن والمطلات والمطاعم التراثية بدقة.
          </p>
        </div>

        {/* Open-Meteo Weather & Rain Live Monitor */}
        <OpenMeteoWeatherCard />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form Controls & Checklist (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Customization Card */}
            <div className="bg-white p-6 rounded-3xl border border-[#E6DEC8] shadow-md">
              <h3 className="text-lg font-bold font-['Amiri'] text-[#12201A] mb-5 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-700" />
                <span>تخصيص مسار الرحلة</span>
              </h3>

              <div className="space-y-4">
                
                {/* Duration */}
                <div>
                  <label className="text-xs text-stone-600 font-medium block mb-1.5">
                    مدة الرحلة: ({days} {days === 1 ? "يوم" : days === 2 ? "يومان" : "أيام"})
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((d) => (
                      <button
                        key={d}
                        onClick={() => setDays(d)}
                        className={`py-2 rounded-xl text-xs font-bold transition-colors ${
                          days === d
                            ? "bg-emerald-800 text-white shadow-sm"
                            : "bg-[#F8F4EA] text-stone-700 hover:bg-stone-100 border border-[#E6DEC8]"
                        }`}
                      >
                        {d} {d === 1 ? "يوم" : d === 2 ? "يومان" : "أيام"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interest Type */}
                <div>
                  <label className="text-xs text-stone-600 font-medium block mb-1.5">
                    الاهتمام الأساسي:
                  </label>
                  <select
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F4EA] border border-[#E6DEC8] text-stone-800 text-xs focus:outline-none focus:border-emerald-600"
                  >
                    <option value="شامل (طبيعة وتراث)">شامل (طبيعة وشلالات وتراث وقصور)</option>
                    <option value="طبيعة واستجمام وضباب">طبيعة واستجمام وغابات وضباب</option>
                    <option value="تاريخ وقلاع ومتاحف">تاريخ وقلاع أثرية ومتاحف</option>
                    <option value="هايكنج ومغامرات وتسلق جبال">هايكنج ومغامرات وتسلق جبال (جبل منعاء)</option>
                    <option value="سياحة زراعية ومزارع رمان وعسل">سياحة زراعية ومزارع رمان وعسل</option>
                  </select>
                </div>

                {/* Companions */}
                <div>
                  <label className="text-xs text-stone-600 font-medium block mb-1.5">
                    المرافقون:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["عائلة", "أصدقاء وشباب", "فردي ومستكشف"].map((c) => (
                      <button
                        key={c}
                        onClick={() => setCompanions(c)}
                        className={`py-2 px-1 rounded-xl text-xs font-medium transition-colors truncate ${
                          companions === c
                            ? "bg-amber-700 text-white font-bold"
                            : "bg-[#F8F4EA] text-stone-700 hover:bg-stone-100 border border-[#E6DEC8]"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  id="generate-trip-plan-btn"
                  onClick={handleGenerateCustomPlan}
                  disabled={isLoading}
                  className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-r from-emerald-800 to-[#12201A] hover:from-emerald-700 hover:to-[#1B2B22] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 border border-emerald-600/30 transition-all disabled:opacity-50"
                >
                  <Sparkles className={`w-4 h-4 text-amber-300 ${isLoading ? "animate-spin" : ""}`} />
                  <span>{isLoading ? "جاري بناء وتنسيق الخطة..." : "توليد الخطة بالذكاء الاصطناعي"}</span>
                </button>

              </div>
            </div>

          </div>

          {/* Right Column: Dynamic Itinerary View (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E6DEC8] shadow-md">
              
              {/* Plan Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6DEC8] pb-6 mb-6">
                <div>
                  <span className="text-xs font-semibold text-emerald-900 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 inline-block mb-2">
                    الخطة المعتمدة • {activePlan.itinerary.length} أيام
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-['Amiri'] text-[#12201A]">
                    {activePlan.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 font-light mt-1">
                    {activePlan.summary}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    id="copy-itinerary-btn"
                    onClick={handleCopyItinerary}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F8F4EA] hover:bg-stone-100 text-stone-700 text-xs font-medium border border-[#E6DEC8] transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? "تم النسخ!" : "نسخ الخطة"}</span>
                  </button>
                </div>
              </div>

              {/* Day by Day Cards */}
              <div className="space-y-6">
                {activePlan.itinerary.map((day) => (
                  <div
                    key={day.day}
                    className="p-5 sm:p-6 rounded-2xl bg-[#F8F4EA] border border-[#E6DEC8] hover:border-emerald-600/40 transition-colors shadow-sm"
                  >
                    <div className="flex items-center justify-between border-b border-[#E6DEC8] pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-emerald-800 text-white text-xs font-bold flex items-center justify-center">
                          {day.day}
                        </span>
                        <h4 className="text-base sm:text-lg font-bold font-['Amiri'] text-[#12201A]">
                          {day.title}
                        </h4>
                      </div>
                      {day.highlight && (
                        <span className="hidden sm:inline-block text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                          ⭐ {day.highlight}
                        </span>
                      )}
                    </div>

                    <div className="space-y-3.5 text-xs sm:text-sm">
                      
                      {/* Morning */}
                      <div className="flex items-start gap-3">
                        <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                          <Sun className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className="text-stone-800 block text-xs mb-0.5">الفترة الصباحية:</strong>
                          <p className="text-stone-600 font-light leading-relaxed">{day.morning}</p>
                        </div>
                      </div>

                      {/* Afternoon */}
                      <div className="flex items-start gap-3">
                        <div className="p-1.5 rounded-lg bg-orange-100 text-orange-800 shrink-0 mt-0.5">
                          <Sunset className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className="text-stone-800 block text-xs mb-0.5">فترة الظهيرة والعصر:</strong>
                          <p className="text-stone-600 font-light leading-relaxed">{day.afternoon}</p>
                        </div>
                      </div>

                      {/* Evening */}
                      <div className="flex items-start gap-3">
                        <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-800 shrink-0 mt-0.5">
                          <Moon className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className="text-stone-800 block text-xs mb-0.5">المساء والسهرة التراثية:</strong>
                          <p className="text-stone-600 font-light leading-relaxed">{day.evening}</p>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>

              {/* Recommended Traditional Dishes & Regional Tips */}
              <div className="mt-6 pt-6 border-t border-[#E6DEC8] grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Recommended Dishes */}
                {activePlan.recommendedDishes && (
                  <div className="p-4 rounded-2xl bg-[#F8F4EA] border border-[#E6DEC8]">
                    <h5 className="text-xs font-bold text-amber-800 mb-2 flex items-center gap-1.5">
                      <Coffee className="w-3.5 h-3.5" />
                      <span>أطباق شعبية ننصح بتذوقها:</span>
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {activePlan.recommendedDishes.map((dish, i) => (
                        <span key={i} className="text-[11px] px-2.5 py-1 rounded-md bg-white border border-[#E6DEC8] text-stone-700">
                          {dish}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Practical Tips */}
                {activePlan.tips && (
                  <div className="p-4 rounded-2xl bg-[#F8F4EA] border border-[#E6DEC8]">
                    <h5 className="text-xs font-bold text-emerald-800 mb-2 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>إرشادات المرشد السياحي:</span>
                    </h5>
                    <ul className="text-[11px] text-stone-600 space-y-1 font-light">
                      {activePlan.tips.map((t, i) => (
                        <li key={i}>• {t}</li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
