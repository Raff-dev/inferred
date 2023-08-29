import React from "react";
import {
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from "recharts";
import { TRIETARY_COLOR } from "../themes";

export const SensorLineChart = ({ data, sensorName }) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <XAxis dataKey="timestamp" angle={-20} />
                <YAxis datakey="value" />
                <Legend verticalAlign="top" />
                <Line
                    type="monotone"
                    dataKey={sensorName}
                    name={sensorName}
                    stroke={TRIETARY_COLOR}
                    isAnimationActive={false}
                    dot={false}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};
