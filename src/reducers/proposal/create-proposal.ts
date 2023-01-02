import { createAsyncThunk } from "@reduxjs/toolkit";
import { Connection, PublicKey } from "@solana/web3.js";
import { getProposalByPda } from "../../services/state/proposal";
import { sendTransaction } from "../../services/tx.service";
import { getProvider } from "../../services/wallet.service";
import createProposalInstruction from "../../services/instructions/create-proposal";
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
    const provider = getProvider(providerName.toLowerCase());
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
    const txid = await sendTransaction(connection, provider, rawTx);
    console.log(txid);
    const { readableData } = await getProposalByPda(
      connection,
      proposalPda,
      30
    );
    return { txid, proposalPda: proposalPda.toBase58(), data: readableData };
  }
);
export default createProposalThunk;
