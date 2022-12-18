import { BoltOutlined } from '@mui/icons-material';
import { Button, Grid } from '@mui/material';
import {
  useState,
} from 'react';
import ProposalDetail from '../../components/Proposal/Detail';
import { TParseProposalDetail } from '../../types/ProposalDetail';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import createProposalInstruction from '../../services/instructions/create-proposal';
import MyGrid from '../../components/MyGrid';
import Title from '../../components/Title';
import { sendTransaction } from '../../services/tx.service';

export default function CreateProsal() {
  const [proposalDetail, setProposalDetail] : [TParseProposalDetail, Function] = useState({
    accountType: 100,
    name: '',
    numberOfSteps: 0,
    numberOfApprovals:  0,
    description: '',
    createdAt:  0,
    expireOrFinalizeAfter:  0,
    creator: '',
    isApproved: 0,
    approvedAt: 0,
    isSettled: 0,
    settledAt: 0,
    isRejected: 0,
    rejectedAt: 0,
  });
  const { wallet } = useWallet();
  const { connection } = useConnection();
  async function create() {
    const {
      name,
      description,
      expireOrFinalizeAfter,
    } = proposalDetail
    const rawTx = await createProposalInstruction(
      connection,
      wallet?.adapter.publicKey as any, {
        name,
        description,
        expireOrFinalizeAfter,
      }
    );
    const txid = await sendTransaction(connection, wallet?.adapter, rawTx);
    return txid;
  }
  return (<>
        <MyGrid
          container
          style={{width: '100%'}}
          spacing={2}
          direction="column"
          alignItems="center"
          justifyContent="center">
            <Grid>
              <Title title="create proposal"></Title>
            </Grid>
            <Grid>
              <ProposalDetail setDetail={setProposalDetail} detail={proposalDetail}/>
            </Grid>
            <Grid>
              <Button
                onClick={create}
                color='success'
                variant="outlined"
                startIcon={<BoltOutlined />}
              >create
        </Button>
          </Grid>
        </MyGrid>
  </>)
}

