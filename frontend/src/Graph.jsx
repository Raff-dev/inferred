import { FormControlLabel, Radio, RadioGroup, Tab, Tabs } from '@mui/material';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { curveCardinal } from 'd3-shape';
import React, { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from 'recharts';

const DAY = 24 * 60 * 60;
const HOUR = 60 * 60;
const MINUTE = 60;

const DATA_WINDOW_SIZE_DEFAULT = HOUR;
const WEB_SOCKET_URL = 'ws://localhost:8000/ws/sensors/';
const PRIMARY_COLOR = "#3164b5c8";
const SECONDARY_COLOR = "#6e4923cf";
const CHARTS = {
  line: [LineChart, Line],
  area: [AreaChart, Area],
};

const cardinal = curveCardinal.tension(0.2);

const parseDate = (value) => {
  const date = new Date(value);
  let seconds = date.getSeconds();
  seconds = seconds < 10 ? "0" + seconds : seconds;
  return seconds + ":" + Math.round(date.getMilliseconds() / 10);
}

const legendPayload = (color1, color2) => [
  { value: 'Sensor Value', type: 'line', dataKey: 'value', color: color1 },
  { value: 'Prediction', type: 'line', dataKey: 'prediction', color: color2 },
];

const ChartView = () => {
  const [data, setData] = useState([]);
  const [windowData, setWindowData] = useState([]);
  const [windowSize, setWindowSize] = useState(DATA_WINDOW_SIZE_DEFAULT);
  const [chartType, setChartType] = useState('line');
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [sensors, setSensors] = useState([]);

  const handleWindowSizeChange = (event, newValue) => {
    setWindowSize(newValue);
    setWindowData((prevData) => data.slice(-newValue));
  }
  const handleChartTypeChange = (event) => {
    setChartType(event.target.value);
  };

  const handleSensorChange = (event) => {
    setSelectedSensor(event.target.value);
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

      setData((prevData) => [...prevData, newData]);
      setWindowData((prevData) => [...prevData.slice(-windowSize), newData]);
    };

    return () => {
      ws.close();
    };
  }, [windowSize, selectedSensor]);

  const dataKey = `sensors.${selectedSensor}.value`;
  const predictionKey = `sensors.${selectedSensor}.prediction[99]`;
  const props = { data: windowData, dataKey: dataKey, predictionKey: predictionKey, chartType: chartType }

  return (
    <div >
      <SensorTabs sensors={sensors} selectedSensor={selectedSensor} setSelectedSensor={setSelectedSensor} />
      <RadioGroup row value={chartType} onChange={handleChartTypeChange} >
        <FormControlLabel value="line" control={<Radio />} label="Line" />
        <FormControlLabel value="area" control={<Radio />} label="Area" />
      </RadioGroup>
      <div style={{ backgroundColor: '#0003', borderRadius: 12, padding: 20, paddingRight: 50, marginBottom: 20 }}>
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


const SensorTabs = ({ sensors, selectedSensor, setSelectedSensor }) => {
  const handleChange = (event, newValue) => {
    setSelectedSensor(newValue);
  };

  return (
    <Box  >
      <Tabs
        value={selectedSensor}
        onChange={handleChange}
        aria-label="Sensor Tabs"
        variant="scrollable">
        {sensors.map((sensor) => (
          <Tab key={sensor} label={sensor} value={sensor} />
        ))}
      </Tabs>
    </Box>
  );
}

const MyCommonChart = ({ data, dataKey, predictionKey, chartType }) => {
  const [Chart, ChartElement] = CHARTS[chartType];

  return (
    <Chart
      width={1200}
      height={400}
      data={data}
      margin={{
        top: 10,
        right: 30,
        left: 0,
        bottom: 0,
      }}
    >
      <CartesianGrid stroke="#eee2" strokeDasharray="1 1" />
      <XAxis dataKey="timestamp" tickFormatter={parseDate} angle={-30} />
      <YAxis />
      <Legend payload={legendPayload(PRIMARY_COLOR, SECONDARY_COLOR)} verticalAlign="top" />
      <ChartElement type={cardinal} isAnimationActive={false} dataKey={dataKey} stroke={PRIMARY_COLOR} fill={PRIMARY_COLOR} fillOpacity={0.15} />
      <ChartElement type={cardinal} isAnimationActive={false} dataKey={predictionKey} stroke={SECONDARY_COLOR} fill={SECONDARY_COLOR} fillOpacity={0.15} />
    </Chart>
  );
}

export default ChartView;

