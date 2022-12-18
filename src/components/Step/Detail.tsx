import { Grid, TextField } from '@mui/material';
import { TParsedTransactionDetail } from '../../types/TransactionDetail';
export default function TransactionDetail({ setDetail, detail } : { setDetail: Function, detail: TParsedTransactionDetail}) {
  function setField(fieldName: string, e: any) {
    setDetail({
      ...detail,
      [fieldName]: e.target.value,
    });
  }
  return (<>
 
      <Grid 
        container
        spacing={2}
        direction="row"
        alignItems="center"
        justifyContent="center"
        mb={1}
        >
        <Grid item xs={12}>
          <TextField
            onChange={setField.bind(null, 'id')}
            style={{width: '100%'}}
            label='name'
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
            onChange={setField.bind(null, 'name')}
            style={{width: '100%'}}
            label='name (16-char max)'
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