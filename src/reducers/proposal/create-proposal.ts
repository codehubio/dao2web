import { createAsyncThunk } from "@reduxjs/toolkit";
import { Connection, PublicKey } from "@solana/web3.js";
import { getProposalByPda } from "../../services/state/proposal";
import { sendTransaction } from "../../services/tx.service";
import { getProvider } from "../../services/wallet.service";
import createProposalInstruction from "../../services/instructions/create-proposal";
import {
  ERROR_NETWORK,
  ERROR_TX_SUBMIT_NO_RESULT,
} from "../../services/error.service";
const createProposalThunk = createAsyncThunk(
  "createProposal",
  async ({
    endpoint,
    address,
    providerName,
    data: { name, description, expireOrFinalizeAfter, imageUrl },
  }: {
    endpoint: string;
    address: string;
    providerName: string;
    data: any;
  }) => {
    const provider = getProvider(providerName);
    const connection = new Connection(endpoint);
    const wallet = new PublicKey(address);
    const { rawTx, proposalPda } = await createProposalInstruction(
      connection,
      wallet,
      {
        name,
        description,
        expireOrFinalizeAfter,
        imageUrl,
      }
    );
    let txid;
    let readableData;
    try {
      txid = await sendTransaction(connection, provider, rawTx);
    } catch (error) {
      throw ERROR_NETWORK;
    }
    try {
      const res = await getProposalByPda(connection, proposalPda, 30);
      readableData = res.readableData;
    } catch (error) {
      throw ERROR_TX_SUBMIT_NO_RESULT;
    }
    return { txid, proposalPda: proposalPda.toBase58(), data: readableData };
  }
);
export default createProposalThunk;
