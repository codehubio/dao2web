import { Avatar, TableCell, TableRow, Tooltip, Zoom } from "@mui/material";
import { Fragment } from "react";
import { TParseProposalDetail } from "../../types/ProposalDetail";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
export default function ProposalInfo({
  proposal,
}: {
  proposal: TParseProposalDetail;
}) {
  const {
    detail: { description },
  } = proposal;
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
    navigate(`/get-proposal/${proposal?.pda}`);
  }
  function getExpiration() {
    const expireAt = dayjs(proposal?.detail.expireOrFinalizeAfter);
    if (expireAt.valueOf() === 0) {
      return "None";
    }
    return expireAt.format("YYYY/MM/DD HH:mm:ss");
  }
  function getCreatedAt() {
    const createdAt = dayjs(proposal?.detail.createdAt);
    return createdAt.format("YYYY/MM/DD HH:mm:ss");
  }
  return proposal && proposal.detail ? (
    <Fragment>
      <TableRow
        onClick={redirect}
        hover={true}
        sx={{
          "& > *": { borderBottom: "unset" },
        }}
      >
        <TableCell component="th" scope="row">
          <Avatar alt={proposal.detail.name} src={proposal.detail.imageUrl} />
        </TableCell>
        <TableCell align="left">{proposal.detail.name}</TableCell>
        <Tooltip TransitionComponent={Zoom} title={description}>
          <TableCell align="left">
            {description.substring(0, 12)}
            {description.indexOf("\u0000") > 12 ? "..." : ""}
          </TableCell>
        </Tooltip>
        <TableCell align="left">
          {proposal.detail.numberOfEnabledTransactions}
        </TableCell>
        <TableCell align="left">{proposal.detail.numberOfApprovals}</TableCell>
        <TableCell align="left">{getStatus()}</TableCell>
        <TableCell align="left">{getExpiration()}</TableCell>
        <TableCell align="left">{getCreatedAt()}</TableCell>
      </TableRow>
    </Fragment>
  ) : (
    <></>
  );
}
