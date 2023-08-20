import React from "react";
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { TRIETARY_COLOR } from "../constants";

const calculateScalarErrors = (originalData, prediction) => {
    const meanAbsoluteError =
        absoluteErrors.reduce((sum, error) => sum + error, 0) / absoluteErrors.length;
    const rootMeanSquaredError = Math.sqrt(
        squaredErrors.reduce((sum, error) => sum + error, 0) / squaredErrors.length
    );
    const meanAbsolutePercentageError =
        percentageErrors.reduce((sum, error) => sum + error, 0) /
        percentageErrors.length;

    const directionalAccuracy =
        errors.filter((error) => error > 0).length / errors.length;

    return {
        "Root Mean Squared Error": rootMeanSquaredError,
        "Mean Absolute Error": meanAbsoluteError,
        "Mean Absolute Percentage Error": meanAbsolutePercentageError,
        "Directional Accuracy": directionalAccuracy,
    };
};

const calculateSeriesErrors = (originalData, prediction) => {
    const errors = prediction.map((value, index) => value - originalData[index]);
    const absoluteErrors = errors.map((error) => Math.abs(error));
    const squaredErrors = errors.map((error) => error * error);
    const percentageErrors = errors.map(
        (error, index) => (error / originalData[index]) * 100
    );

    return {
        "Arithmetic Error": errors,
        "Absolute Error": absoluteErrors,
        "Squared Errors": squaredErrors,
        "Percentage Error": percentageErrors,
    };
};

const ModelComparison = () => {
    const timestamps = ["2021-10-01", "2021-10-02", "2021-10-03", "2021-10-04"];
    const originalData = [100, 150, 200, 250];
    const predictions = {
        "Model A": [110, 140, 210, 240],
        "Model B": [105, 155, 190, 260],
        "Model C": [120, 135, 215, 245],
    };

    let metricsNames = [];
    const modelNames = Object.keys(predictions);

    const metricsData = {};
    for (const modelName of modelNames) {
        const metrics = calculateSeriesErrors(originalData, predictions[modelName]);
        metricsNames = Object.keys(metrics);
        metricsData[modelName] = metrics;
    }

    const parsedData = timestamps.map((timestamp, index) => {
        const dataPoint = { timestamp };

        for (const [modelName, metrics] of Object.entries(metricsData)) {
            dataPoint[modelName] = {};
            for (const [metricName, metricValues] of Object.entries(metrics)) {
                dataPoint[modelName][metricName] = metricValues[index];
            }
        }
        return dataPoint;
    });

    console.log(metricsNames);
    return (
        <div>
            <h2>Metrics Comparison</h2>
            {metricsNames.map((metricName) => (
                <div key={metricName}>
                    <h3>{metricName}</h3>
                    <ModelComparisonLineChart
                        data={parsedData}
                        metricName={metricName}
                        modelNames={modelNames}
                    />
                </div>
            ))}
        </div>
    );
};

const ModelComparisonLineChart = ({ data, metricName, modelNames }) => {
    console.log(data);
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" type="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                {modelNames.map((modelName, index) => (
                    <Line
                        key={modelName}
                        type="monotone"
                        dataKey={`${modelName}.${metricName}`}
                        name={modelName}
                        stroke={TRIETARY_COLOR}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
};
export default ModelComparison;
