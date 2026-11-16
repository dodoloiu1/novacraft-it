/* NovaCraft IT Services — vanilla JS. Lead-owned: do not edit. */
(function () {
  "use strict";

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

  window.NovaCraft = {
    toggleNav: function () { if (navToggle) navToggle.click(); },
    version: "1.0.0"
  };
})();
