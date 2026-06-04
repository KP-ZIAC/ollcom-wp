/**
 * ОЛЛ-КОМ Speed Test UI — LibreSpeed integration
 */
(function () {
  "use strict";

  const PHASES = [
    { id: "idle", label: "Готовність", progress: 0 },
    { id: "latency", label: "Затримка", progress: 25 },
    { id: "download", label: "Завантаження", progress: 50 },
    { id: "upload", label: "Відвантаження", progress: 75 },
    { id: "done", label: "Результат", progress: 100 },
  ];

  const STATUS = {
    idle: "Натисніть кнопку, щоб почати вимірювання швидкості інтернету",
    latency: "Вимірюємо ping та jitter…",
    download: "Тестуємо швидкість завантаження…",
    upload: "Тестуємо швидкість відвантаження…",
    done: "Тест завершено. Можете запустити повторно",
    aborted: "Тест перервано. Готові до нового вимірювання",
  };

  const METRIC_KEYS = {
    dlText: "download",
    ulText: "upload",
    pingText: "ping",
    jitText: "jitter",
  };

  let speedtest = null;
  let currentPhase = "idle";
  let prevValues = {};

  function $(id) {
    return document.getElementById(id);
  }

  function setText(id, value) {
    const el = $(id);
    if (!el) return;
    const str = value == null || value === "" ? "" : String(value);
    if (prevValues[id] !== str) {
      el.textContent = str;
      el.classList.add("is-updating");
      el.addEventListener(
        "animationend",
        () => el.classList.remove("is-updating"),
        { once: true }
      );
      prevValues[id] = str;
    }
  }

  function formatMetric(id, raw, data) {
    if (raw === "" || raw == null) return "";
    if (id === "dlText" && data.testState === 1 && raw === 0) return "...";
    if (id === "ulText" && data.testState === 3 && raw === 0) return "...";
    return raw;
  }

  function resolvePhase(data) {
    const state = data.testState;
    if (state === 0) return currentPhase === "done" ? "done" : "idle";
    if (state === 1) return "download";
    if (state === 2) return "latency";
    if (state === 3) return "upload";
    if (state >= 4) return "done";
    return "idle";
  }

  function setPhase(phaseId) {
    if (currentPhase === phaseId) return;
    currentPhase = phaseId;

    const phaseIndex = PHASES.findIndex((p) => p.id === phaseId);
    const progress = PHASES[phaseIndex]?.progress ?? 0;

    const progressBar = $("stepsProgress");
    if (progressBar) progressBar.style.width = progress + "%";

    document.querySelectorAll(".step").forEach((step, i) => {
      step.classList.remove("is-active", "is-done");
      if (i < phaseIndex) step.classList.add("is-done");
      else if (i === phaseIndex) step.classList.add("is-active");
    });

    document.querySelectorAll(".metric-card").forEach((card) => {
      card.classList.remove("is-active");
    });
    const activeMetric = {
      download: "download",
      upload: "upload",
      latency: "ping",
    }[phaseId];
    if (activeMetric) {
      const card = document.querySelector(
        '.metric-card[data-metric="' + activeMetric + '"]'
      );
      if (card) card.classList.add("is-active");
    }

    const statusEl = $("statusText");
    if (statusEl) {
      statusEl.textContent = STATUS[phaseId] || STATUS.idle;
      statusEl.classList.toggle("is-running", phaseId !== "idle" && phaseId !== "done");
    }
  }

  function initUI() {
    ["dlText", "ulText", "pingText", "jitText"].forEach((id) => setText(id, ""));
    setText("ip", "");
    prevValues = {};
    setPhase("idle");
    updateButton(false);
  }

  function updateButton(running) {
    const btn = $("startStopBtn");
    if (!btn) return;
    btn.classList.toggle("is-running", running);
    btn.disabled = false;

    const label = $("btnLabel");
    const playIcon = $("iconPlay");
    const stopIcon = $("iconStop");
    if (label) label.textContent = running ? "Зупинити тест" : "Почати тест";
    if (playIcon) playIcon.hidden = running;
    if (stopIcon) stopIcon.hidden = !running;
  }

  function onUpdate(data) {
    setText("ip", data.clientIp || "");

    Object.keys(METRIC_KEYS).forEach((id) => {
      const key = id.replace("Text", "");
      const camel =
        key === "dl"
          ? "dlStatus"
          : key === "ul"
            ? "ulStatus"
            : key === "ping"
              ? "pingStatus"
              : "jitterStatus";
      setText(id, formatMetric(id, data[camel], data));
    });

    setPhase(resolvePhase(data));
  }

  function onEnd(aborted) {
    updateButton(false);
    if (aborted) {
      initUI();
      const statusEl = $("statusText");
      if (statusEl) statusEl.textContent = STATUS.aborted;
    } else {
      setPhase("done");
    }
  }

  function startStop() {
    if (!speedtest) return;
    if (speedtest.getState() === 3) {
      speedtest.abort();
      return;
    }
    initUI();
    speedtest.start();
    updateButton(true);
    setPhase("latency");
  }

  function init() {
    if (typeof Speedtest === "undefined") {
      const statusEl = $("statusText");
      if (statusEl) {
        statusEl.textContent =
          "Помилка: не завантажено speedtest.js. Перевірте шлях до файлу.";
      }
      return;
    }

    speedtest = new Speedtest();
    speedtest.setParameter("telemetry_level", "full");
    speedtest.onupdate = onUpdate;
    speedtest.onend = onEnd;

    const btn = $("startStopBtn");
    if (btn) btn.addEventListener("click", startStop);

    initUI();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
