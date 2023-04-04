import { LineChart, XAxis, YAxis } from 'recharts';

import { curveCardinal } from 'd3-shape';
import React, { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, Legend, Line } from 'recharts';
const DATA_WINDOW_SIZE = 120;

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


const Chart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/sensors/');

    ws.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      console.log(data)

      setData((prevData) => [...prevData.slice(-DATA_WINDOW_SIZE), newData]);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div style={{ backgroundColor: '#0003', borderRadius: 12, padding: 10, paddingRight: 50 }}>
      {Object.keys(data[0]?.sensors || {}).map((sensorKey) => {
        const dataKey = `sensors.${sensorKey}.value`;
        const predictionKey = `sensors.${sensorKey}.prediction[99]`;
        const props = { data: data, dataKey: dataKey, predictionKey: predictionKey }

        return (
          <div>
            <h2>{sensorKey}</h2>
            {sensorKey == "sensor_0" && <MyAreaChart {...props} /> || <MyLineChart {...props} />}
          </div>
        );
      })}
    </div>
  );
};


const MyAreaChart = ({ data, dataKey, predictionKey }) => {
  const primaryColor = "#8884d8";
  const secondaryColor = "#82ca9f";

  return (
    <AreaChart
      width={1000}
      height={400}
      data={data}
      margin={{
        top: 10,
        right: 30,
        left: 0,
        bottom: 0,
      }}
    >
      <XAxis dataKey="timestamp" tickFormatter={parseDate} angle={-30} />
      <YAxis />
      <Legend payload={legendPayload(primaryColor, secondaryColor)} verticalAlign="top"/>

      {/* <Tooltip /> */}
      <Area type={cardinal} isAnimationActive={false} dataKey={dataKey} stroke={primaryColor} fill={primaryColor} fillOpacity={0.15} />
      <Area type={cardinal} isAnimationActive={false} dataKey={predictionKey} stroke={secondaryColor} fill={secondaryColor} fillOpacity={0.15} />
    </AreaChart>
  );
}

const MyLineChart = ({ data, dataKey, predictionKey }) => {
  const primaryColor = "#3164b5c8";
  const secondaryColor = "#6e4923cf";

  return (
    <LineChart
      width={1000}
      height={400}
      data={data}>
      <CartesianGrid stroke="#eee1" strokeDasharray="1 1" />
      <XAxis dataKey="timestamp" tickFormatter={parseDate} angle={-30} />
      <YAxis />
      {/* <Tooltip /> */}
      <Legend payload={legendPayload(primaryColor, secondaryColor)} verticalAlign="top"/>
      <Line type={cardinal} isAnimationActive={false} dot={false} dataKey={dataKey} stroke={primaryColor} />
      {/* <Line type="monotone" isAnimationActive={false} dot={false} dataKey="sensors.sensor_2.value" stroke="#3164b5" /> */}
      <Line type={cardinal} isAnimationActive={false} dot={false} dataKey={predictionKey} stroke={secondaryColor} />
    </LineChart>
  )
}

export default Chart;

