import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Fragment } from "react";
import { TParseProposalDetail } from "../../types/ProposalDetail";
import { TParsedTransactionDetail } from "../../types/TransactionDetail";
import TransactionRow from "./TransactionRow";
export default function TransactionList({
  proposal,
  transactions,
  wallet,
}: {
  proposal: TParseProposalDetail;
  transactions: TParsedTransactionDetail[];
  wallet: string;
}) {
  return proposal && proposal.detail ? (
    <Fragment>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left">#</TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Description</TableCell>
              <TableCell align="left">Amount</TableCell>
              <TableCell align="left">Approved Amount</TableCell>
              <TableCell align="left">Token</TableCell>
              <TableCell align="left">Sender</TableCell>
              <TableCell align="left">Receiver</TableCell>
              <TableCell align="left">Incentive rate</TableCell>
              <TableCell align="left">Execution delay</TableCell>
              <TableCell align="left" />
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((s: any, index: number) => {
              return (
                <TransactionRow
                  key={index}
                  transaction={s}
                  proposal={proposal}
                  wallet={wallet}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  ) : (
    <></>
  );
}
