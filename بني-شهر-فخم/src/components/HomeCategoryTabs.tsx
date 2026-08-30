import React from "react";
import { 
  Compass, 
  MapPin, 
  Landmark, 
  ShieldCheck, 
  Utensils, 
  Sparkles,
  Layers,
  Footprints,
  BookOpen,
  Hotel,
  Navigation,
  CheckCircle2
} from "lucide-react";

export type HomeCategoryTab = "explore" | "heritage" | "guides" | "market" | "all";

export interface SubSectionOption {
  id: string;
  label: string;
  shortLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface HomeCategoryTabsProps {
  activeTab: HomeCategoryTab;
  onTabChange: (tab: HomeCategoryTab) => void;
  activeSubSection: string;
  onSubSectionChange: (subId: string) => void;
  onQuickJump?: (sectionId: string) => void;
}

export const CATEGORIES: Array<{
  id: HomeCategoryTab;
  title: string;
  shortTitle: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badge: string;
  subSections: SubSectionOption[];
}> = [
  {
    id: "explore",
    title: "المعالم والطبيعة والمسارات",
    shortTitle: "المعالم والطبيعة",
    subtitle: "المعالم السياحية، الخريطة التفاعلية، القرى الجبلية، ومخطط الرحلات",
    icon: MapPin,
    accentColor: "emerald",
    badge: "4 أقسام",
    subSections: [
      { id: "all", label: "عرض كل الأقسام", shortLabel: "الكل", icon: Layers },
      { id: "attractions", label: "المعالم السياحية", shortLabel: "المعالم", icon: MapPin },
      { id: "interactive-map", label: "الخريطة التفاعلية", shortLabel: "الخريطة", icon: Navigation },
      { id: "villages-and-trails", label: "القرى والمسارات والمتاحف", shortLabel: "القرى والمسارات", icon: Footprints },
      { id: "planner", label: "مخطط الرحلات والطقس", shortLabel: "مخطط الرحلات", icon: Sparkles }
    ]
  },
  {
    id: "heritage",
    title: "التراث وتاريخ الديار",
    shortTitle: "التراث والأصالة",
    subtitle: "حصون وتاريخ بني شهر، معجم اللهجة والأمثال، وتجارب الموروث الحي",
    icon: Landmark,
    accentColor: "amber",
    badge: "3 أقسام",
    subSections: [
      { id: "all", label: "عرض كل الأقسام", shortLabel: "الكل", icon: Layers },
      { id: "heritage", label: "تراث وحصون الديار", shortLabel: "الحصون والتاريخ", icon: Landmark },
      { id: "dialect", label: "معجم اللهجة والأمثال", shortLabel: "اللهجة والأمثال", icon: BookOpen },
      { id: "experiences", label: "تجارب الموروث الحي", shortLabel: "تجارب الموروث", icon: Sparkles }
    ]
  },
  {
    id: "guides",
    title: "السياحة والمرشدون والتجارب",
    shortTitle: "المرشدون والتجارب",
    subtitle: "المرشدين السياحيين المرخصين، ورش العمل والتجارب الحية، وتخطيط الجولات",
    icon: ShieldCheck,
    accentColor: "indigo",
    badge: "3 أقسام",
    subSections: [
      { id: "all", label: "عرض كل الأقسام", shortLabel: "الكل", icon: Layers },
      { id: "tour-guides", label: "المرشدون السياحيون", shortLabel: "المرشدون", icon: ShieldCheck },
      { id: "experiences", label: "التجارب الحية والطهي", shortLabel: "التجارب الحية", icon: Sparkles },
      { id: "planner", label: "مخطط الجولات", shortLabel: "مخطط الرحلة", icon: Compass }
    ]
  },
  {
    id: "market",
    title: "سوق الديار والمطبخ والضيافة",
    shortTitle: "سوق الديار والضيافة",
    subtitle: "المطبخ الشهري والأسر المنتجة، النزل الريفية والمزارع، وسجل الزوار",
    icon: Utensils,
    accentColor: "rose",
    badge: "3 أقسام",
    subSections: [
      { id: "all", label: "عرض كل الأقسام", shortLabel: "الكل", icon: Layers },
      { id: "productive-families", label: "المطبخ والأسر المنتجة", shortLabel: "الأسر المنتجة", icon: Utensils },
      { id: "hospitality", label: "النزل والمزارع والمقاهي", shortLabel: "النزل والمقاهي", icon: Hotel },
      { id: "visitor-reviews", label: "سجل مراجعات الزوار", shortLabel: "مراجعات الزوار", icon: Sparkles }
    ]
  },
  {
    id: "all",
    title: "عرض جميع الأقسام بالتسلسل",
    shortTitle: "جميع الأقسام",
    subtitle: "تصفح كامل لتطبيق ديار بني شهر بالتسلسل الشامل",
    icon: Layers,
    accentColor: "stone",
    badge: "11 قسم",
    subSections: [
      { id: "all", label: "عرض الكل", shortLabel: "الكل", icon: Layers },
      { id: "attractions", label: "المعالم", icon: MapPin },
      { id: "interactive-map", label: "الخريطة", icon: Navigation },
      { id: "villages-and-trails", label: "القرى والمسارات", icon: Footprints },
      { id: "heritage", label: "التراث والحصون", icon: Landmark },
      { id: "tour-guides", label: "المرشدون", icon: ShieldCheck },
      { id: "productive-families", label: "الأسر المنتجة", icon: Utensils },
      { id: "hospitality", label: "النزل والضيافة", icon: Hotel },
      { id: "planner", label: "مخطط الرحلات", icon: Sparkles }
    ]
  }
];

export const HomeCategoryTabs: React.FC<HomeCategoryTabsProps> = ({
  activeTab,
  onTabChange,
  activeSubSection,
  onSubSectionChange,
}) => {
  const currentCategory = CATEGORIES.find(c => c.id === activeTab) || CATEGORIES[0];

  return (
    <section 
      id="home-category-tabs-section"
      className="w-full bg-[#12201A] border-y border-[#2E4F3E] sticky top-16 z-30 shadow-md backdrop-blur-md bg-opacity-95"
    >
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 py-2 sm:py-2.5">
        
        {/* Main Category Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  onTabChange(cat.id);
                  onSubSectionChange("all");
                  const el = document.getElementById("home-category-tabs-section");
                  if (el) {
                    const offset = 70;
                    const pos = el.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({ top: pos, behavior: "smooth" });
                  }
                }}
                id={`tab-btn-${cat.id}`}
                className={`group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 border shrink-0 ${
                  isActive
                    ? "bg-[#254B38] text-white border-[#C7A25C] shadow-sm scale-[1.01]"
                    : "bg-[#1B3629]/80 text-[#C7DACF] border-[#2E4F3E] hover:bg-[#254B38]/70 hover:text-white"
                }`}
              >
                <div className={`p-1 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-[#C7A25C] text-white" 
                    : "bg-[#14291E] text-[#9FB7A8] group-hover:text-white"
                }`}>
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                
                <span>{cat.shortTitle}</span>
                
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                  isActive 
                    ? "bg-[#C7A25C]/25 text-[#E9D9B8] border border-[#C7A25C]/40 font-bold" 
                    : "bg-[#14291E] text-[#7E9988]"
                }`}>
                  {cat.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sub-Section Filter Pills (Compact, fast navigation on mobile) */}
        {currentCategory.subSections && currentCategory.subSections.length > 0 && (
          <div className="mt-1.5 pt-1.5 border-t border-[#2E4F3E]/70 flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
            <span className="text-[10px] sm:text-[11px] text-[#A6C0B0] shrink-0 font-medium ml-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C7A25C]" />
              <span>تصفح الأقسام:</span>
            </span>

            {currentCategory.subSections.map((sub) => {
              const SubIcon = sub.icon;
              const isSubActive = activeSubSection === sub.id;

              return (
                <button
                  key={sub.id}
                  onClick={() => {
                    onSubSectionChange(sub.id);
                    const el = document.getElementById("home-category-tabs-section");
                    if (el) {
                      const offset = 70;
                      const pos = el.getBoundingClientRect().top + window.pageYOffset - offset;
                      window.scrollTo({ top: pos, behavior: "smooth" });
                    }
                  }}
                  className={`flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all shrink-0 ${
                    isSubActive
                      ? "bg-[#C7A25C] text-white font-bold shadow-sm"
                      : "bg-[#14291E] text-[#C7DACF] hover:bg-[#254B38] hover:text-white border border-[#2E4F3E]"
                  }`}
                >
                  <SubIcon className={`w-3 h-3 ${isSubActive ? "text-white" : "text-[#C7A25C]"}`} />
                  <span className="sm:hidden">{sub.shortLabel || sub.label}</span>
                  <span className="hidden sm:inline">{sub.label}</span>
                </button>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
