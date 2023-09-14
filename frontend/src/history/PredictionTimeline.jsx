import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import React from "react";
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { extendTimestamps } from "../prediction/utils";
import { SECONDARY_COLOR } from "../themes";

const lineName = (index) => `pred-${index}`;

export const transformPredictions = (inputObject) => {
    const output = [];
    const numData = inputObject.length;
    const maxPredLen = Math.max(
        ...inputObject.map((item) => item.predictions.length)
    );
    const maxLen = numData + maxPredLen - 1;
    const timestamps = inputObject.map((item) => item.start_timestamp);
    const extendedTimestamps = extendTimestamps(timestamps);
    console.log(inputObject);

    for (let i = 0; i < maxLen; i++) {
        const entry = {};
        entry["timestamp"] = extendedTimestamps[i];

        for (let j = 0; j < numData; j++) {
            const obj = inputObject[j];
            if (i - j < 0 || i - j >= obj.predictions.length) {
                continue;
            }
            const key = lineName(j + 1);
            const value = obj.predictions[i - j];
            entry[key] = value;
        }

        output.push(entry);
    }

    return output;
};

const PredictionTimeline = ({ predictionData }) => {
    if (predictionData.length === 0) {
        return (
            <Box sx={{ width: 160 }}>
                <CircularProgress size={20} />
            </Box>
        );
    }

    const transformedData = transformPredictions(predictionData);
    const lineNames = Array.from({ length: predictionData.length }, (_, i) =>
        lineName(i + 1)
    );

    console.log(transformedData);

    return (
        <div>
            <h1>Prediction Timeline</h1>
            <ResponsiveContainer width="100%" height={800}>
                <LineChart
                    data={transformedData}
                    margin={{ right: 25, top: 10 }}
                >
                    <XAxis dataKey="timestamp" angle={-20} />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    {lineNames.map((name, i) => (
                        <Line
                            type="monotone"
                            key={name}
                            dataKey={name}
                            name={name}
                            stroke={SECONDARY_COLOR}
                            isAnimationActive={false}
                            dot={false}
                            opacity={0.3}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PredictionTimeline;
