const API_URL = `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}`;

export const fetchJiraProjects = async () => {
  try {
    const response = await fetch(`${API_URL}/api/jira/jira-projects`);
    if (!response.ok) {
      throw new Error('Error al obtener proyectos');
    }
    return await response.json();
  } catch (error) {
    console.error('Error al obtener proyectos de Jira:', error);
    throw error;
  }
};

export const exportIssuesToJira = async (issues) => {
  try {
    const response = await fetch(`${API_URL}/api/jira/export-issues`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ issues })
    });

    if (!response.ok) {
      throw new Error('Error al exportar issues');
    }

    const data = await response.json();

    // Asegura que siempre se devuelva un array, aunque esté vacío
    return Array.isArray(data.result) ? data.result : [];
  } catch (error) {
    console.error('Error al exportar issues a Jira:', error);
    return []; // Devuelve array vacío para evitar errores en el frontend
  }
};
