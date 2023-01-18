/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { editProposalThunk } from "../../reducers/proposal";
import AppContext from "../../share/context";
import { TParseProposalDetail } from "../../types/ProposalDetail";
import { AddCircleOutlineOutlined } from "@mui/icons-material";
import ProposalCreateOrEdit from "../Proposal/ProposalCreateOrEdit";
import CancelButton from "../CancelButton";

export default function EditProposalDialog({
  proposal,
  reloadFn,
  handleClose,
  open,
}: {
  proposal: TParseProposalDetail;
  reloadFn: Function;
  open: boolean;
  handleClose: any;
}) {
  const { setBreads } = useContext(AppContext) as any;
  useEffect(() => {
    document.title = "Proposol - Proposal Edit";
    setBreads(["Create Proposal"]);
  }, []);
  const { wallet } = useWallet();
  const navigate = useNavigate();
  const [proposalDetail, setProposalDetail]: [TParseProposalDetail, Function] =
    useState(proposal);
  const { setLoadingMessage, setError, setSuccess } = useContext(
    AppContext
  ) as any;
  const { connection } = useConnection();
  const dispatch = useDispatch();
  async function createProposal() {
    const {
      pda,
      detail: { name, description, expireOrFinalizeAfter, imageUrl },
    } = proposalDetail;
    setLoadingMessage("Updating proposal");
    try {
      const payload = await dispatch(
        editProposalThunk({
          endpoint: connection.rpcEndpoint,
          address: wallet?.adapter.publicKey as any,
          providerName: wallet?.adapter.name,
          pda,
          data: {
            name,
            description,
            expireOrFinalizeAfter: Math.floor(
              new Date(expireOrFinalizeAfter).valueOf() / 100
            ),
            imageUrl,
          },
        } as any) as any
      ).unwrap();
      if (reloadFn) {
        reloadFn();
      }
      setLoadingMessage("");
      setSuccess({
        message: `Proposal ${name} updated! You may need to refresh the page to see the change!`,
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
      <Dialog
        maxWidth="md"
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        color="primary"
      >
        <DialogTitle textAlign="center" sx={{ mb: 1 }} id="alert-dialog-title">
          Edit proposal
        </DialogTitle>
        <DialogContent>
          <ProposalCreateOrEdit
            proposal={proposalDetail}
            setDetail={setProposalDetail}
          />
        </DialogContent>
        <DialogActions>
          <Stack width="100%" direction="row" justifyContent="center">
            <Button
              startIcon={<AddCircleOutlineOutlined />}
              onClick={createProposal}
              color="primary"
              variant="text"
            >
              Update
            </Button>
            <CancelButton handleClose={handleClose} />
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
}
