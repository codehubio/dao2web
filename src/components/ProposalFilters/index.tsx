import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { TListProposalFilter } from "../../services/state/proposal";

export default function ProposalListFilters({
  filters,
  setFilters,
}: {
  filters: TListProposalFilter & {
    isMyProposal?: boolean;
    isInvolved?: boolean;
  };
  setFilters: Function;
}) {
  function updateFilters(field: string) {
    const newFilters: any = {
      ...filters,
      [field]: !(filters as any)[field],
    };
    setFilters(newFilters);
  }
  return (
    <FormGroup row={true}>
      <FormControlLabel
        control={
          <Checkbox
            checked={!!filters.isMyProposal}
            onChange={updateFilters.bind(null, "isMyProposal")}
          />
        }
        label="Owned"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={!!filters.isInvolved}
            onChange={updateFilters.bind(null, "isInvolved")}
          />
        }
        label="Involved"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={!!filters.isSettled}
            onChange={updateFilters.bind(null, "isSettled")}
          />
        }
        label="Settled"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={!!filters.isApproved}
            onChange={updateFilters.bind(null, "isApproved")}
          />
        }
        label="Approved"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={!!filters.isRejected}
            onChange={updateFilters.bind(null, "isRejected")}
          />
        }
        label="Rejected"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={!!filters.isExecuted}
            onChange={updateFilters.bind(null, "isExecuted")}
          />
        }
        label="Executed"
      />
    </FormGroup>
  );
}
