import { Button, Grid } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { API } from "../constants";
import DataSelect from "../utils/DataSelect";
import GranulationParamSelect from "./GranulationParamSelect";

const HistoryMenu = ({ setData, setPredictionData }) => {
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [selectedSensor, setSelectedSensor] = useState("");
    const [selectedMethod, setSelectedMethod] = useState("");
    const [selectedParam, setSelectedParam] = useState("");
    const [selectedModel, setSelectedModel] = useState("");

    useEffect(() => {
        const someTimeAgo = new Date();
        someTimeAgo.setMinutes(someTimeAgo.getMinutes() - 60 * 12);
        setFromDate(dayjs(someTimeAgo));
        setToDate(dayjs(new Date()));
    }, []);

    const onConfirmSetData = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8000/api/sensor_reads/`,
                {
                    params: {
                        dimension__name: selectedSensor,
                        timestamp__gte: fromDate.toISOString(),
                        timestamp__lte: toDate.toISOString(),
                        granulation_method: selectedMethod,
                        param: selectedParam,
                    },
                }
            );
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const onConfirmSetPredictionData = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8000/api/prediction_timeline/`,
                {
                    params: {
                        simulation_model: "naive",
                        dimension: selectedSensor,
                        from_timestamp: fromDate.toISOString(),
                        to_timestamp: toDate.toISOString(),
                    },
                }
            );
            setPredictionData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const onConfirm = async () => {
        onConfirmSetData();
        onConfirmSetPredictionData();
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
                    <DataSelect
                        selected={selectedSensor}
                        setSelected={setSelectedSensor}
                        path={API.dimensions}
                        label="Dimension"
                    />
                </Grid>
                <Grid item>
                    <DataSelect
                        selected={selectedMethod}
                        setSelected={setSelectedMethod}
                        path={API.granulation_methods}
                        label="Granulation method"
                    />
                </Grid>
                <Grid item>
                    <GranulationParamSelect
                        selectedMethod={selectedMethod}
                        selectedParam={selectedParam}
                        setSelectedParam={setSelectedParam}
                    />
                </Grid>
                <Grid item>
                    <DataSelect
                        selected={selectedModel}
                        setSelected={setSelectedModel}
                        path={API.simulation_models}
                        label="Simulation model"
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
