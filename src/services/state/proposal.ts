import { Connection, PublicKey } from "@solana/web3.js";
import { TParseProposalDetail } from "../../types/ProposalDetail";
import { Proposal } from "../serde/states/proposal";
import { getStatByAddress } from "./stat";
const {
  REACT_APP_SC_ADDRESS = ''
} = process.env;

export async function getProposalByPda(connection: Connection, pda: PublicKey, time = 1, interval = 1000) {
  for (let i = 0; i < time; i += 1) {
    try {
      const proposalAccount = await connection.getAccountInfo(pda);
      const data = Proposal.deserialize(proposalAccount?.data as Buffer);
      const readableData = Proposal.deserializeToReadable(proposalAccount?.data as Buffer);
      return {
        pda,
        data,
        readableData,
      }
    } catch (error: any) {
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  }
  throw new Error(`Cannot get data for proposal ${pda}`);
}
export async function listProposals(connection: Connection, wallet: PublicKey): Promise<TParseProposalDetail []> {
  try {
    const pdas: PublicKey [] = [];
    const { readableData: {
      numberOfProposals,
    } } = await getStatByAddress(connection, wallet);
    for (let i = 0; i < numberOfProposals; i += 1) {
      const [proposalPda] = PublicKey.findProgramAddressSync([
        Buffer.from(i.toString()),
        wallet.toBuffer(),
        Buffer.from('proposal'),
      ], new PublicKey(REACT_APP_SC_ADDRESS));
      pdas.push(proposalPda);
    }
    const data = await connection.getMultipleAccountsInfo(pdas);
    return data.map((d, index) => {
      const parsed = d && d.data ? Proposal.deserializeToReadable(d?.data as Buffer) : {};
      return {
        ...parsed,
        pda: pdas[index].toBase58(),
      };
    })
  } catch (error) {
    return [];    
  }
}