"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
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
  X,
} from "lucide-react";
import { assets } from "@/lib/assets";
import ChatProductCarousel from "@/components/chat/ChatProductCarousel";
import ChatComparisonGrid from "@/components/chat/ChatComparisonGrid";
import ChatDealerList from "@/components/chat/ChatDealerList";
import "./ask-avalon.css";

const PRIMARY_ACTIONS = [
  {
    label: "Find my perfect mattress",
    icon: BedDouble,
    prompt: "I need help finding the right Avalon mattress for me",
  },
  {
    label: "Compare products",
    icon: GitCompare,
    prompt: "Compare Prince and King mattresses",
  },
  {
    label: "Find a dealer near you",
    icon: MapPin,
    prompt: "Where can I buy Avalon mattresses near me?",
  },
  {
    label: "Ask about Avalon",
    icon: Sparkles,
    prompt: "Tell me about Avalon Premium Mattress",
  },
];

const QUICK_ACTIONS = [
  { label: "Find my mattress", icon: BedDouble, prompt: "Recommend an Avalon mattress for me" },
  { label: "Compare products", icon: GitCompare, prompt: "Compare two Avalon mattresses" },
  { label: "Find a dealer", icon: MapPin, prompt: "Find a dealer near me" },
  { label: "Warranty info", icon: BadgeCheck, prompt: "What is the warranty on Avalon mattresses?" },
  { label: "Care & maintenance", icon: Settings, prompt: "How do I care for my Avalon mattress?" },
  { label: "Offers & discounts", icon: Tag, prompt: "Are there any current offers on Avalon mattresses?" },
  { label: "Track order", icon: Package, prompt: "I want to talk to someone about my order" },
  { label: "Talk to an expert", icon: Headphones, prompt: "I would like to speak with an Avalon representative" },
];

const TOPIC_PILLS = ["Mattresses", "Sofas", "Warranty", "Offers"];

const POPULAR = [
  "Best mattress for back pain?",
  "Which mattress is good for side sleepers?",
  "Show mattresses under ₹30,000",
  "What is the difference between Prince and King?",
];

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
  const listRef = useRef(null);
  const recognitionRef = useRef(null);

  const inChat = messages.length > 0;

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
      setMessages((m) => [...m, { role: "user", content: q }]);
      setLoading(true);
      try {
        const res = await fetch("/api/ai-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: q, conversationId }),
        });
        const json = await res.json();
        if (json.conversationId) setConversationId(json.conversationId);
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: json.answer || "Sorry, I could not answer that.",
            products: json.products || [],
            comparison: json.comparison || null,
            dealers: json.dealers || [],
            handoff: json.handoff,
          },
        ]);
      } catch {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: "Something went wrong. Please try again or contact support." },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [conversationId, input, loading],
  );

  function startVoice() {
    const SR = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SR) {
      setVoiceMode(true);
      return;
    }
    setVoiceMode(true);
    const rec = new SR();
    rec.lang = "en-IN";
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
  }

  function stopVoice() {
    recognitionRef.current?.stop();
    setListening(false);
    setVoiceMode(false);
  }

  function pillPrompt(topic) {
    const map = {
      Mattresses: "Show me Avalon mattresses",
      Sofas: "Tell me about Avalon furniture",
      Warranty: "What warranty do Avalon mattresses include?",
      Offers: "Are there offers on Avalon mattresses?",
    };
    send(map[topic] || topic);
  }

  function handleCompare(name) {
    setInput(`Compare ${name} and `);
    if (listRef.current?.closest(".aa-panel-body")) {
      const footer = document.querySelector(".aa-input-row input");
      footer?.focus();
    }
  }

  function goHome() {
    setMessages([]);
    setVoiceMode(false);
    setInput("");
  }

  if (!open) {
    return (
      <button
        type="button"
        className={`aa-launcher${isMobile ? " aa-launcher--mobile" : ""}`}
        aria-label="Open Ask Avalon"
        onClick={() => {
          setOpen(true);
          setMinimized(false);
        }}
      >
        <span className="aa-launcher-icon">
          <MessageCircle size={isMobile ? 22 : 20} />
        </span>
        <span className="aa-launcher-text">
          Ask Avalon
          {!isMobile ? <small>Your sleep &amp; shopping assistant</small> : null}
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
        aria-label="Ask Avalon"
      >
        <header className="aa-header">
          {isMobile && inChat ? (
            <button type="button" className="aa-header-btn aa-header-back" aria-label="Back to home" onClick={goHome}>
              <ArrowLeft size={20} />
            </button>
          ) : null}
          <div className="aa-header-brand">
            <Image src={assets.brand.logo} alt="Avalon" width={100} height={32} />
            <div>
              <div className="aa-header-title">Ask Avalon</div>
              <div className="aa-status">
                <span className="aa-status-dot" />
                Online
              </div>
            </div>
          </div>
          <div className="aa-header-actions">
            {!isMobile ? (
              <button
                type="button"
                className="aa-header-btn"
                aria-label="Minimize"
                onClick={() => setMinimized((m) => !m)}
              >
                <Minus size={18} />
              </button>
            ) : null}
            <button type="button" className="aa-header-btn" aria-label="Close" onClick={() => setOpen(false)}>
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
                {listening ? "I'm listening…" : "Voice search"}
              </p>
              <p className="aa-voice-hint">
                Try saying &ldquo;Find a medium firm mattress under thirty thousand rupees&rdquo;
              </p>
              <button type="button" className="aa-btn aa-btn-outline" onClick={stopVoice}>Cancel</button>
            </div>
          ) : !inChat ? (
            <>
              <div className="aa-hero">
                <Image src={assets.home.hero} alt="" fill sizes="400px" className="object-cover" />
                <div className="aa-hero-caption">Better Sleep. A Brighter Tomorrow.</div>
              </div>
              <div className="aa-home">
                <p className="aa-greeting">
                  <strong>Hi! I&apos;m Ask Avalon 👋</strong>
                  I can help you choose the right mattress, compare models, find dealers, and answer questions using
                  approved Avalon product information.
                </p>
                <div className="aa-action-grid">
                  {PRIMARY_ACTIONS.map((a) => (
                    <button key={a.label} type="button" className="aa-action-card" onClick={() => send(a.prompt)}>
                      <a.icon className="aa-action-card-icon" size={22} strokeWidth={1.75} />
                      <span>{a.label}</span>
                    </button>
                  ))}
                </div>
                <div className="aa-quick-grid aa-quick-grid--desktop">
                  {QUICK_ACTIONS.map((a) => (
                    <button key={a.label} type="button" className="aa-quick-tile" onClick={() => send(a.prompt)}>
                      <a.icon size={20} strokeWidth={1.75} />
                      {a.label}
                    </button>
                  ))}
                </div>
                <div className="aa-quick-scroll aa-quick-scroll--mobile">
                  {QUICK_ACTIONS.slice(0, 6).map((a) => (
                    <button key={a.label} type="button" className="aa-quick-chip" onClick={() => send(a.prompt)}>
                      <a.icon size={16} strokeWidth={1.75} />
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="aa-pills">
                {TOPIC_PILLS.map((t) => (
                  <button key={t} type="button" className="aa-pill" onClick={() => pillPrompt(t)}>
                    {t}
                  </button>
                ))}
              </div>
              <div className="aa-popular">
                <h3>Popular questions</h3>
                {POPULAR.map((q) => (
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
                        <Link href="/find-a-dealer">Find dealer</Link>
                        <Link href="/contact">Request callback</Link>
                        <a href="https://wa.me/" rel="noopener noreferrer">WhatsApp</a>
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
                placeholder="Type your question…"
                maxLength={2000}
                aria-label="Message"
              />
              <button
                type="button"
                className={`aa-mic-btn${listening ? " is-active" : ""}`}
                aria-label="Voice input"
                onClick={startVoice}
              >
                <Mic size={20} />
              </button>
              <button type="submit" className="aa-send-btn" disabled={loading} aria-label="Send">
                <Send size={18} />
              </button>
            </form>
          </footer>
        ) : null}
      </div>
    </>
  );
}
