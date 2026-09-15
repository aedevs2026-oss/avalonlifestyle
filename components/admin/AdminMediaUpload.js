"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { uploadAdminMedia } from "@/lib/admin/upload";

/**
 * @param {object} props
 * @param {string} props.label
 * @param {string} props.value - current URL
 * @param {(url: string) => void} props.onChange
 * @param {string} [props.bucket]
 * @param {string} [props.folder]
 * @param {string} [props.accept]
 * @param {boolean} [props.showPreview]
 */
export default function AdminMediaUpload({
  label,
  value,
  onChange,
  bucket = "catalog-media",
  folder = "uploads",
  accept = "image/jpeg,image/png,image/webp,image/gif",
  showPreview = true,
}) {
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function onPick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("bucket", bucket);
    fd.append("folder", folder);

    startTransition(async () => {
      try {
        const result = await uploadAdminMedia(fd);
        onChange(result.url);
      } catch (err) {
        setError(err.message || "Upload failed");
      } finally {
        e.target.value = "";
      }
    });
  }

  const isImage = value && /\.(jpe?g|png|gif|webp|svg)(\?|$)/i.test(value);

  return (
    <div className="space-y-2">
      <span className="admin-label">{label}</span>
      <input
        className="admin-input text-xs"
        placeholder="https://… or upload below"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="flex flex-wrap items-center gap-3">
        <label className="admin-btn admin-btn-ghost cursor-pointer text-xs">
          {pending ? "Uploading…" : "Upload to Supabase"}
          <input
            type="file"
            className="hidden"
            accept={accept}
            disabled={pending}
            onChange={onPick}
          />
        </label>
        {value ? (
          <button
            type="button"
            className="text-xs text-[var(--admin-muted)] underline"
            onClick={() => onChange("")}
          >
            Clear
          </button>
        ) : null}
      </div>
      {error ? <p className="text-xs text-red-300">{error}</p> : null}
      {showPreview && value && isImage ? (
        <div className="relative mt-2 h-24 w-32 overflow-hidden rounded-lg border border-[var(--admin-border)] bg-black/20">
          <Image src={value} alt="" fill className="object-contain p-1" unoptimized />
        </div>
      ) : null}
      {value && !isImage ? (
        <p className="truncate text-xs text-[var(--admin-muted)]">{value}</p>
      ) : null}
    </div>
  );
}
