/**
 * PORTFOLIO CONFIG
 * ─────────────────────────────────────────────────────────────
 * Edit this file to update every piece of content on the site.
 * Never touch index.html, style.css, or main.js for content.
 * ─────────────────────────────────────────────────────────────
 */

const SITE = {

  /* ── Meta ─────────────────────────────────────────────────── */
  meta: {
    title:       "Max Ruzic — Writer & Game Developer",
    description: "Writing and Game Development Portfolio.",
    // SVG 4-pointed star as favicon (no external file needed)
    favicon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='-1.1 -1.1 2.2 2.2'><path d='M0,-1 C0,-0.22 -0.22,0 -1,0 C-0.22,0 0,0.22 0,1 C0,0.22 0.22,0 1,0 C0.22,0 0,-0.22 0,-1 Z' fill='%231a1a1c'/></svg>",
  },

  /* ── Navigation ───────────────────────────────────────────── */
  nav: {
    logo: "MAX RUZIC",           // top-left wordmark
    links: [
      { label: "Bio",      href: "#bio"     },
      { label: "Writing",  href: "#writing" },
      { label: "Games",    href: "#games"   },
      { label: "Content",  href: "#content" },
      { label: "Contact",  href: "#contact" },
    ],
  },

  /* ── Hero ─────────────────────────────────────────────────── */
  hero: {
    headline:    "WRITER.\nGAME DEVELOPER.\nCONTENT CREATOR.",
    subheadline: "I build worlds - on pages and in games.",
  },

  /* ── Bio ──────────────────────────────────────────────────── */
  bio: {
    heading: "About",
    photo:   "",    // path to image, e.g. "assets/photo.jpg" — leave "" to hide
    text: [
      "I'm a writer and narrative designer based in Croatia. My work lives at the intersection of literary fiction and interactive storytelling. I care deeply about how structure shapes meaning, how player agency interacts with authored intention, and how a single well-placed sentence can carry the weight of an entire world.",
      "I studied a Bachelor of Creative Writing at Griffith University. Currently, I'm studying a Masters of Cybersecurity at Monash.",
      "Currently available for freelance narrative work, writing commissions, and full-time opportunities.",
    ],
    resumeLabel: "Download CV",
    resumeHref:  "",  // leave "" to hide the button
  },

  /* ── Writing Samples ──────────────────────────────────────── */
  writing: {
    heading:     "Writing",
    subheading:  "Fiction, essays, and narrative work.",
    items: [
      {
        title:    "KATZE",
        type:     "Short Story",
        year:     "03/2023",
        venue:    "",
        excerpt:  "A lone Stray navigates the ruins of a collapsed world, chasing a hum that no one else dares to hunt. What she finds in the city’s forbidden heart changes everything.",
        href:     "story-01.html",
        hrefLabel: "Read →",
      },
      {
        title:    "TAPESTRY OF STARS",
        type:     "Novel",
        year:     "03/2025",
        venue:    "",
        excerpt:  "In the ruins of her fallen city, Karliah wakes to find something ancient stirring beneath the earth — and within herself. An excerpt from Book I.",
        href:     "story-tapestry.html",
        hrefLabel: "Read →",
      },
      {
        title:    "KNIGHTINGALE",
        type:     "Novella",
        year:     "05/2026",
        venue:    "",
        excerpt:  "A dying Knight and a nameless Healer travel unmapped, corrupted lands in search of the Chalice — a relic that may not exist. Ongoing work in progress.",
        href:     "story-knightingale.html",
        hrefLabel: "Read →",
      },
      {
        title:    "UNTITLED — 04",
        type:     "Essay",
        year:     "TBD",
        venue:    "—",
        excerpt:  "Description coming soon.",
        href:     "",
        hrefLabel: "Read →",
      },
    ],
  },

  /* ── Games Portfolio ──────────────────────────────────────── */
  games: {
    heading:    "Games",
    subheading: "Game development and design.",
    items: [
      {
        title:       "UNTITLED PROJECT",
        role:        "Writer & Game Developer",
        year:        "TBD",
        studio:      "—",
        platform:    "TBD",
        description: "Description coming soon.",
        tags:        [],
        href:        "",
        hrefLabel:   "View project →",
        image:       "",
      },
    ],
  },

  /* ── Content (YouTube) ────────────────────────────────────── */
  content: {
    heading:      "Content",
    subheading:   "Stories in video.",
    channelUrl:   "https://www.youtube.com/@Maxsterpiece",
    channelLabel: "@Maxsterpiece on YouTube",
    videos: [
      { id: "R3opjJxn-yQ", title: "Video 1" },
      { id: "9rr6Vasst3k", title: "Video 2" },
    ],
  },

  /* ── Contact ──────────────────────────────────────────────── */
  contact: {
    heading:   "Contact",
    intro:     "Available for narrative design projects, writing commissions, consulting, and speaking.",
    email:     "maxsterpiece@gmail.com",
    links:     [],
    // Simple contact form — set to false to hide entirely
    showForm:   true,
    formAction: "", // URL for a form backend (e.g. Formspree). Leave "" to use mailto fallback.
  },

  /* ── Footer ───────────────────────────────────────────────── */
  footer: {
    line: "© 2026 Maxsterpiece. All rights reserved.",
  },

};
