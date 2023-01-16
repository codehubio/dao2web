import { CancelOutlined } from "@mui/icons-material";
import Button from "@mui/material/Button";

function CancelButton({ handleClose }: any) {
  return (
    <>
      <Button
        startIcon={<CancelOutlined />}
        variant="text"
        onClick={handleClose}
        color="error"
      >
        CANCEL
      </Button>
    </>
  );
}
export default CancelButton;
