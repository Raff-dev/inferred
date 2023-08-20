import React from "react";
import ModelComparisonLineChart from "../models/ModelComparisonLineChart";

import { calculateErrorMetrics } from "../models/Calculations";

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
    const errorMetrics = calculateErrorMetrics(originalData, predictions, modelNames);
    const { errorNames, seriesErrorData, scalarMetricsData } = errorMetrics;
    const chartData = parseChartData(timestamps, seriesErrorData);

    console.log(errorNames);
    return (
        <div>
            <h2>Metrics Comparison</h2>
            {errorNames.map((metricName) => (
                <div key={metricName}>
                    <h3>{metricName}</h3>
                    <ModelComparisonLineChart
                        data={chartData}
                        metricName={metricName}
                        modelNames={modelNames}
                    />
                </div>
            ))}
        </div>
    );
};

export default ModelComparison;
