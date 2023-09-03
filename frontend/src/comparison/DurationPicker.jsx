import {
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import React, { useState } from "react";
import { DURATION_VALUES } from "../constants";

const DurationPicker = ({ onConfirm }) => {
    const values = Object.keys(DURATION_VALUES);
    const defaultDuration = values[values.length - 1];
    const currentDate = dayjs(Date.now() - defaultDuration * 1000);

    const [selectedDate, setSelectedDate] = useState(currentDate);
    const [selectedDuration, setSelectedDuration] = useState(defaultDuration);

    const handleDurationChange = (event) => {
        setSelectedDuration(event.target.value);
    };

    const handleConfirm = () => {
        const isoDate = selectedDate.toISOString();
        onConfirm(isoDate, selectedDuration);
    };

    return (
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
                <DateTimePicker
                    label="Pick a Date & Time"
                    value={selectedDate}
                    onChange={(newValue) => setSelectedDate(newValue)}
                />
            </Grid>
            <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                    <InputLabel>Duration</InputLabel>
                    <Select
                        value={selectedDuration}
                        onChange={handleDurationChange}
                    >
                        {Object.entries(DURATION_VALUES).map(
                            ([value, label]) => (
                                <MenuItem key={value} value={value}>
                                    {label}
                                </MenuItem>
                            )
                        )}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
                <Button variant="contained" onClick={handleConfirm} fullWidth>
                    Confirm
                </Button>
            </Grid>
        </Grid>
    );
};

export default DurationPicker;
