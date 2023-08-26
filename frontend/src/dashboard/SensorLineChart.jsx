import React from "react";
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from "recharts";
import { TRIETARY_COLOR } from "../themes";
import { parseDate } from "../utils/utils";

export const SensorLineChart = ({ data, sensorName }) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid stroke="#eee2" strokeDasharray="1 1" />
                <XAxis
                    dataKey="timestamp"
                    tickFormatter={parseDate}
                    type="category"
                    angle={-20}
                    allowDuplicatedCategory={false}
                />
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
