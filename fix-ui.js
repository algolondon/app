const fs = require('fs');

// 1. Fix Sign Out Redirects (remove window.location.origin)
let navbar = fs.readFileSync('src/components/navbar.tsx', 'utf8');
navbar = navbar.replace(/signOut\({ callbackUrl: window.location.origin }\)/g, 'signOut({ callbackUrl: "/" })');

// 2. Fix Mobile Menu hidden behind navbar
// Replace top-[64px] with top-[100px] or similar. The navbar logo is 80px + padding.
navbar = navbar.replace(/top-\[64px\]/g, 'top-[100px] pb-6'); 
// 3. Fix Button sizing in mobile menu
navbar = navbar.replace(/px-6 py-4/g, 'px-4 py-3');

fs.writeFileSync('src/components/navbar.tsx', navbar, 'utf8');

let sidebar = fs.readFileSync('src/components/admin/Sidebar.tsx', 'utf8');
sidebar = sidebar.replace(/signOut\({ callbackUrl: window.location.origin }\)/g, 'signOut({ callbackUrl: "/" })');
fs.writeFileSync('src/components/admin/Sidebar.tsx', sidebar, 'utf8');

console.log("Fixed Navbar and Sidebar");
