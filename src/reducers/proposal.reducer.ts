import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Connection, PublicKey } from '@solana/web3.js';
import { getProposalByPda, listProposals } from '../services/state/proposal';
import { getStatByAddress } from '../services/state/stat';
import { sendTransaction } from '../services/tx.service';
import { getProvider } from '../services/wallet.service';
import createProposalInstruction from '../services/instructions/create-proposal';
export const listProposalsByWallet = createAsyncThunk('listProposalsCreatedByWallet', async ({
  endpoint, address
} : {
  endpoint: string,
  address: string
}) => {
  const connection = new Connection(endpoint);
  const wallet = new PublicKey(address);
  const proposals = await listProposals(connection, wallet);
  return proposals;
});

export const createProposal = createAsyncThunk('createProposal', async ({
  endpoint, address, providerName, data: {
    name,
    description,
    expireOrFinalizeAfter,
    imageUrl,
  }
} : {
  endpoint: string,
  address: string,
  providerName: string,
  data: any
}) => {
  const provider = getProvider(providerName.toLowerCase());
  const connection = new Connection(endpoint);
  const wallet = new PublicKey(address);
  const { rawTx, proposalPda } = await createProposalInstruction(
    connection,
    wallet, {
      name,
      description,
      expireOrFinalizeAfter,
      imageUrl,
    }
  );
  const txid = await sendTransaction(connection, provider, rawTx);
  const {
    readableData
  } = await getProposalByPda(connection, proposalPda, 30);
  return { txid, proposalPda: proposalPda.toBase58(), data: readableData };
});


export const getStat = createAsyncThunk('getStatByWallet', async ({
  endpoint,
  address
} : {
  endpoint: string,
  address: string
}) => {
  if (!address || !endpoint) {
    return null;
  }
  const connection = new Connection(endpoint);
  const wallet = new PublicKey(address);
  const {
    pda,
    readableData
  } = await getStatByAddress(connection, wallet);
  return {
    pda: pda.toBase58(),
    readableData,
  }
});
export const proposalsSlice = createSlice({
  name: 'proposals',
  initialState: {
    createdProposals: [],
    numberOfProposals: 0,
  },
  reducers: {
  },
  extraReducers: (builder: any) => {
    builder.addCase(getStat.fulfilled, (state: any, { payload }: any) => {
      state.numberOfProposals = payload ? payload.readableData.numberOfProposals : 0;
    });
    builder.addCase(listProposalsByWallet.fulfilled, (state: any, { payload }: any) => {
      state.createdProposals = payload || [];
    })
    builder.addCase(createProposal.fulfilled, (state: any, { payload }: any) => {
      state.createdProposals.push({
        ...payload.data,
        pda: payload.proposalPda,
      });
    })
  },
})

export default proposalsSlice.reducer


