/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, Stack } from "@mui/material";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import AppContext from "../../share/context";
import { PublicKey } from "@solana/web3.js";
import {
  BoltOutlined,
  AddCircleOutlineOutlined,
  EditOutlined,
} from "@mui/icons-material";
import TransactionAddDialog from "../../components/Dialog/AddTransactionDialog";
import { TParseProposalDetail } from "../../types/ProposalDetail";
import { settleProposalThunk } from "../../reducers/proposal";
import TransactionList from "../Transaction/TransactionList";
import { getProposalByPda } from "../../services/state/proposal";
import ProposalCard from "./ProposalCard";
import EditProposalDialog from "../Dialog/ProposalEditDialog";

export default function ProposalDetail() {
  const { connection } = useConnection();
  const { setLoadingMessage, setError, setSuccess, setBreads } = useContext(
    AppContext
  ) as any;
  // const [assets, setAssets] = useState([]);
  const [proposal, setProposal] = useState({} as TParseProposalDetail);
  const [openAddTx, setOpenAddTx] = useState(false);
  const [openUpdateProposal, setOpenUpdateProposal] = useState(false);
  const [reload, setShouldReload] = useState(false);
  const dispatch = useDispatch();
  const { wallet } = useWallet();
  const { proposalPda = "" } = useParams();
  useEffect(() => {
    setBreads(["Home", "Proposal List"]);
    async function getDetail() {
      setLoadingMessage("Loading transactions ...");
      try {
        const { pda, readableData } = await getProposalByPda(
          connection,
          new PublicKey(proposalPda)
        );
        setProposal({
          pda: pda.toBase58(),
          detail: readableData,
        });
      } catch (error) {
        setError(error as any);
      }
      setLoadingMessage("");
    }
    getDetail();
  }, [proposalPda, reload]);
  async function settle() {
    setLoadingMessage("Settling the proposal ...");
    try {
      const { payload } = await dispatch(
        settleProposalThunk({
          endpoint: connection.rpcEndpoint,
          address: wallet?.adapter.publicKey as any,
          providerName: wallet?.adapter.name,
          data: {
            pda: proposal?.pda,
          },
        } as any) as any
      ).unwrap();
      setLoadingMessage("");
      setSuccess({
        message: `Proposal ${proposal.detail.name} settled! You may need to refresh the page to see the change!`,
        txid: payload.txid,
      });
    } catch (error) {
      setError(error);
      setLoadingMessage("");
    }
  }
  function isAbleToModify(): boolean {
    return (
      proposal &&
      proposal.detail &&
      !proposal.detail.isSettled &&
      proposal.detail.creator === wallet?.adapter.publicKey?.toBase58()
    );
  }
  function changeAddTxDialogState() {
    setOpenAddTx(!openAddTx);
  }
  function changeUpdateProposalDialogState() {
    setOpenUpdateProposal(!openUpdateProposal);
  }
  return proposal && proposal.detail ? (
    <>
      <TransactionAddDialog
        reloadFn={setShouldReload}
        proposal={proposal}
        open={openAddTx}
        handleClose={changeAddTxDialogState}
      />
      <EditProposalDialog
        reloadFn={setShouldReload}
        proposal={proposal}
        open={openUpdateProposal}
        handleClose={changeUpdateProposalDialogState}
      />

      <Stack
        direction="column"
        // justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <ProposalCard proposal={proposal} />

        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          {isAbleToModify() ? (
            <>
              <Button
                onClick={changeAddTxDialogState}
                color="secondary"
                variant="text"
                startIcon={<AddCircleOutlineOutlined />}
              >
                Add transaction
              </Button>
              <Button
                onClick={settle}
                color="secondary"
                variant="text"
                startIcon={<BoltOutlined />}
              >
                Settle
              </Button>
              <Button
                onClick={changeUpdateProposalDialogState}
                color="secondary"
                variant="text"
                startIcon={<EditOutlined />}
              >
                Edit detail
              </Button>
            </>
          ) : (
            <></>
          )}
        </Stack>
        <TransactionList
          proposal={proposal}
          wallet={wallet?.adapter.publicKey?.toBase58() as any}
        />
      </Stack>
    </>
  ) : (
    <></>
  );
}
