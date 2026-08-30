import { BypassFilterResult } from "../types";

/**
 * Helper to mask phone numbers for privacy and safety
 * E.g. "0501234567" -> "050****567"
 */
export function maskPhoneNumber(phone?: string): string {
  if (!phone) return "05******";
  const cleaned = phone.replace(/\s+/g, "");
  if (cleaned.length <= 6) return cleaned.slice(0, 2) + "****";
  const start = cleaned.slice(0, 3);
  const end = cleaned.slice(-3);
  return `${start}****${end}`;
}

/**
 * Filter engine to prevent sharing phone numbers, external WhatsApp links,
 * and social media bypasses inside in-app chat.
 */
export function checkMessageForBypass(text: string): BypassFilterResult {
  if (!text || typeof text !== "string") {
    return { isBlocked: false, sanitizedText: "" };
  }

  // 1. Normalize arabic numerals and clean subtle spacing attempts
  const normalizedText = text
    .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString())
    .toLowerCase();

  // 2. Detect WhatsApp links
  const whatsappRegex = /(wa\.me|api\.whatsapp\.com|chat\.whatsapp\.com|whatsapp\.com|واتساب|واتس\s*اب|واتس)/i;
  if (whatsappRegex.test(normalizedText)) {
    return {
      isBlocked: true,
      detectedType: "whatsapp_link",
      violationDescription: "تم منع إرسال روابط أو إشارات لتطبيق واتساب للحفاظ على أمان وضمان حقك المالي داخل المنصة.",
      sanitizedText: "[تم حجب رابط خارجي - يرجى إتمام التواصل والدفع داخل التطبيق]",
    };
  }

  // 3. Detect URLs, social handles, external websites
  const urlRegex = /(https?:\/\/|www\.|\.com|\.sa|\.net|\.org|t\.me|telegram|snapchat|سناب|انستقرام|تيك\s*توك|instagram\.com|tiktok\.com|twitter\.com|x\.com)/i;
  if (urlRegex.test(normalizedText)) {
    return {
      isBlocked: true,
      detectedType: "external_url",
      violationDescription: "تم منع إرسال روابط خارجية أو حسابات تواصل اجتماعي. جميع المعاملات والحجوزات تتم بأمان وحماية داخل التطبيق.",
      sanitizedText: "[تم حجب رابط تواصل خارجي]",
    };
  }

  // 4. Detect Saudi Phone Number patterns (05xxxxxxxx, +9665..., 9665..., 009665...)
  // Even with spaces, dashes, or dots between digits
  const digitSequence = normalizedText.replace(/[^0-9]/g, "");

  // Check if string contains 9 or 10 consecutive/spaced digits starting with 05 or 9665
  const saudiPhoneRegex = /(?:(?:\+|00)?966|0)?5[0-9]{8}/;
  const broadDigitsCheck = /(?:0\s*5|9\s*6\s*6\s*5)(?:\s*\d){7,8}/;
  const standaloneDigitsCheck = /\b\d{8,12}\b/;

  if (
    saudiPhoneRegex.test(digitSequence) || 
    broadDigitsCheck.test(normalizedText) || 
    (standaloneDigitsCheck.test(digitSequence) && digitSequence.startsWith("05"))
  ) {
    return {
      isBlocked: true,
      detectedType: "phone_number",
      violationDescription: "تم حظر إرسال رقم الجوال. للحفاظ على سلامتك وضمان حقوقك والتقييم والدعم الفني عند النزاع، يرجى إبقاء كافة التفاصيل في محادثة التطبيق.",
      sanitizedText: "[تم حجب رقم جوال لسياسة الخصوصية والأمان]",
    };
  }

  // 5. Spelled out Arabic numbers attempt (e.g. "صفر خمسة...")
  const arabicSpelledNumbers = /(صفر\s*خمسة|صفر\s*٥|جوالي|رقمي\s*هو|اتصل\s*بي\s*على|تواصل\s*معي\s*خاص)/i;
  if (arabicSpelledNumbers.test(normalizedText) && /\d{4,}/.test(digitSequence)) {
    return {
      isBlocked: true,
      detectedType: "phone_number",
      violationDescription: "يرجى عدم تبادل معلومات التواصل الشخصية لحمايتك المالية وتوثيق كافة مراحل الطلب.",
      sanitizedText: "[تم حجب وسيلة تواصل خارجية]",
    };
  }

  return {
    isBlocked: false,
    sanitizedText: text,
  };
}
