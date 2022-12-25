/* eslint-disable react-hooks/exhaustive-deps */
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { TParseProposalDetail } from "../../types/ProposalDetail";
import { TParsedTransactionDetail } from "../../types/TransactionDetail";
import ApprovalRow from "./ApprovalRow";
export default function ApprovalList({
  proposal,
  transaction,
  reloadFn,
}: {
  proposal: TParseProposalDetail;
  transaction: TParsedTransactionDetail;
  reloadFn: Function;
}) {
  return (
    <>
      {transaction.detail.approvals.length === 0 ? (
        <Typography variant="h6">
          There is no approval in this transaction
        </Typography>
      ) : (
        <></>
      )}
      {proposal && proposal.detail && transaction && transaction.detail ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">#</TableCell>
                <TableCell align="left">Approved Amount</TableCell>
                <TableCell align="left">Sender</TableCell>
                <TableCell align="left">Incentive fee</TableCell>
                <TableCell align="left" />
              </TableRow>
            </TableHead>
            <TableBody>
              {transaction.detail.approvals.map((s: any, index: number) => {
                return (
                  <ApprovalRow
                    reloadFn={reloadFn}
                    key={index}
                    transaction={transaction}
                    approval={s}
                    proposal={proposal}
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <></>
      )}
    </>
  );
}
