import React, { useState } from "react";
import { TribeNewsEvent, UserProfile } from "../../../types";
import { DataStore, generateUniqueId } from "../../../lib/datastore";
import {
  Calendar,
  Plus,
  Search,
  Pin,
  MapPin,
  Eye,
  Trash2,
  Image as ImageIcon,
  Sparkles,
  Tag,
  CheckCircle2,
  Clock
} from "lucide-react";

interface NewsAndEventsTabProps {
  currentUser: UserProfile;
  onNotification: (msg: string) => void;
}

export const NewsAndEventsTab: React.FC<NewsAndEventsTabProps> = ({
  currentUser,
  onNotification
}) => {
  const [newsList, setNewsList] = useState<TribeNewsEvent[]>(() => DataStore.getTribeNews());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<TribeNewsEvent["category"]>("أخبار رسمية");
  const [tribeName, setTribeName] = useState("كافة قبائل بني شهر");
  const [location, setLocation] = useState("النماص وتنومة");
  const [eventDate, setEventDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPinned, setIsPinned] = useState(false);

  const filtered = newsList.filter(n => {
    const matchSearch = n.title.includes(searchTerm) || n.summary.includes(searchTerm) || n.tribeName.includes(searchTerm);
    const matchCategory = selectedCategory === "all" || n.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const handleAddNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !summary) return;

    const newNews: TribeNewsEvent = {
      id: generateUniqueId("NEWS"),
      title,
      summary,
      content: content || summary,
      category,
      tribeId: tribeName.includes("كافة") ? "all" : "specific-tribe",
      tribeName,
      location,
      eventDate: eventDate || new Date().toISOString().split("T")[0],
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80",
      authorId: currentUser.id,
      authorName: currentUser.name,
      isPinned,
      isPublished: true,
      viewsCount: 1,
      createdAt: new Date().toISOString()
    };

    DataStore.saveTribeNews(newNews);
    setNewsList(DataStore.getTribeNews());
    setShowAddModal(false);
    setTitle("");
    setSummary("");
    setContent("");
    setImageUrl("");
    onNotification(`تم نشر [${newNews.title}] بنجاح`);
  };

  const handleDeleteNews = (id: string, title: string) => {
    if (confirm(`هل أنت متأكد من حذف الخبر: ${title}؟`)) {
      DataStore.deleteTribeNews(id);
      setNewsList(DataStore.getTribeNews());
      onNotification(`تم حذف الخبر بنجاح`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-stone-950/70 border border-stone-800">
        <div>
          <h3 className="text-base font-bold text-white font-['Amiri'] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <span>إدارة الأخبار الرسمية والمناسبات والفعاليات القبلية</span>
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            نشر أخبار الشمل، أفراح وأعراس القبائل، ملتقيات التراث، وتكريم المتفوقين
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>نشر خبر أو مناسبة جديدة</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="البحث في الأخبار والفعاليات والمناسبات..."
            className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-stone-900 border border-stone-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-2xl border border-stone-800 text-xs">
          {["all", "أخبار رسمية", "مناسبات وأعراس", "فعاليات وملتقيات"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                selectedCategory === cat ? "bg-emerald-600 text-white" : "text-stone-400 hover:text-white"
              }`}
            >
              {cat === "all" ? "الكل" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(item => (
          <div
            key={item.id}
            className="bg-stone-900/80 border border-stone-800 rounded-3xl overflow-hidden hover:border-stone-700 transition-all flex flex-col justify-between"
          >
            {item.imageUrl && (
              <div className="relative h-44 w-full bg-stone-950 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {item.isPinned && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/90 text-stone-950 flex items-center gap-1 shadow-md">
                    <Pin className="w-3 h-3" /> مثبت بالأعلى
                  </span>
                )}
                <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-stone-950/80 backdrop-blur-sm text-emerald-300 border border-stone-700">
                  {item.category}
                </span>
              </div>
            )}

            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5 text-[11px] text-stone-400">
                  <span className="text-emerald-400 font-bold">{item.tribeName}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.location}</span>
                </div>

                <h4 className="text-base font-bold text-white font-['Amiri'] leading-snug">
                  {item.title}
                </h4>
                <p className="text-xs text-stone-300 mt-2 leading-relaxed line-clamp-2">
                  {item.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-stone-500" /> {item.eventDate || "مستمر"}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <Eye className="w-3.5 h-3.5 text-stone-500" /> {item.viewsCount} مشاهدة
                  </span>
                </div>

                <button
                  onClick={() => handleDeleteNews(item.id, item.title)}
                  className="p-1.5 text-stone-500 hover:text-rose-400 rounded-lg"
                  title="حذف الخبر"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD NEWS MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-stone-900 border border-stone-700 rounded-3xl p-6 shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <h4 className="text-base font-bold text-white font-['Amiri'] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <span>نشر خبر أو مناسبة قبلية جديدة</span>
            </h4>

            <form onSubmit={handleAddNews} className="space-y-3">
              <div>
                <label className="block text-stone-300 mb-1 font-medium">عنوان الخبر / المناسبة</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: حفل تكريم حفظة القرآن الكريم..."
                  className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">التصنيف</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white"
                  >
                    <option value="أخبار رسمية">أخبار رسمية</option>
                    <option value="مناسبات وأعراس">مناسبات وأعراس</option>
                    <option value="فعاليات وملتقيات">فعاليات وملتقيات</option>
                    <option value="إعلانات عامة">إعلانات عامة</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 mb-1 font-medium">نطاق القبيلة</label>
                  <input
                    type="text"
                    value={tribeName}
                    onChange={(e) => setTribeName(e.target.value)}
                    placeholder="كافة قبائل بني شهر أو اسم قبيلة"
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">الموقع / القاعة</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="النماص - قاعة الشلال"
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">تاريخ الفعالية</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-medium">رابط الصورة المميزة (URL)</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-medium">الملخص الموجز</label>
                <textarea
                  rows={2}
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="نبذة سريعة تظهر في شريط الأخبار..."
                  className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pinCheck"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded border-stone-700 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="pinCheck" className="text-stone-300 text-xs cursor-pointer">
                  تثبيت الخبر في أعلى الشاشة الرئيسية
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  نشر الآن
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
