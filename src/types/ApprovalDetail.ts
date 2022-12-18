import BN from 'bn.js';

export type TTransactionDetail = {
  accountType: number,
  index: BN,
  proposalPda: Uint8Array,
  proposalId: string,
  stepPda: Uint8Array,
  stepIndex: BN,
  approvedAmount: BN,
  sender: Uint8Array,
  incentiveRate: BN,
  incentiveFee: BN,
  isReverted: number,
  revertedAt: BN,
  createdAt: BN,
}