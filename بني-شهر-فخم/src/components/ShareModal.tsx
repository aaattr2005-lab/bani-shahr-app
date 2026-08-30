import React, { useState } from "react";
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  Send, 
  MessageCircle, 
  Twitter, 
  ExternalLink,
  MapPin,
  Sparkles
} from "lucide-react";
import { Attraction } from "../types";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  attraction: Attraction | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  attraction,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen || !attraction) return null;

  // Generate shareable link
  const currentUrl = typeof window !== "undefined" ? window.location.origin + window.location.pathname : "";
  const shareUrl = `${currentUrl}#attraction-${attraction.id}`;
  
  const shareTitle = `${attraction.name} - ديار بني شهر (${attraction.city})`;
  const shareText = `اكتشف ${attraction.name} في ${attraction.city} (الارتفاع: ${attraction.elevation || "السراة"}).\n${attraction.description}\n\n📍 زُر المنصة لاستكشاف ديار بني شهر:`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(`${shareTitle}\n${shareText}\n${shareUrl}`);
      } else {
        // Fallback
        const textarea = document.createElement("textarea");
        textarea.value = `${shareTitle}\n${shareText}\n${shareUrl}`;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    } catch (e) {
      console.error("Failed to copy link", e);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or not supported
      }
    } else {
      handleCopyLink();
    }
  };

  // Social sharing urls
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(`${shareTitle}\n${shareText}\n${shareUrl}`);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodedUrl}`;
  const telegramUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(shareTitle)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-stone-900 border border-stone-700 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl text-stone-100 relative animate-scaleUp">
        
        {/* Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-600/40 text-emerald-400 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-['Amiri'] text-stone-100">
                مشاركة المعلم السياحي
              </h3>
              <p className="text-xs text-stone-400">
                انشر جمال ديار بني شهر مع أصدقائك وعائلتك
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-100 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Attraction Summary Preview */}
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-stone-800/80 border border-stone-700/60">
            <img
              src={attraction.imageUrl}
              alt={attraction.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-700"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 mb-0.5">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="font-semibold">{attraction.city}</span>
                <span className="text-stone-500">•</span>
                <span className="text-amber-300">{attraction.elevation}</span>
              </div>
              <h4 className="font-bold text-sm text-stone-100 font-['Amiri'] truncate">
                {attraction.name}
              </h4>
              <p className="text-xs text-stone-400 truncate mt-0.5">
                {attraction.description}
              </p>
            </div>
          </div>

          {/* Social Share Buttons Grid */}
          <div className="space-y-2">
            <label className="text-xs text-stone-400 font-medium block">
              المشاركة المباشرة عبر التطبيقات:
            </label>

            <div className="grid grid-cols-3 gap-2.5">
              {/* WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-600/40 text-emerald-300 hover:text-emerald-100 transition-all hover:scale-105"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-600/20 flex items-center justify-center mb-1.5">
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-xs font-semibold">واتساب</span>
              </a>

              {/* Twitter / X */}
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-stone-800/90 hover:bg-stone-800 border border-stone-700 text-stone-300 hover:text-white transition-all hover:scale-105"
              >
                <div className="w-8 h-8 rounded-full bg-stone-700/50 flex items-center justify-center mb-1.5">
                  <Twitter className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-xs font-semibold">منصة X</span>
              </a>

              {/* Telegram */}
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-sky-950/60 hover:bg-sky-900 border border-sky-600/40 text-sky-300 hover:text-sky-100 transition-all hover:scale-105"
              >
                <div className="w-8 h-8 rounded-full bg-sky-600/20 flex items-center justify-center mb-1.5">
                  <Send className="w-4 h-4 text-sky-400" />
                </div>
                <span className="text-xs font-semibold">تيليجرام</span>
              </a>
            </div>
          </div>

          {/* Native Share button if supported */}
          {typeof navigator !== "undefined" && typeof (navigator as any).share === "function" && (
            <button
              onClick={handleNativeShare}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-semibold transition-colors"
            >
              <Share2 className="w-4 h-4 text-emerald-400" />
              <span>مشاركة عبر قائمة الهاتف (تطبيقات أخرى)</span>
            </button>
          )}

          {/* Copy Link Section */}
          <div className="space-y-2 pt-2 border-t border-stone-800">
            <label className="text-xs text-stone-400 font-medium block">
              نسخ الرابط المباشر:
            </label>

            <div className="flex items-center gap-2">
              <div className="flex-1 px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-300 truncate font-mono select-all">
                {shareUrl}
              </div>

              <button
                onClick={handleCopyLink}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isCopied
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950"
                    : "bg-emerald-800 hover:bg-emerald-700 text-white shadow-md shadow-stone-950"
                }`}
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-200" />
                    <span>تم النسخ!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>نسخ</span>
                  </>
                )}
              </button>
            </div>

            {isCopied && (
              <p className="text-center text-xs text-emerald-400 font-semibold animate-pulse">
                ✓ تم نسخ رابط وتفاصيل المعلم إلى الحافظة بنجاح
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
