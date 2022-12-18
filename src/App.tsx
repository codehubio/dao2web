import { useMemo, useState } from 'react';
import { Buffer } from 'buffer';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
    WalletModalProvider,
} from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import Error from './components/Feedback/Error';
import Success from './components/Feedback/Success';
import Loading from './components/Loading';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import CreateProposal from './pages/Proposal/Create';
import ListProposals from './pages/Proposal/List';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import theme from './share/theme';
import '@solana/wallet-adapter-react-ui/styles.css';
import Header from './components/Header';
import { Container, List } from '@mui/material';
import AppContext from './share/context';
window.Buffer = window.Buffer || Buffer;
const darkTheme = createTheme({
  ...theme
});
const {
  REACT_APP_ENDPOINT = ''
} = process.env;
export default function App() {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState('');
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter()
        ],
        []
    );

    return (
      <AppContext.Provider value={{
        setError,
        setSuccess,
        setLoadingMessage,
      }}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <BrowserRouter>
          <ConnectionProvider endpoint={REACT_APP_ENDPOINT}>
              <WalletProvider wallets={wallets} autoConnect>
                  <WalletModalProvider>
                      <Header />
                      <Container maxWidth="md">
                        <Routes>
                          <Route element={<CreateProposal />} path="/create-proposal" />
                          <Route element={<ListProposals />} path="/list-proposals" />
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
    );
};