/**
 * PORTFOLIO — MAIN.JS
 * Reads everything from config.js (SITE object) and renders the DOM.
 * Do not put content in here — edit config.js instead.
 */

(function () {
  "use strict";

  /* ── Tiny helpers ──────────────────────────────────────────── */
  const el   = (tag, attrs = {}, ...children) => {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class")       node.className = v;
      else if (k === "html")   node.innerHTML = v;
      else                     node.setAttribute(k, v);
    }
    children.forEach(c => c && node.append(typeof c === "string" ? document.createTextNode(c) : c));
    return node;
  };

  const frag = (...nodes) => {
    const f = document.createDocumentFragment();
    nodes.forEach(n => n && f.append(n));
    return f;
  };

  /* ── Meta ──────────────────────────────────────────────────── */
  function buildMeta() {
    const { title, description, favicon } = SITE.meta;
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);

    if (favicon) {
      const link = document.querySelector("link[rel='icon']") || document.createElement("link");
      link.rel = "icon";
      // If it's a single emoji/char, use SVG data URI
      if (favicon.length <= 2) {
        link.href = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${favicon}</text></svg>`;
      } else {
        link.href = favicon;
      }
      document.head.appendChild(link);
    }
  }

  /* ── Nav ───────────────────────────────────────────────────── */
  function buildNav() {
    const nav = document.getElementById("site-nav");
    if (!nav) return;
    const { logo, links } = SITE.nav;

    const logoA = el("a", { class: "nav-logo", href: "#" }, logo);

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

    // Close nav on link click (mobile)
    ul.querySelectorAll && ul.addEventListener("click", e => {
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

    const wrap = el("div", { class: "container" });
    const h1   = el("h1", { class: "hero-headline" }, headline);
    const sub  = el("p",  { class: "hero-sub" },      subheadline);
    wrap.append(h1, sub);
    section.appendChild(wrap);
  }

  /* ── Bio ───────────────────────────────────────────────────── */
  function buildBio() {
    const section = document.getElementById("bio");
    if (!section) return;
    const { heading, photo, text, resumeLabel, resumeHref } = SITE.bio;

    const wrap = el("div", { class: "container" });
    wrap.append(
      el("p",  { class: "section-label" }, "01 — About"),
      el("h2", { class: "section-heading reveal" }, heading)
    );

    const grid = el("div", { class: "bio-grid reveal" });
    if (photo) {
      grid.classList.add("has-photo");
      const photoWrap = el("div", { class: "bio-photo-wrap" });
      photoWrap.appendChild(el("img", { src: photo, alt: "Portrait" }));
      grid.appendChild(photoWrap);
    }

    const textDiv = el("div", { class: "bio-text" });
    text.forEach(para => {
      textDiv.appendChild(el("p", {}, para));
    });

    if (resumeHref) {
      textDiv.appendChild(
        el("a", { class: "btn", href: resumeHref, target: "_blank", rel: "noopener" }, resumeLabel)
      );
    }

    grid.appendChild(textDiv);
    wrap.appendChild(grid);
    section.appendChild(wrap);
  }

  /* ── Writing ───────────────────────────────────────────────── */
  function buildWriting() {
    const section = document.getElementById("writing");
    if (!section) return;
    const { heading, subheading, items } = SITE.writing;

    const wrap = el("div", { class: "container" });
    wrap.append(
      el("p",  { class: "section-label" }, "02 — Selected Work"),
      el("h2", { class: "section-heading reveal" }, heading),
      el("p",  { class: "section-subheading reveal" }, subheading)
    );

    const list = el("div", { class: "writing-list reveal" });
    items.forEach(({ title, type, year, venue, excerpt, href, hrefLabel }) => {
      const item = el("div", { class: "writing-item" });

      const main = el("div", { class: "writing-main" });
      main.append(
        el("h3", { class: "writing-title" }, title),
        el("span", { class: "writing-meta" }, `${type} — ${year}`),
        el("span", { class: "writing-venue" }, venue),
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
      el("p",  { class: "section-label" }, "03 — Games"),
      el("h2", { class: "section-heading reveal" }, heading),
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
        el("span", { class: "game-role" }, role),
        el("span", { class: "game-year" }, year),
        el("span", { class: "game-platform" }, platform)
      );
      body.appendChild(roleRow);

      if (studio) {
        body.appendChild(
          el("p", { class: "game-studio" }, studio)
        );
      }

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

  /* ── Contact ───────────────────────────────────────────────── */
  function buildContact() {
    const section = document.getElementById("contact");
    if (!section) return;
    const { heading, intro, email, links, showForm, formAction } = SITE.contact;

    const wrap = el("div", { class: "container" });
    wrap.append(
      el("p",  { class: "section-label" }, "04 — Get In Touch"),
      el("h2", { class: "section-heading" }, heading),
      el("p",  { class: "section-subheading" }, intro)
    );

    const grid = el("div", { class: "contact-grid" });

    /* Left: email + social links */
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

    /* Right: contact form */
    if (showForm) {
      const formWrap = el("div", { class: "reveal" });
      const form = buildForm(email, formAction);
      formWrap.appendChild(form);
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
      { id: "cf-name",    label: "Your Name",    type: "text",  name: "name",    placeholder: "Jane Smith",                required: true  },
      { id: "cf-email",   label: "Your Email",   type: "email", name: "email",   placeholder: "jane@example.com",          required: true  },
      { id: "cf-subject", label: "Subject",      type: "text",  name: "subject", placeholder: "Narrative design project",  required: false },
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
      status.className = "form-status";

      const data = Object.fromEntries(new FormData(form));
      if (!data.name || !data.email || !data.message) {
        status.textContent = "Please fill in the required fields.";
        status.classList.add("error");
        return;
      }

      if (formAction) {
        // Real backend (e.g. Formspree)
        try {
          submit.disabled = true;
          submit.textContent = "Sending…";
          const res = await fetch(formAction, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify(data),
          });
          if (res.ok) {
            status.textContent = "Message sent. I'll be in touch soon.";
            status.classList.add("success");
            form.reset();
          } else {
            throw new Error("Server error");
          }
        } catch {
          status.textContent = "Something went wrong. Try emailing directly.";
          status.classList.add("error");
        } finally {
          submit.disabled = false;
          submit.textContent = "Send Message";
        }
      } else {
        // Mailto fallback
        const body = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`);
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
    inner.append(
      el("p", { class: "footer-copy" }, SITE.footer.line),
      el("a", { class: "footer-back-top", href: "#" }, "↑ Back to top")
    );
    footer.appendChild(inner);
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
    buildContact();
    buildFooter();
    initReveal();
    initActiveNav();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
