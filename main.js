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
      const item = el("div", { class: "writing-item" });

      const main = el("div", { class: "writing-main" });
      main.append(
        el("h3",  { class: "writing-title" }, title),
        el("span",{ class: "writing-meta" }, `${type} — ${year}`),
        el("span",{ class: "writing-venue" }, venue),
        el("p",   { class: "writing-excerpt" }, excerpt)
      );
      item.appendChild(main);

      if (href) {
        const col = el("div", { class: "writing-link-col" });
        col.appendChild(
          el("a", { class: "writing-link", href, target: "_blank", rel: "noopener" }, hrefLabel)
        );
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

    if (videos && videos.length) {
      // Video embed grid
      const grid = el("div", { class: "videos-grid reveal" });
      videos.forEach(({ id, title }) => {
        const embedDiv = el("div", { class: "video-embed" });
        const iframe = el("iframe", {
          src:            `https://www.youtube.com/embed/${id}`,
          title:          title || "YouTube video",
          allow:          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
          allowfullscreen: "",
          loading:        "lazy",
        });
        embedDiv.appendChild(iframe);
        grid.appendChild(embedDiv);
      });
      wrap.appendChild(grid);
    } else {
      // Channel CTA (no videos configured yet)
      const cta = el("div", { class: "content-channel-cta reveal" });
      if (channelUrl) {
        const link = el("a", {
          class:  "content-channel-link",
          href:   channelUrl,
          target: "_blank",
          rel:    "noopener",
        });
        link.append(starSVG(22), channelLabel || "Visit Channel →");
        cta.appendChild(link);
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

    const dot  = el("div", { id: "cursor-dot"  });
    const ring = el("div", { id: "cursor-ring" });
    document.body.append(dot, ring);

    let dx = window.innerWidth  / 2;
    let dy = window.innerHeight / 2;
    let rx = dx, ry = dy;

    // Dot follows exactly; ring lerps behind
    document.addEventListener('mousemove', e => {
      dx = e.clientX;
      dy = e.clientY;
      dot.style.left = dx + 'px';
      dot.style.top  = dy + 'px';
    });

    // Fade both out when cursor leaves the window
    document.documentElement.addEventListener('mouseleave', () => {
      dot.style.opacity  = '0';
      ring.style.opacity = '0';
    });
    document.documentElement.addEventListener('mouseenter', () => {
      dot.style.opacity  = '1';
      ring.style.opacity = '1';
    });

    // Ring lags with smooth lerp
    (function loop() {
      requestAnimationFrame(loop);
      rx += (dx - rx) * 0.10;
      ry += (dy - ry) * 0.10;
      ring.style.left = rx.toFixed(1) + 'px';
      ring.style.top  = ry.toFixed(1) + 'px';
    })();
  }

  /* ── Spherize heading effect ──────────────────────────────────
     Each heading character gets an autonomous sinusoidal drift
     (different phase/speed per char) AND a cursor-proximity scale
     effect.  The cursor bulge fades smoothly into the drift as the
     cursor moves away, so both always coexist.
  ───────────────────────────────────────────────────────────── */
  function initSpherize() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const targets = document.querySelectorAll('.hero-headline, .section-heading');
    if (!targets.length) return;

    // Split each heading into per-character inline-block spans
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

    // Cache spans & stamp per-character drift parameters
    const spans = Array.from(document.querySelectorAll('.spherize-char'));
    if (!spans.length) return;

    spans.forEach(s => {
      s._ph  = Math.random() * Math.PI * 2;          // phase offset
      s._spd = 0.35 + Math.random() * 0.55;          // drift speed multiplier
      s._amp = 1.2  + Math.random() * 1.6;           // drift amplitude (px)
    });

    const RADIUS    = 170;    // cursor influence radius (px)
    const MAX_SCALE = 0.26;   // maximum scale-up at cursor centre

    let mx = -9999, my = -9999;
    let clock = 0;

    window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    document.addEventListener('mouseleave', () => { mx = -9999; my = -9999; });

    (function loop() {
      requestAnimationFrame(loop);
      clock += 0.007; // ~0.42 rad/s at 60 fps — slow, dreamy

      spans.forEach(s => {
        const r  = s.getBoundingClientRect();
        const cx = r.left + r.width  * 0.5;
        const cy = r.top  + r.height * 0.5;
        const d  = Math.hypot(mx - cx, my - cy);

        // Autonomous drift — always running
        const driftX = Math.sin(clock * s._spd +        s._ph) * s._amp;
        const driftY = Math.cos(clock * s._spd * 0.65 + s._ph) * s._amp;

        if (d >= RADIUS) {
          // Far from cursor: pure drift
          s.style.transform = `translate(${driftX.toFixed(2)}px,${driftY.toFixed(2)}px)`;
          return;
        }

        // Near cursor: blend in scale, fade out drift
        const t      = 1 - d / RADIUS;           // 1 at cursor, 0 at edge
        const scale  = 1 + MAX_SCALE * t * t;
        const dFade  = 1 - t * t;                // drift fades as cursor approaches
        s.style.transform =
          `translate(${(driftX * dFade).toFixed(2)}px,${(driftY * dFade).toFixed(2)}px)` +
          ` scale(${scale.toFixed(4)})`;
      });
    })();
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
