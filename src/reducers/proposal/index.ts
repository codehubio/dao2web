import { createSlice } from "@reduxjs/toolkit";
import createProposalThunk from "./create-proposal";
import editProposalThunk from "./edit-proposal";
import listProposalsByWalletThunk from "./list-proposals-by-creator";
import addTxToProposalThunk from "./add-tx-to-proposal";
import settleProposalThunk from "./settle-proposal";
import getStatByWalletThunk from "./add-tx-to-proposal";
import listProposalsByInvolveThunk from "./list-proposals-by-involve";
import approveTxThunk from "./approve-tx";
import rejectTxThunk from "./reject-tx";
import executeTxThunk from "./execute-tx";
import revertTxThunk from "./revert-tx";
import listProposalsThunk from "./list-proposals";
import getTransactionByPda from "./get-transaction-by-pda";
import getProposalByPda from "./get-proposal-by-pda";
import editTx from "./edit-tx";
import removeTx from "./remove-tx";
import removeProposal from "./remove-proposal";

export { createProposalThunk };
export { editProposalThunk };
export { listProposalsByWalletThunk };
export { addTxToProposalThunk };
export { settleProposalThunk };
export { getStatByWalletThunk };
export { listProposalsByInvolveThunk };
export { approveTxThunk };
export { rejectTxThunk };
export { executeTxThunk };
export { revertTxThunk };
export { listProposalsThunk };
export { getTransactionByPda };
export { getProposalByPda };
export { editTx };
export { removeTx };
export { removeProposal };

export const proposalsSlice = createSlice({
  name: "proposals",
  initialState: {
    createdProposals: [],
    involveProposals: [],
    numberOfProposals: 0,
  },
  reducers: {},
});

export default proposalsSlice.reducer;
