import { createAsyncThunk } from "@reduxjs/toolkit";
import { Connection, PublicKey } from "@solana/web3.js";
import { getProposalByPda } from "../../services/state/proposal";

const getStatByWalletThunk = createAsyncThunk(
  "getProposalByPda",
  async ({
    endpoint,
    data: { proposalPda },
  }: {
    endpoint: string;
    data: any;
  }) => {
    if (!proposalPda || !endpoint) {
      return null;
    }
    const connection = new Connection(endpoint);
    const { readableData } = await getProposalByPda(
      connection,
      new PublicKey(proposalPda)
    );
    return {
      pda: proposalPda,
      detail: readableData,
    };
  }
);

export default getStatByWalletThunk;
