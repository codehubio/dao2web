import { Adapter } from '@solana/wallet-adapter-base';
import {
  Connection,
  MessageV0,
  VersionedTransaction
} from '@solana/web3.js';
export async function sendTransaction(connection: Connection, adapter: Adapter | undefined, serializedTransaction: Uint8Array): Promise<any> {
  const tx = new VersionedTransaction(MessageV0.deserialize(serializedTransaction));
  if (!adapter) {
    throw new Error('No wallet found!')
  }
  const txid = await adapter.sendTransaction(tx, connection);
  console.info(txid);
  return txid;
}
export async function sendTransactionWithMainWallet(connection: Connection, serializedTransaction: Uint8Array): Promise<any> {
  return 1;
}