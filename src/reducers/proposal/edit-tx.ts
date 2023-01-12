import { createAsyncThunk } from "@reduxjs/toolkit";
import { Connection, PublicKey } from "@solana/web3.js";
import { sendTransaction } from "../../services/tx.service";
import { getProvider } from "../../services/wallet.service";
import editStepInstruction from "../../services/instructions/edit-transaction";
import { getStepByPda } from "../../services/state/transaction";
import {
  ERROR_NETWORK,
  ERROR_TX_SUBMIT_NO_RESULT,
} from "../../services/error.service";

const editTxThunk = createAsyncThunk(
  "editTx",
  async ({
    pda,
    endpoint,
    address,
    providerName,
    data: {
      proposalPda,
      name,
      description,
      amount,
      token,
      sender,
      receiver,
      executeAfter,
      incentiveRate,
    },
  }: {
    pda: string;
    endpoint: string;
    address: string;
    providerName: string;
    data: any;
  }) => {
    const provider = getProvider(providerName);
    const connection = new Connection(endpoint);
    const wallet = new PublicKey(address);
    const { rawTx, transactionPda } = await editStepInstruction(
      connection,
      wallet,
      new PublicKey(pda),
      {
        proposalPda: new PublicKey(proposalPda),
        name,
        description,
        amount,
        token,
        sender,
        receiver,
        executeAfter,
        incentiveRate,
      }
    );
    let txid;
    let detail;
    try {
      txid = await sendTransaction(connection, provider, rawTx);
    } catch (error) {
      throw ERROR_NETWORK;
    }
    try {
      const result = await getStepByPda(connection, transactionPda, 20);
      detail = result.detail;
    } catch (error) {
      throw ERROR_TX_SUBMIT_NO_RESULT;
    }
    return { txid, proposalPda: proposalPda, detail };
  }
);

export default editTxThunk;
