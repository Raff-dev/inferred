import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import React, { useEffect } from "react";
import { Resource } from "../utils/Resource";

const GranulationParamSelect = ({
    loading,
    payload,
    selectedParam,
    setSelectedParam,
    selectedMethod,
}) => {
    if (loading) {
        return (
            <Box sx={{ width: 160 }}>
                <CircularProgress size={20} />
            </Box>
        );
    }
    const methodParams = (selectedMethod &&
        payload.find((values) => values.name === selectedMethod)) || {
        param: "",
        param_choices: [],
        param_default: "",
    };

    useEffect(() => {
        setSelectedParam(methodParams.param_default);
    }, [loading, selectedMethod]);

    const handleParamChange = (event) => {
        setSelectedParam(event.target.value);
    };

    const value = selectedMethod == "none" ? "" : selectedParam;
    return (
        <FormControl sx={{ width: 160 }}>
            <Select
                value={value}
                onChange={handleParamChange}
                MenuProps={{ width: 100 }}
                disabled={selectedMethod == "none"}
            >
                {methodParams.param_choices.map((choice) => (
                    <MenuItem key={choice} value={choice}>
                        {choice}
                    </MenuItem>
                ))}
            </Select>
            <FormHelperText>{methodParams.param}</FormHelperText>
        </FormControl>
    );
};

const GranulationParamSelectWrapper = ({
    selectedParam,
    setSelectedParam,
    selectedMethod,
}) => {
    return (
        <Resource path="http://localhost:8000/api/sensor_reads/granulation_methods/">
            {({ payload, loading, refresh }) => {
                return (
                    <GranulationParamSelect
                        loading={loading}
                        payload={payload}
                        selectedParam={selectedParam}
                        setSelectedParam={setSelectedParam}
                        selectedMethod={selectedMethod}
                    />
                );
            }}
        </Resource>
    );
};

export default GranulationParamSelectWrapper;
