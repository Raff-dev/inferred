import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { default as React } from "react";
import {
    Link,
    Route,
    BrowserRouter as Router,
    Link as RouterLink,
    Routes,
} from "react-router-dom";
import About from "./About";
import "./App.css";
import Dashboard from "./Dashboard";
import Graph from "./Graph";
import "./index.css";

function App() {
    return (
        <Router>
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" style={{ flexGrow: 1 }}>
                            My App
                        </Typography>
                        <Link
                            component={RouterLink}
                            to="/"
                            color="inherit"
                            underline="none"
                        >
                            <Button color="inherit">Home</Button>
                        </Link>
                        <Link
                            component={RouterLink}
                            to="/sensors"
                            color="inherit"
                            underline="none"
                        >
                            <Button color="inherit">Sensors</Button>
                        </Link>
                        <Link
                            component={RouterLink}
                            to="/about"
                            color="inherit"
                            underline="none"
                        >
                            <Button color="inherit">About</Button>
                        </Link>
                    </Toolbar>
                </AppBar>

                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/sensors" element={<Graph />} />
                    <Route path="/about" element={<About />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
