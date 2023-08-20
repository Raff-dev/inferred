import React, { useState } from "react";

import { calculateErrorMetrics } from "../models/Calculations";
import ModelComparisonCharts from "./ModelComparisonCharts";
import ModelSelection from "./ModelSelection";
import ScalarMetrics from "./ScalarMetrics";

const parseChartData = (timestamps, seriesErrorData) => {
    const parsedData = timestamps.map((timestamp, index) => {
        const dataPoint = { timestamp };

        for (const [modelName, metrics] of Object.entries(seriesErrorData)) {
            dataPoint[modelName] = {};
            for (const [metricName, metricValues] of Object.entries(metrics)) {
                dataPoint[modelName][metricName] = metricValues[index];
            }
        }
        return dataPoint;
    });
    return parsedData;
};

const ModelComparison = () => {
    const timestamps = ["2021-10-01", "2021-10-02", "2021-10-03", "2021-10-04"];
    const originalData = [100, 150, 200, 250];
    const predictions = {
        "Model A": [110, 140, 210, 240],
        "Model B": [105, 155, 190, 260],
        "Model C": [120, 135, 215, 245],
    };

    const modelNames = Object.keys(predictions);
    const [selectedModels, setSelectedModels] = useState(modelNames);
    const metrics = calculateErrorMetrics(originalData, predictions, selectedModels);
    const { errorNames, seriesErrorData, scalarMetricsData } = metrics;
    const chartData = parseChartData(timestamps, seriesErrorData);

    const handleModelSelect = (event) => setSelectedModels(event.target.value);
    return (
        <div>
            <h2>Metrics Comparison</h2>
            <ModelSelection
                modelNames={modelNames}
                selectedModels={selectedModels}
                onModelSelect={handleModelSelect}
            />
            <ScalarMetrics scalarMetricsData={scalarMetricsData} />
            <ModelComparisonCharts
                chartData={chartData}
                errorNames={errorNames}
                modelNames={selectedModels} // Pass selected models to the chart component
            />
        </div>
    );
};

export default ModelComparison;