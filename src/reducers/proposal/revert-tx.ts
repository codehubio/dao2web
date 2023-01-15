import { createAsyncThunk } from "@reduxjs/toolkit";
import { Connection, PublicKey } from "@solana/web3.js";
import { sendTransaction } from "../../services/tx.service";
import { getProvider } from "../../services/wallet.service";
import revertStepInstruction from "../../services/instructions/revert-transaction";
import BN from "bn.js";
import { ERROR_NETWORK } from "../../services/error.service";

const revertTxThunk = createAsyncThunk(
  "revertTx",
  async ({
    endpoint,
    address,
    providerName,
    data: { proposalPda, pda, numberOfApprovals },
  }: {
    endpoint: string;
    address: string;
    providerName: string;
    data: {
      proposalPda: string;
      pda: string;
      numberOfApprovals: number;
    };
  }) => {
    const provider = getProvider(providerName);
    const connection = new Connection(endpoint);
    const wallet = new PublicKey(address);
    const txids = [];
    for (let i = 0; i < numberOfApprovals; i += 1) {
      const { rawTx } = await revertStepInstruction(connection, wallet, {
        proposalPda: new PublicKey(proposalPda),
        transactionPda: new PublicKey(pda),
        approvalIndex: new BN(i),
      });
      // const msg = MessageV0.deserialize(rawTx);
      // const txMessage = TransactionMessage.decompile(msg);

      // const log = await connection.simulateTransaction(
      //   txMessage.compileToLegacyMessage()
      // );
      // console.log(log);
      let txid;
      try {
        txid = await sendTransaction(connection, provider, rawTx);
      } catch (error) {
        throw ERROR_NETWORK;
      }
      txids.push(txid);
    }
    return { txids, proposalPda: proposalPda };
  }
);

export default revertTxThunk;
