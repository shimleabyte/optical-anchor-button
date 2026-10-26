import { expect, test } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const artifactDir = 'artifacts';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Optical Anchor/);
});

test('renders the study and captures an idle desktop reference', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /Optical Anchor/ }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'Optical Anchor eye button' })).toBeVisible();
  await expect(page.locator('.oa-button__bubble')).toHaveCSS('opacity', '0');

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow, 'desktop page should not overflow horizontally').toBe(false);

  await mkdir(artifactDir, { recursive: true });
  await page.screenshot({ path: `${artifactDir}/desktop-idle.png`, fullPage: true });
});

test('physical hover reveals the collab bubble, pointer exit hides it, and focus alone stays neutral', async ({ page }) => {
  const button = page.getByRole('button', { name: 'Optical Anchor eye button' });
  const bubble = button.locator('.oa-button__bubble');
  const neutralBrow = button.locator('.oa-button__brow--neutral');
  const excitedBrow = button.locator('.oa-button__brow--excited');

  await page.mouse.move(8, 8);
  await expect(bubble).toHaveCSS('visibility', 'hidden');
  await page.mouse.move(0, 0);
  await button.hover();

  await expect(bubble).toHaveCSS('opacity', '1');
  await expect(bubble).toHaveCSS('visibility', 'visible');
  await expect(neutralBrow).toHaveCSS('opacity', '0');
  await expect(excitedBrow).toHaveCSS('opacity', '1');
  await expect(page.locator('.stage-footer .readout-value').first()).toHaveText('HOVER');

  await mkdir(artifactDir, { recursive: true });
  await page.screenshot({ path: `${artifactDir}/desktop-hover-collab.png`, fullPage: true });

  await page.mouse.move(8, 8);
  await expect(bubble).toHaveCSS('visibility', 'hidden');
  await expect(page.locator('.stage-footer .readout-value').first()).toHaveText('DEFAULT');

  await button.focus();
  await expect(button).toBeFocused();
  await expect(bubble).toHaveCSS('visibility', 'hidden');
  await expect(excitedBrow).toHaveCSS('opacity', '0');
});

test('keeps the bubble visible and inside the viewport at 320 px and 390 px', async ({ page }) => {
  const button = page.getByRole('button', { name: 'Optical Anchor eye button' });
  const bubble = button.locator('.oa-button__bubble');

  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.mouse.move(0, 0);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow, `page should not overflow horizontally at ${width}px`).toBe(false);

    await button.hover();
    await expect(bubble).toHaveCSS('visibility', 'visible');
    const box = await bubble.boundingBox();
    expect(box, 'bubble should have a rendered box').not.toBeNull();
    expect(box!.x, `bubble should not clip at the left edge at ${width}px`).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width, `bubble should not clip at the right edge at ${width}px`).toBeLessThanOrEqual(width);

    await mkdir(artifactDir, { recursive: true });
    await page.screenshot({ path: `${artifactDir}/responsive-${width}px-hover.png`, fullPage: true });
    await page.mouse.move(0, 0);
    await expect(bubble).toHaveCSS('visibility', 'hidden');
  }
});

test('keeps keyboard focus visible and reduces bubble motion when requested', async ({ page }) => {
  const button = page.getByRole('button', { name: 'Optical Anchor eye button' });
  const bubble = button.locator('.oa-button__bubble');

  await page.mouse.move(0, 0);
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await expect(button).toBeFocused();
  await expect(button).toHaveCSS('outline-style', 'solid');
  await expect(button).toHaveCSS('outline-width', '2px');
  await expect(bubble).toHaveCSS('visibility', 'hidden');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await button.hover();
  await expect(bubble).toHaveCSS('visibility', 'visible');
  await expect(bubble).toHaveCSS('transition-delay', '0s');
});

test('disabled and loading controls cannot expose or activate the hover bubble', async ({ page }) => {
  const button = page.getByRole('button', { name: 'Optical Anchor eye button' });
  const bubble = button.locator('.oa-button__bubble');

  await page.getByRole('button', { name: /Disabled/ }).click();
  await expect(button).toBeDisabled();
  await page.mouse.move(0, 0);
  await button.hover({ force: true });
  await expect(bubble).toHaveCSS('visibility', 'hidden');

  await page.getByRole('button', { name: /Loading/ }).click();
  await expect(button).toBeDisabled();
  await expect(button).toHaveAttribute('aria-busy', 'true');
  await expect(bubble).toHaveCSS('visibility', 'hidden');
  const scan = button.locator('.oa-button__loading-scan');
  await expect(scan).toHaveCSS('animation-name', 'oa-optical-scan');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(scan).toHaveCSS('animation-name', 'none');
});


test('keeps sm, md, and lg dimensions proportional and positions each hover bubble within its housing', async ({ page }) => {
  await page.goto('/component-matrix.html');
  await mkdir(artifactDir, { recursive: true });
  await page.screenshot({ path: `${artifactDir}/component-matrix-desktop-sizes.png`, fullPage: true });
  const sizes = [
    { key: 'sm', label: 'Small Optical Anchor', width: 236, height: 64, eye: [108, 70], bezel: 116 },
    { key: 'md', label: 'Medium Optical Anchor', width: 280, height: 76, eye: [132, 86], bezel: 138 },
    { key: 'lg', label: 'Large Optical Anchor', width: 324, height: 88, eye: [158, 103], bezel: 160 },
  ];

  for (const size of sizes) {
    const panel = page.getByTestId(`size-${size.key}`);
    const button = panel.getByRole('button', { name: size.label });
    const buttonBox = await button.boundingBox();
    expect(buttonBox, `${size.key} button should render`).not.toBeNull();
    expect(buttonBox!.width).toBe(size.width);
    expect(buttonBox!.height).toBe(size.height);

    const eye = await button.locator('.oa-button__eye').evaluate((node) => {
      const style = getComputedStyle(node);
      return [Number.parseFloat(style.width), Number.parseFloat(style.height)];
    });
    expect(eye).toEqual(size.eye);

    const bezelWidth = await button.locator('.oa-button__content').evaluate(
      (node) => Number.parseFloat(getComputedStyle(node, '::before').width),
    );
    expect(bezelWidth).toBe(size.bezel);

    await button.hover();
    const bubble = button.locator('.oa-button__bubble');
    await expect(button).toHaveClass(/oa-button--pointer-hover/);
    await expect(bubble).toHaveCSS('visibility', 'visible');
    const bubbleBox = await bubble.boundingBox();
    expect(bubbleBox, `${size.key} bubble should render`).not.toBeNull();
    expect(bubbleBox!.x).toBeGreaterThanOrEqual(buttonBox!.x);
    expect(bubbleBox!.x + bubbleBox!.width).toBeLessThanOrEqual(buttonBox!.x + buttonBox!.width);
    expect(bubbleBox!.y + bubbleBox!.height).toBeLessThanOrEqual(buttonBox!.y);
    await page.mouse.move(0, 0);
    await expect(bubble).toHaveCSS('visibility', 'hidden');
  }
});

test('respects fullWidth caps and parent constraints on wide and narrow layouts', async ({ page }) => {
  await page.goto('/component-matrix.html');

  const widePanel = page.getByTestId('fullwidth-wide');
  const wideContainer = widePanel.locator('.matrix-width-container');
  const wideButton = widePanel.getByRole('button', { name: 'Wide full-width Optical Anchor' });
  const wideParentBox = await wideContainer.boundingBox();
  const wideButtonBox = await wideButton.boundingBox();
  expect(wideParentBox).not.toBeNull();
  expect(wideButtonBox).not.toBeNull();
  expect(wideParentBox!.width).toBeGreaterThan(360);
  expect(wideButtonBox!.width).toBe(360);
  expect(wideButtonBox!.x + wideButtonBox!.width / 2).toBeCloseTo(
    wideParentBox!.x + wideParentBox!.width / 2,
    0,
  );

  const narrowPanel = page.getByTestId('fullwidth-narrow');
  const narrowContainer = narrowPanel.locator('.matrix-width-container');
  const narrowButton = narrowPanel.getByRole('button', { name: 'Narrow full-width Optical Anchor' });
  const narrowParentBox = await narrowContainer.boundingBox();
  const narrowButtonBox = await narrowButton.boundingBox();
  expect(narrowParentBox).not.toBeNull();
  expect(narrowButtonBox).not.toBeNull();
  expect(narrowParentBox!.width).toBe(248);
  expect(narrowButtonBox!.width).toBe(narrowParentBox!.width);

  await page.setViewportSize({ width: 320, height: 900 });
  await expect(narrowButton).toBeVisible();
  const mobileParentBox = await wideContainer.boundingBox();
  const mobileButtonBox = await wideButton.boundingBox();
  expect(mobileParentBox).not.toBeNull();
  expect(mobileButtonBox).not.toBeNull();
  expect(mobileButtonBox!.width).toBe(mobileParentBox!.width);
  const pageOverflows = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(pageOverflows, 'full-width matrix must not overflow at 320 px').toBe(false);

  await mkdir(artifactDir, { recursive: true });
  await page.screenshot({ path: `${artifactDir}/component-matrix-320px-fullwidth.png`, fullPage: true });
});

test('keeps synthetic touch entry neutral while a hybrid device can still use a real mouse hover', async ({ browser }) => {
  const context = await browser.newContext({
    baseURL: 'http://127.0.0.1:4173',
    viewport: { width: 1440, height: 1000 },
  });
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'maxTouchPoints', { configurable: true, get: () => 1 });
  });

  try {
    const page = await context.newPage();
    await page.goto('/component-matrix.html');
    const button = page.getByRole('button', { name: 'Small Optical Anchor' });
    const bubble = button.locator('.oa-button__bubble');
    const capabilities = await page.evaluate(() => ({
      touchPoints: navigator.maxTouchPoints,
      hover: matchMedia('(any-hover: hover)').matches,
      finePointer: matchMedia('(any-pointer: fine)').matches,
    }));
    expect(capabilities.touchPoints).toBeGreaterThan(0);
    expect(capabilities.hover, 'hybrid context should retain hover-capable input').toBe(true);
    expect(capabilities.finePointer, 'hybrid context should retain a fine pointer').toBe(true);

    const initialGaze = await button.evaluate((node) => [
      node.style.getPropertyValue('--gaze-x'),
      node.style.getPropertyValue('--gaze-y'),
    ]);
    await button.dispatchEvent('pointerenter', {
      pointerType: 'touch',
      pointerId: 17,
      clientX: 120,
      clientY: 140,
    });
    await page.evaluate(() => {
      window.dispatchEvent(new PointerEvent('pointermove', {
        bubbles: true,
        pointerType: 'touch',
        pointerId: 17,
        clientX: 120,
        clientY: 140,
      }));
    });
    await expect(button).not.toHaveClass(/oa-button--pointer-hover/);
    await expect(bubble).toHaveCSS('visibility', 'hidden');
    const gazeAfterTouch = await button.evaluate((node) => [
      node.style.getPropertyValue('--gaze-x'),
      node.style.getPropertyValue('--gaze-y'),
    ]);
    expect(gazeAfterTouch).toEqual(initialGaze);

    const buttonBox = await button.boundingBox();
    expect(buttonBox).not.toBeNull();
    await page.mouse.move(buttonBox!.x + buttonBox!.width / 2, buttonBox!.y + buttonBox!.height / 2);
    await expect(button).toHaveClass(/oa-button--pointer-hover/);
    await expect(bubble).toHaveCSS('visibility', 'visible');

    await button.dispatchEvent('pointerenter', {
      pointerType: 'touch',
      pointerId: 18,
      clientX: buttonBox!.x + 12,
      clientY: buttonBox!.y + 12,
    });
    await expect(button).toHaveClass(/oa-button--pointer-hover/);
    await expect(bubble).toHaveCSS('visibility', 'visible');
  } finally {
    await context.close();
  }
});

test('touch-only emulation neither wakes the gaze nor activates the physical hover signature', async ({ browser }) => {
  const context = await browser.newContext({
    baseURL: 'http://127.0.0.1:4173',
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });

  try {
    const page = await context.newPage();
    await page.goto('/component-matrix.html');
    const button = page.getByRole('button', { name: 'Wide full-width Optical Anchor' });
    const bubble = button.locator('.oa-button__bubble');
    const initialGaze = await button.evaluate((node) => [
      node.style.getPropertyValue('--gaze-x'),
      node.style.getPropertyValue('--gaze-y'),
    ]);

    await button.dispatchEvent('pointerenter', {
      pointerType: 'touch',
      pointerId: 23,
      clientX: 120,
      clientY: 180,
    });
    await page.evaluate(() => {
      window.dispatchEvent(new PointerEvent('pointermove', {
        bubbles: true,
        pointerType: 'touch',
        pointerId: 23,
        clientX: 120,
        clientY: 180,
      }));
    });
    await expect(button).not.toHaveClass(/oa-button--pointer-hover/);
    await expect(bubble).toHaveCSS('visibility', 'hidden');
    const gazeAfterTouch = await button.evaluate((node) => [
      node.style.getPropertyValue('--gaze-x'),
      node.style.getPropertyValue('--gaze-y'),
    ]);
    expect(gazeAfterTouch).toEqual(initialGaze);
  } finally {
    await context.close();
  }
});

test('exposes a single meaningful button name and supports keyboard activation', async ({ page }) => {
  const button = page.getByRole('button', { name: 'Optical Anchor eye button' });
  const bubble = button.locator('.oa-button__bubble');
  await expect(button).toHaveAttribute('aria-describedby', 'button-hint');
  await expect(button.locator('.oa-button__eye')).toHaveAttribute('aria-hidden', 'true');
  await expect(bubble).toHaveAttribute('aria-hidden', 'true');

  await page.mouse.move(0, 0);
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await expect(button).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('.stage-footer .readout-value').nth(1)).toHaveText('01');
  await page.keyboard.press('Space');
  await expect(page.locator('.stage-footer .readout-value').nth(1)).toHaveText('02');
  await expect(bubble).toHaveCSS('visibility', 'hidden');
});

