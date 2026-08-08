const fs = require('fs');

let layout = fs.readFileSync('src/app/layout.tsx', 'utf8');
// Replace corrupted characters with a clean dash
// The corrupted string usually looks like "16London Algo ?" or "16London Algo â€“"
layout = layout.replace(/16London Algo\s*[^\sA-Za-z0-9]+\s*Institutional Trading Indicators/g, '16London Algo - Institutional Trading Indicators');
fs.writeFileSync('src/app/layout.tsx', layout, 'utf8');

let algo = fs.readFileSync('src/components/algo-in-action.tsx', 'utf8');
algo = algo.replace(/16LONDON ALGO [^\sA-Za-z0-9]+ TESTIMONIAL VIEW/g, '16LONDON ALGO - TESTIMONIAL VIEW');
fs.writeFileSync('src/components/algo-in-action.tsx', algo, 'utf8');

console.log("Fixed encoding issues");
