(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s) }, $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)) };
  var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  function clamp(v, a, b) { a = a === undefined ? 0 : a; b = b === undefined ? 1 : b; return Math.min(b, Math.max(a, v)) }
  function lerp(a, b, t) { return a + (b - a) * t }
  function sstep(a, b, v) { var t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t) }
  var vw = innerWidth, vh = innerHeight, S = scrollY, vel = 0;

  /* ---------- loader: line draws around the name ---------- */
  var path = $('#loader path'), dot = $('#loader circle');
  function ready() { document.body.classList.remove('loading'); document.body.classList.add('ready') }
  if (reduce || !path) { ready() } else {
    var L = path.getTotalLength(), t0 = null, D = 1800;
    path.style.strokeDasharray = L; path.style.strokeDashoffset = L;
    var lf = function (ts) {
      if (!t0) t0 = ts; var t = clamp((ts - t0) / D), e = 1 - Math.pow(1 - t, 3);
      path.style.strokeDashoffset = L * (1 - e);
      var pt = path.getPointAtLength(L * e); dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y);
      if (t < 1) requestAnimationFrame(lf); else setTimeout(ready, 300);
    };
    requestAnimationFrame(lf);
  }

  /* ---------- elements ---------- */
  var hero = $('#hero'), heroH = $('#hero h1'), heroP = $('#hero .ptw');
  var about = $('#about'), card = $('#aboutCard'), beam = $('#aboutCard .beam'), fig = $('#aboutCard .fig'), paint = $('#about .paint'), w1 = $('.words span:first-child'), w2 = $('.words span:last-child'), words = $('.words'), ui = $('.spot-ui');
  var exp = $('#exp'), track = $('#exp .track'), ghost = $('#exp .ghost'), panels = $$('.panel');
  var feat = $('#feat'), fcards = $$('.fcard'), fcap = $('.f-cap'), fstage = $('#feat .stick');
  var works = $('#works'), hcards = $$('.hcard'), wlabel = $('.w-label'), wlist = $$('.w-list li'), wstage = $('#works .stick');
  var scenes = {}, lastS = -1;
  function measure() {
    vw = innerWidth; vh = innerHeight; lastS = -1;
    exp.style.height = (vh + (panels.length - 1) * vw * .9) + 'px';
    [['hero', hero], ['about', about], ['exp', exp], ['feat', feat], ['works', works]].forEach(function (a) {
      var r = a[1].getBoundingClientRect(); scenes[a[0]] = { top: r.top + scrollY, h: Math.max(1, a[1].offsetHeight - vh) };
    });
  }
  function prog(n) { var s = scenes[n]; return clamp((S - s.top) / s.h) }
  function inView(n, pad) { var s = scenes[n]; return S > s.top - vh * (pad || 1) && S < s.top + s.h + vh * (pad || 1) }

  /* ---------- hero ---------- */
  function updHero() {
    var p = scenes.hero ? prog('hero') : clamp(S / vh);
    heroH.style.transform = 'translate3d(0,' + (-p * 120) + 'px,0)';
    heroH.style.opacity = Math.max(0, 1 - p * 1.3);
    heroH.style.filter = p > .03 ? 'blur(' + (p * 14) + 'px)' : 'none';
    heroP.style.transform = 'translate3d(0,' + (-p * 60) + 'px,0) scale(' + (1 + p * .06) + ')';
  }
  /* ---------- about: card grows, words split, spotlight ---------- */
  function updAbout() {
    if (!inView('about')) return;
    var p = prog('about'), g = sstep(.05, .56, p);
    var w0 = Math.min(vw * .62, 280), h0 = w0 * 1.12;
    card.style.width = lerp(w0, vw, g) + 'px'; card.style.height = lerp(h0, vh, g) + 'px'; card.style.borderRadius = lerp(20, 0, g) + 'px';
    var sp = g * vw * .37;
    w1.style.transform = 'translate3d(' + (-sp) + 'px,' + (-g * vh * .04) + 'px,0) scaleX(' + (1 + g * .5) + ')';
    w2.style.transform = 'translate3d(' + sp + 'px,' + (g * vh * .05) + 'px,0) scaleX(' + (1 + g * .5) + ')';
    words.style.opacity = 1 - sstep(.5, .68, p);
    beam.style.opacity = sstep(.3, .56, p);
    var m = vw < 760;
    fig.style.setProperty('--fig-x', lerp(50, m ? 54 : 73, g) + '%');
    fig.style.setProperty('--fig-y', lerp(55, m ? 58 : 50, g) + '%');
    var u = sstep(.6, .78, p); ui.style.opacity = u; ui.style.transform = 'translate3d(0,' + ((1 - u) * 34) + 'px,0)';
    paint.style.transform = 'scale(' + (1.06 + p * .14) + ') translate3d(0,' + (-p * 40) + 'px,0)';
  }
  /* ---------- experience: horizontal track + RGB split ---------- */
  function updExp() {
    if (!inView('exp')) return;
    var p = prog('exp'), n = panels.length - 1, maxX = n * vw, sx = clamp(vel * .07, -14, 14);
    track.style.transform = 'translate3d(' + (-p * maxX) + 'px,0,0) skewX(' + clamp(vel * .035, -5, 5) + 'deg)';
    ghost.style.transform = 'translate3d(' + (-p * maxX * .5) + 'px,-50%,0)';
    exp.style.setProperty('--sx', sx + 'px');
    panels.forEach(function (pn, i) { pn.style.setProperty('--o', clamp(1.25 - Math.abs(p * n - i) * 1.05)) });
  }
  /* ---------- featured: curved ribbon ---------- */
  var lastCap = -1;
  function updFeat() {
    if (!inView('feat')) return;
    var p = prog('feat'), n = fcards.length, a = p * (n - 1), m = vw < 760;
    var cw = Math.min(vw * (m ? .8 : .52), 580), ch = cw * .6;
    fstage.style.setProperty('--cw', cw + 'px'); fstage.style.setProperty('--ch', ch + 'px');
    var sp = cw * (m ? .95 : 1.02);
    fcards.forEach(function (c, i) {
      var d = i - a, ad = Math.abs(d);
      c.style.transform = 'translate3d(' + (d * sp) + 'px,' + (Math.sin(d * 1.15) * 26) + 'px,' + (-Math.min(ad, 2.5) * 170) + 'px) rotateY(' + clamp(-d * 30, -52, 52) + 'deg) scale(' + (1 - Math.min(ad, 2) * .06) + ')';
      c.style.opacity = clamp(1.15 - ad * .32); c.style.zIndex = 100 - Math.round(ad * 10);
    });
    var k = clamp(Math.round(a), 0, n - 1);
    if (k !== lastCap) { lastCap = k; var c = fcards[k]; fcap.innerHTML = '<b>' + c.dataset.t + '</b><span class="mono">' + c.dataset.s + '</span>' }
    fcap.style.setProperty('--sx', clamp(vel * .05, -10, 10) + 'px');
    fstage.style.setProperty('--sx', clamp(vel * .05, -10, 10) + 'px');
  }
  /* ---------- works: hexagon ring -> vertical carousel ---------- */
  var lastLab = '';
  var projNames = wlist.map(function (l) { return l.textContent });
  function updWorks() {
    if (!inView('works')) return;
    var p = prog('works'), N = hcards.length, m = vw < 760;
    var hw = Math.min(vw * (m ? .4 : .2), 230), hh = hw * .68;
    wstage.style.setProperty('--hw', hw + 'px'); wstage.style.setProperty('--hh', hh + 'px');
    var R = Math.min(vw * (m ? .34 : .27), vh * .33), Ry = R * (m ? .95 : .8);
    var mix = 1 - sstep(.26, .5, p), rot = p * 2.4, a = clamp((p - .46) / .54) * (N - 1);
    hcards.forEach(function (c, i) {
      var th = (i / N) * Math.PI * 2 + rot - Math.PI / 2;
      var hx = R * Math.cos(th), hy = Ry * Math.sin(th);
      var tan = (th * 180 / Math.PI + 90) % 180; if (tan > 90) tan -= 180; if (tan < -90) tan += 180; tan *= .7;
      var d = i - a, cx = m ? 0 : vw * .16, cy = d * vh * .5, crx = clamp(-d * 36, -72, 72), cs = (m ? 1.75 : 1.55) * (1 - Math.min(Math.abs(d), 2) * .13), co = clamp(1.3 - Math.abs(d));
      var x = lerp(cx, hx, mix), y = lerp(cy, hy, mix), rx = lerp(crx, 40, mix), rz = lerp(0, tan, mix), s = lerp(cs, 1, mix), o = lerp(co, 1, mix);
      c.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0) rotateX(' + rx + 'deg) rotateZ(' + rz + 'deg) scale(' + s + ')';
      c.style.opacity = o; c.style.zIndex = Math.round(50 - Math.abs(d) * 5);
    });
    var side = mix < .5, k = clamp(Math.round(a), 0, N - 1), pi = +hcards[k].dataset.p;
    var lab = side ? projNames[pi] : 'Works \u201926';
    if (lab !== lastLab) { lastLab = lab; wlabel.textContent = lab }
    wlabel.classList.toggle('side', side);
    wlist.forEach(function (l, i) { l.classList.toggle('on', side && i === pi) });
  }
  /* ---------- main loop ---------- */
  function tick() {
    var target = scrollY, isTouch = vw < 760 || 'ontouchstart' in window;
    S += (target - S) * (reduce ? 1 : (isTouch ? .14 : .08));
    if (Math.abs(target - S) < .05) S = target; vel = target - S;
    if (S !== lastS) { lastS = S; updHero(); updAbout(); updExp(); updFeat(); updWorks() }
    requestAnimationFrame(tick);
  }
  measure(); addEventListener('resize', measure); addEventListener('load', measure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  requestAnimationFrame(tick);

  /* ---------- reveals, accordion, clock, magnetic pills ---------- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }) }, { threshold: .12 });
    $$('.rv').forEach(function (el) { io.observe(el) });
  } else { $$('.rv').forEach(function (el) { el.classList.add('in') }) }
  $$('.acc-i button').forEach(function (b) {
    b.addEventListener('click', function () {
      var it = b.parentNode, open = it.classList.contains('open');
      $$('.acc-i.open').forEach(function (o) { o.classList.remove('open') });
      if (!open) it.classList.add('open');
    })
  });
  var cl = $('#clock'), cd = $('#clockDate');
  function clock() {
    try {
      var d = new Date();
      cl.textContent = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Colombo', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(d);
      cd.textContent = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Colombo', day: 'numeric', month: 'short', year: 'numeric' }).format(d);
    } catch (e) { }
  }
  clock(); setInterval(clock, 1000);
  if (!reduce) $$('.pill').forEach(function (el) {
    el.addEventListener('pointermove', function (e) { var b = el.getBoundingClientRect(); el.style.transform = 'translate(' + ((e.clientX - b.left - b.width / 2) * .25) + 'px,' + ((e.clientY - b.top - b.height / 2) * .35) + 'px)' });
    el.addEventListener('pointerleave', function () { el.style.transform = '' });
  });
})();
