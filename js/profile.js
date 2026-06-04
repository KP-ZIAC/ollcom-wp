/**
 * Кабінет — авторизація (демо), форми, діалоги
 */
(function () {
  "use strict";

  const AUTH_KEY = "ollkom_auth";

  /** Тимчасово для демо клієнту — замінити на серверну перевірку */
  const DEMO_CREDENTIALS = {
    login: "admin",
    password: "admin",
  };

  const PROTECTED_PREFIX = "profile-";
  const LOGIN_PAGE = "profile-login.html";

  function isAuthenticated() {
    return sessionStorage.getItem(AUTH_KEY) === "1";
  }

  function setAuthenticated(ok) {
    if (ok) sessionStorage.setItem(AUTH_KEY, "1");
    else sessionStorage.removeItem(AUTH_KEY);
  }

  function currentPage() {
    return window.location.pathname.split("/").pop() || "";
  }

  function isProtectedPage(page) {
    return page.startsWith(PROTECTED_PREFIX) && page !== LOGIN_PAGE;
  }

  function initAuthGuard() {
    const page = currentPage();

    if (page === LOGIN_PAGE) {
      if (isAuthenticated() && !new URLSearchParams(location.search).has("logout")) {
        window.location.replace("profile-main.html");
      }
      return;
    }

    if (isProtectedPage(page) && !isAuthenticated()) {
      const back = encodeURIComponent(page);
      window.location.replace(LOGIN_PAGE + (back ? "?return=" + back : ""));
    }
  }

  function showLoginError(form, message) {
    const el = form.querySelector(".login-error");
    if (!el) return;
    el.textContent = message;
    el.hidden = false;
    form.classList.add("login-form--error");
  }

  function clearLoginError(form) {
    const el = form.querySelector(".login-error");
    if (el) el.hidden = true;
    form.classList.remove("login-form--error");
    form.querySelectorAll(".form-input").forEach((input) => {
      input.removeAttribute("aria-invalid");
    });
  }

  function validateCredentials(login, password) {
    return (
      login === DEMO_CREDENTIALS.login && password === DEMO_CREDENTIALS.password
    );
  }

  function initLogin() {
    const form = document.querySelector(".login-form");
    if (!form) return;

    const params = new URLSearchParams(location.search);
    if (params.has("logout")) {
      setAuthenticated(false);
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const loginInput = form.querySelector('[name="ulogin"]');
      const passInput = form.querySelector('[name="upassword"]');
      const loginVal = loginInput?.value.trim() || "";
      const passVal = passInput?.value || "";

      clearLoginError(form);

      if (!loginVal || !passVal) {
        showLoginError(form, "Заповніть логін і пароль.");
        if (!loginVal) loginInput?.focus();
        else passInput?.focus();
        loginInput?.setAttribute("aria-invalid", "true");
        passInput?.setAttribute("aria-invalid", "true");
        return;
      }

      if (!validateCredentials(loginVal, passVal)) {
        showLoginError(form, "Невірний логін або пароль. Перевірте дані та спробуйте знову.");
        passInput.value = "";
        passInput.setAttribute("aria-invalid", "true");
        loginInput?.setAttribute("aria-invalid", "true");
        passInput.focus();
        return;
      }

      setAuthenticated(true);

      const returnPage = params.get("return");
      const target =
        returnPage && returnPage.startsWith(PROTECTED_PREFIX) && returnPage.endsWith(".html")
          ? returnPage
          : "profile-main.html";

      window.location.href = target;
    });
  }

  function initLogout() {
    document.querySelectorAll("[data-logout]").forEach((el) => {
      el.addEventListener("click", () => setAuthenticated(false));
    });
  }

  function initCredit() {
    const form = document.querySelector(".credit-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      const agree = form.querySelector('[name="agree"]');
      if (!agree?.checked) {
        e.preventDefault();
        alert("Підтвердіть згоду з умовами кредитування.");
      }
    });
  }

  function initOmegaSubscribe() {
    document.querySelectorAll("[data-subscribe-dialog]").forEach((btn) => {
      const dialogId = btn.getAttribute("aria-controls");
      const dialog = dialogId ? document.getElementById(dialogId) : null;
      if (!dialog) return;

      btn.addEventListener("click", () => {
        if (typeof dialog.showModal === "function") dialog.showModal();
      });

      dialog.querySelectorAll("[data-dialog-close]").forEach((closeBtn) => {
        closeBtn.addEventListener("click", () => dialog.close());
      });
    });
  }

  function initHelpForm() {
    const form = document.querySelector(".help-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      const text = form.querySelector('[name="newticket"]');
      if (!text?.value.trim()) {
        e.preventDefault();
        text?.focus();
      }
    });
  }

  function init() {
    initAuthGuard();
    initLogin();
    initLogout();
    initCredit();
    initOmegaSubscribe();
    initHelpForm();
  }

  window.OLLKOM_AUTH = {
    isAuthenticated,
    logout: () => setAuthenticated(false),
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
