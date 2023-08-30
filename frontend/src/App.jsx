import { AppBar, Button, Toolbar } from "@mui/material";
import { default as React } from "react";
import {
    Link,
    Route,
    BrowserRouter as Router,
    Link as RouterLink,
    Routes,
} from "react-router-dom";
import ModelComparison from "./comparison/ModelComparison";
import History from "./history/History";
import "./index.css";
import Monitor from "./monitor/Monitor";
import Graph from "./prediction/Graph";

function App({ onLogout }) {
    return (
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
                </Toolbar>
            </AppBar>

            <Routes>
                <Route path="/" element={<Monitor />} />
                <Route path="/history" element={<History />} />
                <Route path="/prediction" element={<Graph />} />
                <Route path="/comparison" element={<ModelComparison />} />
            </Routes>
        </Router>
    );
}

export default App;
