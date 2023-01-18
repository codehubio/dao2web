/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { AddCircleOutlineOutlined } from "@mui/icons-material";
import CancelButton from "../CancelButton";

export default function SettleConfirmationDialog({
  executeFn,
  reloadFn,
  open,
  handleClose,
  dialogContent = "",
  dialogTitle = "",
  warningText,
  actionText,
}: {
  reloadFn?: Function;
  executeFn: any;
  open: boolean;
  handleClose: any;
  dialogContent: string;
  dialogTitle: string;
  actionText: string;
  warningText?: string;
}) {
  async function execute() {
    if (reloadFn) {
      await reloadFn();
    }
    await executeFn();
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
          {dialogTitle}
        </DialogTitle>
        <DialogContent>
          {dialogContent}
          {warningText ? (
            <Typography textAlign="center" color="secondary">
              {warningText}
            </Typography>
          ) : (
            <></>
          )}
        </DialogContent>
        <DialogActions>
          <Stack width="100%" direction="row" justifyContent="center">
            <Button
              startIcon={<AddCircleOutlineOutlined />}
              onClick={execute}
              color="primary"
              variant="text"
            >
              {actionText}
            </Button>
            <CancelButton handleClose={handleClose} />
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
}
