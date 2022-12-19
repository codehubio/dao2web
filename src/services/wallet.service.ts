import { Adapter } from '@solana/wallet-adapter-base';
import {
  PhantomWalletAdapter,
} from '@solana/wallet-adapter-wallets';

export const supportedWallets: {[key: string]: Adapter}  = {
  phantom: new PhantomWalletAdapter(),
}
export function getProvider(providerName: string): Adapter {
  const provider: any = supportedWallets[providerName];
  if (!provider) {
    throw new Error(`wallet ${providerName} was not installed on th is browser`);
  }
  return provider;
}
