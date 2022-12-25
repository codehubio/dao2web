import { createAsyncThunk } from "@reduxjs/toolkit";
import { Connection, PublicKey } from "@solana/web3.js";
import { sendTransaction } from "../../services/tx.service";
import { getProvider } from "../../services/wallet.service";
import approveStepInstruction from "../../services/instructions/approve-step";
import { getStepByPda } from "../../services/state/step";

const approveTxThunk = createAsyncThunk(
  "approveTx",
  async ({
    endpoint,
    address,
    providerName,
    data: { proposalPda, stepIndex, approvedAmount },
  }: {
    endpoint: string;
    address: string;
    providerName: string;
    data: any;
  }) => {
    const provider = getProvider(providerName.toLowerCase());
    const connection = new Connection(endpoint);
    const wallet = new PublicKey(address);
    const { rawTx, stepPda } = await approveStepInstruction(
      connection,
      wallet,
      {
        proposalPda: new PublicKey(proposalPda),
        stepIndex,
        approvedAmount,
      }
    );
    const txid = await sendTransaction(connection, provider, rawTx);
    const { detail } = await getStepByPda(connection, stepPda, 10);
    return { txid, proposalPda: proposalPda.toBase58(), detail };
  }
);

export default approveTxThunk;
