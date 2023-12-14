// MetricsSelection.js (new component)
import { Grid } from "@mui/material";
import React from "react";
import { API } from "../constants";
import ArrowSlider from "../utils/ArrowSlider";
import DataSelect from "../utils/DataSelect";
import DurationPicker from "./DurationPicker";
import ModelChips from "./ModelChips";

const ComparisonMenu = ({
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
                        path={API.sensors}
                        label="Sensor"
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
                <ArrowSlider
                    value={horizon}
                    setValue={setHorizon}
                    min={0}
                    max={99}
                    label="Horizon"
                />
            </Grid>
        </Grid>
    );
};

export default ComparisonMenu;
