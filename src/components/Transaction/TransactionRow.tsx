import { Button, TableCell, TableRow } from "@mui/material";
import { useState } from "react";
import { TParseProposalDetail } from "../../types/ProposalDetail";
import { TParsedTransactionDetail } from "../../types/TransactionDetail";
import TransactionApproveDialog from "../Dialog/ApproveTransactionDialog";
import TransactionRejectDialog from "../Dialog/RejectTransactionDialog";
export default function TransactionDetail({
  proposal,
  transaction,
  wallet,
  reloadFn,
}: {
  proposal: TParseProposalDetail;
  transaction: TParsedTransactionDetail;
  wallet: string;
  reloadFn: Function;
}) {
  const { detail: txDetail } = transaction;
  const { detail: pDetail } = proposal;
  const [openApproveTx, setOpenApproveTx] = useState(false);
  const [openRejectTx, setOpenRejectTx] = useState(false);

  function isAbleToApproveOrReject() {
    return (
      pDetail.isSettled &&
      !pDetail.isRejected &&
      !pDetail.isApproved &&
      !txDetail.isRejected &&
      !txDetail.isApproved &&
      txDetail.sender === wallet
    );
  }

  function isAbleToExecute() {
    return pDetail.isApproved && !txDetail.isExecuted;
  }
  function changeApproveTxDialogState() {
    setOpenApproveTx(!openApproveTx);
  }
  function changeRejectTxDialogState() {
    setOpenRejectTx(!openRejectTx);
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
            color="primary"
            variant="outlined"
            disabled={!isAbleToExecute()}
          >
            Execute
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
}
