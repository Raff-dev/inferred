import { Tab, Tabs } from "@mui/material";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import React from "react";

export const SensorTabs = ({ sensors, selectedSensor, setSelectedSensor }) => {
    const theme = useTheme();
    const handleChange = (event, newValue) => {
        setSelectedSensor(newValue);
    };

    return (
        <Box>
            <Tabs
                value={selectedSensor}
                onChange={handleChange}
                aria-label="Sensor Tabs"
                variant="scrollable"
            >
                {sensors.map((sensor) => (
                    <Tab key={sensor} label={sensor} value={sensor} />
                ))}
            </Tabs>
        </Box>
    );
};
