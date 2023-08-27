import Slider from "@mui/material/Slider";
import React, { useEffect, useState } from "react";
import {
    DATA_WINDOW_SIZE_DEFAULT,
    DATA_WINDOW_SIZE_MAX,
    DATA_WINDOW_STEP,
    MINUTE,
    WEB_SOCKET_URL,
} from "../constants";

import SensorGrid from "./SensorGrid";

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [sensorNames, setSensorNames] = useState([]);
    const [windowData, setWindowData] = useState([]);
    const [windowSize, setWindowSize] = useState(DATA_WINDOW_SIZE_DEFAULT);

    useEffect(() => {
        setWindowData(data.slice(-windowSize));
    }, [windowSize, data]);

    useEffect(() => {
        const ws = new WebSocket(WEB_SOCKET_URL);
        ws.onmessage = (event) => {
            const newData = JSON.parse(event.data);
            const newChunk = { timestamp: newData.timestamp };

            const newSensorNames = Object.keys(newData.reads).sort();
            for (const sensor of newSensorNames) {
                newChunk[sensor] = newData.reads[sensor];
            }
            setData((prevData) =>
                [...prevData, newChunk].slice(-DATA_WINDOW_SIZE_MAX)
            );
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
                min={MINUTE}
                max={DATA_WINDOW_SIZE_MAX}
                step={DATA_WINDOW_STEP}
                marks
                valueLabelDisplay="auto"
                onChange={(e) => setWindowSize(e.target.value)}
            />
            <SensorGrid data={windowData} sensorNames={sensorNames} />
        </div>
    );
};

export default Dashboard;
