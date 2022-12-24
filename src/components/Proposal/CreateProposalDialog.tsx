import { useContext, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ProposalCreate from './ProposalCreate';
import { TParseProposalDetail } from '../../types/ProposalDetail';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import AppContext from '../../share/context';
import { useDispatch } from 'react-redux';
import { createProposal } from '../../reducers/proposal.reducer';

export default function ProposalCreateDialog({ reloadFn, open, handleClose } : {
  open: boolean,
  handleClose: any,
  reloadFn: Function
}) {
  const dispatch = useDispatch();
  const { setLoadingMessage, setError, setSuccess } = useContext(AppContext) as any;
  const [proposalDetail, setProposalDetail] : [TParseProposalDetail, Function] = useState({
    detail: {
      accountType: 100,
      name: '',
      numberOfSteps: 0,
      numberOfApprovals:  0,
      description: '',
      imageUrl: '',
      createdAt:  0,
      expireOrFinalizeAfter:  0,
      creator: '',
      isApproved: 0,
      approvedAt: 0,
      isSettled: 0,
      settledAt: 0,
      isRejected: 0,
      rejectedAt: 0,
    },
    pda: '',
  });
  const { wallet } = useWallet();
  const { connection } = useConnection();
  async function create() {
    const {
      detail: {
        name,
        description,
        expireOrFinalizeAfter,
        imageUrl,
      }
    } = proposalDetail
    handleClose();
    setLoadingMessage('creating proposal');
    let txid;
    try {
      await dispatch(createProposal({
        endpoint: connection.rpcEndpoint,
        address: wallet?.adapter.publicKey as any, 
        providerName: wallet?.adapter.name, 
        data: {
          name,
          description,
          expireOrFinalizeAfter,
          imageUrl,
        }
     } as any ) as any);
    if (reloadFn) {
      reloadFn(true);
    }
    } catch (error: any) {
      setError(error);
    }
    setLoadingMessage('');
    setSuccess({ message: `proposal ${name} created!` })
    return txid;
  }
  return (
    <>
    
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        color='primary'
      >
        <DialogTitle textAlign="center" sx={{mb:1}} id="alert-dialog-title">
          create a new proposal
        </DialogTitle>
        <DialogContent>
          <ProposalCreate setDetail={setProposalDetail} proposal={proposalDetail}/>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={create}
            color='primary'
            variant='contained'
          >create
          </Button>
          <Button variant='contained' onClick={handleClose} color='error'>
            close
          </Button>
      </DialogActions>
      </Dialog>
    </>
  );
}

