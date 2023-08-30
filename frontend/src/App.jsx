import { AppBar, Button, Toolbar } from "@mui/material";
import { default as React } from "react";
import {
    Link,
    Route,
    BrowserRouter as Router,
    Link as RouterLink,
    Routes,
} from "react-router-dom";
import ModelComparisonView from "./comparison/ModelComparisonView";
import History from "./history/HistoryView";
import "./index.css";
import Monitor from "./monitor/MonitorView";
import Graph from "./prediction/PredictionView";

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
                <Route path="/comparison" element={<ModelComparisonView />} />
            </Routes>
        </Router>
    );
}

export default App;
