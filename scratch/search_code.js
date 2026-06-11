const fs = require('fs');
const path = require('path');

const files = [
  'c:/Users/Naiko/.gemini/antigravity/scratch/victorious-network/src/main.js',
  'c:/Users/Naiko/.gemini/antigravity/scratch/victorious-network/src/style.css',
  'c:/Users/Naiko/.gemini/antigravity/scratch/victorious-network/index.html'
];

const keywords = ['clip', 'orbit', 'ring', 'mask', 'transform', 'opacity'];

files.forEach(file => {
  if (!fs.existsSync(file)) {
    console.log(`File not found: ${file}`);
    return;
  }
  const content = fs.readFileSync(file, 'utf8');
  console.log(`\n=== Matches in ${path.basename(file)} ===`);
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    keywords.forEach(keyword => {
      if (line.toLowerCase().includes(keyword.toLowerCase())) {
        console.log(`Line ${index + 1} (${keyword}): ${line.trim()}`);
      }
    });
  });
});
