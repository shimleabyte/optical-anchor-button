import { readFileSync, writeFileSync } from "node:fs";

const studioCss = readFileSync(new URL("../src/styles/app.css", import.meta.url), "utf8");
const componentCss = readFileSync(new URL("../src/components/optical-button.css", import.meta.url), "utf8");
const outputUrl = new URL("../vanilla/vanilla.css", import.meta.url);
const expected = studioCss + "\n\n/* Component styling follows the React baseline verbatim. */\n" + componentCss;
const checkOnly = process.argv.includes("--check");

if (checkOnly) {
  const actual = readFileSync(outputUrl, "utf8");
  if (actual !== expected) {
    console.error("vanilla/vanilla.css is out of sync with the React source stylesheets.");
    console.error("Run npm run sync:vanilla-css and commit the generated stylesheet.");
    process.exitCode = 1;
  } else {
    console.log("Vanilla stylesheet matches the source studio and component CSS.");
  }
} else {
  writeFileSync(outputUrl, expected);
  console.log("Regenerated vanilla/vanilla.css from the source stylesheets.");
}
