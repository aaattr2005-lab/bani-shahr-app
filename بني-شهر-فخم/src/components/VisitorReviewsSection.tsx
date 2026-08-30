import React, { useState } from "react";
import { 
  MessageSquareQuote, 
  Star, 
  Send, 
  UserCheck, 
  Sparkles, 
  Heart, 
  Camera,
  MapPin
} from "lucide-react";
import { VISITOR_REVIEWS } from "../data/baniShahrData";
import { VisitorReview } from "../types";

export const VisitorReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<VisitorReview[]>(VISITOR_REVIEWS);
  const [author, setAuthor] = useState("");
  const [city, setCity] = useState("");
  const [attractionName, setAttractionName] = useState("شلال الدهناء & تنومة");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) return;

    const newRev: VisitorReview = {
      id: Date.now().toString(),
      author: author.trim(),
      city: city.trim() || "زائر السراة",
      attractionName,
      rating,
      comment: comment.trim(),
      date: "اليوم",
    };

    setReviews([newRev, ...reviews]);
    setAuthor("");
    setCity("");
    setComment("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="reviews" className="py-20 relative w-full max-w-full overflow-hidden scroll-mt-20 sm:scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/40 text-emerald-400 text-xs font-semibold mb-3">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>انطباعات وتجارب زوار السراة</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-['Amiri'] text-[#12201A] mb-3">
            سجل زوار ومحبي بني شهر
          </h2>
          <p className="text-[#5A524C] text-base sm:text-lg font-light">
            شاركنا تجربتك في زيارة القرى التراثية، أو استكشاف الشلالات والمطلات، أو تذوق المأكولات الشعبية.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Review Submission Form (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E6DEC8] shadow-md">
              <h3 className="text-lg font-bold font-['Amiri'] text-[#12201A] mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>أضف تجربتك وانطباعك</span>
              </h3>
              <p className="text-xs text-stone-500 font-light mb-6">
                كلمتك تثري الزوار الآخرين وتخلد ذكراك في ديار بني شهر.
              </p>

              {submitted && (
                <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs mb-4">
                  شكراً لك! تم إضافة انطباعك بنجاح في سجل الزوار.
                </div>
              )}

              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                
                <div>
                  <label className="text-stone-700 font-medium block mb-1">اسمك الكريم:</label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="مثال: خالد الشهري، أبو فهد..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F4EA] border border-[#E6DEC8] text-stone-800 placeholder-stone-400 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-stone-700 font-medium block mb-1">مدينتك / منطقتك:</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="الرياض، جدة..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F8F4EA] border border-[#E6DEC8] text-stone-800 placeholder-stone-400 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="text-stone-700 font-medium block mb-1">المعلم الذي زرته:</label>
                    <select
                      value={attractionName}
                      onChange={(e) => setAttractionName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#F8F4EA] border border-[#E6DEC8] text-stone-800 focus:outline-none focus:border-emerald-600"
                    >
                      <option value="شلال الدهناء & تنومة">شلال الدهناء & تنومة</option>
                      <option value="قصر المقر & النماص">قصر المقر & النماص</option>
                      <option value="جبل منعاء والهايكنج">جبل منعاء والهايكنج</option>
                      <option value="قرية الغال التراثية">قرية الغال التراثية</option>
                      <option value="مطلات المحفار والشرف">مطلات المحفار والشرف</option>
                      <option value="المطبخ الشهري والعسل">المطبخ الشهري والعسل</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-stone-700 font-medium block mb-1">التقييم:</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-stone-300"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-stone-500 mr-2">({rating} من 5)</span>
                  </div>
                </div>

                <div>
                  <label className="text-stone-700 font-medium block mb-1">رأيك وتجربتك:</label>
                  <textarea
                    rows={3}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="اكتب عن الطبيعة، كرم الأهالي، أو نصيحة لمن سيزور المنطقة..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F4EA] border border-[#E6DEC8] text-stone-800 placeholder-stone-400 focus:outline-none focus:border-emerald-600 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 rotate-180" />
                  <span>نشر الانطباع في السجل</span>
                </button>

              </form>
            </div>
          </div>

          {/* Reviews List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-6 rounded-3xl bg-white border border-[#E6DEC8] hover:border-emerald-600/40 transition-colors shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center justify-center font-bold font-['Amiri']">
                      {rev.author.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#12201A] text-sm font-['Amiri']">
                        {rev.author}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-stone-500">
                        <span className="text-emerald-800 font-semibold">{rev.city}</span>
                        <span>•</span>
                        <span>{rev.attractionName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-[#5A524C] text-xs sm:text-sm font-light leading-relaxed">
                  "{rev.comment}"
                </p>

                <div className="mt-3 pt-3 border-t border-[#E6DEC8] flex justify-between text-[10px] text-stone-400">
                  <span>زيارة موثقة</span>
                  <span>{rev.date}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
