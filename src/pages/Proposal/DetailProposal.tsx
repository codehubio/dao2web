/* eslint-disable react-hooks/exhaustive-deps */
import {
  useContext, useEffect, useState,
} from 'react';
import {
  useParams,
} from 'react-router-dom';
import { Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useConnection } from '@solana/wallet-adapter-react';
import AppContext from '../../share/context';
import MyGrid from '../../components/MyGrid';
import { getSteps } from '../../services/state/step';
import { PublicKey } from '@solana/web3.js';
import { BoltOutlined } from '@mui/icons-material';
import TransactionAddDialog from '../../components/Proposal/AddTransactionDialog';
import { TParseProposalDetail } from '../../types/ProposalDetail';



export default function DetailProposal() {
  const { connection } = useConnection();
  const { setLoadingMessage, setError } = useContext(AppContext) as any;
  // const [assets, setAssets] = useState([]);
  const [steps, setSteps] = useState([] as any);
  const [proposal, setProposal] = useState({} as TParseProposalDetail);
  const [openCreate, setOpenCreate] = useState(false);
  const { proposalPda = '' } = useParams();
  useEffect(() => {
    async function getDetail() {
      setLoadingMessage('loading steps ...');
      try {
        const {
          proposalSteps,
          proposalData,
        } = await getSteps(connection, new PublicKey(proposalPda));
        setSteps(proposalSteps);
        setProposal({
          pda: proposalPda,
          detail: proposalData
        });
        console.log(proposal);
      } catch (error) {
        setError(error as any)
      }
      setLoadingMessage('');
    }
    getDetail();
  }, [proposalPda])
  function renderStep() {
    if (!steps.length) {
      return <></>
    }
    return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left">#</TableCell>
            <TableCell align="left">Name</TableCell>
            <TableCell align="left">Description</TableCell>
            <TableCell align="left"># of approvals</TableCell>
            <TableCell align="left">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            steps.map((s: any, index: number) => {
              return (<TableRow key={index}>
                <TableCell  align="left">
                  {s.index}
                </TableCell>
                <TableCell  align="left">
                  {s.name}
                </TableCell>
                <TableCell  align="left">
                  {s.description}
                </TableCell>
                <TableCell  align="left">
                  {s.amount}
                </TableCell>
              </TableRow>)
          })
          }
        </TableBody>
      </Table>
    </TableContainer>)
  
  }
  function changeCreateDialogState() {
    setOpenCreate(!openCreate);
  }
  return (<>

  {proposal && proposal.detail ? <TransactionAddDialog proposal={proposal} open={openCreate} handleClose={changeCreateDialogState}/> : <></> }
    <Stack direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={2}>
      {steps.length === 0 ? <Typography variant='h6'>There is no transaction in this proposal</Typography> : <></>}
    <Button
        onClick={changeCreateDialogState}
        color='primary'
        variant="contained"
        startIcon={<BoltOutlined />}
      >add transaction
    </Button>
    <MyGrid
      direction="row"
    >
      
     {renderStep()}
        {/* {assets && assets.length ? renderProposalList() : <Grid item xs={12}><Chip color='info' label='you have no proposal'/></Grid>} */}
      </MyGrid>
    </Stack>
  </>)
}