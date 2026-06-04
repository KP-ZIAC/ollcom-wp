/**
 * ОЛЛ-КОМ — спільна поведінка (навігація, скрол, модал, reveal)
 */
(function () {
  "use strict";

  function initNav() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".site-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initScrollTop() {
    const btn = document.querySelector(".scroll-top");
    if (!btn) return;

    window.addEventListener(
      "scroll",
      () => {
        btn.classList.toggle("is-visible", window.scrollY > 400);
      },
      { passive: true }
    );

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!els.length || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    els.forEach((el) => obs.observe(el));
  }

  function initModal() {
    const overlay = document.getElementById("channelModal");
    if (!overlay) return;

    const title = overlay.querySelector(".modal__title");
    const body = overlay.querySelector(".modal__body");
    const closeBtns = overlay.querySelectorAll("[data-modal-close]");

    function open(name, channels) {
      if (title) title.textContent = name || "Пакет ТБ";
      if (body) {
        body.innerHTML =
          channels != null
            ? '<p class="modal__channels-count"><strong>' +
              channels +
              "</strong> телеканалів у пакеті.</p><p>Детальний перелік каналів — на сторінці <a href=\"omegatv.html\">OmegaTV</a>.</p>"
            : "<p>Інформація про канали недоступна.</p>";
      }
      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function close() {
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    document.querySelectorAll("[data-channel-modal]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        open(btn.dataset.channelName, btn.dataset.channelCount);
      });
    });

    closeBtns.forEach((btn) => btn.addEventListener("click", close));
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) close();
    });

    window.OLLKOM_openChannelModal = open;
  }

  function highlightNav() {
    const page = window.location.pathname.split("/").pop() || "main-page.html";
    const isProfile = page.startsWith("profile-");
    document.querySelectorAll(".site-nav a[href]").forEach((a) => {
      const href = a.getAttribute("href") || "";
      if (href.startsWith("#") || href.startsWith("http")) return;
      if (href === page || href.endsWith("/" + page)) {
        a.classList.add("is-active");
      }
      if (isProfile && (href.includes("profile-login") || href.includes("profile-main"))) {
        if (a.classList.contains("nav-login") && page === "profile-login.html") {
          a.classList.add("is-active");
        }
        if (a.textContent.trim() === "Кабінет" && page !== "profile-login.html") {
          a.classList.add("is-active");
        }
      }
    });
  }

  function init() {
    initNav();
    initScrollTop();
    initReveal();
    initModal();
    highlightNav();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
