const MCP_URL = 'http://localhost:4000/mcp';

async function findAndRun(prompt) {
    // 1. Buscar el test más parecido
    const findRes = await fetch(MCP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'findMatchingTest',
            params: { prompt }
        })
    });

    const findData = await findRes.json();

    if (!findData.result) {
        console.error('❌ No se encontró un test que coincida con el prompt.');
        console.error('🧾 Respuesta del servidor:', JSON.stringify(findData, null, 2));
        return;
    }

    const { file, title } = findData.result;
    console.log(`🧠 Test seleccionado: ${title} (${file})`);

    // 2. Ejecutar el test
    const runRes = await fetch(MCP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: 2,
            method: 'runTest',
            params: { file, title }
        })
    });

    const runData = await runRes.json();
    const result = runData.result;

    console.log('🎯 Resultado:', result.success ? '✅ Éxito' : '❌ Fallo');
    console.log('📤 STDOUT:\n', result.stdout);
    console.log('📥 STDERR:\n', result.stderr);
}

if (!process.argv[2]) {
    console.error('❗ Debes ingresar un prompt como argumento.');
    process.exit(1);
}
const prompt = process.argv[2];

findAndRun(prompt);
