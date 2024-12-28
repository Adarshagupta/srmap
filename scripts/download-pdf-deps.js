const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const PDFJS_VERSION = '4.8.69';

// Create public directory if it doesn't exist
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR);
}

// Download PDF.js worker
const workerUrl = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.js`;
const workerPath = path.join(PUBLIC_DIR, 'pdf.worker.min.js');

console.log('Downloading PDF.js worker...');
https.get(workerUrl, (response) => {
  const file = fs.createWriteStream(workerPath);
  response.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('PDF.js worker downloaded successfully');
  });
}).on('error', (err) => {
  console.error('Error downloading PDF.js worker:', err);
  process.exit(1);
});

// Download and extract cmaps
const cmapsDir = path.join(PUBLIC_DIR, 'cmaps');
if (!fs.existsSync(cmapsDir)) {
  fs.mkdirSync(cmapsDir);
}

console.log('Downloading and extracting cmaps...');
try {
  execSync(`npm install --no-save pdfjs-dist@${PDFJS_VERSION}`);
  const cmapsPath = path.join(process.cwd(), 'node_modules/pdfjs-dist/cmaps');
  fs.cpSync(cmapsPath, cmapsDir, { recursive: true });
  console.log('Cmaps downloaded and extracted successfully');
} catch (err) {
  console.error('Error downloading cmaps:', err);
  process.exit(1);
} 