/**
 * HERO STAR — 2D particle field shaped as a 4-pointed star.
 * Blurred and faded into the hero background.
 * Three depth layers shift slightly with cursor movement (2D parallax).
 *
 * No dependencies. Pure Canvas 2D.
 */
(function () {
  'use strict';

  /* ── Star shape: Lamé curve |x|^p + |y|^p ≤ 1, p < 1 = star
        p = 0.45 matches the sharp concave logo silhouette        */
  const POWER = 0.45;

  function outlinePoint(t) {
    const ct = Math.cos(t), st = Math.sin(t);
    const e  = 2 / POWER; // ≈ 4.44
    return {
      x: Math.sign(ct) * Math.pow(Math.abs(ct), e),
      y: Math.sign(st) * Math.pow(Math.abs(st), e),
    };
  }

  /* ── Particle generation ─────────────────────────────────── */
  function generate() {
    const pts = [];

    // Interior — rejection sampling into the star SDF
    let tries = 0;
    while (pts.length < 560 && tries < 80000) {
      const x = Math.random() * 2 - 1;
      const y = Math.random() * 2 - 1;
      const sdf = Math.pow(Math.abs(x), POWER) + Math.pow(Math.abs(y), POWER);
      if (sdf <= 1) {
        const distFromEdge = 1 - sdf;          // 0 = edge, 1 = centre
        const layer = Math.floor(Math.random() * 3); // 0 near, 1 mid, 2 far
        pts.push({
          bx: x, by: y,
          layer,
          // Larger dots for near layer (look closer through blur)
          size:      1.5 + Math.random() * 2.0 + (2 - layer) * 0.8,
          baseAlpha: 0.10 + distFromEdge * 0.38 + Math.random() * 0.12,
          dPhase:    Math.random() * Math.PI * 2,
          dSpeed:    0.06 + Math.random() * 0.16,
          dAmp:      0.003 + Math.random() * 0.005,
        });
      }
      tries++;
    }

    // Crisp outline — parametric boundary
    const N = 360;
    for (let i = 0; i < N; i++) {
      const t = (i / N) * Math.PI * 2;
      const { x, y } = outlinePoint(t);
      pts.push({
        bx: x * 0.984, by: y * 0.984,
        layer: Math.floor(Math.random() * 3),
        size:      2.0 + Math.random() * 1.5,
        baseAlpha: 0.38 + Math.random() * 0.25,
        dPhase:    Math.random() * Math.PI * 2,
        dSpeed:    0.04 + Math.random() * 0.08,
        dAmp:      0.001,
      });
    }

    return pts;
  }

  /* ── Main init ───────────────────────────────────────────── */
  function init() {
    const container = document.getElementById('hero-star');
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'display:block;';
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let dim = 480;
    function setSize() {
      dim = Math.min(container.clientWidth, container.clientHeight, 480);
      canvas.width  = dim;
      canvas.height = dim;
    }
    setSize();

    const particles = generate();

    /* ── Mouse / touch (normalized –1…1) */
    const mx = { v: 0, t: 0 };
    const my = { v: 0, t: 0 };
    function onMove(cx, cy) {
      mx.t = (cx / window.innerWidth  - 0.5) * 2;
      my.t = (cy / window.innerHeight - 0.5) * 2;
    }
    window.addEventListener('mousemove', e => onMove(e.clientX, e.clientY));
    window.addEventListener('touchmove', e => {
      onMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    /* ── Layer parallax amounts (px shift per normalised mouse unit)
          Near layer moves most, far layer barely moves            */
    const SHIFT = [9, 4.5, 1.5];

    let clock  = 0;
    let paused = false;
    document.addEventListener('visibilitychange', () => { paused = document.hidden; });

    (function loop() {
      requestAnimationFrame(loop);
      if (paused) return;
      clock += 0.005;

      // Smooth lerp mouse
      mx.v += (mx.t - mx.v) * 0.04;
      my.v += (my.t - my.v) * 0.04;

      const R  = dim * 0.38;
      const cx = dim * 0.5;
      const cy = dim * 0.5;

      ctx.clearRect(0, 0, dim, dim);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const s = SHIFT[p.layer];

        // Organic drift
        const dx = Math.sin(clock * p.dSpeed + p.dPhase) * p.dAmp;
        const dy = Math.cos(clock * p.dSpeed * 0.7 + p.dPhase) * p.dAmp;

        // 2D position + cursor layer shift
        const px = cx + (p.bx + dx) * R + mx.v * s;
        const py = cy + (p.by + dy) * R + my.v * s;

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210,210,220,${p.baseAlpha.toFixed(3)})`;
        ctx.fill();
      }
    })();

    window.addEventListener('resize', setSize);
  }

  if (document.readyState === 'complete') init();
  else window.addEventListener('load', init);
})();
