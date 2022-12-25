import { createAsyncThunk } from "@reduxjs/toolkit";
import { Connection, PublicKey } from "@solana/web3.js";
import { sendTransaction } from "../../services/tx.service";
import { getProvider } from "../../services/wallet.service";
import executeStepInstruction from "../../services/instructions/execute-step";
import { getStepByPda } from "../../services/state/step";

const executeTxThunk = createAsyncThunk(
  "executeTx",
  async ({
    endpoint,
    address,
    providerName,
    data: { proposalPda, stepIndex },
  }: {
    endpoint: string;
    address: string;
    providerName: string;
    data: any;
  }) => {
    const provider = getProvider(providerName.toLowerCase());
    const connection = new Connection(endpoint);
    const wallet = new PublicKey(address);
    const { rawTx, stepPda } = await executeStepInstruction(
      connection,
      wallet,
      {
        proposalPda: new PublicKey(proposalPda),
        stepIndex,
      }
    );
    const txid = await sendTransaction(connection, provider, rawTx);
    const { detail } = await getStepByPda(connection, stepPda, 10);
    console.log(txid);
    return { txid, proposalPda: proposalPda.toBase58(), detail };
  }
);

export default executeTxThunk;
