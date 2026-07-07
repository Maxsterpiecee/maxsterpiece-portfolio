/**
 * CURSOR — cursor.js
 * Custom star cursor + smoke trail. Self-contained, no dependencies.
 * Loaded on all pages (index.html and story pages).
 */
(function () {
  'use strict';
  if (window.matchMedia('(pointer: coarse)').matches) return;

  /* ── Star SVG cursor ──────────────────────────────────────── */
  var ns = 'http://www.w3.org/2000/svg';
  var star = document.createElementNS(ns, 'svg');
  star.id = 'cursor-star';
  star.setAttribute('viewBox', '-1.1 -1.1 2.2 2.2');
  star.setAttribute('width',  '26');
  star.setAttribute('height', '26');
  star.setAttribute('aria-hidden', 'true');
  var starPath = document.createElementNS(ns, 'path');
  starPath.setAttribute('d', 'M0,-1 C0,-0.22 -0.22,0 -1,0 C-0.22,0 0,0.22 0,1 C0,0.22 0.22,0 1,0 C0.22,0 0,-0.22 0,-1 Z');
  star.appendChild(starPath);

  /* ── Canvas smoke trail ───────────────────────────────────── */
  var canvas = document.createElement('canvas');
  canvas.id = 'cursor-canvas';
  document.body.append(star, canvas);

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  var ctx  = canvas.getContext('2d');
  var pts  = [];
  var LIFE = 520; // ms each trail point lives

  function isClickable(el) {
    return !!(el && el.closest('a, button, [role="button"]'));
  }

  document.addEventListener('mousemove', function (e) {
    var x = e.clientX, y = e.clientY;
    star.style.left = x + 'px';
    star.style.top  = y + 'px';

    var last = pts[pts.length - 1];
    if (!last || Math.hypot(x - last.x, y - last.y) >= 3) {
      pts.push({ x: x, y: y, t: performance.now() });
    }

    if (isClickable(document.elementFromPoint(x, y))) {
      star.classList.add('cursor-hover');
    } else {
      star.classList.remove('cursor-hover');
    }
  });

  document.documentElement.addEventListener('mouseleave', function () { star.style.opacity = '0'; });
  document.documentElement.addEventListener('mouseenter', function () { star.style.opacity = '1'; });

  /* ── Draw loop ────────────────────────────────────────────── */
  (function draw() {
    requestAnimationFrame(draw);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var now = performance.now();
    while (pts.length && now - pts[0].t > LIFE) pts.shift();
    if (pts.length < 2) return;

    var n = pts.length;
    var t = now * 0.001; // seconds — drives the ripple oscillation

    // Displace each point perpendicularly to its local direction using two
    // overlapping sine waves — the tail wobbles, the tip stays locked to cursor.
    var disp = pts.map(function (p, i) {
      var tailFrac = 1 - i / (n - 1); // 1 at tail (oldest), 0 at tip (newest)
      var amp = tailFrac * tailFrac * 4;
      var dx, dy;
      if      (i === 0)     { dx = pts[1].x - pts[0].x;           dy = pts[1].y - pts[0].y; }
      else if (i === n - 1) { dx = pts[n-1].x - pts[n-2].x;       dy = pts[n-1].y - pts[n-2].y; }
      else                  { dx = pts[i+1].x - pts[i-1].x;       dy = pts[i+1].y - pts[i-1].y; }
      var len = Math.hypot(dx, dy) || 1;
      var px  = -dy / len; // perpendicular unit vector
      var py  =  dx / len;
      var wave = (Math.sin(t * 2.6 + i * 0.42) * 0.6 +
                  Math.sin(t * 1.3 + i * 0.87) * 0.4) * amp;
      return { x: p.x + px * wave, y: p.y + py * wave };
    });

    ctx.lineCap  = 'round';
    ctx.lineJoin = 'round';

    // Three render passes — grouped so ctx.filter changes only 3× per frame.
    // Each pass sweeps all segments; per-segment colour and opacity vary by age.
    // Colour: pink (#ff0060) at tip → purple (#ae16ff) at tail. No orange.
    var passes = [
      { blur: '14px',  lw: 13,  mul: 0.22 },  // outer halo — wide, barely-there
      { blur: '6px',   lw: 5,   mul: 0.40 },  // mid glow — carries the colour
      { blur: '2.5px', lw: 2.5, mul: 0.68 },  // soft core — not rigid
    ];

    passes.forEach(function (pass) {
      ctx.save();
      ctx.filter = 'blur(' + pass.blur + ')';
      for (var i = 1; i < n; i++) {
        var age  = (now - pts[i].t) / LIFE;   // 0 = freshest, 1 = about to expire
        var life = Math.pow(1 - age, 1.3);    // fade curve: sharp near tip, slow at tail
        // Pink → purple interpolated by age
        var r = Math.round(255 + (174 - 255) * age);
        var g = Math.round(0   + (22  - 0  ) * age);
        var b = Math.round(96  + (255 - 96 ) * age);
        ctx.beginPath();
        ctx.moveTo(disp[i - 1].x, disp[i - 1].y);
        ctx.lineTo(disp[i].x,     disp[i].y);
        ctx.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',' +
                          (life * pass.mul).toFixed(3) + ')';
        ctx.lineWidth   = pass.lw;
        ctx.stroke();
      }
      ctx.restore();
    });
  })();
})();
