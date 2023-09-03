// MetricsSelection.js (new component)
import { Grid } from "@mui/material";
import React from "react";
import DurationPicker from "./DurationPicker";
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
        <Grid container spacing={8}>
            <Grid item>
                <DurationPicker onConfirm={onConfirm} />
            </Grid>
            <Grid item>
                <SensorSelect
                    selectedSensor={selectedSensor}
                    setSelectedSensor={setSelectedSensor}
                />
            </Grid>
            <Grid item>
                <ModelSelection
                    modelNames={modelNames}
                    selectedModels={selectedModels}
                    onModelSelect={onModelSelect}
                />
            </Grid>
        </Grid>
    );
};

export default ComparisonSelection;
