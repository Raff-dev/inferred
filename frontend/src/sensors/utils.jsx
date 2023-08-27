import { PREDICTION_INTERVAL } from "../constants";
import { PRIMARY_COLOR, SECONDARY_COLOR } from "../themes";

export const getTimestamps = (start, count) => {
    const timestamps = [];
    let currentTimestamp = new Date(start).getTime();

    for (let i = 0; i < count; i++) {
        timestamps.push(new Date(currentTimestamp).toISOString());
        currentTimestamp += PREDICTION_INTERVAL;
    }

    return timestamps;
};

export const legendPayload = [
    {
        value: "Sensor Value",
        type: "line",
        dataKey: "value",
        color: PRIMARY_COLOR,
    },
    {
        value: "Prediction",
        type: "line",
        color: SECONDARY_COLOR,
        dataKey: "value",
    },
];
