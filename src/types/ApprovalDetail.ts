import BN from "bn.js";

export type TApprovalDetail = {
  accountType: number;
  index: BN;
  proposalPda: Uint8Array;
  proposalId: string;
  stepPda: Uint8Array;
  stepIndex: BN;
  approvedAmount: BN;
  sender: Uint8Array;
  incentiveRate: BN;
  incentiveFee: BN;
  isReverted: number;
  revertedAt: BN;
  createdAt: BN;
};

export type TParsedApprovalDetail = {
  pda: string;
  detail: {
    accountType: number;
    index: number;
    proposalPda: string;
    proposalId: string;
    stepPda: string;
    stepIndex: number;
    approvedAmount: number;
    sender: string;
    incentiveRate: number;
    incentiveFee: number;
    isReverted: number;
    revertedAt: number;
    createdAt: number;
  };
};
