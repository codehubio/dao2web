import { Adapter } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { ERROR_WALLET_NOT_CONNECTED } from "./error.service";

export const supportedWallets: { [key: string]: Adapter } = {
  phantom: new PhantomWalletAdapter(),
};
export function getProvider(providerName: string): Adapter {
  if (!providerName) {
    throw ERROR_WALLET_NOT_CONNECTED;
  }
  const provider: any = supportedWallets[providerName.toLowerCase()];
  if (!provider) {
    throw new Error(
      `wallet ${providerName} was not installed on th is browser`
    );
  }
  return provider;
}
