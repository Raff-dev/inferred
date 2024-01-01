import {
    AppBar,
    Button,
    ThemeProvider,
    ToggleButton,
    ToggleButtonGroup,
    Toolbar,
} from "@mui/material";
import { default as React, useState } from "react";
import {
    Link,
    Route,
    BrowserRouter as Router,
    Link as RouterLink,
    Routes,
} from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import ModelComparisonView from "./comparison/ModelComparisonView";
import HistoryView from "./history/HistoryView";
import MonitorView from "./monitor/MonitorView";
import PredictionView from "./prediction/PredictionView";
import { darkTheme, lightTheme } from "./themes";

function App({ onLogout }) {
    const currentTheme = sessionStorage.getItem("theme");
    const [theme, setTheme] = useState(
        currentTheme === "light" ? lightTheme : darkTheme
    );

    const handleThemeChange = (event, newTheme) => {
        const selectedTheme = newTheme === "light" ? lightTheme : darkTheme;
        setTheme(selectedTheme);
        sessionStorage.setItem("theme", newTheme);
    };

    const GlobalStyles = createGlobalStyle`
    :root {
        font-family: Roboto, Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
        background-color: ${theme.palette.background.default};
        max-width: 1280px;
        margin: 0 auto;
        padding: 2rem;
        text-align: center;
    }
`;
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles />
            <Router>
                <AppBar position="static">
                    <Toolbar>
                        <Link component={RouterLink} to="/">
                            <Button color="inherit">Monitor</Button>
                        </Link>
                        <Link component={RouterLink} to="/history">
                            <Button color="inherit">History</Button>
                        </Link>
                        <Link component={RouterLink} to="/prediction">
                            <Button color="inherit">Prediction</Button>
                        </Link>
                        <Link component={RouterLink} to="/comparison">
                            <Button color="inherit">Comparison</Button>
                        </Link>
                        <Button color="inherit" onClick={onLogout}>
                            Logout
                        </Button>
                        <div style={{ marginLeft: "auto" }}>
                            <ToggleButtonGroup
                                value={theme === lightTheme ? "light" : "dark"}
                                exclusive
                                onChange={handleThemeChange}
                            >
                                <ToggleButton value="light">Light</ToggleButton>
                                <ToggleButton value="dark">Dark</ToggleButton>
                            </ToggleButtonGroup>
                        </div>
                    </Toolbar>
                </AppBar>

                <Routes>
                    <Route path="/" element={<MonitorView />} />
                    <Route path="/history" element={<HistoryView />} />
                    <Route path="/prediction" element={<PredictionView />} />
                    <Route
                        path="/comparison"
                        element={<ModelComparisonView />}
                    />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
