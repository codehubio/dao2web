import { createAsyncThunk } from "@reduxjs/toolkit";
import { Connection, PublicKey } from "@solana/web3.js";
import { sendTransaction } from "../../services/tx.service";
import { getProvider } from "../../services/wallet.service";
import revertStepInstruction from "../../services/instructions/revert-transaction";
import BN from "bn.js";

const revertTxThunk = createAsyncThunk(
  "revertTx",
  async ({
    endpoint,
    address,
    providerName,
    data: { proposalPda, transactionIndex, numberOfApprovals },
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
        transactionIndex,
        approvalIndex: new BN(i),
      });
      // const msg = MessageV0.deserialize(rawTx);
      // const txMessage = TransactionMessage.decompile(msg);

      // const log = await connection.simulateTransaction(
      //   txMessage.compileToLegacyMessage()
      // );
      // console.log(log);
      const txid = await sendTransaction(connection, provider, rawTx);
      txids.push(txid);
    }
    return { txids, proposalPda: proposalPda };
  }
);

export default revertTxThunk;
