/**
 * Меню кабінету — спільна навігація для сторінок profile-*
 */
window.OLLKOM_PROFILE_MENU = [
  {
    id: "main",
    href: "profile-main.html",
    label: "Головна",
    icon: '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  },
  {
    id: "credit",
    href: "profile-credit.html",
    label: "Кредитування",
    icon: '<rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>',
  },
  {
    id: "omega",
    href: "profile-omega.html",
    label: "OmegaTV",
    icon: '<rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/>',
  },
  {
    id: "payment",
    href: "profile-payment.html",
    label: "Онлайн платежі",
    icon: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  },
  {
    id: "payments",
    href: "profile-payment-history.html",
    label: "Оплати",
    icon: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>',
  },
  {
    id: "speedtest",
    href: "speed-test-page.html",
    label: "Тест швидкості",
    icon: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>',
  },
  {
    id: "help",
    href: "profile-help.html",
    label: "Допомога",
    icon: '<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>',
  },
];

(function () {
  "use strict";

  function currentPage() {
    const path = window.location.pathname.split("/").pop();
    return path || "profile-main.html";
  }

  function renderSidebar(activePage) {
    const el = document.getElementById("profileSidebar");
    if (!el) return;

    const page = activePage || currentPage();
    const items = window.OLLKOM_PROFILE_MENU.map((item) => {
      const active = item.href === page ? " is-active" : "";
      return (
        '<li><a href="' +
        item.href +
        '" class="' +
        active.trim() +
        '">' +
        '<svg class="profile-menu__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
        item.icon +
        "</svg>" +
        item.label +
        "</a></li>"
      );
    });

    el.innerHTML =
      '<p class="profile-sidebar__title">Кабінет абонента</p>' +
      '<ul class="profile-menu">' +
      items.join("") +
      "</ul>" +
      '<div class="profile-sidebar__logout">' +
      '<a href="profile-login.html?logout=1" class="btn btn--ghost btn--block" data-logout>Вийти</a>' +
      "</div>";
  }

  function init() {
    renderSidebar(document.body.dataset.profilePage || currentPage());
  }

  window.OLLKOM_renderProfileSidebar = renderSidebar;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
