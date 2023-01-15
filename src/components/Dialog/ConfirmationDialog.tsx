/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { AddCircleOutlineOutlined, CancelOutlined } from "@mui/icons-material";

export default function ConfirmationDialog({
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
          Are you sure
        </DialogTitle>
        <DialogContent>This action cannot be undone</DialogContent>
        <DialogActions>
          <Button
            startIcon={<AddCircleOutlineOutlined />}
            onClick={execute}
            color="primary"
            variant="text"
          >
            Ok
          </Button>
          <Button
            startIcon={<CancelOutlined />}
            variant="text"
            onClick={handleClose}
            color="error"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
