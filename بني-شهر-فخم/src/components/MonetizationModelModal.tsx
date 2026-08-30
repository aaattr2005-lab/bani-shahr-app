import React, { useState } from "react";
import { 
  TrendingUp, 
  ShieldCheck, 
  X, 
  Sparkles, 
  Building, 
  Utensils, 
  Compass, 
  Home, 
  ShoppingBag, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  HelpCircle,
  BarChart3,
  Percent,
  Coins,
  Wallet,
  Globe
} from "lucide-react";
import { DataStore } from "../lib/datastore";
import { useLanguage } from "../lib/i18n";

interface MonetizationModelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MonetizationModelModal: React.FC<MonetizationModelModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { language, t } = useLanguage();
  const [guideTripsPerMonth, setGuideTripsPerMonth] = useState<number>(45);
  const [expBookingsPerMonth, setExpBookingsPerMonth] = useState<number>(60);
  const [foodOrdersPerMonth, setFoodOrdersPerMonth] = useState<number>(120);
  const [activeVillagesCount, setActiveVillagesCount] = useState<number>(8);
  const [activeTab, setActiveTab] = useState<"streams" | "simulator" | "future">("streams");

  if (!isOpen) return null;

  // Simulator math (all in Saudi Riyal SAR)
  const avgGuideTripPrice = 500;
  const guideCommissionRate = 0.10;
  const monthlyGuideRevenue = guideTripsPerMonth * avgGuideTripPrice * guideCommissionRate;

  const avgExpPrice = 140 * 2; // avg 2 guests per booking
  const expCommissionRate = 0.12;
  const monthlyExpRevenue = expBookingsPerMonth * avgExpPrice * expCommissionRate;

  const avgFoodOrder = 220;
  const foodCommissionRate = 0.08;
  const monthlyFoodRevenue = foodOrdersPerMonth * avgFoodOrder * foodCommissionRate;

  const villageMonthlyRate = 150;
  const monthlyVillageRevenue = activeVillagesCount * villageMonthlyRate;

  const totalEstimatedMonthlyRevenue = Math.round(
    monthlyGuideRevenue + monthlyExpRevenue + monthlyFoodRevenue + monthlyVillageRevenue
  );
  const totalEstimatedAnnualRevenue = totalEstimatedMonthlyRevenue * 12;

  const streams = [
    {
      id: "guide-stream",
      title: language === "ar" ? "عمولة حجوزات المرشدين السياحيين" : "Tour Guide Booking Commission",
      rate: "10%",
      status: language === "ar" ? "مفعل ويعمل حالياً" : "Active & Live",
      statusColor: "emerald",
      icon: Compass,
      desc: language === "ar" 
        ? "اقتطاع عمولة آلية بنسبة 10% من إجمالي قيمة كل جولة أو مسار جبلي يتم حجزه عبر المنصة بالريال السعودي، مع تسوية أسبوعية مباشرة للمرشد."
        : "Automated 10% commission on every guided tour and mountain trail booking in Saudi Riyals (SAR), with direct weekly payouts.",
      example: language === "ar" 
        ? "حجز مسار جبل منعاء بقيمة 450 ريال سعودي = عمولة المنصة 45 ر.س، وصافي دخل المرشد 405 ر.س."
        : "Booking Mount Mana'a trail for 450 SAR = Platform fee 45 SAR, Net guide payout 405 SAR."
    },
    {
      id: "exp-stream",
      title: language === "ar" ? "عمولة الأنشطة والتجارب الحية" : "Live Local Experiences Commission",
      rate: "12%",
      status: language === "ar" ? "مفعل ويعمل حالياً" : "Active & Live",
      statusColor: "emerald",
      icon: Sparkles,
      desc: language === "ar"
        ? "عمولة على تجارب صناعة العريكة، جني العسل، خض السمن، فن القط العسيري، وورش السمر التراثي محسوبة بالريال السعودي."
        : "Commission on traditional Areeka making, honey harvesting, ghee churning, Al-Qatt Al-Asiri art, and heritage campfire workshops in SAR.",
      example: language === "ar"
        ? "حجز تجربة العريكة لشخصين بقيمة 240 ريال سعودي = عمولة المنصة 28.8 ر.س، وصافي المضيف 211.2 ر.س."
        : "2-person Areeka workshop for 240 SAR = Platform fee 28.8 SAR, Host payout 211.2 SAR."
    },
    {
      id: "food-stream",
      title: language === "ar" ? "عمولة طلبات الأكل والأسر المنتجة" : "Local Food & Productive Families",
      rate: "8%",
      status: language === "ar" ? "مفعل ويعمل حالياً" : "Active & Live",
      statusColor: "emerald",
      icon: Utensils,
      desc: language === "ar"
        ? "عمولة تشغيلية مخفضة بنسبة 8% لدعم الأسر المنتجة ومطابخ الأكلات الشعبية والمناحل المسجلة في المتجر بالريال السعودي."
        : "A low 8% operational commission supporting local productive families, folk kitchens, and apiaries in SAR.",
      example: language === "ar"
        ? "طلب وجبات شعبية بقيمة 200 ريال سعودي = عمولة المنصة 16 ر.س، وصافي المتجر 184 ر.س."
        : "Local dishes order of 200 SAR = Platform fee 16 SAR, Family kitchen net 184 SAR."
    },
    {
      id: "village-stream",
      title: language === "ar" ? "اشتراكات بوابات القرى التراثية" : "Heritage Village Portal Subscriptions",
      rate: language === "ar" ? "150 ر.س / شهر" : "150 SAR / mo",
      subRate: language === "ar" ? "أو 1,400 ر.س / سنوياً" : "or 1,400 SAR / yr",
      status: language === "ar" ? "مفعل بنظام إشراف مستقل" : "Active with Village Supervisor Portal",
      statusColor: "emerald",
      icon: Building,
      desc: language === "ar"
        ? "رسوم اشتراك سنوية/شهرية بالريال السعودي تمنح القرية بوابتها الرقمية الخاصة، لوحة تحكم مشرف القرية، وتوثيق الحصون والفعاليات."
        : "Monthly/annual subscription in SAR providing each village with a dedicated digital portal, supervisor dashboard, and fort documentation.",
      example: language === "ar"
        ? "اشتراك سنوي Pro بـ 1,400 ريال سعودي للقرية شامل التوثيق وتطبيق رمز المشرف المخصص."
        : "Annual Pro subscription of 1,400 SAR per village including interactive fort maps and verified supervisor pass."
    },
    {
      id: "housing-stream",
      title: language === "ar" ? "عمولة السكن والمزارع والنزل الريفية" : "Rural Lodges & Farms Commission",
      rate: "10%",
      status: language === "ar" ? "مرحلة الإطلاق القادمة" : "Upcoming Phase",
      statusColor: "amber",
      icon: Home,
      desc: language === "ar"
        ? "ربط النزل الريفية، شاليهات السحاب، والمزارع السياحية مع الزوار بحجز فوري وعمولة 10% بالريال السعودي على كل ليلة."
        : "Connecting cloud chalets, agro-tourism farms, and countryside lodges with instant booking in SAR (10% fee).",
      example: language === "ar"
        ? "حجز ليلتين في نزل ريفي بـ 1,200 ريال سعودي = عمولة المنصة 120 ر.س، وصافي المالك 1,080 ر.س."
        : "2-night stay for 1,200 SAR = Platform fee 120 SAR, Owner payout 1,080 SAR."
    },
    {
      id: "products-stream",
      title: language === "ar" ? "سوق المنتجات المحلية والتمور والعسل" : "Heritage Products & Honey Market",
      rate: "7%",
      status: language === "ar" ? "مرحلة الإطلاق القادمة" : "Upcoming Phase",
      statusColor: "amber",
      icon: ShoppingBag,
      desc: language === "ar"
        ? "متجر موسمي متكامل لشحن عسل السدر، السمن، اللوز البلدي، والتمور السريسية لكافة مدن المملكة ودول الخليج بالريال السعودي."
        : "Seasonal market shipping wild Sidr honey, local almonds, and Sarees dates across Saudi Arabia and the GCC in SAR.",
      example: language === "ar"
        ? "عمولة 7% على مبيعات الطرود التراثية والمنتجات المعبأة بالريال السعودي."
        : "7% commission on packaged authentic goods in SAR."
    },
    {
      id: "ads-stream",
      title: language === "ar" ? "الإعلانات والظهور المميز للمشاريع" : "Sponsored Ads & Featured Listings",
      rate: language === "ar" ? "باقات تسويقية" : "Ad Packages",
      status: language === "ar" ? "متاح للحجز" : "Available",
      statusColor: "blue",
      icon: Layers,
      desc: language === "ar"
        ? "بانرات ترويجية، وتثبيت المشاريع في أعلى خريطة الدليل، وتغطيات مصورة في المنصة بالريال السعودي."
        : "Promotional banners, map pins, and verified spotlights priced in Saudi Riyals.",
      example: language === "ar" ? "باقة ظهور مميز شهري لمطعم أو منتجع في الواجهة الرئيسية بـ 800 ر.س." : "Monthly featured spotlight package for 800 SAR."
    },
    {
      id: "packages-stream",
      title: language === "ar" ? "باقات سياحية متكاملة (شاملة الإقامة والنقل)" : "All-Inclusive Tour Packages",
      rate: "15% - 20%",
      status: language === "ar" ? "مرحلة التوسع" : "Expansion Phase",
      statusColor: "purple",
      icon: BarChart3,
      desc: language === "ar"
        ? "برامج سياحية متكاملة (3 أيام / ليلتان) تشمل المرشد، التجربة، الوجبات، والتنقل بمركبات الدفع الرباعي."
        : "Curated 3-day/2-night packages including guide, workshops, local food, and 4x4 transport.",
      example: language === "ar" ? "باقة ويكند بني شهر VIP للشخص بـ 1,800 ريال سعودي." : "VIP weekend package at 1,800 SAR per person."
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-stone-900 border border-stone-700 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative text-stone-100">
        
        {/* Close Button */}
        <button
          id="close-monetization-modal-btn"
          onClick={onClose}
          className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition border border-stone-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-stone-800 to-stone-900 border-b border-stone-700/80">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-3">
            <Coins className="w-3.5 h-3.5" />
            <span>{language === "ar" ? "الهيكل المالي والنموذج الربحي بالريال السعودي (SAR)" : "Platform Revenue & Profit Model in Saudi Riyal (SAR)"}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            {language === "ar" ? "نموذج أرباح وعمولات منصة «بني شهر» (ر.س)" : "Bani Shahr Platform Revenue Model (SAR)"}
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
            {language === "ar"
              ? "نموذج أعمال مستدام مبني على شراكة رابحة مع المجتمع المحلي، يضمن تدفقات نقدية بالريال السعودي (SAR) من العمولات، الاشتراكات، والخدمات المميزة."
              : "A sustainable business model built in partnership with the local community, ensuring recurring revenue streams in Saudi Riyals (SAR)."}
          </p>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-6 overflow-x-auto">
            <button
              id="tab-streams-btn"
              onClick={() => setActiveTab("streams")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
                activeTab === "streams"
                  ? "bg-amber-500 text-stone-950 shadow-lg"
                  : "bg-stone-800 text-stone-300 hover:bg-stone-700"
              }`}
            >
              <Coins className="w-4 h-4" />
              <span>{language === "ar" ? "مصادر الدخل والعمولات (8 مسارات)" : "Revenue Streams (8 Channels)"}</span>
            </button>

            <button
              id="tab-simulator-btn"
              onClick={() => setActiveTab("simulator")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
                activeTab === "simulator"
                  ? "bg-amber-500 text-stone-950 shadow-lg"
                  : "bg-stone-800 text-stone-300 hover:bg-stone-700"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>{language === "ar" ? "محاكي تقدير الأرباح بالريال السعودي" : "SAR Revenue & Profit Simulator"}</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          {activeTab === "streams" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {streams.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div
                      key={s.id}
                      className="p-5 bg-stone-800/70 border border-stone-700/80 rounded-2xl flex flex-col justify-between hover:border-amber-500/40 transition shadow"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <span className="text-lg font-black text-amber-400 block leading-tight font-mono">{s.rate}</span>
                            {s.subRate && <span className="text-[10px] text-stone-400 block">{s.subRate}</span>}
                          </div>
                        </div>

                        <h4 className="text-sm font-bold text-white mb-1.5">{s.title}</h4>
                        <p className="text-xs text-stone-300 leading-relaxed mb-3">{s.desc}</p>
                      </div>

                      <div className="pt-3 border-t border-stone-700/50 flex flex-col gap-1.5">
                        <div className="text-[11px] text-amber-300/90 bg-amber-950/30 p-2 rounded-lg border border-amber-800/30">
                          <span className="font-bold">{language === "ar" ? "مثال بالريال السعودي:" : "SAR Example:"}</span> {s.example}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold mt-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{s.status}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "simulator" && (
            <div className="space-y-6">
              <div className="bg-stone-800/90 p-5 sm:p-6 rounded-2xl border border-stone-700">
                <h4 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-400" />
                  <span>{language === "ar" ? "محاكي احتساب العمولات والأرباح بالريال السعودي (SAR)" : "SAR Monthly Commission & Profit Calculator"}</span>
                </h4>
                <p className="text-xs text-stone-400 mb-6">
                  {language === "ar"
                    ? "حرك المؤشرات لتعديل عدد المعاملات الشهرية المتوقعة ومعاينة العائد المالي التقديري للمنصة بالريال السعودي."
                    : "Adjust the sliders to simulate expected monthly transactions and calculate net platform profits in SAR."}
                </p>

                <div className="space-y-5">
                  {/* Guide Slider */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-stone-200 mb-1.5">
                      <span>{language === "ar" ? "حجوزات المرشدين السياحيين شهرياً (عمولة 10%):" : "Guide Bookings / Month (10% Fee):"}</span>
                      <span className="text-amber-400 font-extrabold font-mono">
                        {guideTripsPerMonth} {language === "ar" ? "جولة" : "trips"} (~ {Math.round(monthlyGuideRevenue).toLocaleString(language === "ar" ? "ar-SA" : "en-US")} {language === "ar" ? "ر.س" : "SAR"})
                      </span>
                    </div>
                    <input
                      id="sim-guides-slider"
                      type="range"
                      min="5"
                      max="200"
                      value={guideTripsPerMonth}
                      onChange={(e) => setGuideTripsPerMonth(parseInt(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>

                  {/* Experiences Slider */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-stone-200 mb-1.5">
                      <span>{language === "ar" ? "حجوزات التجارب الحية والورش شهرياً (عمولة 12%):" : "Experiences & Workshops / Month (12% Fee):"}</span>
                      <span className="text-amber-400 font-extrabold font-mono">
                        {expBookingsPerMonth} {language === "ar" ? "حجز" : "bookings"} (~ {Math.round(monthlyExpRevenue).toLocaleString(language === "ar" ? "ar-SA" : "en-US")} {language === "ar" ? "ر.س" : "SAR"})
                      </span>
                    </div>
                    <input
                      id="sim-exp-slider"
                      type="range"
                      min="10"
                      max="300"
                      value={expBookingsPerMonth}
                      onChange={(e) => setExpBookingsPerMonth(parseInt(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>

                  {/* Food Orders Slider */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-stone-200 mb-1.5">
                      <span>{language === "ar" ? "طلبات المأكولات والأسر المنتجة شهرياً (عمولة 8%):" : "Food & Home Kitchen Orders / Month (8% Fee):"}</span>
                      <span className="text-amber-400 font-extrabold font-mono">
                        {foodOrdersPerMonth} {language === "ar" ? "طلب" : "orders"} (~ {Math.round(monthlyFoodRevenue).toLocaleString(language === "ar" ? "ar-SA" : "en-US")} {language === "ar" ? "ر.س" : "SAR"})
                      </span>
                    </div>
                    <input
                      id="sim-food-slider"
                      type="range"
                      min="20"
                      max="500"
                      value={foodOrdersPerMonth}
                      onChange={(e) => setFoodOrdersPerMonth(parseInt(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>

                  {/* Active Villages Subscriptions Slider */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-stone-200 mb-1.5">
                      <span>{language === "ar" ? "القرى التراثية المشتركة في المنصة (150 ر.س شهرياً):" : "Subscribed Heritage Villages (150 SAR / mo):"}</span>
                      <span className="text-amber-400 font-extrabold font-mono">
                        {activeVillagesCount} {language === "ar" ? "قرى" : "villages"} (~ {Math.round(monthlyVillageRevenue).toLocaleString(language === "ar" ? "ar-SA" : "en-US")} {language === "ar" ? "ر.س" : "SAR"})
                      </span>
                    </div>
                    <input
                      id="sim-villages-slider"
                      type="range"
                      min="1"
                      max="30"
                      value={activeVillagesCount}
                      onChange={(e) => setActiveVillagesCount(parseInt(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Total Revenue Display Cards in SAR */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-gradient-to-br from-amber-950/40 to-stone-900 border border-amber-500/40 rounded-2xl text-center">
                  <span className="text-xs text-amber-300 font-bold block mb-1">
                    {language === "ar" ? "صافي أرباح المنصة التقديرية بالريال السعودي (شهرياً)" : "Estimated Net Monthly Profit (SAR)"}
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-amber-400 font-mono">
                    {totalEstimatedMonthlyRevenue.toLocaleString(language === "ar" ? "ar-SA" : "en-US")}{" "}
                    <span className="text-sm font-normal text-stone-300">
                      {language === "ar" ? "ريال سعودي / شهر" : "SAR / month"}
                    </span>
                  </div>
                </div>

                <div className="p-5 bg-gradient-to-br from-emerald-950/40 to-stone-900 border border-emerald-500/40 rounded-2xl text-center">
                  <span className="text-xs text-emerald-300 font-bold block mb-1">
                    {language === "ar" ? "الإيراد السنوي التقديري بالريال السعودي (SAR)" : "Estimated Annual Revenue (SAR)"}
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">
                    {totalEstimatedAnnualRevenue.toLocaleString(language === "ar" ? "ar-SA" : "en-US")}{" "}
                    <span className="text-sm font-normal text-stone-300">
                      {language === "ar" ? "ريال سعودي / سنة" : "SAR / year"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-stone-800/40 rounded-2xl border border-stone-700/60 text-xs text-stone-400 space-y-1">
                <div className="font-bold text-stone-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{language === "ar" ? "آلية التحصيل والتسوية المالية بالريال السعودي:" : "Payout & Settlement Process in SAR:"}</span>
                </div>
                <p>
                  {language === "ar"
                    ? "يتم تحصيل المبالغ بالريال السعودي (SAR) إلكترونياً عبر بوابات الدفع المعتمدة (مدى Mada، Apple Pay، Visa، STC Pay) ويتم تلقائياً قيد عمولة التطبيق وإيداع صافي المستحقات للمرشدين، المضيفين، والأسر المنتجة أسبوعياً مع كشف حساب تفصيلي وفاتورة ضريبية رسمية."
                    : "Payments are processed securely in Saudi Riyals (SAR) via Mada, Apple Pay, Visa, and STC Pay. Platform commissions are deducted automatically, with net payouts disbursed weekly along with official tax invoices."}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-stone-950 border-t border-stone-800 flex items-center justify-between">
          <div className="text-xs text-stone-400">
            {language === "ar" ? "منصة بني شهر الرقمية الشاملة - كافة التعاملات بالريال السعودي (SAR)" : "Bani Shahr Platform - All transactions in Saudi Riyal (SAR)"}
          </div>
          <button
            id="close-monetization-bottom-btn"
            onClick={onClose}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl transition"
          >
            {language === "ar" ? "إغلاق" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
};
