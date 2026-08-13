const { chromium } = require("playwright");

const shotDir = "C:/Users/SAIRAM~1.GUR/AppData/Local/Temp/claude/d--natiyaarambam/119b1688-b436-482a-8afe-ec11d425d0b0/scratchpad";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push("pageerror: " + err.message));

  const start = Date.now();
  await page.goto("http://localhost:3000/gallery", { waitUntil: "load", timeout: 30000 });
  await page.waitForSelector(".nd-gallery-grid .nd-tile", { timeout: 15000 });
  const loadTime = Date.now() - start;

  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${shotDir}/gallery-grid.png`, fullPage: false });

  const firstTile = page.locator(".nd-gallery-grid .nd-tile").first();
  await firstTile.click();
  await page.waitForSelector(".yarl__root", { timeout: 10000 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${shotDir}/gallery-lightbox.png`, fullPage: false });

  const hasZoomBtn = await page.locator('button[aria-label="Zoom in"]').count();
  const hasCounter = await page.locator(".yarl__counter").count();

  await browser.close();

  console.log("Page load time to first tile visible (ms):", loadTime);
  console.log("Zoom button present:", hasZoomBtn > 0);
  console.log("Counter present:", hasCounter > 0);
  console.log("Console/page errors:", errors.length ? errors : "none");
})();
