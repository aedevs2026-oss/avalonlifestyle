/**
 * Build share payload for a product page + link to the product catalogue.
 */
export function buildProductShareContent(product, origin) {
  const base = origin || "https://avalonmattress.in";
  const productUrl = `${base}/products/${product.slug}`;
  const catalogUrl = `${base}/product-catalog`;

  const title = `${product.name} | Avalon Premium Mattress`;
  const text = [
    product.tagline,
    "",
    `View this mattress: ${productUrl}`,
    `Browse & download our product catalogue: ${catalogUrl}`,
  ].join("\n");

  return { title, text, url: productUrl, catalogUrl };
}

/**
 * Native share when available; otherwise copy text to clipboard.
 */
export async function shareProduct(product) {
  if (typeof window === "undefined") {
    return { ok: false, method: null };
  }

  const { title, text, url } = buildProductShareContent(
    product,
    window.location.origin,
  );

  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return { ok: true, method: "share" };
    } catch (err) {
      if (err?.name === "AbortError") {
        return { ok: false, method: "share", aborted: true };
      }
    }
  }

  try {
    await navigator.clipboard.writeText(text);
    return { ok: true, method: "clipboard" };
  } catch {
    return { ok: false, method: null };
  }
}
