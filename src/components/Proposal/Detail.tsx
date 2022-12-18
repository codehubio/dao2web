import { Grid, TextField } from '@mui/material';
import { TParseProposalDetail } from '../../types/ProposalDetail';
export default function ProposalDetail({ setDetail, detail } : { setDetail: Function, detail: TParseProposalDetail}) {
  function setField(fieldName: string, e: any) {
    setDetail({
      ...detail,
      [fieldName]: e.target.value,
    });
  }
  return (<>
 
      <Grid 
        container
        style={{width: '100%'}}
        spacing={2}
        direction="row"
        alignItems="center"
        justifyContent="center"
        // alignContent="center"
        mb={1}
        >
        <Grid item xs={12}>
          <TextField
            onChange={setField.bind(null, 'id')}
            style={{width: '100%'}}
            label='proposal id (16-char fixed and globally unique)'
            variant='outlined'
            color="primary" />
        </Grid>
        <Grid item xs={12}>
          <TextField
            onChange={setField.bind(null, 'name')}
            style={{width: '100%'}}
            label='name (16-char max)'
            variant='outlined'
            color="primary" />
        </Grid>
        <Grid item xs={12}>
          <TextField
            onChange={setField.bind(null, 'description')}
            style={{width: '100%'}}
            label='description (128-char max)'
            variant='outlined'
            color="primary" />
        </Grid>
        <Grid item xs={12}>
          <TextField
            onChange={setField.bind(null, 'expireOrFinalizeAfter')}
            style={{width: '100%'}}
            label='expiration in seconds'
            variant='outlined'
            color="primary" />
        </Grid>
      </Grid>
  </>)
}