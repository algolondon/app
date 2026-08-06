const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Wait for the server to be fully ready
  await new Promise(r => setTimeout(r, 5000));
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'C:\\Users\\Administrator\\.gemini\\antigravity\\brain\\b50d3dcb-d021-41e6-8402-1ab65c13066e\\screenshot.png', fullPage: true });
  await browser.close();
  console.log('Screenshot saved');
})();
