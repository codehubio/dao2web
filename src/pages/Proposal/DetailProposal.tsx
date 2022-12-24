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
  const [reload, setShouldReloase] = useState(false);
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
      } catch (error) {
        setError(error as any)
      }
      setLoadingMessage('');
    }
    getDetail();
  }, [proposalPda, reload])
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
            <TableCell align="left">Amount</TableCell>
            <TableCell align="left">Token</TableCell>
            <TableCell align="left">Sender</TableCell>
            <TableCell align="left">Receiver</TableCell>
            <TableCell align="left">Incentive rate</TableCell>
            <TableCell align="left">Execute after (in seconds)</TableCell>
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
                <TableCell  align="left">
                  {s.token.substr(0, 4)}...
                </TableCell>
                <TableCell  align="left">
                  {s.sender.substr(0, 4)}...
                </TableCell>
                <TableCell  align="left">
                  {s.receiver.substr(0, 4)}...
                </TableCell>
                <TableCell  align="left">
                  {s.incentiveRate}
                </TableCell>
                <TableCell  align="left">
                  {s.executeAfter.toString()}
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

  {proposal && proposal.detail ? <TransactionAddDialog reloadFn={setShouldReloase} proposal={proposal} open={openCreate} handleClose={changeCreateDialogState}/> : <></> }
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
      >Add transaction
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