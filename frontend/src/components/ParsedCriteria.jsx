import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    TextField,
    Button,
    Snackbar,
    Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const ParsedCriteria = ({ data, onEdit, onDelete, onAdd, onDeleteSubtask, onUpdate }) => {
    const [editing, setEditing] = useState({ type: null, index: null, subIndex: null });
    const [editingEnabledIndex, setEditingEnabledIndex] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    // Refs para cada criterio
    const criterioRefs = useRef([]);
    criterioRefs.current = data.criteria.map((_, i) => criterioRefs.current[i] ?? React.createRef());

    // Detectar clic fuera del criterio en edición
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                editingEnabledIndex !== null &&
                criterioRefs.current[editingEnabledIndex] &&
                !criterioRefs.current[editingEnabledIndex].current.contains(event.target)
            ) {
                setEditing({ type: null, index: null, subIndex: null });
                setEditingEnabledIndex(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [editingEnabledIndex]);

    const handleEditClick = (index) => {
        setEditingEnabledIndex(index);
        setEditing({ type: null, index: null, subIndex: null });
    };

    const handleFieldClick = (type, index, subIndex = null) => {
        if (editingEnabledIndex === index) {
            setEditing({ type, index, subIndex });
        }
    };

    const handleChange = (e, index, subIndex = null) => {
        const updated = { ...data };
        if (subIndex === null) {
            updated.criteria[index].title = e.target.value;
        } else {
            updated.criteria[index].subtasks[subIndex].description = e.target.value;
        }
        onUpdate(updated);
    };

    const handleBlur = () => {
        setEditing({ type: null, index: null, subIndex: null });
    };

    const handleAddCriterio = () => {
        const newCriterio = {
            title: "Nuevo criterio",
            subtasks: [{ description: "Subtarea 1" }]
        };
        const updated = { ...data };
        updated.criteria.push(newCriterio);
        const newIndex = updated.criteria.length - 1;
        onUpdate(updated);
        setEditingEnabledIndex(newIndex);
        setEditing({ type: 'criterio', index: newIndex, subIndex: null });
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
                <Typography variant="h4" color="primary" gutterBottom>
                    {data.operationType} 
                </Typography>
                <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddCriterio}>
                    Agregar criterio
                </Button>
            </Box>

            {data.criteria.map((item, index) => (
                <Paper
                    key={index}
                    ref={criterioRefs.current[index]}
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
                            {editing.type === 'criterio' && editing.index === index ? (
                                <TextField
                                    value={item.title}
                                    onChange={(e) => handleChange(e, index)}
                                    onBlur={handleBlur}
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    autoFocus
                                />
                            ) : (
                                <Typography
                                    variant="h6"
                                    color="text.primary"
                                    sx={{
                                        cursor: editingEnabledIndex === index ? 'pointer' : 'default',
                                        wordBreak: 'break-word'
                                    }}
                                    onClick={() => handleFieldClick('criterio', index)}
                                >

                                    {item.title}{' '}
                                    {item.jiraKey && item.self && (
                                        <Typography component="span" variant="caption" color="primary">
                                            (
                                            <a
                                                href={`${item.self.split('/rest')[0]}/browse/${item.jiraKey}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ color: '#1976d2', textDecoration: 'none' }}
                                            >
                                                {item.jiraKey}
                                            </a>
                                            )
                                        </Typography>
                                    )}

                                </Typography>

                            )}
                        </Box>
                        <Box sx={{ flexShrink: 0 }}>
                            <IconButton onClick={() => handleEditClick(index)} color="primary">
                                <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => onDelete(index)} color="error">
                                <DeleteIcon />
                            </IconButton>
                            <IconButton onClick={() => onAdd(index)} color="success">
                                <AddIcon />
                            </IconButton>
                        </Box>
                    </Box>

                    <List dense>
                        {item.subtasks?.map((sub, subIndex) => (
                            <ListItem
                                key={subIndex}
                                secondaryAction={
                                    editingEnabledIndex === index && (
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            onClick={() => onDeleteSubtask(index, subIndex)}
                                            color="error"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    )
                                }
                            >
                                <ListItemIcon>
                                    <CheckCircleIcon color="success" />
                                </ListItemIcon>
                                {editing.type === 'subtarea' &&
                                    editing.index === index &&
                                    editing.subIndex === subIndex ? (
                                    <TextField
                                        value={sub.description}
                                        onChange={(e) => handleChange(e, index, subIndex)}
                                        onBlur={handleBlur}
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        autoFocus
                                    />
                                ) : (
                                    <ListItemText
                                        primary={
                                            <>
                                                {sub.description}
                                                {sub.jiraKey && sub.self && (
                                                    <Typography component="span" variant="caption" color="primary" sx={{ ml: 1 }}>
                                                        (
                                                        <a
                                                            href={`${sub.self.split('/rest')[0]}/browse/${sub.jiraKey}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{ color: '#1976d2', textDecoration: 'none' }}
                                                        >
                                                            {sub.jiraKey}
                                                        </a>
                                                        )
                                                    </Typography>
                                                )}
                                            </>
                                        }

                                        onClick={() => handleFieldClick('subtarea', index, subIndex)}
                                        sx={{
                                            cursor: editingEnabledIndex === index ? 'pointer' : 'default'
                                        }}
                                    />
                                )}
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            ))}

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }} elevation={6} variant="filled">
                    ¡Criterio agregado exitosamente!
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ParsedCriteria;
