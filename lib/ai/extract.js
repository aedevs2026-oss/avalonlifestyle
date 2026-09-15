import { randomBytes } from "crypto";

const TEXT_TYPES = new Set([
  "text/plain",
  "text/csv",
  "application/json",
]);

export function extFromName(name) {
  const n = String(name || "").toLowerCase();
  const i = n.lastIndexOf(".");
  return i >= 0 ? n.slice(i + 1) : "";
}

export async function extractTextFromBuffer(buffer, fileName, mimeType) {
  const ext = extFromName(fileName);
  const warnings = [];

  if (ext === "txt" || mimeType === "text/plain") {
    return { text: buffer.toString("utf8"), warnings, structured: null };
  }

  if (ext === "json" || mimeType === "application/json") {
    try {
      const parsed = JSON.parse(buffer.toString("utf8"));
      return {
        text: JSON.stringify(parsed, null, 2),
        warnings,
        structured: parsed,
      };
    } catch {
      return { text: buffer.toString("utf8"), warnings: ["Invalid JSON — stored as plain text"], structured: null };
    }
  }

  if (ext === "csv" || mimeType === "text/csv") {
    const text = buffer.toString("utf8");
    const lines = text.split(/\r?\n/).filter(Boolean);
    const structured = lines.length
      ? { rows: lines.map((line) => line.split(",").map((c) => c.trim())) }
      : null;
    return { text, warnings, structured };
  }

  if (ext === "pdf" || mimeType === "application/pdf") {
    try {
      const pdfParse = (await import("pdf-parse")).default;
      const data = await pdfParse(buffer);
      return { text: data.text || "", warnings, structured: { pages: data.numpages } };
    } catch (e) {
      return { text: "", warnings: [`PDF extraction failed: ${e.message}`], structured: null };
    }
  }

  if (ext === "docx") {
    try {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      return { text: result.value || "", warnings: result.messages?.map((m) => m.message) || [], structured: null };
    } catch (e) {
      return { text: "", warnings: [`DOCX extraction failed: ${e.message}`], structured: null };
    }
  }

  if (ext === "xlsx") {
    try {
      const XLSX = await import("xlsx");
      const wb = XLSX.read(buffer, { type: "buffer" });
      const parts = [];
      const structured = { sheets: {} };
      for (const name of wb.SheetNames) {
        const sheet = wb.Sheets[name];
        const csv = XLSX.utils.sheet_to_csv(sheet);
        parts.push(`## Sheet: ${name}\n${csv}`);
        structured.sheets[name] = XLSX.utils.sheet_to_json(sheet, { defval: "" });
      }
      return { text: parts.join("\n\n"), warnings, structured };
    } catch (e) {
      return { text: "", warnings: [`XLSX extraction failed: ${e.message}`], structured: null };
    }
  }

  if (["jpg", "jpeg", "png", "webp"].includes(ext) || String(mimeType || "").startsWith("image/")) {
    warnings.push(
      "Image OCR is not enabled in this deployment. Upload a text/PDF catalogue or enter product data in Admin → Products.",
    );
    return { text: `[Image upload: ${fileName}]`, warnings, structured: null };
  }

  if (TEXT_TYPES.has(mimeType)) {
    return { text: buffer.toString("utf8"), warnings, structured: null };
  }

  return { text: "", warnings: [`Unsupported file type: ${ext || mimeType}`], structured: null };
}

export function newChunkId(prefix = "chk") {
  return `${prefix}_${Date.now()}_${randomBytes(4).toString("hex")}`;
}
