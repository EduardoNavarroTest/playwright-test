import mammoth from "mammoth";

const leerArchivoWord = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const { value } = await mammoth.extractRawText({ arrayBuffer });
    return value;
  } catch (err) {
    throw new Error("No se pudo leer el archivo Word");
  }
};

export default leerArchivoWord;