export type Course = { name: string; desc: string; price: string };
export type Section = { title: string; items: Course[] };

export const menu: Section[] = [
  { title: "First", items: [
    { name: "Hearth Bread & Cultured Butter", desc: "Sourdough, smoked sea salt, koji butter", price: "9" },
    { name: "Charred Stone Fruit", desc: "Burrata, basil oil, aged balsamic", price: "16" },
    { name: "Smoked Trout Rillette", desc: "Crème fraîche, dill, rye toast", price: "18" },
  ]},
  { title: "Hearth", items: [
    { name: "Oak-Roasted Chicken (for two)", desc: "Lemon, thyme, pan jus, fingerlings", price: "62" },
    { name: "Wood-Grilled Lamb Loin", desc: "Eggplant, harissa, mint yogurt", price: "44" },
    { name: "Cherry-Smoked Trout", desc: "Brown butter, capers, charred leek", price: "36" },
  ]},
  { title: "Last", items: [
    { name: "Burnt Honey Tart", desc: "Buckwheat crust, crème fraîche", price: "14" },
    { name: "Smoked Chocolate Cremeux", desc: "Hazelnut, olive oil, fleur de sel", price: "14" },
  ]},
];

export const marqueeItems = [
  "Hearth bread, cultured butter",
  "Charred stone fruit",
  "Oak-roasted chicken",
  "Smoked trout rillette",
  "Cherry-smoked trout",
  "Burnt honey tart",
  "Wood-grilled lamb loin",
  "Smoked chocolate cremeux",
];
