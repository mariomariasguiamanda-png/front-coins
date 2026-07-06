const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '../front/src/pages/adm');

function refactorFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Check if file uses AdmBackButton
  if (!content.includes('AdmBackButton')) return;

  // Extract AdmBackButton line
  // Example: <AdmBackButton href="/adm/compras" className="no-underline" />
  const btnRegex = /<AdmBackButton[^>]+href=\{?[^>]+>.*?<\/AdmBackButton>|<AdmBackButton[^>]+href=\{?[^>]+\/>/s;
  const match = content.match(btnRegex);
  if (!match) return;

  const btnStr = match[0].trim();

  // If the button is already near the h1, skip (naive check)
  if (content.includes(`gap-3\">\n                ${btnStr}`)) return;
  if (content.includes(`gap-3\">\n              ${btnStr}`)) return;

  // Remove the old button
  content = content.replace(match[0], '');

  // Find h1
  const h1Regex = /<h1 className="text-3xl font-bold text-gray-900">([^<]+)<\/h1>/;
  const h1Match = content.match(h1Regex);

  if (h1Match) {
    const replacement = `<div className="flex items-center gap-3">
              ${btnStr.replace(/className="[^"]*"/, '')}
              <h1 className="text-3xl font-bold text-gray-900">${h1Match[1]}</h1>
            </div>`;
    content = content.replace(h1Match[0], replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Refactored ${path.basename(filePath)}`);
  }
}

function traverse(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      refactorFile(fullPath);
    }
  }
}

traverse(pagesDir);
console.log('Done');
