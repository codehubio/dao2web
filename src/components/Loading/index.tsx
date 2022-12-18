import {
  useState,
  useEffect
} from 'react';
import { Backdrop, CircularProgress, Typography } from '@mui/material';

export default function Loading({ message = ''} : any) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(!!message);
  }, [message]);
  return (message ? <>
  <Typography variant="caption">
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
    > 
      <CircularProgress color="inherit" />
      &nbsp;{message}
    </Backdrop>
  </Typography>
  </> : <></>)
}