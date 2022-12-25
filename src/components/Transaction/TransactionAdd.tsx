import { Grid, TextField } from "@mui/material";
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
            variant="outlined"
            color="primary"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            // value="988Hp2QxjbcZu3vgy78CRsNhxnS46YG4nubbYeePgoxa"
            onChange={setField.bind(null, "token")}
            style={{ width: "100%" }}
            label="Token"
            variant="outlined"
            color="primary"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            onChange={setField.bind(null, "sender")}
            style={{ width: "100%" }}
            // value="6EbhsCu7nDMRYGNXkBNBtcx1gubjrUfR8aQ2ZfPzg2Ur"
            label="Sender"
            variant="outlined"
            color="primary"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            onChange={setField.bind(null, "receiver")}
            style={{ width: "100%" }}
            // value="H2knp7o4asKD79eo1PSPAFcahqAXgk6eQUkCcmAExXFU"
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
            variant="outlined"
            color="primary"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            onChange={setField.bind(null, "executeAfter")}
            style={{ width: "100%" }}
            label="Execute after"
            variant="outlined"
            color="primary"
          />
        </Grid>
      </Grid>
    </>
  );
}
