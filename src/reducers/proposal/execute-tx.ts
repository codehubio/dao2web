import { createAsyncThunk } from "@reduxjs/toolkit";
import { Connection, PublicKey } from "@solana/web3.js";
import { sendTransaction } from "../../services/tx.service";
import { getProvider } from "../../services/wallet.service";
import executeStepInstruction from "../../services/instructions/execute-transaction";
import { getStepByPda } from "../../services/state/transaction";
import { ERROR_NETWORK } from "../../services/error.service";

const executeTxThunk = createAsyncThunk(
  "executeTx",
  async ({
    endpoint,
    address,
    providerName,
    data: { proposalPda, transactionIndex },
  }: {
    endpoint: string;
    address: string;
    providerName: string;
    data: {
      proposalPda: string;
      transactionIndex: number;
    };
  }) => {
    const provider = getProvider(providerName);
    const connection = new Connection(endpoint);
    const wallet = new PublicKey(address);
    const { rawTx, transactionPda } = await executeStepInstruction(
      connection,
      wallet,
      {
        proposalPda: new PublicKey(proposalPda),
        transactionIndex,
      }
    );
    let txid;
    try {
      txid = await sendTransaction(connection, provider, rawTx);
    } catch (error) {
      throw ERROR_NETWORK;
    }
    const { detail } = await getStepByPda(connection, transactionPda, 10);
    return { txid, proposalPda: proposalPda, detail };
  }
);

export default executeTxThunk;
