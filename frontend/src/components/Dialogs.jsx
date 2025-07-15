import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import ExportToJiraDialog from './ExportToJiraDialog.jsx';
import ExportToConfluenceDialog from './ExportToConfluenceDialog.jsx';

const Dialogs = ({
  formatError,
  onCloseFormatError,
  jiraOpen,
  onCloseJira,
  confluenceOpen,
  onCloseConfluence,
  onExport,
  jsonData,
  option,
  onUpdate,
  confluenceLink,
  updateInput,
}) => {
  return (
    <>
      {/* Error formato */}
      <Dialog
        open={formatError}
        onClose={onCloseFormatError}
        aria-labelledby="format-error-dialog-title"
      >
        <DialogTitle id="format-error-dialog-title">Respuesta inválida</DialogTitle>
        <DialogContent>
          <DialogContentText>
            El modelo de IA respondió con un formato inesperado. Por favor, intenta nuevamente o revisa el contenido ingresado.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseFormatError} color="primary" autoFocus>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Exportar a Jira */}
      <ExportToJiraDialog
        open={jiraOpen}
        onClose={onCloseJira}
        data={jsonData}
        type={option}
        onUpdate={onUpdate}
      />

      <ExportToConfluenceDialog
        open={confluenceOpen}
        onClose={onCloseConfluence}
        onExport={onExport}
        confluenceLink={confluenceLink}
        onLinkChange={(value) => updateInput('confluenceLink', value)}
      />

    </>
  );
};

export default Dialogs;
