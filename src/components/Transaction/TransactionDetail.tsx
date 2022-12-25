/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Stack } from "@mui/material";
import { useConnection } from "@solana/wallet-adapter-react";
import AppContext from "../../share/context";
import { useDispatch } from "react-redux";
import { TParsedTransactionDetail } from "../../types/TransactionDetail";
import ApprovalList from "../Approval/ApprovalList";
import { TParseProposalDetail } from "../../types/ProposalDetail";
import { getProposalByPda, getTransactionByPda } from "../../reducers/proposal";

export default function TransactionDetail() {
  const { connection } = useConnection();
  const { setLoadingMessage, setError } = useContext(AppContext) as any;
  // const [assets, setAssets] = useState([]);
  const [transaction, setTransaction] = useState(
    {} as TParsedTransactionDetail
  );
  const [proposal, setProposal] = useState({} as TParseProposalDetail);
  const [reload, setShouldReload] = useState(false);
  const { transactionPda = "" } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    async function getDetail() {
      setLoadingMessage("Loading approvals ...");
      try {
        const { payload: transaction } = await dispatch(
          getTransactionByPda({
            endpoint: connection.rpcEndpoint,
            data: {
              transactionPda,
            },
          } as any) as any
        );
        setTransaction(transaction);
        const { payload: proposal } = await dispatch(
          getProposalByPda({
            endpoint: connection.rpcEndpoint,
            data: {
              proposalPda: transaction.detail.proposalPda,
            },
          } as any) as any
        );
        setProposal(proposal);
      } catch (error) {
        setError(error as any);
      }
      setLoadingMessage("");
    }
    getDetail();
  }, [transactionPda, reload]);

  return transaction && transaction.detail ? (
    <>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        ></Stack>
        <ApprovalList
          proposal={proposal}
          transaction={transaction}
          reloadFn={setShouldReload}
        />
      </Stack>
    </>
  ) : (
    <></>
  );
}
