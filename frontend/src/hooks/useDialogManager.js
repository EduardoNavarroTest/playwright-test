import { useState } from 'react';

export default function useDialogManager() {
  const [dialogs, setDialogs] = useState({
    formatError: false,
    jiraOpen: false,
    confluenceOpen: false,
    confirmChange: false,
  });

  const openDialog = (name) => setDialogs((prev) => ({ ...prev, [name]: true }));
  const closeDialog = (name) => setDialogs((prev) => ({ ...prev, [name]: false }));

  return {
    dialogs,
    openDialog,
    closeDialog,
  };
}
