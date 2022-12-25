import { Avatar, TableCell, TableRow } from "@mui/material";
import { Fragment } from "react";
import { TParseProposalDetail } from "../../types/ProposalDetail";
import { useNavigate } from "react-router-dom";
export default function ProposalInfo({
  proposal,
}: {
  proposal: TParseProposalDetail | null;
}) {
  const navigate = useNavigate();
  function getStatus(): string {
    if (!proposal?.detail) {
      return "Pending";
    }
    if (proposal.detail.isExecuted) {
      return "Executed";
    } else if (proposal.detail.isApproved) {
      return "Approved";
    } else if (proposal.detail.isRejected) {
      return "Rejected";
    } else if (proposal.detail.isSettled) {
      return "Settled";
    }
    return "Pending";
  }
  function redirect() {
    navigate(`/detail-proposal/${proposal?.pda}`);
  }

  return proposal && proposal.detail ? (
    <Fragment>
      <TableRow
        onClick={redirect.bind(null, proposal.pda)}
        hover={true}
        sx={{ "& > *": { borderBottom: "unset" } }}
      >
        <TableCell component="th" scope="row">
          <Avatar alt={proposal.detail.name} src={proposal.detail.imageUrl} />
        </TableCell>
        <TableCell align="left">{proposal.detail.name}</TableCell>
        <TableCell align="left">{proposal.detail.description}</TableCell>
        <TableCell align="left">{proposal.detail.numberOfSteps}</TableCell>
        <TableCell align="left">{proposal.detail.numberOfApprovals}</TableCell>
        <TableCell align="left">{getStatus()}</TableCell>
      </TableRow>
    </Fragment>
  ) : (
    <></>
  );
}
