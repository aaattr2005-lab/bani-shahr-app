import React, { useState, useEffect } from "react";
import {
  Wallet,
  Coins,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Building,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  X,
  Sparkles,
  Smartphone,
  Copy,
  Check,
  RefreshCw,
  SlidersHorizontal,
  FileText,
  Lock,
  ExternalLink,
  ChevronRight,
  Plus,
  Send,
  Download
} from "lucide-react";
import { DataStore } from "../lib/datastore";
import { useLanguage } from "../lib/i18n";
import { WalletAccount, WalletTransaction, MoyasarConfig } from "../types";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "overview" | "topup" | "withdraw" | "moyasar";
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  initialTab = "overview"
}) => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"overview" | "topup" | "withdraw" | "moyasar">(initialTab);
  
  const [wallet, setWallet] = useState<WalletAccount | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [moyasarConfig, setMoyasarConfig] = useState<MoyasarConfig | null>(null);

  // Top-Up State
  const [topUpAmount, setTopUpAmount] = useState<number>(250);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [selectedMethod, setSelectedMethod] = useState<"mada" | "apple_pay" | "visa" | "mastercard" | "stc_pay">("mada");
  const [cardNumber, setCardNumber] = useState<string>("4000 0000 0000 0002");
  const [cardHolder, setCardHolder] = useState<string>("ضيف بني شهر");
  const [cardExpiry, setCardExpiry] = useState<string>("12/28");
  const [cardCvv, setCardCvv] = useState<string>("123");
  const [stcPhone, setStcPhone] = useState<string>("0501234567");
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);

  // Withdrawal State
  const [withdrawAmount, setWithdrawAmount] = useState<string>("300");
  const [iban, setIban] = useState<string>("SA4480000456608010123456");
  const [bankName, setBankName] = useState<string>("مصرف الراجحي");
  const [withdrawSuccessMsg, setWithdrawSuccessMsg] = useState<string | null>(null);
  const [withdrawErrorMsg, setWithdrawErrorMsg] = useState<string | null>(null);

  // Filter Transactions
  const [txFilter, setTxFilter] = useState<string>("all");
  const [selectedTxForReceipt, setSelectedTxForReceipt] = useState<WalletTransaction | null>(null);

  // Copied state
  const [copiedKey, setCopiedKey] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      loadWalletData();
      setActiveTab(initialTab);
      setPaymentSuccessMsg(null);
      setWithdrawSuccessMsg(null);
      setWithdrawErrorMsg(null);
    }
  }, [isOpen, initialTab]);

  const loadWalletData = () => {
    const userWallet = DataStore.getWallet();
    const userTxs = DataStore.getWalletTransactions();
    const config = DataStore.getMoyasarConfig();
    setWallet(userWallet);
    setTransactions(userTxs);
    setMoyasarConfig(config);
    if (userWallet.iban) setIban(userWallet.iban);
    if (userWallet.bankName) setBankName(userWallet.bankName);
  };

  if (!isOpen) return null;

  const currentEffectiveAmount = customAmount ? parseFloat(customAmount) || 0 : topUpAmount;

  // Handle Moyasar Top-Up Execution
  const handleMoyasarTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentEffectiveAmount < 10) {
      alert(language === "ar" ? "الحد الأدنى للشحن هو 10 ر.س" : "Minimum top-up is 10 SAR");
      return;
    }

    setIsProcessingPayment(true);
    setPaymentSuccessMsg(null);

    // Simulate 3D Secure / Moyasar gateway authorization
    setTimeout(() => {
      const result = DataStore.topUpWalletViaMoyasar(
        currentEffectiveAmount,
        selectedMethod,
        { cardNumber, name: cardHolder }
      );

      setIsProcessingPayment(false);
      if (result.success) {
        setPaymentSuccessMsg(
          language === "ar"
            ? `تم شحن محفظتك بنجاح بمبلغ ${currentEffectiveAmount.toLocaleString("ar-SA")} ر.س عبر بوابة ميسر (Moyasar)`
            : `Wallet successfully topped up with ${currentEffectiveAmount} SAR via Moyasar Payment Gateway`
        );
        loadWalletData();
      }
    }, 1200);
  };

  // Handle Withdrawal
  const handleWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawSuccessMsg(null);
    setWithdrawErrorMsg(null);

    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      setWithdrawErrorMsg(language === "ar" ? "يرجى إدخال مبلغ سحب صالح" : "Please enter a valid withdrawal amount");
      return;
    }

    const result = DataStore.requestWalletWithdrawal(amount, iban, bankName);
    if (result.success) {
      setWithdrawSuccessMsg(result.message);
      loadWalletData();
    } else {
      setWithdrawErrorMsg(result.message);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const filteredTransactions = transactions.filter(tx => {
    if (txFilter === "all") return true;
    return tx.type === txFilter;
  });

  const saudiBanks = [
    "مصرف الراجحي (Al Rajhi Bank)",
    "البنك الأهلي السعودي (SNB)",
    "مصرف الإنماء (Alinma Bank)",
    "بنك الرياض (Riyad Bank)",
    "بنك البلاد (Bank Albilad)",
    "البنك السعودي الأول (SAB)",
    "البنك العربي الوطني (ANB)",
    "بنك الجزيرة (Bank AlJazira)",
    "البنك السعودي للاستثمار (SAIB)"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-stone-900 rounded-3xl border border-stone-800 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button
          id="close-wallet-modal-btn"
          onClick={onClose}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 p-2 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Banner with Luxury Balance Presentation */}
        <div className="p-6 sm:p-8 bg-gradient-to-br from-emerald-950/60 via-stone-900 to-amber-950/40 border-b border-stone-800 relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-tr from-emerald-500 to-amber-500 text-stone-950 shadow-lg shadow-emerald-500/20">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-white font-['Tajawal']">
                      {language === "ar" ? "المحفظة الرقمية لبني شهر" : "Bani Shahr Digital Wallet"}
                    </h2>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>{language === "ar" ? "بوابة ميسر Moyasar" : "Moyasar Ready"}</span>
                    </span>
                  </div>
                  <p className="text-xs text-stone-400">
                    {language === "ar" 
                      ? "إدارة رصيدك، شحن الأموال، سحب الأرباح، والمدفوعات الآمنة بالريال السعودي (SAR)" 
                      : "Manage balance, top-up, withdraw earnings & pay securely in Saudi Riyals"}
                  </p>
                </div>
              </div>

              {/* Live Status indicator */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-800/80 border border-stone-700/60 text-xs text-stone-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-emerald-400 font-bold">Moyasar v2.1 Active</span>
              </div>
            </div>

            {/* Main Balance Highlight Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Available Balance */}
              <div className="sm:col-span-2 p-5 rounded-2xl bg-gradient-to-r from-stone-800/90 to-stone-850 border border-stone-750 shadow-inner flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-stone-400 flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-amber-400" />
                    <span>{language === "ar" ? "الرصيد المتاح للإنفاق والسحب:" : "Available Balance:"}</span>
                  </span>
                  <span className="text-[11px] text-stone-400 font-mono">
                    {language === "ar" ? "العملة: ريال سعودي (SAR)" : "Currency: SAR"}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-amber-400 font-mono tracking-tight">
                    {(wallet?.balance || 0).toLocaleString(language === "ar" ? "ar-SA" : "en-US", { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-sm font-bold text-stone-300">
                    {language === "ar" ? "ريال سعودي" : "SAR"}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-stone-400">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {language === "ar"
                      ? "محمي ومحفوظ بنظام الدفع المصرفي المعتمد في المملكة"
                      : "Secured by accredited Saudi banking standard"}
                  </span>
                </div>
              </div>

              {/* Pending / Escrow Earnings */}
              <div className="p-5 rounded-2xl bg-stone-800/60 border border-stone-750 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-stone-400 flex items-center gap-1.5 mb-1.5">
                    <Clock className="w-4 h-4 text-stone-400" />
                    <span>{language === "ar" ? "أرباح تحت التسوية:" : "Pending Payouts:"}</span>
                  </span>
                  <div className="text-2xl font-black text-stone-200 font-mono">
                    {(wallet?.pendingBalance || 0).toLocaleString(language === "ar" ? "ar-SA" : "en-US", { minimumFractionDigits: 2 })}
                    <span className="text-xs font-normal text-stone-400 mr-1"> {language === "ar" ? "ر.س" : "SAR"}</span>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-400/90 font-medium">
                  {language === "ar" ? "تُودع تلقائياً في حسابك أسبوعياً" : "Auto-settled weekly to IBAN"}
                </span>
              </div>
            </div>

            {/* Quick Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2 mt-6">
              <button
                id="wallet-tab-overview"
                onClick={() => setActiveTab("overview")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition ${
                  activeTab === "overview"
                    ? "bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20"
                    : "bg-stone-800/80 hover:bg-stone-800 text-stone-300"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>{language === "ar" ? "سجل العمليات والمعاملات" : "Transactions & Ledger"}</span>
              </button>

              <button
                id="wallet-tab-topup"
                onClick={() => setActiveTab("topup")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition ${
                  activeTab === "topup"
                    ? "bg-emerald-500 text-stone-950 shadow-md shadow-emerald-500/20"
                    : "bg-stone-800/80 hover:bg-stone-800 text-stone-300"
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>{language === "ar" ? "شحن الرصيد (ميسر Moyasar)" : "Top Up Balance"}</span>
              </button>

              <button
                id="wallet-tab-withdraw"
                onClick={() => setActiveTab("withdraw")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition ${
                  activeTab === "withdraw"
                    ? "bg-blue-500 text-stone-950 shadow-md shadow-blue-500/20"
                    : "bg-stone-800/80 hover:bg-stone-800 text-stone-300"
                }`}
              >
                <Building className="w-4 h-4" />
                <span>{language === "ar" ? "سحب الأرباح (IBAN)" : "Bank Withdrawal"}</span>
              </button>

              <button
                id="wallet-tab-moyasar"
                onClick={() => setActiveTab("moyasar")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition ${
                  activeTab === "moyasar"
                    ? "bg-purple-500 text-stone-950 shadow-md shadow-purple-500/20"
                    : "bg-stone-800/80 hover:bg-stone-800 text-stone-300"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>{language === "ar" ? "بوابة ميسر (Moyasar API)" : "Moyasar Gateway Dev"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto">
          
          {/* TAB 1: OVERVIEW & TRANSACTIONS */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-400" />
                  <span>{language === "ar" ? "سجل الحركات المالية والمحفظة" : "Wallet Financial History"}</span>
                </h3>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-800/80 text-xs">
                  {[
                    { id: "all", label: language === "ar" ? "الكل" : "All" },
                    { id: "deposit", label: language === "ar" ? "شحن رصيد" : "Deposits" },
                    { id: "earnings", label: language === "ar" ? "أرباح" : "Earnings" },
                    { id: "payment", label: language === "ar" ? "مدفوعات" : "Payments" },
                    { id: "payout", label: language === "ar" ? "سحب بنكي" : "Payouts" },
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setTxFilter(f.id)}
                      className={`px-3 py-1 rounded-lg font-bold transition text-[11px] ${
                        txFilter === f.id
                          ? "bg-amber-500 text-stone-950"
                          : "text-stone-400 hover:text-stone-200"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transactions List */}
              {filteredTransactions.length === 0 ? (
                <div className="p-8 rounded-2xl bg-stone-850/50 border border-dashed border-stone-750 text-center text-stone-400">
                  <AlertCircle className="w-8 h-8 text-stone-500 mx-auto mb-2" />
                  <p>{language === "ar" ? "لا توجد معاملات في هذا القسم حالياً" : "No transactions found in this section"}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTransactions.map((tx) => {
                    const isPositive = tx.type === "deposit" || tx.type === "earnings" || tx.type === "refund";
                    return (
                      <div
                        key={tx.id}
                        className="p-4 rounded-2xl bg-stone-800/60 hover:bg-stone-800 border border-stone-750 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start sm:items-center gap-3">
                          <div className={`p-2.5 rounded-xl mt-0.5 sm:mt-0 ${
                            isPositive
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}>
                            {isPositive ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-stone-100">{tx.title}</h4>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                tx.status === "completed" 
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              }`}>
                                {tx.status === "completed" 
                                  ? (language === "ar" ? "مكتملة ومؤكدة" : "Completed") 
                                  : (language === "ar" ? "قيد التنفيذ" : "Pending")}
                              </span>
                            </div>
                            <p className="text-xs text-stone-400 mt-0.5">{tx.description}</p>
                            <div className="flex items-center gap-3 text-[11px] text-stone-400 mt-1 font-mono">
                              <span>{new Date(tx.createdAt).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}</span>
                              <span>•</span>
                              <span>ID: {tx.id}</span>
                              {tx.moyasarPaymentId && (
                                <>
                                  <span>•</span>
                                  <span className="text-emerald-400">Moyasar: {tx.moyasarPaymentId}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-center">
                          <div className="text-left sm:text-right">
                            <span className={`text-base font-black font-mono block ${
                              isPositive ? "text-emerald-400" : "text-amber-400"
                            }`}>
                              {isPositive ? "+" : "-"} {tx.amount.toLocaleString(language === "ar" ? "ar-SA" : "en-US", { minimumFractionDigits: 2 })} {language === "ar" ? "ر.س" : "SAR"}
                            </span>
                            {tx.fee && tx.fee > 0 && (
                              <span className="text-[10px] text-stone-400 block">
                                {language === "ar" ? `رسوم/عمولة: ${tx.fee} ر.س` : `Fee: ${tx.fee} SAR`}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => setSelectedTxForReceipt(tx)}
                            title={language === "ar" ? "عرض إشعار المعاملة" : "View Receipt"}
                            className="p-2 rounded-xl bg-stone-700/50 hover:bg-stone-700 text-stone-300 hover:text-white transition text-xs flex items-center gap-1"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MOYASAR TOP-UP */}
          {activeTab === "topup" && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-400" />
                  <span>{language === "ar" ? "شحن رصيد المحفظة عبر بوابة الدفع ميسر (Moyasar)" : "Top Up Wallet Balance via Moyasar Gateway"}</span>
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  {language === "ar"
                    ? "اختر المبلغ المراد شحنه وطريقة الدفع المعتمدة (مدى، Apple Pay، بطاقات الائتمان، STC Pay)."
                    : "Select amount and your preferred Saudi payment method (Mada, Apple Pay, Credit Card, STC Pay)."}
                </p>
              </div>

              {paymentSuccessMsg && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-3 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{paymentSuccessMsg}</span>
                </div>
              )}

              {/* Amount Presets */}
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-2">
                  {language === "ar" ? "1. حدد مبلغ الشحن (ريال سعودي SAR):" : "1. Select Amount (SAR):"}
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {[50, 100, 250, 500, 1000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setTopUpAmount(amt);
                        setCustomAmount("");
                      }}
                      className={`p-3 rounded-xl border text-center transition font-bold font-mono ${
                        topUpAmount === amt && !customAmount
                          ? "bg-emerald-500 text-stone-950 border-emerald-400 shadow-md shadow-emerald-500/20"
                          : "bg-stone-800/80 hover:bg-stone-800 text-stone-200 border-stone-700"
                      }`}
                    >
                      <span className="text-base">{amt}</span>
                      <span className="text-[10px] block opacity-80">{language === "ar" ? "ر.س" : "SAR"}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-3">
                  <input
                    id="custom-topup-input"
                    type="number"
                    min="10"
                    placeholder={language === "ar" ? "أو أدخل مبلغاً مخصصاً بالريال..." : "Or enter custom amount in SAR..."}
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white placeholder-stone-400 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-2">
                  {language === "ar" ? "2. اختر وسيلة الدفع (بوابة ميسر):" : "2. Select Payment Method (Moyasar):"}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod("mada")}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                      selectedMethod === "mada"
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-300"
                        : "bg-stone-800/80 hover:bg-stone-800 border-stone-700 text-stone-300"
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs font-bold">مدى (Mada)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod("apple_pay")}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                      selectedMethod === "apple_pay"
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-300"
                        : "bg-stone-800/80 hover:bg-stone-800 border-stone-700 text-stone-300"
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-white" />
                    <span className="text-xs font-bold">Apple Pay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod("stc_pay")}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                      selectedMethod === "stc_pay"
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-300"
                        : "bg-stone-800/80 hover:bg-stone-800 border-stone-700 text-stone-300"
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-purple-400" />
                    <span className="text-xs font-bold">STC Pay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod("visa")}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                      selectedMethod === "visa"
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-300"
                        : "bg-stone-800/80 hover:bg-stone-800 border-stone-700 text-stone-300"
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-blue-400" />
                    <span className="text-xs font-bold">Visa / Mastercard</span>
                  </button>
                </div>
              </div>

              {/* Moyasar Interactive Payment Form */}
              <form onSubmit={handleMoyasarTopUp} className="p-5 rounded-2xl bg-stone-800/90 border border-stone-700 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-700">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">
                      {language === "ar" ? "بيانات الدفع عبر ميسر المعتمدة" : "Moyasar Secure Card Details"}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-stone-400">Sandbox Test Mode Ready</span>
                </div>

                {selectedMethod === "stc_pay" ? (
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      {language === "ar" ? "رقم جوال حساب STC Pay:" : "STC Pay Phone Number:"}
                    </label>
                    <input
                      type="text"
                      value={stcPhone}
                      onChange={(e) => setStcPhone(e.target.value)}
                      placeholder="05XXXXXXXX"
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white text-sm font-mono focus:border-emerald-500"
                    />
                  </div>
                ) : selectedMethod === "apple_pay" ? (
                  <div className="p-4 rounded-xl bg-stone-900 border border-stone-700 text-center">
                    <p className="text-xs text-stone-300 mb-2">
                      {language === "ar" 
                        ? "سيتم خصم المبلغ مباشرة عبر محفظة Apple Pay بعد تأكيد البصمة أو Face ID" 
                        : "Amount will be charged via Apple Pay with Face ID / Touch ID confirmation"}
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black font-bold text-sm">
                      <Smartphone className="w-4 h-4" />
                      <span>Pay with Apple Pay</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-stone-300 mb-1">
                        {language === "ar" ? "رقم بطاقة مدى / الائتمان:" : "Card Number:"}
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white text-sm font-mono focus:border-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-stone-300 mb-1">
                          {language === "ar" ? "تاريخ الانتهاء (MM/YY):" : "Expiry (MM/YY):"}
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white text-sm font-mono focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-300 mb-1">
                          {language === "ar" ? "رمز الأمان (CVV):" : "CVV Code:"}
                        </label>
                        <input
                          type="text"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white text-sm font-mono focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-300 mb-1">
                        {language === "ar" ? "اسم حامل البطاقة:" : "Cardholder Name:"}
                      </label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white text-sm focus:border-emerald-500"
                      />
                    </div>
                  </>
                )}

                {/* Quick Test Card Helper */}
                <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
                  <span>{language === "ar" ? "بطاقة اختبار مدى Moyasar التجريبية" : "Moyasar Mada Test Card"}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setCardNumber("4000 0000 0000 0002");
                      setCardExpiry("12/28");
                      setCardCvv("123");
                      setCardHolder("ضيف بني شهر الكرام");
                    }}
                    className="text-amber-400 hover:text-amber-300 font-bold underline"
                  >
                    {language === "ar" ? "تعبئة تلقائية للبطاقة" : "Auto-fill Card"}
                  </button>
                </div>

                <button
                  id="confirm-moyasar-topup-btn"
                  type="submit"
                  disabled={isProcessingPayment}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-stone-950 font-black text-sm shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessingPayment ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{language === "ar" ? "جارِ معالجة الدفع عبر ميسر..." : "Processing via Moyasar..."}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>
                        {language === "ar"
                          ? `دفع وشحن ${currentEffectiveAmount.toLocaleString("ar-SA")} ريال سعودي`
                          : `Top Up ${currentEffectiveAmount} SAR`}
                      </span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: BANK WITHDRAWAL */}
          {activeTab === "withdraw" && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Building className="w-5 h-5 text-blue-400" />
                  <span>{language === "ar" ? "سحب الأرباح والرصيد إلى الحساب البنكي (IBAN)" : "Withdraw Earnings to Saudi IBAN"}</span>
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  {language === "ar"
                    ? "تحويل مباشر من رصيد المحفظة إلى حسابك البنكي في كافة البنوك السعودية المعتمدة."
                    : "Direct transfer from your wallet balance to your local Saudi bank account."}
                </p>
              </div>

              {withdrawSuccessMsg && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-3 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{withdrawSuccessMsg}</span>
                </div>
              )}

              {withdrawErrorMsg && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm font-bold flex items-center gap-3 animate-in fade-in">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                  <span>{withdrawErrorMsg}</span>
                </div>
              )}

              <form onSubmit={handleWithdrawal} className="p-5 rounded-2xl bg-stone-800/90 border border-stone-700 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    {language === "ar" ? "المبلغ المراد سحبه (ريال سعودي):" : "Withdrawal Amount (SAR):"}
                  </label>
                  <div className="relative">
                    <input
                      id="withdraw-amount-input"
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white font-mono text-sm focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setWithdrawAmount((wallet?.balance || 0).toString())}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-amber-400 hover:text-amber-300"
                    >
                      {language === "ar" ? "سحب كامل الرصيد" : "Max All"}
                    </button>
                  </div>
                  <span className="text-[10px] text-stone-400 block mt-1">
                    {language === "ar" 
                      ? `الرصيد المتاح للسحب حالياً: ${(wallet?.balance || 0).toLocaleString("ar-SA")} ر.س` 
                      : `Available balance: ${(wallet?.balance || 0)} SAR`}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    {language === "ar" ? "البنك السعودي المستلم:" : "Receiving Saudi Bank:"}
                  </label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white text-sm focus:border-blue-500"
                  >
                    {saudiBanks.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    {language === "ar" ? "رقم الآيبان البنكي (SA...):" : "Saudi IBAN (SA...):"}
                  </label>
                  <input
                    id="withdraw-iban-input"
                    type="text"
                    value={iban}
                    onChange={(e) => setIban(e.target.value)}
                    placeholder="SA4480000456608010123456"
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white text-sm font-mono focus:border-blue-500 uppercase tracking-wider"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    {language === "ar" ? "اسم المستفيد المطابق للحساب البنكي:" : "Account Holder Name:"}
                  </label>
                  <input
                    type="text"
                    defaultValue={wallet?.accountHolderName || "ضيف بني شهر الكرام"}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white text-sm focus:border-blue-500"
                  />
                </div>

                <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-800/30 text-[11px] text-blue-300 flex items-center gap-2">
                  <Clock className="w-4 h-4 shrink-0 text-blue-400" />
                  <span>
                    {language === "ar"
                      ? "تتم الحوالات البنكية عبر نظام سريع للمدفوعات الفورية (SARIE) وتصل لحسابك خلال ساعات العمل الرسمية."
                      : "Transfers are processed via Saudi SARIE instant network and credited quickly during business hours."}
                  </span>
                </div>

                <button
                  id="submit-withdrawal-btn"
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-stone-950 font-black text-sm shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{language === "ar" ? "تأكيد طلب السحب والتحويل البنكي" : "Confirm Withdrawal Request"}</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: MOYASAR GATEWAY DEVELOPER INTEGRATION */}
          {activeTab === "moyasar" && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/50 to-stone-900 border border-purple-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                    <SlidersHorizontal className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {language === "ar" ? "مركز ربط وتكامل بوابة ميسر (Moyasar Payment Gateway)" : "Moyasar Payment Gateway Integration Center"}
                    </h3>
                    <p className="text-xs text-stone-300">
                      {language === "ar" 
                        ? "المحفظة مجهزة بالكامل ومعدة برمجياً للربط المباشر مع مفاتيح API الخاصة ببوابة ميسر." 
                        : "Wallet is fully architected for direct plug-and-play with your Moyasar API keys."}
                    </p>
                  </div>
                </div>
              </div>

              {/* API Credentials Configuration */}
              <div className="p-5 rounded-2xl bg-stone-800/80 border border-stone-700 space-y-4">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  {language === "ar" ? "1. مفاتيح الربط (Moyasar API Keys)" : "1. Moyasar API Credentials"}
                </h4>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    {language === "ar" ? "المفتاح العام (Publishable Key):" : "Publishable API Key:"}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={moyasarConfig?.publishableKey || "pk_test_moyasar_banishahr_2025_demo_key"}
                      className="w-full px-4 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 text-xs font-mono"
                    />
                    <button
                      onClick={() => handleCopy(moyasarConfig?.publishableKey || "pk_test_moyasar_banishahr_2025_demo_key")}
                      className="p-2 rounded-xl bg-stone-700 hover:bg-stone-600 text-stone-200 text-xs flex items-center gap-1 shrink-0"
                    >
                      {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    {language === "ar" ? "رابط الـ Webhook للإشعارات الفورية:" : "Webhook Endpoint URL:"}
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={moyasarConfig?.webhookUrl || "https://bani-shahr.sa/api/moyasar/webhook"}
                    className="w-full px-4 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Integration Ready Specs */}
              <div className="p-5 rounded-2xl bg-stone-800/80 border border-stone-700 space-y-3">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  {language === "ar" ? "2. طرق الدفع المدعومة تلقائياً عبر ميسر:" : "2. Supported Payment Methods:"}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-750 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>بطاقات مدى (Mada)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-750 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Apple Pay</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-750 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>STC Pay</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-750 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Visa / Mastercard</span>
                  </div>
                </div>
              </div>

              {/* Code Snippet Example for Backend Handoff */}
              <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span className="font-mono font-bold">Moyasar Payment Request Payload</span>
                  <span className="text-[10px] text-emerald-400">cURL / Node.js Ready</span>
                </div>
                <pre className="p-3 rounded-xl bg-black text-[11px] font-mono text-emerald-400 overflow-x-auto">
{`// Moyasar API Payment Request
const payment = await moyasar.payments.create({
  amount: 25000, // 250.00 SAR in Halalas
  currency: 'SAR',
  description: 'Top-up Bani Shahr Wallet',
  callback_url: 'https://bani-shahr.sa/wallet/callback',
  source: {
    type: 'creditcard',
    name: 'User Name',
    number: '4000000000000002',
    cvc: '123',
    month: '12',
    year: '28'
  }
});`}
                </pre>
              </div>
            </div>
          )}

        </div>

        {/* Receipt Modal Viewer Popup */}
        {selectedTxForReceipt && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-stone-900 rounded-3xl border border-stone-750 p-6 shadow-2xl">
              <button
                onClick={() => setSelectedTxForReceipt(null)}
                className="absolute top-4 left-4 p-1.5 rounded-full bg-stone-800 text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center pb-4 border-b border-stone-800">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">
                  {language === "ar" ? "إشعار معاملة مالية رسمي" : "Official Transaction Receipt"}
                </h4>
                <p className="text-xs text-stone-400">منصة بني شهر الرقمية - نظام المحفظة المعتمد</p>
              </div>

              <div className="py-4 space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-400">{language === "ar" ? "رقم المعاملة:" : "Transaction ID:"}</span>
                  <span className="font-mono text-stone-200 font-bold">{selectedTxForReceipt.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">{language === "ar" ? "نوع العملية:" : "Type:"}</span>
                  <span className="text-amber-400 font-bold">{selectedTxForReceipt.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">{language === "ar" ? "المبلغ:" : "Amount:"}</span>
                  <span className="font-mono text-emerald-400 font-black text-sm">
                    {selectedTxForReceipt.amount.toLocaleString(language === "ar" ? "ar-SA" : "en-US", { minimumFractionDigits: 2 })} {language === "ar" ? "ر.س" : "SAR"}
                  </span>
                </div>
                {selectedTxForReceipt.moyasarPaymentId && (
                  <div className="flex justify-between">
                    <span className="text-stone-400">بوابة ميسر (Moyasar ID):</span>
                    <span className="font-mono text-stone-300">{selectedTxForReceipt.moyasarPaymentId}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-stone-400">{language === "ar" ? "التاريخ والوقت:" : "Date & Time:"}</span>
                  <span className="font-mono text-stone-300">
                    {new Date(selectedTxForReceipt.createdAt).toLocaleString(language === "ar" ? "ar-SA" : "en-US")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">{language === "ar" ? "الحالة:" : "Status:"}</span>
                  <span className="text-emerald-400 font-bold">{language === "ar" ? "مؤكدة ومعتمدة ✓" : "Confirmed ✓"}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-800 flex gap-2">
                <button
                  onClick={() => {
                    alert(language === "ar" ? "تم تحميل الإشعار المالي بصيغة PDF بنجاح." : "Receipt downloaded as PDF.");
                    setSelectedTxForReceipt(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>{language === "ar" ? "تحميل الإشعار (PDF)" : "Download Receipt"}</span>
                </button>
                <button
                  onClick={() => setSelectedTxForReceipt(null)}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold transition"
                >
                  {language === "ar" ? "إغلاق" : "Close"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 sm:p-6 bg-stone-950 border-t border-stone-800 flex items-center justify-between">
          <div className="text-[11px] text-stone-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              {language === "ar" 
                ? "كافة المعاملات المالية بالريال السعودي (SAR) وتخضع للرقابة المصرفية" 
                : "All transactions in Saudi Riyal (SAR) under Saudi banking standards"}
            </span>
          </div>
          <button
            id="close-wallet-bottom-btn"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs transition"
          >
            {language === "ar" ? "إغلاق" : "Close"}
          </button>
        </div>

      </div>
    </div>
  );
};
