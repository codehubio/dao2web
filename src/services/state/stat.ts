import { Connection, PublicKey } from "@solana/web3.js";
import { Stat } from '../serde/states/stat';
const {
  REACT_APP_SC_ADDRESS = ''
} = process.env;
export async function getStatByAddress(connection: Connection, address: PublicKey) {
  const [pda] = PublicKey.findProgramAddressSync([
    address.toBuffer(),
    Buffer.from('stat'),
  ], new PublicKey(REACT_APP_SC_ADDRESS));
  const statAccount = await connection.getAccountInfo(pda);
  const statData = Stat.deserialize(statAccount?.data as Buffer);
  const readableData = Stat.deserializeToReadable(statAccount?.data as Buffer);
  return {
    pda,
    data: statData,
    readableData
  }
}