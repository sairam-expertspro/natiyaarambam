const socialStroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const SOCIALS = [
  {
    label: "Facebook",
    link: "https://www.facebook.com/groups/228705529315840/",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" {...socialStroke}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    link: "https://www.instagram.com/natyaarambam_dance_academy?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" {...socialStroke}>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    link: "https://www.youtube.com/@natyaarambam3083",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" {...socialStroke}>
        <path d="M22.5 12s0-3.4-.4-5a2.6 2.6 0 0 0-1.8-1.8C18.6 4.7 12 4.7 12 4.7s-6.6 0-8.3.5A2.6 2.6 0 0 0 1.9 7c-.4 1.6-.4 5-.4 5s0 3.4.4 5a2.6 2.6 0 0 0 1.8 1.8c1.7.5 8.3.5 8.3.5s6.6 0 8.3-.5a2.6 2.6 0 0 0 1.8-1.8c.4-1.6.4-5 .4-5z" />
        <path d="M10 15.2 15.2 12 10 8.8z" fill="currentColor" />
      </svg>
    ),
  },
];
