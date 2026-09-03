export const SITE_URL = "https://natyaarambam.com";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "DanceSchool",
    name: "Natyaarambam Dance Academy",
    alternateName: "Natyaarambam Dance Academy of Bharatanatyam",
    url: SITE_URL,
    logo: `${SITE_URL}/images/Logo.svg`,
    description:
      "Structured Bharatanatyam training that nurtures technique, confidence, spirituality, and artistic expression, rooted in the traditional Thanjavur Bani.",
    foundingDate: "2018",
    founder: {
      "@type": "Person",
      name: "Hema Chandrasekaran",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "14901 Thunder Rd",
      addressLocality: "Frisco",
      addressRegion: "TX",
      postalCode: "75035",
      addressCountry: "US",
    },
    telephone: "+1-703-334-1164",
    email: "natyaarambham@gmail.com",
    sameAs: [
      "https://www.facebook.com/groups/228705529315840/",
      "https://www.instagram.com/natyaarambam_dance_academy",
      "https://www.youtube.com/@natyaarambam3083",
    ],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
