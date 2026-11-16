/* NovaCraft IT Services — vanilla JS. Lead-owned: do not edit. */
(function () {
  "use strict";

  /* Mark that JS is running so CSS only hides .reveal when it can reveal it. */
  document.documentElement.classList.add("js");

  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.getElementById("nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.textContent = open ? "Close" : "Menu";
    });
    navLinks.addEventListener("click", function (event) {
      if (event.target.tagName === "A") {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.textContent = "Menu";
      }
    });

    /* Dismiss on outside click and on Escape. */
    document.addEventListener("click", function (event) {
      if (!navLinks.classList.contains("open")) return;
      if (navLinks.contains(event.target) || navToggle.contains(event.target)) return;
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.textContent = "Menu";
    });

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape" || !navLinks.classList.contains("open")) return;
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.textContent = "Menu";
      navToggle.focus();
    });
  }

  /* Scroll reveal: tag any .reveal element, leave the rest alone. */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* Safety net: never leave a block invisible if the observer never fires
     (background tab, throttled rendering, print). */
  setTimeout(function () {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }, 1200);

  /* Contact form: client-side only. Marks invalid fields, no network call. */
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");

  if (form && status) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var required = Array.prototype.slice.call(
        form.querySelectorAll("[required]")
      );
      var firstBad = null;

      required.forEach(function (field) {
        var ok = field.checkValidity() && field.value.trim() !== "";
        field.setAttribute("aria-invalid", ok ? "false" : "true");
        field.style.borderColor = ok ? "" : "#f87171";
        if (!ok && !firstBad) firstBad = field;
      });

      if (firstBad) {
        status.textContent = "Please complete the highlighted fields.";
        status.style.color = "#f87171";
        firstBad.focus();
        return;
      }

      var name = (form.querySelector("#cf-name") || {}).value || "there";
      status.textContent =
        "Thanks, " + name.trim() + " — your brief is ready. We reply within one business day.";
      status.style.color = "#22d3ee";
      form.reset();
    });
  }

  /* Theme toggle: persisted in localStorage, label and state kept in sync. */
  var themeToggle = document.querySelector(".theme-toggle");

  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  function syncThemeButton() {
    if (!themeToggle) return;
    var light = currentTheme() === "light";
    themeToggle.setAttribute("aria-pressed", light ? "true" : "false");
    themeToggle.setAttribute("aria-label", light ? "Switch to dark mode" : "Switch to light mode");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = currentTheme() === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("novacraft-theme", next); } catch (e) {}
      syncThemeButton();
    });
    syncThemeButton();
  }

  window.NovaCraft = {
    toggleNav: function () { if (navToggle) navToggle.click(); },
    theme: currentTheme,
    version: "1.1.0"
  };
})();
