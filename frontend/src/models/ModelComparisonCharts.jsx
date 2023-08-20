import React from "react";
import {
    Area,
    CartesianGrid,
    ComposedChart,
    Legend,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { PRIMARY_COLOR, TRIETARY_COLOR } from "../themes";

const ModelComparisonLineChart = ({ data, metricName, modelNames }) => {
    console.log(data);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" type="category" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                {modelNames.map((modelName, index) => (
                    <Line
                        yAxisId="left"
                        key={modelName}
                        type="monotone"
                        dataKey={`${modelName}.${metricName}`}
                        name={modelName}
                        stroke={PRIMARY_COLOR}
                        strokeWidth={3}
                    />
                ))}
                {modelNames.map((modelName, index) => (
                    <Area
                        yAxisId="right"
                        key={modelName + " Cumsum"}
                        type="monotone"
                        dataKey={`${modelName}.${metricName} Cumsum`}
                        name={`${modelName} Cumulative`}
                        stroke={TRIETARY_COLOR}
                        fill={TRIETARY_COLOR}
                        opacity={0.2}
                    />
                ))}
            </ComposedChart>
        </ResponsiveContainer>
    );
};

const ModelComparisonCharts = ({ chartData, errorNames, modelNames }) => {
    const errorNamesNoCumsum = errorNames.filter((e) => !e.includes("Cumsum"));
    return (
        <div>
            {errorNamesNoCumsum.map((metricName) => (
                <div key={metricName}>
                    <h3>{metricName}</h3>
                    <ModelComparisonLineChart
                        data={chartData}
                        metricName={metricName}
                        modelNames={modelNames}
                    />
                </div>
            ))}
        </div>
    );
};

export default ModelComparisonCharts;
