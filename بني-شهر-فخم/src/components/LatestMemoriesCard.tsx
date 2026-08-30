import React from "react";
import { MemoryItem } from "../types";
import { DataStore } from "../lib/datastore";
import { BookOpen, ChevronLeft, Sparkles, MapPin, History, Heart, ArrowLeft } from "lucide-react";

interface LatestMemoriesCardProps {
  onOpenMemoryPage: () => void;
}

export const LatestMemoriesCard: React.FC<LatestMemoriesCardProps> = ({ onOpenMemoryPage }) => {
  const publishedMemories = DataStore.getMemories(false);
  // Get latest 3 stories
  const latestStories = publishedMemories.slice(0, 3);

  if (latestStories.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1b3427] via-[#162a20] to-[#241a12] border border-[#7C9D86]/30 p-6 sm:p-8 shadow-xl text-white">
        
        {/* Glow ambient background accents */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          
          {/* Card Header with direct button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-700/60 pb-5">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold">
                <History className="w-3.5 h-3.5" />
                <span>أحدث القصص والروايات المعتمدة</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-['Amiri'] text-white">
                أحدث من ذاكرة بني شهر
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
                روايات الأجداد، بطولات القبائل وموروث السراة وتهامة الموثق
              </p>
            </div>

            <button
              onClick={onOpenMemoryPage}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-amber-950/40 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
            >
              <span>تصفح كافة قصص ذاكرة بني شهر</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          {/* 3 Preview Story Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {latestStories.map((story, idx) => (
              <div
                key={story.id || idx}
                onClick={onOpenMemoryPage}
                className="group cursor-pointer rounded-2xl bg-stone-900/80 border border-stone-700/60 hover:border-amber-500/60 p-4 sm:p-5 flex flex-col justify-between space-y-3 transition-all duration-300 hover:bg-stone-900 shadow-md hover:-translate-y-1"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[11px] font-bold">
                      {story.tribeBranch}
                    </span>
                    <span className="text-[10px] text-stone-400 font-medium">
                      {story.villageOrLocation}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold font-['Amiri'] text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
                    {story.title}
                  </h3>

                  <p className="text-xs text-stone-300 line-clamp-3 leading-relaxed">
                    {story.content}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
                  <span className="truncate">الراوي: <strong className="text-stone-200">{story.narratorName}</strong></span>
                  <div className="flex items-center gap-1 text-rose-400 font-bold shrink-0">
                    <Heart className="w-3 h-3 fill-rose-500/40" />
                    <span>{story.likesCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
