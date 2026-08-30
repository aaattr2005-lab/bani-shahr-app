import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  Shield,
  ShieldAlert,
  AlertTriangle,
  Flag,
  CheckCircle2,
  Lock,
  User,
  Clock,
  PhoneOff,
  Info,
  ChevronRight,
  MessageSquare,
  Sparkles,
  ShoppingBag,
  Compass,
  FileCheck
} from "lucide-react";
import { ChatConversation, ChatMessage, ChatReport, UserProfile } from "../types";
import { DataStore } from "../lib/datastore";
import { checkMessageForBypass, maskPhoneNumber } from "../lib/chatFilter";

interface SecureChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialConversationId?: string;
  recipientUser?: {
    id: string;
    name: string;
    role: string;
    phone?: string;
  };
  contextType?: "order" | "booking" | "experience" | "support" | "direct";
  contextEntityId?: string;
  contextTitle?: string;
}

export const SecureChatModal: React.FC<SecureChatModalProps> = ({
  isOpen,
  onClose,
  initialConversationId,
  recipientUser,
  contextType = "direct",
  contextEntityId = "",
  contextTitle = "محادثة مباشرة",
}) => {
  const currentUser = DataStore.getCurrentUser();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(initialConversationId || null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [bypassWarning, setBypassWarning] = useState<string | null>(null);
  
  // Reporting state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState<ChatReport["reason"]>("تبادل أرقام خارجية وتجاوز التطبيق");
  const [reportDetails, setReportDetails] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize or fetch conversation
  useEffect(() => {
    if (!isOpen) return;

    const allConvs = DataStore.getConversations(currentUser.id);
    setConversations(allConvs);

    if (initialConversationId) {
      setActiveConvId(initialConversationId);
      const msgs = DataStore.getMessages(initialConversationId);
      setMessages(msgs);
    } else if (recipientUser) {
      // Create or get existing conversation
      const conv = DataStore.createOrGetConversation({
        type: contextType as "order" | "booking" | "experience" | "support" | "direct",
        relatedEntityId: contextEntityId,
        title: contextTitle,
        recipientId: recipientUser.id,
        recipientName: recipientUser.name,
        recipientRole: recipientUser.role,
        recipientPhone: recipientUser.phone,
      });
      setActiveConvId(conv.id);
      setConversations(DataStore.getConversations(currentUser.id));
      setMessages(DataStore.getMessages(conv.id));
    } else if (allConvs.length > 0 && !activeConvId) {
      setActiveConvId(allConvs[0].id);
      setMessages(DataStore.getMessages(allConvs[0].id));
    }
  }, [isOpen, initialConversationId, recipientUser, contextEntityId]);

  useEffect(() => {
    if (activeConvId) {
      const msgs = DataStore.getMessages(activeConvId);
      setMessages(msgs);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeConvId]);

  if (!isOpen) return null;

  const currentConv = conversations.find((c) => c.id === activeConvId);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeConvId) return;

    // Run security anti-bypass filter
    const filterResult = checkMessageForBypass(inputText);

    if (filterResult.isBlocked) {
      setBypassWarning(filterResult.violationDescription || "تم رصد محاولة إرسال رقم جوال أو رابط خارجي.");
      
      // Send a system warning inside the chat log for transparency
      DataStore.sendMessage({
        id: "msg-" + Date.now().toString().slice(-6),
        conversationId: activeConvId,
        senderId: "system",
        senderName: "نظام الحماية والأمان",
        senderRole: "admin",
        content: `⚠️ تنبيه أمني: ${filterResult.violationDescription}\n[من أجل سلامتك وحمايتك المالية وضمان جودة الخدمة، يمنع تبادل أرقام التواصل أو الروابط الخارجية داخل التطبيق. الحجز والدفع والتقييم والحماية تخضع لنظام المنصة.]`,
        isSystemNotice: true,
        systemNoticeType: "warning_bypass",
        timestamp: new Date().toISOString(),
        isRead: true,
      });

      // Also log security violation in platform audit logs
      DataStore.logAction({
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        actionType: "SECURITY_VIOLATION" as any,
        targetModule: "SECURITY",
        details: `محاولة تجاوز التطبيق ومشاركة بيانات خارجية في المحادثة [${activeConvId}] - تم الحظر فورياً.`,
      });

      setMessages(DataStore.getMessages(activeConvId));
      setInputText("");
      return;
    }

    // Clean pass - Send message
    setBypassWarning(null);
    DataStore.sendMessage({
      id: "msg-" + Date.now().toString().slice(-6),
      conversationId: activeConvId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role as any,
      content: inputText.trim(),
      timestamp: new Date().toISOString(),
      isRead: false,
    });

    setMessages(DataStore.getMessages(activeConvId));
    setConversations(DataStore.getConversations(currentUser.id));
    setInputText("");
    
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const handleOpenReport = () => {
    setIsReportModalOpen(true);
    setReportSubmitted(false);
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConvId) return;

    DataStore.reportConversation(
      activeConvId,
      reportReason,
      currentUser.id,
      reportDetails
    );

    setReportSubmitted(true);
    setTimeout(() => {
      setIsReportModalOpen(false);
      setReportDetails("");
    }, 2000);
  };

  // Get other participant info
  const otherParticipantName = currentConv
    ? currentConv.participant1Id === currentUser.id
      ? currentConv.participant2Name
      : currentConv.participant1Name
    : "المحادثة";

  const otherParticipantRole = currentConv
    ? currentConv.participant1Id === currentUser.id
      ? currentConv.participant2Role
      : currentConv.participant1Role
    : "";

  const otherParticipantMaskedPhone = currentConv
    ? currentConv.participant1Id === currentUser.id
      ? currentConv.participant2MaskedPhone
      : currentConv.participant1MaskedPhone
    : "05******";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl h-[90vh] max-h-[750px] bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-stone-100">
        
        {/* Header */}
        <div className="p-4 bg-stone-950 border-b border-stone-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-['Amiri']">
                  الشات الداخلي الآمن لمنصة بني شهر
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-[10px] text-emerald-300 font-bold flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  <span>تواصل محمي ومشفر</span>
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                الحجز، الدفع، التقييم، وحماية الحقوق تخضع لضمان المنصة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentConv && (
              <button
                onClick={handleOpenReport}
                className="px-3 py-1.5 rounded-xl bg-red-950/60 border border-red-800/50 hover:bg-red-900/80 text-red-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                title="إبلاغ عن محادثة للإدارة"
              >
                <Flag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">إبلاغ عن مخالفة</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Anti-Bypass Security Banner */}
        <div className="px-4 py-2 bg-amber-950/40 border-b border-amber-800/30 flex items-center justify-between text-xs text-amber-300/90 gap-2">
          <div className="flex items-center gap-2">
            <PhoneOff className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>سياسة منع تجاوز المنصة:</strong> لا تظهر أرقام الهواتف مباشرة وتُفلتر المحادثات لمنع روابط الواتساب أو التواصل الخارجي لضمان حقك وأمانك المالي.
            </span>
          </div>
          <span className="text-[10px] bg-amber-900/50 px-2 py-0.5 rounded-md text-amber-200 shrink-0 hidden md:inline">
            فلترة تلقائية نشطة
          </span>
        </div>

        {/* Main Body: Conversations Sidebar + Chat Canvas */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Sidebar (Conversations List) */}
          <div className="w-1/3 min-w-[240px] max-w-[300px] border-l border-stone-800/80 bg-stone-950/60 flex flex-col hidden sm:flex">
            <div className="p-3 border-b border-stone-800/60 text-xs font-bold text-stone-400 flex items-center justify-between">
              <span>المحادثات النشطة</span>
              <span className="px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 text-[10px]">
                {conversations.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-stone-800/40">
              {conversations.length === 0 ? (
                <div className="p-6 text-center text-stone-500 text-xs">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <span>لا توجد محادثات سابقة بعد</span>
                </div>
              ) : (
                conversations.map((conv) => {
                  const isParticipant1 = conv.participant1Id === currentUser.id;
                  const partnerName = isParticipant1 ? conv.participant2Name : conv.participant1Name;
                  const partnerRole = isParticipant1 ? conv.participant2Role : conv.participant1Role;
                  const partnerMaskedPhone = isParticipant1 ? conv.participant2MaskedPhone : conv.participant1MaskedPhone;
                  const isSelected = conv.id === activeConvId;

                  return (
                    <button
                      key={conv.id}
                      onClick={() => setActiveConvId(conv.id)}
                      className={`w-full p-3.5 text-right transition-colors flex items-start gap-3 ${
                        isSelected ? "bg-amber-950/30 border-r-4 border-amber-500" : "hover:bg-stone-900/60"
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-300 font-bold shrink-0">
                        {partnerName.slice(0, 1)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-xs font-bold text-stone-200 truncate">{partnerName}</span>
                          <span className="text-[10px] text-stone-500 shrink-0">
                            {new Date(conv.updatedAt).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-400 truncate mb-1">
                          {conv.lastMessage || conv.subtitle}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-stone-500">
                          <span className="px-1.5 py-0.2 rounded bg-stone-800/80 text-amber-400">
                            {partnerRole === "food_seller" ? "بائع أكلات" : partnerRole === "tour_guide" ? "مرشد سياحي" : "زائر"}
                          </span>
                          <span>•</span>
                          <span>{partnerMaskedPhone}</span>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Active Chat Canvas */}
          <div className="flex-1 flex flex-col bg-stone-900/40">
            {currentConv ? (
              <>
                {/* Active Partner Bar */}
                <div className="p-3 bg-stone-900 border-b border-stone-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 text-white font-bold flex items-center justify-center text-sm shadow">
                      {otherParticipantName.slice(0, 1)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{otherParticipantName}</h4>
                        <span className="px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 text-[10px]">
                          {otherParticipantRole === "food_seller" ? "أسرة منتجة / متجر" : otherParticipantRole === "tour_guide" ? "مرشد سياحي معتمد" : "عميل"}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-400 flex items-center gap-2 mt-0.5">
                        <span>هاتف مقنّع: <strong className="text-amber-300">{otherParticipantMaskedPhone}</strong></span>
                        <span>•</span>
                        <span className="text-emerald-400">● متصل داخل المنصة</span>
                      </div>
                    </div>
                  </div>

                  {currentConv.relatedEntityId && (
                    <div className="px-3 py-1.5 rounded-xl bg-stone-800 border border-stone-700 text-[11px] text-stone-300 flex items-center gap-1.5">
                      {currentConv.type === "order" ? (
                        <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                      ) : (
                        <Compass className="w-3.5 h-3.5 text-amber-400" />
                      )}
                      <span>مرتبط بالطلب: <strong>{currentConv.relatedEntityId}</strong></span>
                    </div>
                  )}
                </div>

                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {/* Pinned Security Guidance */}
                  <div className="p-3 rounded-2xl bg-stone-950/80 border border-amber-500/20 text-center space-y-1 max-w-md mx-auto my-2">
                    <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xs font-bold">
                      <Shield className="w-4 h-4" />
                      <span>محادثة مشفرة ومحمية بضمان بني شهر</span>
                    </div>
                    <p className="text-[11px] text-stone-400 leading-relaxed">
                      حرصاً على حمايتك من الاحتيال، تم حظر تبادل أرقام التواصل أو الحسابات البنكية الخارجية. يرجى إتمام جميع الاتفاقات والدفع عبر المنصة حصراً.
                    </p>
                  </div>

                  {messages.map((msg) => {
                    const isMe = msg.senderId === currentUser.id;
                    const isSystem = msg.isSystemNotice || msg.senderId === "system";

                    if (isSystem) {
                      return (
                        <div key={msg.id} className="my-2 p-3 rounded-2xl bg-red-950/40 border border-red-700/40 text-red-200 text-xs space-y-1 animate-in fade-in">
                          <div className="flex items-center gap-1.5 font-bold text-red-400">
                            <ShieldAlert className="w-4 h-4" />
                            <span>تنبيه نظام الحماية والامتثال</span>
                          </div>
                          <p className="text-[11px] leading-relaxed whitespace-pre-line text-red-200/90">
                            {msg.content}
                          </p>
                          <span className="text-[10px] text-red-400/60 block text-left">
                            {new Date(msg.timestamp).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? "items-start" : "items-end"}`}
                      >
                        <div className="flex items-center gap-1.5 text-[10px] text-stone-500 mb-1 px-1">
                          <span>{msg.senderName}</span>
                          <span>•</span>
                          <span>{new Date(msg.timestamp).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                        <div
                          className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                            isMe
                              ? "bg-amber-600 text-white rounded-br-none shadow-md shadow-amber-950/50"
                              : "bg-stone-800 text-stone-100 rounded-bl-none border border-stone-700"
                          }`}
                        >
                          <p className="whitespace-pre-line">{msg.content}</p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Bypass Warning Toast */}
                {bypassWarning && (
                  <div className="mx-4 mb-2 p-2.5 rounded-xl bg-red-900/90 text-white text-xs flex items-center justify-between gap-2 border border-red-500 animate-in slide-in-from-bottom-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />
                      <span>{bypassWarning}</span>
                    </div>
                    <button
                      onClick={() => setBypassWarning(null)}
                      className="text-white hover:text-stone-300 text-xs font-bold"
                    >
                      فهمت
                    </button>
                  </div>
                )}

                {/* Input Form */}
                <form onSubmit={handleSendMessage} className="p-3 bg-stone-950 border-t border-stone-800 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="اكتب رسالتك بأمان (يمنع إرسال الأرقام أو الروابط الخارجية)..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-40 shadow-md shadow-amber-950"
                  >
                    <Send className="w-4 h-4" />
                    <span>إرسال</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-stone-500">
                <MessageSquare className="w-12 h-12 mb-3 text-stone-600" />
                <h4 className="text-base font-bold text-stone-300 font-['Amiri'] mb-1">
                  اختر محادثة لبدء التواصل الآمن
                </h4>
                <p className="text-xs text-stone-400 max-w-sm">
                  يمكنك التواصل مع الأسر المنتجة والمرشدين السياحيين ومتابعة تفاصيل طلباتك وحجوزاتك بكل خصوصية.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* REPORT CONVERSATION MODAL */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-2xl text-stone-100 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2 text-red-400 font-bold">
                <Flag className="w-5 h-5" />
                <span>إبلاغ الإدارة عن المحادثة / نزاع</span>
              </div>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="p-1 rounded-xl bg-stone-800 text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {reportSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">تم استلام البلاغ بنجاح</h4>
                <p className="text-xs text-stone-400">
                  سيتولى فريق الرقابة ومسؤولو المنصة مراجعة سجلات المحادثة وحفظ حقوقك وفق الصلاحيات المعتمدة.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="space-y-4">
                <p className="text-xs text-stone-300 leading-relaxed">
                  عند تقديم هذا البلاغ، سيتمكن مسؤولو الإدارة من الاطلاع على سجلات المحادثة حصرياً للتحقق من المخالفة مع توثيق ذلك في سجل التدقيق الأمني (Audit Log).
                </p>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">سبب الإبلاغ:</label>
                  <select
                    value={reportReason}
                    onChange={(e: any) => setReportReason(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-red-500"
                  >
                    <option value="تبادل أرقام خارجية وتجاوز التطبيق">تبادل أرقام خارجية ومحاولة تجاوز التطبيق</option>
                    <option value="احتيال أو طلب دفع خارجي">طلب تحويل مالي أو دفع خارجي خارج المنصة</option>
                    <option value="عدم الالتزام بالطلب/الحجز">عدم الالتزام بتنفيذ الطلب أو موعد الرحلة</option>
                    <option value="سلوك غير لائق">سلوك أو ألفاظ غير لائقة</option>
                    <option value="أخرى">أسباب أخرى</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">تفاصيل الشكوى:</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="وضح ما حدث باختصار لمساعدة المشرفين..."
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-red-500 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsReportModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-semibold hover:bg-stone-700"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>إرسال البلاغ للإدارة</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
