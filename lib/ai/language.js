/** Language detection & reply locale for Ask Avalon (EN / Tamil / Tanglish). */

export const CHAT_LANGUAGES = ["en", "ta", "auto"];

/**
 * @param {string} text
 * @returns {'en'|'ta'|'tanglish'}
 */
export function detectLanguageFromText(text) {
  const q = String(text || "");
  if (/[\u0B80-\u0BFF]/.test(q)) return "ta";
  if (/\b(enakku|enaku|entha|ethu|irukkum|venum|venum|kulla|nalla|epdi|sollunga|pathi)\b/i.test(q)) {
    return "tanglish";
  }
  return "en";
}

/**
 * @param {string} preferred - en | ta | auto
 * @param {string} question
 */
export function resolveReplyLanguage(preferred, question) {
  const detected = detectLanguageFromText(question);
  if (preferred === "ta") return "ta";
  if (preferred === "en") return "en";
  return detected;
}

export function speechRecognitionLocale(preferred, question) {
  const lang = preferred === "auto" ? detectLanguageFromText(question) : preferred;
  if (lang === "ta") return "ta-IN";
  return "en-IN";
}

export function speechSynthesisLocale(replyLang) {
  if (replyLang === "ta" || replyLang === "tanglish") return "ta-IN";
  return "en-IN";
}

export function replyLanguageInstruction(replyLang) {
  if (replyLang === "ta") {
    return "Respond entirely in Tamil script (தமிழ்). Keep Avalon product names in English.";
  }
  if (replyLang === "tanglish") {
    return "Respond in Tanglish (natural Tamil + English mix, as customers speak in Tamil Nadu). Keep product names in English.";
  }
  return "Respond in clear English (Indian English is fine).";
}

export function localizedHandoffMessage(replyLang) {
  if (replyLang === "ta") {
    return "சரியான தகவல் உங்களுக்கு கிடைக்க வேண்டும். Avalon பிரதிநிதியுடன் பேச விரும்புகிறீர்களா?";
  }
  if (replyLang === "tanglish") {
    return "Correct information ku help pannalam. Avalon representative-oda pesanum-a?";
  }
  return "I want to make sure you get the right information. Would you like to speak with an Avalon representative?";
}

export function localizedDealerEmptyMessage(replyLang) {
  if (replyLang === "ta") {
    return "உங்கள் கேள்விக்கு பொருந்தும் dealer விவரங்கள் எங்கள் அங்கீகரிக்கப்பட்ட பட்டியலில் இல்லை. வலைத்தளத்தில் Find a Dealer பயன்படுத்துங்கள் அல்லது customer support-ஐ தொடர்பு கொள்ளுங்கள்.";
  }
  if (replyLang === "tanglish") {
    return "Unga query-ku match aagura dealer details approved list-la illa. Website-la Find a Dealer try pannunga illa support contact pannunga.";
  }
  return "I do not have dealer locations matching that query in our approved directory. Try Find a Dealer on our website or contact customer support.";
}
