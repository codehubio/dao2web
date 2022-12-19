/* eslint-disable react-hooks/exhaustive-deps */
import {
  useContext, useEffect, useState,
} from 'react';
import {
  useParams
} from 'react-router-dom';
import { Grid, Chip, Button, Stack } from '@mui/material';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import AppContext from '../../share/context';
import ProposalCard from '../../components/Proposal/Info';
import MyGrid from '../../components/MyGrid';
import { BoltOutlined } from '@mui/icons-material';
import ProposalCreateDialog from '../../components/Proposal/CreateDialog';
import { useSelector, useDispatch } from 'react-redux';
import { listProposalsByWallet } from '../../reducers/proposal.reducer';



export default function ListProposals() {
  const assets =  useSelector(({ proposalReducer: { createdProposals } }: any) => createdProposals);
  const { connection } = useConnection();
  const { wallet } = useWallet();
  const { setLoadingMessage, setError } = useContext(AppContext) as any;
  // const [assets, setAssets] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const { address } = useParams();
  const dispatch = useDispatch();
  const addressPubkey = address || wallet?.adapter.publicKey?.toBase58();
  useEffect(() => {
    async function getAssets() {
      setLoadingMessage('loading assets ...');
      try {
        await dispatch(listProposalsByWallet({
          endpoint: connection.rpcEndpoint, address: addressPubkey
        } as any) as any);
      } catch (error) {
        setError(error as any)
      }
      setLoadingMessage('');
    }
    getAssets();
  }, [addressPubkey])
  function changeCreateDialogState() {
    setOpenCreate(!openCreate);
  }
  function renderProposalList() {
    return assets.map((a: any, index: number) => (<Grid key={index} item xs={3}>
        <ProposalCard detail={a}/>
    </Grid>))
  }
  return (<>
    <ProposalCreateDialog open={openCreate} handleClose={changeCreateDialogState}/>
    <Stack direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={2}>
      
    <Button
        onClick={changeCreateDialogState}
        color='primary'
        variant="contained"
        startIcon={<BoltOutlined />}
      >create new proposal
    </Button>
    <MyGrid
      direction="row"
    >
        {assets && assets.length ? renderProposalList() : <Grid item xs={12}><Chip color='info' label='you have no proposal'/></Grid>}
      </MyGrid>
    </Stack>
  </>)
}