const fs = require('fs');

let navbar = fs.readFileSync('src/components/navbar.tsx', 'utf8');
navbar = navbar.replace(/signOut\(\{ callbackUrl: "\/" \}\)/g, 'signOut({ redirect: false }).then(() => { window.location.href = "/" })');
fs.writeFileSync('src/components/navbar.tsx', navbar, 'utf8');

let sidebar = fs.readFileSync('src/components/admin/Sidebar.tsx', 'utf8');
sidebar = sidebar.replace(/signOut\(\{ callbackUrl: "\/" \}\)/g, 'signOut({ redirect: false }).then(() => { window.location.href = "/" })');

// Replace ShieldAlert in Sidebar with Logo
sidebar = sidebar.replace(/import \{.*?\} from "lucide-react";/, (match) => match + '\nimport Image from "next/image";');
// Desktop logo
sidebar = sidebar.replace(
  /<ShieldAlert className="w-8 h-8 text-\[#00D4FF\] shrink-0" \/>/,
  `<Image src="/logo.png" alt="16London" width={100} height={30} className="object-contain" />`
);
// Mobile logo
sidebar = sidebar.replace(
  /<ShieldAlert className="w-6 h-6 text-\[#00D4FF\]" \/>/,
  `<Image src="/logo.png" alt="16London" width={80} height={24} className="object-contain" />`
);

fs.writeFileSync('src/components/admin/Sidebar.tsx', sidebar, 'utf8');
console.log("Fixed Navbar and Sidebar");
