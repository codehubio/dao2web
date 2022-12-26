import { useEffect, useMemo, useState } from "react";
import { Provider } from "react-redux";
import { Buffer } from "buffer";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import Error from "./components/Feedback/Error";
import Success from "./components/Feedback/Success";
import Loading from "./components/Loading";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import theme from "./share/theme";
import "@solana/wallet-adapter-react-ui/styles.css";
import Header from "./components/Header";
import { Container } from "@mui/material";
import AppContext from "./share/context";
import { store } from "./store";
import { supportedWallets } from "./services/wallet.service";
import ProposalDetail from "./pages/Proposal/ProposalDetail";
import ListProposals from "./pages/Proposal/ListProposals";
import TransactionDetail from "./components/Transaction/TransactionDetail";

window.Buffer = window.Buffer || Buffer;
const darkTheme = createTheme({
  ...theme,
});
const { REACT_APP_ENDPOINT = "" } = process.env;
export default function App() {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState("");
  useEffect(() => {
    document.title = "Token Flow - Home";
  }, []);
  const wallets = useMemo(() => [supportedWallets.phantom], []);

  return (
    <Provider store={store}>
      <AppContext.Provider
        value={{
          setError,
          setSuccess,
          setLoadingMessage,
        }}
      >
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <BrowserRouter>
            <ConnectionProvider endpoint={REACT_APP_ENDPOINT}>
              <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                  <Header />
                  <Container sx={{ mt: 5 }} maxWidth="lg">
                    <Routes>
                      <Route element={<ListProposals />} path="/" />
                      <Route
                        element={<ListProposals />}
                        path="/list-proposals"
                      />
                      <Route
                        element={<ProposalDetail />}
                        path="/proposal/:proposalPda"
                      />
                      <Route
                        element={<TransactionDetail />}
                        path="/transaction/:transactionPda"
                      />
                    </Routes>
                    <Success success={success}></Success>
                    <Error error={error}></Error>
                    <Loading message={loadingMessage} />
                  </Container>
                </WalletModalProvider>
              </WalletProvider>
            </ConnectionProvider>
          </BrowserRouter>
        </ThemeProvider>
      </AppContext.Provider>
    </Provider>
  );
}
