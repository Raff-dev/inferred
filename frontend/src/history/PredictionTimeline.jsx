import React from "react";

const PredictionTimeline = ({ predictionData }) => {
    if (predictionData.length === 0) {
        return <></>;
    }

    return (
        <div>
            <h1>Prediction Timeline</h1>
            <ul>
                {predictionData &&
                    predictionData.map((item, index) => (
                        <li key={index}>
                            Start Timestamp: {item.start_timestamp}
                            <ul>
                                {item.predictions.map(
                                    (prediction, subIndex) => (
                                        <li key={subIndex}>
                                            Prediction: {prediction}
                                        </li>
                                    )
                                )}
                            </ul>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default PredictionTimeline;
