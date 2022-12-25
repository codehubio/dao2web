import { Button, TableCell, TableRow } from "@mui/material";
import { Fragment } from "react";
import { TParseProposalDetail } from "../../types/ProposalDetail";
import { TParsedTransactionDetail } from "../../types/TransactionDetail";
export default function TransactionDetail({
  proposal,
  transaction,
  wallet,
}: {
  proposal: TParseProposalDetail;
  transaction: TParsedTransactionDetail;
  wallet: string;
}) {
  const { detail: txDetail } = transaction;
  const { detail: pDetail } = proposal;
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
  return proposal && proposal.detail ? (
    <Fragment>
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
          >
            Approve
          </Button>
          <Button
            color="primary"
            variant="outlined"
            disabled={!isAbleToApproveOrReject()}
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
    </Fragment>
  ) : (
    <></>
  );
}
