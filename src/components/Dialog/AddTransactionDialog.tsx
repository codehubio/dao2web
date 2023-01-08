import { useContext, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import AppContext from "../../share/context";
import { useDispatch } from "react-redux";
import { addTxToProposalThunk } from "../../reducers/proposal";
import TransactionAdd from "../Transaction/TransactionAdd";
import { TParseProposalDetail } from "../../types/ProposalDetail";
import { TParsedTransactionDetail } from "../../types/TransactionDetail";

export default function TransactionAddDialog({
  reloadFn,
  open,
  handleClose,
  proposal,
}: {
  open: boolean;
  handleClose: any;
  proposal: TParseProposalDetail;
  reloadFn: Function;
}) {
  const dispatch = useDispatch();
  const { setLoadingMessage, setError, setSuccess } = useContext(
    AppContext
  ) as any;
  const [transactionDetail, setTransactionDetail]: [
    TParsedTransactionDetail,
    Function
  ] = useState({
    detail: {
      accountType: 101,
      index: proposal.detail.numberOfTransactions,
      proposalPda: proposal.pda,
      name: "",
      description: "",
      amount: 0,
      receivedAmount: 0,
      numberOfApprovals: 0,
      sender: "",
      receiver: "",
      token: "",
      executeAfter: 0,
      incentiveRate: 0,
      incentiveFee: 0,
      addedAt: 0,
      isApproved: 0,
      approvedAt: 0,
      isRejected: 0,
      rejectedAt: 0,
      isExecuted: 0,
      executedAt: 0,
      isReverted: 0,
      revertedAt: 0,
      revertedAmount: 0,
      approvals: [],
    },
    pda: "",
  });
  const { wallet } = useWallet();
  const { connection } = useConnection();
  async function addTx() {
    const {
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
    handleClose();
    setLoadingMessage("Adding transaction");
    try {
      const { payload } = await dispatch(
        addTxToProposalThunk({
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
          Add a transaction
        </DialogTitle>
        <DialogContent>
          <TransactionAdd
            setDetail={setTransactionDetail}
            transaction={transactionDetail}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={addTx} color="primary" variant="contained">
            Add
          </Button>
          <Button variant="contained" onClick={handleClose} color="error">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
