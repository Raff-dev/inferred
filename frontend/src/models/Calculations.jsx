export const calculateScalarMetrics = (seriesErrors) => {
    const [errors, absoluteErrors, squaredErrors, percentageErrors] =
        Object.values(seriesErrors);

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

export const calculateSeriesErrors = (originalData, prediction) => {
    const errors = prediction.map((value, index) => value - originalData[index]);
    const absoluteErrors = errors.map((error) => Math.abs(error));
    const squaredErrors = errors.map((error) => error * error);
    const percentageErrors = errors.map(
        (error, index) => (error / originalData[index]) * 100
    );

    const seriesErrorData = {
        "Arithmetic Error": errors,
        "Absolute Error": absoluteErrors,
        "Squared Errors": squaredErrors,
        "Percentage Error": percentageErrors,
    };

    for (const [metric, values] of Object.entries(seriesErrorData)) {
        seriesErrorData[metric + " Cumsum"] = values.map(
            (
                (sum) => (value) =>
                    (sum += value)
            )(0)
        );
    }

    return seriesErrorData;
};

export const calculateErrorMetrics = (originalData, predictions, modelNames) => {
    let errorNames = [];
    const seriesErrorData = {};
    const scalarMetricsData = {};
    for (const modelName of modelNames) {
        const errors = calculateSeriesErrors(originalData, predictions[modelName]);
        const metrics = calculateScalarMetrics(errors);

        seriesErrorData[modelName] = errors;
        scalarMetricsData[modelName] = metrics;
        errorNames = Object.keys(errors);
    }
    return { errorNames, seriesErrorData, scalarMetricsData };
};
