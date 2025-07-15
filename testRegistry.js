// testRegistry.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TESTS_DIR = path.join(__dirname, 'tests');

const testEntries = [];

fs.readdirSync(TESTS_DIR)
  .filter(file => file.endsWith('.spec.ts') || file.endsWith('.test.ts'))
  .forEach(file => {
    const filePath = path.join(TESTS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    const testRegex = /test\s*\(\s*['"`](.*?)['"`]/g;
    let match;
    while ((match = testRegex.exec(content)) !== null) {
      const testTitle = match[1];
      testEntries.push({
        id: `${file.replace(/\.(spec|test)\.ts$/, '')}::${testTitle}`,
        name: testTitle,
        file: `tests/${file}`,
        title: testTitle
      });
    }
  });
  
export default testEntries;
