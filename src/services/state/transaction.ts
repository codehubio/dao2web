import { Connection, PublicKey } from "@solana/web3.js";
import { getProposalByPda } from "./proposal";
import { Transaction } from "../serde/states/transaction";
import { Approval } from "../serde/states/approval";
const { REACT_APP_SC_ADDRESS = "" } = process.env;
export async function getStepByPda(
  connection: Connection,
  pda: PublicKey,
  time = 1,
  interval = 1000
) {
  for (let i = 0; i < time; i += 1) {
    try {
      const transactionAccount = await connection.getAccountInfo(pda);
      const data = Transaction.deserializeToReadble(
        transactionAccount?.data as Buffer
      );
      const approvalPdas: any = [];
      const numberOfApprovals = data.numberOfApprovals;
      for (let i = 0; i < numberOfApprovals; i += 1) {
        const [approvalPda] = PublicKey.findProgramAddressSync(
          [Buffer.from(i.toString()), pda.toBuffer(), Buffer.from("approval")],
          new PublicKey(REACT_APP_SC_ADDRESS)
        );
        approvalPdas.push(approvalPda);
      }
      const approvalData = await connection.getMultipleAccountsInfo(
        approvalPdas
      );
      const parsedApprovals = approvalData.map((s, index) => {
        const approvalData = Approval.deserializeToReadble(s?.data as Buffer);
        return {
          pda: approvalPdas[index].toBase58(),
          detail: approvalData,
        };
      });
      return {
        pda: pda.toBase58(),
        detail: {
          ...data,
          approvals: parsedApprovals,
        },
      };
    } catch (error: any) {
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  }
  throw new Error(`Cannot get data for step ${pda}`);
}
export async function getSteps(connection: Connection, proposalPda: PublicKey) {
  const { readableData: readableProposalData } = await getProposalByPda(
    connection,
    proposalPda
  );
  let transactionPdas: any[] = [];
  let approvedPdas: any[][] = [];
  for (let i = 0; i < readableProposalData.numberOfTransactions; i += 1) {
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from(i.toString()), proposalPda.toBuffer(), Buffer.from("step")],
      new PublicKey(REACT_APP_SC_ADDRESS)
    );
    transactionPdas.push(pda);
  }
  const stepInfos = await connection.getMultipleAccountsInfo(transactionPdas);
  let stepData = stepInfos.map((s) =>
    s && s.data ? Transaction.deserializeToReadble(s?.data as Buffer) : null
  );
  transactionPdas = transactionPdas.filter((_s, index) => stepData[index]);
  stepData = stepData.filter((s) => !!s);
  for (let i = 0; i < stepData.length; i += 1) {
    const step = stepData[i];
    approvedPdas[i] = [];
    for (let j = 0; j < step.numberOfApprovals; j += 1) {
      const [approvalPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from(j.toString()),
          transactionPdas[i].toBuffer(),
          Buffer.from("approval"),
        ],
        new PublicKey(REACT_APP_SC_ADDRESS)
      );
      approvedPdas[i].push(approvalPda);
    }
  }
  const approvalData = await Promise.all(
    approvedPdas.map(async (pdas) => {
      const data = await connection.getMultipleAccountsInfo(pdas);
      return data.map((s, index) => {
        return {
          detail: Approval.deserializeToReadble(s?.data as Buffer),
          pda: pdas[index],
        };
      });
    })
  );
  return {
    proposalPda: proposalPda.toBase58(),
    proposalData: readableProposalData,
    proposalSteps: stepData.map((s, index) => {
      return {
        detail: {
          ...s,
          approvals: approvalData[index],
        },
        pda: transactionPdas[index].toBase58(),
      };
    }),
  };
}
