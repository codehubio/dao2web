import { Grid } from '@mui/material';
export default function MyGrid({ children, ...props} : any) {
  return ( <Grid
    container
    style={{width: '100%'}}
    spacing={2}
    direction="column"
    alignItems="center"
    justifyContent="center"
    {...props}
  >{children}
    </Grid>)
}