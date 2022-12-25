import { Button, TableCell, TableRow } from "@mui/material";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useContext, useState } from "react";
import { executeTxThunk, revertTxThunk } from "../../reducers/proposal";
import { TParseProposalDetail } from "../../types/ProposalDetail";
import { TParsedTransactionDetail } from "../../types/TransactionDetail";
import TransactionApproveDialog from "../Dialog/ApproveTransactionDialog";
import TransactionRejectDialog from "../Dialog/RejectTransactionDialog";
import { useDispatch } from "react-redux";
import AppContext from "../../share/context";
export default function TransactionDetail({
  proposal,
  transaction,
  reloadFn,
}: {
  proposal: TParseProposalDetail;
  transaction: TParsedTransactionDetail;
  reloadFn: Function;
}) {
  console.log(transaction);
  const { wallet } = useWallet();
  const { connection } = useConnection();
  const dispatch = useDispatch();
  const { detail: txDetail } = transaction;
  const { detail: pDetail } = proposal;
  const [openApproveTx, setOpenApproveTx] = useState(false);
  const [openRejectTx, setOpenRejectTx] = useState(false);
  const { setLoadingMessage, setError, setSuccess } = useContext(
    AppContext
  ) as any;

  function isAbleToApproveOrReject() {
    return (
      pDetail.isSettled &&
      !pDetail.isRejected &&
      !pDetail.isApproved &&
      !txDetail.isRejected &&
      !txDetail.isApproved &&
      txDetail.sender === wallet?.adapter.publicKey?.toBase58()
    );
  }

  function isAbleToExecute() {
    return pDetail.isApproved && !txDetail.isExecuted;
  }
  function isAbleToRevert() {
    return (
      pDetail.isRejected &&
      !txDetail.isReverted &&
      txDetail.numberOfApprovals > 0
    );
  }
  function changeApproveTxDialogState() {
    setOpenApproveTx(!openApproveTx);
  }
  function changeRejectTxDialogState() {
    setOpenRejectTx(!openRejectTx);
  }
  async function executeTx() {
    const {
      detail: { index, proposalPda, name },
    } = transaction;
    setLoadingMessage("approving transaciton");
    let txid;
    try {
      await dispatch(
        executeTxThunk({
          endpoint: connection.rpcEndpoint,
          address: wallet?.adapter.publicKey as any,
          providerName: wallet?.adapter.name,
          data: {
            stepIndex: index,
            proposalPda,
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
    setSuccess({ message: `Transaaction ${name} executed!` });
    return txid;
  }
  async function revertTx() {
    const {
      detail: { index, proposalPda, name, numberOfApprovals },
    } = transaction;
    setLoadingMessage("reverting transaciton");
    let txid;
    try {
      await dispatch(
        revertTxThunk({
          endpoint: connection.rpcEndpoint,
          address: wallet?.adapter.publicKey as any,
          providerName: wallet?.adapter.name,
          data: {
            stepIndex: index,
            proposalPda,
            numberOfApprovals,
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
    setSuccess({ message: `Transaaction ${name} reverted!` });
    return txid;
  }
  return (
    <>
      <TransactionApproveDialog
        reloadFn={reloadFn}
        transaction={transaction}
        open={openApproveTx}
        handleClose={changeApproveTxDialogState}
      />
      <TransactionRejectDialog
        reloadFn={reloadFn}
        transaction={transaction}
        open={openRejectTx}
        handleClose={changeRejectTxDialogState}
      />
      <TableRow>
        <TableCell align="left">{txDetail.index}</TableCell>
        <TableCell align="left">{txDetail.name}</TableCell>
        <TableCell align="left">{txDetail.description}</TableCell>
        <TableCell align="left">{txDetail.amount}</TableCell>
        <TableCell align="left">{txDetail.receivedAmount}</TableCell>
        <TableCell align="left">{txDetail.token.substring(0, 4)}...</TableCell>
        <TableCell align="left">{txDetail.sender.substring(0, 4)}...</TableCell>
        <TableCell align="left">
          {txDetail.receiver.substring(0, 4)}...
        </TableCell>
        <TableCell align="left">{txDetail.incentiveRate}</TableCell>
        <TableCell align="left">{txDetail.executeAfter.toString()}</TableCell>
        <TableCell align="left">
          <Button
            disabled={!isAbleToApproveOrReject()}
            color="primary"
            variant="outlined"
            onClick={changeApproveTxDialogState}
          >
            Approve
          </Button>
          <Button
            color="primary"
            variant="outlined"
            disabled={!isAbleToApproveOrReject()}
            onClick={changeRejectTxDialogState}
          >
            Reject
          </Button>
          <Button
            onClick={executeTx}
            color="primary"
            variant="outlined"
            disabled={!isAbleToExecute()}
          >
            Execute
          </Button>
          <Button
            onClick={revertTx}
            color="primary"
            variant="outlined"
            disabled={!isAbleToRevert()}
          >
            Revert
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
}
