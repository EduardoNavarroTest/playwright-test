import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  IconButton,
  Button,
  Snackbar,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AssignmentIcon from '@mui/icons-material/Assignment';

const ParsedCases = ({ data, onUpdate, onDeleteCase }) => {
  const [editingField, setEditingField] = useState({ index: null, field: null });
  const [editingEnabledIndex, setEditingEnabledIndex] = useState(null);
  const [lastAddedIndex, setLastAddedIndex] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const caseRefs = useRef([]);
  caseRefs.current = data.criteria.map((_, i) => caseRefs.current[i] ?? React.createRef());

  useEffect(() => {
    if (lastAddedIndex !== null && data.criteria.length > lastAddedIndex) {
      setEditingEnabledIndex(lastAddedIndex);
      setLastAddedIndex(null);
    }
  }, [data.criteria.length, lastAddedIndex]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        editingEnabledIndex !== null &&
        caseRefs.current[editingEnabledIndex] &&
        !caseRefs.current[editingEnabledIndex].current.contains(event.target)
      ) {
        setEditingField({ index: null, field: null });
        setEditingEnabledIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingEnabledIndex]);

  const handleEditMode = (index) => {
    setEditingEnabledIndex(index);
    setEditingField({ index: null, field: null });
  };

  const handleFieldClick = (index, field) => {
    if (editingEnabledIndex === index) {
      setEditingField({ index, field });
    }
  };

  const handleChange = (e, index, field) => {
    const updated = { ...data };
    const item = updated.criteria[index];
    const value = e.target.value;

    if (field === 'preconditions') {
      item.preconditions = value.split('\n').filter(line => line.trim() !== '');
    } else if (field === 'input') {
      item.inputText = value;
    } else {
      item[field] = value;
    }

    onUpdate(updated);
  };

  const handleBlur = () => {
    setEditingField({ index: null, field: null });
  };

  const handleAddCase = () => {
    const updated = { ...data };
    updated.criteria.push({
      title: 'Nuevo caso',
      description: 'Nueva descripción',
      preconditions: ['Nueva entrada'],
      expectedOutput: 'Nueva salida',
      jiraCode: 'Código de Jira padre',
    });

    const newIndex = updated.criteria.length - 1;
    onUpdate(updated);

    setEditingEnabledIndex(newIndex);
    setEditingField({ index: newIndex, field: 'title' });

    handleSnackbarOpen();
  };

  const handleSnackbarOpen = () => {
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  return (
    <Box mt={5}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" color="primary">
          {data.operationType}
        </Typography>
        <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddCase}>
          Agregar caso
        </Button>
      </Box>

      {data.criteria.map((item, index) => {
        const criterioRef = caseRefs.current[index];

        return (
          <Paper
            key={index}
            ref={criterioRef}
            elevation={3}
            sx={{
              p: 2,
              mb: 2,
              backgroundColor: editingEnabledIndex === index ? '#e3f2fd' : '#f5f5f5',
              borderLeft: '6px solid #1976d2'
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box sx={{ flexGrow: 1, pr: 2 }}>
                {editingField.field === 'title' && editingField.index === index ? (
                  <TextField
                    value={item.title}
                    onChange={(e) => handleChange(e, index, 'title')}
                    onBlur={handleBlur}
                    fullWidth
                    variant="outlined"
                    size="small"
                    autoFocus
                  />
                ) : (
                  <Box
                    display="flex"
                    alignItems="center"
                    sx={{ cursor: editingEnabledIndex === index ? 'pointer' : 'default' }}
                    onClick={() => handleFieldClick(index, 'title')}
                  >
                    <AssignmentIcon sx={{ color: 'primary.main', mr: 1 }} />

                    <Typography variant="h6" color="text.primary" sx={{ wordBreak: 'break-word' }}>
                      {item.title}
                      {item.jiraKey && item.self && (
                        <a
                          href={`${item.self.split('/rest')[0]}/browse/${item.jiraKey}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: '#1976d2',
                            fontSize: '0.875rem',
                            textDecoration: 'none',
                            marginLeft: 8
                          }}
                        >
                          ({item.jiraKey})
                        </a>
                      )}
                    </Typography>
                  </Box>


                )}
              </Box>
              <Box sx={{ flexShrink: 0 }}>
                <IconButton onClick={() => handleEditMode(index)} color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => onDeleteCase(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Campos adicionales */}
            <Box mb={1}>
              <Typography variant="subtitle2" fontWeight="bold">Descripción</Typography>
              {editingField.field === 'description' && editingField.index === index ? (
                <TextField
                  value={item.description}
                  onChange={(e) => handleChange(e, index, 'description')}
                  onBlur={handleBlur}
                  fullWidth
                  multiline
                  size="small"
                  autoFocus
                />
              ) : (
                <Typography
                  onClick={() => handleFieldClick(index, 'description')}
                  sx={{ cursor: editingEnabledIndex === index ? 'pointer' : 'default' }}
                >
                  {item.description || ' '}
                </Typography>
              )}
            </Box>

            <Box mb={1}>
              <Typography variant="subtitle2" fontWeight="bold">Entrada:</Typography>
              {editingField.field === 'preconditions' && editingField.index === index ? (
                <TextField
                  value={item.preconditions.join('\n') || ''} f
                  onChange={(e) => handleChange(e, index, 'preconditions')}
                  onBlur={handleBlur}
                  fullWidth
                  multiline
                  size="small"
                  autoFocus
                />
              ) : (
                <Typography
                  onClick={() => handleFieldClick(index, 'preconditions')}
                  sx={{ whiteSpace: 'pre-line', cursor: editingEnabledIndex === index ? 'pointer' : 'default' }}
                >
                  {item.preconditions?.join('\n') || '(Digitar entrada)'}
                </Typography>
              )}
            </Box>

            <Box>
              <Typography variant="subtitle2" fontWeight="bold">Salida esperada:</Typography>
              {editingField.field === 'expectedOutput' && editingField.index === index ? (
                <TextField
                  value={item.expectedOutput}
                  onChange={(e) => handleChange(e, index, 'expectedOutput')}
                  onBlur={handleBlur}
                  fullWidth
                  multiline
                  size="small"
                  autoFocus
                />
              ) : (
                <Typography
                  onClick={() => handleFieldClick(index, 'expectedOutput')}
                  sx={{ cursor: editingEnabledIndex === index ? 'pointer' : 'default' }}
                >
                  {item.expectedOutput || ''}
                </Typography>
              )}
            </Box>

            <Box mt={1}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#1976d2' }}>
                Jira padre:
              </Typography>
              {editingField.field === 'jiraCode' && editingField.index === index ? (
                <TextField
                  value={item.jiraCode || ''}
                  onChange={(e) => handleChange(e, index, 'jiraCode')}
                  onBlur={handleBlur}
                  fullWidth
                  size="small"
                  autoFocus
                />
              ) : (
                <Typography
                  sx={{ cursor: editingEnabledIndex === index ? 'pointer' : 'default' }}
                  onClick={() => handleFieldClick(index, 'jiraCode')}
                >
                  {item.jiraCode || '(Sin código de Jira)'}
                </Typography>
              )}
            </Box>


          </Paper>

        );
      })}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }} elevation={6} variant="filled">
          ¡Caso de prueba agregado exitosamente!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ParsedCases;
