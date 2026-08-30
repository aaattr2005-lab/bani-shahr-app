import React, { useState } from "react";
import { CartItem, Order } from "../types";
import { DataStore } from "../lib/datastore";
import { 
  X, 
  MapPin, 
  Phone, 
  User, 
  CreditCard, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  ShoppingBag,
  Sparkles,
  Wallet
} from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onOrderSuccess,
}) => {
  const currentUser = DataStore.getCurrentUser();
  const currentWallet = DataStore.getWallet(currentUser.id);
  const [userName, setUserName] = useState(currentUser.name || "");
  const [userPhone, setUserPhone] = useState(currentUser.phone || "05");
  const [city, setCity] = useState(currentUser.city || "تنومة");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<Order["paymentMethod"] | "wallet">("wallet");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isOpen || cartItems.length === 0) return null;

  const subtotal = cartItems.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);
  const deliveryFee = 15;
  const tax = subtotal * 0.15;
  const grandTotal = subtotal + deliveryFee + tax;

  const handleProcessOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userPhone.trim() || !deliveryAddress.trim()) {
      alert("يرجى تعبئة كافة بيانات التوصيل ورقم الجوال بدقة");
      return;
    }

    if (paymentMethod === "wallet" && currentWallet.balance < grandTotal) {
      alert(`رصيد المحفظة المتاح (${currentWallet.balance.toFixed(2)} ر.س) لا يكفي لدفع قيمة الطلب (${grandTotal.toFixed(2)} ر.س). يرجى شحن المحفظة أولاً أو اختيار وسيلة دفع أخرى.`);
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder: Order = {
        id: orderId,
        userId: currentUser.id,
        userName,
        userPhone,
        deliveryAddress,
        city,
        items: cartItems.map((c) => ({
          itemId: c.item.id,
          name: c.item.name,
          price: c.item.price,
          quantity: c.quantity,
          sellerName: c.item.sellerName,
        })),
        subtotal,
        deliveryFee,
        tax,
        grandTotal,
        status: "preparing",
        paymentMethod: paymentMethod as any,
        paymentStatus: "paid",
        createdAt: new Date().toISOString(),
      };

      // Deduct from wallet if wallet payment method was used
      if (paymentMethod === "wallet") {
        DataStore.addWalletTransaction({
          userId: currentUser.id,
          type: "payment",
          amount: grandTotal,
          netAmount: grandTotal,
          title: `دفع طلب أكلات شعبية (${newOrder.id})`,
          description: `شراء وجبات ومنتجات تراثية من الأسر المنتجة (${cartItems.length} عناصر)`,
          status: "completed",
          paymentGateway: "wallet",
          paymentMethod: "wallet",
          referenceId: orderId,
        });
      }

      DataStore.saveOrder(newOrder);
      setConfirmedOrder(newOrder);
      setIsProcessing(false);
      setIsSuccess(true);
      onOrderSuccess(newOrder);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-stone-900 border border-stone-700/80 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-950 via-stone-900 to-stone-900 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-['Amiri']">إتمام طلب الأكلات التراثية والدفع</h3>
              <p className="text-xs text-stone-400">توصيل محلي مباشر من الأسر المنتجة</p>
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
          <form onSubmit={handleProcessOrder} className="p-6 space-y-5">
            
            {/* Order Items Preview summary */}
            <div className="p-3.5 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-2">
              <span className="text-[11px] font-bold text-stone-400 block">ملخص الأصناف المطلوبة ({cartItems.length}):</span>
              <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1">
                {cartItems.map((c) => (
                  <div key={c.item.id} className="flex justify-between items-center text-xs">
                    <span className="text-stone-200 truncate max-w-[70%]">
                      {c.quantity}x {c.item.name}
                    </span>
                    <span className="text-amber-400 font-mono">{(c.item.price * c.quantity).toFixed(2)} ر.س</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Information Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  اسم المستلم
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="مثال: عبد العزيز الشهري"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  رقم الجوال لتأكيد التوصيل
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

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  المحافظة / المدينة
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white text-sm focus:border-emerald-500 focus:outline-none"
                >
                  <option value="تنومة">تنومة</option>
                  <option value="النماص">النماص</option>
                  <option value="المجاردة">المجاردة</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  عنوان التوصيل أو الموقع
                </label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="مثال: شاليهات المحفار أو اسم الحي والشارع"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="pt-2 border-t border-stone-800">
              <label className="block text-xs font-medium text-stone-300 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                  طريقة الدفع (دفع فوري آمن عبر ميسر أو المحفظة)
                </span>
                <span className="text-[10px] text-amber-400 font-mono">
                  رصيد محفظتك: {currentWallet.balance.toFixed(2)} ر.س
                </span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: "wallet", name: "رصيد المحفظة", icon: Wallet },
                  { id: "mada", name: "مدى Mada", icon: CreditCard },
                  { id: "apple_pay", name: "Apple Pay", icon: CreditCard },
                  { id: "visa", name: "Visa / Master", icon: CreditCard },
                  { id: "stc_pay", name: "STC Pay", icon: CreditCard },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`py-2 px-2 rounded-xl border text-[11px] font-medium transition-all text-center flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === pm.id
                        ? "bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-950 font-bold"
                        : "bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700"
                    }`}
                  >
                    <span>{pm.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[11px] text-stone-400 block">الإجمالي الكلي شامل التوصيل والضريبة</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold text-amber-400 font-['Amiri']">{grandTotal.toFixed(2)}</span>
                  <span className="text-xs text-stone-400">ريال سعودي</span>
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
                    <span>جاري تأكيد الطلب والدفع...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>تأكيد الطلب والدفع ({grandTotal.toFixed(2)} ر.س)</span>
                  </>
                )}
              </button>
            </div>

          </form>
        ) : (
          /* Order Confirmation Receipt Screen */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white font-['Amiri']">تم استلام طلبك وبدء التحضير!</h3>
              <p className="text-sm text-stone-300 mt-1">
                رقم الطلب: <span className="font-mono text-amber-400 font-bold">{confirmedOrder?.id}</span>
              </p>
              <p className="text-xs text-stone-400 mt-2 max-w-md mx-auto">
                تم إرسال إشعار فوري إلى الأسر المنتجة، وسيصلك مندوب التوصيل إلى عنوانك في <strong className="text-emerald-300">{confirmedOrder?.city}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 text-xs text-stone-300 space-y-2 text-right max-w-md mx-auto">
              <div className="flex justify-between border-b border-stone-800 pb-1.5">
                <span className="text-stone-400">اسم العميل:</span>
                <span className="font-bold text-white">{confirmedOrder?.userName}</span>
              </div>
              <div className="flex justify-between border-b border-stone-800 pb-1.5">
                <span className="text-stone-400">العنوان:</span>
                <span className="font-bold text-white">{confirmedOrder?.deliveryAddress}</span>
              </div>
              <div className="flex justify-between border-b border-stone-800 pb-1.5">
                <span className="text-stone-400">طريقة الدفع:</span>
                <span className="font-bold text-emerald-400">تم الدفع بنجاح ({confirmedOrder?.paymentMethod})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">الإجمالي المدفوع:</span>
                <span className="font-bold text-amber-400">{confirmedOrder?.grandTotal.toFixed(2)} ر.س</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3 rounded-xl bg-stone-800 text-white font-medium text-sm hover:bg-stone-700 transition-all"
            >
              إغلاق ومتابعة التسوق
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
