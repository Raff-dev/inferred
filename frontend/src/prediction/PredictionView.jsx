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

const PredictionView = () => {
    const [models, setModels] = useState([]);
    const [reads, setReads] = useState([]);
    const [timestamps, setTimestamps] = useState([]);

    const [selectedSensor, setSelectedSensor] = useState(null);
    const [sensors, setSensors] = useState([]);

    useEffect(() => {
        const ws = new WebSocket(WEB_SOCKET_URL);
        ws.onmessage = (event) => {
            const newData = JSON.parse(event.data);
            if (newData.past) {
                // set 100 most recent reads
                const sensorNamesSorted = newData.dimensions.sort((a, b) =>
                    a.localeCompare(b, undefined, { numeric: true })
                );
                setSensors(sensorNamesSorted);
                setSelectedSensor(sensorNamesSorted[0]);

                const previousReads = newData.reads.slice(-100);
                const timestamps = previousReads.map((read) => read.timestamp);
                setReads(previousReads);
                setTimestamps(timestamps);
                return;
            }

            setModels(newData.models);
            setReads((prevReads) => {
                const newReads = prevReads.slice(1);
                newReads.push(newData.reads);
                return newReads;
            });
            setTimestamps((prevTimestamps) => {
                const newTimestamps = prevTimestamps.slice(1);
                newTimestamps.push(newData.timestamp);
                return newTimestamps;
            });
        };

        return () => {
            ws.close();
        };
    }, []);

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

export default PredictionView;
