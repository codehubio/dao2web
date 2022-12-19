
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { TParseProposalDetail } from '../../types/ProposalDetail';

export default function ProposalInfo({ detail }: { detail: (TParseProposalDetail & { pda: string })}) {
  const {
    imageUrl,
    name,
    description,
    numberOfApprovals,
    numberOfSteps
  } = detail;
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="140"
        src={imageUrl}
        alt={name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Approvals: {numberOfApprovals}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Steps: {numberOfSteps}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Edit</Button>
        <Button size="small">Settle</Button>
      </CardActions>
    </Card>
  );
}