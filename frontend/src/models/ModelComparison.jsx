import { ThemeProvider } from "@mui/material/styles";
import React, { useState } from "react";
import { calculateErrorMetrics } from "../models/Calculations";
import { darkTheme } from "../themes";
import ComparisonSelection from "./ComparisonSelection";
import Metrics from "./Metrics";
import ModelComparisonCharts from "./ModelComparisonCharts";
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

    const handleConfirm = (date, duration) => {
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
            <h1>Model Comparison</h1>
            <ComparisonSelection
                modelNames={modelNames}
                onConfirm={handleConfirm}
                onModelSelect={handleModelSelect}
                selectedSensor={selectedSensor}
                setSelectedSensor={setSelectedSensor}
                selectedModels={selectedModels}
            />
            <Metrics modelNames={modelNames} scalarMetricsData={scalarMetricsData} />
            <ModelComparisonCharts
                chartData={chartData}
                errorNames={errorNames}
                modelNames={selectedModels} // Pass selected models to the chart component
            />
        </ThemeProvider>
    );
};

export default ModelComparison;
