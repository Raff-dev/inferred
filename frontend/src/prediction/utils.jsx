import { LOOKAHEAD, PREDICTION_INTERVAL } from "../constants";
import { PRIMARY_COLOR, SECONDARY_COLOR } from "../themes";

export const getFutureTimestamps = (timestamps) => {
    if (!timestamps.length) return [];

    const start = timestamps[timestamps.length - 1];
    const futureTimestamps = [];
    let currentTimestamp = new Date(start).getTime();

    for (let i = 0; i < LOOKAHEAD; i++) {
        futureTimestamps.push(new Date(currentTimestamp).toISOString());
        currentTimestamp += PREDICTION_INTERVAL;
    }

    return futureTimestamps;
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
