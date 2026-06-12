/* =============================================================================
   The Power of a Story - interactions (plain vanilla JS, no libraries)

   Features:
   - Adds an "is the page scrolled" state to the nav
   - Fills the thin scroll-progress ("charge") bar at the top
   - Mobile hamburger menu (accessible: aria-expanded, Escape, click-away)
   - Highlights the active section link while scrolling (IntersectionObserver)
   - Reveals sections as they enter the viewport
   - Counts the big stats up from 0 (15B and ~1%)
   - Stamps the current year in the footer

   Everything is wrapped and feature-detected so the console stays error-free.
   ============================================================================ */
(function () {
  "use strict";

  // Signals to the CSS that JS is on, so reveal elements may start hidden.
  document.documentElement.classList.add("js");

  // Honour users who prefer less motion.
  var prefersReducedMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Run after the DOM is parsed.
  document.addEventListener("DOMContentLoaded", function () {

    /* ---------- Footer year ---------- */
    var yearEl = document.getElementById("year");
    if (yearEl) { yearEl.textContent = "· " + new Date().getFullYear(); }

    /* ---------- Nav: scrolled state + scroll progress bar ---------- */
    var nav = document.getElementById("nav");
    var progress = document.getElementById("scrollProgress");

    function onScroll() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (nav) { nav.classList.toggle("is-scrolled", scrollTop > 8); }

      if (progress) {
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progress.style.width = Math.min(100, Math.max(0, pct)) + "%";
      }
    }
    // passive listener keeps scrolling smooth
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ---------- Mobile menu ---------- */
    var toggle = document.getElementById("navToggle");
    var menu = document.getElementById("navMenu");

    function closeMenu() {
      if (!menu || !toggle) { return; }
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    }
    function openMenu() {
      if (!menu || !toggle) { return; }
      menu.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
    }

    if (toggle && menu) {
      toggle.addEventListener("click", function () {
        if (menu.classList.contains("is-open")) { closeMenu(); } else { openMenu(); }
      });

      // Close the menu after picking a destination.
      menu.addEventListener("click", function (e) {
        if (e.target.closest(".nav__link")) { closeMenu(); }
      });

      // Escape closes it and returns focus to the button.
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && menu.classList.contains("is-open")) {
          closeMenu();
          toggle.focus();
        }
      });

      // Click outside closes it.
      document.addEventListener("click", function (e) {
        if (!menu.classList.contains("is-open")) { return; }
        if (!e.target.closest(".nav__inner")) { closeMenu(); }
      });
    }

    /* ---------- Scroll reveal + active-link highlighting ---------- */
    var revealEls = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
    var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
    var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));
    var currentIndex = 0; // index of the section currently in view (used by arrow-key nav)

    function showAll() {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    }

    if ("IntersectionObserver" in window) {
      // Reveal each element once, then count any stats inside it.
      var revealObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            startCountIfPresent(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });

      revealEls.forEach(function (el) { revealObserver.observe(el); });

      // Highlight the nav link for whichever section is in view.
      var sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { setActiveLink(entry.target.id); }
        });
      }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

      sections.forEach(function (s) { sectionObserver.observe(s); });
    } else {
      // No IntersectionObserver: just show everything (graceful fallback).
      showAll();
    }

    function setActiveLink(id) {
      navLinks.forEach(function (link) {
        link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
      });
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].id === id) { currentIndex = i; break; }
      }
    }

    /* ---------- Keyboard navigation for live presenting ----------
       Left/Right arrows jump to the previous/next section. We intentionally leave
       Up/Down, Space, PageUp/PageDown, and the mouse wheel alone, so normal
       scrolling and text selection (Shift+Arrow) keep working. */
    function goToSection(index) {
      var clamped = Math.max(0, Math.min(sections.length - 1, index));
      var target = sections[clamped];
      if (!target) { return; }
      currentIndex = clamped;
      // Land the section's top exactly under the fixed nav (one offset, no bleed
      // from the previous section). Measure the nav each time in case it resized.
      var navH = nav ? nav.getBoundingClientRect().height : 0;
      var y = target.getBoundingClientRect().top + window.pageYOffset - navH;
      window.scrollTo({
        top: Math.max(0, Math.round(y)),
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
      // Move focus to the heading so screen readers announce the new section,
      // without scrolling the page a second time.
      var focusTarget = target.querySelector("h1, h2") || target;
      if (focusTarget && focusTarget.focus) {
        if (!focusTarget.hasAttribute("tabindex")) { focusTarget.setAttribute("tabindex", "-1"); }
        try { focusTarget.focus({ preventScroll: true }); } catch (err) { /* older browsers */ }
      }
    }

    /* One-time, unobtrusive hint (keyboard/mouse devices only). */
    var hint = null;
    function hideHint() { if (hint) { hint.classList.add("is-hidden"); } }

    if (window.matchMedia && window.matchMedia("(pointer: fine)").matches) {
      hint = document.createElement("div");
      hint.className = "kbd-hint";
      hint.setAttribute("role", "status");
      hint.innerHTML = "Use <kbd>&larr;</kbd> <kbd>&rarr;</kbd> to move between sections";
      document.body.appendChild(hint);
      requestAnimationFrame(function () { hint.classList.add("is-visible"); });
      setTimeout(hideHint, 6000);
      hint.addEventListener("transitionend", function () {
        if (hint && hint.classList.contains("is-hidden") && hint.parentNode) {
          hint.parentNode.removeChild(hint);
        }
      });
    }

    document.addEventListener("keydown", function (e) {
      // Ignore when a modifier is held (OS/browser shortcuts, Shift+Arrow selection).
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) { return; }
      // Ignore when the user is typing in a field or editable area.
      var el = document.activeElement;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) { return; }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        goToSection(currentIndex + 1);
        hideHint();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToSection(currentIndex - 1);
        hideHint();
      }
    });

    /* ---------- Animated count-ups (15B, ~1%) ---------- */
    function startCountIfPresent(scope) {
      var nums = scope.matches && scope.matches(".stat")
        ? scope.querySelectorAll(".stat__num")
        : scope.querySelectorAll ? scope.querySelectorAll(".stat__num") : [];
      Array.prototype.forEach.call(nums, animateCount);
    }

    function animateCount(el) {
      if (!el || el.dataset.counted === "true") { return; }
      el.dataset.counted = "true";

      var target = parseFloat(el.getAttribute("data-count-to"));
      if (isNaN(target)) { return; }
      var prefix = el.getAttribute("data-prefix") || "";
      var suffix = el.getAttribute("data-suffix") || "";

      // Reduced motion: skip the animation, keep the final value.
      if (prefersReducedMotion) {
        el.textContent = prefix + target + suffix;
        return;
      }

      var duration = 1600;
      var start = null;

      function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

      function tick(now) {
        if (start === null) { start = now; }
        var progressT = Math.min((now - start) / duration, 1);
        var value = Math.round(easeOutCubic(progressT) * target);
        el.textContent = prefix + value + suffix;
        if (progressT < 1) { requestAnimationFrame(tick); }
      }
      el.textContent = prefix + "0" + suffix;
      requestAnimationFrame(tick);
    }
  });
})();
