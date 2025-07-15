import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Typography, Autocomplete, CircularProgress
} from '@mui/material';

import { fetchJiraProjects, exportIssuesToJira } from '../services/jiraService.js';
import AppAlert from './AppAlert.jsx';

const ExportToJiraDialog = ({ open, onClose, data, type, onUpdate }) => {
  const [projectKey, setProjectKey] = useState('');
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [createdIssues, setCreatedIssues] = useState([]);
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (open) {
      setLoadingProjects(true);
      fetchJiraProjects()
        .then((data) => {
          const projectList = Array.isArray(data.values) ? data.values : data;
          setProjects(projectList);
        })
        .catch((error) => {
          console.error('❌ Error al cargar proyectos:', error);
          setProjects([]);
        })
        .finally(() => setLoadingProjects(false));
    }
  }, [open]);

  const inferIssueType = (item, parentType) => {
    if (parentType === 'criterios') return 'Criterios de aceptación';
    if (parentType === 'casos') return 'Caso de Prueba';
    if (parentType === 'subtarea') return 'Test criterios de aceptación';
    return 'otro';
  };

  const handleExport = () => {
    if (!projectKey) return;

    setExporting(true);
    const issues = [];

    if (type === 'criterios') {
      data.criteria.forEach((criterio) => {
        issues.push({
          summary: criterio.title,
          description: criterio.title,
          type: inferIssueType(criterio, 'criterios'),
          project: projectKey
        });

        criterio.subtasks.forEach((sub) => {
          issues.push({
            summary: sub.description,
            description: `Subtarea de: ${criterio.title}`,
            type: inferIssueType(sub, 'subtarea'),
            project: projectKey,
            parentSummary: criterio.title
          });
        });
      });
    } else if (type === 'casos') {
      data.criteria.forEach((caso) => {
        issues.push({
          summary: caso.title,
          description: caso.description,
          type: inferIssueType(caso, 'casos'),
          project: projectKey,
          input: caso.preconditions || [],
          expected: caso.expectedOutput || '',
          jiraCode: caso.jiraCode
        });
      });
    }

    exportIssuesToJira(issues)
      .then((response) => {
        const updatedData = { ...data };
        let issueIndex = 0;

        if (type === 'criterios') {
          updatedData.criteria.forEach((criterio) => {
            criterio.jiraKey = response[issueIndex]?.key;
            criterio.self = response[issueIndex]?.self;
            issueIndex++;

            criterio.subtasks.forEach((sub) => {
              sub.jiraKey = response[issueIndex]?.key;
              sub.self = response[issueIndex]?.self;
              issueIndex++;
            });
          });
        } else if (type === 'casos') {
          updatedData.criteria.forEach((caso) => {
            caso.jiraKey = response[issueIndex]?.key;
            caso.self = response[issueIndex]?.self;
            issueIndex++;
          });
        }

        onUpdate(updatedData);
        setCreatedIssues(response);
        setShowSuccessMsg(true);
      })
      .catch((error) => {
        console.error('❌ Error al exportar:', error);
      })
      .finally(() => {
        setExporting(false);
      });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Exportar a Jira</DialogTitle>
      <DialogContent>
        <Typography mb={2}>
          Selecciona el proyecto de Jira donde se crearán las incidencias.
        </Typography>

        <Autocomplete
          options={projects}
          getOptionLabel={(option) => `${option.name} (${option.key})`}
          loading={loadingProjects}
          onChange={(event, newValue) => {
            if (newValue) setProjectKey(newValue.key);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Buscar proyecto"
              variant="outlined"
              fullWidth
              margin="normal"
              placeholder="Escribe para buscar..."
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loadingProjects ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          filterOptions={(options, state) =>
            options.filter((project) =>
              `${project.name} ${project.key}`.toLowerCase().includes(state.inputValue.toLowerCase())
            )
          }
        />
      </DialogContent>

      <AppAlert
        open={showSuccessMsg}
        onClose={() => setShowSuccessMsg(false)}
        severity={createdIssues.length > 0 ? 'success' : 'error'}
        message={
          createdIssues.length > 0
            ? `Se crearon ${createdIssues.length} incidencias en Jira.`
            : 'No se pudo crear ninguna incidencia.'
        }
      />

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleExport}
          variant="contained"
          color="primary"
          disabled={!projectKey || exporting}
          startIcon={exporting ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {exporting ? 'Exportando...' : 'Exportar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportToJiraDialog;
