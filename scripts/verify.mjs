import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const url = "http://localhost:3000/";
const out = "scripts/shots";
mkdirSync(out, { recursive: true });

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 834, height: 1112 },
  { name: "mobile", width: 390, height: 844 },
];

const browser = await chromium.launch();
const errors = [];
for (const v of viewports) {
  const ctx = await browser.newContext({ viewport: { width: v.width, height: v.height }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(`[${v.name}] pageerror: ${e.message}`));
  page.on("console", (m) => { if (m.type() === "error") errors.push(`[${v.name}] console: ${m.text()}`); });
  const resp = await page.goto(url, { waitUntil: "networkidle" });
  console.log(`${v.name} ${v.width}x${v.height}: HTTP ${resp.status()}`);

  await page.screenshot({ path: `${out}/${v.name}-top.png`, fullPage: false });
  // Trigger reveal animations by scrolling through the page, then settle
  await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const total = document.documentElement.scrollHeight;
    for (let y = 0; y < total; y += 600) { window.scrollTo(0, y); await sleep(60); }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `${out}/${v.name}-full.png`, fullPage: true });

  // Quick a11y/structure checks
  const checks = await page.evaluate(() => {
    const g = (sel) => Array.from(document.querySelectorAll(sel));
    return {
      h1: g("h1").length,
      h2: g("h2").length,
      sections: g("section[id]").map((s) => s.id),
      headerNav: !!document.querySelector("header nav"),
      reserveForm: !!document.querySelector("#reserve form"),
      jsonLd: !!document.querySelector('script[type="application/ld+json"]'),
      ctaButtons: g("a.btn, a[class*='btn-']").length,
      title: document.title,
    };
  });
  console.log(JSON.stringify(checks, null, 2));
  await ctx.close();
}

// Mobile nav disclosure
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.click('button[aria-label="Open menu"]');
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${out}/mobile-menu-open.png`, fullPage: false });
  await ctx.close();
}

// Interaction smoke test on desktop
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: "networkidle" });
await page.click('a[href="#reserve"]');
await page.waitForTimeout(800);
await page.fill('input[name="name"]', "Verifier");
await page.fill('input[name="email"]', "v@example.com");
await page.fill('input[name="phone"]', "5550000000");
await page.fill('input[name="date"]', "2026-06-01");
await page.fill('input[name="party"]', "2");
await page.click('button[type="submit"]');
await page.waitForTimeout(400);
const sentText = await page.textContent('#reserve [aria-live="polite"]');
console.log(`Form submit aria-live: ${sentText}`);
await page.screenshot({ path: `${out}/desktop-after-submit.png`, fullPage: false });
await ctx.close();

await browser.close();
if (errors.length) {
  console.log("\nERRORS:");
  errors.forEach((e) => console.log(" -", e));
  process.exit(1);
} else {
  console.log("\nNo runtime errors.");
}
