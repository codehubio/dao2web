/* eslint-disable react-hooks/exhaustive-deps */
import {
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
  reloadFn?: Function;
}) {
  return (
    <>
      {transaction.detail.approvals.length === 0 ? (
        <Typography variant="subtitle1" textAlign="center" sx={{ m: 1 }}>
          There is no approval in this transaction
        </Typography>
      ) : (
        <TableContainer>
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
      )}
    </>
  );
}
