import React, { useState } from "react";
import { TourGuide, GuideBooking } from "../types";
import { DataStore } from "../lib/datastore";
import { 
  X, 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  CreditCard,
  Sparkles,
  Phone
} from "lucide-react";

interface GuideBookingModalProps {
  guide: TourGuide | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingComplete: (booking: GuideBooking) => void;
}

export const GuideBookingModal: React.FC<GuideBookingModalProps> = ({
  guide,
  isOpen,
  onClose,
  onBookingComplete,
}) => {
  const currentUser = DataStore.getCurrentUser();
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [timeSlot, setTimeSlot] = useState("06:30 صباحاً - 11:30 صباحاً (الفترة الصباحية)");
  const [guestsCount, setGuestsCount] = useState(2);
  const [destination, setDestination] = useState("جولة استكشافية في جبل منعاء وشلال الدهناء");
  const [notes, setNotes] = useState("");
  const [userName, setUserName] = useState(currentUser.name || "");
  const [userPhone, setUserPhone] = useState(currentUser.phone || "05");
  const [paymentMethod, setPaymentMethod] = useState<GuideBooking["paymentMethod"]>("apple_pay");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<GuideBooking | null>(null);

  if (!isOpen || !guide) return null;

  const calculateTotalPrice = () => {
    // Base day rate + small group multiplier if > 4 guests
    let base = guide.dayRate;
    if (guestsCount > 4) {
      base += (guestsCount - 4) * 50;
    }
    return base;
  };

  const totalPrice = calculateTotalPrice();

  const handleConfirmAndPay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userPhone.trim()) {
      alert("يرجى إدخال اسمك ورقم الجوال للتواصل");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const newBooking: GuideBooking = {
        id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
        guideId: guide.id,
        guideName: guide.name,
        userId: currentUser.id,
        userName,
        userPhone,
        date,
        timeSlot,
        numberOfGuests: guestsCount,
        destination,
        notes,
        totalPrice,
        status: "confirmed",
        paymentStatus: "paid",
        paymentMethod,
        createdAt: new Date().toISOString(),
      };

      DataStore.saveBooking(newBooking);
      setConfirmedBooking(newBooking);
      setIsProcessing(false);
      setIsSuccess(true);
      onBookingComplete(newBooking);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-700/80 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-emerald-950 via-stone-900 to-stone-900 p-6 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src={guide.avatarUrl} 
              alt={guide.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-lg" 
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white font-['Amiri']">{guide.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  مرخص
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">{guide.title}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!isSuccess ? (
          <form onSubmit={handleConfirmAndPay} className="p-6 space-y-6">
            
            {/* Guide Info Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-stone-950/60 border border-stone-800 text-xs">
              <div className="text-center">
                <span className="text-stone-400 block">المنطقة</span>
                <span className="font-bold text-emerald-400">{guide.city}</span>
              </div>
              <div className="text-center border-r border-stone-800">
                <span className="text-stone-400 block">سعر اليوم</span>
                <span className="font-bold text-amber-400">{guide.dayRate} ر.س</span>
              </div>
              <div className="text-center border-r border-stone-800">
                <span className="text-stone-400 block">التقييم</span>
                <span className="font-bold text-stone-200">★ {guide.rating} ({guide.reviewsCount})</span>
              </div>
              <div className="text-center border-r border-stone-800">
                <span className="text-stone-400 block">الرحلات</span>
                <span className="font-bold text-teal-400">{guide.totalTripsCompleted}+ رحلة</span>
              </div>
            </div>

            {/* Booking Details Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  تاريخ الرحلة المطلوب
                </label>
                <input 
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  الفترة الزمنية
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white text-sm focus:border-emerald-500 focus:outline-none"
                >
                  <option value="06:30 صباحاً - 11:30 صباحاً (الفترة الصباحية)">06:30 ص - 11:30 ص (صباحية للهايكنج)</option>
                  <option value="03:30 عصراً - 07:30 مساءً (فترة العصر والغروب)">03:30 م - 07:30 م (عصر وغروب الضباب)</option>
                  <option value="يوم كامل (08:00 صباحاً - 06:00 مساءً)">يوم كامل (08:00 ص - 06:00 م)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  عدد الزوار / الأفراد
                </label>
                <div className="flex items-center gap-3">
                  <input 
                    type="number"
                    min="1"
                    max="20"
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                  <span className="text-xs text-stone-400 whitespace-nowrap">أشخاص</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  الوجهة أو المسار المفضل
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white text-sm focus:border-emerald-500 focus:outline-none"
                >
                  <option value="جولة استكشافية في جبل منعاء وشلال الدهناء">جبل منعاء وشلال الدهناء (تنومة)</option>
                  <option value="قصر المقر والقرية التراثية وحصون النماص">قصر المقر والقرية التراثية (النماص)</option>
                  <option value="مسار شعف آل وليد ومطلات السحاب">شعف آل وليد ومطلات السحاب</option>
                  <option value="أودية وادي خاط وجبال ثربان الشتوية">وادي خاط وجبال ثربان (المجاردة)</option>
                  <option value="جولة مخصصة حسب اقتراح المرشد">جولة مخصصة حسب اقتراح المرشد</option>
                </select>
              </div>

            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-800">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  اسم العميل / الحاجز
                </label>
                <input 
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="مثال: فهد بن سعيد الشهري"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  رقم الجوال للتواصل وتأكيد الحجز
                </label>
                <input 
                  type="tel"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  placeholder="05XXXXXXXX"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                ملاحظات أو متطلبات خاصة (أطفال، معدات، لغة، إلخ)
              </label>
              <textarea 
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أضف أي تفاصيل أو تفضيلات تود إبلاغ المرشد بها..."
                className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Payment Method Selection */}
            <div className="pt-2 border-t border-stone-800">
              <label className="block text-xs font-medium text-stone-300 mb-2.5 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                طريقة الدفع المعتمدة (تأكيد ودفع فوري آمن)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: "apple_pay", name: "Apple Pay" },
                  { id: "mada", name: "بطاقة مدى Mada" },
                  { id: "visa", name: "Visa / Master" },
                  { id: "stc_pay", name: "STC Pay" },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all text-center flex items-center justify-center gap-1.5 ${
                      paymentMethod === pm.id
                        ? "bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-950"
                        : "bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700"
                    }`}
                  >
                    <span>{pm.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Total Summary & Confirm Button */}
            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-stone-400 block">إجمالي تكلفة الإرشاد والرحلة</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold text-amber-400 font-['Amiri']">{totalPrice}</span>
                  <span className="text-xs text-stone-400">ريال سعودي (شامل الضريبة)</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-sm shadow-xl shadow-emerald-950 hover:from-emerald-500 hover:to-teal-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>جاري معالجة الدفع والحجز...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>تأكيد الحجز والدفع ({totalPrice} ر.س)</span>
                  </>
                )}
              </button>
            </div>

          </form>
        ) : (
          /* Success Screen */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white font-['Amiri']">تم تأكيد حجزك بنجاح!</h3>
              <p className="text-sm text-stone-300 mt-1">
                رقم الحجز: <span className="font-mono text-amber-400 font-bold">{confirmedBooking?.id}</span>
              </p>
              <p className="text-xs text-stone-400 mt-2 max-w-md mx-auto">
                تم إرسال إشعار فوري إلى المرشد <strong className="text-emerald-300">{guide.name}</strong> وسيتم التواصل معك عبر الواتساب على الرقم ({confirmedBooking?.userPhone}).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 text-xs text-stone-300 space-y-2 text-right max-w-md mx-auto">
              <div className="flex justify-between border-b border-stone-800 pb-1.5">
                <span className="text-stone-400">المرشد:</span>
                <span className="font-bold text-white">{guide.name}</span>
              </div>
              <div className="flex justify-between border-b border-stone-800 pb-1.5">
                <span className="text-stone-400">التاريخ:</span>
                <span className="font-bold text-white">{confirmedBooking?.date}</span>
              </div>
              <div className="flex justify-between border-b border-stone-800 pb-1.5">
                <span className="text-stone-400">الفترة:</span>
                <span className="font-bold text-white">{confirmedBooking?.timeSlot}</span>
              </div>
              <div className="flex justify-between border-b border-stone-800 pb-1.5">
                <span className="text-stone-400">عدد الأفراد:</span>
                <span className="font-bold text-white">{confirmedBooking?.numberOfGuests} أشخاص</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">حالة الدفع:</span>
                <span className="font-bold text-emerald-400">مدفوع ({confirmedBooking?.totalPrice} ر.س)</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3 rounded-xl bg-stone-800 text-white font-medium text-sm hover:bg-stone-700 transition-all"
            >
              إغلاق ومتابعة الاستكشاف
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
