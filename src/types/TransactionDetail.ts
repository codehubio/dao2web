import BN from "bn.js";

export type TTransactionDetail = {
  accountType: number;
  index: BN;
  proposalPda: string;
  name: string;
  description: string;
  amount: BN;
  receivedAmount: BN;
  numberOfApprovals: BN;
  sender: Uint8Array;
  receiver: Uint8Array;
  token: Uint8Array;
  executeAfter: BN;
  incentiveRate: BN;
  incentiveFee: BN;
  addedAt: BN;
  isApproved: number;
  approvedAt: BN;
  isRejected: number;
  rejectedAt: BN;
  isExecuted: number;
  executedAt: BN;
  isReverted: number;
  revertedAt: BN;
  revertedAmount: BN;
};

export type TParsedTransactionDetail = {
  detail: {
    accountType: number;
    index: number;
    proposalPda: string;
    name: string;
    description: string;
    amount: number;
    receivedAmount: number;
    numberOfApprovals: number;
    sender: string;
    receiver: string;
    token: string;
    executeAfter: number;
    incentiveRate: number;
    incentiveFee: number;
    addedAt: number;
    isApproved: number;
    approvedAt: number;
    isRejected: number;
    rejectedAt: number;
    isExecuted: number;
    executedAt: number;
    isReverted: number;
    revertedAt: number;
    revertedAmount: number;
    approvals: [];
  };
  pda: string;
};
