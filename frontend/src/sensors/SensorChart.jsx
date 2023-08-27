import { curveCardinal } from "d3-shape";
import React from "react";
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from "recharts";
import { PRIMARY_COLOR, SECONDARY_COLOR } from "../themes";
import { parseDate } from "../utils/utils";
import { legendPayload } from "./utils";

const cardinal = curveCardinal.tension(0.2);

// reads = [
//     {
//         sensor_0: 0.0,
//         sensor_1: 0.0,
//     },...
// ]

export const SensorChart = ({ reads, models, timestamps, selectedSensor }) => {
    const readsSeries = reads.map((read, index) => {
        return {
            timestamp: timestamps[index],
            value: read[selectedSensor],
        };
    });

    return (
        <LineChart
            width={1200}
            height={400}
            margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
            }}
        >
            <CartesianGrid stroke="#eee2" strokeDasharray="1 1" />
            <XAxis
                dataKey="timestamp"
                tickFormatter={parseDate}
                angle={-20}
                type="category"
                allowDuplicatedCategory={false}
            />
            <YAxis />
            <Legend payload={legendPayload} verticalAlign="top" />
            <Line
                data={readsSeries}
                dataKey="value"
                stroke={PRIMARY_COLOR}
                type={cardinal}
                isAnimationActive={false}
                fill={SECONDARY_COLOR}
                fillOpacity={0.9}
                strokeOpacity={0.9}
                dot={false}
            />
        </LineChart>
    );
};
