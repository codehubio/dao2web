import { createAsyncThunk } from "@reduxjs/toolkit";
import { Connection, PublicKey } from "@solana/web3.js";
import { getStepByPda } from "../../services/state/step";

const getStatByWalletThunk = createAsyncThunk(
  "getTransactionByPda",
  async ({
    endpoint,
    data: { transactionPda },
  }: {
    endpoint: string;
    data: any;
  }) => {
    if (!transactionPda || !endpoint) {
      return null;
    }
    const connection = new Connection(endpoint);
    const { detail } = await getStepByPda(
      connection,
      new PublicKey(transactionPda)
    );
    return {
      transactionPda,
      detail,
    };
  }
);

export default getStatByWalletThunk;
