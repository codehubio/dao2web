import {
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";
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
  const [senderEnabled, setSenderEnabled] = useState(true);
  const [senderAddress, _setSenderAddress] = useState("");
  function setSenderAddress(e: any) {
    _setSenderAddress(e.target.value);
  }
  const [tokenEnabled, setTokenEnabled] = useState(true);
  const [tokenAddress, _setTokenAddress] = useState("");
  function setTokenAddress(e: any) {
    _setTokenAddress(e.target.value);
  }
  function setSenderTransaction(status: boolean) {
    setSenderEnabled(status);
    const value = status ? senderAddress : "11111111111111111111111111111111";
    setDetail({
      ...transaction,
      detail: {
        ...transaction.detail,
        sender: value,
      },
    });
  }
  function setTokenTransaction(status: boolean) {
    setTokenEnabled(status);
    const value = status ? tokenAddress : "11111111111111111111111111111111";
    setDetail({
      ...transaction,
      detail: {
        ...transaction.detail,
        token: value,
      },
    });
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
            <Stack direction="row">
              <RadioGroup
                sx={{ width: "50%" }}
                row
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="spl_token"
                name="radio-buttons-group"
              >
                <FormControlLabel
                  control={<Radio />}
                  onChange={setTokenTransaction.bind(null, false)}
                  value="native_token"
                  name="radio-buttons"
                  label="Native token"
                />
                <FormControlLabel
                  control={<Radio />}
                  onChange={setTokenTransaction.bind(null, true)}
                  value="spl_token"
                  name="radio-buttons"
                  label="SPL token"
                />
              </RadioGroup>
              <TextField
                disabled={!tokenEnabled}
                onChange={setTokenAddress}
                placeholder="SPL token address"
                style={{ width: "100%" }}
                label="Token address"
                variant="outlined"
                color="primary"
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row">
              <RadioGroup
                sx={{ width: "50%" }}
                row
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="private_tx"
                name="radio-buttons-group"
              >
                <FormControlLabel
                  control={<Radio />}
                  onChange={setSenderTransaction.bind(null, false)}
                  value="pubic_tx"
                  name="radio-buttons"
                  label="Public tx"
                />
                <FormControlLabel
                  control={<Radio />}
                  onChange={setSenderTransaction.bind(null, true)}
                  value="private_tx"
                  name="radio-buttons"
                  label="Private tx"
                />
              </RadioGroup>
              <TextField
                disabled={!senderEnabled}
                onChange={setSenderAddress}
                style={{ width: "100%" }}
                placeholder="Sender address"
                label="Sender"
                variant="outlined"
                color="primary"
              />
            </Stack>
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
