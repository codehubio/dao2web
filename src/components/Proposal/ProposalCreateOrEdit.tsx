/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from "@mui/material";
import { TParseProposalDetail } from "../../types/ProposalDetail";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
export default function ProposalCreateOrEdit({
  setDetail,
  proposal,
}: {
  setDetail: Function;
  proposal: TParseProposalDetail;
}) {
  function setField(fieldName: string, e: any) {
    setDetail({
      ...proposal,
      detail: {
        ...proposal.detail,
        [fieldName]: e.target.value,
      },
    });
  }
  const [datePickerValue, setDatePickerValue] = useState(dayjs());
  function changeDatePickerState(status: boolean) {
    setDatePickerEnabled(status);
    const value = status ? Math.floor(datePickerValue.toDate().valueOf()) : 0;
    setDetail({
      ...proposal,
      detail: {
        ...proposal.detail,
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
      </Grid>
    </>
  );
}
