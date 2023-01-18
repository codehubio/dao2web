import { useContext, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import AppContext from "../../share/context";
import { useDispatch } from "react-redux";
import TransactionAddOrEdit from "../Transaction/TransactionAddOrEdit";
import { TParsedTransactionDetail } from "../../types/TransactionDetail";
import { AddCircleOutlineOutlined } from "@mui/icons-material";
import editTxThunk from "../../reducers/proposal/edit-tx";
import { Stack } from "@mui/material";
import CancelButton from "../CancelButton";

export default function TransactionEditDialog({
  reloadFn,
  open,
  handleClose,
  transaction,
}: {
  open: boolean;
  handleClose: any;
  transaction: TParsedTransactionDetail;
  reloadFn: Function;
}) {
  const dispatch = useDispatch();
  const { setLoadingMessage, setError, setSuccess } = useContext(
    AppContext
  ) as any;
  const [transactionDetail, setTransactionDetail]: [
    TParsedTransactionDetail,
    Function
  ] = useState(transaction);
  const { wallet } = useWallet();
  const { connection } = useConnection();
  if (!transaction) {
    return <></>;
  }
  async function editTx() {
    const {
      pda,
      detail: {
        proposalPda,
        name,
        description,
        amount,
        token,
        sender,
        receiver,
        executeAfter,
        incentiveRate,
      },
    } = transactionDetail;
    console.log(transactionDetail);
    handleClose();
    setLoadingMessage("Adding transaction");
    try {
      const payload = await dispatch(
        editTxThunk({
          pda,
          endpoint: connection.rpcEndpoint,
          address: wallet?.adapter.publicKey as any,
          providerName: wallet?.adapter.name,
          data: {
            proposalPda,
            name,
            description,
            amount,
            token,
            sender,
            receiver,
            executeAfter,
            incentiveRate,
          },
        } as any) as any
      ).unwrap();
      if (reloadFn) {
        reloadFn(true);
      }
      setLoadingMessage("");
      setSuccess({
        message: `Transaction ${name} created! You may need to refresh the page to see the change!`,
        txid: payload.txid,
      });
      return payload.txid;
    } catch (error: any) {
      setError(error);
      setLoadingMessage("");
    }
  }
  return (
    <>
      <Dialog
        maxWidth="md"
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        color="primary"
      >
        <DialogTitle textAlign="center" sx={{ mb: 1 }} id="alert-dialog-title">
          Edit transaction
        </DialogTitle>
        <DialogContent>
          <TransactionAddOrEdit
            setDetail={setTransactionDetail}
            transaction={transactionDetail}
          />
        </DialogContent>
        <DialogActions>
          <Stack width="100%" direction="row" justifyContent="center">
            <Button
              startIcon={<AddCircleOutlineOutlined />}
              onClick={editTx}
              color="primary"
              variant="text"
            >
              Update
            </Button>
            <CancelButton handleClose={handleClose} />
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
}
