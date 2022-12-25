import { Grid, TextField } from "@mui/material";
import { TParseProposalDetail } from "../../types/ProposalDetail";
export default function ProposalCreate({
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
            label="name (16-char max)"
            variant="outlined"
            color="primary"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            onChange={setField.bind(null, "description")}
            style={{ width: "100%" }}
            label="description (128-char max)"
            variant="outlined"
            color="primary"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            onChange={setField.bind(null, "imageUrl")}
            style={{ width: "100%" }}
            value="https://picsum.photos/200"
            label="image url (128-char max)"
            variant="outlined"
            color="primary"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            onChange={setField.bind(null, "expireOrFinalizeAfter")}
            style={{ width: "100%" }}
            label="expiration in seconds"
            variant="outlined"
            color="primary"
          />
        </Grid>
      </Grid>
    </>
  );
}
