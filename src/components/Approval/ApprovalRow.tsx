import { Button, TableCell, TableRow, Tooltip, Zoom } from "@mui/material";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useContext } from "react";
import { revertTxThunk } from "../../reducers/proposal";
import { TParsedTransactionDetail } from "../../types/TransactionDetail";
import { useDispatch } from "react-redux";
import AppContext from "../../share/context";
import { TParsedApprovalDetail } from "../../types/ApprovalDetail";
import { TParseProposalDetail } from "../../types/ProposalDetail";
export default function ApprovalInfo({
  proposal,
  approval,
  transaction,
  reloadFn,
}: {
  proposal: TParseProposalDetail;
  approval: TParsedApprovalDetail;
  transaction: TParsedTransactionDetail;
  reloadFn?: Function;
}) {
  const { wallet } = useWallet();
  const { connection } = useConnection();
  const dispatch = useDispatch();
  const { detail: aDetail } = approval;
  const { detail: pDetail } = proposal;
  const { setLoadingMessage, setError, setSuccess } = useContext(
    AppContext
  ) as any;

  function isAbleToRevert() {
    return pDetail.isRejected && !aDetail.isReverted;
  }
  async function revertApproval() {
    const {
      detail: { index, proposalPda, name, numberOfApprovals },
    } = transaction;
    setLoadingMessage("reverting transaciton");
    let txid;
    try {
      await dispatch(
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
      );
      if (reloadFn) {
        reloadFn(true);
      }
    } catch (error: any) {
      setError(error);
    }
    setLoadingMessage("");
    setSuccess({ message: `Transaaction ${name} reverted!` });
    return txid;
  }
  return (
    <>
      <TableRow>
        <TableCell
          style={{ borderTop: "none", borderBottom: "none" }}
          align="left"
        >
          {aDetail.index}
        </TableCell>
        <TableCell
          style={{ borderTop: "none", borderBottom: "none" }}
          align="left"
        >
          {aDetail.approvedAmount}
        </TableCell>
        <Tooltip TransitionComponent={Zoom} title={aDetail.sender}>
          <TableCell
            style={{ borderTop: "none", borderBottom: "none" }}
            align="left"
          >
            {aDetail.sender}
          </TableCell>
        </Tooltip>
        <TableCell
          style={{ borderTop: "none", borderBottom: "none" }}
          align="left"
        >
          {aDetail.incentiveFee}
        </TableCell>
        <TableCell
          style={{ borderTop: "none", borderBottom: "none" }}
          align="left"
        >
          <Button
            onClick={revertApproval}
            color="primary"
            variant="outlined"
            disabled={!isAbleToRevert()}
          >
            Revert
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
}
