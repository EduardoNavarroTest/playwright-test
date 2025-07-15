const API_URL = `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}`;

export const getRequirementsFromConfluence = async (pageId) => {
  const response = await fetch(`${API_URL}/api/confluence/get-requirements`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pageId })
  });

  if (!response.ok) {
    throw new Error('No se pudo obtener el contenido de Confluence');
  }

  const data = await response.json();
  return data.requirements || '';
};

export const getCriteriasFromConfluence = async (pageId) => {
  const response = await fetch(`${API_URL}/api/confluence/get-criterias`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pageId })
  });

  if (!response.ok) {
    throw new Error('No se pudo obtener los casos de prueba desde Confluence');
  }

  const data = await response.json();
  return data.criterias || '';
};


export const extractPageId = (url) => {
  try {
    const match = url.match(/\/pages\/(\d+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
};


export const exportToConfluence = async (link, rawHtmlContent) => {
  const pageId = extractPageId(link);
  if (!pageId) throw new Error("No se pudo extraer el ID de la página");

  // Solo envías el contenido puro
  const response = await fetch(`${API_URL}/api/confluence/export`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ pageId, data: rawHtmlContent })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Error al exportar a Confluence');
  }

  return await response.json();
};
