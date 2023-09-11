// MetricsSelection.js (new component)
import { Grid } from "@mui/material";
import React from "react";
import { API } from "../constants";
import DataSelect from "../utils/DataSelect";
import DurationPicker from "./DurationPicker";
import HorizonSlider from "./HorizonSlider";
import ModelChips from "./ModelChips";

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
                    <DataSelect
                        selected={selectedSensor}
                        setSelected={setSelectedSensor}
                        path={API.dimensions}
                        label="Dimension"
                    />
                </Grid>
                <Grid item>
                    <ModelChips
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
