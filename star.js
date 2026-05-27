/**
 * HERO STAR — particle dot field shaped as a 4-pointed star,
 * with 3D perspective tilt that follows the mouse / touch.
 *
 * No dependencies. Pure Canvas 2D.
 */
(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────────
     Lamé / superellipse with p < 1 gives a 4-pointed star shape.
     |x|^p + |y|^p = 1  (p = 0.45 matches the logo's sharpness)
  ───────────────────────────────────────────────────────────── */
  const POWER = 0.45;

  function inStar(x, y) {
    return Math.pow(Math.abs(x), POWER) + Math.pow(Math.abs(y), POWER) <= 1;
  }

  // Parametric outline: x = sign(cos t) · |cos t|^(2/p)
  function starOutlinePoint(t) {
    const ct = Math.cos(t), st = Math.sin(t);
    const exp = 2 / POWER; // ≈ 4.44
    return {
      x: Math.sign(ct) * Math.pow(Math.abs(ct), exp),
      y: Math.sign(st) * Math.pow(Math.abs(st), exp),
    };
  }

  /* ─────────────────────────────────────────────────────────────
     Particle generation
  ───────────────────────────────────────────────────────────── */
  function generateParticles() {
    const pts = [];

    // ── Interior (rejection sampling)
    let tries = 0;
    while (pts.length < 900 && tries < 80000) {
      const x = Math.random() * 2 - 1;
      const y = Math.random() * 2 - 1;
      const sdf = Math.pow(Math.abs(x), POWER) + Math.pow(Math.abs(y), POWER);
      if (sdf <= 1) {
        const edge = 1 - sdf; // 0 = at edge, 1 = at centre
        pts.push({
          bx: x, by: y,
          bz: (Math.random() * 2 - 1) * 0.06, // thin-disk depth
          size:      0.55 + Math.random() * 1.1,
          baseAlpha: 0.15 + edge * 0.52 + Math.random() * 0.18,
          dPhase:    Math.random() * Math.PI * 2,
          dSpeed:    0.12 + Math.random() * 0.30,
          dAmp:      0.003 + Math.random() * 0.007,
        });
      }
      tries++;
    }

    // ── Outline (parametric, crisp boundary)
    const N_OUTLINE = 520;
    for (let i = 0; i < N_OUTLINE; i++) {
      const t = (i / N_OUTLINE) * Math.PI * 2;
      const { x, y } = starOutlinePoint(t);
      pts.push({
        bx: x * 0.985, by: y * 0.985,
        bz: (Math.random() * 2 - 1) * 0.02,
        size:      0.9 + Math.random() * 1.0,
        baseAlpha: 0.60 + Math.random() * 0.35,
        dPhase:    Math.random() * Math.PI * 2,
        dSpeed:    0.06 + Math.random() * 0.12,
        dAmp:      0.0015,
      });
    }

    return pts;
  }

  /* ─────────────────────────────────────────────────────────────
     Main init — called once the DOM is ready
  ───────────────────────────────────────────────────────────── */
  function init() {
    const container = document.getElementById('hero-star');
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.style.display = 'block';
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    // ── Sizing (square canvas, centred inside the container)
    let dim = 480;
    function setSize() {
      dim = Math.min(container.clientWidth, container.clientHeight, 480);
      canvas.width  = dim;
      canvas.height = dim;
    }
    setSize();

    // ── Pre-generate particles once
    const particles = generateParticles();

    // ── Mouse / touch
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    function onMove(cx, cy) {
      mouse.tx =  (cx / window.innerWidth  - 0.5) * 2;  // –1 … 1
      mouse.ty = -(cy / window.innerHeight - 0.5) * 2;
    }
    window.addEventListener('mousemove', e => onMove(e.clientX, e.clientY));
    window.addEventListener('touchmove', e => {
      e.preventDefault();
      onMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: false });

    // ── Animation
    let clock  = 0;
    let paused = false;
    document.addEventListener('visibilitychange', () => { paused = document.hidden; });

    const FOV = 520; // perspective distance

    (function loop() {
      requestAnimationFrame(loop);
      if (paused) return;
      clock += 0.007;

      // Smooth-lerp mouse influence
      mouse.x += (mouse.tx - mouse.x) * 0.045;
      mouse.y += (mouse.ty - mouse.y) * 0.045;

      // Scene geometry
      const R     = dim * 0.38;        // star outer radius in px
      const depth = R * 0.06;          // thin-disk thickness
      const cx    = dim * 0.5;
      const cy    = dim * 0.5;

      // 3D rotation:
      //   rotY = slow auto-spin + mouse-X tilt
      //   rotX = mouse-Y tilt only (no auto-spin on X)
      const rotY = clock * 0.16 + mouse.x * 0.55;
      const rotX = -mouse.y * 0.30;

      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);

      // Clear frame
      ctx.clearRect(0, 0, dim, dim);

      // Project every particle
      const projected = new Array(particles.length);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Tiny organic drift
        const dx = Math.sin(clock * p.dSpeed + p.dPhase) * p.dAmp;
        const dy = Math.cos(clock * p.dSpeed * 0.7 + p.dPhase) * p.dAmp;

        let x = (p.bx + dx) * R;
        let y = (p.by + dy) * R;
        let z =  p.bz * depth;

        // Rotate around Y axis
        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;

        // Rotate around X axis
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;

        // Perspective divide
        const scale = FOV / (FOV + z2);

        projected[i] = {
          px: cx + x1 * scale,
          py: cy + y2 * scale,
          sz: Math.max(0.3, p.size * scale),
          al: p.baseAlpha * Math.min(1, scale * 0.5 + 0.55),
          z:  z2,
        };
      }

      // Sort back-to-front so closer dots draw on top
      projected.sort((a, b) => a.z - b.z);

      // Draw — silver-white dots on the dark hero
      for (let i = 0; i < projected.length; i++) {
        const pt = projected[i];
        ctx.beginPath();
        ctx.arc(pt.px, pt.py, pt.sz, 0, Math.PI * 2);
        // Slightly cool silver to match the chrome palette
        ctx.fillStyle = `rgba(208, 208, 218, ${pt.al.toFixed(3)})`;
        ctx.fill();
      }
    })();

    // ── Resize
    window.addEventListener('resize', setSize);
  }

  // Run after everything (DOM + stylesheets) is ready
  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }
})();
