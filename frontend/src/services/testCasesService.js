const API_URL = `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}`;

export const testCasesService = async (file, option, plainText = '') => {
  let response;

  if (file) {
    // Si hay archivo, usar FormData
    const formData = new FormData();
    formData.append('file', file);
    formData.append('option', option);

    response = await fetch(`${API_URL}/api/test-cases/generate`, {
      method: 'POST',
      body: formData,
    });
  } else {
    // Si no hay archivo, enviar texto plano como JSON
    response = await fetch(`${API_URL}/api/test-cases/generate-text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: plainText, option }),
    });
  }

  if (!response.ok) {
    throw new Error(`Error al procesar en el servidor: ${response.status}`);
  }

  return response.text();
};
