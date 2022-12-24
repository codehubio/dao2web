import { createAsyncThunk } from "@reduxjs/toolkit";
import { Connection, PublicKey } from "@solana/web3.js";
import { listProposalsByInvolve } from "../../services/state/proposal";
export const listProposalsByInvolveThunk = createAsyncThunk(
  "listProposalsInvolve",
  async ({ endpoint, address }: { endpoint: string; address: string }) => {
    const connection = new Connection(endpoint);
    const wallet = new PublicKey(address);
    const proposals = await listProposalsByInvolve(connection, wallet);
    console.log(proposals);
    return proposals;
  }
);

export default listProposalsByInvolveThunk;
