import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Pillars from "@/components/Pillars";
import Menu from "@/components/Menu";
import Story from "@/components/Story";
import Press from "@/components/Press";
import Reserve from "@/components/Reserve";
import Footer from "@/components/Footer";
import BookingDialog from "@/components/BookingDialog";
import { SITE, business } from "@/lib/site";
import { menu } from "@/lib/menu";

const RID = `${SITE}/#restaurant`;
const MID = `${SITE}/#menu-schema`;

const graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Restaurant",
      "@id": RID,
      name: business.name,
      url: SITE,
      image: [`${SITE}/opengraph-image`],
      logo: `${SITE}/icon`,
      description: business.description,
      slogan: "Smoke, oak, and the season's best.",
      servesCuisine: ["American", "Wood-Fired", "Seasonal", "Farm to Table"],
      priceRange: "$$$",
      currenciesAccepted: "USD",
      paymentAccepted: ["Cash", "Credit Card"],
      telephone: business.phone.e164,
      email: business.email,
      acceptsReservations: true,
      hasMenu: { "@id": MID },
      address: {
        "@type": "PostalAddress",
        streetAddress: business.address.street,
        addressLocality: business.address.locality,
        addressRegion: business.address.region,
        postalCode: business.address.postal,
        addressCountry: business.address.country,
      },
      geo: { "@type": "GeoCoordinates", latitude: business.geo.lat, longitude: business.geo.lng },
      openingHoursSpecification: [
        { "@type": "OpeningHoursSpecification", dayOfWeek: business.hours.days, opens: business.hours.open, closes: business.hours.close },
      ],
      aggregateRating: { "@type": "AggregateRating", ratingValue: business.rating.value, reviewCount: business.rating.count, bestRating: "5", worstRating: "1" },
      founder: { "@type": "Person", name: business.founder.name, jobTitle: business.founder.title, sameAs: [business.founder.instagram] },
      keywords: "wood-fired bistro, seasonal menu, farm to table, tasting menu, Brooklyn restaurant",
      sameAs: [business.social.instagram, business.social.resy],
    },
    {
      "@type": "Menu",
      "@id": MID,
      name: "Tonight's Menu",
      description: "Rewritten weekly. Cooked once, by hand.",
      inLanguage: "en",
      hasMenuSection: menu.map((s) => ({
        "@type": "MenuSection",
        name: s.title,
        hasMenuItem: s.items.map((i) => ({
          "@type": "MenuItem",
          name: i.name,
          description: i.desc,
          offers: { "@type": "Offer", price: `${i.price}.00`, priceCurrency: "USD", availability: "https://schema.org/InStock" },
        })),
      })),
    },
    { "@type": "WebSite", "@id": `${SITE}/#website`, url: SITE, name: business.name, publisher: { "@id": RID }, inLanguage: "en-US" },
    {
      "@type": "WebPage",
      "@id": `${SITE}/#webpage`,
      url: SITE,
      name: `${business.name} — ${business.tagline}`,
      isPartOf: { "@id": `${SITE}/#website` },
      about: { "@id": RID },
      primaryImageOfPage: `${SITE}/opengraph-image`,
      inLanguage: "en-US",
    },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }] },
  ],
};

const ldJson = JSON.stringify(graph);

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson }} />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:bg-ink focus:text-bone focus:px-4 focus:py-2 focus:rounded">Skip to content</a>
      <Nav />
      <main id="main">
        <Hero />
        <Marquee />
        <Pillars />
        <Menu />
        <Story />
        <Press />
        <Reserve />
      </main>
      <Footer />
      <BookingDialog />
    </>
  );
}
