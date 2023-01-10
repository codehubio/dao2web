import { Typography, Link } from "@mui/material";

export default function Footer({ sx }: any) {
  return (
    <>
      <footer
        style={{
          margin: "auto",
          width: "50%",
          minHeight: "max-content",
          textAlign: "center",
          marginTop: "10px",
        }}
      >
        <Typography variant="caption">
          made with <span style={{ color: "#e25555" }}>&#9829;</span>&nbsp;
          <Link color="secondary" href="https://status.solana.com">
            solana
          </Link>
        </Typography>
      </footer>
    </>
  );
}
