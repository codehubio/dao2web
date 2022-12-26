import debug from "debug";
import {
  Connection,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  TransactionMessage,
} from "@solana/web3.js";
import { RejectStepIns } from "../serde/instructions/reject-step";
import { pad } from "../util.service";
const log = debug("settle-proposal:info");
export default async function rejectStep(
  connection: Connection,
  creator: PublicKey,
  {
    proposalPda,
    transactionIndex,
    reason = "",
  }: {
    proposalPda: PublicKey;
    transactionIndex: number;
    reason: string;
  }
) {
  const { REACT_APP_SC_ADDRESS = "" } = process.env;

  const [transactionPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from(transactionIndex.toString()),
      proposalPda.toBuffer(),
      Buffer.from("step"),
    ],
    new PublicKey(REACT_APP_SC_ADDRESS)
  );
  log(`Proposal PDA: ${proposalPda}`);
  log(`Step PDA: ${transactionPda}`);
  const rejectStepIx = new RejectStepIns({
    reason: pad(reason, 128),
  });
  const serializedData = rejectStepIx.serialize();
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
    transactionPda,
  };
}
