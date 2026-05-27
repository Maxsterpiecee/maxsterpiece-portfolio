/**
 * HERO STAR — cursor-tracking smooth drift.
 *
 * The large blurred SVG star (.hero-star-svg) in the hero section
 * follows the cursor with a smooth lerp, adding a parallax-like
 * interactive feel on top of the scroll parallax from main.js.
 *
 * No canvas. No particles. Just a CSS transform on the SVG element.
 */
(function () {
  'use strict';

  // Skip if user prefers no motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function init() {
    const svg = document.querySelector('.hero-star-svg');
    if (!svg) return;

    // Normalised target position (–1 … 1 across each axis)
    let tx = 0, ty = 0;
    // Smoothed current position
    let cx = 0, cy = 0;

    // Maximum pixel drift from centre in each direction
    const MAX_X = 28;
    const MAX_Y = 18;

    function onMove(clientX, clientY) {
      tx = (clientX / window.innerWidth  - 0.5) * 2;
      ty = (clientY / window.innerHeight - 0.5) * 2;
    }

    window.addEventListener('mousemove', e => onMove(e.clientX, e.clientY));
    window.addEventListener('touchmove', e => {
      onMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    let paused = false;
    document.addEventListener('visibilitychange', () => {
      paused = document.hidden;
    });

    (function loop() {
      requestAnimationFrame(loop);
      if (paused) return;

      // Smooth lerp — 0.04 = slow, dreamy follow
      cx += (tx - cx) * 0.04;
      cy += (ty - cy) * 0.04;

      const dx = (cx * MAX_X).toFixed(2);
      const dy = (cy * MAX_Y).toFixed(2);

      svg.style.transform = `translate(${dx}px, ${dy}px)`;
    })();
  }

  if (document.readyState === 'complete') init();
  else window.addEventListener('load', init);
})();
