import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { findBestMatchingTest } from './gemini.service.js';
import { exec } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TESTS_DIR = path.join(__dirname, '../../tests');

let testEntries = [];

function loadTestRegistry() {
  testEntries = [];

  try {
    fs.readdirSync(TESTS_DIR)
      .filter(file => file.endsWith('.spec.ts') || file.endsWith('.test.ts'))
      .forEach(file => {
        const content = fs.readFileSync(path.join(TESTS_DIR, file), 'utf-8');
        const testRegex = /test\s*\(\s*['"`](.*?)['"`]/g;
        let match;
        while ((match = testRegex.exec(content)) !== null) {
          const testTitle = match[1];
          testEntries.push({
            id: `${file}::${testTitle}`,
            file: `tests/${file}`,
            title: testTitle
          });
        }
      });

  } catch (error) {
    console.error('❌ Error cargando los tests:', error.message);
  }
}

// Se carga al iniciar
loadTestRegistry();

export function listTests() {
  return testEntries;
}

export async function findMatchingTest(prompt) {
  const bestTitle = await findBestMatchingTest(prompt, testEntries);
  const match = testEntries.find(t => t.title === bestTitle);

  if (!match) {
    throw new Error('No se encontró coincidencia exacta con el título.');
  }

  return match;
}

export function runTest(file, title) {
  return new Promise((resolve) => {
    exec(`npx playwright test ${file} -g "${title}"`, (err, stdout, stderr) => {
      resolve({
        success: !err,
        stdout,
        stderr,
        code: err?.code ?? 0
      });
    });
  });
}

export default {
  listTests,
  findMatchingTest,
  runTest
};
