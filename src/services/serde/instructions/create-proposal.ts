import BN from 'bn.js';
import * as borsh from 'borsh';

export type TCreateProposalInstruction = {
  name: Uint8Array,
  description: Uint8Array,
  imageUrl: Uint8Array,
  expireOrFinalizedAfter: BN,
}
export class CreateProposalIns {
  instruction;
  
  name;

  description;

  imageUrl;
  
  expireOrFinalizedAfter;

  constructor(fields: TCreateProposalInstruction) {
    this.instruction = 1;
    this.name = fields.name;
    this.description = fields.description;
    this.imageUrl = fields.imageUrl;
    this.expireOrFinalizedAfter = fields.expireOrFinalizedAfter;
  }

  serialize(): Uint8Array {
    return borsh.serialize(CreateProposalInstructionSchema, this);
  }
  
}

export const CreateProposalInstructionSchema = new Map([[CreateProposalIns, {
  kind: 'struct',
  fields: [
    ['instruction', 'u8'],
    ['name', [16]],
    ['description', [128]],
    ['imageUrl', [128]],
    ['expireOrFinalizedAfter', 'u64'],
  ],
}],
]);
