/* eslint-disable react-hooks/exhaustive-deps */
import {
  useContext, useEffect, useState,
} from 'react';
import {
  useParams
} from 'react-router-dom';
import {
  PublicKey
} from '@solana/web3.js';
import { Grid, Chip } from '@mui/material';
import { listProposals } from '../../services/state/proposal';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import AppContext from '../../share/context';
import ProposalCard from '../../components/Proposal/Card';
export default function ListProposals() {
  const { connection } = useConnection();
  const { wallet } = useWallet();
  const { setLoadingMessage, setError } = useContext(AppContext) as any;
  const [assets, setAssets] = useState([]);
  const { address } = useParams();
  const addressPubkey = address ? new PublicKey(address) : wallet?.adapter.publicKey;
  useEffect(() => {
    
    async function getAssets() {
      // await listOurNftsFromAddress(connection, new PublicKey(address))
      setLoadingMessage('loading assets ...');
      try {
        const _assets = await listProposals(connection, addressPubkey as PublicKey)
        console.log(_assets);
        setAssets(_assets as any);
      } catch (error) {
        setError(error as any)
      }
      setLoadingMessage('');
    }
    getAssets();
  }, [wallet?.adapter.publicKey])
  function renderProposalList() {
    return assets.map((a, index) => (<Grid key={index} item xs={3}>
        <ProposalCard detail={a}/>
    </Grid>))
  }
  return (<>
      <Grid
        container
        alignContent='center'
        alignItems='center'
        spacing={2}
        sx={{ mt: 10 }}
      >
        {assets && assets.length ? renderProposalList() : <Grid item xs={12}><Chip color='info' label='you have no proposal'/></Grid>}
      </Grid>
  </>)
}