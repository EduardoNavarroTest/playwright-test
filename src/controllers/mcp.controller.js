import { exec, spawn } from 'child_process';
import testRegistry from '../services/testRegistry.service.js';
import { findBestMatchingTest, detectarIntencion, responseChat, procesarConsulta, formatearResultadoTest } from '../services/gemini2.service.js';

async function listTestsHandler(req, res) {
    const { id } = req.body;
    const tests = testRegistry.listTests();
    res.json({ jsonrpc: '2.0', id, result: tests });
}

async function findMatchingTestHandler(req, res) {
    const { id, params } = req.body;
    const prompt = params?.prompt;
    if (!prompt) return res.status(400).json({ jsonrpc: '2.0', id, error: { code: -32602, message: 'Falta el parámetro "prompt".' } });

    try {
        const bestTitle = await findBestMatchingTest(prompt, testRegistry.listTests());
        const found = testRegistry.listTests().find(t => t.title === bestTitle);

        if (!found) return res.status(404).json({ jsonrpc: '2.0', id, error: { code: -32001, message: 'No se encontró coincidencia exacta' } });

        res.json({ jsonrpc: '2.0', id, result: found });
    } catch (error) {
        res.status(500).json({ jsonrpc: '2.0', id, error: { code: -32000, message: error.message } });
    }
}

async function runTestHandler(req, res) {
    const { id, params } = req.body;
    const { file, title } = params || {};
    if (!file || !title) return res.status(400).json({ jsonrpc: '2.0', id, error: { code: -32602, message: 'Parámetros "file" y "title" requeridos' } });

    exec(`npx playwright test ${file} -g "${title}"`, (err, stdout, stderr) => {
        res.json({
            jsonrpc: '2.0',
            id,
            result: {
                success: !err,
                stdout,
                stderr,
                code: err?.code ?? 0,
            },
        });
    });
}

async function executePromptHandler(req, res) {
    const { id, params } = req.body;
    const prompt = params?.prompt;
    if (!prompt) return res.status(400).json({ jsonrpc: '2.0', id, error: { code: -32602, message: 'Falta el parámetro "prompt".' } });

    try {
        const bestTitle = await findBestMatchingTest(prompt, testRegistry.listTests());
        const found = testRegistry.listTests().find(t => t.title === bestTitle);

        if (!found) return res.status(404).json({ jsonrpc: '2.0', id, error: { code: -32001, message: 'No se encontró un test coincidente.' } });

        exec(`npx playwright test ${found.file} -g "${found.title}"`, (err, stdout, stderr) => {
            res.json({
                jsonrpc: '2.0',
                id,
                result: {
                    success: !err,
                    file: found.file,
                    title: found.title,
                    stdout,
                    stderr,
                    code: err?.code ?? 0,
                },
            });
        });
    } catch (error) {
        res.status(500).json({ jsonrpc: '2.0', id, error: { code: -32000, message: error.message } });
    }
}

async function handlePrompt(req, res) {
    const { id, params } = req.body;
    const prompt = params?.prompt;
    if (!prompt) {
        return res.status(400).json({
            jsonrpc: '2.0',
            id,
            error: { code: -32602, message: 'Falta el parámetro "prompt".' }
        });
    }

    try {
        const lista = testRegistry.listTests();
        const respuestaIA = await procesarConsulta(prompt, lista);

        const found = lista.find(t => t.title === respuestaIA);

        if (found) {
            const child = spawn('npx', [
                'playwright',
                'test',
                found.file,
                '-g',
                `"${found.title}"`,
                '--reporter=list'
            ], { shell: true });

            console.log(`[EXEC] Ejecutando: npx playwright test ${found.file} -g "${found.title}"`);

            let stdout = '';
            let stderr = '';

            child.stdout.on('data', data => {
                const chunk = data.toString();
                stdout += chunk;
                console.log('[STDOUT]', chunk);
            });

            child.stderr.on('data', data => {
                const chunk = data.toString();
                stderr += chunk;
                console.error('[STDERR]', chunk);
            });

            child.on('error', err => {
                console.error('[ERROR]', err);
                return res.status(500).json({
                    jsonrpc: '2.0',
                    id,
                    error: { code: -32002, message: 'Error al ejecutar el proceso: ' + err.message }
                });
            });

            child.on('close', async code => {
                console.log(`[CLOSE] Código de salida: ${code}`);

                const raw = {
                    success: code === 0,
                    file: found.file,
                    title: found.title,
                    stdout,
                    stderr,
                    code,
                    message: code === 0
                        ? 'Prueba ejecutada correctamente.'
                        : 'La prueba falló.'
                };
                

                try {
                    const mensajeIA = await responseChat(`La prueba automatizada "${found.title}" en el archivo ${found.file} finalizó con el siguiente resultado:\n\n${stdout || stderr}\n\nResume este resultado de forma clara para que un usuario no técnico entienda si fue exitosa o falló, y qué pasó.`);

                    return res.json({
                        jsonrpc: '2.0',
                        id,
                        resultComplete: {
                            ...raw,
                            mensajeIA
                        },
                        result: mensajeIA 
                    });
                } catch (error) {
                    console.error('[IA-FORMAT ERROR]', error.message);

                    // Si la IA falla, devolver al menos el resultado sin formatear
                    return res.json({
                        jsonrpc: '2.0',
                        id,
                        result: {
                            ...raw,
                            mensajeIA: raw.message + ' (No se pudo generar una respuesta en lenguaje natural)'
                        }
                    });
                }
            });


        } else {
            // No era un título de prueba, entonces es una respuesta en lenguaje natural
            return res.json({ jsonrpc: '2.0', id, result: respuestaIA });
        }

    } catch (error) {
        return res.status(500).json({
            jsonrpc: '2.0',
            id,
            error: { code: -32000, message: error.message }
        });
    }
}


export async function handleMcp(req, res) {
    const { method } = req.body;

    switch (method) {
        case 'listTests':
            return listTestsHandler(req, res);
        case 'findMatchingTest':
            return findMatchingTestHandler(req, res);
        case 'runTest':
            return runTestHandler(req, res);
        case 'executePrompt':
            return executePromptHandler(req, res);
        case 'handlePrompt':
            return handlePrompt(req, res);
        default:
            return res.status(404).json({ jsonrpc: '2.0', id: req.body.id, error: { code: -32601, message: 'Método no encontrado' } });
    }
}
