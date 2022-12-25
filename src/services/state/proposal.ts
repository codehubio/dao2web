import { Connection, PublicKey } from "@solana/web3.js";
import base58 from "bs58";
import { TParseProposalDetail } from "../../types/ProposalDetail";
import { Proposal } from "../serde/states/proposal";
import { Step } from "../serde/states/step";
import { getStatByAddress } from "./stat";
const { REACT_APP_SC_ADDRESS = "" } = process.env;

export async function getProposalByPda(
  connection: Connection,
  pda: PublicKey,
  time = 1,
  interval = 1000
) {
  for (let i = 0; i < time; i += 1) {
    try {
      const proposalAccount = await connection.getAccountInfo(pda);
      const data = Proposal.deserialize(proposalAccount?.data as Buffer);
      const readableData = Proposal.deserializeToReadable(
        proposalAccount?.data as Buffer
      );
      return {
        pda,
        data,
        readableData,
      };
    } catch (error: any) {
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  }
  throw new Error(`Cannot get data for proposal ${pda}`);
}
export async function listProposalsByCreator(
  connection: Connection,
  wallet: PublicKey
): Promise<TParseProposalDetail[]> {
  try {
    const pdas: PublicKey[] = [];
    const {
      readableData: { numberOfProposals },
    } = await getStatByAddress(connection, wallet);
    for (let i = 0; i < numberOfProposals; i += 1) {
      const [proposalPda] = PublicKey.findProgramAddressSync(
        [Buffer.from(i.toString()), wallet.toBuffer(), Buffer.from("proposal")],
        new PublicKey(REACT_APP_SC_ADDRESS)
      );
      pdas.push(proposalPda);
    }
    const data = await connection.getMultipleAccountsInfo(pdas);
    return data.map((d, index) => {
      const parsed =
        d && d.data ? Proposal.deserializeToReadable(d?.data as Buffer) : {};
      return {
        detail: parsed,
        pda: pdas[index].toBase58(),
      };
    });
  } catch (error) {
    return [];
  }
}
export type TListProposalFilter = {
  creator?: string;
  involve?: string;
  isApproved?: boolean;
  isRejected?: boolean;
  isSettled?: boolean;
  isExecuted?: boolean;
};
export async function listProposalsByInvolve(
  connection: Connection,
  wallet: PublicKey,
  options: TListProposalFilter = {}
): Promise<any> {
  try {
    console.log(wallet);
    const programId = new PublicKey(REACT_APP_SC_ADDRESS);
    const rawData = await connection.getProgramAccounts(programId, {
      filters: [
        {
          memcmp: {
            offset: 1 + 8 + 32 + 16 + 128 + 8 + 8 + 8,
            bytes: wallet.toBase58(),
          },
        },
      ],
    });
    const proposalPdas = rawData.map((r) => {
      const step = Step.deserializeToReadble(r?.account.data);
      return new PublicKey(step.proposalPda);
    });
    const data = await connection.getMultipleAccountsInfo(proposalPdas);
    return data
      .map((d, index) => {
        const parsed =
          d && d.data ? Proposal.deserializeToReadable(d?.data as Buffer) : {};
        return {
          detail: parsed,
          pda: proposalPdas[index].toBase58(),
        };
      })
      .filter((d) => {
        return (
          (!options.isApproved || d.detail.isApproved) &&
          (!options.isRejected || d.detail.isRejected) &&
          (!options.isSettled || d.detail.isSettled) &&
          (!options.isExecuted || d.detail.isExecuted)
        );
      });
  } catch (error) {
    return [];
  }
}
export async function listProposals(
  connection: Connection,
  options: TListProposalFilter
): Promise<any> {
  const filters = [
    {
      memcmp: {
        offset: 0,
        bytes: base58.encode(Buffer.from([100])),
      },
    },
  ];
  if (options.involve) {
    return listProposalsByInvolve(
      connection,
      new PublicKey(options.involve),
      options
    );
  }
  if (options.creator) {
    filters.push({
      memcmp: {
        offset: 1 + 8 + 16 + 8 + 8 + 8 + 128 + 128 + 8 + 8,
        bytes: options.creator,
      },
    });
  }
  if (options.isApproved) {
    filters.push({
      memcmp: {
        offset: 1 + 8 + 16 + 8 + 8 + 8 + 128 + 128 + 8 + 8 + 32,
        bytes: base58.encode(Buffer.from([1])),
      },
    });
  }
  if (options.isSettled) {
    filters.push({
      memcmp: {
        offset: 1 + 8 + 16 + 8 + 8 + 8 + 128 + 128 + 8 + 8 + 32 + 1 + 8,
        bytes: base58.encode(Buffer.from([1])),
      },
    });
  }
  if (options.isRejected) {
    filters.push({
      memcmp: {
        offset: 1 + 8 + 16 + 8 + 8 + 8 + 128 + 128 + 8 + 8 + 32 + 1 + 8 + 1 + 8,
        bytes: base58.encode(Buffer.from([1])),
      },
    });
  }

  if (options.isExecuted) {
    filters.push({
      memcmp: {
        offset:
          1 +
          8 +
          16 +
          8 +
          8 +
          8 +
          128 +
          128 +
          8 +
          8 +
          32 +
          1 +
          8 +
          1 +
          8 +
          1 +
          8,
        bytes: base58.encode(Buffer.from([1])),
      },
    });
  }
  try {
    const programId = new PublicKey(REACT_APP_SC_ADDRESS);
    const rawData = await connection.getProgramAccounts(programId, {
      filters,
    });
    return rawData.map((d, index) => {
      const parsed =
        d && d.account.data
          ? Proposal.deserializeToReadable(d?.account.data as Buffer)
          : {};
      return {
        detail: parsed,
        pda: d.pubkey.toBase58(),
      };
    });
  } catch (error) {
    console.log(error);
    return [];
  }
}
