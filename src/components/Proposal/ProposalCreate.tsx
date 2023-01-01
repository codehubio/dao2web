/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Grid, TextField } from "@mui/material";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import AppContext from "../../share/context";
import { TParseProposalDetail } from "../../types/ProposalDetail";
import { createProposalThunk } from "../../reducers/proposal";
export default function ProposalCreate() {
  const { wallet } = useWallet();
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
        expireOrFinalizeAfter: 0,
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
  function setField(fieldName: string, e: any) {
    setProposalDetail({
      ...proposalDetail,
      detail: {
        ...proposalDetail.detail,
        [fieldName]: e.target.value,
      },
    });
  }
  const { setLoadingMessage, setError, setSuccess, setBreads } = useContext(
    AppContext
  ) as any;
  const { connection } = useConnection();
  const dispatch = useDispatch();
  useEffect(() => {
    setBreads(["Home", "Create Proposal"]);
  }, []);
  async function create() {
    const {
      detail: { name, description, expireOrFinalizeAfter, imageUrl },
    } = proposalDetail;
    setLoadingMessage("Creating proposal");
    let txid;
    try {
      const { payload } = await dispatch(
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
      );
      setLoadingMessage("");
      setSuccess({
        message: `Proposal ${name} created!  You may need to refresh the page to see the change!`,
        txid: payload.txid,
      });
    } catch (error: any) {
      setError(error);
    }
    return txid;
  }
  return (
    <>
      <Grid
        container
        style={{ width: "100%" }}
        spacing={2}
        direction="row"
        alignItems="center"
        justifyContent="center"
        // alignContent="center"
        mb={1}
      >
        <Grid item xs={12}>
          <TextField
            onChange={setField.bind(null, "name")}
            style={{ width: "100%" }}
            label="Name (16-char max)"
            variant="outlined"
            color="primary"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            onChange={setField.bind(null, "description")}
            style={{ width: "100%" }}
            label="Description (128-char max)"
            variant="outlined"
            color="primary"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            onChange={setField.bind(null, "imageUrl")}
            style={{ width: "100%" }}
            label="Image url (128-char max)"
            variant="outlined"
            color="primary"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            onChange={setField.bind(null, "expireOrFinalizeAfter")}
            style={{ width: "100%" }}
            label="Expiration after"
            placeholder="Expiration time of the proposal if it is unfinalized. Leave blank to ignore"
            variant="outlined"
            color="primary"
          />
        </Grid>
        <Grid item xs={12}>
          <Button onClick={create} color="primary" variant="contained">
            Create
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
