import { createAsyncThunk } from "@reduxjs/toolkit";
import { Connection, PublicKey } from "@solana/web3.js";
import { sendTransaction } from "../../services/tx.service";
import { getProvider } from "../../services/wallet.service";
import settleProposalInstruction from "../../services/instructions/settle-proposal";
import { getProposalByPda } from "../../services/state/proposal";

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
    const provider = getProvider(providerName.toLowerCase());
    const connection = new Connection(endpoint);
    const wallet = new PublicKey(address);
    const { rawTx, proposalPda } = await settleProposalInstruction(
      connection,
      wallet,
      {
        proposalPda: new PublicKey(pda),
      }
    );
    const txid = await sendTransaction(connection, provider, rawTx);
    const { readableData } = await getProposalByPda(
      connection,
      proposalPda,
      30
    );
    return { txid, proposalPda: proposalPda.toBase58(), data: readableData };
  }
);

export default settleProposalThunk;
