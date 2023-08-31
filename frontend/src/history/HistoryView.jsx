import { Button, Grid } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import axios from "axios"; // Make sure to install axios package
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"; // Import Recharts components
import SensorSelect from "../comparison/SensorSelect";
import { PRIMARY_COLOR, darkTheme } from "../themes";
import GranulationSelect from "./GranulationSelect";

const HistoryView = () => {
    const [data, setData] = useState([]);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [selectedSensor, setSelectedSensor] = useState("");
    const [selectedMethod, setSelectedMethod] = useState("");

    useEffect(() => {
        const someTimeAgo = new Date();
        someTimeAgo.setMinutes(someTimeAgo.getMinutes() - 60);
        setFromDate(dayjs(someTimeAgo));
        setToDate(dayjs(new Date()));
    }, []);

    const onConfirm = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8000/api/sensor_reads/`,
                {
                    params: {
                        dimension__name: selectedSensor,
                        timestamp__gte: fromDate.toISOString(),
                        timestamp__lte: toDate.toISOString(),
                        granulation_method: selectedMethod,
                    },
                }
            );
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <h1>History</h1>
            <Grid container>
                <Grid item xs={6} md={3}>
                    <DateTimePicker
                        label="Pick a Date & Time"
                        value={fromDate}
                        onChange={setFromDate}
                    />
                </Grid>
                <Grid item xs={6} md={3}>
                    <DateTimePicker
                        label="Pick a Date & Time"
                        value={toDate}
                        onChange={setToDate}
                    />
                </Grid>
                <Grid item xs={6} md={1}>
                    <SensorSelect
                        selectedSensor={selectedSensor}
                        setSelectedSensor={setSelectedSensor}
                    />
                </Grid>
                <Grid item xs={6} md={2}>
                    <GranulationSelect
                        selectedMethod={selectedMethod}
                        setSelectedMethod={setSelectedMethod}
                    />
                </Grid>
                <Grid item xs={6} md={2}>
                    <Button variant="contained" onClick={onConfirm}>
                        Confirm
                    </Button>
                </Grid>
            </Grid>
            <ResponsiveContainer width="100%" height={800}>
                <LineChart data={data} margin={{ right: 25, top: 10 }}>
                    <XAxis dataKey="timestamp" angle={-20} />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="value"
                        name="Sensor data"
                        stroke={PRIMARY_COLOR}
                        isAnimationActive={false}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </ThemeProvider>
    );
};

export default HistoryView;
