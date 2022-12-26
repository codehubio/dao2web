import { createAsyncThunk } from "@reduxjs/toolkit";
import { Connection, PublicKey } from "@solana/web3.js";
import { sendTransaction } from "../../services/tx.service";
import { getProvider } from "../../services/wallet.service";
import rejectStepInstruction from "../../services/instructions/reject-transaction";
import { getStepByPda } from "../../services/state/transaction";

const approveTxThunk = createAsyncThunk(
  "rejectTx",
  async ({
    endpoint,
    address,
    providerName,
    data: { proposalPda, transactionIndex, reason },
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
      const { rawTx, transactionPda } = await rejectStepInstruction(
        connection,
        wallet,
        {
          proposalPda: new PublicKey(proposalPda),
          transactionIndex,
          reason,
        }
      );
      const txid = await sendTransaction(connection, provider, rawTx);
      const { detail } = await getStepByPda(connection, transactionPda, 10);
      return { txid, proposalPda: proposalPda, detail };
    } catch (error) {
      throw error;
    }
  }
);

export default approveTxThunk;
