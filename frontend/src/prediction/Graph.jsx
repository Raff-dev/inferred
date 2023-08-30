import { ThemeProvider } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { WEB_SOCKET_URL } from "../constants";
import { darkTheme } from "../themes";
import { SensorChart } from "./SensorChart";
import { SensorTabs } from "./SensorTabs";

export const StyledChartDiv = styled.div`
    background-color: #0003;
    border-radius: 12px;
    padding: 20px;
    padding-right: 50px;
    margin-bottom: 20px;
`;

const ChartView = () => {
    const [models, setModels] = useState([]);
    const [reads, setReads] = useState([]);
    const [timestamps, setTimestamps] = useState([]);

    const [selectedSensor, setSelectedSensor] = useState(null);
    const [sensors, setSensors] = useState([]);

    useEffect(() => {
        const ws = new WebSocket(WEB_SOCKET_URL);
        ws.onmessage = (event) => {
            const newData = JSON.parse(event.data);
            if (newData.past) return;

            if (selectedSensor === null) {
                const sensors = Object.keys(newData.reads);
                setSensors(sensors);
                setSelectedSensor(sensors[0]);
            }

            setModels(newData.models);
            setReads((prevReads) => [...prevReads, newData.reads]);
            setTimestamps((prevTimestamps) => [
                ...prevTimestamps,
                newData.timestamp,
            ]);
        };

        return () => {
            ws.close();
        };
    }, [selectedSensor]);

    return (
        <ThemeProvider theme={darkTheme}>
            <SensorTabs
                sensors={sensors}
                selectedSensor={selectedSensor}
                setSelectedSensor={setSelectedSensor}
            />
            <StyledChartDiv>
                <h2>{selectedSensor}</h2>
                <SensorChart
                    reads={reads}
                    models={models}
                    timestamps={timestamps}
                    selectedSensor={selectedSensor}
                />
            </StyledChartDiv>
        </ThemeProvider>
    );
};

export default ChartView;
