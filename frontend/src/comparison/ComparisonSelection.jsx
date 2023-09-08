// MetricsSelection.js (new component)
import { Grid } from "@mui/material";
import React from "react";
import DurationPicker from "./DurationPicker";
import HorizonSlider from "./HorizonSlider";
import ModelSelection from "./ModelSelection";
import SensorSelect from "./SensorSelect";

const ComparisonSelection = ({
    onConfirm,
    modelNames,
    onModelSelect,
    selectedSensor,
    setSelectedSensor,
    selectedModels,
    horizon,
    setHorizon,
}) => {
    return (
        <Grid container direction={"column"}>
            <Grid container item spacing={8}>
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
            <Grid item>
                <HorizonSlider horizon={horizon} setHorizon={setHorizon} />
            </Grid>
        </Grid>
    );
};

export default ComparisonSelection;
