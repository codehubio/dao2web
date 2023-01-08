import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Avatar, CardActionArea, CardHeader, Grid } from "@mui/material";
import { TParseProposalDetail } from "../../types/ProposalDetail";
import dayjs from "dayjs";

export default function ProposalCard({
  proposal,
}: {
  proposal: TParseProposalDetail;
}) {
  const {
    detail: {
      name,
      imageUrl,
      description,
      numberOfApprovals,
      numberOfTransactions,
    },
  } = proposal;
  function getStatus(): string {
    if (!proposal?.detail) {
      return "Pending";
    }
    if (proposal.detail.isExecuted) {
      return "Executed";
    } else if (proposal.detail.isApproved) {
      return "Approved";
    } else if (proposal.detail.isRejected) {
      return "Rejected";
    } else if (proposal.detail.isSettled) {
      return "Settled";
    }
    return "Pending";
  }
  function getExpiration() {
    const expireAt = dayjs(proposal?.detail.expireOrFinalizeAfter);
    if (expireAt.valueOf() === 0) {
      return "None";
    }
    return expireAt.format("YYYY/MM/DD HH:mm:ss");
  }
  function getCreatedAt() {
    const createdAt = dayjs(proposal?.detail.createdAt);
    return createdAt.format("YYYY/MM/DD HH:mm:ss");
  }
  return (
    <Card sx={{ width: "50%" }}>
      <CardActionArea>
        <CardHeader
          avatar={<Avatar alt="Remy Sharp" src={imageUrl} />}
          title={name}
          titleTypographyProps={{ variant: "h6" }}
        />
        <CardContent>
          <Grid container>
            <Grid item xs={6}>
              <Typography
                component="div"
                variant="subtitle1"
                fontWeight="bold"
                color="text.secondary"
              >
                Description:{" "}
                <Typography
                  variant="subtitle1"
                  display="inline"
                  color="primary"
                >
                  {description}
                </Typography>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                component="div"
                variant="subtitle1"
                fontWeight="bold"
                color="text.secondary"
              >
                Number of transactions:{" "}
                <Typography
                  variant="subtitle1"
                  display="inline"
                  color="primary"
                >
                  {numberOfTransactions}
                </Typography>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                component="div"
                fontWeight="bold"
                variant="subtitle1"
                color="text.secondary"
              >
                Number of approvals:{" "}
                <Typography
                  variant="subtitle1"
                  display="inline"
                  color="primary"
                >
                  {numberOfApprovals}
                </Typography>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                component="div"
                fontWeight="bold"
                variant="subtitle1"
                color="text.secondary"
              >
                Status:{" "}
                <Typography variant="subtitle1" display="inline" color="error">
                  {getStatus()}
                </Typography>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                component="div"
                variant="subtitle1"
                fontWeight="bold"
                color="text.secondary"
              >
                Expiration:{" "}
                <Typography
                  variant="subtitle1"
                  display="inline"
                  color="primary"
                >
                  {getExpiration()}
                </Typography>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                component="div"
                variant="subtitle1"
                fontWeight="bold"
                color="text.secondary"
              >
                Created at:{" "}
                <Typography
                  display="inline"
                  variant="subtitle1"
                  color="primary"
                >
                  {getCreatedAt()}
                </Typography>
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
