import debug from "debug";
import BN from "bn.js";
import {
  Connection,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  TransactionMessage,
} from "@solana/web3.js";
import { AddStepIns } from "../serde/instructions/add-step";
import { pad } from "../util.service";
import { getProposalByPda } from "../state/proposal";
const log = debug("add-step:info");
export default async function addStep(
  connection: Connection,
  creator: PublicKey,
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
  const { data: proposalData } = await getProposalByPda(
    connection,
    proposalPda
  );
  const [transactionPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from(proposalData.numberOfTransactions.toString()),
      proposalPda.toBytes(),
      Buffer.from("step"),
    ],
    new PublicKey(REACT_APP_SC_ADDRESS)
  );
  log(
    `Adding step ${transactionPda} to dao id: ${Buffer.from(
      proposalData.name
    ).toString()}, pda: ${proposalPda.toBase58()}`
  );
  const addStepIx = new AddStepIns({
    name: Buffer.from(newName),
    description: Buffer.from(newDescription),
    amount: new BN(amount),
    sender: new PublicKey(sender).toBuffer(),
    receiver: new PublicKey(receiver).toBuffer(),
    token: new PublicKey(token).toBuffer(),
    executeAfter: new BN(executeAfter),
    incentiveRate: new BN(incentiveRate),
  });
  const serializedData = addStepIx.serialize();
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
    transactionPda: transactionPda,
  };
}
