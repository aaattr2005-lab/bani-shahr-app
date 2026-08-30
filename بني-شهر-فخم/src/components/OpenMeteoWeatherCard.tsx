import React, { useState, useEffect } from "react";
import {
  CloudRain,
  CloudLightning,
  CloudFog,
  Sun,
  CloudSun,
  Cloud,
  Droplets,
  Wind,
  ShieldAlert,
  AlertTriangle,
  RefreshCw,
  Clock,
  MapPin,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle2,
  Sparkles,
  Gauge
} from "lucide-react";
import { PlannerWeatherData, RainSeverity, AlertLevel } from "../types";

interface Props {
  onWeatherAlertChange?: (hasRainAlert: boolean) => void;
}

export const OpenMeteoWeatherCard: React.FC<Props> = ({ onWeatherAlertChange }) => {
  const [selectedCityId, setSelectedCityId] = useState<"alnamas" | "tanomah">("alnamas");
  const [citiesData, setCitiesData] = useState<PlannerWeatherData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [showHourly, setShowHourly] = useState(false);
  const [showApiInfoModal, setShowApiInfoModal] = useState(false);

  // Fetch weather from Open-Meteo API
  const fetchWeather = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      // Fetch from our local backend proxy or directly
      const res = await fetch("/api/open-meteo/weather");
      if (res.ok) {
        const data = await res.json();
        if (data.cities && Array.isArray(data.cities)) {
          setCitiesData(data.cities);
          setLastUpdated(new Date());

          // Notify parent if any city has rain alert
          const anyRain = data.cities.some(
            (c: PlannerWeatherData) => c.rainStatus.rainExpectedToday || c.rainStatus.isRaining
          );
          if (onWeatherAlertChange) {
            onWeatherAlertChange(anyRain);
          }
        }
      }
    } catch (error) {
      console.warn("Failed to fetch Open-Meteo weather via server, attempting direct client fetch:", error);
      // Direct client fallback to Open-Meteo
      try {
        const alNamasRes = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=19.1167&longitude=42.1333&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,precipitation_probability,precipitation,weather_code&timezone=Asia%2FRiyadh&forecast_days=2"
        );
        const tanomahRes = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=18.9482&longitude=42.1528&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,precipitation_probability,precipitation,weather_code&timezone=Asia%2FRiyadh&forecast_days=2"
        );
        if (alNamasRes.ok && tanomahRes.ok) {
          const namasJson = await alNamasRes.json();
          const tanomahJson = await tanomahRes.json();
          
          const parseDirect = (json: any, id: "alnamas" | "tanomah", nameAr: string, lat: number, lon: number, elev: string): PlannerWeatherData => {
            const cur = json.current || {};
            const hourly = json.hourly || {};
            const temp = Math.round(cur.temperature_2m || 19);
            const precip = Number((cur.precipitation || 0).toFixed(1));
            const isRain = precip > 0.1 || (cur.weather_code >= 51 && cur.weather_code <= 99);
            const rainProbMax = Math.max(...(hourly.precipitation_probability?.slice(0, 12) || [30]));

            return {
              id,
              cityNameAr: nameAr,
              lat,
              lon,
              elevation: elev,
              source: "Open-Meteo API",
              provider: "Open-Meteo API",
              stationName: `مرصد قمم السراة - ${nameAr}`,
              current: {
                temp,
                feelsLike: Math.round(cur.apparent_temperature || temp - 2),
                conditionAr: isRain ? "أمطار وضباب السراة" : "غائم جزئياً ونسيم عليل",
                conditionCode: isRain ? "rain" : "partly_cloudy",
                weatherCode: cur.weather_code || 2,
                humidity: Math.round(cur.relative_humidity_2m || 75),
                windSpeedKmh: Math.round(cur.wind_speed_10m || 14),
                windDirectionAr: "جنوبية غربية رطبة",
                precipitationMm: precip,
                precipProbability: rainProbMax,
                updatedAt: new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" }),
              },
              rainStatus: {
                isRaining: isRain,
                rainExpectedToday: isRain || rainProbMax >= 40,
                severity: precip > 5 ? "heavy" : precip > 2 ? "moderate" : "light",
                severityAr: precip > 5 ? "أمطار غزيرة ورعدية" : precip > 2 ? "أمطار متوسطة" : "أمطار خفيفة",
                precipAmountEstimate: `${precip} ملم`,
                expectedRainTime: "خلال ساعات اليوم",
                alertLevel: isRain || rainProbMax >= 50 ? "yellow" : "green",
                alertTitle: `تنبيه بأجواء ماطرة على ${nameAr}`,
                alertDescription: `توقعات بهطول أمطار مصحوبة بضباب كثيف يلف قمم ${nameAr}.`,
                safetyAdvice: "يرجى توخي الحذر عند القيادة في المنعطفات الجبلية.",
              },
              hourly: (hourly.time?.slice(0, 12) || []).map((t: string, idx: number) => ({
                time: t.split("T")[1]?.slice(0, 5) || `${idx}:00`,
                timestampIso: t,
                temp: Math.round(hourly.temperature_2m?.[idx] || temp),
                conditionAr: (hourly.precipitation_probability?.[idx] || 0) > 40 ? "أمطار متفرقة" : "غائم جزئياً",
                rainProbability: Math.round(hourly.precipitation_probability?.[idx] || 20),
                precipMm: Number((hourly.precipitation?.[idx] || 0).toFixed(1)),
                icon: (hourly.precipitation_probability?.[idx] || 0) > 40 ? "cloud-rain" : "cloud-sun",
              })),
              dailyForecast: [],
            };
          };

          const directCities = [
            parseDirect(namasJson, "alnamas", "النماص", 19.1167, 42.1333, "2,500 م"),
            parseDirect(tanomahJson, "tanomah", "تنومة", 18.9482, 42.1528, "2,200 م"),
          ];
          setCitiesData(directCities);
          setLastUpdated(new Date());
        }
      } catch (clientErr) {
        console.error("Direct Open-Meteo fallback error:", clientErr);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWeather();

    // Auto refresh every 1 hour (3,600,000 ms) as specified by Open-Meteo hourly forecast
    const interval = setInterval(() => {
      fetchWeather();
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const activeCity = citiesData.find((c) => c.id === selectedCityId) || citiesData[0];

  // Helper for weather icons
  const getWeatherIcon = (iconCode?: string, conditionCode?: string, size = "w-5 h-5") => {
    const code = iconCode || conditionCode || "";
    if (code.includes("lightning") || code.includes("thunder")) {
      return <CloudLightning className={`${size} text-amber-500 animate-pulse`} />;
    }
    if (code.includes("rain") || code.includes("moderate") || code.includes("heavy") || code.includes("showers")) {
      return <CloudRain className={`${size} text-sky-500`} />;
    }
    if (code.includes("fog") || code.includes("mist")) {
      return <CloudFog className={`${size} text-slate-400`} />;
    }
    if (code.includes("sun") || code.includes("clear")) {
      return <Sun className={`${size} text-amber-500`} />;
    }
    if (code.includes("cloud-sun") || code.includes("partly")) {
      return <CloudSun className={`${size} text-amber-600`} />;
    }
    return <Cloud className={`${size} text-slate-400`} />;
  };

  // Severity styling & badges
  const getSeverityBadge = (severity: RainSeverity, severityAr: string) => {
    switch (severity) {
      case "heavy":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-900/90 text-white text-xs font-bold shadow-sm border border-rose-600 animate-pulse">
            <CloudLightning className="w-3.5 h-3.5 text-amber-300" />
            <span>شدة الهطول: {severityAr}</span>
          </span>
        );
      case "moderate":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-800 text-sky-100 text-xs font-bold shadow-sm border border-sky-600">
            <CloudRain className="w-3.5 h-3.5 text-sky-300" />
            <span>شدة الهطول: {severityAr}</span>
          </span>
        );
      case "light":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800 text-emerald-100 text-xs font-bold shadow-sm border border-emerald-600">
            <CloudRain className="w-3.5 h-3.5 text-emerald-300" />
            <span>شدة الهطول: {severityAr}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-200 text-stone-700 text-xs font-bold">
            <Sun className="w-3.5 h-3.5 text-amber-600" />
            <span>مستقر / لا يوجد أمطار</span>
          </span>
        );
    }
  };

  const getAlertBannerClass = (level: AlertLevel) => {
    switch (level) {
      case "red":
        return "bg-gradient-to-r from-red-950 via-rose-900 to-red-900 border-red-500 text-white shadow-xl";
      case "orange":
        return "bg-gradient-to-r from-orange-950 via-amber-900 to-orange-900 border-amber-500 text-white shadow-lg";
      case "yellow":
      default:
        return "bg-gradient-to-r from-[#14281E] via-[#1B3629] to-[#0F2218] border-amber-500/50 text-white shadow-md";
    }
  };

  if (isLoading && !activeCity) {
    return (
      <div className="w-full bg-white rounded-3xl border border-[#E6DEC8] p-6 shadow-sm animate-pulse flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-stone-200"></div>
          <div className="space-y-2">
            <div className="w-48 h-4 bg-stone-200 rounded"></div>
            <div className="w-32 h-3 bg-stone-100 rounded"></div>
          </div>
        </div>
        <div className="w-24 h-8 bg-stone-200 rounded-xl"></div>
      </div>
    );
  }

  if (!activeCity) return null;

  return (
    <div className="w-full space-y-4 mb-8">
      
      {/* 1. Official Open-Meteo Rain Early Warning Alert Banner (إنذار الحالة المطرية) */}
      {(activeCity.rainStatus.rainExpectedToday || activeCity.rainStatus.isRaining) && (
        <div
          id="open-meteo-rain-warning-banner"
          className={`w-full p-4 sm:p-5 rounded-3xl border-2 transition-all ${getAlertBannerClass(
            activeCity.rainStatus.alertLevel
          )} relative overflow-hidden`}
        >
          {/* Background Atmospheric Glow */}
          <div className="absolute -top-12 -left-12 w-44 h-44 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 shrink-0">
                <AlertTriangle className="w-6 h-6 animate-bounce" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-sky-500 text-stone-950 text-[11px] font-extrabold tracking-wide">
                    تنبيه حالة مطرية (Open-Meteo)
                  </span>
                  <span className="text-xs text-stone-300 font-medium">
                    مرتفعات السراة • {activeCity.cityNameAr}
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-bold font-['Amiri'] text-amber-200 leading-tight">
                  {activeCity.rainStatus.alertTitle || `تنبيه هطول أمطار على قمم ${activeCity.cityNameAr}`}
                </h4>
                <p className="text-xs text-stone-200 leading-relaxed max-w-2xl font-light">
                  {activeCity.rainStatus.alertDescription}
                </p>
                {activeCity.rainStatus.safetyAdvice && (
                  <p className="text-[11px] text-amber-300/90 font-medium pt-1 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span><strong>إرشاد السلامة للزوار:</strong> {activeCity.rainStatus.safetyAdvice}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Severity and Timing Box */}
            <div className="sm:text-left flex flex-col items-start sm:items-end gap-2 shrink-0 bg-black/30 p-3 rounded-2xl border border-white/10 w-full sm:w-auto">
              {getSeverityBadge(activeCity.rainStatus.severity, activeCity.rainStatus.severityAr)}
              <span className="text-[11px] text-stone-300 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-300" />
                <span>الفترة: <strong>{activeCity.rainStatus.expectedRainTime}</strong></span>
              </span>
              <span className="text-[10px] text-sky-200 font-medium">
                كمية الهطول: <strong>{activeCity.current.precipitationMm > 0 ? `${activeCity.current.precipitationMm} ملم (حالي)` : activeCity.rainStatus.precipAmountEstimate}</strong>
              </span>
            </div>

          </div>
        </div>
      )}

      {/* 2. Main Current Weather Card (بطاقة حالة الطقس عبر Open-Meteo) */}
      <div className="w-full bg-white rounded-3xl border border-[#E6DEC8] shadow-md p-5 sm:p-6 overflow-hidden">
        
        {/* Card Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6DEC8] pb-4 mb-4">
          
          {/* Official Source & Location Switcher */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Open-Meteo Official Source Chip */}
            <button
              onClick={() => setShowApiInfoModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-950 border border-sky-300 text-xs font-bold transition-colors"
              title="انقر لعرض تفاصيل توثيق Open-Meteo API المباشر"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-700" />
              <span>المصدر: Open-Meteo API (مباشر ومفتوح)</span>
              <Info className="w-3 h-3 text-sky-600" />
            </button>

            {/* Location Selector Tabs (النماص / تنومة) */}
            <div className="inline-flex p-1 rounded-xl bg-[#F8F4EA] border border-[#E6DEC8]">
              {citiesData.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCityId(c.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selectedCityId === c.id
                      ? "bg-[#12201A] text-white shadow-sm"
                      : "text-stone-700 hover:text-stone-900"
                  }`}
                >
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>{c.cityNameAr}</span>
                  <span className="text-[10px] opacity-80">({c.elevation})</span>
                </button>
              ))}
            </div>

          </div>

          {/* Refresh & Last Updated Indicator */}
          <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-stone-500">
            <span className="flex items-center gap-1 text-[11px]">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>تحديث ساعي: {lastUpdated.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}</span>
            </span>
            <button
              onClick={() => fetchWeather(true)}
              disabled={isRefreshing}
              className="p-2 rounded-xl bg-[#F8F4EA] hover:bg-stone-200 text-stone-700 border border-[#E6DEC8] transition-colors disabled:opacity-50"
              title="تحديث فوري لبيانات الطقس من Open-Meteo"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-emerald-700" : ""}`} />
            </button>
          </div>

        </div>

        {/* Card Body: Grid of Metrics for Selected Location */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5 items-center">
          
          {/* Main Temperature & Condition */}
          <div className="col-span-2 p-4 rounded-2xl bg-gradient-to-br from-[#F8F4EA] to-[#F3EEE0] border border-[#E6DEC8] flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-white shadow-sm border border-[#E6DEC8] text-amber-600">
              {getWeatherIcon(undefined, activeCity.current.conditionCode, "w-8 h-8")}
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#12201A] font-['Amiri']">
                  {activeCity.current.temp}°
                </span>
                <span className="text-xs text-stone-500 font-medium">مئوية (السراة)</span>
              </div>
              <p className="text-xs font-bold text-emerald-900 mt-0.5">
                {activeCity.current.conditionAr}
              </p>
              <span className="text-[10px] text-stone-500 block">
                الإحداثيات: {activeCity.lat}° N, {activeCity.lon}° E
              </span>
            </div>
          </div>

          {/* Metric 1: Humidity */}
          <div className="p-3.5 rounded-2xl bg-[#F8F4EA] border border-[#E6DEC8] flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-stone-500 block">الرطوبة النسبية</span>
              <strong className="text-sm font-bold text-stone-900">{activeCity.current.humidity}%</strong>
            </div>
          </div>

          {/* Metric 2: Wind */}
          <div className="p-3.5 rounded-2xl bg-[#F8F4EA] border border-[#E6DEC8] flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-100 text-teal-700">
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-stone-500 block">سرعة الرياح</span>
              <strong className="text-sm font-bold text-stone-900">{activeCity.current.windSpeedKmh} كم/س</strong>
            </div>
          </div>

          {/* Metric 3: Rain Probability & Severity / mm */}
          <div className="p-3.5 rounded-2xl bg-[#F8F4EA] border border-[#E6DEC8] flex items-center gap-3">
            <div className={`p-2 rounded-xl ${
              activeCity.rainStatus.rainExpectedToday || activeCity.current.precipitationMm > 0
                ? "bg-sky-100 text-sky-800"
                : "bg-stone-100 text-stone-600"
            }`}>
              <CloudRain className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-stone-500 block">احتمال وهطول المطر</span>
              <div className="flex flex-col">
                <strong className={`text-sm font-bold ${
                  activeCity.rainStatus.rainExpectedToday ? "text-sky-800" : "text-stone-900"
                }`}>
                  {activeCity.current.precipProbability}% ({activeCity.rainStatus.severityAr})
                </strong>
                {activeCity.current.precipitationMm > 0 && (
                  <span className="text-[10px] text-sky-700 font-bold">
                    الشدة: {activeCity.current.precipitationMm} ملم
                  </span>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Hourly Forecast Accordion Toggle */}
        <div className="mt-4 pt-4 border-t border-[#E6DEC8] flex items-center justify-between">
          <button
            onClick={() => setShowHourly(!showHourly)}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 hover:text-emerald-700 transition-colors"
          >
            <span>التوقعات الساعية من Open-Meteo (12 ساعة القادمة)</span>
            {showHourly ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          
          <span className="text-[11px] text-stone-500">
            {activeCity.stationName}
          </span>
        </div>

        {/* 3. Hourly Forecast Horizontal Scroller */}
        {showHourly && (
          <div className="mt-3 pt-2 border-t border-dashed border-[#E6DEC8] animate-fadeIn">
            <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-2 overflow-x-auto pb-1 text-center">
              {activeCity.hourly.map((h, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-xl border text-xs flex flex-col items-center justify-between gap-1 transition-all ${
                    h.rainProbability >= 40 || h.precipMm > 0
                      ? "bg-sky-50/80 border-sky-300 text-sky-950 font-bold"
                      : "bg-[#F8F4EA] border-[#E6DEC8] text-stone-700"
                  }`}
                >
                  <span className="text-[11px] text-stone-500 font-sans">{h.time}</span>
                  <div className="my-0.5">
                    {getWeatherIcon(h.icon, undefined, "w-4 h-4")}
                  </div>
                  <span className="text-xs font-bold">{h.temp}°</span>
                  <span className={`text-[10px] ${h.rainProbability >= 40 ? "text-sky-700 font-extrabold" : "text-stone-400"}`}>
                    {h.rainProbability}%
                  </span>
                  {h.precipMm > 0 && (
                    <span className="text-[9px] text-sky-800 font-bold">
                      {h.precipMm}mm
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 4. Open-Meteo API Info Modal */}
      {showApiInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#E6DEC8] overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-[#12201A] to-[#1B2B22] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-6 h-6 text-sky-400" />
                <div>
                  <h3 className="text-lg font-bold font-['Amiri']">
                    مزود بيانات الطقس: Open-Meteo API
                  </h3>
                  <p className="text-xs text-stone-300">
                    بيانات طقس ونماذج عالمية عالية الدقة بدون مفاتيح أو قيود
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowApiInfoModal(false)}
                className="p-1.5 rounded-xl bg-stone-800 text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs text-stone-700 leading-relaxed overflow-y-auto max-h-[75vh]">
              
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200">
                <h4 className="font-bold text-sky-950 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-sky-700" />
                  <span>تكامل فوري ومفتوح (بدون تسجيل أو Token)</span>
                </h4>
                <p className="text-sky-900">
                  يعمل التطبيق الآن عبر الربط المباشر مع <strong>Open-Meteo API</strong> عبر نقطة النهاية <code className="bg-sky-100 px-1 py-0.5 rounded text-[11px] font-mono">https://api.open-meteo.com/v1/forecast</code> لتزويد زوار بني شهر ببيانات درجات الحرارة الساعية، احتمالية وشدة الأمطار بالمليمتر (mm)، ومؤشرات الإنذار الجوي.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8F4EA] border border-[#E6DEC8] space-y-1.5">
                <span className="font-bold text-stone-900 block">الإحداثيات الجغرافية المعتمدة:</span>
                <p className="text-stone-600 leading-relaxed">
                  • <strong>النماص:</strong> Latitude 19.1167°N, Longitude 42.1333°E (ارتفاع ~2,500 م)<br />
                  • <strong>تنومة:</strong> Latitude 18.9482°N, Longitude 42.1528°E (ارتفاع ~2,200 م)
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="font-bold text-stone-900 block">المزايا المفعلة:</span>
                <ul className="list-disc list-inside space-y-1 text-stone-600">
                  <li>تحديث آلي ساعي للبيانات.</li>
                  <li>رصد احتمالية هطول الأمطار (%) وكمية الهطول التقديرية بالمليمتر (mm).</li>
                  <li>تنبيه بصري فوري في حال رصد حالة مطرية أو ضباب كثيف.</li>
                </ul>
              </div>

              <div className="flex items-center justify-between pt-2">
                <a
                  href="https://open-meteo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-700 font-bold hover:underline inline-flex items-center gap-1"
                >
                  <span>زيارة موقع Open-Meteo</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={() => setShowApiInfoModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-900 text-white font-bold hover:bg-emerald-800 text-xs transition-colors"
                >
                  إغلاق
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
