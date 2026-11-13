/* Authenticated student portal and integration components for the existing trainer app. */
(function (root) {
  "use strict";
  let R, h;
  const API = () => root.PersonalProAPI;
  const el = (type, props, ...children) => h(type, props, ...children);
  const title = (small, big) =>
    el(
      "header",
      { className: "portal-heading" },
      el("p", { className: "portal-eyebrow" }, small),
      el("h1", null, big),
    );
  const btn = (text, onClick, primary = false, props = {}) =>
    el(
      "button",
      {
        type: "button",
        className: primary ? "pp-primary" : "pp-secondary",
        onClick,
        ...props,
      },
      text,
    );
  const field = (text, value, set, type = "text", props = {}) =>
    el(
      "label",
      { className: "pp-field" },
      text,
      el("input", {
        type,
        value,
        "aria-label": text,
        onChange: (e) => set(e.target.value),
        ...props,
      }),
    );
  const empty = (text) =>
    el(
      "div",
      { className: "portal-empty" },
      el("span", { "aria-hidden": true }, "↗"),
      el("p", null, text),
    );
  const date = (value) =>
    new Date(value).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  function useAction() {
    const [busy, setBusy] = R.useState(false),
      [message, setMessage] = R.useState("");
    return {
      busy,
      message,
      setMessage,
      run: async (fn) => {
        setBusy(true);
        setMessage("");
        try {
          return await fn();
        } catch (e) {
          setMessage(e.message);
          return null;
        } finally {
          setBusy(false);
        }
      },
    };
  }
  function Notice({ action }) {
    return action.message
      ? el("p", { role: "status", className: "portal-notice" }, action.message)
      : null;
  }
  // ... (truncated in this call for brevity — full content will be sent next if needed)
  root.PersonalProPortal = { Shell, TrainerTools, Billing, Evolution, Spark, Student };
})(window);
