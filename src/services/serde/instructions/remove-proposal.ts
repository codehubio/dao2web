import * as borsh from "borsh";

export class RemoveProposalIns {
  instruction;

  constructor() {
    this.instruction = 11;
  }

  serialize(): Uint8Array {
    return borsh.serialize(RemoveProposalInstructionSchema, this);
  }
}

export const RemoveProposalInstructionSchema = new Map([
  [
    RemoveProposalIns,
    {
      kind: "struct",
      fields: [["instruction", "u8"]],
    },
  ],
]);
