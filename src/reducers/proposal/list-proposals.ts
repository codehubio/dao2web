import { createAsyncThunk } from "@reduxjs/toolkit";
import { Connection } from "@solana/web3.js";
import {
  listProposals,
  TListProposalFilter,
} from "../../services/state/proposal";
export const listProposalsThunk = createAsyncThunk(
  "listProposals",
  async ({
    endpoint,
    options,
  }: {
    endpoint: string;
    options: TListProposalFilter;
  }) => {
    const connection = new Connection(endpoint);
    const proposals = await listProposals(connection, options);
    console.log(proposals);
    return proposals;
  }
);

export default listProposalsThunk;
