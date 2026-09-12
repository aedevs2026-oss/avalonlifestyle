/**
 * Responsive overflow audit — run with dev server on :3000
 * node scripts/responsive-audit.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL || "http://localhost:3000";

const ROUTES = [
  "/",
  "/about",
  "/mattresses",
  "/furniture",
  "/why-avalon",
  "/resources",
  "/contact",
  "/product-catalog",
  "/find-a-dealer",
  "/become-a-dealer",
  "/try-before-you-buy",
  "/products/prince",
];

const VIEWPORTS = [
  { name: "mobile-320", width: 320, height: 568 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "laptop", width: 1280, height: 800 },
  { name: "desktop", width: 1440, height: 900 },
];

const issues = [];

async function checkPage(page, route, vp) {
  const url = `${BASE}${route}`;
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  } catch (e) {
    issues.push({ route, vp: vp.name, type: "load", detail: String(e.message) });
    return;
  }

  const metrics = await page.evaluate(() => {
    const doc = document.documentElement;
    const overflowX = doc.scrollWidth - doc.clientWidth;
    const targets = [];
    document.querySelectorAll("*").forEach((el) => {
      if (!(el instanceof HTMLElement)) return;
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return;
      if (r.right > window.innerWidth + 2) {
        const tag = el.tagName.toLowerCase();
        const cls = (el.className && String(el.className).slice(0, 80)) || "";
        targets.push(`${tag}.${cls}`);
      }
    });
    return {
      overflowX,
      offenders: [...new Set(targets)].slice(0, 8),
    };
  });

  if (metrics.overflowX > 1) {
    issues.push({
      route,
      vp: vp.name,
      type: "horizontal-overflow",
      detail: `${metrics.overflowX}px — ${metrics.offenders.join(", ")}`,
    });
  }
}

const browser = await chromium.launch();
for (const vp of VIEWPORTS) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await context.newPage();
  for (const route of ROUTES) {
    await checkPage(page, route, vp);
  }
  await context.close();
}
await browser.close();

console.log(JSON.stringify({ issueCount: issues.length, issues }, null, 2));
process.exit(issues.length > 0 ? 1 : 0);
