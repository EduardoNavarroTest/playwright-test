import React from 'react';
import {
  FormControl,
  Button,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const FileInputSection = ({
  file,
  plainText,
  usePlainText,
  onFileChange,
  onPlainTextChange,
  onTogglePlainText
}) => {
  return (
    <>
      {!usePlainText && (
        <FormControl fullWidth margin="normal">
          <Button variant="outlined" component="label" startIcon={<UploadFileIcon />}>
            Seleccionar archivo Word o PDF
            <input
              type="file"
              hidden
              accept=".pdf,.docx"
              onChange={onFileChange}
            />
          </Button>
          {file && <Typography variant="body2" mt={1}>{file.name}</Typography>}
        </FormControl>
      )}

      {usePlainText && (
        <FormControl fullWidth margin="normal">
          <TextField
            label="Link de Confluence o texto plano"
            multiline
            rows={4}
            value={plainText}
            onChange={onPlainTextChange}
            placeholder="Pega aquí el enlace de Confluence o el texto plano"
          />
        </FormControl>
      )}

      <FormControl fullWidth margin="none">
        <FormControlLabel
          control={
            <Checkbox
              checked={usePlainText}
              onChange={onTogglePlainText}
            />
          }
          label="Link de Confluence o texto plano"
        />
      </FormControl>
    </>
  );
};

export default FileInputSection;
