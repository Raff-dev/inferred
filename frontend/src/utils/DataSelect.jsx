import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import React, { useEffect } from "react";
import { Resource } from "./Resource";

const DataSelect = ({ loading, payload, selected, setSelected, label }) => {
    useEffect(() => {
        if (payload.length) setSelected(payload[0].name);
    }, [loading]);

    if (loading) {
        return (
            <Box sx={{ width: 160 }}>
                <CircularProgress size={20} />
            </Box>
        );
    }

    const handleChange = (event) => {
        setSelected(event.target.value);
    };

    return (
        <FormControl sx={{ width: 160 }}>
            <Select value={selected} onChange={handleChange}>
                {label === "Simulation Model" && payload.length && (
                    <MenuItem value={"none"}>none</MenuItem>
                )}
                {payload.map((sensor) => (
                    <MenuItem key={sensor.name} value={sensor.name}>
                        {sensor.name}
                    </MenuItem>
                ))}
            </Select>
            <FormHelperText>{label}</FormHelperText>
        </FormControl>
    );
};

const SelectWrapper = ({ selected, setSelected, path, label }) => {
    return (
        <Resource path={path}>
            {({ payload, loading, refresh }) => {
                return (
                    <DataSelect
                        loading={loading}
                        payload={payload}
                        selected={selected}
                        setSelected={setSelected}
                        label={label}
                    />
                );
            }}
        </Resource>
    );
};

export default SelectWrapper;
