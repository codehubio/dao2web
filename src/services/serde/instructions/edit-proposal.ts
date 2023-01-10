import BN from "bn.js";
import * as borsh from "borsh";

export type TEditProposalInstruction = {
  name: Uint8Array;
  description: Uint8Array;
  imageUrl: Uint8Array;
  expireOrFinalizedAfter: BN;
};
export class EditProposalIns {
  instruction;

  name;

  description;

  imageUrl;

  expireOrFinalizedAfter;

  constructor(fields: TEditProposalInstruction) {
    this.instruction = 8;
    this.name = fields.name;
    this.description = fields.description;
    this.imageUrl = fields.imageUrl;
    this.expireOrFinalizedAfter = fields.expireOrFinalizedAfter;
  }

  serialize(): Uint8Array {
    return borsh.serialize(EditProposalInstructionSchema, this);
  }
}

export const EditProposalInstructionSchema = new Map([
  [
    EditProposalIns,
    {
      kind: "struct",
      fields: [
        ["instruction", "u8"],
        ["name", [16]],
        ["description", [128]],
        ["imageUrl", [128]],
        ["expireOrFinalizedAfter", "u64"],
      ],
    },
  ],
]);
