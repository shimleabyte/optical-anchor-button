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
});
