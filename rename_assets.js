const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public/images/new_assets');

if (fs.existsSync(dir)) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    if (file.includes(' ')) {
      const newName = file.replace(/\s+/g, '-').toLowerCase();
      fs.renameSync(path.join(dir, file), path.join(dir, newName));
      console.log(`Renamed: ${file} -> ${newName}`);
    }
  });
}
