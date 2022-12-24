import { createSlice } from "@reduxjs/toolkit";
import createProposalThunk from "./create-proposal";
import listProposalsByWalletThunk from "./list-proposal-by-creator";
import addTxToProposalThunk from "./add-tx-to-proposal";
import settleProposalThunk from "./settle-proposal";
import getStatByWalletThunk from "./add-tx-to-proposal";

export { createProposalThunk };
export { listProposalsByWalletThunk };
export { addTxToProposalThunk };
export { settleProposalThunk };
export { getStatByWalletThunk };

export const proposalsSlice = createSlice({
  name: "proposals",
  initialState: {
    createdProposals: [],
    numberOfProposals: 0,
  },
  reducers: {},
  extraReducers: (builder: any) => {
    builder.addCase(
      getStatByWalletThunk.fulfilled,
      (state: any, { payload }: any) => {
        state.numberOfProposals = payload
          ? payload.readableData.numberOfProposals
          : 0;
      }
    );
    builder.addCase(
      listProposalsByWalletThunk.fulfilled,
      (state: any, { payload }: any) => {
        state.createdProposals = payload || [];
      }
    );
    builder.addCase(
      createProposalThunk.fulfilled,
      (state: any, { payload }: any) => {
        state.createdProposals.push({
          ...payload.data,
          pda: payload.proposalPda,
          steps: [],
        });
      }
    );
  },
});

export default proposalsSlice.reducer;
