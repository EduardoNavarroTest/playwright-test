import dotenv from 'dotenv';
dotenv.config();

const { GEMINI_API_KEY, GEMINI_API_URL } = process.env;

// Utilidad para hacer fetch a Gemini
async function callGeminiAPI(contents) {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
    });

    const data = await response.json();

    if (!response.ok) {
        const msg = data?.error?.message || 'Error desconocido en Gemini';
        console.error(data);
        throw new Error(msg);
    }

    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
}

// ----------------------------
// LISTA DE TEST MÁS SIMILAR
// ----------------------------
export async function findBestMatchingTest(prompt, testRegistry) {
    const testList = testRegistry
        .map(t => `- "${t.title}" (archivo: ${t.file})`)
        .join('\n');

    const fullPrompt = `
Tengo esta lista de tests automatizados:

${testList}

Quiero ejecutar un test basado en esta descripción del usuario:

"${prompt}"

Devuélveme únicamente el título del test que más se le parece. No expliques nada.
`;

    const contents = [
        {
            role: 'user',
            parts: [{ text: fullPrompt }]
        }
    ];

    const response = await callGeminiAPI(contents);
    return response.replace(/^"+|"+$/g, ''); // eliminar comillas si las devuelve
}

// ----------------------------
// DETECTAR INTENCIÓN
// ----------------------------
export async function detectarIntencion(textoUsuario) {
    const prompt = `
Dada la siguiente consulta del usuario:

"${textoUsuario}"

Responde solo con una palabra:  
- "LISTAR" si el usuario quiere obtener un listado de pruebas automatizadas.  
- "EJECUTAR" si el usuario quiere ejecutar una prueba.  
- "OTRO" si la consulta no es ninguna de las anteriores.
`;

    const contents = [
        {
            role: 'user',
            parts: [{ text: prompt }]
        }
    ];

    const response = await callGeminiAPI(contents);
    return response.toUpperCase();
}

// ----------------------------
// RESPUESTA GENERAL CHAT
// ----------------------------
export async function responseChat(prompt) {
    const contents = [
        {
            role: 'user',
            parts: [
                {
                    text: `Eres un asistente experto en automatización de pruebas de software con Playwright.
Tu función es ayudar al usuario a entender errores, buenas prácticas de testing, y responder preguntas técnicas.\n\n${prompt}`
                }
            ]
        }
    ];

    return await callGeminiAPI(contents);
}

export async function procesarConsulta(promptUsuario, listaDeTests) {
    const listado = listaDeTests.map(t => `- ${t.title} (archivo: ${t.file})`).join('\n');

    const prompt = `
Eres un asistente experto en pruebas automatizadas de software.

Lista de pruebas disponibles:
${listado}

Consulta del usuario:
"${promptUsuario}"

Tu tarea:
1. Si el usuario quiere listar los tests, responde con un mensaje amigable que los describa.
2. Si quiere ejecutar un test, responde únicamente con el nombre exacto del test (sin explicaciones).
3. Si la consulta no es sobre tests, responde normalmente como un asistente técnico de testing.

No expliques lo que hiciste, simplemente responde con lo solicitado.
`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [
                {
                    role: 'user',
                    parts: [{ text: prompt }]
                }
            ]
        })
    });

    const data = await response.json();
    if (!response.ok) {
        const msg = data?.error?.message || 'Error desconocido desde Gemini';
        throw new Error(msg);
    }

    return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'Sin respuesta.';
}

export async function formatearResultadoTest({ title, success, stdout }) {
    const prompt = `
Eres un asistente experto en pruebas automatizadas de software.

Resultado técnico de la prueba "${title}":
¿La prueba fue exitosa?: ${success ? 'Sí' : 'No'}

Salida técnica del sistema:
${stdout}

Tu tarea:
Genera un resumen claro y profesional en lenguaje natural para el usuario. Menciona si la prueba pasó o falló, y si falló, explica brevemente el posible motivo (basado en la salida).
`;

    const response = await fetch(`${process.env.GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [
                {
                    role: 'user',
                    parts: [{ text: prompt }]
                }
            ]
        })
    });

    const data = await response.json();

    if (!response.ok) {
        const msg = data?.error?.message || 'Error desconocido al generar resumen del resultado.';
        throw new Error(msg);
    }

    return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'No se pudo generar el resumen.';
}
