/* eslint-disable react-hooks/exhaustive-deps */
import {
  useContext, useEffect, useState,
} from 'react';
import {
  useParams,
} from 'react-router-dom';
import { Button, Stack } from '@mui/material';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import AppContext from '../../share/context';
import MyGrid from '../../components/MyGrid';
import { BoltOutlined } from '@mui/icons-material';
import ProposalCreateDialog from '../../components/Proposal/CreateProposalDialog';
import { useSelector, useDispatch } from 'react-redux';
import { listProposalsByWallet } from '../../reducers/proposal.reducer';
import ListProposalInfo from '../../components/Proposal/ListInfo';



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
      <ListProposalInfo  proposals={assets}/>
      </MyGrid>
    </Stack>
  </>)
}