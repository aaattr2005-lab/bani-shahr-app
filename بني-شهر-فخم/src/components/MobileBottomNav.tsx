import React from "react";
import { Home, User, Calendar, MapPin } from "lucide-react";

interface MobileBottomNavProps {
  currentView: "home" | "tribes" | "forts" | "attractions" | "memory";
  onNavigate: (view: "home" | "tribes" | "forts" | "attractions" | "memory") => void;
  onOpenEvents: () => void;
  onOpenAccount: () => void;
  isLoggedIn?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onNavigate,
  onOpenEvents,
  onOpenAccount,
}) => {
  return (
    <div className="fixed bottom-3 left-3 right-3 sm:hidden z-50 pointer-events-auto flex justify-center animate-fadeIn">
      <nav
        aria-label="التنقل السفلي للموبايل"
        className="w-full max-w-md relative overflow-hidden rounded-[2.2rem] px-2 py-2 flex items-center justify-between font-['IBM_Plex_Sans_Arabic',sans-serif] transition-all"
        style={{
          // Al Rajhi Ultra-clean Frosted White/Liquid Crystal glass style
          background: "rgba(255, 255, 255, 0.88)",
          backdropFilter: "blur(24px) saturate(190%)",
          WebkitBackdropFilter: "blur(24px) saturate(190%)",
          border: "1px solid rgba(255, 255, 255, 0.95)",
          boxShadow: "0 14px 36px -6px rgba(22, 46, 34, 0.16), 0 4px 14px -3px rgba(0, 0, 0, 0.08), inset 0 1px 1px 0 rgba(255, 255, 255, 1)"
        }}
      >
        {/* Specular Top Light Gloss Sheen */}
        <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none" />

        {/* 5. حسابي (My Account) - Far Left in RTL */}
        <button
          onClick={onOpenAccount}
          className="flex flex-col items-center justify-center flex-1 py-1 transition-transform active:scale-90 group focus:outline-none"
          id="mobile-nav-account"
        >
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-stone-600 group-hover:text-[#12201A] group-hover:bg-black/5 transition-all">
            <User className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[11px] font-semibold text-stone-600 group-hover:text-[#12201A] mt-0.5 tracking-tight">
            حسابي
          </span>
        </button>

        {/* 4. الفعاليات (Events) */}
        <button
          onClick={onOpenEvents}
          className="flex flex-col items-center justify-center flex-1 py-1 transition-transform active:scale-90 group focus:outline-none"
          id="mobile-nav-events"
        >
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-stone-600 group-hover:text-[#12201A] group-hover:bg-black/5 transition-all">
            <Calendar className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[11px] font-semibold text-stone-600 group-hover:text-[#12201A] mt-0.5 tracking-tight">
            الفعاليات
          </span>
        </button>

        {/* 3. القبيلة (Tribe) */}
        <button
          onClick={() => onNavigate("tribes")}
          className="flex flex-col items-center justify-center flex-1 py-1 transition-transform active:scale-90 group focus:outline-none"
          id="mobile-nav-tribes"
        >
          <div className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${
            currentView === "tribes"
              ? "bg-[#12201A] text-white shadow-md shadow-[#12201A]/25 ring-1 ring-[#12201A]"
              : "text-stone-600 group-hover:text-[#12201A] group-hover:bg-black/5"
          }`}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <span
            className={`text-[11px] font-semibold mt-0.5 tracking-tight ${
              currentView === "tribes" ? "text-[#12201A] font-bold" : "text-stone-600 group-hover:text-[#12201A]"
            }`}
          >
            القبيلة
          </span>
        </button>

        {/* 2. المعالم (Landmarks) */}
        <button
          onClick={() => onNavigate("attractions")}
          className="flex flex-col items-center justify-center flex-1 py-1 transition-transform active:scale-90 group focus:outline-none"
          id="mobile-nav-landmarks"
        >
          <div className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${
            currentView === "attractions" || currentView === "forts"
              ? "bg-amber-600 text-white shadow-md shadow-amber-600/30 ring-1 ring-amber-600"
              : "text-stone-600 group-hover:text-[#12201A] group-hover:bg-black/5"
          }`}>
            <MapPin className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span
            className={`text-[11px] font-semibold mt-0.5 tracking-tight ${
              currentView === "attractions" || currentView === "forts"
                ? "text-amber-700 font-bold"
                : "text-stone-600 group-hover:text-[#12201A]"
            }`}
          >
            المعالم
          </span>
        </button>

        {/* 1. الرئيسية (Home) - Far Right in RTL */}
        <button
          onClick={() => onNavigate("home")}
          className="flex flex-col items-center justify-center flex-1 py-1 transition-transform active:scale-90 group focus:outline-none"
          id="mobile-nav-home"
        >
          <div
            className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${
              currentView === "home"
                ? "bg-gradient-to-br from-[#12201A] to-[#0E1F17] text-white shadow-md shadow-[#12201A]/30 ring-1 ring-white/50"
                : "bg-transparent text-stone-600 group-hover:text-[#12201A] group-hover:bg-black/5"
            }`}
          >
            <Home className="w-5 h-5 stroke-[2.3]" />
          </div>
          <span
            className={`text-[11px] font-semibold mt-0.5 tracking-tight ${
              currentView === "home" ? "text-[#12201A] font-bold" : "text-stone-600 group-hover:text-[#12201A]"
            }`}
          >
            الرئيسية
          </span>
        </button>
      </nav>
    </div>
  );
};

