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
import AppContext from "./share/context";
import { store } from "./store";
import { supportedWallets } from "./services/wallet.service";
import ProposalDetail from "./pages/Proposal/ProposalDetail";
import ListProposals from "./pages/Proposal/ListProposals";
import TransactionDetail from "./components/Transaction/TransactionDetail";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import MyBreadcrumbs from "./components/MyBreadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import CreateProposal from "./pages/Proposal/CreatePropsal";
import Home from "./pages/Home";

window.Buffer = window.Buffer || Buffer;
const darkTheme = createTheme({
  ...theme,
});
const { REACT_APP_ENDPOINT = "" } = process.env;
export default function App() {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const menu = [
    {
      name: "Home",
      path: "/",
      icon: HomeIcon,
    },
    {
      name: "List Proposals",
      path: "/list-proposals",
      icon: HomeIcon,
    },
    {
      name: "Create Proposal",
      path: "/create-proposal",
      icon: HomeIcon,
    },
  ];
  const [breads, _setBreads] = useState([menu[0]] as any);
  function setBreads(brs: string[]) {
    const newBrs = brs.map((br) => br.toLowerCase());
    const filteredMenu = menu.filter(
      (br) => newBrs.indexOf(br.name.toLowerCase()) >= 0
    );
    _setBreads(filteredMenu);
  }
  const [loadingMessage, setLoadingMessage] = useState("");
  useEffect(() => {
    document.title = "Token Flow - Home";
  }, []);
  const wallets = useMemo(() => [supportedWallets.phantom], []);

  return (
    <Provider store={store}>
      <style>
        {" "}
        @import
        url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');{" "}
      </style>
      <AppContext.Provider
        value={{
          setError,
          setSuccess,
          setLoadingMessage,
          setBreads,
        }}
      >
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <BrowserRouter>
            <ConnectionProvider endpoint={REACT_APP_ENDPOINT}>
              <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                  <Header />
                  <div
                    style={{
                      marginTop: "20px",
                      maxWidth: "80%",
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                  >
                    <MyBreadcrumbs aria-label="breadcrumb" breads={breads} />
                    <div
                      style={{
                        marginTop: "20px",
                      }}
                    >
                      <Routes>
                        <Route element={<Home />} path="/" />
                        <Route
                          element={<ListProposals />}
                          path="/list-proposals"
                        />
                        <Route
                          element={<CreateProposal />}
                          path="/create-proposal"
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
                    </div>
                  </div>
                </WalletModalProvider>
              </WalletProvider>
            </ConnectionProvider>
          </BrowserRouter>
        </ThemeProvider>
      </AppContext.Provider>
    </Provider>
  );
}
