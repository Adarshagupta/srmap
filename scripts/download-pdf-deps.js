const https = require('https');
const fs = require('fs');
const path = require('path');

const PDF_VERSION = '3.11.174';  // Match the version from pdfjs-dist
const files = [
  {
    url: `https://unpkg.com/pdfjs-dist@${PDF_VERSION}/build/pdf.worker.min.js`,
    dest: '../public/pdf.worker.min.js'
  }
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, response => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${dest}`);
        resolve();
      });
    }).on('error', err => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function downloadDeps() {
  try {
    for (const file of files) {
      const destPath = path.join(__dirname, file.dest);
      const dir = path.dirname(destPath);
      
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      await downloadFile(file.url, destPath);
    }
    console.log('All PDF.js dependencies downloaded successfully!');
  } catch (error) {
    console.error('Error downloading dependencies:', error);
    process.exit(1);
  }
}

downloadDeps(); 