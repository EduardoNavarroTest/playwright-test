// gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function findBestMatchingTest(prompt, tests) {
  const testTitles = tests.map(t => `- ${t.title}`).join('\n');

  const msg = `
Toma esta lista de títulos de pruebas automatizadas:

${testTitles}

¿Cuál test es el más relevante para este requerimiento del usuario?: "${prompt}"

Devuélveme únicamente el título exacto del test más apropiado.
`;

  const result = await model.generateContent(msg);
  const response = await result.response;
  const text = response.text();

  // Limpiamos posibles formatos como "**" o comillas
  return text.replace(/["*`]/g, '').trim();
}
