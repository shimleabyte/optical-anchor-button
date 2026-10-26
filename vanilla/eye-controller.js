(function (global) {
  "use strict";

  var IDLE_MS = 2200;
  var TIRED_MS = 780;

  function EyeController(button) {
    this.button = button;
    this.state = "sleeping";
    this.blocked = button.disabled;
    this.focused = button.matches(":focus");
    this.destroyed = false;
    this.timers = { tired: 0, sleep: 0, blink: 0, blinkEnd: 0, return: 0 };
    this.pointer = { hasTarget: false, x: global.innerWidth / 2, y: global.innerHeight / 2, inside: false };
    this.reducedMotion = global.matchMedia ? global.matchMedia("(prefers-reduced-motion: reduce)").matches : false;

    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerOut = this.onPointerOut.bind(this);
    this.onWindowBlur = this.onWindowBlur.bind(this);
    this.onVisibilityChange = this.onVisibilityChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onPointerEnter = this.onPointerEnter.bind(this);
    this.onPointerLeave = this.onPointerLeave.bind(this);

    global.addEventListener("pointermove", this.onPointerMove, { passive: true });
    global.addEventListener("pointerout", this.onPointerOut);
    global.addEventListener("blur", this.onWindowBlur);
    document.addEventListener("visibilitychange", this.onVisibilityChange);
    button.addEventListener("focus", this.onFocus);
    button.addEventListener("blur", this.onBlur);
    button.addEventListener("pointerenter", this.onPointerEnter);
    button.addEventListener("pointerleave", this.onPointerLeave);

    this.setState("sleeping");
    if (this.focused) this.onFocus();
    if (this.blocked) this.sleep();
  }

  EyeController.prototype.isBlocked = function () {
    return this.blocked || this.button.disabled;
  };

  EyeController.prototype.setBlocked = function (blocked) {
    this.blocked = Boolean(blocked);
    if (this.isBlocked()) {
      this.clearEyeTimers();
      this.clearBlinkTimers();
      this.sleep();
    }
  };

  EyeController.prototype.setState = function (next) {
    var changed = this.state !== next;
    this.state = next;
    this.button.classList.toggle("oa-button--sleeping", next === "sleeping");
    this.button.classList.toggle("oa-button--awake", next === "awake");
    this.button.classList.toggle("oa-button--tired", next === "tired");
    if (next === "sleeping") this.clearBlinkTimers();
    else if (changed) this.scheduleBlink();
  };

  EyeController.prototype.clearEyeTimers = function () {
    global.clearTimeout(this.timers.tired);
    global.clearTimeout(this.timers.sleep);
    this.timers.tired = 0;
    this.timers.sleep = 0;
  };

  EyeController.prototype.clearBlinkTimers = function () {
    global.clearTimeout(this.timers.blink);
    global.clearTimeout(this.timers.blinkEnd);
    this.timers.blink = 0;
    this.timers.blinkEnd = 0;
    this.button.classList.remove("oa-button--blinking");
  };

  EyeController.prototype.scheduleBlink = function () {
    var self = this;
    global.clearTimeout(this.timers.blink);
    this.timers.blink = 0;
    if (this.state === "sleeping" || this.isBlocked() || this.reducedMotion || document.hidden || this.destroyed) return;
    var tired = this.state === "tired";
    var delay = tired
      ? (this.focused ? 2400 + Math.random() * 2200 : 260 + Math.random() * 260)
      : 3400 + Math.random() * 3300;
    this.timers.blink = global.setTimeout(function () {
      self.timers.blink = 0;
      if (self.state === "sleeping" || self.isBlocked() || document.hidden || self.destroyed) return;
      self.button.classList.add("oa-button--blinking");
      self.timers.blinkEnd = global.setTimeout(function () {
        self.button.classList.remove("oa-button--blinking");
        self.timers.blinkEnd = 0;
        if (self.state !== "tired" || self.focused) self.scheduleBlink();
      }, tired ? 135 : 110);
    }, delay);
  };

  EyeController.prototype.resetPull = function () {
    this.button.style.setProperty("--pull-x", "0px");
    this.button.style.setProperty("--pull-y", "0px");
  };

  EyeController.prototype.resetGaze = function () {
    this.button.style.setProperty("--gaze-x", "0px");
    this.button.style.setProperty("--gaze-y", "0px");
  };

  EyeController.prototype.setGaze = function (x, y) {
    var eye = this.button.querySelector(".oa-button__eye");
    if (!eye) return;
    var rect = eye.getBoundingClientRect();
    var dx = x - (rect.left + rect.width / 2);
    var dy = y - (rect.top + rect.height / 2);
    var distance = Math.hypot(dx, dy);
    var strength = Math.min(1, distance / 210);
    this.button.style.setProperty("--gaze-x", (distance ? dx / distance * strength * 8 : 0).toFixed(2) + "px");
    this.button.style.setProperty("--gaze-y", (distance ? dy / distance * strength * 5.2 : 0).toFixed(2) + "px");
  };

  EyeController.prototype.sleep = function () {
    this.clearEyeTimers();
    if (this.focused && !this.isBlocked()) {
      this.setState("tired");
      return;
    }
    this.setState("sleeping");
    this.resetGaze();
  };

  EyeController.prototype.scheduleSleep = function () {
    var self = this;
    this.clearEyeTimers();
    this.timers.tired = global.setTimeout(function () {
      self.timers.tired = 0;
      self.setState("tired");
      if (self.focused || self.isBlocked() || self.destroyed) return;
      self.timers.sleep = global.setTimeout(function () {
        self.timers.sleep = 0;
        self.sleep();
      }, TIRED_MS);
    }, IDLE_MS);
  };

  EyeController.prototype.wake = function (x, y) {
    if (this.isBlocked() || this.destroyed) return;
    global.clearTimeout(this.timers.return);
    this.setState("awake");
    if (typeof x === "number" && typeof y === "number") this.setGaze(x, y);
    this.scheduleSleep();
  };

  EyeController.prototype.onPointerEnter = function (event) {
    if (event.pointerType === "touch" || this.isBlocked()) return;
    if (global.matchMedia && global.matchMedia("(any-hover: hover) and (any-pointer: fine)").matches) {
      this.button.classList.add("oa-button--pointer-hover");
    }
    this.pointer.inside = true;
    this.wake(event.clientX, event.clientY);
  };

  EyeController.prototype.onPointerLeave = function (event) {
    if (event.pointerType !== "touch") this.button.classList.remove("oa-button--pointer-hover");
    this.pointer.inside = false;
    this.resetPull();
  };

  EyeController.prototype.onPointerMove = function (event) {
    if (this.isBlocked() || event.pointerType === "touch" || this.destroyed) return;
    this.pointer.x = event.clientX;
    this.pointer.y = event.clientY;
    this.pointer.hasTarget = true;
    var rect = this.button.getBoundingClientRect();
    this.button.classList.remove("oa-button--returning");
    this.pointer.inside = event.clientX >= rect.left && event.clientX <= rect.right &&
      event.clientY >= rect.top && event.clientY <= rect.bottom;

    if (this.state === "sleeping") {
      if (!this.pointer.inside) return;
      this.wake(event.clientX, event.clientY);
    } else {
      this.setState("awake");
      this.scheduleSleep();
    }
    this.setGaze(event.clientX, event.clientY);
    if (this.pointer.inside && rect.width && rect.height) {
      var nx = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
      var ny = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1));
      this.button.style.setProperty("--pull-x", (nx * 1.15).toFixed(2) + "px");
      this.button.style.setProperty("--pull-y", (ny * 0.75).toFixed(2) + "px");
    } else this.resetPull();
  };

  EyeController.prototype.onPointerOut = function (event) {
    if (event.relatedTarget !== null) return;
    this.pointer.inside = false;
    this.resetPull();
    global.clearTimeout(this.timers.return);
    if (this.state === "sleeping") return;
    var self = this;
    this.timers.return = global.setTimeout(function () {
      if (self.state !== "sleeping" && !self.destroyed) {
        self.button.classList.add("oa-button--returning");
        self.resetGaze();
      }
      self.timers.return = 0;
    }, 180);
  };

  EyeController.prototype.onFocus = function () {
    this.focused = true;
    if (this.isBlocked()) return;
    this.clearEyeTimers();
    this.setState("awake");
    if (this.pointer.hasTarget) this.setGaze(this.pointer.x, this.pointer.y);
    else this.resetGaze();
    this.scheduleSleep();
  };

  EyeController.prototype.onBlur = function () {
    this.focused = false;
    if (this.isBlocked()) return;
    if (this.state === "tired") {
      this.clearEyeTimers();
      var self = this;
      this.timers.sleep = global.setTimeout(function () {
        self.timers.sleep = 0;
        self.sleep();
      }, TIRED_MS);
      return;
    }
    this.scheduleSleep();
  };

  EyeController.prototype.onWindowBlur = function () {
    this.pointer.inside = false;
    this.resetPull();
    if (this.focused && !this.isBlocked()) {
      this.clearEyeTimers();
      this.setState("tired");
    } else this.sleep();
  };

  EyeController.prototype.onVisibilityChange = function () {
    if (document.hidden) this.onWindowBlur();
    else if (this.state !== "sleeping") this.scheduleBlink();
  };

  EyeController.prototype.destroy = function () {
    if (this.destroyed) return;
    this.destroyed = true;
    global.removeEventListener("pointermove", this.onPointerMove);
    global.removeEventListener("pointerout", this.onPointerOut);
    global.removeEventListener("blur", this.onWindowBlur);
    document.removeEventListener("visibilitychange", this.onVisibilityChange);
    this.button.removeEventListener("focus", this.onFocus);
    this.button.removeEventListener("blur", this.onBlur);
    this.button.removeEventListener("pointerenter", this.onPointerEnter);
    this.button.removeEventListener("pointerleave", this.onPointerLeave);
    this.clearEyeTimers();
    this.clearBlinkTimers();
    Object.keys(this.timers).forEach(function (key) { global.clearTimeout(this.timers[key]); }, this);
    this.button.classList.remove(
      "oa-button--pointer-hover", "oa-button--returning", "oa-button--awake",
      "oa-button--tired", "oa-button--sleeping", "oa-button--blinking"
    );
    this.resetPull();
    this.resetGaze();
  };

  global.OpticalAnchorEyeController = EyeController;
})(window);
