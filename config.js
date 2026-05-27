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
    title:       "Max Ruzic — Writer & Narrative Designer",
    description: "Creative Writing and Narrative Design Portfolio.",
    favicon:     "", // path or emoji, e.g. "✦" or "assets/favicon.ico"
  },

  /* ── Navigation ───────────────────────────────────────────── */
  nav: {
    logo: "MAX RUZIC",           // top-left wordmark
    links: [
      { label: "Bio",      href: "#bio"     },
      { label: "Writing",  href: "#writing" },
      { label: "Games",    href: "#games"   },
      { label: "Contact",  href: "#contact" },
    ],
  },

  /* ── Hero ─────────────────────────────────────────────────── */
  hero: {
    headline:    "WRITER.\nNARRATIVE\nDESIGNER.",
    subheadline: "I build worlds with words — on the page and in the game.",
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
    resumeHref:  "assets/resume.pdf",  // leave "" to hide the button
  },

  /* ── Writing Samples ──────────────────────────────────────── */
  writing: {
    heading:     "Writing",
    subheading:  "Fiction, essays, and narrative work.",
    items: [
      {
        title:    "The Weight of Still Water",
        type:     "Short Story",
        year:     "2024",
        venue:    "Clarkesworld Magazine",
        excerpt:  "A deep-sea research station. One survivor. The logs she left behind read like a love letter to a creature that should not exist.",
        href:     "https://example.com",
        hrefLabel: "Read →",
      },
      {
        title:    "Everything That Burns",
        type:     "Novella",
        year:     "2023",
        venue:    "Self-published",
        excerpt:  "A climate-grief road novel told through found documents, voice messages, and a road atlas annotated by someone who never made it home.",
        href:     "https://example.com",
        hrefLabel: "Read sample →",
      },
      {
        title:    "On Player Grief: Loss Mechanics as Narrative Form",
        type:     "Essay",
        year:     "2023",
        venue:    "Heterotopias Zine",
        excerpt:  "What happens when a game makes you feel the weight of a death by making you play through it again and again?",
        href:     "https://example.com",
        hrefLabel: "Read →",
      },
      {
        title:    "Cartography of the Unnamed",
        type:     "Short Story",
        year:     "2022",
        venue:    "Strange Horizons",
        excerpt:  "A cartographer hired to map a city that only exists in the memories of its former residents.",
        href:     "",
        hrefLabel: "Read →",
      },
    ],
  },

  /* ── Games Portfolio ──────────────────────────────────────── */
  games: {
    heading:    "Games",
    subheading: "Narrative design, writing, and worldbuilding for interactive media.",
    items: [
      {
        title:       "HOLLOW MERIDIAN",
        role:        "Lead Narrative Designer",
        year:        "2024",
        studio:      "Studio Name",
        platform:    "PC / Console",
        description: "A post-collapse open world RPG. Responsible for the main quest narrative, companion dialogue system (4,200+ lines), and the lore bible governing three playable factions.",
        tags:        ["RPG", "Open World", "Branching Dialogue"],
        href:        "https://example.com",
        hrefLabel:   "View project →",
        image:       "",  // path to screenshot, e.g. "assets/hollow-meridian.jpg"
      },
      {
        title:       "TENDER MACHINES",
        role:        "Writer & Designer",
        year:        "2023",
        studio:      "Indie / Solo",
        platform:    "PC (itch.io)",
        description: "A short narrative game about care work, memory, and AI companions. Won Best Narrative at [Jam Name]. 2,000+ plays.",
        tags:        ["Visual Novel", "Jam Winner", "Itch.io"],
        href:        "https://example.com",
        hrefLabel:   "Play free →",
        image:       "",
      },
      {
        title:       "THE UNMAPPING",
        role:        "Narrative Consultant",
        year:        "2022",
        studio:      "Studio Name",
        platform:    "Mobile",
        description: "Worked with the core team to develop the game's mythological framework and write the in-world codex entries.",
        tags:        ["Mobile", "Mythology", "Worldbuilding"],
        href:        "",
        hrefLabel:   "View project →",
        image:       "",
      },
    ],
  },

  /* ── Contact ──────────────────────────────────────────────── */
  contact: {
    heading:   "Contact",
    intro:     "Available for narrative design projects, writing commissions, consulting, and speaking. Response time is usually within 48 hours.",
    email:     "hello@yourname.com",
    links: [
      { label: "Twitter / X",   href: "https://twitter.com/yourhandle"  },
      { label: "LinkedIn",      href: "https://linkedin.com/in/yourname" },
      { label: "Itch.io",       href: "https://yourname.itch.io"        },
      { label: "Substack",      href: "https://yourname.substack.com"   },
    ],
    // Simple contact form — set to false to hide entirely
    showForm: true,
    formAction: "", // URL for a form backend (e.g. Formspree). Leave "" to use mailto fallback.
  },

  /* ── Footer ───────────────────────────────────────────────── */
  footer: {
    line: "© 2026 Maxsterpiece. All rights reserved.",
  },

};
