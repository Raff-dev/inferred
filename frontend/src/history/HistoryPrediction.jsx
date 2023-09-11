import React from "react";

const PredictionTimelineComponent = ({ predictionData }) => {
    return (
        <div>
            <h1>Prediction Timeline</h1>
            <ul>
                {predictionData.map((item, index) => (
                    <li key={index}>
                        Start Timestamp: {item.start_timestamp}
                        <ul>
                            {item.predictions.map((prediction, subIndex) => (
                                <li key={subIndex}>Prediction: {prediction}</li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PredictionTimelineComponent;
