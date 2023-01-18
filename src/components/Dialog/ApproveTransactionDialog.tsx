import { useContext, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { TParsedTransactionDetail } from "../../types/TransactionDetail";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import AppContext from "../../share/context";
import { useDispatch } from "react-redux";
import { approveTxThunk } from "../../reducers/proposal";
import { Grid, Stack, TextField } from "@mui/material";
import { CheckCircleOutlined } from "@mui/icons-material";
import CancelButton from "../CancelButton";

export default function TransactionApproveDialog({
  reloadFn,
  open,
  handleClose,
  transaction,
}: {
  open: boolean;
  handleClose: any;
  reloadFn: Function;
  transaction: TParsedTransactionDetail;
}) {
  const dispatch = useDispatch();
  const { setLoadingMessage, setError, setSuccess } = useContext(
    AppContext
  ) as any;
  const [approvedAmount, setApprovedAmount] = useState(0);
  function setAmount(e: any) {
    setApprovedAmount(e.target.value);
  }
  const { wallet } = useWallet();
  const { connection } = useConnection();
  async function approve() {
    const {
      pda,
      detail: { proposalPda, name },
    } = transaction;
    handleClose();
    setLoadingMessage("Approving transaciton");
    let txid;
    try {
      const payload = await dispatch(
        approveTxThunk({
          endpoint: connection.rpcEndpoint,
          address: wallet?.adapter.publicKey as any,
          providerName: wallet?.adapter.name,
          data: {
            pda,
            proposalPda,
            approvedAmount,
          },
        } as any) as any
      ).unwrap();
      if (reloadFn) {
        reloadFn(true);
      }
      setLoadingMessage("");
      setSuccess({
        message: `Transaction ${name} approved! You may need to refresh the page to see the change!`,
        txid: payload.txid,
      });
    } catch (error: any) {
      setError(error);
    }
    return txid;
  }
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        color="primary"
      >
        <DialogTitle textAlign="center" sx={{ mb: 1 }} id="alert-dialog-title">
          Approve transaction
        </DialogTitle>
        <DialogContent>
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
                onChange={setAmount}
                style={{ width: "100%" }}
                label="Amount to be approved"
                variant="outlined"
                color="primary"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Stack width="100%" direction="row" justifyContent="center">
            <Button
              startIcon={<CheckCircleOutlined />}
              onClick={approve}
              color="secondary"
              variant="text"
            >
              Approve
            </Button>

            <CancelButton handleClose={handleClose} />
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
}
