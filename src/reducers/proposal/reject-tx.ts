import { createAsyncThunk } from "@reduxjs/toolkit";
import { Connection, PublicKey } from "@solana/web3.js";
import { sendTransaction } from "../../services/tx.service";
import { getProvider } from "../../services/wallet.service";
import rejectStepInstruction from "../../services/instructions/reject-step";
import { getStepByPda } from "../../services/state/step";

const approveTxThunk = createAsyncThunk(
  "rejectTx",
  async ({
    endpoint,
    address,
    providerName,
    data: { proposalPda, stepIndex, reason },
  }: {
    endpoint: string;
    address: string;
    providerName: string;
    data: any;
  }) => {
    try {
      const provider = getProvider(providerName.toLowerCase());
      const connection = new Connection(endpoint);
      const wallet = new PublicKey(address);
      const { rawTx, stepPda } = await rejectStepInstruction(
        connection,
        wallet,
        {
          proposalPda: new PublicKey(proposalPda),
          stepIndex,
          reason,
        }
      );
      const txid = await sendTransaction(connection, provider, rawTx);
      const { data } = await getStepByPda(connection, stepPda, 10);
      return { txid, proposalPda: proposalPda.toBase58(), data };
    } catch (error) {
      throw error;
    }
  }
);

export default approveTxThunk;
