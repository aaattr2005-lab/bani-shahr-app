import React, { useState } from "react";
import { FOOD_SELLERS_DATA, FOOD_ITEMS_DATA } from "../data/baniShahrData";
import { FoodItem, FoodSeller, CartItem } from "../types";
import { DataStore } from "../lib/datastore";
import { 
  Utensils, 
  ShoppingBag, 
  Star, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Plus, 
  Check, 
  Search,
  Sparkles,
  Info,
  Layers,
  Store,
  MessageSquare,
  Truck,
  ChefHat,
  ChevronRight,
  Shield,
  Lock,
  PhoneOff
} from "lucide-react";

interface ProductiveFamiliesSectionProps {
  onAddToCart: (item: FoodItem) => void;
  cartItems: CartItem[];
  onOpenCart: () => void;
  onOpenChatWithSeller?: (seller: FoodSeller) => void;
  onOpenSellerRegister?: () => void;
}

export const ProductiveFamiliesSection: React.FC<ProductiveFamiliesSectionProps> = ({
  onAddToCart,
  cartItems,
  onOpenCart,
  onOpenChatWithSeller,
  onOpenSellerRegister,
}) => {
  const [activeTab, setActiveTab] = useState<"dishes" | "sellers">("dishes");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedItemForDetails, setSelectedItemForDetails] = useState<FoodItem | null>(null);
  const [addedItemEffect, setAddedItemEffect] = useState<string | null>(null);

  // Load custom sellers from DataStore if any
  const allSellers = DataStore.getSellers();
  const allFoodItems = DataStore.getFoodItems();

  const categories = [
    { id: "all", label: "كافة الأطباق والمنتجات" },
    { id: "مأكولات شعبية رئيسية", label: "أكلات شعبية رئيسية (عريكة، عصيدة، حنيذ، دغابيس)" },
    { id: "عسل وسمن شهري", label: "عسل وسمن شهري بلدي" },
    { id: "مخبوزات وحلويات", label: "مخبوزات الميفا والتنور والحنيني" },
    { id: "مشروبات وبهارات", label: "قهوة قشر وبن ورضيفة" },
  ];

  const filteredItems = allFoodItems.filter((item) => {
    const categoryMatch = selectedCategory === "all" || item.category === selectedCategory;
    const seller = allSellers.find((s) => s.id === item.sellerId);
    const cityMatch = selectedCity === "all" || (seller && seller.city === selectedCity);
    const searchMatch = 
      !searchQuery.trim() || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sellerName.toLowerCase().includes(searchQuery.toLowerCase());

    return categoryMatch && cityMatch && searchMatch;
  });

  const filteredSellers = allSellers.filter((seller) => {
    const cityMatch = selectedCity === "all" || seller.city === selectedCity;
    const searchMatch =
      !searchQuery.trim() ||
      seller.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.specialty.toLowerCase().includes(searchQuery.toLowerCase());

    return cityMatch && searchMatch;
  });

  const handleAddItem = (item: FoodItem) => {
    onAddToCart(item);
    setAddedItemEffect(item.id);
    setTimeout(() => {
      setAddedItemEffect(null);
    }, 1200);
  };

  const getItemQuantityInCart = (itemId: string) => {
    const found = cartItems.find((c) => c.item.id === itemId);
    return found ? found.quantity : 0;
  };

  return (
    <section id="productive-families" className="py-10 sm:py-20 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full max-w-full overflow-hidden scroll-mt-20 sm:scroll-mt-24">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3 sm:mb-4 shadow-inner">
          <Utensils className="w-3.5 h-3.5 text-amber-400" />
          <span>المطبخ الشهري والأسر المنتجة</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-bold text-[#12201A] font-['Amiri'] tracking-wide">
          مذاق بني شهر وسوق الأسر المنتجة
        </h2>

        <p className="mt-2 sm:mt-3 text-[#5A524C] text-xs sm:text-base leading-relaxed px-2">
          اطلب أشهى المأكولات التراثية المحضرة بأيدي أمهات وبائعي بني شهر: العريكة الملكية بالسمن والعسل، العصيدة بالمرق، الحنيذ، الدغابيس، خبز الميفا والتنور، وعسل السدر النقي مع التوصيل الآمن والدفع الإلكتروني المباشر.
        </p>

        {/* Action Buttons: Register Seller & View Cart */}
        <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {onOpenSellerRegister && (
            <button
              onClick={onOpenSellerRegister}
              className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white text-xs font-bold shadow-md shadow-amber-950 flex items-center gap-1.5 sm:gap-2 transition-all"
            >
              <ChefHat className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>تسجيل كـ أسرة منتجة / متجر</span>
            </button>
          )}

          {cartItems.length > 0 && (
            <button
              onClick={onOpenCart}
              className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-950 flex items-center gap-1.5 sm:gap-2 transition-all"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>سلة المشتريات ({cartItems.reduce((acc, c) => acc + c.quantity, 0)})</span>
            </button>
          )}
        </div>

        {/* View Mode Toggle: Dishes vs Sellers */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center p-1 bg-white rounded-2xl border border-[#E6DEC8] w-full sm:w-auto mx-auto gap-1 shadow-sm">
          <button
            onClick={() => setActiveTab("dishes")}
            className={`w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === "dishes"
                ? "bg-amber-700 text-white shadow-sm"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>قائمة الأطباق والمذاق ({allFoodItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("sellers")}
            className={`w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === "sellers"
                ? "bg-amber-700 text-white shadow-sm"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>دليل الأسر المنتجة والمتاجر ({allSellers.length})</span>
          </button>
        </div>

        {/* Search & City Filter Bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن أكلة، عسل، خبز ميفا، أو اسم متجر..."
              className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-white border border-[#E6DEC8] text-stone-800 text-xs placeholder:text-stone-400 focus:outline-none focus:border-amber-600 transition-all shadow-sm"
            />
          </div>

          {/* City Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 p-1 bg-white rounded-2xl border border-[#E6DEC8] w-full sm:w-auto shadow-sm">
            {[
              { id: "all", label: "كل المحافظات" },
              { id: "تنومة", label: "تنومة" },
              { id: "النماص", label: "النماص" },
              { id: "المجاردة", label: "المجاردة" },
            ].map((city) => (
              <button
                key={city.id}
                onClick={() => setSelectedCity(city.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedCity === city.id
                    ? "bg-amber-700 text-white font-bold shadow-sm"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                {city.label}
              </button>
            ))}
          </div>

        </div>

        {/* Category Tabs (if in dishes mode) */}
        {activeTab === "dishes" && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedCategory === cat.id
                    ? "bg-emerald-800 text-white shadow-sm font-bold"
                    : "bg-white border border-[#E6DEC8] text-stone-600 hover:text-stone-900"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

      </div>

      {/* VIEW 1: FOOD ITEMS GRID (2 columns on mobile, 3 on md, 4 on xl) */}
      {activeTab === "dishes" && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-5">
          {filteredItems.map((item) => {
            const inCartQty = getItemQuantityInCart(item.id);
            const isJustAdded = addedItemEffect === item.id;
            const seller = allSellers.find((s) => s.id === item.sellerId);

            return (
              <div
                key={item.id}
                className="group relative bg-white rounded-2xl sm:rounded-3xl border border-[#E6DEC8] hover:border-amber-600/40 transition-all duration-300 shadow-sm hover:shadow-lg flex flex-col justify-between overflow-hidden hover:-translate-y-1"
              >
                {/* Image & Badges */}
                <div className="relative aspect-[4/3] sm:h-44 w-full overflow-hidden bg-stone-100">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-all duration-300"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 opacity-80" />

                  {/* Preparation Time */}
                  <div className="absolute top-1.5 sm:top-2.5 left-1.5 sm:left-2.5 px-1.5 sm:px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-[9px] sm:text-[10px] font-medium text-stone-200 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 text-amber-400" />
                    <span>{item.preparationTime}</span>
                  </div>

                  {/* Seller Name Tag */}
                  <div className="absolute bottom-1.5 sm:bottom-2.5 right-1.5 sm:right-2.5 px-1.5 sm:px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-[9px] sm:text-[11px] font-bold text-amber-300 flex items-center gap-1 max-w-[90%] truncate">
                    <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">{item.sellerName}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs sm:text-base font-bold text-[#12201A] font-['Amiri'] group-hover:text-amber-800 transition-colors line-clamp-1">
                      {item.name}
                    </h3>

                    <p className="text-[10px] sm:text-xs text-[#5A524C] mt-1 line-clamp-1 sm:line-clamp-2 leading-tight sm:leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-1.5 flex items-center justify-between text-[9px] sm:text-[11px] text-stone-500">
                      <span className="truncate">{item.portion}</span>
                    </div>
                  </div>

                  {/* Price and Action Buttons */}
                  <div className="mt-2.5 pt-2 border-t border-[#E6DEC8] flex items-center justify-between gap-1 sm:gap-2">
                    <div>
                      <div className="flex items-baseline gap-0.5 sm:gap-1">
                        <span className="text-sm sm:text-lg font-bold text-amber-800 font-['Amiri']">{item.price}</span>
                        <span className="text-[9px] sm:text-[10px] text-stone-500">ر.س</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSelectedItemForDetails(item)}
                        title="تفاصيل المكونات"
                        className="p-1.5 rounded-lg bg-[#F8F4EA] border border-[#E6DEC8] text-stone-600 hover:text-stone-900 transition-all hidden sm:block"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>

                      {seller && onOpenChatWithSeller && (
                        <button
                          onClick={() => onOpenChatWithSeller(seller)}
                          title="محادثة آمنة مع البائع"
                          className="p-1.5 rounded-lg bg-[#F8F4EA] border border-[#E6DEC8] text-amber-800 hover:text-amber-900 transition-all hidden sm:block"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => handleAddItem(item)}
                        className={`px-2 sm:px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all flex items-center gap-1 shadow-sm shrink-0 ${
                          isJustAdded
                            ? "bg-emerald-700 text-white"
                            : inCartQty > 0
                            ? "bg-amber-700 text-white"
                            : "bg-emerald-800 text-white hover:bg-emerald-700 active:scale-95"
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span className="hidden sm:inline">أُضيف</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3" />
                            <span>{inCartQty > 0 ? inCartQty : "طلب"}</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: SELLERS DIRECTORY (2 cols on mobile, 3 on md) */}
      {activeTab === "sellers" && (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
          {filteredSellers.map((seller) => {
            const sellerDishes = allFoodItems.filter((f) => f.sellerId === seller.id);

            return (
              <div
                key={seller.id}
                className="bg-white rounded-2xl sm:rounded-3xl border border-[#E6DEC8] hover:border-amber-600/40 transition-all shadow-sm hover:shadow-lg overflow-hidden flex flex-col justify-between"
              >
                {/* Banner & Avatar */}
                <div className="relative h-20 sm:h-32 bg-stone-200">
                  <img
                    src={seller.bannerUrl}
                    alt={seller.storeName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/35" />
                  
                  {/* City Badge */}
                  <div className="absolute top-1.5 sm:top-3 left-1.5 sm:left-3 px-1.5 sm:px-2.5 py-0.5 rounded-lg sm:rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-[9px] sm:text-[10px] font-bold text-amber-300 flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5 text-amber-400" />
                    <span>{seller.city}</span>
                  </div>

                  {/* Avatar */}
                  <div className="absolute -bottom-4 sm:-bottom-6 right-2.5 sm:right-4 w-9 h-9 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl border-2 border-white overflow-hidden shadow-md bg-stone-100">
                    <img
                      src={seller.avatarUrl}
                      alt={seller.storeName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Seller Info */}
                <div className="p-2.5 sm:p-5 pt-5 sm:pt-8 flex-1 flex flex-col justify-between space-y-2 sm:space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-xs sm:text-base font-bold text-[#12201A] font-['Amiri'] truncate">
                        {seller.storeName}
                      </h3>
                      <div className="flex items-center gap-0.5 text-amber-700 text-[10px] sm:text-xs font-bold shrink-0">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{seller.rating}</span>
                      </div>
                    </div>

                    <p className="text-[10px] sm:text-xs text-emerald-800 font-medium mt-0.5 truncate">
                      بإشراف: {seller.ownerName}
                    </p>

                    <p className="text-[10px] sm:text-xs text-[#5A524C] mt-1 line-clamp-1 sm:line-clamp-2 leading-tight sm:leading-relaxed">
                      {seller.specialty}
                    </p>

                    <div className="mt-2 p-1.5 sm:p-2.5 rounded-xl bg-[#F8F4EA] border border-[#E6DEC8] text-[9px] sm:text-[11px] text-stone-700 space-y-0.5 sm:space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500">الموقع:</span>
                        <span className="font-semibold text-stone-800 truncate">{seller.district}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500">التوصيل:</span>
                        <span className="font-semibold text-amber-800">
                          {seller.deliveryAvailable ? `${seller.deliveryFee} ر.س` : "استلام ذاتي"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-[#E6DEC8] flex items-center justify-between gap-1 sm:gap-2">
                    <button
                      onClick={() => {
                        setSearchQuery(seller.storeName);
                        setActiveTab("dishes");
                      }}
                      className="flex-1 py-1.5 sm:py-2 rounded-xl bg-[#F8F4EA] hover:bg-stone-100 text-stone-700 text-[10px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 border border-[#E6DEC8]"
                    >
                      <Utensils className="w-3 h-3 text-amber-700" />
                      <span>الأصناف ({sellerDishes.length})</span>
                    </button>

                    {onOpenChatWithSeller && (
                      <button
                        onClick={() => onOpenChatWithSeller(seller)}
                        className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-[10px] sm:text-xs font-bold transition-all flex items-center gap-1 shadow-sm shrink-0"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span className="hidden sm:inline">محادثة</span>
                      </button>
                    )}
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Product Details Modal */}
      {selectedItemForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white border border-[#E6DEC8] rounded-3xl p-6 shadow-2xl space-y-4">
            
            <div className="relative rounded-2xl overflow-hidden h-48">
              <img 
                src={selectedItemForDetails.imageUrl} 
                alt={selectedItemForDetails.name} 
                className="w-full h-full object-cover" 
              />
              <button
                onClick={() => setSelectedItemForDetails(null)}
                className="absolute top-3 left-3 p-1.5 rounded-full bg-black/70 text-white hover:bg-black/90"
              >
                ✕
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#12201A] font-['Amiri']">{selectedItemForDetails.name}</h3>
                <span className="text-lg font-bold text-amber-800">{selectedItemForDetails.price} ر.س</span>
              </div>
              <p className="text-xs text-emerald-800 mt-1">بإعداد: {selectedItemForDetails.sellerName}</p>
              <p className="text-xs text-[#5A524C] mt-3 leading-relaxed">{selectedItemForDetails.description}</p>
            </div>

            {/* Ingredients */}
            <div className="p-3 rounded-2xl bg-[#F8F4EA] border border-[#E6DEC8]">
              <span className="text-xs font-bold text-stone-800 block mb-2">المكونات الطبيعية والتراثية:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedItemForDetails.ingredients.map((ing, i) => (
                  <span key={i} className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-[#E6DEC8] text-stone-700">
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-stone-500">حجم الوجبة: {selectedItemForDetails.portion}</span>
              <button
                onClick={() => {
                  handleAddItem(selectedItemForDetails);
                  setSelectedItemForDetails(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة إلى السلة ({selectedItemForDetails.price} ر.س)</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
