import { Stack } from '@mui/material';
import {
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
export default function Header() {
  return (<>
  <Stack sx={{ mt: 1, mb: 1 }}direction='row-reverse' spacing={1}>
      <WalletMultiButton />
  </Stack>
  </>)
}