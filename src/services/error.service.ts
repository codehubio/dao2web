export const ERROR_WALLET_NOT_CONNECTED = new Error(
  "Please connect or reconnect your wallet"
);
export const ERROR_NETWORK = new Error(
  "Transaction submission failure! Please try again later"
);
export const ERROR_TX_SUBMIT_NO_RESULT = new Error(
  "Your transaction submitted but not finalized in time! Please refresh the page after a moments to make sure!"
);

const AppError = {
  ERROR_WALLET_NOT_CONNECTED,
  ERROR_NETWORK,
  ERROR_TX_SUBMIT_NO_RESULT,
};
export default AppError;
