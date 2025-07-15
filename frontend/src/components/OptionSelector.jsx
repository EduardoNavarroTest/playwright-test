import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

const OptionSelector = ({
  option,
  onOptionChange,
  confirmOpen,
  onConfirmChange,
  onCancelChange
}) => {
  return (
    <>
      <FormControl fullWidth margin="normal">
        <InputLabel id="select-label">¿Qué deseas generar?</InputLabel>
        <Select
          labelId="select-label"
          value={option}
          label="¿Qué deseas generar?"
          onChange={(e) => onOptionChange(e.target.value)}
        >
          <MenuItem value="criterios">Criterios de aceptación</MenuItem>
          <MenuItem value="casos">Casos de prueba</MenuItem>
        </Select>
      </FormControl>

      <Dialog open={confirmOpen} onClose={onCancelChange}>
        <DialogTitle>Cambiar de vista</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Al cambiar el tipo de documento, se borrará la información actual en pantalla. ¿Deseas continuar?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancelChange}>Cancelar</Button>
          <Button onClick={onConfirmChange} color="primary" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OptionSelector;
