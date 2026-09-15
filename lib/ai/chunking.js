import { newChunkId } from "@/lib/ai/extract";

const SECTION_PATTERNS = [
  { type: "warranty", re: /\bwarranty\b/i },
  { type: "care_instructions", re: /\bcare\b|maintenance/i },
  { type: "faq", re: /\bfaq\b|frequently asked/i },
  { type: "company_information", re: /\babout avalon\b|our story\b|mission\b|vision\b/i },
  { type: "product_specification", re: /\bspecification\b|\bspecs\b|dimensions|firmness/i },
  { type: "product_benefits", re: /\bbenefits\b|\bfeatures\b/i },
];

/**
 * Split document text into semantic sections (paragraph-based, not fixed char splits).
 */
export function chunkDocumentText(text, meta = {}) {
  const raw = String(text || "").trim();
  if (!raw) return [];

  const paragraphs = raw
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 40);

  const chunks = [];
  let buffer = [];
  let currentType = "document_section";

  function flush() {
    if (!buffer.length) return;
    const content = buffer.join("\n\n");
    chunks.push({
      content_type: currentType,
      content,
      metadata: {
        ...meta,
        source_type: meta.source_type || "document",
        content_type: currentType,
      },
    });
    buffer = [];
  }

  for (const para of paragraphs) {
    const matched = SECTION_PATTERNS.find((s) => s.re.test(para));
    if (matched && buffer.length) {
      flush();
      currentType = matched.type;
    } else if (matched) {
      currentType = matched.type;
    }
    buffer.push(para);
    if (buffer.join("\n\n").length > 1200) {
      flush();
      currentType = "document_section";
    }
  }
  flush();

  if (!chunks.length && raw.length) {
    chunks.push({
      content_type: "document_section",
      content: raw.slice(0, 4000),
      metadata: { ...meta, source_type: "document", content_type: "document_section" },
    });
  }

  return chunks.map((c) => ({
    ...c,
    chunk_id: newChunkId("doc"),
  }));
}
