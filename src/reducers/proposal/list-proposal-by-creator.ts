import { createAsyncThunk } from "@reduxjs/toolkit";
import { Connection, PublicKey } from "@solana/web3.js";
import { listProposals } from "../../services/state/proposal";
export const listProposalsByWalletThunk = createAsyncThunk(
  "listProposalsCreatedByWallet",
  async ({ endpoint, address }: { endpoint: string; address: string }) => {
    const connection = new Connection(endpoint);
    const wallet = new PublicKey(address);
    const proposals = await listProposals(connection, wallet);
    return proposals;
  }
);

export default listProposalsByWalletThunk;
