/**
 * Visual QA harness.
 *
 * Renders every route in Edge (Chromium channel) and writes full-page
 * screenshots to scripts/shots/<width>/<route>.png, reporting console errors,
 * failed requests and horizontal overflow for each.
 *
 *   node scripts/shoot.mjs                 # all routes at 1440
 *   node scripts/shoot.mjs 1440,390        # chosen widths
 *   node scripts/shoot.mjs 1440 /about     # one route
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = path.join(import.meta.dirname, "shots");

const ALL_ROUTES = [
  "/",
  "/about",
  "/why-avalon",
  "/mattresses",
  "/furniture",
  "/product-catalog",
  "/products/prince",
  "/resources",
  "/contact",
  "/find-a-dealer",
  "/become-a-dealer",
  "/try-before-you-buy",
];

const widths = (process.argv[2] ?? "1440").split(",").map(Number);
const routes = process.argv[3] ? [process.argv[3]] : ALL_ROUTES;

const slug = (r) => (r === "/" ? "home" : r.replace(/^\//, "").replace(/\//g, "-"));

const browser = await chromium.launch({ channel: "msedge" });
let problems = 0;

for (const width of widths) {
  await mkdir(path.join(OUT, String(width)), { recursive: true });
  const context = await browser.newContext({
    viewport: { width, height: 900 },
    deviceScaleFactor: 1,
  });

  for (const route of routes) {
    const page = await context.newPage();
    const errors = [];
    const failed = [];
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
    page.on("requestfailed", (r) => failed.push(r.url()));
    page.on("response", (r) => {
      if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
    });

    try {
      await page.goto(BASE + route, { waitUntil: "load", timeout: 60000 });
      // Settle lazy reveals and fonts.
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(900);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(400);
      await page.evaluate(() => document.fonts.ready);

      const overflow = await page.evaluate(() => {
        const de = document.documentElement;
        if (de.scrollWidth <= de.clientWidth + 1) return null;
        const bad = [];
        for (const el of document.querySelectorAll("body *")) {
          const r = el.getBoundingClientRect();
          if (r.width === 0) continue;
          if (r.right > de.clientWidth + 1 || r.left < -1) {
            bad.push(
              `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)} [${Math.round(r.left)}..${Math.round(r.right)}]`,
            );
          }
        }
        return {
          scrollWidth: de.scrollWidth,
          clientWidth: de.clientWidth,
          culprits: bad.slice(0, 6),
        };
      });

      const brokenImgs = await page.evaluate(() =>
        [...document.images]
          .filter((i) => i.complete && i.naturalWidth === 0)
          .map((i) => i.currentSrc || i.src),
      );

      await page.screenshot({
        path: path.join(OUT, String(width), `${slug(route)}.png`),
        fullPage: true,
      });

      const notes = [];
      if (overflow) {
        notes.push(
          `OVERFLOW ${overflow.scrollWidth}>${overflow.clientWidth} :: ${overflow.culprits.join(" | ")}`,
        );
      }
      if (brokenImgs.length) notes.push(`BROKEN IMG: ${brokenImgs.join(", ")}`);
      if (errors.length) notes.push(`CONSOLE: ${errors.slice(0, 4).join(" | ")}`);
      if (failed.length) notes.push(`REQ: ${[...new Set(failed)].slice(0, 4).join(", ")}`);

      if (notes.length) {
        problems++;
        console.log(`\n[${width}] ${route}`);
        for (const n of notes) console.log(`   ${n}`);
      } else {
        console.log(`[${width}] ${route}  ok`);
      }
    } catch (e) {
      problems++;
      console.log(`\n[${width}] ${route}  FAILED: ${e.message.split("\n")[0]}`);
    }
    await page.close();
  }
  await context.close();
}

await browser.close();
console.log(`\n${problems ? `${problems} route(s) with notes` : "all clean"}`);
