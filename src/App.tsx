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
import ListMyProposals from "./pages/Proposal/ListMyProposals";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import MyBreadcrumbs from "./components/MyBreadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ViewListIcon from "@mui/icons-material/ViewList";
import ArticleIcon from "@mui/icons-material/Article";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import CreateProposal from "./pages/Proposal/CreatePropsal";
import HomePage from "./pages/Home";
import DocumentationPage from "./pages/Document";
import Footer from "./components/Footer";
import { Container } from "@mui/material";
import ContactPage from "./pages/Contact";
import ListInvolvedProposals from "./pages/Proposal/ListInvolvedProposals";
import ListPublicProposals from "./pages/Proposal/ListPublicProposals";

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
      icon: HomeIcon,
    },
    {
      name: "My Proposals",
      icon: ViewListIcon,
    },
    {
      name: "Involved Proposals",
      icon: ViewListIcon,
    },
    {
      name: "Public Proposals",
      icon: ViewListIcon,
    },
    {
      name: "Create Proposal",
      icon: HomeIcon,
    },
    {
      name: "Detail Proposal",
      icon: ArticleIcon,
    },
    {
      name: "Documentation",
      icon: ArticleIcon,
    },
    {
      name: "Contact",
      icon: ContactMailIcon,
    },
    {
      name: "Detail Transaction",
      icon: ContactMailIcon,
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
    document.title = "Proposol - Home";
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
                  <Container>
                    <div
                      style={{
                        marginTop: "20px",
                        maxWidth: "100%",
                        marginLeft: "auto",
                        marginRight: "auto",
                        minHeight: "80vh",
                      }}
                    >
                      <MyBreadcrumbs aria-label="breadcrumb" breads={breads} />
                      <div
                        style={{
                          marginTop: "20px",
                        }}
                      >
                        <Routes>
                          <Route element={<HomePage />} path="/" />
                          <Route
                            element={<DocumentationPage />}
                            path="/documentation"
                          />
                          <Route element={<ContactPage />} path="/contact" />
                          <Route
                            element={<ListMyProposals />}
                            path="/list-my-proposals"
                          />
                          <Route
                            element={<ListInvolvedProposals />}
                            path="/list-involved-proposals"
                          />
                          <Route
                            element={<ListPublicProposals />}
                            path="/list-public-proposals"
                          />
                          <Route
                            element={<CreateProposal />}
                            path="/create-proposal"
                          />
                          <Route
                            element={<ProposalDetail />}
                            path="/get-proposal/:proposalPda"
                          />
                        </Routes>
                        <Success success={success}></Success>
                        <Error error={error}></Error>
                        <Loading message={loadingMessage} />
                      </div>
                    </div>
                    <Footer
                      sx={{
                        position: "relative",
                        mt: "10%",
                        left: 0,
                        bottom: 20,
                        right: 0,
                      }}
                    />
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
