import axios from "axios";
import React, { useState } from "react";
import { API } from "../constants";
import { calculateErrorMetrics } from "./Calculations";
import ComparisonMenu from "./ComparisonMenu";
import Metrics from "./Metrics";
import ModelComparisonCharts from "./ModelComparisonCharts";
import { parseChartData } from "./utils";

const ModelComparisonView = () => {
    const [modelNames, setModelNames] = useState([]);
    const [selectedModels, setSelectedModels] = useState([]);
    const [errorNames, setErrorNames] = useState([]);
    const [scalarMetricsData, setScalarMetricsData] = useState([]);
    const [chartData, setChartData] = useState({});
    const [selectedSensor, setSelectedSensor] = useState("");
    const [horizon, setHorizon] = useState(1);

    const handleConfirm = (date, duration) => {
        axios
            .get(API.model_predictions_comparison, {
                params: {
                    simulation_models: [
                        "naive",
                        "noise",
                        "random_walk",
                        "exponential_smoothing",
                    ],
                    sensor: selectedSensor,
                    start_timestamp: date,
                    duration: duration,
                    horizon: horizon,
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
                const { errorNames, seriesErrorData, scalarMetricsData } =
                    metrics;
                const chartData = parseChartData(
                    data.timestamps,
                    seriesErrorData
                );
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
        <>
            <h1>Model Comparison</h1>
            <ComparisonMenu
                modelNames={modelNames}
                onConfirm={handleConfirm}
                onModelSelect={handleModelSelect}
                selectedSensor={selectedSensor}
                setSelectedSensor={setSelectedSensor}
                selectedModels={selectedModels}
                horizon={horizon}
                setHorizon={setHorizon}
            />
            <Metrics
                modelNames={modelNames}
                scalarMetricsData={scalarMetricsData}
            />
            <ModelComparisonCharts
                chartData={chartData}
                errorNames={errorNames}
                modelNames={selectedModels} // Pass selected models to the chart component
            />
        </>
    );
};

export default ModelComparisonView;
