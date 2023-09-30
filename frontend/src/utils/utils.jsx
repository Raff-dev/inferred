export const parseDate = (value) => {
    const date = new Date(value);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    seconds = seconds < 10 ? "0" + seconds : seconds;
    return (
        hours +
        ":" +
        minutes +
        ":" +
        seconds +
        ":" +
        Math.round(date.getMilliseconds() / 10)
    );
};

export const getDomainRangePredictions = (data) => {
    // data = [{
    //    timestamp: 0,
    //    predictions: []
    // }]
    let min = Infinity;
    let max = -Infinity;
    for (let item of data) {
        for (let prediction of item.predictions) {
            if (prediction < min) {
                min = prediction;
            }
            if (prediction > max) {
                max = prediction;
            }
        }
    }
    return [min, max];
};

export const extendDomainRange = (extend, range) => {
    const [min, max] = range;
    const diff = max - min;
    return [min - diff * extend, max + diff * extend];
};

export const getDomainRangeData = (data) => {
    // data = [{
    //    timestamp: 0,
    //    value: 0
    // }]
    let min = Infinity;
    let max = -Infinity;
    for (let item of data) {
        if (item.value < min) {
            min = item.value;
        }
        if (item.value > max) {
            max = item.value;
        }
    }
    return [min, max];
};

export const mergeDomainRanges = (...ranges) => {
    let globalMin = Infinity;
    let globalMax = -Infinity;

    ranges.forEach(([min, max]) => {
        if (min < globalMin) {
            globalMin = min;
        }
        if (max > globalMax) {
            globalMax = max;
        }
    });

    return [globalMin, globalMax];
};
