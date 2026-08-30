import React, { useState } from "react";
import {
  X,
  Store,
  ChefHat,
  MapPin,
  Clock,
  Phone,
  Truck,
  Upload,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Plus,
  Trash2,
  ShoppingBag
} from "lucide-react";
import { FoodSeller, FoodItem } from "../types";
import { DataStore } from "../lib/datastore";

interface SellerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegistered?: (newSeller: FoodSeller) => void;
}

export const SellerRegistrationModal: React.FC<SellerRegistrationModalProps> = ({
  isOpen,
  onClose,
  onRegistered,
}) => {
  const currentUser = DataStore.getCurrentUser();
  const [storeName, setStoreName] = useState("");
  const [ownerName, setOwnerName] = useState(currentUser.name || "");
  const [city, setCity] = useState<"النماص" | "تنومة" | "المجاردة" | "السراة" | "تهامة">("النماص");
  const [district, setDistrict] = useState("");
  const [phone, setPhone] = useState(currentUser.phone || "");
  const [specialty, setSpecialty] = useState("");
  const [minOrder, setMinOrder] = useState<number>(50);
  const [deliveryFee, setDeliveryFee] = useState<number>(15);
  const [deliveryAvailable, setDeliveryAvailable] = useState<boolean>(true);
  const [pickupAvailable, setPickupAvailable] = useState<boolean>(true);
  const [workingHours, setWorkingHours] = useState<string>("من 12:00 ظهراً حتى 10:00 مساءً");

  // Initial dishes
  const [initialDishes, setInitialDishes] = useState<Array<{ name: string; price: number; category: string; desc: string }>>([
    { name: "عريكة جنوبية بالسمن والعسل", price: 85, category: "مأكولات شعبية رئيسية", desc: "طحين بر وسمن ورضيفة وعسل سدر شهري فاخر" }
  ]);

  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleAddDishRow = () => {
    setInitialDishes([...initialDishes, { name: "", price: 50, category: "مأكولات شعبية رئيسية", desc: "" }]);
  };

  const handleRemoveDishRow = (index: number) => {
    setInitialDishes(initialDishes.filter((_, i) => i !== index));
  };

  const handleDishChange = (index: number, field: string, value: any) => {
    const updated = [...initialDishes];
    updated[index] = { ...updated[index], [field]: value };
    setInitialDishes(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim() || !ownerName.trim()) return;

    const sellerId = "seller-" + Date.now().toString().slice(-6);

    const newSeller: FoodSeller = {
      id: sellerId,
      storeName: storeName.trim(),
      ownerName: ownerName.trim(),
      city,
      district: district.trim() || `حي المركز، ${city}`,
      rating: 5.0,
      reviewsCount: 1,
      specialty: specialty.trim() || "مأكولات شعبية جنوبية ومخبوزات وسمن وعسل شهري",
      avatarUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
      phone: phone.trim(),
      isVerified: true,
      deliveryAvailable,
      deliveryOrPickup: deliveryAvailable && pickupAvailable ? "both" : deliveryAvailable ? "delivery" : "pickup",
      minOrder,
      deliveryFee,
      workingHours,
    };

    // Save seller in DataStore
    DataStore.saveSeller(newSeller);

    // Save initial dishes if provided
    initialDishes.forEach((dish, idx) => {
      if (dish.name.trim()) {
        const item: FoodItem = {
          id: `food-${sellerId}-${idx + 1}`,
          sellerId,
          sellerName: newSeller.storeName,
          name: dish.name.trim(),
          description: dish.desc.trim() || "طبق شعبي طازج محضر بكل عناية بمكونات بلدية أصيلة",
          price: Number(dish.price) || 50,
          category: dish.category as any,
          preparationTime: "30 إلى 45 دقيقة",
          imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
          isAvailable: true,
          ingredients: ["مكونات بلدية طازجة", "سمن بلدي", "عسل شهري"],
          tags: [dish.name, "أسر منتجة", "بني شهر"],
          portion: "تكفي 2 إلى 3 أشخاص",
        };
        DataStore.saveFoodItem(item);
      }
    });

    // Log action
    DataStore.logAction({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: "food_seller",
      actionType: "CREATE",
      targetModule: "SELLERS",
      details: `تسجيل أسرة منتجة جديدة: ${newSeller.storeName} (${newSeller.city})`,
    });

    setIsSuccess(true);
    if (onRegistered) onRegistered(newSeller);

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl max-h-[90vh] bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-stone-100">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-['Amiri']">
                تسجيل أسرة منتجة / متجر أكلات شعبية
              </h3>
              <p className="text-xs text-stone-400">
                انضمي لمنصة بني شهر لتقديم أشهى الأطباق التراثية لزوار وأهالي السراة وتهامة
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {isSuccess ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-white font-['Amiri']">
                تم اعتماد وتسجيل المتجر بنجاح!
              </h4>
              <p className="text-xs text-stone-300 max-w-md mx-auto leading-relaxed">
                مرحباً بك في منصة بني شهر. أصبح متجرك وقائمتك جاهزة لاستقبال الطلبات والتواصل الآمن مع العملاء.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Store General Info */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Store className="w-4 h-4" />
                  <span>بيانات المتجر والأسرة المنتجة</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-stone-300 mb-1 font-semibold">اسم المتجر / المطبخ:</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: مطبخ أم عبد العزيز - المذاق الشهري"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-stone-300 mb-1 font-semibold">اسم صاحب/ة المتجر:</label>
                    <input
                      type="text"
                      required
                      placeholder="الاسم الكريم"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-stone-300 mb-1 font-semibold">المدينة / المحافظة:</label>
                    <select
                      value={city}
                      onChange={(e: any) => setCity(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                    >
                      <option value="النماص">النماص</option>
                      <option value="تنومة">تنومة</option>
                      <option value="المجاردة">المجاردة</option>
                      <option value="السراة">السراة</option>
                      <option value="تهامة">تهامة</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs text-stone-300 mb-1 font-semibold">الحي / موقع التسليم:</label>
                    <input
                      type="text"
                      placeholder="مثال: حي الشرف، بالقرب من المنتزه التراثي"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-stone-300 mb-1 font-semibold">التخصص وأبرز الأصناف:</label>
                  <input
                    type="text"
                    placeholder="مثال: عريكة ملكية، عصيدة بالمرق، دغابيس، خبز تنور وميفا، سمن وعسل"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Delivery & Order Settings */}
              <div className="pt-3 border-t border-stone-800/80 space-y-3">
                <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Truck className="w-4 h-4" />
                  <span>خيارات التوصيل والاستلام</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-stone-300 mb-1 font-semibold">الحد الأدنى للطلب (ريال):</label>
                    <input
                      type="number"
                      min={0}
                      value={minOrder}
                      onChange={(e) => setMinOrder(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-stone-300 mb-1 font-semibold">رسوم التوصيل (ريال):</label>
                    <input
                      type="number"
                      min={0}
                      value={deliveryFee}
                      onChange={(e) => setDeliveryFee(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-stone-300 mb-1 font-semibold">أوقات العمل واستقبال الطلبات:</label>
                    <input
                      type="text"
                      value={workingHours}
                      onChange={(e) => setWorkingHours(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={deliveryAvailable}
                      onChange={(e) => setDeliveryAvailable(e.target.checked)}
                      className="rounded accent-amber-500 w-4 h-4"
                    />
                    <span>توفير خدمة التوصيل لمقر العميل</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pickupAvailable}
                      onChange={(e) => setPickupAvailable(e.target.checked)}
                      className="rounded accent-amber-500 w-4 h-4"
                    />
                    <span>إتاحة الاستلام الذاتي من موقع المطبخ</span>
                  </label>
                </div>
              </div>

              {/* Initial Menu Items */}
              <div className="pt-3 border-t border-stone-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4" />
                    <span>إضافة أولى أطباق القائمة (المنيو)</span>
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddDishRow}
                    className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1 font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة صنف آخر</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {initialDishes.map((dish, i) => (
                    <div key={i} className="p-3 rounded-2xl bg-stone-950 border border-stone-800/80 space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          required
                          placeholder="اسم الصنف (مثل: عريكة ملكية)"
                          value={dish.name}
                          onChange={(e) => handleDishChange(i, "name", e.target.value)}
                          className="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-100 placeholder-stone-500"
                        />
                        <input
                          type="number"
                          required
                          min={1}
                          placeholder="السعر (ريال)"
                          value={dish.price}
                          onChange={(e) => handleDishChange(i, "price", e.target.value)}
                          className="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-100 placeholder-stone-500"
                        />
                        <div className="flex items-center gap-2">
                          <select
                            value={dish.category}
                            onChange={(e) => handleDishChange(i, "category", e.target.value)}
                            className="flex-1 px-2 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200"
                          >
                            <option value="مأكولات شعبية رئيسية">مأكولات شعبية</option>
                            <option value="مخبوزات وحلويات">مخبوزات وحلويات</option>
                            <option value="عسل وسمن شهري">عسل وسمن</option>
                            <option value="مشروبات وبهارات">مشروبات وبهارات</option>
                          </select>
                          {initialDishes.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveDishRow(i)}
                              className="p-1.5 rounded-lg bg-red-950/60 text-red-400 hover:bg-red-900"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                      <input
                        type="text"
                        placeholder="وصف مختصر ومكونات الطبق (اختياري)..."
                        value={dish.desc}
                        onChange={(e) => handleDishChange(i, "desc", e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-300 placeholder-stone-600"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-stone-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>حماية المدفوعات والضمان عبر المنصة</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-semibold hover:bg-stone-700"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-amber-950"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تأكيد اعتماد المتجر</span>
                  </button>
                </div>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
