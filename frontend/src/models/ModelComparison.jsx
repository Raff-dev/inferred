import { Grid } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import DurationPicker from "../controls/DurationPicker";
import { calculateErrorMetrics } from "../models/Calculations";
import { darkTheme } from "../themes";
import ModelComparisonCharts from "./ModelComparisonCharts";
import ModelSelection from "./ModelSelection";
import ScalarMetricsRadarChart from "./ScalarMetricsRadarChart";
import ScalarMetricsTable from "./ScalarMetricsTable";
import SensorSelect from "./SensorSelect";
import { parseChartData } from "./utils";

const ModelComparison = () => {
    const timestamps = ["2021-10-01", "2021-10-02", "2021-10-03", "2021-10-04"];
    const originalData = [100, 150, 200, 250];
    const predictions = {
        "Model A": [110, 140, 210, 240],
        "Model B": [105, 155, 190, 260],
        "Model C": [120, 135, 215, 245],
        "Model D": [125, 145, 190, 258],
        "Model E": [105, 125, 200, 225],
    };

    const modelNames = Object.keys(predictions);
    const [selectedModels, setSelectedModels] = useState(modelNames);
    const [errorNames, setErrorNames] = useState([]);
    const [scalarMetricsData, setScalarMetricsData] = useState([]);
    const [chartData, setChartData] = useState({});
    const [selectedSensor, setSelectedSensor] = useState("");

    useEffect(() => {
        console.log("selectedSensor");
        console.log(selectedSensor);
        console.log("selectedSensor");
    }, [selectedSensor]);

    const handleConfirm = (date, duration) => {
        console.log(date, duration);
        // 2023-08-26T10:27 5
        const metrics = calculateErrorMetrics(
            originalData,
            predictions,
            selectedModels
        );
        const { errorNames, seriesErrorData, scalarMetricsData } = metrics;
        const chartData = parseChartData(timestamps, seriesErrorData);
        setErrorNames(errorNames);
        setScalarMetricsData(scalarMetricsData);
        setChartData(chartData);
    };

    const handleModelSelect = (event) => setSelectedModels(event.target.value);
    return (
        <ThemeProvider theme={darkTheme}>
            <h1>Metrics Comparison</h1>
            <Grid container alignItems={"center"}>
                <Grid item xs={12} md={4}>
                    <DurationPicker onConfirm={handleConfirm} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <ModelSelection
                        modelNames={modelNames}
                        selectedModels={selectedModels}
                        onModelSelect={handleModelSelect}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <SensorSelect
                        selectedSensor={selectedSensor}
                        setSelectedSensor={setSelectedSensor}
                    />
                </Grid>
            </Grid>
            <Grid container alignItems="center" spacing={8} marginTop={1}>
                <Grid item xs={12} md={6}>
                    <ScalarMetricsRadarChart
                        scalarMetricsData={scalarMetricsData}
                        modelNames={modelNames}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <ScalarMetricsTable scalarMetricsData={scalarMetricsData} />
                </Grid>
            </Grid>
            <ModelComparisonCharts
                chartData={chartData}
                errorNames={errorNames}
                modelNames={selectedModels} // Pass selected models to the chart component
            />
        </ThemeProvider>
    );
};

export default ModelComparison;
