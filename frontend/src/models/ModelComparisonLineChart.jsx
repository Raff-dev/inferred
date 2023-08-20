import React from "react";
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
import { TRIETARY_COLOR } from "../constants";

const ModelComparisonLineChart = ({ data, metricName, modelNames }) => {
    console.log(data);
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" type="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                {modelNames.map((modelName, index) => (
                    <Line
                        key={modelName}
                        type="monotone"
                        dataKey={`${modelName}.${metricName}`}
                        name={modelName}
                        stroke={TRIETARY_COLOR}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
};
export default ModelComparisonLineChart;
