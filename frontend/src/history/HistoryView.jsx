import { ThemeProvider } from "@mui/material/styles";
import React, { useState } from "react";
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { PRIMARY_COLOR, darkTheme } from "../themes";
import HistoryMenu from "./HistoryMenu";

const HistoryView = () => {
    const [data, setData] = useState([]);

    return (
        <ThemeProvider theme={darkTheme}>
            <h1>History</h1>
            <HistoryMenu setData={setData} />
            <ResponsiveContainer width="100%" height={800}>
                <LineChart data={data} margin={{ right: 25, top: 10 }}>
                    <XAxis dataKey="timestamp" angle={-20} />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="value"
                        name="Sensor data"
                        stroke={PRIMARY_COLOR}
                        isAnimationActive={false}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </ThemeProvider>
    );
};

export default HistoryView;
