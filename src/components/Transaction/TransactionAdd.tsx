import { Grid, Stack, TextField } from "@mui/material";
import { TParsedTransactionDetail } from "../../types/TransactionDetail";
export default function TransactionAdd({
  setDetail,
  transaction,
}: {
  setDetail: Function;
  transaction: TParsedTransactionDetail;
}) {
  function setField(fieldName: string, e: any) {
    (transaction.detail as any)[fieldName] = e.target.value;
    setDetail(transaction);
  }
  return (
    <>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Grid
          container
          style={{ width: "100%" }}
          spacing={2}
          direction="row"
          alignItems="center"
          justifyContent="center"
          // alignContent="center"
          mb={1}
        >
          <Grid item xs={12}>
            <TextField
              onChange={setField.bind(null, "name")}
              style={{ width: "100%" }}
              label="Name (16-char max)"
              variant="outlined"
              color="primary"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              onChange={setField.bind(null, "description")}
              style={{ width: "100%" }}
              label="Description (128-char max)"
              variant="outlined"
              color="primary"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              onChange={setField.bind(null, "amount")}
              style={{ width: "100%" }}
              label="Amount"
              placeholder="Must be a positive integer, using same decimal from the token"
              variant="outlined"
              color="primary"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              // value="988Hp2QxjbcZu3vgy78CRsNhxnS46YG4nubbYeePgoxa"
              onChange={setField.bind(null, "token")}
              placeholder="11111111111111111111111111111111 for native token"
              style={{ width: "100%" }}
              label="Token address"
              variant="outlined"
              color="primary"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              onChange={setField.bind(null, "sender")}
              style={{ width: "100%" }}
              placeholder="Set 11111111111111111111111111111111 for public transaction"
              label="Sender"
              variant="outlined"
              color="primary"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              onChange={setField.bind(null, "receiver")}
              style={{ width: "100%" }}
              placeholder="Who will receive the fund in this trasaction if the proposal is approved"
              label="Receiver"
              variant="outlined"
              color="primary"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              onChange={setField.bind(null, "incentiveRate")}
              style={{ width: "100%" }}
              label="Incentive rate"
              placeholder="Rate of the fee to pay for the caller to execute/revert tx, paid by sender"
              variant="outlined"
              color="primary"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              onChange={setField.bind(null, "executeAfter")}
              placeholder="How long in seconds will this tx be executed after the proposal is approved"
              style={{ width: "100%" }}
              label="Execute delay"
              variant="outlined"
              color="primary"
            />
          </Grid>
        </Grid>
      </Stack>
    </>
  );
}
