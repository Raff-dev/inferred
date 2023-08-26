// MetricsSelection.js (new component)
import { Grid } from "@mui/material";
import React from "react";
import DurationPicker from "../controls/DurationPicker";
import ModelSelection from "./ModelSelection";
import SensorSelect from "./SensorSelect";

const ComparisonSelection = ({
    onConfirm,
    modelNames,
    onModelSelect,
    selectedSensor,
    setSelectedSensor,
    selectedModels,
}) => {
    return (
        <Grid container alignItems={"center"}>
            <Grid item xs={12} md={4}>
                <DurationPicker onConfirm={onConfirm} />
            </Grid>
            <Grid item xs={12} md={4}>
                <ModelSelection
                    modelNames={modelNames}
                    selectedModels={selectedModels}
                    onModelSelect={onModelSelect}
                />
            </Grid>
            <Grid item xs={12} md={4}>
                <SensorSelect
                    selectedSensor={selectedSensor}
                    setSelectedSensor={setSelectedSensor}
                />
            </Grid>
        </Grid>
    );
};

export default ComparisonSelection;
