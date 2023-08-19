import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import Slider from "@mui/material/Slider";
import React, { useEffect, useState } from "react";
import { MyCommonChart } from "./CommonChart";
import { SensorTabs } from "./SensorTabs";

const DAY = 24 * 60 * 60;
const HOUR = 60 * 60;
const MINUTE = 60;

const LOOKAHEAD = 100;

const DATA_WINDOW_SIZE_DEFAULT = HOUR;
const WEB_SOCKET_URL = "ws://localhost:8000/ws/sensors/";

const ChartView = () => {
    const [data, setData] = useState({
        timestamps: {},
        sensors: {},
        predictions: {},
    });
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
        const updatedData = { ...prevData };

        // remove ms from timestamp
        const timestampWithoutMs = timestamp.split(".")[0];
        const timestamps = getTimestamps(
            timestampWithoutMs,
            LOOKAHEAD,
            prediction_interval
        );
        const currentTimestamp = timestamps[0];

        if (updatedData.timestamps.data) {
            updatedData.timestamps.data.push({
                timestamp: currentTimestamp,
                value: null,
            });
        } else {
            updatedData.timestamps = {
                name: "timestamps",
                data: timestamps.map((timestamp) => ({ timestamp, value: null })),
            };
        }

        // Loop through each sensor in the newData object
        Object.entries(sensors).forEach(([sensorName, sensorData]) => {
            const sensorObject = updatedData.sensors[sensorName];
            if (!sensorObject) {
                updatedData.sensors[sensorName] = {
                    name: sensorName,
                    data: [{ timestamp: currentTimestamp, value: sensorData.value }],
                };
                updatedData.predictions[sensorName] = [];
            } else {
                sensorObject.data.push({
                    timestamp: currentTimestamp,
                    value: sensorData.value,
                });
            }

            const predicitonIndex = (sensorObject && sensorObject.data.length) || 0;
            updatedData.predictions[sensorName].push({
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

export default ChartView;

const fakeData = {
    timestamps: {
        name: "timestamps",
        data: [
            { timestamp: "1", value: null },
            { timestamp: "2", value: null },
            { timestamp: "3", value: null },
            { timestamp: "4", value: null },
            { timestamp: "5", value: null },
        ],
    },
    sensors: {
        sensor_0: {
            name: "sensor_0",
            data: [
                { timestamp: "1", value: Math.random() },
                { timestamp: "2", value: Math.random() },
                { timestamp: "3", value: Math.random() },
            ],
        },
    },
    predictions: {
        sensor_0: [
            {
                name: "prediction_0",
                data: [
                    { timestamp: "1", value: Math.random() },
                    { timestamp: "2", value: Math.random() },
                    { timestamp: "3", value: Math.random() },
                ],
            },
            {
                name: "prediction_1",
                data: [
                    { timestamp: "2", value: Math.random() },
                    { timestamp: "3", value: Math.random() },
                    { timestamp: "4", value: Math.random() },
                ],
            },
            {
                name: "prediction_2",
                data: [
                    { timestamp: "3", value: Math.random() },
                    { timestamp: "4", value: Math.random() },
                    { timestamp: "5", value: Math.random() },
                ],
            },
        ],
    },
};

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
