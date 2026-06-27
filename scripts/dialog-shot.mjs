import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = "scripts/__screenshots__";
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();

for (const [name, viewport] of [
  ["desktop", { width: 1440, height: 900 }],
  ["mobile", { width: 390, height: 844 }],
]) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });

  // Open the dialog via hero CTA
  await page.getByRole("button", { name: /book a table/i }).first().click();
  await page.waitForSelector("dialog[open]");
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/dialog-${name}-step1.png` });

  // Continue → step 2 (time slots) — choose a Wed
  await page.locator('input[type="date"]').fill("2026-05-13");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.waitForTimeout(800); // wait for slots fetch
  await page.screenshot({ path: `${OUT}/dialog-${name}-step2.png` });

  // Pick 7:00 pm
  await page.getByRole("button", { name: "7:00 pm" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: `${OUT}/dialog-${name}-step3.png` });

  // Fill details
  await page.locator('input[autocomplete="name"]').fill("Sasha Demo");
  await page.locator('input[autocomplete="email"]').fill("sasha.demo@example.com");
  await page.locator('input[autocomplete="tel"]').fill("5551234567");
  await page.locator('textarea').fill("Anniversary — quiet table if possible.");
  await page.getByRole("button", { name: "Request table" }).click();
  await page.waitForSelector("text=Reservation requested", { timeout: 5000 });
  await page.waitForTimeout(200);
  await page.screenshot({ path: `${OUT}/dialog-${name}-step4.png` });

  await ctx.close();
  console.log(`captured ${name}`);
}

await browser.close();
console.log("done →", OUT);
