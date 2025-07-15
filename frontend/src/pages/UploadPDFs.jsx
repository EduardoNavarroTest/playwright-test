import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, CircularProgress, Paper, List, ListItem,
  ListItemIcon, ListItemText, IconButton, Divider
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';

import { uploadFile, getUploadedFiles, deleteFile } from '../services/pdfService';
const API_URL = `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}`;


const UploadPDFs = () => {
  const [file, setFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState(null);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const files = await getUploadedFiles();
      setUploadedFiles(files);
      setError(null);
    } catch {
      setError('Error al obtener los archivos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleUpload = async () => {
    if (!file) {
      setError('Selecciona un archivo primero');
      return;
    }

    setUploading(true);
    try {
      await uploadFile(file);
      setFile(null);
      await loadFiles();
      setError(null);
    } catch {
      setError('Error al subir el archivo');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (filename) => {
    if (!window.confirm(`¿Eliminar el archivo "${filename}"?`)) return;
    setDeleting(filename);
    try {
      await deleteFile(filename);
      await loadFiles();
    } catch {
      setError('Error al eliminar el archivo');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 5, p: 3 }}>
      <Typography variant="h4" color="primary" align="center" gutterBottom>
        Gestión de Archivos PDF
      </Typography>

      <Box mt={3}>
        <Button variant="outlined" component="label" startIcon={<UploadFileIcon />}>
          Seleccionar archivo PDF
          <input
            type="file"
            hidden
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </Button>
        {file && (
          <Typography variant="body2" mt={1}>
            {file.name}
          </Typography>
        )}
      </Box>

      <Box display="flex" gap={2} mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={uploading}
          fullWidth
        >
          {uploading ? <CircularProgress size={24} color="inherit" /> : 'Subir PDF'}
        </Button>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={loadFiles}
          fullWidth
        >
          Actualizar lista
        </Button>
      </Box>

      {error && (
        <Typography color="error" mt={2}>
          {error}
        </Typography>
      )}

      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Archivos almacenados en el servidor
        </Typography>
        <Paper variant="outlined" sx={{ maxHeight: 300, overflow: 'auto', backgroundColor: '#f9f9f9' }}>
          {loading ? (
            <Box display="flex" justifyContent="center" p={2}>
              <CircularProgress />
            </Box>
          ) : (
            <List dense>
              {uploadedFiles.length === 0 ? (
                <Typography variant="body2" p={2}>No hay archivos PDF aún.</Typography>
              ) : (
                uploadedFiles.map((filename, index) => (
                  <React.Fragment key={index}>
                    <ListItem
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={(e) => {
                            e.stopPropagation(); // evita que se dispare el evento del ListItem
                            handleDelete(filename);
                          }}
                          disabled={deleting === filename}
                        >
                          {deleting === filename ? (
                            <CircularProgress size={20} />
                          ) : (
                            <DeleteIcon color="error" />
                          )}
                        </IconButton>
                      }
                      button
                      onClick={() => window.open(`${API_URL}/uploads/${filename}`, '_blank')}
                    >

                      <ListItemIcon>
                        <PictureAsPdfIcon color="error" />
                      </ListItemIcon>
                      <ListItemText primary={filename} />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))
              )}
            </List>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default UploadPDFs;
