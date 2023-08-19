import { AppBar, Button, Toolbar } from "@mui/material";
import { default as React } from "react";
import {
    Link,
    Route,
    BrowserRouter as Router,
    Link as RouterLink,
    Routes,
} from "react-router-dom";
import About from "./About";
import Dashboard from "./Dashboard";
import Graph from "./Graph";
import "./index.css";

function App() {
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
                    <Link component={RouterLink} to="/about">
                        <Button color="inherit">About</Button>
                    </Link>
                </Toolbar>
            </AppBar>

            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/sensors" element={<Graph />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </Router>
    );
}

export default App;
