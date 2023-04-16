import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import Slider from "@mui/material/Slider";
import { curveCardinal } from "d3-shape";
import React, { useEffect, useState } from "react";
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
import { SensorTabs } from "./SensorTabs";

const DAY = 24 * 60 * 60;
const HOUR = 60 * 60;
const MINUTE = 60;

const LOOKAHEAD = 100;

const DATA_WINDOW_SIZE_DEFAULT = HOUR;
const WEB_SOCKET_URL = "ws://localhost:8000/ws/sensors/";
const PRIMARY_COLOR = "#3164b5c8";
const SECONDARY_COLOR = "#6e4923cf";
const CHARTS = {
    line: [LineChart, Line],
    area: [AreaChart, Area],
};

const cardinal = curveCardinal.tension(0.2);

const ChartView = () => {
    const [data, setData] = useState([]);
    const [windowData, setWindowData] = useState([]);
    const [windowSize, setWindowSize] = useState(DATA_WINDOW_SIZE_DEFAULT);
    const [chartType, setChartType] = useState("line");
    const [selectedSensor, setSelectedSensor] = useState(null);
    const [sensors, setSensors] = useState([]);

    function getTimestamps(start, count, interval) {
        const timestamps = [];
        let currentTimestamp = new Date(start).getTime();

        for (let i = 0; i < count; i++) {
            timestamps.push(new Date(currentTimestamp).toISOString());
            currentTimestamp += interval;
        }

        return timestamps;
    }

    function updateData(prevData, newData) {
        // return fakeData;
        const { sensors, timestamp, prediction_interval } = newData;
        const updatedData = [...prevData];

        // remove ms from timestamp
        const timestampWithoutMs = timestamp.split(".")[0];
        const timestamps = getTimestamps(
            timestampWithoutMs,
            LOOKAHEAD,
            prediction_interval
        );
        const currentTimestamp = timestamps[0];

        if (updatedData.length === 0) {
            updatedData.push({
                name: "timestamps",
                data: timestamps.map((timestamp) => ({ timestamp, value: null })),
            });
        } else {
            const sortedTimestamps = updatedData.find(
                (sensor) => sensor.name === "timestamps"
            );
            sortedTimestamps.data.push({ timestamp: currentTimestamp, value: null });
        }

        // Loop through each sensor in the newData object
        Object.entries(sensors).forEach(([sensorName, sensorData]) => {
            // Find the corresponding sensor object in the updatedData array
            const sensorObject = updatedData.find(
                (sensor) => sensor.name === sensorName
            );

            // If the sensor object doesn't exist, create a new one and add it to the array
            if (!sensorObject) {
                updatedData.push({
                    name: sensorName,
                    data: [{ timestamp: currentTimestamp, value: sensorData.value }],
                });
            } else {
                // If the sensor object exists, add the new data to the existing data array
                sensorObject.data.push({
                    timestamp: currentTimestamp,
                    value: sensorData.value,
                });
            }

            const predicitonIndex = (sensorObject && sensorObject.data.length) || 0;
            // Loop through each prediction value and add it as a new prediction object
            updatedData.push({
                name: `${sensorName}_prediction_${predicitonIndex}`,
                data: timestamps.map((timestamp, index) => ({
                    timestamp,
                    value: sensorData.prediction[index],
                })),
            });
        });
        return updatedData;
    }

    const handleWindowSizeChange = (event, newValue) => {
        setWindowSize(newValue);
        setWindowData((prevData) => data.slice(-newValue));
    };

    const handleChartTypeChange = (event) => {
        setChartType(event.target.value);
    };

    useEffect(() => {
        const ws = new WebSocket(WEB_SOCKET_URL);
        ws.onmessage = (event) => {
            const newData = JSON.parse(event.data);

            if (selectedSensor === null) {
                const sensors = Object.keys(newData.sensors);
                setSensors(sensors);
                setSelectedSensor(sensors[0]);
            }
            console.log(data);
            setData((prevData) => updateData(prevData, newData));
            setWindowData((prevData) => [
                ...prevData.slice(-windowSize - LOOKAHEAD),
                newData,
            ]);
        };

        return () => {
            ws.close();
        };
    }, [windowSize, selectedSensor]);

    const props = { data, chartType, selectedSensor };

    return (
        <div>
            <SensorTabs
                sensors={sensors}
                selectedSensor={selectedSensor}
                setSelectedSensor={setSelectedSensor}
            />
            <RadioGroup row value={chartType} onChange={handleChartTypeChange}>
                <FormControlLabel value="line" control={<Radio />} label="Line" />
                <FormControlLabel value="area" control={<Radio />} label="Area" />
            </RadioGroup>
            <div
                style={{
                    backgroundColor: "#0003",
                    borderRadius: 12,
                    padding: 20,
                    paddingRight: 50,
                    marginBottom: 20,
                }}
            >
                <h2>{selectedSensor}</h2>
                <MyCommonChart {...props} />
                <Slider
                    value={windowSize}
                    size="small"
                    min={20}
                    max={MINUTE}
                    step={5}
                    marks
                    valueLabelDisplay="auto"
                    onChange={handleWindowSizeChange}
                />
            </div>
        </div>
    );
};

const MyCommonChart = ({ data, chartType, selectedSensor }) => {
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
        {
            value: "Prediction",
            type: "line",
            dataKey: "prediction",
            color: SECONDARY_COLOR,
        },
        {
            value: "Prediction",
            type: "area",
            dataKey: "prediction",
            color: SECONDARY_COLOR,
        },
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
            {data.map((series) => (
                <ChartElement
                    key={series.name}
                    data={series.data}
                    name={series.name}
                    dataKey="value"
                    stroke={
                        series.name.includes("prediction")
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

export default ChartView;

const fakeData = [
    {
        name: "Null",
        data: [
            { timestamp: "1", value: null },
            { timestamp: "2", value: null },
            { timestamp: "3", value: null },
            { timestamp: "4", value: null },
            { timestamp: "5", value: null },
        ],
    },
    {
        name: "sensor_0",
        data: [
            { timestamp: "1", value: Math.random() },
            { timestamp: "2", value: Math.random() },
            { timestamp: "3", value: Math.random() },
        ],
    },
    {
        name: "sensor_0_prediction_0",
        data: [
            { timestamp: "1", value: Math.random() },
            { timestamp: "2", value: Math.random() },
            { timestamp: "3", value: Math.random() },
        ],
    },
    {
        name: "sensor_0_prediction_1",
        data: [
            { timestamp: "2", value: Math.random() },
            { timestamp: "3", value: Math.random() },
            { timestamp: "4", value: Math.random() },
        ],
    },
    {
        name: "sensor_0_prediction_2",
        data: [
            { timestamp: "3", value: Math.random() },
            { timestamp: "4", value: Math.random() },
            { timestamp: "5", value: Math.random() },
        ],
    },
];

// {
//     "timestamp": "2021-09-01T00:00:00Z",
//     "prediction_interval": 1000,
//     "sensors": {
//         "sensor_0": {
//             "value": 0.5,
//             "prediction": [0.5, 0.5, ...]
//         }
//     },
// }
