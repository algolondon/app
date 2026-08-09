const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  const baseUrl = 'http://localhost:3001';

  // --- ADMIN WORKFLOW ---
  console.log('Testing Admin Workflow...');
  await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle0' });
  await page.type('input[name="email"]', 'admin@example.com');
  await page.type('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  
  // Now go to Admin Dashboard
  await page.goto(`${baseUrl}/admin`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'admin_dashboard.png', fullPage: true });
  console.log('Admin Dashboard screenshot saved.');

  // Go to Admin Users
  await page.goto(`${baseUrl}/admin/users`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'admin_users.png', fullPage: true });
  console.log('Admin Users screenshot saved.');

  // Logout
  // Assuming there is a logout button, or just clear cookies
  const client = await page.target().createCDPSession();
  await client.send('Network.clearBrowserCookies');

  // --- USER WORKFLOW ---
  console.log('Testing User Workflow...');
  await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle0' });
  await page.type('input[name="email"]', 'testuser@16londonalgo.com');
  await page.type('input[name="password"]', 'TestPassword123!');
  await page.click('button[type="submit"]');
  
  await page.waitForNavigation({ waitUntil: 'networkidle0' });

  // Dashboard
  await page.goto(`${baseUrl}/members-portal`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'user_dashboard.png', fullPage: true });
  console.log('User Dashboard screenshot saved.');

  // Courses
  await page.goto(`${baseUrl}/course-library`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'user_courses.png', fullPage: true });
  console.log('User Courses screenshot saved.');

  await browser.close();
  console.log('All tests finished.');
})();
