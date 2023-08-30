import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import React, { useEffect } from "react";
import { Resource } from "../utils/Resource";

const SensorSelect = ({
    loading,
    payload,
    selectedSensor,
    setSelectedSensor,
}) => {
    useEffect(() => {
        if (payload.length) setSelectedSensor(payload[0].name);
    }, [loading]);

    if (loading) {
        return (
            <Box sx={{ minWidth: 120 }}>
                <CircularProgress size={20} />
            </Box>
        );
    }

    const handleSensorChange = (event) => {
        setSelectedSensor(event.target.value);
    };

    return (
        <Box sx={{ minWidth: 120 }}>
            <Select value={selectedSensor} onChange={handleSensorChange}>
                {payload.map((sensor) => (
                    <MenuItem key={sensor.name} value={sensor.name}>
                        {sensor.name}
                    </MenuItem>
                ))}
            </Select>
        </Box>
    );
};

const SensorSelectWrapper = ({ selectedSensor, setSelectedSensor }) => {
    return (
        <Resource path="http://localhost:8000/api/dimensions/">
            {({ payload, loading, refresh }) => {
                return (
                    <SensorSelect
                        loading={loading}
                        payload={payload}
                        selectedSensor={selectedSensor}
                        setSelectedSensor={setSelectedSensor}
                    />
                );
            }}
        </Resource>
    );
};

export default SensorSelectWrapper;
