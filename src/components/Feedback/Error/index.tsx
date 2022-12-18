import {
  useState,
  useEffect
} from 'react';
import { Alert, Snackbar, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

export default function Error({ error } : { error: any}) {
  const close = () => {
    setOpen(false);
  };
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(!!error)
  }, [error])
  return (error ? <>
  <Snackbar
    anchorOrigin={{ horizontal: 'center', vertical: 'top'}}
    open={open}
    autoHideDuration={4000}
    onClose={close}>
    <Alert
      severity="error"
      action={
        <IconButton
          aria-label="close"
          color="inherit"
          size="small"
          onClick={() => {
            setOpen(false);
          }}
        >
          <Close fontSize="inherit" />
        </IconButton>
      }
    >
      {error.message || error.name || 'unknown error'}
    </Alert>
  </Snackbar>
  </> : <></>)
}