const API_URL = `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}`;

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  await fetch(`${API_URL}/api/files/upload`, {
    method: 'POST',
    body: formData,
  });
};

export const getUploadedFiles = async () => {
  const res = await fetch(`${API_URL}/api/files`);
  if (!res.ok) throw new Error('Error fetching files');
  return await res.json();
};

export const deleteFile = async (filename) => {
  await fetch(`${API_URL}/api/files/${filename}`, {
    method: 'DELETE',
  });
};
