const fs = require('fs');

const cssPath = 'c:/Users/Naiko/.gemini/antigravity/scratch/victorious-network/src/style.css';

if (!fs.existsSync(cssPath)) {
  console.error('File not found: ' + cssPath);
  process.exit(1);
}

let css = fs.readFileSync(cssPath, 'utf8');

// 1. Remove background-attachment:fixed from body styling on line 1
const originalBodyStyle = ';background-attachment:fixed}';
if (css.includes(originalBodyStyle)) {
  css = css.replace(originalBodyStyle, '}');
  console.log('Removed background-attachment:fixed from body styling.');
} else {
  console.log('Could not find body style background-attachment rule. Checking alternative strings...');
  css = css.replace('background-attachment:fixed', '');
}

// 2. Revert #planet-orbit-chapter background to transparent
const originalChapterBg = `  background: linear-gradient(to bottom, 
    var(--background) 0%, 
    transparent 50%, 
    var(--background) 100%
  );`;
const targetChapterBg = '  background: transparent; /* Seamless blending with the page body background */';

if (css.includes(originalChapterBg)) {
  css = css.replace(originalChapterBg, targetChapterBg);
  console.log('Reverted #planet-orbit-chapter background to transparent.');
} else {
  // Let's try matching with single line / whitespace variations
  css = css.replace(/background:\s*linear-gradient\([\s\S]*?var\(--background\)\s*100%\s*\);/, targetChapterBg);
  console.log('Fuzzy matched and updated #planet-orbit-chapter background.');
}

// 3. Revert .orbit-mobile-view background to background-color: rgba(1, 7, 23, 0.4)
const originalMobileBg = `  background: linear-gradient(to bottom, 
    var(--background) 0%, 
    rgba(1, 7, 23, 0.4) 50%, 
    var(--background) 100%
  );`;
const targetMobileBg = '  background-color: rgba(1, 7, 23, 0.4);';

if (css.includes(originalMobileBg)) {
  css = css.replace(originalMobileBg, targetMobileBg);
  console.log('Reverted .orbit-mobile-view background.');
} else {
  css = css.replace(/background:\s*linear-gradient\([\s\S]*?rgba\(1,\s*7,\s*23,\s*0\.4\)[\s\S]*?\);/, targetMobileBg);
  console.log('Fuzzy matched and updated .orbit-mobile-view background.');
}

fs.writeFileSync(cssPath, css, 'utf8');
console.log('Successfully wrote updates to style.css.');
