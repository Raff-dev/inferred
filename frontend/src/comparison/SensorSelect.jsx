import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
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
        return <CircularProgress size={20} />;
    }

    const handleSensorChange = (event) => {
        setSelectedSensor(event.target.value);
    };

    return (
        <FormControl sx={{ minWidth: 120 }}>
            <Select value={selectedSensor} onChange={handleSensorChange}>
                {payload.map((sensor) => (
                    <MenuItem key={sensor.name} value={sensor.name}>
                        {sensor.name}
                    </MenuItem>
                ))}
            </Select>
            <FormHelperText>Dimension</FormHelperText>
        </FormControl>
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
