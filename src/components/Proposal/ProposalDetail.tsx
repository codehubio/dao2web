/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, Stack } from "@mui/material";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import AppContext from "../../share/context";
import { PublicKey } from "@solana/web3.js";
import { BoltOutlined } from "@mui/icons-material";
import TransactionAddDialog from "../../components/Dialog/AddTransactionDialog";
import { TParseProposalDetail } from "../../types/ProposalDetail";
import { settleProposalThunk } from "../../reducers/proposal";
import TransactionList from "../Transaction/TransactionList";
import { getProposalByPda } from "../../services/state/proposal";

export default function ProposalDetail() {
  const { connection } = useConnection();
  const { setLoadingMessage, setError, setSuccess } = useContext(
    AppContext
  ) as any;
  // const [assets, setAssets] = useState([]);
  const [proposal, setProposal] = useState({} as TParseProposalDetail);
  const [openAddTx, setOpenAddTx] = useState(false);
  const [reload, setShouldReload] = useState(false);
  const dispatch = useDispatch();
  const { wallet } = useWallet();
  const { proposalPda = "" } = useParams();
  useEffect(() => {
    async function getDetail() {
      setLoadingMessage("Loading steps ...");
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
    const { payload } = await dispatch(
      settleProposalThunk({
        endpoint: connection.rpcEndpoint,
        address: wallet?.adapter.publicKey as any,
        providerName: wallet?.adapter.name,
        data: {
          pda: proposal?.pda,
        },
      } as any) as any
    );
    setLoadingMessage("");
    setSuccess({
      message: `Proposal ${proposal.detail.name} settled! You may need to refresh the page to see the change!`,
      txid: payload.txid,
    });
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

  return proposal && proposal.detail ? (
    <>
      <TransactionAddDialog
        reloadFn={setShouldReload}
        proposal={proposal}
        open={openAddTx}
        handleClose={changeAddTxDialogState}
      />

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
        >
          {isAbleToModify() ? (
            <>
              <Button
                onClick={changeAddTxDialogState}
                color="primary"
                variant="contained"
                startIcon={<BoltOutlined />}
              >
                Add transaction
              </Button>
              <Button
                onClick={settle}
                color="primary"
                variant="contained"
                startIcon={<BoltOutlined />}
              >
                Settle
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
