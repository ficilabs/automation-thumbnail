const { chromium } = require('playwright');
const sharp = require('sharp');
const fs = require('fs');

const url = process.env.URL;

if (!url) {
  console.error('❌ URL is not defined (process.env.URL)');
  process.exit(1);
}

// generate filename dari URL
function getFileName(url) {
  return url
    .replace(/https?:\/\//, '')
    .replace(/[^a-zA-Z0-9]/g, '-')
    .toLowerCase();
}

const fileName = getFileName(url);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  if (!fs.existsSync('thumbnails')) {
    fs.mkdirSync('thumbnails');
  }

  console.log(`📸 Capture: ${url}`);

  await page.setViewportSize({
    width: 1280,
    height: 720
  });

  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const buffer = await page.screenshot();

  await sharp(buffer)
    .resize(640, 360)
    .png()
    .toFile(`thumbnails/${fileName}.png`);

  console.log(`✅ Saved: thumbnails/${fileName}.png`);

  await browser.close();
})();