import React from "react";
import { CartItem, FoodItem } from "../types";
import { 
  ShoppingBag, 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  ShieldCheck, 
  CreditCard 
} from "lucide-react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);
  const deliveryFee = cartItems.length > 0 ? 15 : 0;
  const tax = subtotal * 0.15;
  const grandTotal = subtotal + deliveryFee + tax;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm transition-opacity" 
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-stone-900 border-r border-stone-800 shadow-2xl flex flex-col justify-between">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-stone-800 flex items-center justify-between bg-gradient-to-r from-stone-900 via-stone-900 to-emerald-950/40">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-['Amiri']">سلة المأكولات التراثية</h3>
                <span className="text-xs text-stone-400">
                  {cartItems.length} {cartItems.length === 1 ? "صنف" : "أصناف"} مختارة
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-stone-800/80 border border-stone-700 flex items-center justify-center text-stone-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-stone-200">سلتك فارغة حالياً</h4>
                  <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
                    تصفح أكلات الأسر المنتجة، العسل الشهري، والعريكة وأضف ما تشتهيه لسلتك.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-2 border-b border-stone-800 text-xs">
                  <span className="text-stone-400">الأصناف المضافة</span>
                  <button 
                    onClick={onClearCart}
                    className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>تفريغ السلة</span>
                  </button>
                </div>

                {cartItems.map(({ item, quantity }) => (
                  <div 
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-stone-950/80 border border-stone-800 flex items-center gap-3.5"
                  >
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-16 h-16 rounded-xl object-cover border border-stone-800"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate font-['Amiri']">{item.name}</h4>
                      <p className="text-[10px] text-emerald-400 truncate mt-0.5">{item.sellerName}</p>
                      <span className="text-xs font-bold text-amber-400 mt-1 block">
                        {item.price * quantity} ر.س
                      </span>
                    </div>

                    {/* Quantity modifier */}
                    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-900 border border-stone-700">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-all"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-white px-1.5">{quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-all"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1.5 text-stone-500 hover:text-red-400 transition-colors"
                      title="حذف من السلة"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Cart Footer & Checkout Action */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-stone-800 bg-stone-950/80 space-y-4">
              
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-400">
                  <span>المجموع الفرعي:</span>
                  <span className="font-mono text-stone-200">{subtotal.toFixed(2)} ر.س</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>رسوم التوصيل المحلي:</span>
                  <span className="font-mono text-stone-200">{deliveryFee.toFixed(2)} ر.س</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>ضريبة القيمة المضافة (15%):</span>
                  <span className="font-mono text-stone-200">{tax.toFixed(2)} ر.س</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-stone-800">
                  <span>الإجمالي الكلي:</span>
                  <span className="font-mono text-amber-400 text-base">{grandTotal.toFixed(2)} ر.س</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-sm shadow-xl shadow-emerald-950 hover:from-emerald-500 hover:to-teal-600 transition-all flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>إتمام الطلب والدفع ({grandTotal.toFixed(2)} ر.س)</span>
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
