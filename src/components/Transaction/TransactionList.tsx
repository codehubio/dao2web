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
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useContext, useEffect, useState } from "react";
import { getSteps } from "../../services/state/transaction";
import AppContext from "../../share/context";
import { TParseProposalDetail } from "../../types/ProposalDetail";
import TransactionRow from "./TransactionRow";
export default function TransactionList({
  proposal,
}: {
  proposal: TParseProposalDetail;
  wallet: string;
}) {
  const { setLoadingMessage, setError } = useContext(AppContext) as any;
  const { connection } = useConnection();
  const [transactions, setTransactions] = useState([] as any);
  const [reload, setShouldReload] = useState(false);
  useEffect(() => {
    async function getDetail() {
      setLoadingMessage("Loading transactions ...");
      try {
        const { proposalSteps } = await getSteps(
          connection,
          new PublicKey(proposal.pda)
        );
        setTransactions(proposalSteps);
      } catch (error) {
        setError(error as any);
      }
      setLoadingMessage("");
    }
    getDetail();
  }, [proposal.pda, reload]);
  return (
    <>
      {transactions && transactions.length ? (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left" />
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">Description</TableCell>
                <TableCell align="left">Amount</TableCell>
                <TableCell align="left">Approved Amount</TableCell>
                <TableCell align="left">Token</TableCell>
                <TableCell align="left">Sender</TableCell>
                <TableCell align="left">Receiver</TableCell>
                <TableCell align="left">Incentive fee</TableCell>
                <TableCell align="left">Execution delay</TableCell>
                <TableCell align="left" />
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((s: any, index: number) => {
                return (
                  <TransactionRow
                    reloadFn={setShouldReload}
                    key={index}
                    transaction={s}
                    proposal={proposal}
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="h6" color="info">
          There is no transaction in this proposal
        </Typography>
      )}
    </>
  );
}
