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
  { name: "Documentation", path: "/" },
  { name: "About Us", path: "/" },
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
              <Link style={{ textDecoration: "none" }} to={page.path}>
                <Button
                  key={index}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page.name}
                </Button>
              </Link>
            ))}
          </Box>
          <Box
            component={Stack}
            direction="row"
            spacing={2}
            sx={{ flexGrow: 2 }}
          >
            <Link style={{ textDecoration: "none" }} to="/list-proposals">
              <Button variant="text" color="info">
                Go to proposal list
              </Button>
            </Link>
            <Typography
              // fontFamily="'Pacifico', cursive;"
              variant="subtitle1"
              sx={{ pt: 0.5 }}
            >
              or
            </Typography>
            <Link style={{ textDecoration: "none" }} to="/create-proposal">
              <Button variant="contained" color="info">
                Create your proposal
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
