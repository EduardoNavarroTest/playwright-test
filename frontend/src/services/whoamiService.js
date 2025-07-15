const API_URL = `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}`;

export const getUserLogged = async () => {
    const response = await fetch(`${API_URL}/api/whoami/user`);
    const data = await response.json();

    if (!response.ok) {
        console.error("Error al obtener usuario:", data);
        throw new Error('Error al obtener usuario');
    }
    return data;
};