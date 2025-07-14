import express from 'express';
import testRegistry from './testRegistry.js';
import { exec } from 'child_process';
import { findBestMatchingTest } from './gemini.js';

const app = express();
app.use(express.json());

app.post('/mcp', async (req, res) => {
  const { jsonrpc, method, params, id } = req.body;

  try {
    if (method === 'findMatchingTest') {
      const prompt = params?.prompt;
      if (!prompt) throw new Error('Prompt faltante');

      const bestTitle = await findBestMatchingTest(prompt, testRegistry);
      const found = testRegistry.find(t => t.title === bestTitle);

      if (!found) throw new Error('No se encontró coincidencia exacta');

      return res.json({ jsonrpc: '2.0', id, result: found });
    }

    if (method === 'runTest') {
      const { file, title } = params;
      if (!file || !title) throw new Error('Parámetros "file" y "title" requeridos');

      exec(`npx playwright test ${file} -g "${title}"`, (err, stdout, stderr) => {
        res.json({
          jsonrpc: '2.0',
          id,
          result: {
            success: !err,
            stdout,
            stderr,
            code: err?.code ?? 0
          }
        });
      });
    }

    if (method === 'listTests') {
      return res.json({ jsonrpc: '2.0', id, result: testRegistry });
    }

    res.status(404).json({ jsonrpc: '2.0', id, error: { code: -32601, message: 'Método no encontrado' } });
  } catch (error) {
    res.status(500).json({ jsonrpc: '2.0', id, error: { code: -32000, message: error.message } });
  }
});

app.listen(4000, () => {
  console.log('🚀 MCP + Gemini escuchando en http://localhost:4000');
});
