import {
  Connection,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  TransactionMessage,
} from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Transaction } from "../serde/states/transaction";
import { ExecuteStepIns } from "../serde/instructions/execute-step";
export default async function executeStep(
  connection: Connection,
  creator: PublicKey,
  {
    proposalPda,
    transactionIndex,
  }: {
    proposalPda: PublicKey;
    transactionIndex: number;
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
  console.log(`Getting step data from ${transactionPda}`);
  const stepAccountInfo = await connection.getAccountInfo(transactionPda);
  const stepData = Transaction.deserialize(stepAccountInfo?.data as Buffer);
  const { receiver, amount, token } = stepData;
  const receiverPubKey = new PublicKey(receiver);
  const tokenPubKey = new PublicKey(token);
  console.log(
    `Executing sending ${amount.toNumber()} of ${tokenPubKey.toBase58()} to ${receiverPubKey.toBase58()}`
  );
  const srcAta = await getAssociatedTokenAddress(
    tokenPubKey,
    proposalPda,
    true,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  const dstAta = await getAssociatedTokenAddress(
    tokenPubKey,
    receiverPubKey,
    true,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  const dstFeeAta = await getAssociatedTokenAddress(
    tokenPubKey,
    creator,
    true,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  const executeStepIx = new ExecuteStepIns();
  const serializedData = executeStepIx.serialize();
  const dataBuffer = Buffer.from(serializedData);
  // console.console.log(testPub.toBuffer());
  const instruction = new TransactionInstruction({
    keys: [
      {
        pubkey: creator,
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: receiverPubKey,
        isSigner: false,
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
        pubkey: tokenPubKey,
      },
      {
        isSigner: false,
        isWritable: true,
        pubkey: srcAta,
      },
      {
        isSigner: false,
        isWritable: true,
        pubkey: dstAta,
      },
      {
        isSigner: false,
        isWritable: true,
        pubkey: dstFeeAta,
      },
      {
        isSigner: false,
        isWritable: false,
        pubkey: SystemProgram.programId,
      },
      {
        isSigner: false,
        isWritable: false,
        pubkey: TOKEN_PROGRAM_ID,
      },
      {
        isSigner: false,
        isWritable: false,
        pubkey: ASSOCIATED_TOKEN_PROGRAM_ID,
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
