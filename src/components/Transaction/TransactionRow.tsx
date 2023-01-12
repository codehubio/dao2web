import {
  Button,
  Collapse,
  IconButton,
  TableCell,
  TableRow,
  Tooltip,
  Zoom,
} from "@mui/material";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useContext, useState } from "react";
import { executeTxThunk, revertTxThunk } from "../../reducers/proposal";
import { TParseProposalDetail } from "../../types/ProposalDetail";
import { TParsedTransactionDetail } from "../../types/TransactionDetail";
import TransactionApproveDialog from "../Dialog/ApproveTransactionDialog";
import TransactionRejectDialog from "../Dialog/RejectTransactionDialog";
import { useDispatch } from "react-redux";
import AppContext from "../../share/context";
import {
  KeyboardArrowDown,
  CheckCircleOutlined,
  KeyboardArrowUp,
  DoNotDisturbOnOutlined,
} from "@mui/icons-material";
import ApprovalList from "../Approval/ApprovalList";

export default function TransactionInfo({
  proposal,
  transaction,
  reloadFn,
}: {
  proposal: TParseProposalDetail;
  transaction: TParsedTransactionDetail;
  reloadFn: Function;
}) {
  const { wallet } = useWallet();
  const { connection } = useConnection();
  const dispatch = useDispatch();
  const { detail: txDetail } = transaction;
  const { detail: pDetail } = proposal;
  const [openApproveTx, setOpenApproveTx] = useState(false);
  const [openRejectTx, setOpenRejectTx] = useState(false);
  const { setLoadingMessage, setError, setSuccess } = useContext(
    AppContext
  ) as any;

  function isAbleToApproveOrReject() {
    return (
      pDetail.isSettled &&
      !pDetail.isRejected &&
      !pDetail.isApproved &&
      !txDetail.isRejected &&
      !txDetail.isApproved &&
      txDetail.sender === wallet?.adapter.publicKey?.toBase58()
    );
  }

  function isAbleToApprove() {
    return (
      pDetail.isSettled &&
      !pDetail.isRejected &&
      !pDetail.isApproved &&
      !txDetail.isRejected &&
      !txDetail.isApproved &&
      (txDetail.sender === wallet?.adapter.publicKey?.toBase58() ||
        txDetail.sender === "11111111111111111111111111111111")
    );
  }

  function isAbleToExecute() {
    return pDetail.isApproved && !txDetail.isExecuted;
  }
  function isAbleToRevert() {
    return (
      pDetail.isRejected &&
      !txDetail.isReverted &&
      txDetail.numberOfApprovals > 0
    );
  }
  function changeApproveTxDialogState() {
    setOpenApproveTx(!openApproveTx);
  }
  function changeRejectTxDialogState() {
    setOpenRejectTx(!openRejectTx);
  }
  async function executeTx() {
    const {
      detail: { index, proposalPda, name },
    } = transaction;
    setLoadingMessage("approving transaciton");
    let txid;
    try {
      await dispatch(
        executeTxThunk({
          endpoint: connection.rpcEndpoint,
          address: wallet?.adapter.publicKey as any,
          providerName: wallet?.adapter.name,
          data: {
            transactionIndex: index,
            proposalPda,
          },
        } as any) as any
      );
      if (reloadFn) {
        reloadFn(true);
      }
    } catch (error: any) {
      setError(error);
    }
    setLoadingMessage("");
    setSuccess({
      message: `Transaaction ${name} executed! You may need to refresh the page to see the change!`,
    });
    return txid;
  }
  async function revertTx() {
    const {
      detail: { index, proposalPda, name, numberOfApprovals },
    } = transaction;
    setLoadingMessage("reverting transaciton");
    try {
      const payload = await dispatch(
        revertTxThunk({
          endpoint: connection.rpcEndpoint,
          address: wallet?.adapter.publicKey as any,
          providerName: wallet?.adapter.name,
          data: {
            transactionIndex: index,
            proposalPda,
            numberOfApprovals,
          },
        } as any) as any
      ).unwrap();
      if (reloadFn) {
        reloadFn(true);
      }
      setLoadingMessage("");
      setSuccess({
        message: `Transaaction ${name} reverted! You may need to refresh the page to see the change!`,
        txid: payload.txid,
      });
      return payload.txid;
    } catch (error: any) {
      setError(error);
    }
  }
  const [open, setOpen] = useState(false);
  return (
    <>
      <TransactionApproveDialog
        reloadFn={reloadFn}
        transaction={transaction}
        open={openApproveTx}
        handleClose={changeApproveTxDialogState}
      />
      <TransactionRejectDialog
        reloadFn={reloadFn}
        transaction={transaction}
        open={openRejectTx}
        handleClose={changeRejectTxDialogState}
      />
      <TableRow>
        <TableCell align="left">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell align="left">{txDetail.name}</TableCell>
        <TableCell align="left">{txDetail.description}</TableCell>
        <TableCell align="left">{txDetail.amount}</TableCell>
        <TableCell align="left">{txDetail.receivedAmount}</TableCell>
        <Tooltip TransitionComponent={Zoom} title={txDetail.token}>
          <TableCell align="left">
            {txDetail.token === "11111111111111111111111111111111"
              ? "Native"
              : `${txDetail.token.substring(0, 6)}...`}
          </TableCell>
        </Tooltip>
        <Tooltip TransitionComponent={Zoom} title={txDetail.sender}>
          <TableCell align="left">
            {txDetail.sender.substring(0, 6)}...
          </TableCell>
        </Tooltip>
        <Tooltip TransitionComponent={Zoom} title={txDetail.receiver}>
          <TableCell align="left">
            {txDetail.receiver.substring(0, 6)}...
          </TableCell>
        </Tooltip>
        <TableCell align="left">{txDetail.incentiveFee}</TableCell>
        <TableCell align="left">{txDetail.executeAfter.toString()}</TableCell>
        <TableCell align="left">
          {isAbleToApprove() ? (
            <Button
              color="secondary"
              variant="text"
              onClick={changeApproveTxDialogState}
              startIcon={<CheckCircleOutlined />}
            >
              Approve
            </Button>
          ) : (
            <></>
          )}
          {isAbleToApproveOrReject() ? (
            <Button
              color="secondary"
              variant="text"
              disabled={!isAbleToApproveOrReject()}
              onClick={changeRejectTxDialogState}
              startIcon={<DoNotDisturbOnOutlined />}
            >
              Reject
            </Button>
          ) : (
            <></>
          )}
          {isAbleToExecute() ? (
            <Button onClick={executeTx} color="secondary" variant="text">
              Execute
            </Button>
          ) : (
            <></>
          )}
          {isAbleToRevert() ? (
            <Button onClick={revertTx} color="secondary" variant="text">
              Revert
            </Button>
          ) : (
            <></>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={open} unmountOnExit timeout="auto">
            <ApprovalList transaction={transaction} proposal={proposal} />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
