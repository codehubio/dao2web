import { Connection, PublicKey } from "@solana/web3.js";
import { Proposal } from "../serde/states/proposal";
import { getStatByAddress } from "./stat";
const {
  REACT_APP_SC_ADDRESS = ''
} = process.env;
export async function getProposalByPda(connection: Connection, pda: PublicKey) {
  const proposalAccount = await connection.getAccountInfo(pda);
  const data = Proposal.deserialize(proposalAccount?.data as Buffer);
  const readableData = Proposal.deserializeToReadable(proposalAccount?.data as Buffer);
  return {
    pda,
    data,
    readableData,
  }
}

export async function listProposals(connection: Connection, wallet: PublicKey) {
  try {
    const pdas = [];
    const { readableData: {
      numberOfProposals,
    } } = await getStatByAddress(connection, wallet.toBase58());
    for (let i = 0; i < numberOfProposals; i += 1) {
      const [proposalPda] = PublicKey.findProgramAddressSync([
        Buffer.from(i.toString()),
        wallet.toBuffer(),
        Buffer.from('proposal'),
      ], new PublicKey(REACT_APP_SC_ADDRESS));
      pdas.push(proposalPda);
    }
    const data = await connection.getMultipleAccountsInfo(pdas);
    return data.map((d) => {
      return Proposal.deserializeToReadable(d?.data as Buffer);
    })
  } catch (error) {
    return [];    
  }
}