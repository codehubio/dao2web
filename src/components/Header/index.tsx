import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { Chip, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";

const pages = [
  {
    name: "Home",
    path: "/",
  },
  { name: "Documentation", path: "/documentation" },
  { name: "Contact", path: "/contact" },
];

function Header() {
  const { wallet } = useWallet();
  function isConnected(): boolean {
    return !!wallet?.adapter.connected;
  }
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <img alt="beta" src="imgs/logo.png" width="10%" height="10%"></img>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page, index) => (
              <Link
                key={index}
                style={{ textDecoration: "none" }}
                to={page.path}
              >
                <Button sx={{ my: 2, color: "white", display: "block" }}>
                  {page.name}
                </Button>
              </Link>
            ))}
          </Box>
          {isConnected() ? (
            <Box
              component={Stack}
              direction="row"
              spacing={2}
              sx={{ flexGrow: 0, mr: 2 }}
            >
              <Link style={{ textDecoration: "none" }} to="/create-proposal">
                <Button variant="contained" color="secondary">
                  Create your proposal
                </Button>
              </Link>
              <Link style={{ textDecoration: "none" }} to="/list-my-proposals">
                <Button variant="text" color="info">
                  My proposals
                </Button>
              </Link>
              <Link
                style={{ textDecoration: "none" }}
                to="/list-public-proposals"
              >
                <Button variant="text" color="info">
                  Public proposals
                </Button>
              </Link>
              <Link
                style={{ textDecoration: "none" }}
                to="/list-involved-proposals"
              >
                <Button variant="text" color="info">
                  Involved proposals
                </Button>
              </Link>
            </Box>
          ) : (
            <Chip color="warning" label="Please connect your wallet" />
          )}
          <Box sx={{ flexGrow: 0 }}>
            <WalletMultiButton />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
