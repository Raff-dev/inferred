import { DOMAIN_RANGE_EXTEND } from "../constants";

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

export const extendDomainRange = (range, extend = DOMAIN_RANGE_EXTEND) => {
    const [min, max] = range;
    const diff = Math.abs(max - min);
    const r = [min - diff * extend, max + diff * extend];
    return r;
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
            let value = parseFloat(`${prediction}`);
            if (value < min) {
                min = value;
            }
            if (value > max) {
                max = value;
            }
        }
    }
    return [min, max];
};

export const getDomainRangeData = (data) => {
    // data = [{
    //    timestamp: 0,
    //    value: 0
    // }]
    let min = Infinity;
    let max = -Infinity;
    for (let item of data) {
        let value = parseFloat(`${item.value}`);
        if (value < min) {
            min = value;
        }
        if (value > max) {
            max = value;
        }
    }
    return [min, max];
};

export const mergeDomainRanges = (...ranges) => {
    let mergeMin = Infinity;
    let mergeMax = -Infinity;

    ranges.forEach(([min, max]) => {
        if (min < mergeMin) {
            mergeMin = min;
        }
        if (max > mergeMax) {
            mergeMax = max;
        }
    });

    return [mergeMin, mergeMax];
};
