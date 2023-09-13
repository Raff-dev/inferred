import React from "react";

const lineName = (index) => `pred-${index}`;

export const transformPredictions = (inputObject) => {
    const output = [];
    const numData = inputObject.length;
    const maxPredLen = Math.max(
        ...inputObject.map((item) => item.predictions.length)
    );
    const maxLen = numData + maxPredLen - 1;

    for (let i = 0; i < maxLen; i++) {
        const entry = {};
        const timestamp = `t${i + 1}`;
        entry["timestamp"] = timestamp;

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
        return <></>;
    }

    const transformedData = transformPredictions(predictionData);
    const lineNames = Array.from({ length: n }, (_, i) => lineName(i + 1));

    return (
        <div>
            <h1>Prediction Timeline</h1>
            <ul>
                {predictionData &&
                    predictionData.map((item, index) => (
                        <li key={index}>
                            Start Timestamp: {item.start_timestamp}
                            <ul>
                                {item.predictions.map(
                                    (prediction, subIndex) => (
                                        <li key={subIndex}>
                                            Prediction: {prediction}
                                        </li>
                                    )
                                )}
                            </ul>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default PredictionTimeline;
