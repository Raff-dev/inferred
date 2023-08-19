import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";

import { styled } from "@mui/system";

const StyledForm = styled("form")({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
});

const LoginForm = ({ onLogin, error }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div>
            <StyledForm onSubmit={(event) => onLogin({ event, username, password })}>
                <TextField
                    label="Username"
                    variant="outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    sx={{ marginBottom: "16px", backgroundColor: "white" }} // Add white background
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ marginBottom: "16px", backgroundColor: "white" }} // Add white background
                />
                <Button variant="contained" type="submit">
                    Login
                </Button>
            </StyledForm>
        </div>
    );
};

export default LoginForm;
