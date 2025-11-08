import { Snackbar, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import { hideAlert } from "../store/alertStore";

import type { RootState, AppDispatch } from "../store/store";

export default function CustomAlert() {
  const dispatch: AppDispatch = useDispatch();
  const { open, message, severity } = useSelector(
    (state: RootState) => state.alert
  );

  const handleClose = () => {
    dispatch(hideAlert());
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        sx={{ width: "100%" }}
        variant="filled"
      >
        {typeof message === "string" ? message : JSON.stringify(message)}
      </Alert>
    </Snackbar>
  );
}
