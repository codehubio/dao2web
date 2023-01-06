/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Button, Grid, TextField } from "@mui/material";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import AppContext from "../../share/context";
import { TParseProposalDetail } from "../../types/ProposalDetail";
import { createProposalThunk } from "../../reducers/proposal";
import { useNavigate } from "react-router-dom";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
export default function ProposalCreate() {
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
  const handleDateChange = (newValue: Dayjs | null) => {
    setProposalDetail({
      ...proposalDetail,
      detail: {
        ...proposalDetail.detail,
        expireOrFinalizeAfter: newValue
          ? Math.floor(newValue.toDate().valueOf() / 1000)
          : 0,
      },
    });
  };
  const { setLoadingMessage, setError, setSuccess } = useContext(
    AppContext
  ) as any;
  const { connection } = useConnection();
  const dispatch = useDispatch();
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
        message: `Proposal ${name} created! You may need to refresh the page to see the change!`,
        txid: payload.txid,
      });
      navigate(`/get-proposal/${payload.proposalPda}`);
    } catch (error: any) {
      console.log(error);
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
        alignContent="center"
        textAlign="center"
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
        {/* <Grid item xs={12}>
          <TextField
            onChange={setField.bind(null, "expireOrFinalizeAfter")}
            style={{ width: "100%" }}
            label="Expiration after"
            placeholder="Expiration time of the proposal if it is unfinalized. Leave blank to ignore"
            variant="outlined"
            color="primary"
          />
        </Grid> */}
        <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              disablePast={true}
              label="Expire after"
              value={dayjs(
                new Date(proposalDetail.detail.expireOrFinalizeAfter * 1000)
              )}
              onChange={handleDateChange}
              renderInput={(params) => (
                <TextField sx={{ width: "100%" }} {...params} />
              )}
            />
          </LocalizationProvider>
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
