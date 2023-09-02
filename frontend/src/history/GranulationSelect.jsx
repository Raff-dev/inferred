import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
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
            <Box sx={{ width: 160 }}>
                <CircularProgress size={20} />
            </Box>
        );
    }

    const handleMethodChange = (event) => {
        setSelectedMethod(event.target.value);
    };

    return (
        <FormControl sx={{ width: 160 }}>
            <Select
                value={selectedMethod}
                onChange={handleMethodChange}
                MenuProps={{ width: 100 }}
            >
                {payload.map((method) => (
                    <MenuItem key={method.name} value={method.name}>
                        {method.label}
                    </MenuItem>
                ))}
            </Select>
            <FormHelperText>Granulation Method</FormHelperText>
        </FormControl>
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
