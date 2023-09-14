import React, { useEffect, useState } from "react";
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { PRIMARY_COLOR, SECONDARY_COLOR } from "../themes";
import ArrowSlider from "../utils/ArrowSlider";

const lineName = (index) => `pred-${index}`;

export const transformPredictions = (inputObject, timestamps) => {
    const output = [];
    const numData = inputObject.length;
    const maxLen = inputObject.length;

    for (let i = 0; i < maxLen; i++) {
        const entry = {};
        entry["timestamp"] = timestamps[i];

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

const PredictionTimeline = ({ predictionData, data }) => {
    const [previewIndex, setPreviewIndex] = useState(0);

    const timestamps = data.map((item) => item.timestamp);
    const transformedData = transformPredictions(predictionData, timestamps);
    const lineNames = Array.from({ length: predictionData.length }, (_, i) =>
        lineName(i + 1)
    );

    useEffect(() => setPreviewIndex(0), [predictionData]);

    return (
        <div>
            <h1>Prediction Timeline</h1>
            <ResponsiveContainer width="100%" height={800}>
                <LineChart
                    data={transformedData}
                    margin={{ right: 25, top: 10, bottom: 20 }}
                >
                    <XAxis dataKey="timestamp" angle={-20} />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    {predictionData.length && (
                        <Line
                            data={data}
                            type="monotone"
                            dataKey="value"
                            name="Sensor data"
                            stroke={PRIMARY_COLOR}
                            strokeWidth={2}
                            isAnimationActive={false}
                            dot={false}
                        />
                    )}
                    {lineNames.map((name, i) => (
                        <Line
                            type="monotone"
                            key={name}
                            dataKey={name}
                            name={name}
                            stroke={SECONDARY_COLOR}
                            isAnimationActive={false}
                            dot={false}
                            opacity={i == previewIndex ? 1 : 0.2}
                            strokeWidth={i == previewIndex ? 2 : 1}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
            <ArrowSlider
                value={previewIndex}
                setValue={setPreviewIndex}
                min={0}
                max={lineNames.length - 1}
                label="Preview Index"
            />
        </div>
    );
};

export default PredictionTimeline;
