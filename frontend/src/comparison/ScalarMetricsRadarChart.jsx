import React from "react";
import {
    Legend,
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
    ResponsiveContainer,
} from "recharts";
import { NICE_COLORS } from "../themes";

const parseData = (scalarMetricsData, modelNames) => {
    if (scalarMetricsData.length === 0 || modelNames.length === 0) return [];
    const modelData = scalarMetricsData[modelNames[0]];
    if (modelData === undefined) return [];
    const metrics = Object.keys(scalarMetricsData[modelNames[0]]);

    // Calculate the maximum value for each metric to use as fullMark
    const maxValues = metrics.reduce((maxValues, metric) => {
        maxValues[metric] = Math.max(
            ...modelNames.map((model) => scalarMetricsData[model][metric])
        );
        return maxValues;
    }, {});

    // Transform the data into the desired format
    const parsedData = metrics.map((metric) => {
        const entry = { fullMark: maxValues[metric], metric: metric };
        modelNames.forEach((model) => {
            entry[model] = scalarMetricsData[model][metric];
        });
        return entry;
    });

    return parsedData;
};

const ScalarMetricsRadarChart = ({ scalarMetricsData, modelNames }) => {
    const parsedData = parseData(scalarMetricsData, modelNames);

    if (parsedData.length === 0) return <div>No data.</div>;

    // TODO: Add dynamic domain for the radius axis
    return (
        <ResponsiveContainer width="100%" height={400}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={parsedData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={30} domain={[0, 1]} />
                {modelNames.map((model, index) => (
                    <Radar
                        key={model}
                        name={model}
                        dataKey={model}
                        stroke={NICE_COLORS[index % NICE_COLORS.length]}
                        fill={NICE_COLORS[index % NICE_COLORS.length]}
                        fillOpacity={0.3}
                    />
                ))}
                <Legend />
            </RadarChart>
        </ResponsiveContainer>
    );
};

export default ScalarMetricsRadarChart;
