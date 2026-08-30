import React, { useState, useRef, useEffect } from "react";
import { 
  X, 
  Send, 
  Sparkles, 
  Compass, 
  Landmark, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  RotateCcw, 
  Bot, 
  User,
  Quote
} from "lucide-react";

interface SmartAiGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

interface Message {
  role: "user" | "model";
  text: string;
}

export const SmartAiGuideModal: React.FC<SmartAiGuideModalProps> = ({
  isOpen,
  onClose,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: `أرحبوا تراحيب المطر والسيل! 🌿\n\nأنا "مرشد بني شهر الذكي"، رفيقك المطلع على تاريخ وقلاع وتراث ديار قبائل بني شهر في السراة وتهامة (النماص، تنومة، المجاردة، وبقية الأودية والقرى).\n\nيسعدني إرشادك لأجمل الشلالات والمطلات، شرح المفردات التراثية، أو سرد بطولات وقصائد الأجداد. ما الذي تود استكشافه اليوم؟`,
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    "ما هو نسب قبائل بني شهر وديارهم التاريخية؟",
    "ما هو أفضل وقت وأنشطة زيارة شلال الدهناء وجبل منعاء؟",
    "حدثني عن فن المدقال الشهري والعرضة وطريقة أدائهما",
    "ما هي أشهر أكلات بني شهر التراثية ومكوناتها؟",
    "ما معنى كلمة 'هَوْلَه' و'أرحبوا تراحيب المطر' في اللهجة؟",
    "اقترح لي خطة يوم كامل عائلي بين تنومة والنماص",
  ];

  useEffect(() => {
    if (initialPrompt) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query || loading) return;

    const newMessages: Message[] = [...messages, { role: "user", text: query }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          conversationHistory: newMessages.slice(-6),
        }),
      });

      const data = await res.json();
      const botReply = data.reply || "حياكم الله في ديار بني شهر؛ يسعدني الإجابة على أي استفسار آخر.";
      setMessages([...newMessages, { role: "model", text: botReply }]);
    } catch (error) {
      console.error(error);
      setMessages([
        ...newMessages,
        {
          role: "model",
          text: "أهلاً بك؛ ديار بني شهر في أعالي السراة ترحب بكم دائماً بين شلالات تنومة وقصور النماص ومطلات السحاب.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSpeak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*#]/g, ""));
      utterance.lang = "ar-SA";
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        role: "model",
        text: `أرحبوا تراحيب المطر والسيل! 🌿\n\nأنا "مرشد بني شهر الذكي". يسعدني الإجابة عن أي سؤال يخص تاريخ، معالم، أكلات، أو مسارات ديار بني شهر في تنومة والنماص وسراة عسير.`,
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-stone-900 border border-stone-700 rounded-3xl max-w-3xl w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden text-stone-100">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-700 to-amber-700 flex items-center justify-center text-amber-200 shadow-md border border-emerald-400/30">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-['Amiri'] font-bold text-lg text-stone-50">
                  المرشد التراثي والسياحي الذكي لبني شهر
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Gemini 3.7 Flash
                </span>
              </div>
              <p className="text-xs text-stone-400 font-light">
                خبير تاريخ السراة، القلاع، الشلالات، الفنون، ومسارات الهايكنج
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetChat}
              title="محادثة جديدة"
              className="p-2 rounded-xl bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              id="close-ai-guide-modal-btn"
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-800 text-stone-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preset Prompt Suggestions */}
        <div className="px-4 py-2 bg-stone-950/70 border-b border-stone-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] text-amber-400 font-medium shrink-0">مقترحات:</span>
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="shrink-0 text-[11px] px-3 py-1 rounded-full bg-stone-800/80 hover:bg-emerald-950 text-stone-300 hover:text-emerald-300 border border-stone-700 hover:border-emerald-700 transition-colors whitespace-nowrap"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg, index) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={index}
                className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isUser
                      ? "bg-amber-700 text-amber-100"
                      : "bg-emerald-800 text-emerald-100"
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? "bg-amber-950/90 text-amber-50 rounded-tr-none border border-amber-800/50"
                      : "bg-stone-800/90 text-stone-200 rounded-tl-none border border-stone-700 font-light"
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.text}</div>

                  {!isUser && (
                    <div className="flex items-center gap-3 mt-3 pt-2 border-t border-stone-700/60 text-[11px] text-stone-400">
                      <button
                        onClick={() => handleCopy(msg.text, index)}
                        className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>تم النسخ</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>نسخ</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleSpeak(msg.text)}
                        className="hover:text-amber-400 flex items-center gap-1 transition-colors"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>استماع صوتي</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-stone-400 animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-emerald-950 flex items-center justify-center text-emerald-400 border border-emerald-800">
                <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: "3s" }} />
              </div>
              <span>المرشد يستحضر التراث والمعلومات السياحية...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Field */}
        <div className="p-3 sm:p-4 bg-stone-950 border-t border-stone-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              id="ai-guide-chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب سؤالك عن بني شهر، المعالم، الأكلات، أو مسارات الجبال..."
              className="flex-1 px-4 py-3 rounded-2xl bg-stone-800 border border-stone-700 text-stone-100 placeholder-stone-400 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <button
              id="ai-guide-send-btn"
              type="submit"
              disabled={!input.trim() || loading}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-sm font-semibold shadow-md transition-all disabled:opacity-40 flex items-center gap-1.5"
            >
              <Send className="w-4 h-4 rotate-180" />
              <span className="hidden sm:inline">إرسال</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
