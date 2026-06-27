import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = "docs/screenshots";
mkdirSync(OUT, { recursive: true });

// Per-section captures for the portfolio gallery.
// Each entry screenshots a single section element so the shots are clean and uniform.
const SECTIONS = [
  { name: "section-pillars", selector: "main > section:nth-of-type(2)" },
  { name: "section-menu", selector: "#menu" },
  { name: "section-story", selector: "#story" },
  { name: "section-press", selector: "#press" },
  { name: "section-reserve", selector: "#reserve" },
  { name: "section-footer", selector: "footer" },
];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();
await page.goto(BASE, { waitUntil: "domcontentloaded" });
await page.waitForLoadState("load");
await page.waitForTimeout(1500); // settle fonts + hero image

// Scroll the whole page once to trigger IntersectionObserver reveal animations, then settle.
await page.evaluate(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const total = document.documentElement.scrollHeight;
  for (let y = 0; y < total; y += 500) { window.scrollTo(0, y); await sleep(80); }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(1200);

// Full-page tour shot (keep the nav in place at the top).
await page.screenshot({ path: `${OUT}/home-full.png`, fullPage: true });
console.log("captured home-full");

for (const s of SECTIONS) {
  const el = s.selector ? page.locator(s.selector).first() : s.locator(page).first();
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  // Hide the fixed header just for this shot so it doesn't float mid-section,
  // then restore it. Toggling per-shot avoids leaving React's scroll handler
  // reconciling against a hidden node across scrolls.
  await el.evaluate((node) => {
    const h = document.querySelector("header");
    if (h) h.style.visibility = "hidden";
  });
  await el.screenshot({ path: `${OUT}/${s.name}.png` });
  await el.evaluate(() => {
    const h = document.querySelector("header");
    if (h) h.style.visibility = "";
  });
  console.log(`captured ${s.name}`);
}

await ctx.close();
await browser.close();
console.log("done →", OUT);
