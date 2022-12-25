import { createAsyncThunk } from "@reduxjs/toolkit";
import { Connection, PublicKey } from "@solana/web3.js";
import { sendTransaction } from "../../services/tx.service";
import { getProvider } from "../../services/wallet.service";
import revertStepInstruction from "../../services/instructions/revert-step";
import BN from "bn.js";

const revertTxThunk = createAsyncThunk(
  "revertTx",
  async ({
    endpoint,
    address,
    providerName,
    data: { proposalPda, stepIndex, numberOfApprovals },
  }: {
    endpoint: string;
    address: string;
    providerName: string;
    data: any;
  }) => {
    const provider = getProvider(providerName.toLowerCase());
    const connection = new Connection(endpoint);
    const wallet = new PublicKey(address);
    const txids = [];
    for (let i = 0; i < numberOfApprovals; i += 1) {
      const { rawTx } = await revertStepInstruction(connection, wallet, {
        proposalPda: new PublicKey(proposalPda),
        stepIndex,
        approvalIndex: new BN(i),
      });
      const txid = await sendTransaction(connection, provider, rawTx);
      txids.push(txid);
    }
    return { txids, proposalPda: proposalPda.toBase58() };
  }
);

export default revertTxThunk;
