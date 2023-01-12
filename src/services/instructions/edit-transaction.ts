import BN from "bn.js";
import {
  Connection,
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
} from "@solana/web3.js";
import { EditStepIns } from "../serde/instructions/edit-step";
import { pad } from "../util.service";
export default async function editStep(
  connection: Connection,
  creator: PublicKey,
  transactionPda: PublicKey,
  {
    proposalPda,
    name,
    description,
    amount,
    sender,
    receiver,
    token,
    executeAfter,
    incentiveRate,
  }: {
    proposalPda: PublicKey;
    name: string;
    description: string;
    amount: number;
    sender: string;
    receiver: string;
    token: string;
    executeAfter: string;
    incentiveRate: number;
  }
) {
  const { REACT_APP_SC_ADDRESS = "" } = process.env;
  const newName = pad(name, 16);
  const newDescription = pad(description, 128);
  const edtStepIx = new EditStepIns({
    name: Buffer.from(newName),
    description: Buffer.from(newDescription),
    amount: new BN(amount),
    sender: new PublicKey(sender).toBuffer(),
    receiver: new PublicKey(receiver).toBuffer(),
    token: new PublicKey(token).toBuffer(),
    executeAfter: new BN(executeAfter),
    incentiveRate: new BN(incentiveRate),
  });
  const serializedData = edtStepIx.serialize();
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
        isWritable: true,
        pubkey: transactionPda,
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
    transactionPda: transactionPda,
  };
}
