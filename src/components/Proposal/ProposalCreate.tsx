/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  Button,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from "@mui/material";
import { AddCircleOutlineOutlined, CancelOutlined } from "@mui/icons-material";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import AppContext from "../../share/context";
import { TParseProposalDetail } from "../../types/ProposalDetail";
import { createProposalThunk } from "../../reducers/proposal";
import { useNavigate } from "react-router-dom";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
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
  function setField(fieldName: string, e: any) {
    setProposalDetail({
      ...proposalDetail,
      detail: {
        ...proposalDetail.detail,
        [fieldName]: e.target.value,
      },
    });
  }
  const [datePickerValue, setDatePickerValue] = useState(dayjs());
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
  function changeDatePickerState(status: boolean) {
    setDatePickerEnabled(status);
    const value = status ? Math.floor(datePickerValue.toDate().valueOf()) : 0;
    setProposalDetail({
      ...proposalDetail,
      detail: {
        ...proposalDetail.detail,
        expireOrFinalizeAfter: value,
      },
    });
  }
  const [datePickerEnabled, setDatePickerEnabled] = useState(false);

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
        <Grid item xs={12}>
          <Stack direction="row">
            <RadioGroup
              sx={{ width: "50%" }}
              row
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="no_expiration"
              name="radio-buttons-group"
            >
              <FormControlLabel
                control={<Radio />}
                onChange={changeDatePickerState.bind(null, false)}
                value="no_expiration"
                name="radio-buttons"
                label="No expiration"
              />
              <FormControlLabel
                control={<Radio />}
                onChange={changeDatePickerState.bind(null, true)}
                value="expire_after"
                name="radio-buttons"
                label="Expire after"
              />
            </RadioGroup>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                disablePast={true}
                disabled={!datePickerEnabled}
                label="Expire after"
                value={dayjs()}
                onChange={setDatePickerValue as any}
                renderInput={(params) => (
                  <TextField sx={{ width: "100%" }} {...params} />
                )}
              />
            </LocalizationProvider>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Button
            startIcon={<AddCircleOutlineOutlined />}
            onClick={create}
            color="primary"
            variant="text"
          >
            Create
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
