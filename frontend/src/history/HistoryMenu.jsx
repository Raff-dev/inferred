import { Button, Grid } from "@mui/material";
import FormControl from "@mui/material/FormControl";
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
        <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
            spacing={3}
        >
            <Grid container spacing={2} item>
                <Grid item>
                    <DateTimePicker
                        label="Start date & time"
                        value={fromDate}
                        onChange={setFromDate}
                    />
                </Grid>
                <Grid item>
                    <DateTimePicker
                        label="End date & time"
                        value={toDate}
                        onChange={setToDate}
                    />
                </Grid>
                <Grid item>
                    <SensorSelect
                        selectedSensor={selectedSensor}
                        setSelectedSensor={setSelectedSensor}
                    />
                </Grid>
                <Grid item>
                    <GranulationSelect
                        selectedMethod={selectedMethod}
                        setSelectedMethod={setSelectedMethod}
                    />
                </Grid>
            </Grid>
            <Grid item>
                <FormControl sx={{ width: 160 }}>
                    <Button variant="contained" onClick={onConfirm}>
                        Confirm
                    </Button>
                </FormControl>
            </Grid>
        </Grid>
    );
};

export default HistoryMenu;
