import { createAsyncThunk } from "@reduxjs/toolkit";
import { Connection, PublicKey } from "@solana/web3.js";
import { sendTransaction } from "../../services/tx.service";
import { getProvider } from "../../services/wallet.service";
import approveStepInstruction from "../../services/instructions/approve-transaction";
import { getStepByPda } from "../../services/state/transaction";
import { ERROR_NETWORK } from "../../services/error.service";

const approveTxThunk = createAsyncThunk(
  "approveTx",
  async ({
    endpoint,
    address,
    providerName,
    data: { proposalPda, transactionIndex, approvedAmount },
  }: {
    endpoint: string;
    address: string;
    providerName: string;
    data: any;
  }) => {
    const provider = getProvider(providerName);
    const connection = new Connection(endpoint);
    const wallet = new PublicKey(address);
    const { rawTx, transactionPda } = await approveStepInstruction(
      connection,
      wallet,
      {
        proposalPda: new PublicKey(proposalPda),
        transactionIndex,
        approvedAmount,
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

export default approveTxThunk;
