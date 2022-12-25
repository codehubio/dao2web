import { Connection, PublicKey } from "@solana/web3.js";
import { getProposalByPda } from "./proposal";
import { Step } from "../serde/states/step";
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
      const data = Step.deserialize(transactionAccount?.data as Buffer);
      return {
        pda,
        data,
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
  let stepPdas: any[] = [];
  let approvedPdas: any[][] = [];
  for (let i = 0; i < readableProposalData.numberOfSteps; i += 1) {
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from(i.toString()), proposalPda.toBuffer(), Buffer.from("step")],
      new PublicKey(REACT_APP_SC_ADDRESS)
    );
    stepPdas.push(pda);
  }
  const stepInfos = await connection.getMultipleAccountsInfo(stepPdas);
  const stepData = stepInfos.map((s) =>
    Step.deserializeToReadble(s?.data as Buffer)
  );
  for (let i = 0; i < stepData.length; i += 1) {
    const step = stepData[i];
    approvedPdas[i] = [];
    for (let j = 0; j < step.numberOfApprovals; j += 1) {
      const [approvalPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from(j.toString()),
          stepPdas[i].toBuffer(),
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
      return data.map((s) => Approval.deserializeToReadble(s?.data as Buffer));
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
        pda: stepPdas[index],
      };
    }),
  };
}
