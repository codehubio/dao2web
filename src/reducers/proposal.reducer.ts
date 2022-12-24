import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Connection, PublicKey } from '@solana/web3.js';
import { getProposalByPda, listProposals } from '../services/state/proposal';
import { getStatByAddress } from '../services/state/stat';
import { sendTransaction } from '../services/tx.service';
import { getProvider } from '../services/wallet.service';
import createProposalInstruction from '../services/instructions/create-proposal';
import addStepInstruction from '../services/instructions/add-step';
import settleProposalInstruction from '../services/instructions/settle-proposal';
import { getStepByPda } from '../services/state/step';
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
export const settleProposal = createAsyncThunk('settleProposal', async ({
  endpoint, address, providerName, data: {
    pda,
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
  const { rawTx, proposalPda } = await settleProposalInstruction(
    connection,
    wallet, {
      proposalPda: new PublicKey(pda)
    }
  );
  const txid = await sendTransaction(connection, provider, rawTx);
  const {
    readableData
  } = await getProposalByPda(connection, proposalPda, 30);
  return { txid, proposalPda: proposalPda.toBase58(), data: readableData };
});


export const addTxToProposal = createAsyncThunk('addTxToProposal', async ({
  endpoint, address, providerName, data: {
    proposalPda,
    name,
    description,
    amount,
    token,
    sender,
    receiver,
    executeAfter,
    incentiveRate,
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
  const { rawTx, transactionPda } = await addStepInstruction(
    connection,
    wallet, {
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
  const {
    data
  } = await getStepByPda(connection, transactionPda, 10);
  console.log(data);
  return { txid, proposalPda: proposalPda.toBase58(), data };
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
    });
    builder.addCase(createProposal.fulfilled, (state: any, { payload }: any) => {
      state.createdProposals.push({
        ...payload.data,
        pda: payload.proposalPda,
        steps: [],
      });
    });
  },
})

export default proposalsSlice.reducer


// sender=6EbhsCu7nDMRYGNXkBNBtcx1gubjrUfR8aQ2ZfPzg2Ur
// receiver=H2knp7o4asKD79eo1PSPAFcahqAXgk6eQUkCcmAExXFU
// token=988Hp2QxjbcZu3vgy78CRsNhxnS46YG4nubbYeePgoxa
// executeAfter=1000