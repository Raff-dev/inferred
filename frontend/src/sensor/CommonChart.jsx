import { curveCardinal } from "d3-shape";
import React from "react";
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from "recharts";
import { parseDate } from "../Utils";
import { PRIMARY_COLOR, SECONDARY_COLOR } from "../constants";

const cardinal = curveCardinal.tension(0.2);

export const SensorChart = ({ data, selectedSensor }) => {
    const legendPayload = [
        { value: "Sensor Value", type: "line", dataKey: "value", color: PRIMARY_COLOR },
        { value: "Prediction", type: "line", color: SECONDARY_COLOR },
    ];
    const datas = [
        data.timestamps || { name: "timestamps" },
        data.sensors[selectedSensor] || { name: selectedSensor },
        ...(data.predictions[selectedSensor] || []),
    ];

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
            {datas.map((series) => (
                <Line
                    key={series.name}
                    data={series.data}
                    name={series.name}
                    dataKey="value"
                    stroke={
                        series.name?.includes("prediction")
                            ? SECONDARY_COLOR
                            : PRIMARY_COLOR
                    }
                    type={cardinal}
                    isAnimationActive={false}
                    fill={SECONDARY_COLOR}
                    fillOpacity={0.9}
                    strokeOpacity={0.9}
                    dot={false}
                />
            ))}
        </LineChart>
    );
};
