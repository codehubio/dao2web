import { createAsyncThunk } from "@reduxjs/toolkit";
import { Connection, PublicKey } from "@solana/web3.js";
import { getStatByAddress } from "../../services/state/stat";

const getStatByWalletThunk = createAsyncThunk(
  "getStatByWallet",
  async ({ endpoint, address }: { endpoint: string; address: string }) => {
    if (!address || !endpoint) {
      return null;
    }
    const connection = new Connection(endpoint);
    const wallet = new PublicKey(address);
    const { pda, readableData } = await getStatByAddress(connection, wallet);
    return {
      pda: pda.toBase58(),
      readableData,
    };
  }
);

export default getStatByWalletThunk;
