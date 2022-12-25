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
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useContext, useEffect, useState } from "react";
import { getSteps } from "../../services/state/step";
import AppContext from "../../share/context";
import { TParseProposalDetail } from "../../types/ProposalDetail";
import ApprovalTxDialog from "../Dialog/ApproveTransactionDialog";
import TransactionRow from "./TransactionRow";
export default function TransactionList({
  proposal,
  wallet,
}: {
  proposal: TParseProposalDetail;
  wallet: string;
}) {
  const { setLoadingMessage, setError } = useContext(AppContext) as any;
  const { connection } = useConnection();
  const [openApprove, setOpenApprove] = useState(false);
  const [transactions, setTransactions] = useState([] as any);
  const [currentTransaction, setCurrentTransaction] = useState({} as any);
  const [reload, setShouldReloase] = useState(false);
  function changeApproveDialogState() {
    setOpenApprove(!openApprove);
  }
  useEffect(() => {
    async function getDetail() {
      setLoadingMessage("loading steps ...");
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
      {currentTransaction ? (
        <ApprovalTxDialog
          reloadFn={setShouldReloase}
          transaction={currentTransaction}
          open={openApprove}
          handleClose={changeApproveDialogState}
        />
      ) : (
        <></>
      )}
      {transactions.length === 0 ? (
        <Typography variant="h6">
          There is no transaction in this proposal
        </Typography>
      ) : (
        <></>
      )}
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
                  onClick={
                    setCurrentTransaction
                      ? setCurrentTransaction.bind(null, s)
                      : () => {}
                  }
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
    </>
  );
}
