import { curveCardinal } from "d3-shape";
import React from "react";
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from "recharts";
import { NICE_COLORS, TRIETARY_COLOR } from "../themes";
import { parseDate } from "../utils/utils";
import { getFutureTimestamps, legendPayload } from "./utils";

const cardinal = curveCardinal.tension(0.2);

export const SensorChart = ({ reads, models, timestamps, selectedSensor }) => {
    const futureTimestamps = getFutureTimestamps(timestamps);
    const readsSeries = reads.map((read, index) => {
        return {
            timestamp: timestamps[index],
            value: read[selectedSensor],
        };
    });

    const modelSeries = {};
    for (const [modelName, values] of Object.entries(models)) {
        const current = readsSeries[readsSeries.length - 1];
        const data = futureTimestamps.map((timestamp, index) => ({
            timestamp: timestamp,
            value: values[selectedSensor][index],
        }));
        modelSeries[modelName] = [current, ...data];
    }

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
                angle={-20}
                type="category"
                tickFormatter={parseDate}
                allowDuplicatedCategory={false}
            />
            <YAxis />
            <Legend payload={legendPayload} verticalAlign="top" />
            <Line
                data={readsSeries}
                dataKey="value"
                stroke={TRIETARY_COLOR}
                type={cardinal}
                isAnimationActive={false}
                fillOpacity={0.9}
                strokeOpacity={0.9}
                dot={false}
            />
            {Object.entries(modelSeries).map(([modelName, values], index) => {
                return (
                    <Line
                        key={modelName}
                        data={values}
                        dataKey="value"
                        type={cardinal}
                        animationDuration={0}
                        dot={false}
                        stroke={NICE_COLORS[index % NICE_COLORS.length]}
                    />
                );
            })}
        </LineChart>
    );
};

// reads = [
//     {
//         sensor_0: 0.0,
//         sensor_1: 0.0,
//     },...
// ]

// models = [
//    {
//      "model_0": {
//          sensor_0: [0.0],
//          sensor_1: [0.0],
//      },
//      "model_1": {},...
//    }
// ]

// modelSeries = {
//     model_0: [
//         {
//             timestamp: "timestamp 0",
//             value: 0.0,
//         }
//     ],
// }
