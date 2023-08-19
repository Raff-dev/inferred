import axios from "axios";
import React, { useState } from "react";
import App from "../App";
import { API_LOGIN_URL } from "../constants";
import LoginForm from "./LoginForm";

const AuthWrapper = () => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [error, setError] = useState("");

    const onLogin = ({ event, username, password }) => {
        event.preventDefault();
        console.log("onLogin");
        axios
            .post(API_LOGIN_URL, { username: username, password: password })
            .then((response) => {
                const newToken = response.data.token;
                localStorage.setItem("token", newToken);
                setToken(newToken);
                setError("");
            })
            .catch((error) => {
                setError("Invalid username or password. " + error.message);
            });
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

    if (token) {
        // Render the main app if the token is present
        return <App onLogout={handleLogout} />;
    } else {
        // Render the login component if the token is not present
        return <LoginForm onLogin={onLogin} error={error} />;
    }
};

export default AuthWrapper;
