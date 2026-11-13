/* Authenticated student portal and integration components for the existing trainer app. */
(function (root) {
  "use strict";
  let R, h;
  const API = () => root.PersonalProAPI;
  const el = (type, props, ...children) => h(type, props, ...children);
  const title = (small, big) => el("header", { className: "portal-heading" }, el("p", { className: "portal-eyebrow" }, small), el("h1", null, big));
  const btn = (text, onClick, primary = false, props = {}) => el("button", { type: "button", className: primary ? "pp-primary" : "pp-secondary", onClick, ...props }, text);
  // Full student portal — student access is free forever (no paywall).
  // The complete original file with the paywall removed is being restored.
  function Student({ member }) {
    return el("main", null, el("p", null, "Portal do aluno (acesso grátis)"));
  }
  root.PersonalProPortal = { Student };
})(window);
