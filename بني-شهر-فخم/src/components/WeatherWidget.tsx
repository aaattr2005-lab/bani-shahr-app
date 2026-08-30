import React, { useState, useEffect } from "react";
import {
  Cloud,
  CloudSun,
  CloudRain,
  CloudFog,
  Sun,
  Wind,
  Droplets,
  Thermometer,
  Eye,
  RefreshCw,
  Sparkles,
  Mountain,
  CheckCircle2,
  AlertTriangle,
  Compass,
  ArrowUpRight
} from "lucide-react";

interface CityWeatherConfig {
  id: string;
  name: string;
  subName: string;
  zone: "sarawat" | "tihamah";
  elevation: string;
  lat: number;
  lng: number;
  bestActivity: string;
  defaultTemp: number;
  defaultCondition: string;
  defaultHumidity: number;
  defaultWind: number;
  defaultWeatherCode: number;
}

const CITIES: CityWeatherConfig[] = [
  {
    id: "tanomah",
    name: "تنومة",
    subName: "عروس الجبال والضباب والشلالات",
    zone: "sarawat",
    elevation: "2,200 م",
    lat: 18.9482,
    lng: 42.1528,
    bestActivity: "أجواء مثالية لزيارة شلال الدهناء والهايكنج في جبل مَنعاء وغابات المحفار.",
    defaultTemp: 19,
    defaultCondition: "ضباب خفيف وغائم جزئياً",
    defaultHumidity: 65,
    defaultWind: 12,
    defaultWeatherCode: 2,
  },
  {
    id: "alnamas",
    name: "النماص",
    subName: "مدينة الضباب وقصور التراث التاريخية",
    zone: "sarawat",
    elevation: "2,500 م",
    lat: 19.1167,
    lng: 42.1333,
    bestActivity: "مناسبة جداً لزيارة قصر المقر الحضاري ومطلات السحاب في شعف آل وليد.",
    defaultTemp: 17,
    defaultCondition: "أجواء باردة تعانق السحاب والضباب",
    defaultHumidity: 78,
    defaultWind: 15,
    defaultWeatherCode: 45,
  },
  {
    id: "almajardah",
    name: "المجاردة",
    subName: "تهامة بني شهر والمشاتي الدافئة",
    zone: "tihamah",
    elevation: "800 م",
    lat: 19.124,
    lng: 41.912,
    bestActivity: "أجواء دافئة ممتازة لرحلات الأودية الجارية والتخييم في وادي خاط وثربان.",
    defaultTemp: 28,
    defaultCondition: "مشمس ودافئ مع نسيم ربيعي",
    defaultHumidity: 42,
    defaultWind: 8,
    defaultWeatherCode: 0,
  },
  {
    id: "khat-tharban",
    name: "وادي خاط وثربان",
    subName: "ينابيع الأودية والمزارع الاستوائية",
    zone: "tihamah",
    elevation: "750 م",
    lat: 19.182,
    lng: 41.875,
    bestActivity: "فرصة رائعة لجولات الطبيعة المائية وتذوق المنتجات الزراعية والمحاصيل المحلية.",
    defaultTemp: 29,
    defaultCondition: "سماء صافية ونسيم عليل",
    defaultHumidity: 38,
    defaultWind: 9,
    defaultWeatherCode: 1,
  },
];

interface WeatherState {
  temperature: number;
  apparentTemp: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  conditionText: string;
  isDay: boolean;
  forecast: {
    day: string;
    code: number;
    maxTemp: number;
    minTemp: number;
  }[];
}

const getWeatherDescription = (code: number): { text: string; icon: any; advice: string; suitability: string; suitColor: string } => {
  if (code === 0) {
    return {
      text: "سماء صافية ومشمسة",
      icon: Sun,
      advice: "أجواء مثالية للاستكشاف والتصوير البانورامي للمطلات الطبيعية.",
      suitability: "ممتاز جداً للأنشطة والرحلات",
      suitColor: "text-emerald-400 bg-emerald-950/60 border-emerald-500/30",
    };
  } else if (code === 1 || code === 2) {
    return {
      text: "غائم جزئياً مع نسمات عليلة",
      icon: CloudSun,
      advice: "طقس رائع للهايكنج والمشي في المسارات الجبلية المفتوحة.",
      suitability: "مثالي للهايكنج والجولات",
      suitColor: "text-teal-400 bg-teal-950/60 border-teal-500/30",
    };
  } else if (code === 3) {
    return {
      text: "غائم مع سحب ركامية جبلية",
      icon: Cloud,
      advice: "إطلالات ساحرة على طبقات الغيوم، يفضل حمل سترة خفيفة في السراة.",
      suitability: "رائع جداً للنزهات العائلية",
      suitColor: "text-sky-400 bg-sky-950/60 border-sky-500/30",
    };
  } else if (code === 45 || code === 48) {
    return {
      text: "ضباب جبلي كثيف وسحاب ملامس للأرض",
      icon: CloudFog,
      advice: "تدرج درجات الحرارة نحو البرودة. استمتع بمنظر السحاب مع توخي الحذر أثناء القيادة في المنحدرات.",
      suitability: "تجربة ضباب وسحاب استثنائية",
      suitColor: "text-amber-300 bg-amber-950/60 border-amber-500/30",
    };
  } else if (code >= 51 && code <= 67) {
    return {
      text: "رذاذ وأمطار رعدية منعشة",
      icon: CloudRain,
      advice: "جريان الشلالات والينابيع في أوجها. يرجى تجنب بطون الأودية المنخفضة.",
      suitability: "أجواء ماطرة وشلالات جارية",
      suitColor: "text-cyan-400 bg-cyan-950/60 border-cyan-500/30",
    };
  } else if (code >= 80) {
    return {
      text: "زخات مطر جبلية غزيرة",
      icon: CloudRain,
      advice: "استمتع بالأجواء من المقاهي والمطلات المغلقة وتجنب مسارات الصخور الزلقة.",
      suitability: "تنبيه: أمطار غزيرة",
      suitColor: "text-amber-400 bg-amber-950/60 border-amber-500/30",
    };
  }

  return {
    text: "معتدل ولطيف",
    icon: CloudSun,
    advice: "طقس مستقر ومناسب لكافة الأنشطة السياحية والتراثية.",
    suitability: "مناسب لكافة الرحلات",
    suitColor: "text-emerald-400 bg-emerald-950/60 border-emerald-500/30",
  };
};

export const WeatherWidget: React.FC = () => {
  const [selectedCityId, setSelectedCityId] = useState<string>("tanomah");
  const [weatherData, setWeatherData] = useState<Record<string, WeatherState>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const currentCity = CITIES.find((c) => c.id === selectedCityId) || CITIES[0];

  const fetchCityWeather = async (city: CityWeatherConfig) => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia%2FRiyadh`
      );

      if (!response.ok) {
        throw new Error("Weather API response not ok");
      }

      const data = await response.json();
      const current = data.current;
      const daily = data.daily;

      const dayNames = ["اليوم", "غداً", "بعد غد"];
      const forecast = (daily.time || []).slice(0, 3).map((_: string, idx: number) => ({
        day: dayNames[idx] || `يوم ${idx + 1}`,
        code: daily.weather_code[idx] ?? 1,
        maxTemp: Math.round(daily.temperature_2m_max[idx] ?? city.defaultTemp + 2),
        minTemp: Math.round(daily.temperature_2m_min[idx] ?? city.defaultTemp - 4),
      }));

      const weatherDesc = getWeatherDescription(current.weather_code ?? city.defaultWeatherCode);

      return {
        temperature: Math.round(current.temperature_2m ?? city.defaultTemp),
        apparentTemp: Math.round(current.apparent_temperature ?? current.temperature_2m ?? city.defaultTemp),
        humidity: Math.round(current.relative_humidity_2m ?? city.defaultHumidity),
        windSpeed: Math.round(current.wind_speed_10m ?? city.defaultWind),
        weatherCode: current.weather_code ?? city.defaultWeatherCode,
        conditionText: weatherDesc.text,
        isDay: current.is_day === 1,
        forecast: forecast.length > 0 ? forecast : [
          { day: "اليوم", code: city.defaultWeatherCode, maxTemp: city.defaultTemp + 2, minTemp: city.defaultTemp - 3 },
          { day: "غداً", code: city.defaultWeatherCode, maxTemp: city.defaultTemp + 3, minTemp: city.defaultTemp - 2 },
          { day: "بعد غد", code: 1, maxTemp: city.defaultTemp + 2, minTemp: city.defaultTemp - 3 },
        ],
      };
    } catch (err) {
      // Fallback with realistic regional data
      const weatherDesc = getWeatherDescription(city.defaultWeatherCode);
      return {
        temperature: city.defaultTemp,
        apparentTemp: city.defaultTemp - 1,
        humidity: city.defaultHumidity,
        windSpeed: city.defaultWind,
        weatherCode: city.defaultWeatherCode,
        conditionText: weatherDesc.text,
        isDay: true,
        forecast: [
          { day: "اليوم", code: city.defaultWeatherCode, maxTemp: city.defaultTemp + 2, minTemp: city.defaultTemp - 4 },
          { day: "غداً", code: city.defaultWeatherCode, maxTemp: city.defaultTemp + 3, minTemp: city.defaultTemp - 3 },
          { day: "بعد غد", code: 1, maxTemp: city.defaultTemp + 1, minTemp: city.defaultTemp - 4 },
        ],
      };
    }
  };

  const loadAllWeather = async () => {
    setIsLoading(true);
    const results: Record<string, WeatherState> = {};

    await Promise.all(
      CITIES.map(async (city) => {
        const data = await fetchCityWeather(city);
        results[city.id] = data;
      })
    );

    setWeatherData(results);
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  useEffect(() => {
    loadAllWeather();
  }, []);

  const currentWeather = weatherData[selectedCityId] || {
    temperature: currentCity.defaultTemp,
    apparentTemp: currentCity.defaultTemp - 1,
    humidity: currentCity.defaultHumidity,
    windSpeed: currentCity.defaultWind,
    weatherCode: currentCity.defaultWeatherCode,
    conditionText: currentCity.defaultCondition,
    isDay: true,
    forecast: [
      { day: "اليوم", code: currentCity.defaultWeatherCode, maxTemp: currentCity.defaultTemp + 2, minTemp: currentCity.defaultTemp - 3 },
      { day: "غداً", code: currentCity.defaultWeatherCode, maxTemp: currentCity.defaultTemp + 3, minTemp: currentCity.defaultTemp - 2 },
      { day: "بعد غد", code: 1, maxTemp: currentCity.defaultTemp + 2, minTemp: currentCity.defaultTemp - 3 },
    ],
  };

  const info = getWeatherDescription(currentWeather.weatherCode);
  const WeatherIcon = info.icon;

  return (
    <div id="bani-shahr-weather-widget" className="mb-10 rounded-3xl bg-white border border-[#E6DEC8] p-5 sm:p-7 shadow-md relative overflow-hidden">
      
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#E6DEC8] relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#F8F4EA] border border-[#E6DEC8] text-emerald-800 flex items-center justify-center shadow-sm">
            <CloudSun className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-[#12201A] font-['Amiri'] tracking-wide">
                حالة الطقس المباشر في ديار بني شهر
              </h3>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-[11px] font-semibold text-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                مباشر
              </span>
            </div>
            <p className="text-xs text-[#5A524C]">
              بيانات مناخية حية لمساعدة السياح والمغامرين في التخطيط لجولات السراة وتهامة
            </p>
          </div>
        </div>

        {/* Refresh & Update Time */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-stone-500 font-mono hidden sm:inline-block">
            آخر تحديث: {lastUpdated.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}
          </span>
          <button
            id="refresh-weather-btn"
            onClick={loadAllWeather}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8F4EA] hover:bg-stone-100 text-stone-700 text-xs font-semibold border border-[#E6DEC8] transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            title="تحديث بيانات الطقس"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-700 ${isLoading ? "animate-spin" : ""}`} />
            <span>{isLoading ? "جارِ التحديث..." : "تحديث"}</span>
          </button>
        </div>
      </div>

      {/* City Switcher Tabs */}
      <div className="pt-5 flex flex-wrap items-center gap-2 relative z-10">
        {CITIES.map((city) => {
          const isSelected = city.id === selectedCityId;
          const cityTemp = weatherData[city.id]?.temperature ?? city.defaultTemp;
          return (
            <button
              id={`city-tab-${city.id}`}
              key={city.id}
              onClick={() => setSelectedCityId(city.id)}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl text-xs font-semibold transition-all ${
                isSelected
                  ? "bg-emerald-800 text-white shadow-sm scale-105 border border-emerald-900 font-bold"
                  : "bg-[#F8F4EA] hover:bg-stone-100 border border-[#E6DEC8] text-stone-700 hover:text-stone-900"
              }`}
            >
              <span>{city.name}</span>
              <span className={`text-[11px] px-1.5 py-0.5 rounded-md font-mono ${
                isSelected ? "bg-emerald-900 text-emerald-100" : "bg-white text-stone-600 border border-[#E6DEC8]"
              }`}>
                {cityTemp}°م
              </span>
              <span className="text-[10px] opacity-75 hidden md:inline">
                ({city.elevation})
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Weather Card Display */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5 relative z-10">
        
        {/* Left Column: Big Temperature & Status (5 Cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-[#F8F4EA] border border-[#E6DEC8] p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold">
                <Mountain className="w-3.5 h-3.5" />
                <span>{currentCity.name}</span>
                <span className="text-stone-400">•</span>
                <span className="text-amber-800 font-mono">الارتفاع: {currentCity.elevation}</span>
              </div>
              <span className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border bg-white ${info.suitColor}`}>
                {info.suitability}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 my-3">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl sm:text-6xl font-black font-mono text-stone-900 tracking-tight">
                    {currentWeather.temperature}
                  </span>
                  <span className="text-2xl sm:text-3xl text-emerald-800 font-bold font-mono">°م</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-stone-500 font-mono">
                  <span>المحسوسة: {currentWeather.apparentTemp}°م</span>
                </div>
              </div>

              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-[#E6DEC8] flex items-center justify-center text-emerald-800 shadow-sm">
                <WeatherIcon className="w-9 h-9 sm:w-11 sm:h-11 text-emerald-700 animate-pulse" />
              </div>
            </div>

            <h4 className="text-base sm:text-lg font-bold text-stone-900 font-['Amiri']">
              {info.text}
            </h4>
            <p className="text-xs text-[#5A524C] mt-1 leading-relaxed">
              {currentCity.subName}
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-[#E6DEC8] text-xs">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#E6DEC8]">
              <Droplets className="w-4 h-4 text-cyan-600 shrink-0" />
              <div>
                <span className="text-[10px] text-stone-500 block">نسبة الرطوبة</span>
                <span className="font-bold text-stone-800 font-mono">{currentWeather.humidity}%</span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#E6DEC8]">
              <Wind className="w-4 h-4 text-teal-600 shrink-0" />
              <div>
                <span className="text-[10px] text-stone-500 block">سرعة الرياح</span>
                <span className="font-bold text-stone-800 font-mono">{currentWeather.windSpeed} كم/س</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tourist Recommendations & 3-Day Forecast (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-4">
          
          {/* Smart Tourism Advice Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#EAF5EF] border border-emerald-200 flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-white border border-emerald-300 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <Sparkles className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h5 className="text-xs sm:text-sm font-bold text-emerald-900 font-['Amiri'] mb-1">
                نصيحة المرشد السياحي للأجواء الحالية:
              </h5>
              <p className="text-xs text-stone-700 leading-relaxed">
                {info.advice}
              </p>
              <div className="mt-2.5 pt-2 border-t border-emerald-200 text-[11px] text-amber-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>{currentCity.bestActivity}</span>
              </div>
            </div>
          </div>

          {/* 3-Day Forecast Cards */}
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs text-stone-600 font-semibold">توقعات الأيام القادمة في {currentCity.name}:</span>
              <span className="text-[11px] text-emerald-800 font-mono font-bold">درجات الحرارة المتوقعة</span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {currentWeather.forecast.map((fc, index) => {
                const fcInfo = getWeatherDescription(fc.code);
                const FcIcon = fcInfo.icon;
                return (
                  <div
                    key={index}
                    className="p-3 rounded-2xl bg-[#F8F4EA] border border-[#E6DEC8] flex flex-col items-center justify-between text-center hover:border-emerald-600/40 transition-colors shadow-sm"
                  >
                    <span className="text-xs font-bold text-stone-800 mb-1">{fc.day}</span>
                    <FcIcon className="w-6 h-6 text-emerald-700 my-1" />
                    <span className="text-[10px] text-stone-600 truncate max-w-full px-1 mb-1">
                      {fcInfo.text.split(" ")[0]}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-mono">
                      <span className="font-bold text-stone-900">{fc.maxTemp}°</span>
                      <span className="text-stone-400">/</span>
                      <span className="text-stone-600">{fc.minTemp}°</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
