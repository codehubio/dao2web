/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import Typography from "@mui/material/Typography";
import { useContext, useEffect } from "react";
import AppContext from "../../share/context";

export default function ContactPage() {
  const { setBreads } = useContext(AppContext) as any;
  useEffect(() => {
    document.title = "Proposol - Proposal List";
    setBreads(["Contact"]);
  }, []);
  return (
    <div style={{ display: "flex" }}>
      <div style={{ margin: "auto", maxWidth: "60%" }}>
        <Typography variant="subtitle2" fontWeight="light">
          Nguyen Ngo Huy Hoa {"<hoa[at]codehub.io>"}
        </Typography>
      </div>
    </div>
  );
}
