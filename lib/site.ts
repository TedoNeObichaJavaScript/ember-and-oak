export const SITE = "https://emberandoak.example";

export const business = {
  name: "Ember & Oak",
  tagline: "Wood-Fired Bistro",
  description:
    "A 32-seat wood-fired bistro in Brooklyn. Seasonal menus rewritten weekly, sourced from twelve regional farms within sixty miles.",
  address: { street: "412 Birch Lane", locality: "Brooklyn", region: "NY", postal: "11201", country: "US" },
  phone: { display: "(555) 014-0220", e164: "+15550140220" },
  email: "hello@emberandoak.example",
  pressEmail: "press@emberandoak.example",
  hours: { display: "Wed–Sun · 5:30pm–late", days: ["Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], open: "17:30", close: "22:30" },
  geo: { lat: 40.6892, lng: -73.9903 },
  founder: { name: "Mira Holloway", title: "Chef & Founder", instagram: "https://instagram.com/chef.mira" },
  social: { instagram: "https://instagram.com/emberandoak", resy: "https://resy.com/cities/ny/ember-and-oak" },
  rating: { value: "4.9", count: "184" },
} as const;
