import { createAsyncThunk } from "@reduxjs/toolkit";
import { Connection, PublicKey } from "@solana/web3.js";
import { sendTransaction } from "../../services/tx.service";
import { getProvider } from "../../services/wallet.service";
import settleProposalInstruction from "../../services/instructions/settle-proposal";
import { getProposalByPda } from "../../services/state/proposal";
import { ERROR_NETWORK } from "../../services/error.service";

const settleProposalThunk = createAsyncThunk(
  "settleProposal",
  async ({
    endpoint,
    address,
    providerName,
    data: { pda },
  }: {
    endpoint: string;
    address: string;
    providerName: string;
    data: any;
  }) => {
    const provider = getProvider(providerName);
    const connection = new Connection(endpoint);
    const wallet = new PublicKey(address);
    const { rawTx, proposalPda } = await settleProposalInstruction(
      connection,
      wallet,
      {
        proposalPda: new PublicKey(pda),
      }
    );
    let txid;
    try {
      txid = await sendTransaction(connection, provider, rawTx);
    } catch (error) {
      throw ERROR_NETWORK;
    }
    const { readableData } = await getProposalByPda(
      connection,
      proposalPda,
      30
    );
    return { txid, proposalPda: proposalPda.toBase58(), data: readableData };
  }
);

export default settleProposalThunk;
