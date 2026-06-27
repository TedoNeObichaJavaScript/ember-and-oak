import { readFileSync } from "node:fs";

const res = await fetch("http://localhost:3000/");
const html = await res.text();
const m = html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
if (!m) { console.error("no ld+json"); process.exit(3); }
const d = JSON.parse(m[1]);
console.log("@graph entities:", d["@graph"].length);
for (const e of d["@graph"]) {
  const issues = [];
  if (e["@type"] === "Restaurant") {
    if (typeof e.acceptsReservations !== "boolean") issues.push("acceptsReservations not boolean");
    if (!e.aggregateRating) issues.push("no aggregateRating");
    if (!e.priceRange) issues.push("no priceRange");
    if (!e.address) issues.push("no address");
    if (!e.geo) issues.push("no geo");
    if (!e.openingHoursSpecification) issues.push("no hours");
    if (!e.image) issues.push("no image");
    if (!e.telephone) issues.push("no telephone");
  }
  if (e["@type"] === "Menu") {
    const mi = e.hasMenuSection.flatMap((s) => s.hasMenuItem);
    for (const i of mi) {
      if (!i.offers || !i.offers.availability) issues.push("item missing availability: " + i.name);
      if (!i.offers.priceCurrency) issues.push("item missing currency: " + i.name);
    }
  }
  if (e["@type"] === "WebPage" && !e.about) issues.push("WebPage missing about");
  console.log(" -", e["@type"], issues.length ? "WARN: " + issues.join("; ") : "OK");
}
