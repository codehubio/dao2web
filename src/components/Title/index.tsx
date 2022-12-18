import { Typography } from '@mui/material';
export default function MyGrid({ title } : any) {
  return (<>
    <Typography variant="h3" component="h2">
      {title}
    </Typography>
  </>)
}