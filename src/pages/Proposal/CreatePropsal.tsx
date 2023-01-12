/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Stack } from "@mui/material";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import ProposalCreate from "../../components/Proposal/ProposalCreateOrEdit";
import { createProposalThunk } from "../../reducers/proposal";
import AppContext from "../../share/context";
import { TParseProposalDetail } from "../../types/ProposalDetail";
import { AddCircleOutlineOutlined } from "@mui/icons-material";

export default function CreateProposal() {
  const { setBreads } = useContext(AppContext) as any;
  useEffect(() => {
    document.title = "Proposol - Proposal Detail";
    setBreads(["Create Proposal"]);
  }, []);
  const { wallet } = useWallet();
  const navigate = useNavigate();
  const [proposalDetail, setProposalDetail]: [TParseProposalDetail, Function] =
    useState({
      detail: {
        accountType: 100,
        name: "",
        numberOfTransactions: 0,
        numberOfApprovals: 0,
        description: "",
        imageUrl: "",
        createdAt: 0,
        expireOrFinalizeAfter: Math.floor(Date.now() / 1000),
        creator: "",
        isApproved: 0,
        approvedAt: 0,
        isSettled: 0,
        settledAt: 0,
        isRejected: 0,
        rejectedAt: 0,
        isExecuted: 0,
        executedAt: 0,
      },
      pda: "",
    });
  const { setLoadingMessage, setError, setSuccess } = useContext(
    AppContext
  ) as any;
  const { connection } = useConnection();
  const dispatch = useDispatch();
  async function createProposal() {
    const {
      detail: { name, description, expireOrFinalizeAfter, imageUrl },
    } = proposalDetail;
    setLoadingMessage("Creating proposal");
    try {
      const payload = await dispatch(
        createProposalThunk({
          endpoint: connection.rpcEndpoint,
          address: wallet?.adapter.publicKey as any,
          providerName: wallet?.adapter.name,
          data: {
            name,
            description,
            expireOrFinalizeAfter,
            imageUrl,
          },
        } as any) as any
      ).unwrap();
      setLoadingMessage("");
      setSuccess({
        message: `Proposal ${name} created! You may need to refresh the page to see the change!`,
        txid: payload.txid,
      });
      navigate(`/get-proposal/${payload.proposalPda}`);
      return payload.txid;
    } catch (error: any) {
      setError(error);
      setLoadingMessage("");
    }
  }
  return (
    <>
      <Stack
        direction="column"
        justifyContent="center"
        alignContent="center"
        alignItems="center"
      >
        <ProposalCreate
          proposal={proposalDetail}
          setDetail={setProposalDetail}
        />
        <Button
          startIcon={<AddCircleOutlineOutlined />}
          onClick={createProposal}
          color="secondary"
          variant="text"
        >
          Create
        </Button>
      </Stack>
    </>
  );
}
