/**
 * Головна сторінка — карусель, тарифи, форма
 */
(function () {
  "use strict";

  const data = window.OLLKOM_TARIFFS;
  if (!data) return;

  /* —— Hero —— */
  function renderHeroSlide(s, i) {
    const cta = s.cta
      ? '<a class="btn hero__cta" href="' +
        s.cta.href +
        '">' +
        s.cta.label +
        "</a>"
      : "";
    const badge = s.badge
      ? '<span class="hero__badge">' + s.badge + "</span>"
      : "";
    return (
      '<div class="hero__slide' +
      (i === 0 ? " is-active" : "") +
      '">' +
      '<div class="hero__media">' +
      '<img src="' +
      s.src +
      '" alt="' +
      (s.alt || "") +
      '" width="1200" height="420" decoding="async">' +
      "</div>" +
      '<div class="hero__caption">' +
      '<div class="hero__caption-inner">' +
      badge +
      '<h2 class="hero__title">' +
      (s.title || "") +
      "</h2>" +
      '<p class="hero__text">' +
      (s.text || "") +
      "</p>" +
      cta +
      "</div></div></div>"
    );
  }

  function initHero() {
    const track = document.querySelector(".hero__track");
    const dotsWrap = document.querySelector(".hero__dots");
    if (!track) return;

    let slideEls = track.querySelectorAll(".hero__slide");
    if (!slideEls.length && data.heroSlides?.length) {
      track.innerHTML = data.heroSlides.map(renderHeroSlide).join("");
      slideEls = track.querySelectorAll(".hero__slide");
    }

    const count = slideEls.length;
    if (!count) return;

    let index = 0;
    let timer;

    if (dotsWrap && !dotsWrap.children.length) {
      dotsWrap.innerHTML = Array.from({ length: count }, (_, i) =>
        '<button type="button" class="hero__dot' +
        (i === 0 ? " is-active" : "") +
        '" aria-label="Слайд ' +
        (i + 1) +
        '"></button>'
      ).join("");
    }

    const dots = dotsWrap ? dotsWrap.querySelectorAll(".hero__dot") : [];

    const progressFill = document.querySelector(".hero__progress-fill");

    function goTo(i) {
      index = (i + count) % count;
      track.style.transform = "translateX(-" + index * 100 + "%)";
      slideEls.forEach((slide, j) => slide.classList.toggle("is-active", j === index));
      dots.forEach((d, j) => d.classList.toggle("is-active", j === index));
      if (progressFill) {
        progressFill.style.transform = "translateX(" + index * 100 + "%)";
      }
    }

    function next() {
      goTo(index + 1);
    }

    goTo(0);

    document.querySelector(".hero__arrow--prev")?.addEventListener("click", () =>
      goTo(index - 1)
    );
    document.querySelector(".hero__arrow--next")?.addEventListener("click", next);
    dots.forEach((d, i) => d.addEventListener("click", () => goTo(i)));

    timer = setInterval(next, 6000);
    track.closest(".hero")?.addEventListener("mouseenter", () => clearInterval(timer));
    track.closest(".hero")?.addEventListener("mouseleave", () => {
      timer = setInterval(next, 6000);
    });
  }

  /* —— Internet tariffs —— */
  function renderPlanCard(plan) {
    const feat = plan.featured ? " plan-card--featured" : "";
    const tag = plan.featured
      ? '<span class="plan-card__tag">Популярний</span>'
      : "";
    const perks = (plan.perks || ["Безлімітний трафік", "Техпідтримка 24/7"])
      .map((p) => "<li>" + p + "</li>")
      .join("");
    const note = plan.note
      ? '<li><em>' + plan.note + "</em></li>"
      : "";
    return (
      '<article class="card plan-card' +
      feat +
      '">' +
      '<div class="plan-card__top">' +
      tag +
      '<h3 class="plan-card__name">' +
      plan.name +
      "</h3></div>" +
      '<div class="plan-card__speed">' +
      '<span class="plan-card__num">' +
      plan.speed +
      '</span><span class="plan-card__unit">Мбіт/с</span></div>' +
      '<div class="plan-card__price">' +
      plan.price +
      " <small>грн/міс</small></div>" +
      '<ul class="plan-card__perks">' +
      perks +
      note +
      "</ul>" +
      '<a class="btn btn--block" href="#zayavka">Підключити</a>' +
      "</article>"
    );
  }

  function initInternetTariffs() {
    const tabsWrap = document.getElementById("inetTabs");
    const grid = document.getElementById("inetPlans");
    if (!tabsWrap || !grid || !data.internet) return;

    const keys = Object.keys(data.internet);
    let active = keys[0];

    tabsWrap.innerHTML = keys
      .map((key) => {
        const cat = data.internet[key];
        return (
          '<button type="button" class="tariff-tab' +
          (key === active ? " is-active" : "") +
          '" data-tab="' +
          key +
          '">' +
          cat.label +
          (cat.hint ? "<small>" + cat.hint + "</small>" : "") +
          "</button>"
        );
      })
      .join("");

    function render(key) {
      const plans = data.internet[key].plans;
      grid.innerHTML = plans.map(renderPlanCard).join("");
      grid.style.opacity = "0";
      grid.style.transform = "translateY(8px)";
      requestAnimationFrame(() => {
        grid.style.transition = "opacity 0.4s ease, transform 0.4s ease";
        grid.style.opacity = "1";
        grid.style.transform = "translateY(0)";
      });
    }

    render(active);

    tabsWrap.addEventListener("click", (e) => {
      const btn = e.target.closest(".tariff-tab");
      if (!btn) return;
      active = btn.dataset.tab;
      tabsWrap.querySelectorAll(".tariff-tab").forEach((b) =>
        b.classList.toggle("is-active", b === btn)
      );
      render(active);
    });
  }

  /* —— TV —— */
  function initTv() {
    const grid = document.getElementById("tvPlans");
    if (!grid || !data.tv) return;

    grid.innerHTML = data.tv
      .map((p) => {
        const modalBtn = p.hasChannelList
          ? '<button type="button" class="tv-card__link" data-channel-modal data-channel-name="' +
            p.name +
            '" data-channel-count="' +
            p.channels +
            '">Перелік каналів</button>'
          : "";
        return (
          '<article class="card tv-card">' +
          '<h3 class="tv-card__name">' +
          p.name +
          "</h3>" +
          '<p class="tv-card__channels">' +
          p.channels +
          " <span>телеканалів</span></p>" +
          modalBtn +
          '<p class="tv-card__price">' +
          p.price +
          ' <span>грн/міс</span></p>' +
          '<a class="btn btn--block" href="#zayavka">Підключити</a>' +
          "</article>"
        );
      })
      .join("");
  }

  /* —— Phone mask —— */
  function initPhoneMask() {
    const input = document.getElementById("phone");
    if (!input) return;

    input.addEventListener("input", () => {
      let v = input.value.replace(/\D/g, "");
      if (!v.startsWith("38")) v = "38" + v.replace(/^38/, "");
      v = v.slice(0, 12);
      let out = "+38";
      if (v.length > 2) out += "(" + v.slice(2, 5);
      if (v.length >= 5) out += ")" + v.slice(5, 8);
      if (v.length >= 8) out += "-" + v.slice(8, 10);
      if (v.length >= 10) out += "-" + v.slice(10, 12);
      input.value = out;
    });
  }

  /* —— Form —— */
  function showToast(el, msg, ok) {
    if (!el) return;
    el.textContent = msg;
    el.className = "form-toast is-show " + (ok ? "form-toast--ok" : "form-toast--err");
    setTimeout(() => el.classList.remove("is-show"), 5000);
  }

  function initForm() {
    const form = document.getElementById("connectForm");
    const toast = document.getElementById("formToast");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("username")?.value.trim();
      const phone = document.getElementById("phone")?.value.trim();
      const address = document.getElementById("address")?.value.trim();
      const service = document.getElementById("service")?.value;

      if (!name || !phone || phone.length < 10 || !address || !service) {
        showToast(toast, "Заповніть усі поля форми.", false);
        return;
      }

      if (typeof window.send === "function") {
        window.send();
        showToast(toast, "Заявку надіслано. Ми зв'яжемось з вами найближчим часом.", true);
      } else {
        showToast(
          toast,
          "Дякуємо! Заявку збережено локально. Підключіть js/mailer.js для відправки на сервер.",
          true
        );
        console.info("Заявка:", { name, phone, address, service });
      }

      form.reset();
    });
  }

  function init() {
    initHero();
    initInternetTariffs();
    initTv();
    initPhoneMask();
    initForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
