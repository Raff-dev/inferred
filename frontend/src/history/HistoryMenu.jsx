import { Button, Grid } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import axios from "axios"; // Make sure to install axios package
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import SensorSelect from "../comparison/SensorSelect";
import GranulationSelect from "./GranulationSelect";

const HistoryMenu = ({ setData }) => {
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [selectedSensor, setSelectedSensor] = useState("");
    const [selectedMethod, setSelectedMethod] = useState("");

    useEffect(() => {
        const someTimeAgo = new Date();
        someTimeAgo.setMinutes(someTimeAgo.getMinutes() - 60 * 12);
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
    );
};

export default HistoryMenu;
