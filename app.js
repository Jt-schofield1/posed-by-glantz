(function () {
  'use strict';

  var GALLERY = [
    { src: 'images/backstage-1.jpeg', alt: 'Athlete practicing a side pose backstage', tag: 'BACKSTAGE' },
    { src: 'images/win-hallway.jpeg', alt: 'Client and Jake with an IFBB Pro Card', tag: 'IFBB PRO CARD' },
    { src: 'images/backstage-2.jpeg', alt: 'Front double biceps check backstage', tag: 'STAGE READY' },
    { src: 'images/win-stage.jpeg', alt: 'Client flexing beside Jake holding an IFBB Pro Card', tag: 'IFBB PRO CARD' },
    { src: 'images/win-hallway-2.jpeg', alt: 'Jake Glantzman, posing coach — black-and-white portrait', tag: 'THE COACH' },
    { src: 'images/jacob-bw.jpeg', alt: 'Client and Jake holding an IFBB Pro Card in the hallway', tag: 'IFBB PRO CARD' }
  ];

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---- generic hover (replicates the .dc `style-hover` mechanism) ---- */
    Array.prototype.forEach.call(document.querySelectorAll('[data-hover]'), function (el) {
      var hover = el.getAttribute('data-hover');
      el.addEventListener('mouseenter', function () {
        el._snap = el.getAttribute('style') || '';
        el.setAttribute('style', el._snap + ';' + hover);
      });
      el.addEventListener('mouseleave', function () {
        if (el._snap != null) el.setAttribute('style', el._snap);
      });
    });

    /* ---- mobile menu (menuOpen + hamburger↔X morph) ---- */
    var hamburger = document.getElementById('hamburger');
    var menu = document.getElementById('mobileMenu');
    var bar1 = document.getElementById('bar1');
    var bar2 = document.getElementById('bar2');
    var bar3 = document.getElementById('bar3');
    var menuOpen = false;
    function setMenu(open) {
      menuOpen = open;
      menu.style.display = open ? 'flex' : 'none';
      bar1.style.transform = open ? 'translateY(6.5px) rotate(45deg)' : 'none';
      bar2.style.opacity = open ? '0' : '1';
      bar3.style.transform = open ? 'translateY(-6.5px) rotate(-45deg)' : 'none';
    }
    if (hamburger) hamburger.addEventListener('click', function () { setMenu(!menuOpen); });
    Array.prototype.forEach.call(document.querySelectorAll('[data-close-menu]'), function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900 && menuOpen) setMenu(false);
    });

    /* ---- scroll reveals (IntersectionObserver, only hides below-fold) ---- */
    if (!prefersReduced) {
      var revEls = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
      var io = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          var en = entries[i];
          if (en.isIntersecting) {
            en.target.style.opacity = '1';
            en.target.style.transform = 'none';
            io.unobserve(en.target);
          }
        }
      }, { threshold: 0.12 });
      revEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top > window.innerHeight * 0.88) {
          var dir = el.getAttribute('data-reveal');
          el.style.opacity = '0';
          el.style.transform = dir === 'left' ? 'translateX(-36px)' : dir === 'right' ? 'translateX(36px)' : 'translateY(34px)';
          el.style.transition = 'opacity 1s cubic-bezier(.2,.7,.2,1), transform 1s cubic-bezier(.2,.7,.2,1)';
          el.style.transitionDelay = (el.getAttribute('data-delay') || '0') + 'ms';
          io.observe(el);
        }
      });
    }

    /* ---- active section tracking ---- */
    var navLinks = document.querySelectorAll('[data-section]');
    function setActive(id) {
      Array.prototype.forEach.call(navLinks, function (a) {
        var on = a.getAttribute('data-section') === id;
        a.style.color = on ? '#E8C97A' : 'rgba(237,230,214,.78)';
        a.style.backgroundSize = on ? '100% 1px' : '0% 1px';
      });
    }
    var secIo = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) setActive(entries[i].target.id);
      }
    }, { rootMargin: '-40% 0px -55% 0px' });
    ['top', 'about', 'sessions', 'process', 'results', 'contact'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) secIo.observe(el);
    });

    /* ---- parallax (rAF-throttled) ---- */
    var ticking = false;
    var plxEls = Array.prototype.slice.call(document.querySelectorAll('[data-plx]'));
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        for (var i = 0; i < plxEls.length; i++) {
          var el = plxEls[i];
          var r = el.parentElement.getBoundingClientRect();
          var off = (r.top + window.scrollY - y) * -1;
          el.style.translate = '0 ' + (off * parseFloat(el.getAttribute('data-plx'))).toFixed(1) + 'px';
        }
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ---- lightbox ---- */
    var lightbox = document.getElementById('lightbox');
    var lbImg = document.getElementById('lightboxImg');
    var lbTag = document.getElementById('lightboxTag');
    var galleryRow = document.getElementById('galleryRow');
    var lbIndex = null;

    function paint() {
      var g = GALLERY[lbIndex];
      lbImg.src = g.src;
      lbImg.alt = g.alt;
      lbTag.textContent = g.tag;
    }
    function openLb(i) {
      lbIndex = i;
      paint();
      lightbox.style.display = 'flex';
      if (galleryRow) galleryRow.style.animationPlayState = 'paused';
    }
    function closeLb() {
      lbIndex = null;
      lightbox.style.display = 'none';
      if (galleryRow) galleryRow.style.animationPlayState = '';
    }
    function stepLb(d) {
      if (lbIndex === null) return;
      var n = GALLERY.length;
      lbIndex = (lbIndex + d + n) % n;
      paint();
    }

    Array.prototype.forEach.call(document.querySelectorAll('[data-gallery-index]'), function (f) {
      f.addEventListener('click', function () { openLb(parseInt(f.getAttribute('data-gallery-index'), 10)); });
    });
    var aboutImg = document.querySelector('[data-lightbox-about]');
    if (aboutImg) aboutImg.addEventListener('click', function () { openLb(0); });

    lightbox.addEventListener('click', closeLb);
    var closeBtn = document.querySelector('[data-lb-close]');
    if (closeBtn) closeBtn.addEventListener('click', function (e) { e.stopPropagation(); closeLb(); });
    var prevBtn = document.querySelector('[data-lb-prev]');
    if (prevBtn) prevBtn.addEventListener('click', function (e) { e.stopPropagation(); stepLb(-1); });
    var nextBtn = document.querySelector('[data-lb-next]');
    if (nextBtn) nextBtn.addEventListener('click', function (e) { e.stopPropagation(); stepLb(1); });
    var lbFig = document.querySelector('[data-lb-stop]');
    if (lbFig) lbFig.addEventListener('click', function (e) { e.stopPropagation(); });

    window.addEventListener('keydown', function (e) {
      if (lbIndex === null) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowRight') stepLb(1);
      if (e.key === 'ArrowLeft') stepLb(-1);
    });
  });
})();
