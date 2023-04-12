import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import Slider from "@mui/material/Slider";
import { curveCardinal } from "d3-shape";
import React, { useEffect, useState } from "react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    XAxis,
    YAxis,
} from "recharts";
import { SensorTabs } from "./SensorTabs";

const DAY = 24 * 60 * 60;
const HOUR = 60 * 60;
const MINUTE = 60;

const LOOKAHEAD = 100;

const DATA_WINDOW_SIZE_DEFAULT = HOUR;
const WEB_SOCKET_URL = "ws://localhost:8000/ws/sensors/";
const PRIMARY_COLOR = "#3164b5c8";
const SECONDARY_COLOR = "#6e4923cf";
const CHARTS = {
    line: [LineChart, Line],
    area: [AreaChart, Area],
};

const cardinal = curveCardinal.tension(0.2);

const ChartView = () => {
    const [data, setData] = useState([]);
    const [windowData, setWindowData] = useState([]);
    const [windowSize, setWindowSize] = useState(DATA_WINDOW_SIZE_DEFAULT);
    const [chartType, setChartType] = useState("line");
    const [selectedSensor, setSelectedSensor] = useState(null);
    const [sensors, setSensors] = useState([]);

    const updateData = (prevData, newData) => {
        const { sensors, timestamp } = newData;

        const newEntry = () =>
            Object.fromEntries(Object.keys(sensors).map((sensor) => [sensor, {}]));

        if (!prevData.length) {
            prevData = Array.from({ length: LOOKAHEAD }, newEntry);
        } else {
            prevData.push(newEntry());
        }

        const predictionN = prevData.length - LOOKAHEAD;
        const predictionKey = `prediction_${predictionN}`;

        for (const [sensor, values] of Object.entries(sensors)) {
            const indexVal = prevData.length - 1;
            prevData[indexVal][sensor].value = values.value;
            prevData[indexVal].timestamp = timestamp;

            for (const [i, prediction] of values.prediction.entries()) {
                const indexPred = prevData.length + i - LOOKAHEAD;
                prevData[indexPred][sensor][predictionKey] =prediction;
            }
        }

        return prevData;
    };

    const handleWindowSizeChange = (event, newValue) => {
        setWindowSize(newValue);
        setWindowData((prevData) => data.slice(-newValue));
    };

    const handleChartTypeChange = (event) => {
        setChartType(event.target.value);
    };

    useEffect(() => {
        const ws = new WebSocket(WEB_SOCKET_URL);
        ws.onmessage = (event) => {
            const newData = JSON.parse(event.data);

            if (selectedSensor === null) {
                const sensors = Object.keys(newData.sensors);
                setSensors(sensors);
                setSelectedSensor(sensors[0]);
            }
            console.log(data);
            setData((prevData) => updateData(prevData, newData));
            setWindowData((prevData) => [
                ...prevData.slice(-windowSize - LOOKAHEAD),
                newData,
            ]);
        };

        return () => {
            ws.close();
        };
    }, [windowSize, selectedSensor]);

    const props = { data, chartType, selectedSensor };

    return (
        <div>
            <SensorTabs
                sensors={sensors}
                selectedSensor={selectedSensor}
                setSelectedSensor={setSelectedSensor}
            />
            <RadioGroup row value={chartType} onChange={handleChartTypeChange}>
                <FormControlLabel value="line" control={<Radio />} label="Line" />
                <FormControlLabel value="area" control={<Radio />} label="Area" />
            </RadioGroup>
            <div
                style={{
                    backgroundColor: "#0003",
                    borderRadius: 12,
                    padding: 20,
                    paddingRight: 50,
                    marginBottom: 20,
                }}
            >
                <h2>{selectedSensor}</h2>
                <MyCommonChart {...props} />
                <Slider
                    value={windowSize}
                    size="small"
                    min={20}
                    max={MINUTE}
                    step={5}
                    marks
                    valueLabelDisplay="auto"
                    onChange={handleWindowSizeChange}
                />
            </div>
        </div>
    );
};


const MyCommonChart = ({ data, chartType, selectedSensor }) => {
    const [Chart, ChartElement] = CHARTS[chartType];
    const lineDataKey = `${selectedSensor}.value`;
    const timeDataKey = "timestamp";

    const parseDate = (value) => {
        const date = new Date(value);
        let seconds = date.getSeconds();
        seconds = seconds < 10 ? "0" + seconds : seconds;
        return seconds + ":" + Math.round(date.getMilliseconds() / 10);
    };

    const legendPayload = (color1, color2) => [
        { value: "Sensor Value", type: "line", dataKey: "value", color: color1 },
        { value: "Prediction", type: "line", dataKey: "prediction", color: color2 },
    ];

    return (
        <Chart
            width={1200}
            height={400}
            margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
            }}
        >
            <CartesianGrid stroke="#eee2" strokeDasharray="1 1" />
            <XAxis dataKey={timeDataKey} tickFormatter={parseDate} angle={-30} />
            <YAxis />
            <Legend
                payload={legendPayload(PRIMARY_COLOR, SECONDARY_COLOR)}
                verticalAlign="top"
            />
            <ChartElement
                data={data}
                type={cardinal}
                isAnimationActive={false}
                dataKey={lineDataKey}
                stroke={PRIMARY_COLOR}
                fill={PRIMARY_COLOR}
                fillOpacity={0.15}
            />
            {/* <PredictionElements selectedSensor={selectedSensor} /> */}
        </Chart>
    );
};

const PredictionElements = ({ selectedSensor }) => {
    const predictionKeys = Array.of(LOOKAHEAD).map(
        (i) => `sensors.${selectedSensor}.prediction_${i}`
    );
    return (
        <>
            <ChartElement
                type={cardinal}
                isAnimationActive={false}
                dataKey={`sensors.sensor_0.prediction_0`}
                stroke={SECONDARY_COLOR}
                fill={SECONDARY_COLOR}
                fillOpacity={0.15}
            />
        </>
    );
};

export default ChartView;
