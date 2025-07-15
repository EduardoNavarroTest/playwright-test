import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function findBestMatchingTest(prompt, testRegistry) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const testList = testRegistry
        .map(t => `- "${t.title}" (archivo: ${t.file})`)
        .join("\n");

    const fullPrompt = `
Tengo esta lista de tests automatizados:

${testList}

Quiero ejecutar un test basado en esta descripción del usuario:

"${prompt}"

Devuélveme únicamente el título del test que más se le parece. No expliques nada.
`;

    const result = await model.generateContent(fullPrompt);
    const text = result.response.text().trim();

    return text.replace(/^"+|"+$/g, ''); // elimina comillas si Gemini devuelve el título entrecomillado
}

// Nueva función para detectar intención
export async function detectarIntencion(textoUsuario) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
Dada la siguiente consulta del usuario:

"${textoUsuario}"

Responde solo con una palabra:  
- "LISTAR" si el usuario quiere obtener un listado de pruebas automatizadas.  
- "EJECUTAR" si el usuario quiere ejecutar una prueba.  
- "OTRO" si la consulta no es ninguna de las anteriores.
`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim().toUpperCase();
}

export async function responseChat(prompt) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent({
        contents: [
            {
                role: 'user',
                parts: [
                    {
                        text: `Eres un asistente experto en automatización de pruebas de software con Playwright.
Tu función es ayudar al usuario a entender errores, buenas prácticas de testing, y responder preguntas técnicas.\n\n${prompt}`
                    }
                ]
            }
        ]
    });

    return result.response.text().trim();
}
