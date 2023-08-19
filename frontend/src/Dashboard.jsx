import React, { useState } from "react";
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from "recharts";

const SensorLineChart = ({ data, sensorName }) => {
    console.log(sensorName);
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid stroke="#eee2" strokeDasharray="1 1" />
                <XAxis
                    dataKey="timestamp"
                    type="category"
                    allowDuplicatedCategory={false}
                />
                <YAxis datakey="value" />
                <Legend />
                <Line
                    type="monotone"
                    dataKey={`${sensorName}.value`}
                    name={sensorName}
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ r: 5 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

const SensorsGrid = ({ data }) => {
    const sensorNames =
        (data.sensors &&
            Object.keys(data.sensors[0])
                .filter((name) => name != "timestamp")
                .sort()) ||
        [];
    const [visibleSensors, setVisibleSensors] = useState(sensorNames);

    const handleSensorToggle = (sensorName) => {
        if (visibleSensors.includes(sensorName)) {
            setVisibleSensors(
                visibleSensors.filter((name) => name !== sensorName).sort()
            );
        } else {
            setVisibleSensors([...visibleSensors, sensorName].sort());
        }
    };

    return (
        <div>
            <div>
                {sensorNames.map((sensorName) => (
                    <label key={sensorName}>
                        <input
                            value={sensorName}
                            type="checkbox"
                            checked={visibleSensors.includes(sensorName)}
                            onChange={() => handleSensorToggle(sensorName)}
                        />
                        {sensorName}
                    </label>
                ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
                {visibleSensors.map((sensorName) => (
                    <SensorLineChart
                        key={sensorName}
                        data={data.sensors}
                        sensorName={sensorName}
                    />
                ))}
            </div>
        </div>
    );
};

const Dashboard = () => {
    const sensorData = {
        simulation_model: "naive",
        timestamp: "2023-08-19T16:48:10.977452",
        sensors: [
            {
                timestamp: "2023-08-19T16:48:10",
                sensor_0: { value: 7.23203574083519 },
                sensor_1: { value: 0 },
                sensor_2: { value: 0.4509955643059914 },
            },
            {
                timestamp: "2023-08-19T16:49:10",
                sensor_0: { value: 7.43203574083519 },
                sensor_1: { value: 1 },
                sensor_2: { value: 0.6509955643059914 },
            },
            {
                timestamp: "2023-08-19T16:50:10",
                sensor_0: { value: 7.43203574083519 },
                sensor_1: { value: 1 },
                sensor_2: { value: 0.6509955643059914 },
            },
            // Add more data points here...
        ],
    };

    return (
        <div>
            <h1>Sensors Data</h1>
            <SensorsGrid data={sensorData} />
        </div>
    );
};

export default Dashboard;
