import { Avatar, Button, TableCell, TableRow } from "@mui/material";
import { Fragment } from "react";
import { TParseProposalDetail } from "../../types/ProposalDetail";
import {
  useNavigate,
} from 'react-router-dom';
import { BoltOutlined } from "@mui/icons-material";
export default function ProposalInfo({ proposal, notify }: {
  proposal: TParseProposalDetail | null,
  notify: Function,
}) {
  const navigate = useNavigate();
  function getStatus(): string {
    if (!proposal?.detail) {
      return 'Pending';
    }
    if (proposal.detail.isApproved) {
      return 'Approved';
    } else if (proposal.detail.isRejected) {
      return 'Rejected';
    } else if (proposal.detail.isSettled) {
      return 'Settled';
    }
    return 'Pending';
  }
  function redirect(pda: string) {
    navigate(`/detail-proposal/${pda}`);
  }
  return proposal && proposal.detail ? (
    <Fragment>
      <TableRow onClick= {redirect.bind(null, proposal.pda)} hover={true} sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell component="th" scope="row">
            <Avatar
                  alt={proposal.detail.name}
                  src={proposal.detail.imageUrl}
                />
        </TableCell>
        <TableCell align="left">{proposal.detail.name}</TableCell>
        <TableCell align="left">{proposal.detail.description}</TableCell>
        <TableCell align="left">{proposal.detail.numberOfSteps}</TableCell>
        <TableCell align="left">{proposal.detail.numberOfApprovals}</TableCell>
        <TableCell align="left">{getStatus()}</TableCell>
        <TableCell  align="left">
          <Button
            color='primary'
            variant="contained"
            startIcon={<BoltOutlined />}
          >Settle
          </Button>
        </TableCell>
      </TableRow>
    </Fragment>
  ) : <></>;
}