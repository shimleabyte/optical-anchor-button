(function (global) {
  "use strict";

  var SVG_MARKUP = "<svg class=\"oa-button__eye\" viewBox=\"0 0 160 104\" aria-hidden=\"true\" focusable=\"false\">\n                  <defs>\n                    <linearGradient id=\"oa-sclera\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">\n                      <stop offset=\"0%\" stop-color=\"#fff8ed\" />\n                      <stop offset=\"36%\" stop-color=\"#f7ebdb\" />\n                      <stop offset=\"72%\" stop-color=\"#e9d1b9\" />\n                      <stop offset=\"100%\" stop-color=\"#c59d83\" />\n                    </linearGradient>\n                    <linearGradient id=\"oa-lid\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">\n                      <stop offset=\"0%\" stop-color=\"#f1c7a2\" />\n                      <stop offset=\"48%\" stop-color=\"#a95e43\" />\n                      <stop offset=\"100%\" stop-color=\"#613322\" />\n                    </linearGradient>\n                    <radialGradient id=\"oa-iris\" cx=\"36%\" cy=\"27%\" r=\"78%\">\n                      <stop offset=\"0%\" stop-color=\"#f8d897\" />\n                      <stop offset=\"24%\" stop-color=\"#dca15a\" />\n                      <stop offset=\"52%\" stop-color=\"#a95d30\" />\n                      <stop offset=\"78%\" stop-color=\"#69351f\" />\n                      <stop offset=\"100%\" stop-color=\"#2d1a14\" />\n                    </radialGradient>\n                    <radialGradient id=\"oa-pupil\" cx=\"32%\" cy=\"22%\" r=\"85%\">\n                      <stop offset=\"0%\" stop-color=\"#33251e\" />\n                      <stop offset=\"65%\" stop-color=\"#100e0d\" />\n                      <stop offset=\"100%\" stop-color=\"#050505\" />\n                    </radialGradient>\n                    <linearGradient id=\"oa-glint\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">\n                      <stop offset=\"0%\" stop-color=\"#ffffff\" />\n                      <stop offset=\"100%\" stop-color=\"#fff0d6\" />\n                    </linearGradient>\n                    <clipPath id=\"oa-aperture-clip\"><path d=\"M10 53 C9 50 11 47 15 44 C35 25 57 16 80 16 C106 16 131 26 151 47 C132 73 107 87 81 88 C53 89 28 76 10 53Z\" /></clipPath>\n                    <clipPath id=\"oa-iris-clip\"><circle cx=\"80\" cy=\"52\" r=\"27.5\" /></clipPath>\n                    <filter id=\"oa-soft-shadow\" x=\"-10%\" y=\"-25%\" width=\"120%\" height=\"160%\">\n                      <feDropShadow dx=\"0\" dy=\"2.2\" stdDeviation=\"2.1\" flood-color=\"#351c13\" flood-opacity=\".3\" />\n                    </filter>\n                  </defs>\n                  <path class=\"oa-button__orbital-shadow\" d=\"M8 53 C7 50 10 46 15 42 C35 22 57 13 80 13 C107 13 133 24 155 47 C135 76 109 92 81 93 C52 94 27 79 8 53Z\" />\n                  <path class=\"oa-button__brow oa-button__brow--neutral\" d=\"M27 24 C45 12 63 7 80 8 C100 8 118 14 134 25\" />\n                  <path class=\"oa-button__brow oa-button__brow--excited\" d=\"M25 23 C42 6 61 2 80 2 C102 2 122 8 137 23\" />\n                  <g class=\"oa-button__aperture\">\n                    <path class=\"oa-button__sclera\" d=\"M10 53 C9 50 11 47 15 44 C35 25 57 16 80 16 C106 16 131 26 151 47 C132 73 107 87 81 88 C53 89 28 76 10 53Z\" fill=\"url(#oa-sclera)\" stroke=\"#6d4231\" stroke-width=\"1.25\" filter=\"url(#oa-soft-shadow)\" />\n                    <path d=\"M17 52 C39 32 59 23 80 23 C101 23 121 32 143 52\" fill=\"none\" stroke=\"#fff\" stroke-opacity=\".56\" stroke-width=\"2\" stroke-linecap=\"round\" />\n                    <g class=\"oa-button__iris\" clip-path=\"url(#oa-aperture-clip)\">\n                      <circle cx=\"80\" cy=\"52\" r=\"28.2\" fill=\"#3a2118\" />\n                      <circle cx=\"80\" cy=\"52\" r=\"26.4\" fill=\"url(#oa-iris)\" stroke=\"#5e301c\" stroke-width=\"1.2\" />\n                      <circle cx=\"80\" cy=\"52\" r=\"21.3\" fill=\"none\" stroke=\"#edbd72\" stroke-opacity=\".7\" stroke-width=\"1.1\" />\n                      <g clip-path=\"url(#oa-iris-clip)\" stroke-linecap=\"round\">\n                        <path d=\"M80 26 L82 34 M89 27 L87 35 M98 31 L94 38 M106 38 L99 42 M108 47 L100 49 M109 56 L100 55 M105 65 L98 61 M97 72 L92 65 M87 77 L85 68 M77 78 L78 68 M67 75 L71 66 M58 69 L65 62 M52 60 L62 57 M52 50 L62 51 M56 40 L65 45 M64 31 L70 39\" fill=\"none\" stroke=\"#f4c77c\" stroke-opacity=\".62\" stroke-width=\"1.05\" />\n                        <path d=\"M83 27 L83 35 M94 30 L90 37 M103 38 L97 43 M108 51 L100 52 M102 64 L96 60 M91 74 L88 66 M73 76 L75 67 M61 66 L67 61 M54 54 L62 53 M61 39 L68 44\" fill=\"none\" stroke=\"#4a281a\" stroke-opacity=\".68\" stroke-width=\".9\" />\n                      </g>\n                      <circle cx=\"80\" cy=\"52\" r=\"13.4\" fill=\"#241812\" stroke=\"#c58a50\" stroke-width=\"1.1\" />\n                      <circle cx=\"80\" cy=\"52\" r=\"11.8\" fill=\"url(#oa-pupil)\" />\n                      <ellipse cx=\"72.8\" cy=\"42.4\" rx=\"5.9\" ry=\"3.6\" fill=\"url(#oa-glint)\" opacity=\".96\" transform=\"rotate(-32 72.8 42.4)\" />\n                      <circle cx=\"88.7\" cy=\"61.2\" r=\"2\" fill=\"#f3d9b2\" opacity=\".72\" />\n                      <circle cx=\"72.8\" cy=\"42.4\" r=\"1.5\" fill=\"#fff\" />\n                    </g>\n                    <circle class=\"oa-button__loading-reticle\" cx=\"80\" cy=\"52\" r=\"31\" clip-path=\"url(#oa-aperture-clip)\" fill=\"none\" stroke=\"#f4c77c\" stroke-width=\"1.1\" stroke-dasharray=\"2 5\" opacity=\"0\" />\n                    <path class=\"oa-button__loading-scan\" d=\"M10 53 H151\" clip-path=\"url(#oa-aperture-clip)\" fill=\"none\" />\n                    <path class=\"oa-button__lid-cover oa-button__lid-cover--awake\" d=\"M10 53 C9 50 11 47 15 44 C35 25 57 16 80 16 C106 16 131 26 151 47 C132 38 108 31 80 31 C55 32 34 39 15 44 C11 47 9 50 10 53Z\" fill=\"url(#oa-lid)\" />\n                    <path class=\"oa-button__lid-cover oa-button__lid-cover--tired\" d=\"M10 53 C9 50 11 47 15 44 C35 25 57 16 80 16 C106 16 131 26 151 47 C132 47 105 50 80 49 C55 50 32 47 15 44 C11 47 9 50 10 53Z\" fill=\"url(#oa-lid)\" />\n                    <path class=\"oa-button__lid-cover oa-button__lid-cover--sleeping\" d=\"M10 53 C9 50 11 47 15 44 C35 25 57 16 80 16 C106 16 131 26 151 47 C132 73 107 87 81 88 C53 89 28 76 10 53Z\" fill=\"url(#oa-lid)\" />\n                    <path class=\"oa-button__lid-edge oa-button__lid-edge--awake\" d=\"M9 52 C31 39 54 30 80 30 C106 30 129 39 151 52\" />\n                    <path class=\"oa-button__lid-edge oa-button__lid-edge--tired\" d=\"M9 52 C31 47 55 49 80 48 C105 49 129 47 151 52\" />\n                  </g>\n                  <path class=\"oa-button__lid--upper\" stroke=\"url(#oa-lid)\" d=\"M10 53 C9 50 11 47 15 44 C35 25 57 16 80 16 C106 16 131 26 151 47\" />\n                  <path class=\"oa-button__lid--lower\" d=\"M12 53 C32 76 55 88 81 88 C107 87 132 73 150 49\" />\n                  <path class=\"oa-button__closed-lid\" d=\"M10 53 C35 45 58 42 80 43 C104 42 127 44 150 47\" />\n                  <path class=\"oa-button__lid-highlight\" d=\"M24 38 C44 21 61 18 80 18 C100 18 117 22 136 38\" />\n                  <path class=\"oa-button__tear-duct\" d=\"M15 48 C11 50 12 54 16 56 M145 50 Q149 52 145 54\" />\n                </svg>";
  var instanceCounter = 0;

  function createOpticalButton(options) {
    options = options || {};
    var button = document.createElement("button");
    var id = "oa-vanilla-" + (++instanceCounter);
    var size = ["sm", "md", "lg"].includes(options.size) ? options.size : "md";
    var attributes = options.attributes && typeof options.attributes === "object" ? options.attributes : {};
    var managedAttributes = ["class", "style", "type", "disabled", "aria-label", "aria-describedby", "aria-busy"];
    Object.keys(attributes).forEach(function (name) {
      var value = attributes[name];
      if (managedAttributes.indexOf(name.toLowerCase()) >= 0 || /^on/i.test(name) ||
          value === null || value === undefined || value === false) return;
      button.setAttribute(name, value === true ? "" : String(value));
    });

    button.type = options.type || attributes.type || "button";
    button.className = ["oa-button", "oa-button--sleeping", "oa-button--" + size,
      options.fullWidth ? "oa-button--full-width" : "", options.loading ? "oa-button--loading" : "",
      options.className || ""].filter(Boolean).join(" ");
    var isDisabled = Boolean(options.disabled || (attributes.disabled !== undefined &&
      attributes.disabled !== null && attributes.disabled !== false));
    var isLoading = Boolean(options.loading);
    button.disabled = isDisabled || isLoading;
    var label = options.ariaLabel || attributes["aria-label"];
    if (label) button.setAttribute("aria-label", String(label));
    else if (!options.children) button.setAttribute("aria-label", "Optical Anchor eye control");
    var describedBy = options.describedBy || attributes["aria-describedby"];
    if (describedBy) button.setAttribute("aria-describedby", String(describedBy));
    if (isLoading) button.setAttribute("aria-busy", "true");

    button.innerHTML = '<span class="oa-button__face"><span class="oa-button__content">' +
      SVG_MARKUP.replace(/(id="|url\(#)oa-/g, function (_, prefix) { return prefix + id + "-"; }) +
      '<span class="oa-button__bubble" aria-hidden="true">Let\'s collab!</span></span></span>';

    if (options.children != null && String(options.children).length) {
      var caption = document.createElement("span");
      caption.className = "oa-button__label";
      caption.textContent = String(options.children);
      button.querySelector(".oa-button__content").appendChild(caption);
    }

    var clickHandler = typeof options.onClick === "function" ? options.onClick : null;
    if (clickHandler) button.addEventListener("click", clickHandler);
    var eyeController = new global.OpticalAnchorEyeController(button);
    var destroyed = false;

    function syncAvailability() {
      button.disabled = isDisabled || isLoading;
      button.classList.toggle("oa-button--loading", isLoading);
      if (isLoading) button.setAttribute("aria-busy", "true");
      else button.removeAttribute("aria-busy");
      eyeController.setBlocked(button.disabled);
    }

    return {
      element: button,
      controller: eyeController,
      setDisabled: function (disabled) {
        isDisabled = Boolean(disabled);
        syncAvailability();
      },
      setLoading: function (loading) {
        isLoading = Boolean(loading);
        syncAvailability();
      },
      destroy: function () {
        if (destroyed) return;
        destroyed = true;
        eyeController.destroy();
        if (clickHandler) button.removeEventListener("click", clickHandler);
        button.remove();
      }
    };
  }

  global.OpticalAnchorButton = { create: createOpticalButton };
})(window);
