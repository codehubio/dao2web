/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { AddCircleOutlineOutlined } from "@mui/icons-material";
import CancelButton from "../CancelButton";

export default function SettleConfirmationDialog({
  executeFn,
  reloadFn,
  open,
  handleClose,
}: {
  reloadFn?: Function;
  executeFn: any;
  open: boolean;
  handleClose: any;
}) {
  async function execute() {
    await executeFn();
    if (reloadFn) {
      await reloadFn();
    }
  }
  return (
    <>
      <Dialog
        maxWidth="md"
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        color="primary"
      >
        <DialogTitle textAlign="center" sx={{ mb: 1 }} id="alert-dialog-title">
          Are you sure?
        </DialogTitle>
        <DialogContent>
          After settled, proposal is ready to get approvals from involved
          parties. You cannot change or delete it anymore
        </DialogContent>
        <DialogActions>
          <Stack width="100%" direction="row" justifyContent="center">
            <Button
              startIcon={<AddCircleOutlineOutlined />}
              onClick={execute}
              color="primary"
              variant="text"
            >
              SETTLE
            </Button>
            <CancelButton handleClose={handleClose} />
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
}
