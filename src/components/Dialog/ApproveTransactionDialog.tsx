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
import { Grid, TextField } from "@mui/material";

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
      detail: { index, proposalPda, name },
    } = transaction;
    handleClose();
    setLoadingMessage("approving transaciton");
    let txid;
    try {
      await dispatch(
        approveTxThunk({
          endpoint: connection.rpcEndpoint,
          address: wallet?.adapter.publicKey as any,
          providerName: wallet?.adapter.name,
          data: {
            stepIndex: index,
            proposalPda,
            approvedAmount,
          },
        } as any) as any
      );
      if (reloadFn) {
        reloadFn(true);
      }
    } catch (error: any) {
      setError(error);
    }
    setLoadingMessage("");
    setSuccess({ message: `Transaaction ${name} approved!` });
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
                label="Amount (16-char max)"
                variant="outlined"
                color="primary"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={approve} color="primary" variant="contained">
            Approve
          </Button>
          <Button variant="contained" onClick={handleClose} color="error">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
