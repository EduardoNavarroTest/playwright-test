import React, { useState, useRef } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

import { useSnackbar } from '../hooks/useSnackbar.js';
import useDialogManager from '../hooks/useDialogManager.js';

import { testCasesService } from '../services/testCasesService.js';
import { limpiarJsonDeIA } from '../utils/jsonUtils.js';
import { getRequirementsFromConfluence, extractPageId, exportToConfluence, getCriteriasFromConfluence } from '../services/confluenceService.js';
import { exportToPDF, exportToWord } from '../utils/exportUtils.js';
import { deleteItem, deleteSubtask, addSubtask } from '../utils/jsonHandlers.js';

import AppAlert from '../components/AppAlert.jsx';
import FileInputSection from '../components/FileInputSection.jsx';
import OptionSelector from '../components/OptionSelector.jsx';
import JsonRenderer from '../components/JsonRenderer.jsx';
import ExportButtons from '../components/ExportButtons.jsx';
import Dialogs from '../components/Dialogs.jsx';

const TestCases = () => {
  const [inputState, setInputState] = useState({
    file: null,
    plainText: '',
    usePlainText: false,
    option: 'criterios',
    pendingOption: null,
    confluenceLink: '',
  });

  const updateInput = (field, value) => {
    setInputState((prev) => ({ ...prev, [field]: value }));
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  const { dialogs, openDialog, closeDialog } = useDialogManager();
  const { snackbar, showSnackbar, handleCloseSnackbar } = useSnackbar();

  const contentRef = useRef(null);

  const handleExportToConfluence = async (link) => {
    try {
      const htmlContent = contentRef.current?.innerHTML;
      await exportToConfluence(link, htmlContent);
      showSnackbar('Exportado exitosamente a Confluence', 'success');
    } catch (err) {
      showSnackbar('Error exportando a Confluence: ' + err.message, 'error');
    } finally {
      closeDialog('confluenceOpen');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputState.file && !inputState.plainText.trim()) {
      setError('Por favor selecciona un archivo o ingresa un texto');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let inputText = inputState.plainText.trim();
      let archivoParaEnviar = null;

      if (inputState.file) {
        if (inputState.file.name.endsWith('.docx')) {
          const { default: leerArchivoWord } = await import('../utils/parseWordToTextPlaneUtils.js');
          inputText = await leerArchivoWord(inputState.file);
        } else {
          archivoParaEnviar = inputState.file;
        }
      } else if (inputState.usePlainText) {
        const pageId = extractPageId(inputText);
        if (pageId) {
          if (inputState.option === 'criterios') {
            inputText = await getRequirementsFromConfluence(pageId);
          } else if (inputState.option === 'casos') {
            inputText = await getCriteriasFromConfluence(pageId);
          }
        }
      }


      const result = await testCasesService(archivoParaEnviar, inputState.option, inputText);
      const parsedJson = limpiarJsonDeIA(result);

      if (!parsedJson || !Array.isArray(parsedJson.criteria)) {
        openDialog('formatError');
        setJsonData(null);
        return;
      }

      setJsonData(parsedJson);
      closeDialog('formatError');
    } catch (err) {
      setError(err.message || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleLimpiar = () => {
    setInputState({
      file: null,
      plainText: '',
      usePlainText: false,
      option: 'criterios',
      pendingOption: null,
    });
    setError(null);
    setJsonData(null);
  };

  const handleEdit = () => { };
  const handleDelete = (index) => setJsonData(deleteItem(jsonData, index));
  const handleAdd = (index) => setJsonData(addSubtask(jsonData, index));
  const handleDeleteSubtask = (index, subIndex) => setJsonData(deleteSubtask(jsonData, index, subIndex));
  const handleUpdate = (updatedData) => setJsonData(updatedData);

  const handleOptionChange = (newOption) => {
    if (jsonData) {
      updateInput('pendingOption', newOption);
      openDialog('confirmChange');
    } else {
      updateInput('option', newOption);
    }
  };

  const handleConfirmChange = () => {
    setJsonData(null);
    updateInput('option', inputState.pendingOption);
    updateInput('pendingOption', null);
    closeDialog('confirmChange');
  };

  const handleCancelChange = () => {
    updateInput('pendingOption', null);
    closeDialog('confirmChange');
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 5, p: 3 }}>
      <Typography variant="h4" color="primary" align="center" gutterBottom>
        Generador de Documentación con IA
      </Typography>

      <form onSubmit={handleSubmit}>
        <FileInputSection
          file={inputState.file}
          plainText={inputState.plainText}
          usePlainText={inputState.usePlainText}
          onFileChange={(e) => updateInput('file', e.target.files[0])}
          onPlainTextChange={(e) => updateInput('plainText', e.target.value)}
          onTogglePlainText={(e) => {
            updateInput('usePlainText', e.target.checked);
            if (e.target.checked) updateInput('file', null);
            else updateInput('plainText', '');
          }}
        />

        <OptionSelector
          option={inputState.option}
          onOptionChange={handleOptionChange}
          confirmOpen={dialogs.confirmChange}
          onConfirmChange={handleConfirmChange}
          onCancelChange={handleCancelChange}
        />

        <Box display="flex" gap={2} mt={2}>
          <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Procesar'}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<ClearIcon />}
            onClick={handleLimpiar}
            fullWidth
          >
            Limpiar
          </Button>
        </Box>
      </form>

      {error && (
        <Typography color="error" mt={2}>
          {error}
        </Typography>
      )}

      {jsonData && (
        <Box mt={4}>
          <Box ref={contentRef}>
            <JsonRenderer
              option={inputState.option}
              jsonData={jsonData}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAdd={handleAdd}
              onUpdate={handleUpdate}
              onDeleteSubtask={handleDeleteSubtask}
            />
          </Box>

          <ExportButtons
            onExportPdf={() => {
              if (!jsonData) return showSnackbar("No hay datos para exportar", "warning");
              exportToPDF(jsonData, inputState.option);
            }}
            onExportWord={() => {
              if (!jsonData) return showSnackbar("No hay datos para exportar", "warning");
              exportToWord(jsonData, inputState.option);
            }}
            onOpenJira={() => openDialog('jiraOpen')}
            onExportToConfluence={() => {
              let link = '';

              if (inputState.confluenceLink?.startsWith('http')) {
                link = inputState.confluenceLink;
              } else if (inputState.plainText?.startsWith('http')) {
                link = inputState.plainText;
              }

              updateInput('confluenceLink', link);
              openDialog('confluenceOpen');
            }}


          />

        </Box>
      )}

      <Dialogs
        formatError={dialogs.formatError}
        onCloseFormatError={() => closeDialog('formatError')}
        jiraOpen={dialogs.jiraOpen}
        onCloseJira={() => closeDialog('jiraOpen')}
        confluenceOpen={dialogs.confluenceOpen}
        onCloseConfluence={() => closeDialog('confluenceOpen')}
        onExport={handleExportToConfluence}
        confluenceLink={inputState.confluenceLink}
        jsonData={jsonData}
        option={inputState.option}
        contentRef={contentRef}
        snackbar={snackbar}
        showSnackbar={showSnackbar}
        handleCloseSnackbar={handleCloseSnackbar}
        onUpdate={handleUpdate}
        updateInput={updateInput}
      />


      <AppAlert
        open={snackbar.open}
        onClose={handleCloseSnackbar}
        severity={snackbar.severity}
        message={snackbar.message}
      />
    </Box>
  );
};

export default TestCases;
