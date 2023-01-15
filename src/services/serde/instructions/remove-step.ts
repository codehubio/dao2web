import * as borsh from "borsh";

export class RemoveStepIns {
  instruction;

  constructor() {
    this.instruction = 10;
  }

  serialize(): Uint8Array {
    return borsh.serialize(RemoveStepInstructionSchema, this);
  }
}

export const RemoveStepInstructionSchema = new Map([
  [
    RemoveStepIns,
    {
      kind: "struct",
      fields: [["instruction", "u8"]],
    },
  ],
]);
