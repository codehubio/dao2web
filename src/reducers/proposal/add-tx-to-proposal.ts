import { createAsyncThunk } from "@reduxjs/toolkit";
import { Connection, PublicKey } from "@solana/web3.js";
import { sendTransaction } from "../../services/tx.service";
import { getProvider } from "../../services/wallet.service";
import addStepInstruction from "../../services/instructions/add-transaction";
import { getStepByPda } from "../../services/state/transaction";

const addTxToProposalThunk = createAsyncThunk(
  "addTxToProposal",
  async ({
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
    endpoint: string;
    address: string;
    providerName: string;
    data: any;
  }) => {
    const provider = getProvider(providerName.toLowerCase());
    const connection = new Connection(endpoint);
    const wallet = new PublicKey(address);
    const { rawTx, transactionPda } = await addStepInstruction(
      connection,
      wallet,
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
    const txid = await sendTransaction(connection, provider, rawTx);
    const { detail } = await getStepByPda(connection, transactionPda, 10);
    return { txid, proposalPda: proposalPda, detail };
  }
);

export default addTxToProposalThunk;
