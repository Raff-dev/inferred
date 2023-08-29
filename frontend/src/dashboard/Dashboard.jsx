import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import {
    DATA_WINDOW_SIZE_DEFAULT,
    DATA_WINDOW_SIZE_MAX,
    DATA_WINDOW_SIZE_MIN,
    DURATION_VALUES,
    WEB_SOCKET_URL,
} from "../constants";
import { parseDate } from "../utils/utils";

import SensorGrid from "./SensorGrid";

function valuetext(value) {
    return DURATION_VALUES[value];
}

const marks = Object.entries(DURATION_VALUES).map(([value, label]) => ({
    value: parseInt(value),
    label,
}));

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [sensorNames, setSensorNames] = useState([]);
    const [windowData, setWindowData] = useState([]);
    const [windowSize, setWindowSize] = useState(DATA_WINDOW_SIZE_DEFAULT);
    const [refreshEvery, setRefreshEvery] = useState(0);

    const onMessage = (event) => {
        const newData = JSON.parse(event.data);
        if (newData.past) {
            setData(newData.reads);
            setSensorNames(newData.dimensions);
            return;
        }

        const timestamp = parseDate(newData.timestamp);
        const newChunk = { timestamp, ...newData.reads };
        setData((prevData) => {
            return prevData.concat(newChunk).slice(-DATA_WINDOW_SIZE_MAX);
        });

        if (sensorNames.length === 0) {
            const sensorNames = Object.keys(newData.reads).sort();
            setSensorNames(sensorNames);
        }
    };

    useEffect(() => {
        if (windowSize > 900) {
            return;
        }

        setWindowData(data.slice(-windowSize));
    }, [data]);

    useEffect(() => {
        setWindowData(data.slice(-windowSize));
    }, [windowSize]);

    useEffect(() => {
        const socket = new WebSocket(WEB_SOCKET_URL);
        socket.onmessage = onMessage;
        return () => socket.close();
    }, []);

    return (
        <div>
            <h1>Sensors Data</h1>
            <Typography id="duration-slider" gutterBottom>
                Duration
            </Typography>
            <Slider
                value={windowSize}
                onChange={(e) => setWindowSize(e.target.value)}
                valueLabelDisplay="auto"
                getAriaValueText={valuetext}
                marks={marks}
                step={null}
                min={DATA_WINDOW_SIZE_MIN}
                max={DATA_WINDOW_SIZE_MAX}
            />
            <SensorGrid data={windowData} sensorNames={sensorNames} />
        </div>
    );
};

export default Dashboard;
