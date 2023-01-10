import BN from "bn.js";
import {
  Connection,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  TransactionMessage,
} from "@solana/web3.js";
import { EditProposalIns } from "../serde/instructions/edit-proposal";
import { pad } from "../util.service";
export default async function createProposal(
  connection: Connection,
  creator: PublicKey,
  proposalPda: PublicKey,
  {
    name,
    description,
    imageUrl,
    expireOrFinalizeAfter,
  }: {
    name: string;
    imageUrl: string;
    description: string;
    expireOrFinalizeAfter: number;
  }
) {
  if (!connection || !creator) {
    throw new Error(`Please check connection or connnect wallet!`);
  }
  const { REACT_APP_SC_ADDRESS = "" } = process.env;
  const newName = pad(name, 16);
  const newUrl = pad(imageUrl, 128);
  const newDescription = pad(description, 128);
  const editDaoIx = new EditProposalIns({
    name: Buffer.from(newName),
    description: Buffer.from(newDescription),
    imageUrl: Buffer.from(newUrl),
    expireOrFinalizedAfter: new BN(expireOrFinalizeAfter).divRound(
      new BN(1000)
    ),
  });
  console.log(proposalPda);

  const serializedData = editDaoIx.serialize();
  const dataBuffer = Buffer.from(serializedData);
  // console.log(testPub.toBuffer());
  const instruction = new TransactionInstruction({
    keys: [
      {
        pubkey: creator,
        isSigner: true,
        isWritable: true,
      },
      {
        isSigner: false,
        isWritable: true,
        pubkey: proposalPda,
      },
      {
        isSigner: false,
        isWritable: false,
        pubkey: SystemProgram.programId,
      },
    ],
    programId: new PublicKey(REACT_APP_SC_ADDRESS),
    data: dataBuffer,
  });
  const { blockhash } = await connection.getLatestBlockhash({
    commitment: "finalized",
  });
  const tx = new TransactionMessage({
    payerKey: creator,
    recentBlockhash: blockhash,
    instructions: [instruction],
  }).compileToV0Message();
  return {
    rawTx: tx.serialize(),
    proposalPda,
  };
}
