/**
 * PORTFOLIO — MAIN.JS
 * Reads everything from config.js (SITE object) and renders the DOM.
 * Do not put content in here — edit config.js instead.
 */

(function () {
  "use strict";

  /* ── Tiny helpers ──────────────────────────────────────────── */
  const el = (tag, attrs = {}, ...children) => {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class")     node.className = v;
      else if (k === "html") node.innerHTML = v;
      else                   node.setAttribute(k, v);
    }
    children.forEach(c => c && node.append(typeof c === "string" ? document.createTextNode(c) : c));
    return node;
  };

  /* ── 4-pointed star SVG ─────────────────────────────────────
     Used as a decorative motif throughout the site.
     The path is a smooth concave 4-pointed star (like the logo).
  ───────────────────────────────────────────────────────────── */
  function starSVG(size = 16, extraClass = "") {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "-1.1 -1.1 2.2 2.2");
    svg.setAttribute("width",  size);
    svg.setAttribute("height", size);
    svg.setAttribute("aria-hidden", "true");
    svg.classList.add("star-icon");
    if (extraClass) svg.classList.add(extraClass);
    const path = document.createElementNS(ns, "path");
    // Smooth 4-pointed star via cubic beziers — control offset 0.22 gives
    // a sharp concave waist matching the logo silhouette.
    path.setAttribute("d", "M0,-1 C0,-0.22 -0.22,0 -1,0 C-0.22,0 0,0.22 0,1 C0,0.22 0.22,0 1,0 C0.22,0 0,-0.22 0,-1 Z");
    path.setAttribute("fill", "currentColor");
    svg.appendChild(path);
    return svg;
  }

  /* ── Elongated 4-pointed star SVG ─────────────────────────────
     Tall 1:2 star (like the logo) used for the hero bg and as
     decorative elements throughout sections.  Color: #ff0060.
  ───────────────────────────────────────────────────────────── */
  function makeElongatedStar(classes = "") {
    const ns  = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    // viewBox: width=2.2, height=4.2  → ~1:1.9 aspect ratio
    svg.setAttribute("viewBox", "-1.1 -2.1 2.2 4.2");
    svg.setAttribute("aria-hidden", "true");
    if (classes) svg.className.baseVal = classes;
    const path = document.createElementNS(ns, "path");
    // Tall star: top/bottom tips at ±1.9, side tips at ±0.88.
    // Cubic control offset 0.28 gives smooth concave waist.
    path.setAttribute("d", "M0,-1.9 C0,-0.28 -0.28,0 -0.88,0 C-0.28,0 0,0.28 0,1.9 C0,0.28 0.28,0 0.88,0 C0.28,0 0,-0.28 0,-1.9 Z");
    path.setAttribute("fill", "#ff0060");
    svg.appendChild(path);
    return svg;
  }

  /* ── Section label builder ──────────────────────────────────
     Renders:  ✦ 01 — Label
  ───────────────────────────────────────────────────────────── */
  function sectionLabel(num, text) {
    const p = el("p", { class: "section-label" });
    p.appendChild(starSVG(10));
    p.appendChild(document.createTextNode(" " + num + " — " + text));
    return p;
  }

  /* ── Meta ──────────────────────────────────────────────────── */
  function buildMeta() {
    const { title, description, favicon } = SITE.meta;
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);

    if (favicon) {
      const link = document.querySelector("link[rel='icon']") || document.createElement("link");
      link.rel  = "icon";
      link.href = favicon.length <= 2
        ? `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${favicon}</text></svg>`
        : favicon;
      document.head.appendChild(link);
    }
  }

  /* ── Nav ───────────────────────────────────────────────────── */
  function buildNav() {
    const nav = document.getElementById("site-nav");
    if (!nav) return;
    const { logo, links } = SITE.nav;

    // Logo: star + wordmark
    const logoA = el("a", { class: "nav-logo", href: "#" });
    logoA.appendChild(starSVG(14));
    logoA.appendChild(document.createTextNode(" " + logo));

    const ul = el("ul", { class: "nav-links" });
    links.forEach(({ label, href }) => {
      const li = el("li");
      li.appendChild(el("a", { href }, label));
      ul.appendChild(li);
    });

    const toggle = el("button", {
      class: "nav-toggle",
      "aria-label": "Toggle navigation",
      "aria-expanded": "false",
    }, "Menu");

    toggle.addEventListener("click", () => {
      const open = ul.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "Close" : "Menu";
    });

    ul.addEventListener("click", e => {
      if (e.target.tagName === "A") {
        ul.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "Menu";
      }
    });

    const inner = el("div", { class: "nav-inner container" });
    inner.append(logoA, ul, toggle);
    nav.appendChild(inner);
  }

  /* ── Hero ──────────────────────────────────────────────────── */
  function buildHero() {
    const section = document.getElementById("hero");
    if (!section) return;
    const { headline, subheadline } = SITE.hero;

    // Headline in its own container
    const wrapTop = el("div", { class: "container" });
    wrapTop.appendChild(el("h1", { class: "hero-headline" }, headline));

    // Hero star — large blurred #ff0060 SVG; cursor-tracked by star.js
    const starSlot = el("div", { id: "hero-star", "aria-hidden": "true" });
    starSlot.appendChild(makeElongatedStar("hero-star-svg"));

    // Subheadline in its own container
    const wrapBot = el("div", { class: "container" });
    wrapBot.appendChild(el("p", { class: "hero-sub" }, subheadline));

    section.append(wrapTop, starSlot, wrapBot);
  }

  /* ── Bio ───────────────────────────────────────────────────── */
  function buildBio() {
    const section = document.getElementById("bio");
    if (!section) return;
    const { heading, photo, text, resumeLabel, resumeHref } = SITE.bio;

    const wrap = el("div", { class: "container" });
    wrap.append(
      sectionLabel("01", "About"),
      el("h2", { class: "section-heading reveal", id: "bio-heading" }, heading)
    );

    const grid = el("div", { class: "bio-grid reveal" });
    if (photo) {
      grid.classList.add("has-photo");
      const photoWrap = el("div", { class: "bio-photo-wrap" });
      photoWrap.appendChild(el("img", { src: photo, alt: "Portrait" }));
      grid.appendChild(photoWrap);
    }

    const textDiv = el("div", { class: "bio-text" });
    text.forEach(para => textDiv.appendChild(el("p", {}, para)));

    if (resumeHref) {
      textDiv.appendChild(
        el("a", { class: "btn", href: resumeHref, target: "_blank", rel: "noopener" }, resumeLabel)
      );
    }

    grid.appendChild(textDiv);
    wrap.appendChild(grid);
    section.appendChild(wrap);
    // Decorative pink star — faint, top-right, clipped by overflow:hidden
    section.appendChild(makeElongatedStar("deco-star deco-star--bio"));
  }

  /* ── Writing ───────────────────────────────────────────────── */
  function buildWriting() {
    const section = document.getElementById("writing");
    if (!section) return;
    const { heading, subheading, items } = SITE.writing;

    const wrap = el("div", { class: "container" });
    wrap.append(
      sectionLabel("02", "Selected Work"),
      el("h2", { class: "section-heading reveal", id: "writing-heading" }, heading),
      el("p",  { class: "section-subheading reveal" }, subheading)
    );

    const list = el("div", { class: "writing-list reveal" });
    items.forEach(({ title, type, year, venue, excerpt, href, hrefLabel }) => {
      // When an href is set the whole card becomes a link (<a>).
      // External URLs open in a new tab; internal paths navigate in-place.
      const isExternal = href && href.startsWith('http');
      const itemAttrs = { class: "writing-item" };
      if (href) {
        itemAttrs.href = href;
        if (isExternal) { itemAttrs.target = "_blank"; itemAttrs.rel = "noopener"; }
      }
      const item = el(href ? "a" : "div", itemAttrs);

      const main = el("div", { class: "writing-main" });
      main.append(
        el("h3",  { class: "writing-title" }, title),
        el("span",{ class: "writing-meta" }, `${type} — ${year}`),
        el("span",{ class: "writing-venue" }, venue),
        el("p",   { class: "writing-excerpt" }, excerpt)
      );
      item.appendChild(main);

      if (href) {
        // Render the label as a <span> — the parent <a> already owns the click.
        const col = el("div", { class: "writing-link-col" });
        col.appendChild(el("span", { class: "writing-link" }, hrefLabel));
        item.appendChild(col);
      }

      list.appendChild(item);
    });

    wrap.appendChild(list);
    section.appendChild(wrap);
  }

  /* ── Games ─────────────────────────────────────────────────── */
  function buildGames() {
    const section = document.getElementById("games");
    if (!section) return;
    const { heading, subheading, items } = SITE.games;

    const wrap = el("div", { class: "container" });
    wrap.append(
      sectionLabel("03", "Games"),
      el("h2", { class: "section-heading reveal", id: "games-heading" }, heading),
      el("p",  { class: "section-subheading reveal" }, subheading)
    );

    const grid = el("div", { class: "games-grid reveal" });
    items.forEach(({ title, role, year, studio, platform, description, tags, href, hrefLabel, image }) => {
      const card = el("div", { class: "game-card" });

      if (image) {
        card.appendChild(el("img", { class: "game-image", src: image, alt: title }));
      } else {
        card.appendChild(el("div", { class: "game-image-placeholder" }, "No Image"));
      }

      const body = el("div", { class: "game-body" });
      body.appendChild(el("h3", { class: "game-title" }, title));

      const roleRow = el("div", { class: "game-role-row" });
      roleRow.append(
        el("span", { class: "game-role" },     role),
        el("span", { class: "game-year" },     year),
        el("span", { class: "game-platform" }, platform)
      );
      body.appendChild(roleRow);

      if (studio) body.appendChild(el("p", { class: "game-studio" }, studio));
      body.appendChild(el("p", { class: "game-desc" }, description));

      if (tags && tags.length) {
        const tagsWrap = el("div", { class: "game-tags" });
        tags.forEach(t => tagsWrap.appendChild(el("span", { class: "tag" }, t)));
        body.appendChild(tagsWrap);
      }

      if (href) {
        body.appendChild(
          el("a", { class: "game-link", href, target: "_blank", rel: "noopener" }, hrefLabel)
        );
      }

      card.appendChild(body);
      grid.appendChild(card);
    });

    wrap.appendChild(grid);
    section.appendChild(wrap);
  }

  /* ── Content (YouTube) ─────────────────────────────────────── */
  function buildContent() {
    const section = document.getElementById("content");
    if (!section) return;
    const { heading, subheading, channelUrl, channelLabel, videos } = SITE.content;

    const wrap = el("div", { class: "container" });
    wrap.append(
      sectionLabel("04", "Content"),
      el("h2", { class: "section-heading reveal", id: "content-heading" }, heading),
      el("p",  { class: "section-subheading reveal" }, subheading)
    );

    // Video embeds (only when IDs are configured)
    if (videos && videos.length) {
      const grid = el("div", { class: "videos-grid reveal" });
      videos.forEach(({ id, title }) => {
        const embedDiv = el("div", { class: "video-embed" });
        const iframe = el("iframe", {
          src:             `https://www.youtube.com/embed/${id}`,
          title:           title || "YouTube video",
          allow:           "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
          referrerpolicy:  "strict-origin-when-cross-origin",
          allowfullscreen: "",
          loading:         "lazy",
        });
        embedDiv.appendChild(iframe);
        grid.appendChild(embedDiv);
      });
      wrap.appendChild(grid);
    }

    // Channel CTA — always visible below the videos (or alone if no videos)
    if (channelUrl) {
      const cta = el("div", { class: "content-channel-cta reveal" });
      const link = el("a", {
        class:  "content-channel-link",
        href:   channelUrl,
        target: "_blank",
        rel:    "noopener",
      });
      link.append(starSVG(22), channelLabel || "Visit Channel →");
      cta.appendChild(link);
      if (!videos || !videos.length) {
        cta.appendChild(
          el("p", { class: "content-note" },
            "Add video IDs to config.js → content.videos to display embeds here.")
        );
      }
      wrap.appendChild(cta);
    }

    section.appendChild(wrap);
  }

  /* ── Contact ───────────────────────────────────────────────── */
  function buildContact() {
    const section = document.getElementById("contact");
    if (!section) return;
    const { heading, intro, email, links, showForm, formAction } = SITE.contact;

    const wrap = el("div", { class: "container" });
    wrap.append(
      sectionLabel("05", "Get In Touch"),
      el("h2", { class: "section-heading", id: "contact-heading" }, heading),
      el("p",  { class: "section-subheading" }, intro)
    );

    const grid = el("div", { class: "contact-grid" });

    // Left: email + optional social links
    const info = el("div", { class: "contact-info-block reveal" });

    const emailBlock = el("div");
    emailBlock.append(
      el("p", { class: "contact-links-heading" }, "Email"),
      el("a", { class: "contact-email-link", href: `mailto:${email}` }, email)
    );
    info.appendChild(emailBlock);

    if (links && links.length) {
      const linksBlock = el("div");
      linksBlock.appendChild(el("p", { class: "contact-links-heading" }, "Elsewhere"));
      const ul = el("ul", { class: "contact-links-list" });
      links.forEach(({ label, href }) => {
        if (!href) return;
        const li = el("li");
        li.appendChild(el("a", { href, target: "_blank", rel: "noopener" }, label));
        ul.appendChild(li);
      });
      linksBlock.appendChild(ul);
      info.appendChild(linksBlock);
    }

    grid.appendChild(info);

    // Right: contact form
    if (showForm) {
      const formWrap = el("div", { class: "reveal" });
      formWrap.appendChild(buildForm(email, formAction));
      grid.appendChild(formWrap);
    }

    wrap.appendChild(grid);
    section.appendChild(wrap);
  }

  function buildForm(email, formAction) {
    const form = el("form", { class: "contact-form", novalidate: "" });
    if (formAction) form.setAttribute("action", formAction);
    form.setAttribute("method", "POST");

    const fields = [
      { id: "cf-name",    label: "Your Name",  type: "text",  name: "name",    placeholder: "Jane Smith",              required: true  },
      { id: "cf-email",   label: "Your Email", type: "email", name: "email",   placeholder: "jane@example.com",        required: true  },
      { id: "cf-subject", label: "Subject",    type: "text",  name: "subject", placeholder: "Narrative design project", required: false },
    ];

    fields.forEach(({ id, label, type, name, placeholder, required }) => {
      const grp = el("div", { class: "form-group" });
      grp.append(
        el("label", { class: "form-label", for: id }, label),
        el("input", { class: "form-input", id, type, name, placeholder, ...(required ? { required: "" } : {}) })
      );
      form.appendChild(grp);
    });

    const msgGrp = el("div", { class: "form-group" });
    msgGrp.append(
      el("label", { class: "form-label", for: "cf-message" }, "Message"),
      el("textarea", { class: "form-textarea", id: "cf-message", name: "message", placeholder: "Tell me about your project…", required: "" })
    );
    form.appendChild(msgGrp);

    const status = el("p", { class: "form-status", "aria-live": "polite" });
    const submit = el("button", { class: "btn btn-invert", type: "submit" }, "Send Message");

    form.append(submit, status);

    form.addEventListener("submit", async e => {
      e.preventDefault();
      status.textContent = "";
      status.className   = "form-status";

      const data = Object.fromEntries(new FormData(form));
      if (!data.name || !data.email || !data.message) {
        status.textContent = "Please fill in the required fields.";
        status.classList.add("error");
        return;
      }

      if (formAction) {
        try {
          submit.disabled    = true;
          submit.textContent = "Sending…";
          const res = await fetch(formAction, {
            method:  "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body:    JSON.stringify(data),
          });
          if (res.ok) {
            status.textContent = "Message sent. I’ll be in touch soon.";
            status.classList.add("success");
            form.reset();
          } else {
            throw new Error("Server error");
          }
        } catch {
          status.textContent = "Something went wrong. Try emailing directly.";
          status.classList.add("error");
        } finally {
          submit.disabled    = false;
          submit.textContent = "Send Message";
        }
      } else {
        // Mailto fallback
        const body    = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`);
        const subject = encodeURIComponent(data.subject || "Portfolio Enquiry");
        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
      }
    });

    return form;
  }

  /* ── Footer ────────────────────────────────────────────────── */
  function buildFooter() {
    const footer = document.getElementById("site-footer");
    if (!footer) return;

    const inner = el("div", { class: "footer-inner container" });

    const copy = el("p", { class: "footer-copy" });
    copy.appendChild(starSVG(10));
    copy.appendChild(document.createTextNode(" " + SITE.footer.line));

    inner.append(
      copy,
      el("a", { class: "footer-back-top", href: "#" }, "↑ Back to top")
    );
    footer.appendChild(inner);
  }

  /* ── Parallax scrolling ───────────────────────────────────── */
  function initParallax() {
    // Respect accessibility — no motion effects if user prefers
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Targets and their vertical parallax factor.
    // Formula: element moves (viewportCenter - elementCenter) * factor
    // → elements lag slightly behind scroll → depth effect.
    // Sections now stack via CSS sticky — only the hero star gets parallax
    const CONFIG = [
      { sel: '#hero-star', fy: 0.28 },
    ];

    const items = [];
    CONFIG.forEach(({ sel, fy }) => {
      document.querySelectorAll(sel).forEach(node => {
        node.style.willChange = 'transform';
        items.push({ el: node, fy });
      });
    });

    if (!items.length) return;

    let pending = false;

    function update() {
      const vh = window.innerHeight;
      const vMid = vh * 0.5;
      items.forEach(({ el, fy }) => {
        const r      = el.getBoundingClientRect();
        const elMid  = r.top + r.height * 0.5;
        // Normalised distance from viewport centre (–0.5 … 0.5 typical range)
        const norm   = (elMid - vMid) / vh;
        // Translate: positive norm = element is below centre = push it slightly
        // down so it "catches up" as it scrolls into view — classic parallax feel
        const offset = norm * vh * fy;
        el.style.transform = `translateY(${offset.toFixed(2)}px)`;
      });
      pending = false;
    }

    window.addEventListener('scroll', () => {
      if (!pending) {
        pending = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });

    window.addEventListener('resize', update);
    update(); // initial position
  }

  /* ── Custom cursor ────────────────────────────────────────────
     Hides the OS cursor (via cursor:none in CSS) and replaces it
     with a #ff0060 dot + lagging ring.  Skip on touch devices.
  ───────────────────────────────────────────────────────────── */
  function initCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return; // touch — skip

    // Star cursor SVG — fill via CSS so transitions work
    const ns = 'http://www.w3.org/2000/svg';
    const star = document.createElementNS(ns, 'svg');
    star.id = 'cursor-star';
    star.setAttribute('viewBox', '-1.1 -1.1 2.2 2.2');
    star.setAttribute('width',  '26');
    star.setAttribute('height', '26');
    star.setAttribute('aria-hidden', 'true');
    const starPath = document.createElementNS(ns, 'path');
    starPath.setAttribute('d', 'M0,-1 C0,-0.22 -0.22,0 -1,0 C-0.22,0 0,0.22 0,1 C0,0.22 0.22,0 1,0 C0.22,0 0,-0.22 0,-1 Z');
    star.appendChild(starPath);

    // Canvas for smooth directional smoke trail
    const canvas = document.createElement('canvas');
    canvas.id = 'cursor-canvas';
    document.body.append(star, canvas);

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const ctx = canvas.getContext('2d');
    const pts = [];
    const LIFE = 520; // ms each point lives

    function isClickable(el) {
      return !!(el && el.closest('a, button, [role="button"]'));
    }

    document.addEventListener('mousemove', e => {
      const x = e.clientX, y = e.clientY;
      star.style.left = x + 'px';
      star.style.top  = y + 'px';

      // Only push a point if moved at least 3px — keeps path smooth without excess points
      const last = pts[pts.length - 1];
      if (!last || Math.hypot(x - last.x, y - last.y) >= 3) {
        pts.push({ x, y, t: performance.now() });
      }

      // Hover state — elementFromPoint skips pointer-events:none elements
      if (isClickable(document.elementFromPoint(x, y))) {
        star.classList.add('cursor-hover');
      } else {
        star.classList.remove('cursor-hover');
      }
    });

    document.documentElement.addEventListener('mouseleave', () => { star.style.opacity = '0'; });
    document.documentElement.addEventListener('mouseenter', () => { star.style.opacity = '1'; });

    (function draw() {
      requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const now = performance.now();
      while (pts.length && now - pts[0].t > LIFE) pts.shift();
      if (pts.length < 2) return;

      const tail = pts[0];
      const tip  = pts[pts.length - 1];

      // Gradient: orange at tail → purple → pink at tip
      // Soft edges (not 0) keep the trail wispy rather than hard-edged
      let grad;
      if (Math.abs(tip.x - tail.x) > 0.5 || Math.abs(tip.y - tail.y) > 0.5) {
        grad = ctx.createLinearGradient(tail.x, tail.y, tip.x, tip.y);
        grad.addColorStop(0,    'rgba(255,106,0,  0.09)');
        grad.addColorStop(0.12, 'rgba(255,106,0,  0.62)');
        grad.addColorStop(0.55, 'rgba(174,22,255, 0.70)');
        grad.addColorStop(0.88, 'rgba(255,0,96,   0.74)');
        grad.addColorStop(1,    'rgba(255,0,96,   0.07)');
      } else {
        grad = 'rgba(174,22,255,0.5)';
      }

      // Build one smooth bezier path through all points (midpoint method)
      ctx.beginPath();
      ctx.moveTo(tail.x, tail.y);
      for (let i = 1; i < pts.length - 1; i++) {
        const mx = (pts[i].x + pts[i + 1].x) * 0.5;
        const my = (pts[i].y + pts[i + 1].y) * 0.5;
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
      }
      ctx.lineTo(tip.x, tip.y);

      ctx.lineCap  = 'round';
      ctx.lineJoin = 'round';

      // Outer wisp — very wide and barely there, gives the smoky halo
      ctx.save();
      ctx.filter      = 'blur(12px)';
      ctx.strokeStyle = grad;
      ctx.lineWidth   = 11;
      ctx.globalAlpha = 0.18;
      ctx.stroke();
      ctx.restore();

      // Mid glow — medium spread, most of the visible colour
      ctx.save();
      ctx.filter      = 'blur(5px)';
      ctx.strokeStyle = grad;
      ctx.lineWidth   = 5;
      ctx.globalAlpha = 0.30;
      ctx.stroke();
      ctx.restore();

      // Core — soft, not razor-sharp
      ctx.save();
      ctx.filter      = 'blur(2px)';
      ctx.strokeStyle = grad;
      ctx.lineWidth   = 2.5;
      ctx.globalAlpha = 0.52;
      ctx.stroke();
      ctx.restore();
    })();
  }

  /* ── Spherize heading effect ──────────────────────────────────
     Splits .hero-headline and .section-heading into per-character
     spans.  Characters within RADIUS px of the cursor scale up with
     a smooth quadratic falloff — creating a lens / sphere-bulge.
     Updates on both mousemove (cursor moves) and scroll (chars
     move past a stationary cursor).
  ───────────────────────────────────────────────────────────── */
  function initSpherize() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const targets = document.querySelectorAll('.hero-headline, .section-heading');
    if (!targets.length) return;

    // Split every heading into per-character inline-block spans
    targets.forEach(heading => {
      const text = heading.textContent;
      heading.innerHTML = '';
      [...text].forEach(c => {
        if (c === '\n') {
          heading.appendChild(document.createTextNode('\n'));
        } else if (c === ' ') {
          const s = document.createElement('span');
          s.className = 'spherize-char';
          s.style.whiteSpace = 'pre';
          s.textContent = ' ';
          heading.appendChild(s);
        } else {
          const s = document.createElement('span');
          s.className = 'spherize-char';
          s.textContent = c;
          heading.appendChild(s);
        }
      });
    });

    const spans = Array.from(document.querySelectorAll('.spherize-char'));
    if (!spans.length) return;

    const RADIUS    = 180;   // px — cursor influence radius
    const MAX_SCALE = 0.28;  // max scale-up at cursor centre (28%)

    let mx = -9999, my = -9999;
    let pending = false;

    function update() {
      spans.forEach(s => {
        const r  = s.getBoundingClientRect();
        const cx = r.left + r.width  * 0.5;
        const cy = r.top  + r.height * 0.5;
        const d  = Math.hypot(mx - cx, my - cy);

        if (d >= RADIUS) {
          if (s.style.transform) s.style.transform = '';
          return;
        }
        // Quadratic falloff: full effect at cursor, zero at edge
        const t     = 1 - d / RADIUS;
        const scale = 1 + MAX_SCALE * t * t;
        s.style.transform = `scale(${scale.toFixed(4)})`;
      });
      pending = false;
    }

    function scheduleUpdate() {
      if (!pending) { pending = true; requestAnimationFrame(update); }
    }

    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      scheduleUpdate();
    });

    // Also update on scroll — chars move under a stationary cursor
    window.addEventListener('scroll', scheduleUpdate, { passive: true });

    document.addEventListener('mouseleave', () => {
      mx = -9999; my = -9999;
      scheduleUpdate();
    });
  }

  /* ── Scroll reveal ─────────────────────────────────────────── */
  function initReveal() {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          observer.unobserve(e.target);
        }
      }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
  }

  /* ── Active nav highlight on scroll ───────────────────────── */
  function initActiveNav() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks  = document.querySelectorAll(".nav-links a");
    if (!sections.length || !navLinks.length) return;

    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            navLinks.forEach(a => a.removeAttribute("aria-current"));
            const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
            if (active) active.setAttribute("aria-current", "page");
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    sections.forEach(s => io.observe(s));
  }

  /* ── Boot ──────────────────────────────────────────────────── */
  function boot() {
    buildMeta();
    buildNav();
    buildHero();
    buildBio();
    buildWriting();
    buildGames();
    buildContent();
    buildContact();
    buildFooter();
    initReveal();
    initActiveNav();
    initParallax();
    initCursor();
    initSpherize();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
