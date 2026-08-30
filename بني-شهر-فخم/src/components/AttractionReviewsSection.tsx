import React, { useState } from "react";
import { 
  Star, 
  MessageSquarePlus, 
  Send, 
  Check, 
  Image as ImageIcon, 
  X, 
  User, 
  ThumbsUp, 
  ShieldCheck, 
  Calendar, 
  Sparkles,
  Camera
} from "lucide-react";
import { VisitorReview } from "../types";
import { DataStore } from "../lib/datastore";

interface AttractionReviewsSectionProps {
  attractionId: string;
  attractionName: string;
  baseRating?: number;
  baseReviewsCount?: number;
  onReviewAdded?: () => void;
}

export const AttractionReviewsSection: React.FC<AttractionReviewsSectionProps> = ({
  attractionId,
  attractionName,
  baseRating = 4.8,
  baseReviewsCount = 120,
  onReviewAdded
}) => {
  const [reviews, setReviews] = useState<VisitorReview[]>(() => 
    DataStore.getReviewsForAttraction(attractionId, attractionName)
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [ratingInput, setRatingInput] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [commentInput, setCommentInput] = useState("");
  const [authorName, setAuthorName] = useState(() => DataStore.getCurrentUser().name || "زائر بني شهر");
  const [authorCity, setAuthorCity] = useState("الرياض");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  // Suggested photos for quick attachment
  const sampleReviewPhotos = [
    { label: "شلال وطبيعة", url: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80" },
    { label: "قصر وتراث", url: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80" },
    { label: "ضباب ومطلات", url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" },
    { label: "قمم جبلية", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80" }
  ];

  // Calculate dynamic stats
  const ratingData = DataStore.getAttractionRating(attractionId, baseRating, baseReviewsCount);

  // Latest 3 reviews (or all if toggled)
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    setIsSubmitting(true);
    const newReview: VisitorReview = {
      id: `rev-${Date.now()}`,
      author: authorName.trim() || "زائر",
      city: authorCity.trim() || "منطقة عسير",
      comment: commentInput.trim(),
      rating: ratingInput,
      date: "الآن",
      attractionName: attractionName,
      attractionId: attractionId,
      imageUrl: imageUrlInput.trim() || undefined,
      userId: DataStore.getCurrentUser().id
    };

    DataStore.addReview(newReview);
    const updated = DataStore.getReviewsForAttraction(attractionId, attractionName);
    setReviews(updated);
    setIsSubmitting(false);
    setShowAddForm(false);
    setCommentInput("");
    setImageUrlInput("");
    setSuccessMessage("شكراً لك! تم نشر تقييمك لمعلم " + attractionName + " بنجاح.");
    setTimeout(() => setSuccessMessage(null), 5000);
    if (onReviewAdded) onReviewAdded();
  };

  return (
    <div className="space-y-4 pt-4 border-t border-stone-800 text-stone-100 font-['Tajawal',sans-serif]">
      
      {/* Header Bar with Overall Rating & Add Review Trigger */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-stone-950/80 border border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold font-mono text-amber-400">
              {ratingData.rating}
            </span>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(ratingData.rating)
                      ? "text-amber-400 fill-amber-400"
                      : "text-stone-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-stone-400 font-medium">
              ({ratingData.count} مراجعة موثقة)
            </span>
          </div>
          <p className="text-[11px] text-stone-400 mt-0.5">
            تقييمات زوار ومستكشفي ديار بني شهر في تنومة والنماص والمجاردة
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 shrink-0 hover:scale-[1.02]"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>{showAddForm ? "إلغاء النموذج" : "أضف تقييمك ورأيك"}</span>
        </button>
      </div>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-lg">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Add Review Form Collapse */}
      {showAddForm && (
        <form
          onSubmit={handleSubmitReview}
          className="p-4 sm:p-5 rounded-2xl bg-stone-900 border border-emerald-500/40 shadow-xl space-y-4 animate-fadeIn"
        >
          <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>اكتب تجربتك وانطباعك عن المعلم</span>
            </h4>
            <span className="text-[11px] text-emerald-400 font-bold">تقييم معتمد</span>
          </div>

          {/* Interactive Star Picker */}
          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1.5">
              حدد التقييم العام (من 1 إلى 5 نجوم):
            </label>
            <div className="flex items-center gap-1.5 bg-stone-950 p-2.5 rounded-xl border border-stone-800 w-fit">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatingInput(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                  title={`${star} نجوم`}
                >
                  <Star
                    className={`w-6 h-6 transition-colors ${
                      star <= (hoverRating || ratingInput)
                        ? "text-amber-400 fill-amber-400"
                        : "text-stone-700"
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-amber-400 mr-2 font-mono">
                {ratingInput === 5 ? "ممتاز جداً (5/5)" : ratingInput === 4 ? "جيد جداً (4/5)" : ratingInput === 3 ? "متوسط (3/5)" : `${ratingInput} من 5`}
              </span>
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1.5">
              ملاحظاتك ورأيك عن المكان: <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="صف تجربتك، كرم الاستقبال، جمال الموقع، نصائح للزوار الآخرين..."
              className="w-full p-3 rounded-xl bg-stone-950 border border-stone-700 text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* User Name and City Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-stone-400 mb-1">اسم الزائر:</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="اسمك الكريم"
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-400 mb-1">المدينة / المنطقة:</label>
              <input
                type="text"
                value={authorCity}
                onChange={(e) => setAuthorCity(e.target.value)}
                placeholder="الرياض، جدة، أبها..."
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Optional Image Attachment (URL or Fast Preset Picker) */}
          <div className="space-y-2">
            <label className="block text-xs text-stone-400">
              إرفاق صورة من زيارتك (اختياري):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="ضع رابط صورة (https://...) أو اختر نموذجاً بالأسفل"
                className="flex-1 px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-emerald-500"
              />
              {imageUrlInput && (
                <button
                  type="button"
                  onClick={() => setImageUrlInput("")}
                  className="p-2 text-xs text-stone-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Sample Image Presets */}
            <div className="flex items-center gap-2 pt-1 overflow-x-auto no-scrollbar">
              <span className="text-[11px] text-stone-400 shrink-0">نماذج سريعة:</span>
              {sampleReviewPhotos.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImageUrlInput(sample.url)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all shrink-0 ${
                    imageUrlInput === sample.url
                      ? "bg-emerald-800 text-white border-emerald-400"
                      : "bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200"
                  }`}
                >
                  📷 {sample.label}
                </button>
              ))}
            </div>

            {/* Preview Selected Image */}
            {imageUrlInput && (
              <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-emerald-500/50 mt-2">
                <img
                  src={imageUrlInput}
                  alt="معاينة الصورة"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !commentInput.trim()}
              className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "جاري الإرسال..." : "نشر التقييم"}</span>
            </button>
          </div>
        </form>
      )}

      {/* List of Last 3 Reviews */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-stone-400 font-bold px-1">
          <span>آخر مراجعات وتجارب الزوار ({reviews.length})</span>
          {reviews.length > 3 && (
            <button
              type="button"
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              {showAllReviews ? "عرض آخر 3 مراجعات فقط" : `عرض كل المراجعات (${reviews.length})`}
            </button>
          )}
        </div>

        {displayedReviews.length === 0 ? (
          <div className="p-6 rounded-2xl bg-stone-950/60 border border-stone-800 text-center space-y-2">
            <p className="text-xs text-stone-400">كن أول من يقيّم هذا المعلم ويشارك تجربته مع الزوار!</p>
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="text-xs text-emerald-400 hover:underline font-bold"
            >
              + إضافة تقييم الآن
            </button>
          </div>
        ) : (
          displayedReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800/90 space-y-2.5 hover:border-stone-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 flex items-center justify-center font-bold text-xs shrink-0">
                    {rev.author.charAt(0)}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{rev.author}</span>
                      <span className="text-[10px] text-stone-400 font-normal">({rev.city})</span>
                    </h5>
                    <span className="text-[10px] text-stone-400 block">{rev.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-stone-900 px-2 py-0.5 rounded-lg border border-stone-800 shrink-0">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${
                          s <= rev.rating ? "text-amber-400 fill-amber-400" : "text-stone-700"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold font-mono text-amber-400 mr-1">
                    {rev.rating}.0
                  </span>
                </div>
              </div>

              <p className="text-xs text-stone-200 leading-relaxed">
                {rev.comment}
              </p>

              {/* Review Photo (if attached) */}
              {rev.imageUrl && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setEnlargedImage(rev.imageUrl!)}
                    className="relative group rounded-xl overflow-hidden border border-stone-700 inline-block w-24 h-24 hover:ring-2 hover:ring-emerald-400 transition-all"
                  >
                    <img
                      src={rev.imageUrl}
                      alt="صورة مراجعة الزائر"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent flex items-center justify-center">
                      <Camera className="w-4 h-4 text-white opacity-80" />
                    </div>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Photo Enlargement Modal */}
      {enlargedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fadeIn"
          onClick={() => setEnlargedImage(null)}
        >
          <div className="relative max-w-2xl max-h-[85vh] rounded-2xl overflow-hidden border border-stone-700 bg-stone-900 shadow-2xl">
            <img
              src={enlargedImage}
              alt="صورة الزائر بالحجم الكامل"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain max-h-[80vh]"
            />
            <button
              onClick={() => setEnlargedImage(null)}
              className="absolute top-3 left-3 p-2 rounded-full bg-black/70 text-white hover:bg-black"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
