import * as React from "react";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import Snackbar from "@mui/material/Snackbar";

interface StatusChangeAlertProps {
    newStatus: string;
}

export default function StatusChangeAlert({ newStatus }: StatusChangeAlertProps) {
    const [open, setOpen] = useState(true);

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") return;
        setOpen(false);
    };

    return (
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
            <Alert icon={<CheckIcon fontSize="inherit" />} variant="filled" severity="success" onClose={handleClose}>
                Статус изменён на <strong>&quot;{newStatus}&quot;</strong>
            </Alert>
        </Snackbar>
    );
}
