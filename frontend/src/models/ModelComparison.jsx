import { ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import React, { useState } from "react";
import { calculateErrorMetrics } from "../models/Calculations";
import { darkTheme } from "../themes";
import ComparisonSelection from "./ComparisonSelection";
import Metrics from "./Metrics";
import ModelComparisonCharts from "./ModelComparisonCharts";
import { parseChartData } from "./utils";

const ModelComparison = () => {
    const [modelNames, setModelNames] = useState([]);
    const [selectedModels, setSelectedModels] = useState([]);
    const [errorNames, setErrorNames] = useState([]);
    const [scalarMetricsData, setScalarMetricsData] = useState([]);
    const [chartData, setChartData] = useState({});
    const [selectedSensor, setSelectedSensor] = useState("");

    const handleConfirm = (date, duration) => {
        axios
            .get("http://localhost:8000/api/model_predictions_comparison/", {
                params: {
                    simulation_models: ["naive"],
                    dimension: selectedSensor,
                    start_timestamp: date, // You need to define startTimestamp
                    duration: duration, // You need to define duration
                },
            })
            .then((response) => {
                const data = response.data;
                const models = Object.keys(data.models);
                setModelNames(models);
                setSelectedModels(models);

                const metrics = calculateErrorMetrics(
                    data.reads,
                    data.models,
                    selectedModels
                );
                const { errorNames, seriesErrorData, scalarMetricsData } = metrics;
                const chartData = parseChartData(data.timestamps, seriesErrorData);
                setErrorNames(errorNames);
                setScalarMetricsData(scalarMetricsData);
                setChartData(chartData);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
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
