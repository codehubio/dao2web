/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import Typography from "@mui/material/Typography";
import { Button, Stack } from "@mui/material";
import { useContext, useEffect } from "react";
import AppContext from "../../share/context";
import { Link } from "react-router-dom";

export default function HomePage() {
  const { setBreads } = useContext(AppContext) as any;
  useEffect(() => {
    document.title = "Proposol - Proposal List";
    setBreads(["Home"]);
  }, []);
  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          flexShrink: 3,
          maxWidth: "50%",
        }}
      >
        <Typography variant="h3" fontWeight="bold">
          A secure, simple yet powerful flow&nbsp;...
        </Typography>
        <br />
        <Typography variant="subtitle2" fontWeight="medium">
          ...&nbsp;to transfer SPL and native SOL tokens among parties.
        </Typography>
        <br />
        <Stack direction="row" spacing={2}>
          <Link to="/documentation" style={{ textDecoration: "none" }}>
            <Button variant="contained" color="info">
              Learn more
            </Button>
          </Link>
          <Link to="/create-proposal" style={{ textDecoration: "none" }}>
            <Button variant="contained" color="secondary">
              Create a proposal
            </Button>
          </Link>
        </Stack>
      </div>
      <div
        style={{
          flexGrow: 5,
          maxWidth: "50%",
          maxHeight: "100%",
        }}
      >
        <img
          style={{ maxWidth: "100%" }}
          src="imgs/multichain-solana.png"
          alt="flow"
        ></img>
      </div>
    </div>
  );
}
