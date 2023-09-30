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
import { extendDomainRange, getDomainRangeData } from "../utils/utils";
import HistoryMenu from "./HistoryMenu";
import PredictionTimeline from "./PredictionTimeline";

const HistoryView = () => {
    const [data, setData] = useState([]);
    const [predictionData, setPredictionData] = useState([]);

    const domain = getDomainRangeData(data);
    const extendedDomain = extendDomainRange(domain);

    return (
        <ThemeProvider theme={darkTheme}>
            <h1>History</h1>
            <HistoryMenu
                setData={setData}
                setPredictionData={setPredictionData}
            />
            <ResponsiveContainer width="100%" height={800}>
                <LineChart data={data} margin={{ right: 25, top: 10 }}>
                    <XAxis dataKey="timestamp" angle={-20} />
                    <YAxis domain={extendedDomain} />
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
                        strokeWidth={2}
                    />
                </LineChart>
            </ResponsiveContainer>
            <PredictionTimeline predictionData={predictionData} data={data} />
        </ThemeProvider>
    );
};

export default HistoryView;
