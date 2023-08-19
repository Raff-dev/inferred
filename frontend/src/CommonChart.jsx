import { curveCardinal } from "d3-shape";
import React from "react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    XAxis,
    YAxis,
} from "recharts";

const PRIMARY_COLOR = "#3164b5c8";
const SECONDARY_COLOR = "#6e4923cf";
const CHARTS = {
    line: [LineChart, Line],
    area: [AreaChart, Area],
};

const cardinal = curveCardinal.tension(0.2);

export const MyCommonChart = ({ data, chartType, selectedSensor }) => {
    const [Chart, ChartElement] = CHARTS[chartType];

    const parseDate = (value) => {
        const date = new Date(value);
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        seconds = seconds < 10 ? "0" + seconds : seconds;
        return (
            hours +
            ":" +
            minutes +
            ":" +
            seconds +
            ":" +
            Math.round(date.getMilliseconds() / 10)
        );
    };

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
        <Chart
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
            <YAxis dataKey="value" />
            <Legend payload={legendPayload} verticalAlign="top" />
            {datas.map((series) => (
                <ChartElement
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
        </Chart>
    );
};
