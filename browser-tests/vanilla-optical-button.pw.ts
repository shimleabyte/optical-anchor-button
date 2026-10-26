import { mkdir } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/vanilla/index.html');
  await expect(page).toHaveTitle(/Optical Anchor.*Vanilla/);
});

test('loads the standalone build without React and exposes native button semantics', async ({ page }) => {
  const button = page.getByRole('button', { name: 'Optical Anchor eye button' });
  await expect(button).toBeVisible();
  await expect(button).toHaveAttribute('type', 'button');
  await expect(button).toHaveAttribute('aria-describedby', 'button-hint');
  await expect(button.locator('.oa-button__eye')).toHaveAttribute('aria-hidden', 'true');
  await expect(button.locator('.oa-button__bubble')).toHaveAttribute('aria-hidden', 'true');

  const runtime = await page.evaluate(() => ({
    react: typeof (window as Window & { React?: unknown }).React,
    factory: typeof (window as Window & { OpticalAnchorButton?: { create?: unknown } }).OpticalAnchorButton?.create,
    controller: typeof (window as Window & { OpticalAnchorEyeController?: unknown }).OpticalAnchorEyeController,
    vanillaScriptTypes: Array.from(document.querySelectorAll(
      'script[src="./eye-controller.js"], script[src="./optical-button.js"], script[src="./showcase.js"]',
    )).map((script) => script.getAttribute('type') || 'classic'),
  }));
  expect(runtime.react).toBe('undefined');
  expect(runtime.factory).toBe('function');
  expect(runtime.controller).toBe('function');
  expect(runtime.vanillaScriptTypes).toEqual(['classic', 'classic', 'classic']);
});

test('opens from file URL without a dev server, module loader, or framework runtime', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.goto(new URL('../vanilla/index.html', import.meta.url).href);

  const button = page.getByRole('button', { name: 'Optical Anchor eye button' });
  await expect(button).toBeVisible();
  await expect(button).toHaveClass(/oa-button--sleeping/);
  const runtime = await page.evaluate(() => ({
    factory: typeof (window as Window & { OpticalAnchorButton?: { create?: unknown } }).OpticalAnchorButton?.create,
    moduleScripts: document.querySelectorAll('script[type="module"]').length,
  }));
  expect(runtime.factory).toBe('function');
  expect(runtime.moduleScripts).toBe(0);
  expect(pageErrors).toEqual([]);

  await mkdir('artifacts', { recursive: true });
  await page.screenshot({ path: 'artifacts/vanilla-file-protocol-idle.png', fullPage: true });
});

test('wakes on physical mouse hover and returns to neutral after pointer exit', async ({ page }) => {
  const button = page.getByRole('button', { name: 'Optical Anchor eye button' });
  const bubble = button.locator('.oa-button__bubble');

  await page.mouse.move(0, 0);
  await expect(bubble).toHaveCSS('visibility', 'hidden');
  await button.hover();
  await expect(button).toHaveClass(/oa-button--pointer-hover/);
  await expect(button).toHaveClass(/oa-button--awake/);
  await expect(bubble).toHaveCSS('visibility', 'visible');

  await page.mouse.move(0, 0);
  await expect(button).not.toHaveClass(/oa-button--pointer-hover/);
  await expect(bubble).toHaveCSS('visibility', 'hidden');
});

test('supports keyboard activation and keeps hover-only copy hidden from the accessibility tree', async ({ page }) => {
  const button = page.getByRole('button', { name: 'Optical Anchor eye button' });
  const count = page.locator('#readout-count');

  await page.mouse.move(0, 0);
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await expect(button).toBeFocused();
  await expect(button).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Enter');
  await expect(count).toHaveText('01');
  await page.keyboard.press('Space');
  await expect(count).toHaveText('02');
  await expect(button.locator('.oa-button__bubble')).toHaveCSS('visibility', 'hidden');
});

test('preview states preserve native disabled/loading behavior and reset cleanly', async ({ page }) => {
  const button = page.getByRole('button', { name: 'Optical Anchor eye button' });

  await page.getByRole('button', { name: /Disabled/ }).click();
  await expect(button).toBeDisabled();
  await expect(button).toHaveClass(/oa-button--sleeping/);

  await page.getByRole('button', { name: /Loading/ }).click();
  await expect(button).toBeDisabled();
  await expect(button).toHaveAttribute('aria-busy', 'true');
  const scan = button.locator('.oa-button__loading-scan');
  await expect(scan).toHaveCSS('animation-name', 'oa-optical-scan');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(scan).toHaveCSS('animation-name', 'none');

  await page.getByRole('button', { name: /Idle/ }).click();
  await expect(button).toBeEnabled();
  await expect(button).not.toHaveAttribute('aria-busy');
});

test('reduced motion removes transition delay and touch movement does not activate mouse gaze', async ({ page, browser }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const button = page.getByRole('button', { name: 'Optical Anchor eye button' });
  await button.hover();
  await expect(button.locator('.oa-button__bubble')).toHaveCSS('transition-delay', '0s');

  const context = await browser.newContext({
    baseURL: 'http://127.0.0.1:4173',
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  try {
    const touchPage = await context.newPage();
    await touchPage.goto('/vanilla/index.html');
    const touchButton = touchPage.getByRole('button', { name: 'Optical Anchor eye button' });
    const initialGaze = await touchButton.evaluate((node) => [
      node.style.getPropertyValue('--gaze-x'),
      node.style.getPropertyValue('--gaze-y'),
    ]);
    await touchButton.dispatchEvent('pointerenter', {
      pointerType: 'touch', pointerId: 41, clientX: 90, clientY: 100,
    });
    await touchPage.evaluate(() => {
      window.dispatchEvent(new PointerEvent('pointermove', {
        bubbles: true, pointerType: 'touch', pointerId: 41, clientX: 90, clientY: 100,
      }));
    });
    await expect(touchButton).not.toHaveClass(/oa-button--pointer-hover/);
    await expect(touchButton.locator('.oa-button__bubble')).toHaveCSS('visibility', 'hidden');
    await expect(touchButton).toHaveClass(/oa-button--sleeping/);
    expect(await touchButton.evaluate((node) => [
      node.style.getPropertyValue('--gaze-x'),
      node.style.getPropertyValue('--gaze-y'),
    ])).toEqual(initialGaze);
  } finally {
    await context.close();
  }
});

test('supports native button attributes without allowing attribute strings to install event handlers', async ({ page }) => {
  await page.evaluate(() => {
    const form = document.createElement('form');
    form.id = 'vanilla-native-form';
    document.body.appendChild(form);
  });

  const attributes = await page.evaluate(() => {
    const control = window.OpticalAnchorButton!.create({
      ariaLabel: 'Native attributes test',
      attributes: {
        id: 'vanilla-native-control',
        name: 'destination',
        value: 'portfolio',
        form: 'vanilla-native-form',
        title: 'Open portfolio',
        tabIndex: 3,
        'data-purpose': 'project-link',
        onclick: 'window.__unsafeAttributeRan = true',
      },
    });
    document.body.appendChild(control.element);
    const button = control.element;
    const result = {
      id: button.id,
      name: button.name,
      value: button.value,
      form: button.form?.id,
      title: button.title,
      tabIndex: button.tabIndex,
      dataPurpose: button.getAttribute('data-purpose'),
      onclickAttribute: button.getAttribute('onclick'),
      unsafeGlobal: (window as Window & { __unsafeAttributeRan?: boolean }).__unsafeAttributeRan === true,
    };
    control.destroy();
    return result;
  });

  expect(attributes).toEqual({
    id: 'vanilla-native-control',
    name: 'destination',
    value: 'portfolio',
    form: 'vanilla-native-form',
    title: 'Open portfolio',
    tabIndex: 3,
    dataPurpose: 'project-link',
    onclickAttribute: null,
    unsafeGlobal: false,
  });
});

test('keeps focus awake through idle and tired phases, then sleeps after blur', async ({ page }) => {
  await page.clock.install();
  const button = page.getByRole('button', { name: 'Optical Anchor eye button' });
  await button.focus();

  await page.clock.runFor(2200);
  await expect(button).toHaveClass(/oa-button--tired/);
  await page.clock.runFor(5000);
  await expect(button).toHaveClass(/oa-button--tired/);
  await expect(button).not.toHaveClass(/oa-button--sleeping/);

  await button.evaluate((node) => node.blur());
  await page.clock.runFor(780);
  await expect(button).toHaveClass(/oa-button--sleeping/);
});

test('destroy clears controller timers/listeners/classes and reacts to live reduced-motion changes', async ({ page }) => {
  await page.clock.install();
  const lifecycle = await page.evaluate(() => {
    const windowAdded: Array<{ type: string; listener: EventListenerOrEventListenerObject }> = [];
    const windowRemoved: Array<{ type: string; listener: EventListenerOrEventListenerObject }> = [];
    const documentAdded: Array<{ type: string; listener: EventListenerOrEventListenerObject }> = [];
    const documentRemoved: Array<{ type: string; listener: EventListenerOrEventListenerObject }> = [];
    const originalWindowAdd = window.addEventListener;
    const originalWindowRemove = window.removeEventListener;
    const originalDocumentAdd = document.addEventListener;
    const originalDocumentRemove = document.removeEventListener;
    const watchedWindow = new Set(['pointermove', 'pointerout', 'blur']);
    window.addEventListener = function (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
      if (watchedWindow.has(type)) windowAdded.push({ type, listener });
      return originalWindowAdd.call(this, type, listener, options);
    } as typeof window.addEventListener;
    window.removeEventListener = function (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) {
      if (watchedWindow.has(type)) windowRemoved.push({ type, listener });
      return originalWindowRemove.call(this, type, listener, options);
    } as typeof window.removeEventListener;
    document.addEventListener = function (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
      if (type === 'visibilitychange') documentAdded.push({ type, listener });
      return originalDocumentAdd.call(this, type, listener, options);
    } as typeof document.addEventListener;
    document.removeEventListener = function (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) {
      if (type === 'visibilitychange') documentRemoved.push({ type, listener });
      return originalDocumentRemove.call(this, type, listener, options);
    } as typeof document.removeEventListener;

    const control = window.OpticalAnchorButton!.create({ ariaLabel: 'Destroy lifecycle probe' });
    document.body.appendChild(control.element);
    const rect = control.element.getBoundingClientRect();
    window.dispatchEvent(new PointerEvent('pointermove', {
      pointerType: 'mouse', clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2,
    }));
    const woke = control.element.classList.contains('oa-button--awake');
    const retainedButton = control.element;
    control.destroy();

    window.addEventListener = originalWindowAdd;
    window.removeEventListener = originalWindowRemove;
    document.addEventListener = originalDocumentAdd;
    document.removeEventListener = originalDocumentRemove;

    const leaks = windowAdded.filter((added) => !windowRemoved.some((removed) =>
      removed.type === added.type && removed.listener === added.listener,
    )).length + documentAdded.filter((added) => !documentRemoved.some((removed) =>
      removed.type === added.type && removed.listener === added.listener,
    )).length;
    return {
      woke,
      leaks,
      pendingTimers: Object.values(control.controller.timers).filter(Boolean).length,
      classesAfterDestroy: retainedButton.className,
    };
  });

  expect(lifecycle.woke).toBe(true);
  expect(lifecycle.leaks).toBe(0);
  expect(lifecycle.pendingTimers).toBe(0);
  expect(lifecycle.classesAfterDestroy).not.toMatch(/oa-button--(awake|tired|sleeping|blinking|returning|pointer-hover)/);

  await page.clock.runFor(5000);
  await expect(page.getByRole('button', { name: 'Optical Anchor eye button' })).toHaveClass(/oa-button--sleeping/);

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.evaluate(() => {
    const control = window.OpticalAnchorButton!.create({ ariaLabel: 'Live motion preference' });
    document.body.appendChild(control.element);
    (window as Window & { __liveMotionControl?: typeof control }).__liveMotionControl = control;
  });
  await expect.poll(async () => page.evaluate(() =>
    (window as Window & { __liveMotionControl?: { controller: { reducedMotion: boolean } } })
      .__liveMotionControl?.controller.reducedMotion,
  )).toBe(false);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(async () => page.evaluate(() =>
    (window as Window & { __liveMotionControl?: { controller: { reducedMotion: boolean } } })
      .__liveMotionControl?.controller.reducedMotion,
  )).toBe(true);
  await page.evaluate(() => {
    const target = window as Window & { __liveMotionControl?: { destroy: () => void } };
    target.__liveMotionControl?.destroy();
    delete target.__liveMotionControl;
  });
});

test('supports sm/md/lg factory sizing, fullWidth caps, and mobile viewport fit', async ({ page }) => {
  const metrics = await page.evaluate(() => {
    const host = document.createElement('div');
    host.style.width = '420px';
    document.body.appendChild(host);
    const sizes = (['sm', 'md', 'lg'] as const).map((size) => {
      const control = window.OpticalAnchorButton!.create({ size, ariaLabel: size + ' QA button' });
      host.appendChild(control.element);
      const rect = control.element.getBoundingClientRect();
      control.destroy();
      return { size, width: rect.width, height: rect.height };
    });
    const wide = window.OpticalAnchorButton!.create({ fullWidth: true, ariaLabel: 'Wide QA button' });
    host.appendChild(wide.element);
    const wideWidth = wide.element.getBoundingClientRect().width;
    wide.destroy();
    host.remove();
    return { sizes, wideWidth };
  });
  expect(metrics.sizes).toEqual([
    { size: 'sm', width: 236, height: 64 },
    { size: 'md', width: 280, height: 76 },
    { size: 'lg', width: 324, height: 88 },
  ]);
  expect(metrics.wideWidth).toBe(360);

  const availability = await page.evaluate(() => {
    const control = window.OpticalAnchorButton!.create({ disabled: true, ariaLabel: 'Availability API check' });
    const initiallyDisabled = control.element.disabled;
    control.setLoading(true);
    const loadingIsDisabled = control.element.disabled && control.element.getAttribute('aria-busy') === 'true';
    control.setDisabled(false);
    const loadingStillBlocks = control.element.disabled;
    control.setLoading(false);
    const reenabledAfterBothFlagsClear = !control.element.disabled && !control.element.hasAttribute('aria-busy');
    control.setDisabled(true);
    control.setLoading(false);
    const disabledRemainsIndependent = control.element.disabled;
    control.destroy();
    return { initiallyDisabled, loadingIsDisabled, loadingStillBlocks, reenabledAfterBothFlagsClear, disabledRemainsIndependent };
  });
  expect(availability).toEqual({
    initiallyDisabled: true,
    loadingIsDisabled: true,
    loadingStillBlocks: true,
    reenabledAfterBothFlagsClear: true,
    disabledRemainsIndependent: true,
  });

  await page.setViewportSize({ width: 320, height: 900 });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);
});
