import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { Stack } from "@mui/material";
import { Link } from "react-router-dom";

const pages = [
  {
    name: "Home",
    path: "/",
  },
  { name: "Documentation", path: "/documentation" },
  { name: "Contact", path: "/contact" },
];

function ResponsiveAppBar() {
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "'Pacifico', cursive;",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            TokenFlow
          </Typography>

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
          <Box
            component={Stack}
            direction="row"
            spacing={2}
            sx={{ flexGrow: 0, mr: 2 }}
          >
            <Link style={{ textDecoration: "none" }} to="/create-proposal">
              <Button variant="contained" color="info">
                Create your proposal
              </Button>
            </Link>
            <Link style={{ textDecoration: "none" }} to="/list-my-proposals">
              <Button variant="text" color="info">
                Your proposals
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
          <Box sx={{ flexGrow: 0 }}>
            <WalletMultiButton />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
