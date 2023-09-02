import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import React, { useEffect } from "react";
import { Resource } from "../utils/Resource";

const GranulationMethodSelect = ({
    loading,
    payload,
    selectedMethod,
    setSelectedMethod,
}) => {
    useEffect(() => {
        if (payload.length) setSelectedMethod(payload[0].name);
    }, [loading]);

    if (loading) {
        return (
            <Box sx={{ minWidth: 120 }}>
                <CircularProgress size={20} />
            </Box>
        );
    }

    const handleMethodChange = (event) => {
        setSelectedMethod(event.target.value);
    };

    return (
        <Box sx={{ minWidth: 120 }}>
            <Select value={selectedMethod} onChange={handleMethodChange}>
                {payload.map((method) => (
                    <MenuItem key={method.name} value={method.name}>
                        {method.label}
                    </MenuItem>
                ))}
            </Select>
        </Box>
    );
};

const GranulationMethodSelectWrapper = ({
    selectedMethod,
    setSelectedMethod,
}) => {
    return (
        <Resource path="http://localhost:8000/api/sensor_reads/granulation_methods/">
            {({ payload, loading, refresh }) => {
                return (
                    <GranulationMethodSelect
                        loading={loading}
                        payload={payload}
                        selectedMethod={selectedMethod}
                        setSelectedMethod={setSelectedMethod}
                    />
                );
            }}
        </Resource>
    );
};

export default GranulationMethodSelectWrapper;
