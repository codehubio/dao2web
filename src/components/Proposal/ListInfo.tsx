import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import { TParseProposalDetail } from '../../types/ProposalDetail';
import { TableRow } from '@mui/material';
import ProposalInfo from './Info';
import { useState } from 'react';
export default function ListProposalInfo1({ proposals }: {
  proposals: (TParseProposalDetail) [],
}) {
  const [openListSteps, setOpenListSteps] = useState(false);
  function changeListStepState() {
    setOpenListSteps(!openListSteps);
  }
  function notify(detail: TParseProposalDetail & { pda: string }) {
    changeListStepState();
  }
  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Description</TableCell>
              <TableCell align="left"># of steps</TableCell>
              <TableCell align="left"># of approvals</TableCell>
              <TableCell align="left">Status</TableCell>
              <TableCell />

            </TableRow>
          </TableHead>
          <TableBody>
            {proposals.map((proposal: any, index: number) => {
              return <ProposalInfo key={index} proposal={proposal} notify={notify} />
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}