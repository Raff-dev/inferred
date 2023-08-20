import React from "react";

const ScalarMetrics = ({ scalarMetricsData }) => {
    return (
        <div>
            {Object.keys(scalarMetricsData).map((model, index) => (
                <div key={index}>
                    <h2>{model}</h2>
                    <ul>
                        {Object.keys(scalarMetricsData[model]).map(
                            (metric, metricIndex) => (
                                <li key={metricIndex}>
                                    <strong>{metric}:</strong>{" "}
                                    {scalarMetricsData[model][metric]}
                                </li>
                            )
                        )}
                    </ul>
                </div>
            ))}
        </div>
    );
};
export default ScalarMetrics;
