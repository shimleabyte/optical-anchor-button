(function () {
  "use strict";

  var host = document.getElementById("optical-button-host");
  var stateReadout = document.getElementById("readout-state");
  var countReadout = document.getElementById("readout-count");
  var explanation = document.getElementById("state-explanation");
  var options = Array.from(document.querySelectorAll("[data-state]"));
  var activations = 0;
  var previewState = "default";
  var isPointerHovering = false;

  var descriptions = {
    default: "The eye starts asleep. Hover the button to wake it; it follows the pointer across the page, grows tired after a pause, then sleeps.",
    hover: "The eyelid opens, the brow rises, and the collab bubble appears as a visual-only expression.",
    tired: "The upper lid rests halfway down while the iris stays round and visible.",
    pressed: "The enamel face presses by one pixel. No bounce, ripple, or exaggerated scale.",
    focus: "A clear external focus ring marks keyboard navigation independently of the eye expression.",
    disabled: "The housing is muted, the eye sleeps, and pointer-driven movement is disabled.",
    loading: "The eye opens into a focused calibration sweep while a segmented register marks progress; activation remains blocked."
  };

  var control = globalThis.OpticalAnchorButton.create({
    ariaLabel: "Optical Anchor eye button",
    describedBy: "button-hint",
    onClick: function () {
      activations += 1;
      countReadout.textContent = String(activations).padStart(2, "0");
    }
  });
  host.appendChild(control.element);

  control.element.addEventListener("pointerenter", function (event) {
    if (event.pointerType !== "touch" && previewState !== "disabled" && previewState !== "loading") isPointerHovering = true;
    renderReadout();
  });
  control.element.addEventListener("pointerleave", function (event) {
    if (event.pointerType !== "touch") isPointerHovering = false;
    renderReadout();
  });

  function renderReadout() {
    stateReadout.textContent = (isPointerHovering && previewState !== "disabled" && previewState !== "loading" ? "HOVER" : previewState).toUpperCase();
  }

  function setPreviewState(next) {
    previewState = next;
    control.element.classList.remove("demo-force-hover", "demo-force-tired", "demo-force-pressed", "demo-force-focus", "oa-button--loading");
    control.element.disabled = next === "disabled" || next === "loading";
    if (next === "loading") {
      control.element.classList.add("oa-button--loading");
      control.element.setAttribute("aria-busy", "true");
    } else control.element.removeAttribute("aria-busy");
    if (next === "hover") control.element.classList.add("demo-force-hover");
    if (next === "tired") control.element.classList.add("demo-force-tired");
    if (next === "pressed") control.element.classList.add("demo-force-pressed");
    if (next === "focus") control.element.classList.add("demo-force-focus");
    control.controller.setBlocked(control.element.disabled);
    options.forEach(function (option) {
      var active = option.dataset.state === next;
      option.classList.toggle("state-option--active", active);
      option.setAttribute("aria-pressed", String(active));
    });
    explanation.textContent = descriptions[next];
    renderReadout();
  }

  options.forEach(function (option) {
    option.addEventListener("click", function () { setPreviewState(option.dataset.state); });
  });

  document.getElementById("reset-study").addEventListener("click", function () {
    activations = 0;
    countReadout.textContent = "00";
    setPreviewState("default");
  });

  renderReadout();
  globalThis.addEventListener("pagehide", function () { control.destroy(); }, { once: true });
})();
