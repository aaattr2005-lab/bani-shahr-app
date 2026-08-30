import React from "react";
import { 
  X, 
  Trash2, 
  MapPin, 
  Star, 
  ExternalLink, 
  Bookmark, 
  Sparkles,
  Share2
} from "lucide-react";
import { ATTRACTIONS_DATA, HOSPITALITY_PLACES } from "../data/baniShahrData";
import { Attraction } from "../types";

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedIds: string[];
  onRemoveBookmark: (id: string) => void;
  onSelectAttraction: (attraction: Attraction) => void;
  onClearAll: () => void;
}

export const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({
  isOpen,
  onClose,
  bookmarkedIds,
  onRemoveBookmark,
  onSelectAttraction,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const savedAttractions = ATTRACTIONS_DATA.filter((a) =>
    bookmarkedIds.includes(a.id)
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm">
      <div className="bg-stone-900 border-r border-stone-800 w-full max-w-md h-full flex flex-col shadow-2xl text-stone-100 animate-slideLeft">
        
        {/* Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-400 fill-amber-400" />
            <div>
              <h3 className="font-['Amiri'] font-bold text-lg text-stone-100">
                مخطط حقيبتي المفضلة
              </h3>
              <span className="text-xs text-stone-400">
                {savedAttractions.length} معالم محفوظة في رحلتك
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedAttractions.length > 0 && (
              <button
                onClick={onClearAll}
                title="مسح الكل"
                className="p-2 text-xs text-red-400 hover:text-red-300 hover:bg-stone-800 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-100 rounded-lg bg-stone-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {savedAttractions.length === 0 ? (
            <div className="text-center py-20 text-stone-400 space-y-3">
              <Bookmark className="w-12 h-12 mx-auto text-stone-600 stroke-1" />
              <p className="text-sm font-light">لم تقم بإضافة أي معالم إلى قائمتك بعد.</p>
              <span className="text-xs text-emerald-400 block">
                تصفح المعالم واضغط على زر الحفظ ⭐
              </span>
            </div>
          ) : (
            savedAttractions.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 flex gap-3 hover:border-emerald-500/40 transition-colors"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-xl object-cover shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300">
                        {item.city}
                      </span>
                      <button
                        onClick={() => onRemoveBookmark(item.id)}
                        className="text-stone-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h4 className="font-bold text-sm font-['Amiri'] text-stone-100 mt-1 line-clamp-1">
                      {item.name}
                    </h4>
                    <span className="text-[11px] text-amber-300">
                      الارتفاع: {item.elevation}
                    </span>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={() => {
                        onSelectAttraction(item);
                        onClose();
                      }}
                      className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <span>عرض التفاصيل</span>
                    </button>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${item.coordinates.lat},${item.coordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-stone-400 hover:text-stone-200"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {savedAttractions.length > 0 && (
          <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center gap-3">
            <button
              onClick={() => {
                const names = savedAttractions.map((s) => s.name).join("، ");
                navigator.clipboard.writeText(`📍 قائمة معالمي المختارة في بني شهر: ${names}`);
                alert("تم نسخ قائمة معالمك المختارة بنجاح!");
              }}
              className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>مشاركة القائمة</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
