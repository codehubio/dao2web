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
  RemoveCircleOutline,
} from "@mui/icons-material";
import TransactionAddDialog from "../../components/Dialog/AddTransactionDialog";
import { TParseProposalDetail } from "../../types/ProposalDetail";
import { settleProposalThunk } from "../../reducers/proposal";
import TransactionList from "../Transaction/TransactionList";
import { getProposalByPda } from "../../services/state/proposal";
import ProposalCard from "./ProposalCard";
import EditProposalDialog from "../Dialog/ProposalEditDialog";
import removeProposalThunk from "../../reducers/proposal/remove-proposal";
import SettleConfirmationDialog from "../Dialog/ConfirmationDialog";
import RemoveProposalConfirmationDialog from "../Dialog/ConfirmationDialog";

export default function ProposalDetail() {
  const { connection } = useConnection();
  const { setLoadingMessage, setError, setSuccess, setBreads } = useContext(
    AppContext
  ) as any;
  // const [assets, setAssets] = useState([]);
  const [proposal, setProposal] = useState({} as TParseProposalDetail);
  const [openAddTx, setOpenAddTx] = useState(false);
  const [openUpdateProposal, setOpenUpdateProposal] = useState(false);
  const [openSettleProposal, setOpenSettleProposal] = useState(false);
  const [openRemoveProposal, setOpenRemoveProposal] = useState(false);
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
      const payload = await dispatch(
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
  async function remove() {
    setLoadingMessage("Settling the proposal ...");
    try {
      const payload = await dispatch(
        removeProposalThunk({
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
        message: `Proposal ${proposal.detail.name} removed! You may need to refresh the page to see the change!`,
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
  function changeSettleProposalDialogState() {
    setOpenSettleProposal(!openSettleProposal);
  }
  function changeRemoveProposalDialogState() {
    setOpenRemoveProposal(!openRemoveProposal);
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
      <SettleConfirmationDialog
        reloadFn={setShouldReload}
        open={openSettleProposal}
        executeFn={settle}
        handleClose={changeSettleProposalDialogState}
        dialogContent="After settled, proposal is ready to get approvals from involved
        parties. You cannot change or delete it anymore"
        dialogTitle="Are you sure?"
        actionText="Settle"
      />
      <RemoveProposalConfirmationDialog
        reloadFn={setShouldReload}
        open={openRemoveProposal}
        executeFn={remove}
        handleClose={changeRemoveProposalDialogState}
        dialogContent="After removed, proposal cannot be viewed or modified anymore. Fee is return to your wallet"
        dialogTitle="Are you sure?"
        actionText="Remove"
        warningText="Proposal must be empty to be removed"
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
                onClick={changeSettleProposalDialogState}
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
                Edit
              </Button>
              <Button
                onClick={changeRemoveProposalDialogState}
                color="error"
                variant="text"
                startIcon={<RemoveCircleOutline />}
              >
                Remove
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
