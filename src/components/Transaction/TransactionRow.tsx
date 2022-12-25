import { Avatar, TableCell, TableRow } from "@mui/material";
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
      !txDetail.isApproved
    );
  }
  return proposal && proposal.detail ? (
    <Fragment>
      <TableRow>
        <TableCell align="left">{txDetail.index}</TableCell>
        <TableCell align="left">{txDetail.name}</TableCell>
        <TableCell align="left">{txDetail.description}</TableCell>
        <TableCell align="left">{txDetail.amount}</TableCell>
        <TableCell align="left">{txDetail.token.substr(0, 4)}...</TableCell>
        <TableCell align="left">{txDetail.sender.substr(0, 4)}...</TableCell>
        <TableCell align="left">{txDetail.receiver.substr(0, 4)}...</TableCell>
        <TableCell align="left">{txDetail.incentiveRate}</TableCell>
        <TableCell align="left">{txDetail.executeAfter.toString()}</TableCell>
      </TableRow>
    </Fragment>
  ) : (
    <></>
  );
}
