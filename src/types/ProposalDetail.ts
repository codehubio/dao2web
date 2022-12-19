import BN from 'bn.js';

export type TProposalDetail = {
  accountType: number,
  name: string,
  numberOfSteps: BN,
  numberOfApprovals: BN,
  description: string,
  imageUrl: string,
  createdAt: BN,
  expireOrFinalizeAfter: BN,
  creator: Uint8Array,
  isApproved: number,
  approvedAt: BN,
  isSettled: number,
  settledAt: BN,
  isRejected: number,
  rejectedAt: BN,
  pda: Uint8Array,
}


export type TParseProposalDetail = {
  accountType: number,
  name: string,
  numberOfSteps: number,
  numberOfApprovals: number,
  description: string,
  imageUrl: string,
  createdAt: number,
  expireOrFinalizeAfter: number,
  creator: string,
  isApproved: number,
  approvedAt: number,
  isSettled: number,
  settledAt: number,
  isRejected: number,
  rejectedAt: number,
  pda: string,
}