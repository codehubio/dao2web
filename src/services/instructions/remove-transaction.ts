import debug from "debug";
import {
  Connection,
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
} from "@solana/web3.js";
import { RemoveStepIns } from "../serde/instructions/remove-step";
const log = debug("settle-proposal:info");
export default async function removeTransaction(
  connection: Connection,
  creator: PublicKey,
  {
    proposalPda,
    transactionPda,
  }: {
    proposalPda: PublicKey;
    transactionPda: PublicKey;
  }
) {
  const { REACT_APP_SC_ADDRESS = "" } = process.env;

  log(`Proposal PDA: ${proposalPda}`);
  log(`Step PDA: ${transactionPda}`);
  const removeStepIx = new RemoveStepIns();
  const serializedData = removeStepIx.serialize();
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
    transactionPda,
  };
}
