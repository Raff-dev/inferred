import Slider from "@mui/material/Slider";
import React, { useEffect, useState } from "react";
import { DATA_WINDOW_SIZE_DEFAULT, MINUTE, WEB_SOCKET_URL } from "../constants";

import { SensorLineChart } from "./SensorLineChart";

const SensorsGrid = ({ data, sensorNames }) => {
    const [visibleSensors, setVisibleSensors] = useState(sensorNames);

    const handleSensorToggle = (sensorName) => {
        if (visibleSensors.includes(sensorName)) {
            setVisibleSensors(
                visibleSensors.filter((name) => name !== sensorName).sort()
            );
        } else {
            setVisibleSensors([...visibleSensors, sensorName].sort());
        }
    };

    return (
        <div>
            <div>
                {sensorNames.map((sensorName) => (
                    <label key={sensorName}>
                        <input
                            value={sensorName}
                            type="checkbox"
                            checked={visibleSensors.includes(sensorName)}
                            onChange={() => handleSensorToggle(sensorName)}
                        />
                        {sensorName}
                    </label>
                ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
                {visibleSensors.map((sensorName) => (
                    <SensorLineChart
                        key={sensorName}
                        data={data}
                        sensorName={sensorName}
                    />
                ))}
            </div>
        </div>
    );
};

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [sensorNames, setSensorNames] = useState([]);
    const [windowData, setWindowData] = useState([]);
    const [windowSize, setWindowSize] = useState(DATA_WINDOW_SIZE_DEFAULT);

    const sensorData = {
        timestamp: "2023-08-19T16:48:10.977452",
        simulation_model: "naive",
        sensors: [
            {
                timestamp: "2023-08-19T16:48:10",
                sensor_0: 7.23203574083519,
                sensor_1: 0,
                sensor_2: 0.4509955643059914,
            },
            {
                timestamp: "2023-08-19T16:49:10",
                sensor_0: 7.43203574083519,
                sensor_1: 1,
                sensor_2: 0.6509955643059914,
            },
            {
                timestamp: "2023-08-19T16:50:10",
                sensor_0: 7.43203574083519,
                sensor_1: 1,
                sensor_2: 0.6509955643059914,
            },
            // Add more data points here...
        ],
    };

    useEffect(() => {
        setWindowData(data.slice(-windowSize));
    }, [windowSize, data]);

    useEffect(() => {
        const ws = new WebSocket(WEB_SOCKET_URL);
        ws.onmessage = (event) => {
            const newData = JSON.parse(event.data);
            const newChunk = { timestamp: newData.timestamp };

            const newSensorNames = Object.keys(newData.sensors).sort();
            for (const sensor of newSensorNames) {
                newChunk[sensor] = newData.sensors[sensor].value;
            }
            setData((prevData) => [...prevData, newChunk]);
            if (sensorNames.length === 0) setSensorNames(newSensorNames);
        };

        return () => {
            ws.close();
        };
    }, []);

    return (
        <div>
            <h1>Sensors Data</h1>
            <Slider
                value={windowSize}
                size="small"
                min={20}
                max={MINUTE}
                step={5}
                marks
                valueLabelDisplay="auto"
                onChange={(e) => setWindowSize(e.target.value)}
            />
            <SensorsGrid data={windowData} sensorNames={sensorNames} />
        </div>
    );
};

export default Dashboard;
