import React from 'react';
import { Box, Button } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import BugReportIcon from '@mui/icons-material/BugReport';
import CloudUploadIcon from '@mui/icons-material/CloudUpload'; 

const ExportButtons = ({
  onExportPdf,
  onExportWord,
  onOpenJira,
  onExportToConfluence
}) => {
  return (
    <Box mt={2} display="flex" gap={2}  >
      <Button
        fullWidth
        variant="contained"
        color="success"
        startIcon={<PictureAsPdfIcon />}
        onClick={onExportPdf}
      >
        Exportar a PDF
      </Button>
      <Button
        fullWidth
        variant="contained"
        color="info"
        startIcon={<DescriptionIcon />}
        onClick={onExportWord}
      >
        Exportar a Word
      </Button>
      <Button
        fullWidth
        variant="contained"
        color="secondary"
        startIcon={<BugReportIcon />}
        onClick={onOpenJira}
      >
        Crear en Jira
      </Button>
      <Button
        fullWidth
        variant="contained"
        color="warning"
        startIcon={<CloudUploadIcon />}
        onClick={onExportToConfluence}
      >
        Exportar a Confluence
      </Button>
    </Box>

  );
};

export default ExportButtons;
