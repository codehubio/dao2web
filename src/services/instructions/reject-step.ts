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
    stepIndex,
    reason = "",
  }: {
    proposalPda: PublicKey;
    stepIndex: number;
    reason: string;
  }
) {
  const { REACT_APP_SC_ADDRESS = "" } = process.env;

  const [stepPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from(stepIndex.toString()),
      proposalPda.toBuffer(),
      Buffer.from("step"),
    ],
    new PublicKey(REACT_APP_SC_ADDRESS)
  );
  log(`Proposal PDA: ${proposalPda}`);
  log(`Step PDA: ${stepPda}`);
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
        pubkey: stepPda,
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
    stepPda,
  };
}
