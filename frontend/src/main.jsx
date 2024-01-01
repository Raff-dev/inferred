import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React from "react";
import ReactDOM from "react-dom/client";
import AuthWrapper from "./login/AuthWrapper";

ReactDOM.createRoot(document.getElementById("root")).render(
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AuthWrapper />
    </LocalizationProvider>
);
