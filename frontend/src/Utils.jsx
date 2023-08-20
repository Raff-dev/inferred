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
