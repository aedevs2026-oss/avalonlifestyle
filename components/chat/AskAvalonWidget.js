"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  BedDouble,
  ChevronRight,
  GitCompare,
  Headphones,
  MapPin,
  MessageCircle,
  Mic,
  Minus,
  Package,
  Send,
  Settings,
  Sparkles,
  Tag,
  Volume2,
  X,
} from "lucide-react";
import { assets } from "@/lib/assets";
import {
  detectLanguageFromText,
  speechRecognitionLocale,
  speechSynthesisLocale,
} from "@/lib/ai/language";
import { getChatCopy, uiLocaleFromPreference } from "@/components/chat/chatLocale";
import ChatProductCarousel from "@/components/chat/ChatProductCarousel";
import ChatComparisonGrid from "@/components/chat/ChatComparisonGrid";
import ChatDealerList from "@/components/chat/ChatDealerList";
import "./ask-avalon.css";

const LANG_STORAGE_KEY = "aa-lang-pref";
const PRIMARY_ICONS = [BedDouble, GitCompare, MapPin, Sparkles];
const QUICK_ICONS = [BedDouble, GitCompare, MapPin, BadgeCheck, Settings, Tag, Package, Headphones];

function inferSpeechLang(langPref, text) {
  if (langPref === "ta") return "ta";
  if (langPref === "en") return "en";
  return detectLanguageFromText(text);
}

export default function AskAvalonWidget() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [listening, setListening] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [langPref, setLangPref] = useState("auto");
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const listRef = useRef(null);
  const recognitionRef = useRef(null);

  const uiLocale = uiLocaleFromPreference(langPref);
  const copy = useMemo(() => getChatCopy(uiLocale), [uiLocale]);

  const inChat = messages.length > 0;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = sessionStorage.getItem(LANG_STORAGE_KEY);
    if (saved === "en" || saved === "ta" || saved === "auto") setLangPref(saved);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(LANG_STORAGE_KEY, langPref);
  }, [langPref]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 750px)");
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!open || !isMobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("aa-chat-open");
    return () => {
      document.body.style.overflow = prev;
      document.documentElement.classList.remove("aa-chat-open");
    };
  }, [open, isMobile]);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open, loading]);

  const send = useCallback(
    async (text) => {
      const q = (text || input).trim();
      if (!q || loading) return;
      setInput("");
      setVoiceMode(false);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        setSpeakingIndex(null);
      }
      setMessages((m) => [...m, { role: "user", content: q }]);
      setLoading(true);
      try {
        const res = await fetch("/api/ai-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: q, conversationId, preferredLanguage: langPref }),
        });
        const json = await res.json();
        if (json.conversationId) setConversationId(json.conversationId);
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: json.answer || copy.errorAnswer,
            products: json.products || [],
            comparison: json.comparison || null,
            dealers: json.dealers || [],
            handoff: json.handoff,
          },
        ]);
      } catch {
        setMessages((m) => [...m, { role: "assistant", content: copy.errorGeneric }]);
      } finally {
        setLoading(false);
      }
    },
    [conversationId, input, loading, langPref, copy.errorAnswer, copy.errorGeneric],
  );

  const startVoice = useCallback(() => {
    const SR = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SR) {
      setVoiceMode(true);
      return;
    }
    setVoiceMode(true);
    const rec = new SR();
    rec.lang = speechRecognitionLocale(langPref, input);
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    recognitionRef.current = rec;
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setListening(false);
      setVoiceMode(false);
      send(transcript);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    setListening(true);
    rec.start();
  }, [input, langPref, send]);

  function stopVoice() {
    recognitionRef.current?.stop();
    setListening(false);
    setVoiceMode(false);
  }

  function toggleSpeak(index, text) {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }
    window.speechSynthesis.cancel();
    const replyLang = inferSpeechLang(langPref, text);
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = speechSynthesisLocale(replyLang);
    utter.onend = () => setSpeakingIndex(null);
    utter.onerror = () => setSpeakingIndex(null);
    setSpeakingIndex(index);
    window.speechSynthesis.speak(utter);
  }

  function handleCompare(name) {
    setInput(`Compare ${name} and `);
    const footer = document.querySelector(".aa-input-row input");
    footer?.focus();
  }

  function goHome() {
    setMessages([]);
    setVoiceMode(false);
    setInput("");
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        className={`aa-launcher${isMobile ? " aa-launcher--mobile" : ""}`}
        aria-label={copy.launcherLabel}
        onClick={() => {
          setOpen(true);
          setMinimized(false);
        }}
      >
        <span className="aa-launcher-icon">
          <MessageCircle size={isMobile ? 22 : 20} />
        </span>
        <span className="aa-launcher-text">
          {copy.launcherTitle}
          {!isMobile ? <small>{copy.launcherSubtitle}</small> : null}
        </span>
        {isMobile ? <ChevronRight size={18} className="aa-launcher-chevron" aria-hidden /> : null}
      </button>
    );
  }

  return (
    <>
      <div className="aa-backdrop" aria-hidden onClick={() => setOpen(false)} />
      <div
        className={`aa-panel aa-panel--desktop${minimized ? " aa-panel--minimized" : ""}${isMobile ? " aa-panel--mobile" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={copy.dialogLabel}
      >
        <header className="aa-header">
          {isMobile && inChat ? (
            <button type="button" className="aa-header-btn aa-header-back" aria-label={copy.backHome} onClick={goHome}>
              <ArrowLeft size={20} />
            </button>
          ) : null}
          <div className="aa-header-brand">
            <Image src={assets.brand.logo} alt="Avalon" width={100} height={32} />
            <div>
              <div className="aa-header-title">{copy.launcherTitle}</div>
              <div className="aa-status">
                <span className="aa-status-dot" />
                {copy.online}
              </div>
            </div>
          </div>
          <div className="aa-header-actions">
            <div className="aa-lang-toggle" role="group" aria-label={copy.langAria}>
              {["auto", "en", "ta"].map((code) => (
                <button
                  key={code}
                  type="button"
                  className={langPref === code ? "is-active" : ""}
                  onClick={() => setLangPref(code)}
                  aria-pressed={langPref === code}
                >
                  {code === "auto" ? copy.langAuto : code === "en" ? copy.langEn : copy.langTa}
                </button>
              ))}
            </div>
            {!isMobile ? (
              <button
                type="button"
                className="aa-header-btn"
                aria-label={copy.minimize}
                onClick={() => setMinimized((m) => !m)}
              >
                <Minus size={18} />
              </button>
            ) : null}
            <button type="button" className="aa-header-btn" aria-label={copy.close} onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>
        </header>

        <div className="aa-panel-body" ref={listRef}>
          {voiceMode ? (
            <div className="aa-voice-screen">
              <div className="aa-voice-ring">
                <Mic size={40} />
              </div>
              <p className="font-semibold text-[var(--avalon-navy)]">
                {listening ? copy.listening : copy.voiceSearch}
              </p>
              <p className="aa-voice-hint">{copy.voiceHint}</p>
              <button type="button" className="aa-btn aa-btn-outline" onClick={stopVoice}>{copy.cancel}</button>
            </div>
          ) : !inChat ? (
            <>
              <div className="aa-hero">
                <Image src={assets.home.hero} alt="" fill sizes="400px" className="object-cover" />
                <div className="aa-hero-caption">{copy.heroCaption}</div>
              </div>
              <div className="aa-home">
                <p className="aa-greeting">
                  <strong>{copy.greetingTitle}</strong>
                  {copy.greetingBody}
                </p>
                <div className="aa-action-grid">
                  {copy.primaryActions.map((a, i) => {
                    const Icon = PRIMARY_ICONS[i] || Sparkles;
                    return (
                      <button key={a.label} type="button" className="aa-action-card" onClick={() => send(a.prompt)}>
                        <Icon className="aa-action-card-icon" size={22} strokeWidth={1.75} />
                        <span>{a.label}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="aa-quick-grid aa-quick-grid--desktop">
                  {copy.quickActions.map((a, i) => {
                    const Icon = QUICK_ICONS[i] || Sparkles;
                    return (
                      <button key={a.label} type="button" className="aa-quick-tile" onClick={() => send(a.prompt)}>
                        <Icon size={20} strokeWidth={1.75} />
                        {a.label}
                      </button>
                    );
                  })}
                </div>
                <div className="aa-quick-scroll aa-quick-scroll--mobile">
                  {copy.quickActions.slice(0, 6).map((a, i) => {
                    const Icon = QUICK_ICONS[i] || Sparkles;
                    return (
                      <button key={a.label} type="button" className="aa-quick-chip" onClick={() => send(a.prompt)}>
                        <Icon size={16} strokeWidth={1.75} />
                        {a.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="aa-pills">
                {copy.topicPills.map((t) => (
                  <button key={t.label} type="button" className="aa-pill" onClick={() => send(t.prompt)}>
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="aa-popular">
                <h3>{copy.popularTitle}</h3>
                {copy.popular.map((q) => (
                  <button key={q} type="button" onClick={() => send(q)}>
                    {q}
                    <ChevronRight size={16} />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="aa-thread">
              {messages.map((msg, i) => (
                <div key={i}>
                  <div className={`aa-bubble aa-bubble--${msg.role === "user" ? "user" : "bot"}`}>
                    <p>{msg.content}</p>
                    {msg.role === "assistant" ? (
                      <button
                        type="button"
                        className={`aa-listen-btn${speakingIndex === i ? " is-speaking" : ""}`}
                        aria-label={speakingIndex === i ? copy.stopListen : copy.listen}
                        onClick={() => toggleSpeak(i, msg.content)}
                      >
                        <Volume2 size={16} />
                        <span>{speakingIndex === i ? copy.stopListen : copy.listen}</span>
                      </button>
                    ) : null}
                    {msg.role === "assistant" && msg.comparison ? (
                      <ChatComparisonGrid comparison={msg.comparison} products={msg.products} />
                    ) : null}
                    {msg.role === "assistant" && msg.products?.length && !msg.comparison ? (
                      <ChatProductCarousel products={msg.products} onCompare={handleCompare} />
                    ) : null}
                    {msg.role === "assistant" && msg.dealers?.length ? (
                      <ChatDealerList dealers={msg.dealers} />
                    ) : null}
                    {msg.handoff ? (
                      <div className="aa-handoff">
                        <Link href="/find-a-dealer">{copy.findDealer}</Link>
                        <Link href="/contact">{copy.requestCallback}</Link>
                        <a href="https://wa.me/" rel="noopener noreferrer">{copy.whatsapp}</a>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
              {loading ? (
                <div className="aa-bubble aa-bubble--bot aa-typing" aria-label="Loading">
                  <span />
                  <span />
                  <span />
                </div>
              ) : null}
            </div>
          )}
        </div>

        {!minimized && !voiceMode ? (
          <footer className="aa-panel-footer">
            <form
              className="aa-input-row"
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={copy.inputPlaceholder}
                maxLength={2000}
                aria-label={copy.messageLabel}
              />
              <button
                type="button"
                className={`aa-mic-btn${listening ? " is-active" : ""}`}
                aria-label={copy.voiceInput}
                onClick={startVoice}
              >
                <Mic size={20} />
              </button>
              <button type="submit" className="aa-send-btn" disabled={loading} aria-label={copy.send}>
                <Send size={18} />
              </button>
            </form>
          </footer>
        ) : null}
      </div>
    </>
  );
}
