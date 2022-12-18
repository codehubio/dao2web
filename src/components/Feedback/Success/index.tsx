import {
  useState,
  useEffect
} from 'react';
import { Alert, Snackbar, IconButton, Link } from '@mui/material';
import { Close } from '@mui/icons-material';

export default function Success({ success } : { success: any}) {
  const close = () => {
    setOpen(false);
  };
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(!!success)
  }, [success])
  return (success ? <>
  <Snackbar
    anchorOrigin={{ horizontal: 'center', vertical: 'top'}}
    open={open}
    autoHideDuration={4000}
    onClose={close}>
    <Alert
      severity="success"
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
      {success.message}&nbsp;
      {success.link ? <Link color='secondary' href={success.link.href}>{success.link.text}</Link> : <></>}
    </Alert>
  </Snackbar>
  </> : <></>)
}