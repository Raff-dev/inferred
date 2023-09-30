import React from "react";
import { Line } from "recharts";
import { TRIETARY_COLOR } from "../themes";

const HorizonLine = ({ timestamps, predictionData, horizon }) => {
    const horizonLine = [];

    if (horizon > 0 && predictionData.length > horizon) {
        for (let i = 0; i < horizon - 1; i++) {
            horizonLine.push({
                timestamp: timestamps[i],
                value: null,
            });
        }

        let predictionDataHorizon = predictionData.slice(0, -horizon);
        for (let [index, item] of predictionDataHorizon.entries()) {
            horizonLine.push({
                timestamp: timestamps[index + horizon - 1],
                value: item.predictions[horizon - 1],
            });
        }
    }

    return (
        <Line
            xAxisId={"0"}
            type="monotone"
            data={horizonLine}
            dataKey="value"
            name="Horizon Line"
            stroke={TRIETARY_COLOR}
            isAnimationActive={false}
            dot={false}
        />
    );
};

export default HorizonLine;
