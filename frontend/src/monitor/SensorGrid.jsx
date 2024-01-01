import { Chip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { SensorLineChart } from "./SensorLineChart";

const SensorGrid = ({ data, sensorNames }) => {
    const [visibleSensors, setVisibleSensors] = useState(sensorNames);

    useEffect(() => {
        setVisibleSensors(sensorNames);
    }, [sensorNames]);

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
                    <Chip
                        key={sensorName}
                        label={sensorName}
                        value={sensorName}
                        variant={
                            visibleSensors.includes(sensorName)
                                ? "filled"
                                : "outlined"
                        }
                        onClick={() => handleSensorToggle(sensorName)}
                        style={{ margin: "4px" }}
                    />
                ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
                {visibleSensors.map((sensorName) => (
                    <SensorLineChart
                        key={sensorName}
                        data={data}
                        sensorName={sensorName}
                    />
                ))}
            </div>
        </div>
    );
};

export default SensorGrid;
