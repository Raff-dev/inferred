import { AppBar, Button, Toolbar } from "@mui/material";
import { default as React } from "react";
import {
    Link,
    Route,
    BrowserRouter as Router,
    Link as RouterLink,
    Routes,
} from "react-router-dom";
import Dashboard from "./dashboard/Dashboard";
import "./index.css";
import ModelComparison from "./models/ModelComparison";
import Graph from "./sensors/Graph";

function App({ onLogout }) {
    return (
        <Router>
            <AppBar position="static">
                <Toolbar>
                    <Link component={RouterLink} to="/">
                        <Button color="inherit">Dashboard</Button>
                    </Link>
                    <Link component={RouterLink} to="/sensors">
                        <Button color="inherit">Sensors</Button>
                    </Link>
                    <Link component={RouterLink} to="/models">
                        <Button color="inherit">Models</Button>
                    </Link>
                    <Button color="inherit" onClick={onLogout}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/sensors" element={<Graph />} />
                <Route path="/models" element={<ModelComparison />} />
            </Routes>
        </Router>
    );
}

export default App;
