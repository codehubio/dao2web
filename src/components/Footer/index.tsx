import { Grid, Typography, Container, Link } from '@mui/material';

export default function Footer({ sx }: any) {
  return (<>
  <Container sx={{...sx}} >
    <Grid xl={true} container direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Grid item>
        <Typography variant="caption">
          made with <span style={{color: '#e25555'}}>&#9829;</span>&nbsp;
          <Link color='secondary' href='https://status.solana.com'>solana</Link>
        </Typography>
      </Grid>
    </Grid>
  </Container>
  </>)
}