import React, { createContext, useContext, useState, useEffect } from "react";
import { AppStorage } from "./nativeStorage";

export type Language = "ar" | "en";

interface Translations {
  [key: string]: {
    ar: string;
    en: string;
  };
}

export const translations: Translations = {
  // Brand & Header
  brandName: { ar: "بني شهر", en: "Bani Shahr" },
  brandSub: { ar: "السراة وتهامة", en: "Al-Sarah & Tihama" },
  brandTagline: { ar: "المنصة السياحية والتراثية المتكاملة", en: "Integrated Tourism & Heritage Platform" },
  langSwitchBtn: { ar: "English", en: "العربية" },
  currencySymbol: { ar: "ر.س", en: "SAR" },
  currencyName: { ar: "ريال سعودي", en: "Saudi Riyal (SAR)" },

  // Navbar navigation
  navHero: { ar: "الرئيسية", en: "Home" },
  navMemory: { ar: "ذاكرة بني شهر", en: "Bani Shahr Archive" },
  navExperiences: { ar: "تجارب بني شهر", en: "Local Experiences" },
  navGuides: { ar: "المرشدون السياحيون", en: "Tour Guides" },
  navVillages: { ar: "القرى والمسارات", en: "Villages & Trails" },
  navFood: { ar: "المطبخ والأسر", en: "Kitchen & Families" },
  navMap: { ar: "الخريطة التفاعلية", en: "Interactive Map" },
  navHeritage: { ar: "التراث والتاريخ", en: "Heritage & History" },
  navAttractions: { ar: "المعالم السياحية", en: "Attractions" },
  navPlanner: { ar: "مخطط الرحلات", en: "Trip Planner" },
  navDialect: { ar: "اللهجة والأمثال", en: "Dialect & Culture" },
  navHospitality: { ar: "الضيافة والنزل", en: "Hospitality & Lodges" },
  
  // Navbar actions
  navAiGuide: { ar: "المرشد الذكي", en: "Smart AI Guide" },
  navDashboards: { ar: "لوحة التحكم", en: "Dashboards" },
  navMonetization: { ar: "نموذج الأرباح (ر.س)", en: "Revenue Model (SAR)" },
  navCart: { ar: "سلة الأكلات", en: "Food Cart" },
  navBookmarks: { ar: "المفضلة", en: "Bookmarks" },
  navWeather: { ar: "ضباب 19°م", en: "Foggy 19°C" },

  // Monetization & Revenue
  revenueModelTitle: { ar: "نموذج أرباح وعمولات المنصة بالريال السعودي (SAR)", en: "Platform Revenue & Commission Model (SAR)" },
  saudiRiyalLabel: { ar: "بالريال السعودي", en: "In Saudi Riyal (SAR)" },
  totalProfitEstimate: { ar: "إجمالي الأرباح الشهرية المتوقعة", en: "Total Estimated Monthly Profit" },
  annualProfitEstimate: { ar: "إجمالي الأرباح السنوية المتوقعة", en: "Total Estimated Annual Profit" },
  platformCommission: { ar: "عمولة المنصة", en: "Platform Commission" },
  hostNetEarnings: { ar: "صافي أرباح المضيف / المرشد", en: "Net Host/Guide Earnings" },

  // Hero Section
  heroBadge: { ar: "وجهة الطبيعة الساحرة والتاريخ العريق في عسير", en: "Charming Nature & Ancient History in Asir" },
  heroTitle1: { ar: "اكتشف بلاد", en: "Discover the Land of" },
  heroTitle2: { ar: "بني شهر", en: "Bani Shahr" },
  heroSubtitle: { ar: "من قمم جبال منعاء والظهور في السراة، إلى سهول وأودية خاط وخاطر في تهامة. تراث أصيل، مسارات هايكنج خلابة، وتجارب شعبية حية.", en: "From the peaks of Mount Mana'a in Al-Sarah to the valleys of Khat & Khatir in Tihama. Authentic heritage, scenic hiking trails, and live cultural experiences." },
  exploreBtn: { ar: "استكشف المعالم والمسارات", en: "Explore Landmarks & Trails" },
  aiConsultBtn: { ar: "استشر المرشد الذكي", en: "Consult AI Guide" },
  fastFactsElevation: { ar: "أعلى قمة 3000م فوق البحر", en: "Highest peak 3,000m above sea level" },
  fastFactsVillages: { ar: "+120 قرية وحصن تاريخي", en: "+120 historic villages & forts" },
  fastFactsHospitality: { ar: "كرم وضيافة عسيرية أصيلة", en: "Authentic Asiri hospitality" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, defaultText?: string) => string;
  dir: "rtl" | "ltr";
  formatSAR: (amount: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = AppStorage.getItem("bani_shahr_lang");
      return (saved === "en" || saved === "ar") ? saved : "ar";
    } catch {
      return "ar";
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      AppStorage.setItem("bani_shahr_lang", lang);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };

  const dir = language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [dir, language]);

  const t = (key: string, defaultText?: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return defaultText || key;
  };

  const formatSAR = (amount: number): string => {
    if (language === "ar") {
      return `${amount.toLocaleString("ar-SA")} ر.س`;
    }
    return `SAR ${amount.toLocaleString("en-US")}`;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, dir, formatSAR }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Safe fallback to prevent runtime crashes
    return {
      language: "ar",
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: (key: string, defaultText?: string) => {
        if (translations[key] && translations[key]["ar"]) {
          return translations[key]["ar"];
        }
        return defaultText || key;
      },
      dir: "rtl",
      formatSAR: (amount: number) => `${amount.toLocaleString("ar-SA")} ر.س`,
    };
  }
  return context;
};
