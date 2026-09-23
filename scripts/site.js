/* site.js — Vision Pro. No dependencies, no third-party calls. */
(function () {
  'use strict';
  var d = document;
  // Where this build lives. Resolved from this script's own URL, so the site works at a domain
  // root, in a subdirectory, or from a file path — nothing about the host is assumed.
  var me = d.currentScript || d.querySelector('script[src$="site.js"]');
  var ROOT = new URL('../', me ? me.src : location.href);

  /* header shadow */
  var header = d.querySelector('[data-header]');
  var onScroll = function () { if (header) header.classList.toggle('is-scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* desktop menus: click/keyboard; hover handled in CSS */
  var items = [].slice.call(d.querySelectorAll('[data-menu]'));
  function closeAll(except) {
    items.forEach(function (it) { if (it !== except) { it.classList.remove('is-open'); var b = it.querySelector('.nav__trigger'); if (b) b.setAttribute('aria-expanded', 'false'); } });
  }
  items.forEach(function (it) {
    var btn = it.querySelector('.nav__trigger');
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var open = !it.classList.contains('is-open');
      closeAll(it);
      it.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    it.addEventListener('mouseleave', function () { it.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); btn.blur && null; });
  });
  d.addEventListener('click', function (e) { if (!e.target.closest('[data-menu]')) closeAll(); });
  d.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var open = d.querySelector('[data-menu].is-open');
    closeAll();
    if (open) open.querySelector('.nav__trigger').focus();
    closeDrawer();
  });

  /* drawer */
  var drawer = d.querySelector('[data-drawer]');
  var opener = d.querySelector('[data-drawer-open]');
  var lastFocus = null;
  function openDrawer() {
    if (!drawer) return;
    lastFocus = d.activeElement;
    drawer.hidden = false; drawer.classList.add('is-open');
    d.body.style.overflow = 'hidden';
    if (opener) opener.setAttribute('aria-expanded', 'true');
    var f = drawer.querySelector('a,button'); if (f) f.focus();
  }
  function closeDrawer() {
    if (!drawer || drawer.hidden) return;
    drawer.classList.remove('is-open'); drawer.hidden = true;
    d.body.style.overflow = '';
    if (opener) opener.setAttribute('aria-expanded', 'false');
    if (lastFocus) lastFocus.focus();
  }
  if (opener) opener.addEventListener('click', openDrawer);
  [].forEach.call(d.querySelectorAll('[data-drawer-close]'), function (b) { b.addEventListener('click', closeDrawer); });
  if (drawer) drawer.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var f = [].slice.call(drawer.querySelectorAll('a[href],button,summary')).filter(function (x) { return x.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* reveal on scroll */
  var rev = [].slice.call(d.querySelectorAll('[data-reveal]'));
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    d.documentElement.classList.add('reveal-ready');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rev.forEach(function (el) { io.observe(el); });
  } else rev.forEach(function (el) { el.classList.add('is-in'); });

  /* table of contents: built from the page's own section headings, then kept in sync */
  var tocBox = d.querySelector('[data-toc]');
  if (tocBox) {
    var hs = [].slice.call(d.querySelectorAll('.prose h2[id]')).slice(0, 10);
    if (hs.length >= 3) {
      var ul = tocBox.querySelector('ul');
      hs.forEach(function (h) { var li = d.createElement('li'), a = d.createElement('a'); a.href = '#' + h.id; a.textContent = h.textContent.trim(); li.appendChild(a); ul.appendChild(li); });
      tocBox.hidden = false;
    }
  }
  var toc = [].slice.call(d.querySelectorAll('.toc a'));
  if (toc.length && 'IntersectionObserver' in window) {
    var map = {};
    toc.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var tio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { toc.forEach(function (a) { a.classList.remove('is-active'); }); var a = map[e.target.id]; if (a) a.classList.add('is-active'); } });
    }, { rootMargin: '-20% 0px -70% 0px' });
    Object.keys(map).forEach(function (id) { var h = d.getElementById(id); if (h) tio.observe(h); });
  }

  /* today's hours */
  var day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];
  [].forEach.call(d.querySelectorAll('tr[data-day="' + day + '"]'), function (tr) { tr.classList.add('is-today'); });

  /* forms: nothing is sent until the practice connects an endpoint (see docs/DEPLOY.md) */
  [].forEach.call(d.querySelectorAll('form.vf'), function (f) {
    f.addEventListener('submit', function (e) {
      var endpoint = f.getAttribute('data-endpoint');
      if (!f.checkValidity()) { e.preventDefault(); f.reportValidity(); return; }
      if (endpoint) { f.setAttribute('action', endpoint); return; }
      e.preventDefault();
      var s = f.querySelector('[data-form-status]');
      if (s) {
        s.textContent = 'Online submission is not available yet. Please call us at (281) 353-3937 to complete this request.';
        s.classList.add('is-shown'); s.focus && s.setAttribute('tabindex', '-1'); s.focus && s.focus();
      }
    });
  });

  /* site search (reads search-index.json next to this build) */
  var out = d.querySelector('[data-search-results]');
  if (out) {
    var q = (new URLSearchParams(location.search).get('q') || '').trim();
    var input = d.querySelector('[data-search-input]');
    if (input) input.value = q;
    var status = d.querySelector('[data-search-status]');
    if (!q) { status.textContent = 'Type a word or two above to search the site.'; return; }
    fetch(new URL('search-index.json', ROOT)).then(function (r) { return r.json(); }).then(function (idx) {
      var terms = q.toLowerCase().split(/\s+/).filter(Boolean);
      var hits = idx.map(function (p) {
        var hay = (p.t + ' ' + p.d + ' ' + p.x).toLowerCase(), score = 0;
        terms.forEach(function (t) { if (p.t.toLowerCase().indexOf(t) > -1) score += 5; if (hay.indexOf(t) > -1) score += 1; });
        return { p: p, s: terms.every(function (t) { return hay.indexOf(t) > -1; }) ? score : 0 };
      }).filter(function (h) { return h.s > 0; }).sort(function (a, b) { return b.s - a.s; }).slice(0, 30);
      status.textContent = hits.length + ' result' + (hits.length === 1 ? '' : 's') + ' for “' + q + '”';
      out.innerHTML = '';
      hits.forEach(function (h) {
        var li = d.createElement('li'), a = d.createElement('a'), s = d.createElement('strong'), sp = d.createElement('span');
        a.href = new URL(h.p.u.replace(/^\//, ''), ROOT).href;
        s.textContent = h.p.t; sp.textContent = h.p.d;
        a.appendChild(s); a.appendChild(sp); li.appendChild(a); out.appendChild(li);
      });
    }).catch(function () { status.textContent = 'Search is unavailable right now.'; });
  }
})();
