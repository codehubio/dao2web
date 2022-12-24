import { useContext, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import AppContext from '../../share/context';
import { useDispatch } from 'react-redux';
import { addTxToProposal } from '../../reducers/proposal.reducer';
import TransactionAdd from './TransactionAdd';
import { TParseProposalDetail } from '../../types/ProposalDetail';
import { TParsedTransactionDetail } from '../../types/TransactionDetail';

export default function TransactionAddDialog({ open, handleClose, proposal } : {
  open: boolean,
  handleClose: any,
  proposal: TParseProposalDetail
}) {
  const dispatch = useDispatch();
  const { setLoadingMessage, setError, setSuccess } = useContext(AppContext) as any;
  const [transactionDetail, setTransactionDetail] : [TParsedTransactionDetail, Function] = useState({
    accountType: 101,
    index: proposal.detail.numberOfSteps,
    proposalPda: proposal.pda,
    name: '',
    description: '',
    amount: 0,
    receivedAmount: 0,
    numberOfApprovals: 0,
    sender: '6EbhsCu7nDMRYGNXkBNBtcx1gubjrUfR8aQ2ZfPzg2Ur',
    receiver: 'H2knp7o4asKD79eo1PSPAFcahqAXgk6eQUkCcmAExXFU',
    token: '988Hp2QxjbcZu3vgy78CRsNhxnS46YG4nubbYeePgoxa',
    executeAfter: 0,
    incentiveRate: 0,
    incentiveFee: 0,
    addedAt: 0,
    isApproved: 0,
    approvedAt: 0,
    isRejected: 0,
    rejectedAt: 0,
    isExecuted: 0,
    executedAt: 0,
    isReverted: 0,
    revertedAt: 0,
    revertedAmount: 0,
  });
  const { wallet } = useWallet();
  const { connection } = useConnection();
  async function addTx() {
    const {
      proposalPda,
      name,
      description,
      amount,
      token,
      sender,
      receiver,
      executeAfter,
      incentiveRate,
    } = transactionDetail;
    handleClose();
    setLoadingMessage('adding transaction');
    let txid;
    try {
      await dispatch(addTxToProposal({
        endpoint: connection.rpcEndpoint,
        address: wallet?.adapter.publicKey as any, 
        providerName: wallet?.adapter.name, 
        data: {
          proposalPda,
          name,
          description,
          amount,
          token,
          sender,
          receiver,
          executeAfter,
          incentiveRate,
        }
    } as any ) as any);
    } catch (error: any) {
      setError(error);
    }
    setLoadingMessage('');
    setSuccess({ message: `Transaction ${name} created!` })
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
          Add a transaction
        </DialogTitle>
        <DialogContent>
          <TransactionAdd setDetail={setTransactionDetail} detail={transactionDetail}/>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={addTx}
            color='primary'
            variant='contained'
          >Add
          </Button>
          <Button variant='contained' onClick={handleClose} color='error'>
            Close
          </Button>
      </DialogActions>
      </Dialog>
    </>
  );
}

