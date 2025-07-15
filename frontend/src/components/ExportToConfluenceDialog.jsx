import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  CircularProgress
} from '@mui/material';

import AppAlert from './AppAlert.jsx';

const ExportToConfluenceDialog = ({ open, onClose, onExport, confluenceLink, onLinkChange }) => {
  const [link, setLink] = useState(confluenceLink || '');
  const [exporting, setExporting] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (open) {
      setLink(confluenceLink || '');
    }
  }, [open, confluenceLink]);


  const handleExportClick = async () => {
    if (!link.trim()) return;

    setExporting(true);
    try {
      await onExport(link.trim());
      setSuccess(true);
    } catch (err) {
      setSuccess(false);
    } finally {
      setExporting(false);
    }
  };

  const handleCloseSnackbar = () => setSuccess(null);

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Exportar a Confluence</DialogTitle>
        <DialogContent>
          <Typography mb={2}>
            Ingresa el enlace de la página de Confluence donde se exportará la documentación generada.
          </Typography>

          <TextField
            label="Enlace de Confluence"
            variant="outlined"
            fullWidth
            margin="normal"
            placeholder="https://puertodecartagena.atlassian.net/wiki/..."
            value={link}
            onChange={(e) => {
              const newLink = e.target.value;
              setLink(newLink);
              onLinkChange(newLink); // Notifica al componente padre
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            onClick={handleExportClick}
            variant="contained"
            color="primary"
            disabled={!link.trim() || exporting}
            startIcon={exporting ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {exporting ? 'Exportando...' : 'Exportar'}
          </Button>
        </DialogActions>
      </Dialog>

      <AppAlert
        open={success !== null}
        onClose={handleCloseSnackbar}
        severity={success ? 'success' : 'error'}
        message={
          success
            ? 'Exportación exitosa a Confluence.'
            : 'Error al exportar a Confluence.'
        }
      />
    </>
  );
};

export default ExportToConfluenceDialog;
