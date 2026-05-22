const fs = require('fs');
const path = require('path');

const nativePath = path.join(__dirname, '..', 'node_modules', 'rollup', 'dist', 'native.js');
const fallback = `// Patched by patch-rollup-native.js
try {
  module.exports = require('./rollup.js');
} catch (e) {
  // fallback empty export
  module.exports = {};
}
`;

try {
  if (fs.existsSync(nativePath)) {
    fs.writeFileSync(nativePath, fallback, 'utf8');
    console.log('✅ Patched rollup native.js to use JS fallback');
  } else {
    console.log('ℹ️ rollup native.js not present, nothing to patch');
  }
} catch (err) {
  console.error('❌ Failed to patch rollup native.js:', err.message);
  process.exit(1);
}
