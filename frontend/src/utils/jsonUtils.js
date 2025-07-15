const limpiarJsonDeIA = (texto) => {
    if (!texto) return null;
  
    try {
      // Elimina delimitadores de bloque de código
      let limpio = texto
        .replace(/^"```json\\n/, '')
        .replace(/\\n```"$/, '')
        .replace(/^```json/, '')
        .replace(/```$/, '')
        .trim();
  
      // Si aún está entre comillas, parsea una vez más
      if (limpio.startsWith('"') && limpio.endsWith('"')) {
        limpio = JSON.parse(limpio); // quita el string externo
      }
  
      // Reemplaza secuencias de escape
      limpio = limpio.replace(/\\"/g, '"').replace(/\\n/g, '\n');  
      return JSON.parse(limpio);
    } catch (error) {
      console.error('Error al limpiar el JSON de la IA:', error);
      return null;
    }
  };
  
  
export { limpiarJsonDeIA };  